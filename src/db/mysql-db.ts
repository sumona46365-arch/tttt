import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import pg from 'pg';
import dns from 'dns';
import { promisify } from 'util';
import logger from '../lib/logger.ts';
import { getSafeDatabase } from './sqlite-factory.ts';

const lookup = promisify(dns.lookup);

let postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_URL;
let isPg = Boolean(postgresUrl || process.env.USE_POSTGRES === 'true');

export async function updatePostgresConfig(newUrl: string) {
  logger.info("Updating PostgreSQL configuration...");
  try {
    if (pgPool) {
      await pgPool.end();
    }
    
    postgresUrl = newUrl;
    isPg = true;
    usePg = true;
    
    const connectionString = parseAndFixPgUrl(newUrl);
    const sslConfig = (connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') || connectionString.includes('supabase') || process.env.PGSSL === 'true')
      ? { rejectUnauthorized: false }
      : false;

    pgPool = new pg.Pool({
      connectionString,
      ssl: sslConfig,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    await pgPool.query('SELECT 1');
    await initPgTables(pgPool);
    logger.info("✅ PostgreSQL reconnected successfully with new configuration!");
    return { success: true };
  } catch (err: any) {
    logger.error("Failed to update PostgreSQL config: " + err.message);
    return { success: false, error: err.message };
  }
}

// Helper to check DNS resolution
async function checkDns(hostname: string) {
  try {
    const result = await lookup(hostname);
    logger.info(`DNS check for ${hostname}: Success (${result.address})`);
    return true;
  } catch (err: any) {
    logger.warn(`DNS check for ${hostname} FAILED: ${err.message}. This is normal if running in development or preview environments.`);
    return false;
  }
}

let pgPool: pg.Pool | null = null;
let sqliteDb: Database.Database | null = null;
const statementCache = new Map<string, any>();

class Mutex {
  private mutex = Promise.resolve();
  lock(): Promise<() => void> {
    let begin: (unlock: () => void) => void;
    const waiter = new Promise<() => void>(res => {
      begin = (unlock: () => void) => res(unlock);
    });
    this.mutex = this.mutex.then(() => new Promise(res => {
      begin(res);
    }));
    return waiter;
  }
}
const dbMutex = new Mutex();

function convertSqlForPg(sql: string): string {
  // Convert double-quoted string literals like "won" or "withdrawal" or "active" to single quotes 'won'
  let normalizedSql = sql.replace(/"([a-zA-Z0-9_\-\s]+)"/g, (match, p1) => {
    // If it's a known PG keyword or column name like "openTime", keep double quotes
    if (p1 === 'openTime' || p1 === 'closeTime') return match;
    return `'${p1}'`;
  });

  // Handle SQLite INSERT OR IGNORE -> PostgreSQL ON CONFLICT DO NOTHING
  let isInsertOrIgnore = false;
  if (/^\s*INSERT\s+OR\s+IGNORE\s+INTO/i.test(normalizedSql)) {
    normalizedSql = normalizedSql.replace(/^\s*INSERT\s+OR\s+IGNORE\s+INTO/i, 'INSERT INTO');
    isInsertOrIgnore = true;
  }

  // Handle SQLite functions
  normalizedSql = normalizedSql
    .replace(/datetime\('now'\)/gi, 'NOW()')
    .replace(/IFNULL\(/gi, 'COALESCE(');

  let paramIndex = 1;
  let inString = false;
  let stringChar = '';
  let result = '';
  for (let i = 0; i < normalizedSql.length; i++) {
    const char = normalizedSql[i];
    if ((char === "'" || char === '"') && (i === 0 || normalizedSql[i - 1] !== '\\')) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
      }
      result += char;
    } else if (char === '?' && !inString) {
      result += `$${paramIndex++}`;
    } else {
      result += char;
    }
  }

  if (isInsertOrIgnore && !/ON\s+CONFLICT/i.test(result)) {
    result += ' ON CONFLICT DO NOTHING';
  }

  return result;
}

async function initPgTables(pool: pg.Pool) {
  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS market_settings (
      pair VARCHAR(100) PRIMARY KEY,
      hidden INT DEFAULT 0,
      payout INT DEFAULT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      uid VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL,
      display_name VARCHAR(255),
      nickname VARCHAR(255),
      photo_url TEXT,
      password_hash TEXT,
      real_balance NUMERIC DEFAULT 0.00,
      demo_balance NUMERIC DEFAULT 10000.00,
      currency VARCHAR(50) DEFAULT 'USD',
      tfa_enabled INT DEFAULT 0,
      tfa_mode VARCHAR(50) DEFAULT 'app',
      tfa_secret TEXT,
      is_verified INT DEFAULT 0,
      is_email_verified INT DEFAULT 0,
      is_nid_verified INT DEFAULT 0,
      nid_number VARCHAR(100),
      is_admin INT DEFAULT 0,
      phone VARCHAR(50),
      country VARCHAR(100),
      country_code VARCHAR(20),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      gender VARCHAR(20),
      dob VARCHAR(50),
      status VARCHAR(50) DEFAULT 'Standard',
      kyc_status VARCHAR(50) DEFAULT 'unverified',
      referred_by_uid VARCHAR(255),
      referral_code VARCHAR(100),
      referral_sub_id VARCHAR(100),
      referral_type VARCHAR(100),
      affiliate_balance NUMERIC DEFAULT 0.00,
      total_affiliate_earnings NUMERIC DEFAULT 0.00,
      referral_count INT DEFAULT 0,
      custom_affiliate_share INT,
      withdrawal_otp VARCHAR(100),
      withdrawal_otp_expires_at BIGINT,
      total_live_volume NUMERIC DEFAULT 0.00,
      smart_mode_enabled INT DEFAULT 0,
      smart_mode_strategy VARCHAR(100) DEFAULT 'auto_25_percent',
      manipulation_mode VARCHAR(100) DEFAULT 'neutral',
      updated_at BIGINT,
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS tournaments (
      id VARCHAR(255) PRIMARY KEY,
      type VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      banner_url TEXT,
      prize_pool NUMERIC DEFAULT 0,
      entry_fee NUMERIC DEFAULT 0,
      min_players INT DEFAULT 1,
      max_players INT DEFAULT 0,
      start_time BIGINT NOT NULL,
      end_time BIGINT NOT NULL,
      status VARCHAR(50) DEFAULT 'scheduled',
      is_locked INT DEFAULT 0,
      requirements TEXT,
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS tournament_participants (
      tournament_id VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      score NUMERIC DEFAULT 0,
      rank INT,
      joined_at BIGINT,
      PRIMARY KEY (tournament_id, user_id)
    );`,
    `CREATE TABLE IF NOT EXISTS tournament_prizes (
      id SERIAL PRIMARY KEY,
      tournament_id VARCHAR(255) NOT NULL,
      rank_from INT NOT NULL,
      rank_to INT NOT NULL,
      prize_amount NUMERIC NOT NULL,
      prize_type VARCHAR(50) DEFAULT 'fixed'
    );`,
    `CREATE TABLE IF NOT EXISTS leaderboard_stats (
      user_id VARCHAR(255) PRIMARY KEY,
      total_profit NUMERIC DEFAULT 0,
      total_trades INT DEFAULT 0,
      won_trades INT DEFAULT 0,
      lost_trades INT DEFAULT 0,
      draw_trades INT DEFAULT 0,
      total_volume NUMERIC DEFAULT 0,
      current_streak INT DEFAULT 0,
      max_streak INT DEFAULT 0,
      roi NUMERIC DEFAULT 0,
      last_trade_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS trades (
      id SERIAL PRIMARY KEY,
      firebase_id VARCHAR(255),
      user_id VARCHAR(255) NOT NULL,
      market_id VARCHAR(255) NOT NULL,
      asset VARCHAR(255),
      amount NUMERIC NOT NULL,
      direction VARCHAR(50) NOT NULL,
      type VARCHAR(50),
      entry_price NUMERIC NOT NULL,
      exit_price NUMERIC,
      duration INT NOT NULL,
      time_left INT,
      expiry_time BIGINT NOT NULL,
      expiration_time VARCHAR(255),
      is_demo INT DEFAULT 1,
      account_type VARCHAR(50) DEFAULT 'demo',
      tournament_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'open',
      payout_amount NUMERIC,
      payout VARCHAR(100),
      settled_at BIGINT,
      updated_at BIGINT,
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      amount NUMERIC NOT NULL,
      currency VARCHAR(50) DEFAULT 'USD',
      status VARCHAR(50) DEFAULT 'pending',
      method VARCHAR(100) DEFAULT 'direct',
      tx_hash TEXT,
      details TEXT,
      order_id VARCHAR(255),
      updated_at BIGINT,
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      amount NUMERIC DEFAULT 0,
      old_balance NUMERIC DEFAULT 0,
      new_balance NUMERIC DEFAULT 0,
      reference_id VARCHAR(255),
      details TEXT,
      ip_address VARCHAR(100),
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS system_backups (
      id VARCHAR(255) PRIMARY KEY,
      timestamp BIGINT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      size BIGINT NOT NULL,
      status VARCHAR(50) NOT NULL,
      tables_count INT NOT NULL,
      created_by VARCHAR(255) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS login_history (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      ip_address VARCHAR(100),
      user_agent TEXT,
      status VARCHAR(50) DEFAULT 'success',
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS kyc_requests (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      full_name VARCHAR(255),
      document_type VARCHAR(100),
      document_number VARCHAR(100),
      front_image TEXT,
      back_image TEXT,
      selfie_image TEXT,
      rejection_reason TEXT,
      updated_at BIGINT,
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS tickets (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      user_name VARCHAR(255),
      user_email VARCHAR(255),
      subject VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      message TEXT NOT NULL,
      last_message TEXT,
      status VARCHAR(50) DEFAULT 'open',
      priority VARCHAR(50) DEFAULT 'medium',
      assigned_agent_id VARCHAR(255),
      assigned_agent_name VARCHAR(255),
      assigned_agent_email VARCHAR(255),
      channel VARCHAR(50) DEFAULT 'chat',
      rating INT,
      rating_feedback TEXT,
      is_ai_handled INT DEFAULT 1,
      closed_at BIGINT,
      first_response_at BIGINT,
      resolved_at BIGINT,
      updated_at BIGINT,
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS ticket_messages (
      id VARCHAR(255) PRIMARY KEY,
      ticket_id VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      sender_type VARCHAR(50) DEFAULT 'user',
      sender_name VARCHAR(255),
      message TEXT NOT NULL,
      attachments TEXT,
      is_internal_note INT DEFAULT 0,
      is_read INT DEFAULT 0,
      is_admin INT DEFAULT 0,
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS support_canned_responses (
      id VARCHAR(255) PRIMARY KEY,
      shortcut VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      content TEXT NOT NULL,
      created_by VARCHAR(255),
      created_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS agent_profiles (
      user_id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      role VARCHAR(50) DEFAULT 'support_agent',
      is_online INT DEFAULT 1,
      max_chats INT DEFAULT 5,
      active_chats_count INT DEFAULT 0,
      last_active_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS active_copies (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      master_id VARCHAR(255) NOT NULL,
      master_name VARCHAR(255),
      country VARCHAR(100),
      amount NUMERIC,
      max_trade_amount NUMERIC DEFAULT 10,
      trades_limit INT,
      stop_loss NUMERIC,
      take_profit NUMERIC,
      current_profit NUMERIC DEFAULT 0,
      win_rate NUMERIC DEFAULT 0,
      copied_trades INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'active',
      started_at BIGINT
    );`,
    `CREATE TABLE IF NOT EXISTS master_traders (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      country VARCHAR(100),
      win_rate NUMERIC,
      profit NUMERIC,
      followers INT
    );`,
    `CREATE TABLE IF NOT EXISTS candles (
      id SERIAL PRIMARY KEY,
      pair VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      time BIGINT NOT NULL,
      open NUMERIC NOT NULL,
      high NUMERIC NOT NULL,
      low NUMERIC NOT NULL,
      close NUMERIC NOT NULL,
      volume NUMERIC NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS historical_candles (
      id SERIAL PRIMARY KEY,
      market VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      timeframe VARCHAR(50) NOT NULL,
      open NUMERIC NOT NULL,
      high NUMERIC NOT NULL,
      low NUMERIC NOT NULL,
      close NUMERIC NOT NULL,
      volume NUMERIC NOT NULL,
      "openTime" BIGINT NOT NULL,
      "closeTime" BIGINT NOT NULL
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS pair_type_time_idx ON candles (pair, type, time);`,
    `CREATE INDEX IF NOT EXISTS trades_user_id_idx ON trades (user_id);`,
    `CREATE INDEX IF NOT EXISTS trades_settled_at_idx ON trades (settled_at);`,
    `CREATE INDEX IF NOT EXISTS trades_status_idx ON trades (status);`,
    `CREATE INDEX IF NOT EXISTS active_copies_user_id_idx ON active_copies (user_id);`,
    `CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions (user_id);`,
    `CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs (user_id);`,
    `CREATE INDEX IF NOT EXISTS login_history_user_id_idx ON login_history (user_id);`
  ];

  for (const statement of ddlStatements) {
    try {
      await pool.query(statement);
    } catch (e: any) {
      logger.warn('Pg table init statement warning: ' + e.message);
    }
  }

  const addPgColIfMissing = async (table: string, colName: string, colDef: string) => {
    try {
      await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${colName} ${colDef}`);
    } catch (e) {}
  };

  await addPgColIfMissing('tickets', 'user_name', 'VARCHAR(255)');
  await addPgColIfMissing('audit_logs', 'action', 'VARCHAR(255)');
  await addPgColIfMissing('audit_logs', 'entity_type', 'VARCHAR(100)');
  await addPgColIfMissing('audit_logs', 'entity_id', 'VARCHAR(255)');
  await addPgColIfMissing('tickets', 'user_email', 'VARCHAR(255)');
  await addPgColIfMissing('tickets', 'category', "VARCHAR(100) DEFAULT 'General'");
  await addPgColIfMissing('tickets', 'assigned_agent_id', 'VARCHAR(255)');
  await addPgColIfMissing('tickets', 'assigned_agent_name', 'VARCHAR(255)');
  await addPgColIfMissing('tickets', 'assigned_agent_email', 'VARCHAR(255)');
  await addPgColIfMissing('tickets', 'channel', "VARCHAR(50) DEFAULT 'chat'");
  await addPgColIfMissing('tickets', 'rating', 'INT');
  await addPgColIfMissing('tickets', 'rating_feedback', 'TEXT');
  await addPgColIfMissing('tickets', 'is_ai_handled', 'INT DEFAULT 1');
  await addPgColIfMissing('tickets', 'closed_at', 'BIGINT');
  await addPgColIfMissing('tickets', 'first_response_at', 'BIGINT');
  await addPgColIfMissing('tickets', 'resolved_at', 'BIGINT');

  await addPgColIfMissing('users', 'first_name', 'VARCHAR(100)');
  await addPgColIfMissing('users', 'last_name', 'VARCHAR(100)');
  await addPgColIfMissing('users', 'gender', 'VARCHAR(20)');
  await addPgColIfMissing('users', 'dob', 'VARCHAR(50)');
  await addPgColIfMissing('users', 'smart_mode_enabled', 'INT DEFAULT 0');
  await addPgColIfMissing('users', 'smart_mode_strategy', "VARCHAR(100) DEFAULT 'auto_25_percent'");
  await addPgColIfMissing('users', 'manipulation_mode', "VARCHAR(100) DEFAULT 'neutral'");
  await addPgColIfMissing('users', 'nickname', 'VARCHAR(255)');
  await addPgColIfMissing('users', 'password_hash', 'TEXT');
  await addPgColIfMissing('users', 'country_code', 'VARCHAR(20)');
  await addPgColIfMissing('users', 'is_email_verified', 'INT DEFAULT 0');
  await addPgColIfMissing('users', 'is_nid_verified', 'INT DEFAULT 0');
  await addPgColIfMissing('users', 'nid_number', 'VARCHAR(100)');
  await addPgColIfMissing('users', 'referral_sub_id', 'VARCHAR(100)');
  await addPgColIfMissing('users', 'referral_type', 'VARCHAR(100)');

  await addPgColIfMissing('transactions', 'order_id', 'VARCHAR(255)');

  await addPgColIfMissing('ticket_messages', 'sender_type', "VARCHAR(50) DEFAULT 'user'");
  await addPgColIfMissing('ticket_messages', 'sender_name', 'VARCHAR(255)');
  await addPgColIfMissing('ticket_messages', 'attachments', 'TEXT');
  await addPgColIfMissing('ticket_messages', 'is_internal_note', 'INT DEFAULT 0');
  await addPgColIfMissing('ticket_messages', 'is_read', 'INT DEFAULT 0');

  try {
    // Only promote if not already an admin to reduce database writes on startup
    await pool.query("UPDATE users SET is_admin = 1 WHERE email IN ($1, $2, $3) AND (is_admin IS NULL OR is_admin = 0)", ['hasan1@gmail.com', 'hasan@gmail.com', 'msbivaax@gmail.com']);
  } catch (e: any) {
    logger.error("Admin promotion query failed on pg: " + e.message);
  }
}

function initSqliteTables(db: Database.Database) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS market_settings (
    pair TEXT PRIMARY KEY,
    hidden INTEGER DEFAULT 0,
    payout INTEGER DEFAULT NULL
  );
  `);

  try { db.exec("ALTER TABLE market_settings ADD COLUMN payout INTEGER DEFAULT NULL"); } catch (e) {}

  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    display_name TEXT,
    nickname TEXT,
    photo_url TEXT,
    password_hash TEXT,
    real_balance NUMERIC DEFAULT '0.00',
    demo_balance NUMERIC DEFAULT '10000.00',
    currency TEXT DEFAULT 'USD',
    tfa_enabled INTEGER DEFAULT 0,
    tfa_mode TEXT DEFAULT 'app',
    tfa_secret TEXT,
    is_verified INTEGER DEFAULT 0,
    is_email_verified INTEGER DEFAULT 0,
    is_nid_verified INTEGER DEFAULT 0,
    nid_number TEXT,
    is_admin INTEGER DEFAULT 0,
    phone TEXT,
    country TEXT,
    country_code TEXT,
    first_name TEXT,
    last_name TEXT,
    gender TEXT,
    dob TEXT,
    status TEXT DEFAULT 'Standard',
    kyc_status TEXT DEFAULT 'unverified',
    referred_by_uid TEXT,
    referral_code TEXT,
    referral_sub_id TEXT,
    referral_type TEXT,
    affiliate_balance NUMERIC DEFAULT '0.00',
    total_affiliate_earnings NUMERIC DEFAULT '0.00',
    referral_count INTEGER DEFAULT 0,
    custom_affiliate_share INTEGER,
    withdrawal_otp TEXT,
    withdrawal_otp_expires_at INTEGER,
    total_live_volume NUMERIC DEFAULT '0.00',
    updated_at INTEGER,
    created_at INTEGER
  );`);

  try { db.exec("ALTER TABLE users ADD COLUMN first_name TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN last_name TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN gender TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN dob TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN smart_mode_enabled INTEGER DEFAULT 0;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN smart_mode_strategy TEXT DEFAULT 'auto_25_percent';"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN manipulation_mode TEXT DEFAULT 'neutral';"); } catch (e) {}

  db.exec(`
  CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    banner_url TEXT,
    prize_pool NUMERIC DEFAULT 0,
    entry_fee NUMERIC DEFAULT 0,
    min_players INTEGER DEFAULT 1,
    max_players INTEGER DEFAULT 0,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    status TEXT DEFAULT 'scheduled',
    is_locked INTEGER DEFAULT 0,
    requirements TEXT,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS tournament_participants (
    tournament_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    score NUMERIC DEFAULT 0,
    rank INTEGER,
    joined_at INTEGER,
    PRIMARY KEY (tournament_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS tournament_prizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id TEXT NOT NULL,
    rank_from INTEGER NOT NULL,
    rank_to INTEGER NOT NULL,
    prize_amount NUMERIC NOT NULL,
    prize_type TEXT DEFAULT 'fixed'
  );

  CREATE TABLE IF NOT EXISTS leaderboard_stats (
    user_id TEXT PRIMARY KEY,
    total_profit NUMERIC DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    won_trades INTEGER DEFAULT 0,
    lost_trades INTEGER DEFAULT 0,
    draw_trades INTEGER DEFAULT 0,
    total_volume NUMERIC DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    roi NUMERIC DEFAULT 0,
    last_trade_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firebase_id TEXT,
    user_id TEXT NOT NULL,
    market_id TEXT NOT NULL,
    asset TEXT,
    amount NUMERIC NOT NULL,
    direction TEXT NOT NULL,
    type TEXT,
    entry_price NUMERIC NOT NULL,
    exit_price NUMERIC,
    duration INTEGER NOT NULL,
    time_left INTEGER,
    expiry_time INTEGER NOT NULL,
    expiration_time TEXT,
    is_demo INTEGER DEFAULT 1,
    account_type TEXT DEFAULT 'demo',
    tournament_id TEXT,
    status TEXT DEFAULT 'open',
    payout_amount NUMERIC,
    payout TEXT,
    settled_at INTEGER,
    updated_at INTEGER,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    method TEXT DEFAULT 'direct',
    tx_hash TEXT,
    details TEXT,
    updated_at INTEGER,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS system_backups (
    id TEXT PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    status TEXT NOT NULL,
    tables_count INTEGER NOT NULL,
    created_by TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS login_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'success',
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS kyc_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    full_name TEXT,
    document_type TEXT,
    document_number TEXT,
    front_image TEXT,
    back_image TEXT,
    selfie_image TEXT,
    rejection_reason TEXT,
    updated_at INTEGER,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT,
    user_email TEXT,
    subject TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    message TEXT NOT NULL,
    last_message TEXT,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    assigned_agent_id TEXT,
    assigned_agent_name TEXT,
    assigned_agent_email TEXT,
    channel TEXT DEFAULT 'chat',
    rating INTEGER,
    rating_feedback TEXT,
    is_ai_handled INTEGER DEFAULT 1,
    closed_at INTEGER,
    first_response_at INTEGER,
    resolved_at INTEGER,
    updated_at INTEGER,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    sender_type TEXT DEFAULT 'user',
    sender_name TEXT,
    message TEXT NOT NULL,
    attachments TEXT,
    is_internal_note INTEGER DEFAULT 0,
    is_read INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS support_canned_responses (
    id TEXT PRIMARY KEY,
    shortcut TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    content TEXT NOT NULL,
    created_by TEXT,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS agent_profiles (
    user_id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'support_agent',
    is_online INTEGER DEFAULT 1,
    max_chats INTEGER DEFAULT 5,
    active_chats_count INTEGER DEFAULT 0,
    last_active_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS active_copies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    master_id TEXT NOT NULL,
    master_name TEXT,
    country TEXT,
    amount NUMERIC,
    max_trade_amount NUMERIC DEFAULT 10,
    trades_limit INTEGER,
    stop_loss NUMERIC,
    take_profit NUMERIC,
    current_profit NUMERIC DEFAULT 0,
    win_rate NUMERIC DEFAULT 0,
    copied_trades INTEGER DEFAULT 0,
    status TEXT DEFAULT "active",
    started_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS master_traders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT,
    win_rate NUMERIC,
    profit NUMERIC,
    followers INTEGER
  );

  CREATE TABLE IF NOT EXISTS candles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pair TEXT NOT NULL,
    type TEXT NOT NULL,
    time INTEGER NOT NULL,
    open NUMERIC NOT NULL,
    high NUMERIC NOT NULL,
    low NUMERIC NOT NULL,
    close NUMERIC NOT NULL,
    volume NUMERIC NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS pair_type_time_idx ON candles (pair, type, time);
  CREATE INDEX IF NOT EXISTS trades_user_id_idx ON trades (user_id);
  CREATE INDEX IF NOT EXISTS trades_settled_at_idx ON trades (settled_at);
  CREATE INDEX IF NOT EXISTS trades_status_idx ON trades (status);
  CREATE INDEX IF NOT EXISTS active_copies_user_id_idx ON active_copies (user_id);
  CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions (user_id);
  CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs (user_id);
  CREATE INDEX IF NOT EXISTS login_history_user_id_idx ON login_history (user_id);
  CREATE TABLE IF NOT EXISTS historical_candles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market TEXT NOT NULL,
    type TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    open NUMERIC NOT NULL,
    high NUMERIC NOT NULL,
    low NUMERIC NOT NULL,
    close NUMERIC NOT NULL,
    volume NUMERIC NOT NULL,
    openTime INTEGER NOT NULL,
    closeTime INTEGER NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS historical_candles_unique_idx ON historical_candles (market, type, timeframe, openTime);
  CREATE INDEX IF NOT EXISTS historical_candles_lookup_idx ON historical_candles (market, type, timeframe, openTime DESC);
  `);

  try {
    db.prepare("UPDATE users SET is_admin = 1 WHERE email = ?").run('hasan1@gmail.com');
    db.prepare("UPDATE users SET is_admin = 1 WHERE email = ?").run('hasan@gmail.com');
    db.prepare("UPDATE users SET is_admin = 1 WHERE email = ?").run('msbivaax@gmail.com');
    logger.info("Successfully forced admin promotion on startup");
  } catch (e: any) {
    logger.error("Admin promotion query failed on startup: " + e.message);
  }

  const addColIfMissing = (table: string, colDef: string) => {
    try {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${colDef}`);
    } catch (e) {}
  };

  const addIndexIfMissing = (name: string, table: string, cols: string) => {
    try {
      db.exec(`CREATE INDEX IF NOT EXISTS ${name} ON ${table} (${cols})`);
    } catch (e) {}
  };

  addIndexIfMissing('trades_user_id_idx', 'trades', 'user_id');
  addColIfMissing('tickets', 'user_name TEXT');
  addColIfMissing('tickets', 'user_email TEXT');
  addColIfMissing('tickets', "category TEXT DEFAULT 'General'");
  addColIfMissing('tickets', 'assigned_agent_id TEXT');
  addColIfMissing('tickets', 'assigned_agent_name TEXT');
  addColIfMissing('tickets', 'assigned_agent_email TEXT');
  addColIfMissing('tickets', "channel TEXT DEFAULT 'chat'");
  addColIfMissing('tickets', 'rating INTEGER');
  addColIfMissing('tickets', 'rating_feedback TEXT');
  addColIfMissing('tickets', 'is_ai_handled INTEGER DEFAULT 1');
  addColIfMissing('tickets', 'closed_at INTEGER');
  addColIfMissing('tickets', 'first_response_at INTEGER');
  addColIfMissing('tickets', 'resolved_at INTEGER');
  addColIfMissing('users', 'nickname TEXT');
  addColIfMissing('users', 'password_hash TEXT');
  addColIfMissing('users', 'country_code TEXT');
  addColIfMissing('users', 'is_email_verified INTEGER DEFAULT 0');
  addColIfMissing('users', 'is_nid_verified INTEGER DEFAULT 0');
  addColIfMissing('users', 'nid_number TEXT');
  addColIfMissing('users', 'referral_sub_id TEXT');
  addColIfMissing('users', 'referral_type TEXT');
  addColIfMissing('transactions', 'order_id TEXT');

  addColIfMissing('ticket_messages', "sender_type TEXT DEFAULT 'user'");
  addColIfMissing('ticket_messages', 'sender_name TEXT');
  addColIfMissing('ticket_messages', 'attachments TEXT');
  addColIfMissing('ticket_messages', 'is_internal_note INTEGER DEFAULT 0');
  addColIfMissing('ticket_messages', 'is_read INTEGER DEFAULT 0');
}

function parseAndFixPgUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  let url = rawUrl.trim();
  // Remove surrounding quotes if any
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.substring(1, url.length - 1);
  }

  try {
    // Standard URL parser is better at handling components, but doesn't support postgresql:// directly in all environments
    // So we use a more robust regex that identifies the host part by searching for the LAST @ before the host:port part
    const match = url.match(/^(postgres(?:ql)?:\/\/)(.*)@([\w\.-]+(?::\d+)?\/.*)$/i);
    if (match) {
      const prefix = match[1];
      const creds = match[2];
      const suffix = match[3];
      
      // The credentials part might contain the user:pass
      // We look for the FIRST colon to separate user and pass
      const firstColonIndex = creds.indexOf(':');
      if (firstColonIndex !== -1) {
        const user = creds.substring(0, firstColonIndex);
        const pass = creds.substring(firstColonIndex + 1);
        
        // Encode both parts safely
        const encUser = encodeURIComponent(decodeURIComponent(user));
        const encPass = encodeURIComponent(decodeURIComponent(pass));
        
        const fixed = `${prefix}${encUser}:${encPass}@${suffix}`;
        
        // Extract hostname for debug logging
        const hostMatch = suffix.match(/^([\w\.-]+)/);
        if (hostMatch) {
          const hostname = hostMatch[1];
          logger.info(`Database connection attempt targeting host: ${hostname}`);
          checkDns(hostname); // Diagnostic check
        }
        
        return fixed;
      }
    }
  } catch (e: any) {
    logger.error("Error in parseAndFixPgUrl: " + e.message);
  }
  return url;
}

let usePg = isPg;

export function isUsingPostgres(): boolean {
  return usePg && !!pgPool;
}

function ensureSqliteDb() {
  if (!sqliteDb) {
    logger.info("Initializing SQLite database connection...");
    const dataDir = process.env.DATA_DIR || process.cwd();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'database.sqlite');
    sqliteDb = getSafeDatabase(dbPath);

    // Enable WAL mode
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('synchronous = NORMAL');
    sqliteDb.pragma('cache_size = -2000');
    sqliteDb.pragma('temp_store = MEMORY');
    sqliteDb.pragma('mmap_size = 30000000000');

    initSqliteTables(sqliteDb);
  }
  return sqliteDb;
}

// Only ensure SQLite if NOT in PostgreSQL mode
if (!isPg) {
  ensureSqliteDb();
}

if (isPg) {
  if (postgresUrl) {
    logger.info("Database source: Using DATABASE_URL from environment variables.");
  } else if (process.env.USE_POSTGRES === 'true') {
    logger.warn("Database source: USE_POSTGRES is true but DATABASE_URL is missing! Defaulting to fallback parameters.");
  }

  const rawConnString = postgresUrl || `postgres://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || ''}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'postgres'}`;
  const connectionString = parseAndFixPgUrl(rawConnString);
  
  // Detect if we are accidentally connecting to localhost when external DB is intended
  if (connectionString.includes('127.0.0.1') || connectionString.includes('localhost')) {
    if (process.env.USE_POSTGRES === 'true' || postgresUrl) {
      logger.error("🚨 WARNING: Application is attempting to connect to LOCALHOST (127.0.0.1) for PostgreSQL. This usually means DATABASE_URL is not set correctly in Dokploy.");
    }
  }
  
  const sslConfig = (connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') || connectionString.includes('supabase') || process.env.PGSSL === 'true')
    ? { rejectUnauthorized: false }
    : false;

  const pool = new pg.Pool({
    connectionString,
    ssl: sslConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pgPool = pool;

  // Retry connecting to PostgreSQL on startup indefinitely
  let isConnected = false;
  const connectWithRetry = async (attempt = 1) => {
    if (isConnected) return;
    let nextDelay = 3000;
    try {
      await pool.query('SELECT 1');
      isConnected = true;
      usePg = true;
      logger.info("✅ PostgreSQL connected successfully! All app data will persist in PostgreSQL.");
      await initPgTables(pool);
    } catch (err: any) {
      const isUnresolvable = err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND' || err.message.includes('getaddrinfo');
      const isRefused = err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED');
      const hostMatch = connectionString.match(/@([\w\.-]+)/);
      const host = hostMatch ? hostMatch[1] : 'unknown';
      
      if (!postgresUrl || isUnresolvable || isRefused || attempt >= 3) {
        logger.warn(`⚠️ PostgreSQL connection to "${host}" failed (${err.message}). Falling back to SQLite to ensure high availability.`);
        usePg = false;
        ensureSqliteDb();
        return; // Stop retrying postgres
      }

      logger.error(`🚨 POSTGRESQL CONNECTION ERROR: Failed to connect to host "${host}". (Attempt ${attempt}): ${err.message}`);
      
      nextDelay = 5000;
      setTimeout(() => connectWithRetry(attempt + 1), nextDelay);
    }
  };

  connectWithRetry().catch((err: any) => {
    logger.warn("PostgreSQL retry task caught error: " + err?.message);
  });
}

function isPgNetworkError(err: any): boolean {
  if (!err) return false;
  const code = err.code || '';
  const msg = err.message || '';
  return (
    code === 'EAI_AGAIN' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === '57P01' ||
    code === '28P01' ||
    msg.includes('getaddrinfo') ||
    msg.includes('connect ECONNREFUSED') ||
    msg.includes('Connection terminated') ||
    msg.includes('timeout')
  );
}

// Exported Helper Functions
export async function query(sql: string, params: any[] = [], conn?: any) {
  return legacyQuery(sql, params, conn);
}

async function legacyQuery(sql: string, params: any[] = [], conn?: any) {
  const isPgClient = conn ? (typeof conn.query === 'function') : (usePg && !!pgPool);
  if (isPgClient) {
    try {
      const pgSql = convertSqlForPg(sql);
      const client = conn || pgPool;
      const res = await client.query(pgSql, params);
      return res.rows;
    } catch (err: any) {
      if (isPgNetworkError(err)) {
        const isUnresolvable = err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND' || err.message.includes('getaddrinfo');
        if (isUnresolvable) {
          logger.warn(`⚠️ PostgreSQL host is unresolvable or network is unreachable. Falling back to SQLite permanently for this session.`);
          usePg = false;
          ensureSqliteDb();
        } else if (process.env.DATABASE_URL || process.env.USE_POSTGRES === 'true') {
           logger.error(`PostgreSQL Error: ${err.message}. SQLite fallback DISABLED to prevent data loss.`);
           throw new Error(`PostgreSQL Connection Failed: ${err.message}`);
        }
        logger.warn(`PostgreSQL network issue (${err.message}). Falling back to SQLite.`);
      } else {
        throw err;
      }
    }
  }

  const sqlite = (conn && typeof conn.prepare === 'function') ? conn : ensureSqliteDb();
  let statement = (!conn) ? statementCache.get(sql) : undefined;
  if (!statement) {
    statement = sqlite.prepare(sql);
    if (!conn) statementCache.set(sql, statement);
  }
  return statement.all(...params);
}

export async function get(sql: string, params: any[] = [], conn?: any) {
  return legacyGet(sql, params, conn);
}

async function legacyGet(sql: string, params: any[] = [], conn?: any) {
  const isPgClient = conn ? (typeof conn.query === 'function') : (usePg && !!pgPool);
  if (isPgClient) {
    try {
      const pgSql = convertSqlForPg(sql);
      const client = conn || pgPool;
      const res = await client.query(pgSql, params);
      return res.rows[0] || null;
    } catch (err: any) {
      if (isPgNetworkError(err)) {
        const isUnresolvable = err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND' || err.message.includes('getaddrinfo');
        if (isUnresolvable) {
          logger.warn(`⚠️ PostgreSQL host is unresolvable or network is unreachable. Falling back to SQLite permanently for this session.`);
          usePg = false;
          ensureSqliteDb();
        } else if (process.env.DATABASE_URL || process.env.USE_POSTGRES === 'true') {
           logger.error(`PostgreSQL Error (get): ${err.message}. SQLite fallback DISABLED.`);
           throw new Error(`PostgreSQL Connection Failed: ${err.message}`);
        }
        logger.warn(`PostgreSQL network issue (${err.message}). Falling back to SQLite.`);
      } else {
        throw err;
      }
    }
  }

  const sqlite = (conn && typeof conn.prepare === 'function') ? conn : ensureSqliteDb();
  let statement = (!conn) ? statementCache.get(sql) : undefined;
  if (!statement) {
    statement = sqlite.prepare(sql);
    if (!conn) statementCache.set(sql, statement);
  }
  return statement.get(...params);
}

export async function run(sql: string, params: any[] = [], conn?: any) {
  return legacyRun(sql, params, conn);
}

async function legacyRun(sql: string, params: any[] = [], conn?: any) {
  const isPgClient = conn ? (typeof conn.query === 'function') : (usePg && !!pgPool);
  if (isPgClient) {
    try {
      let pgSql = convertSqlForPg(sql);
      const trimmed = pgSql.trim();
      const isInsert = /^INSERT\s+/i.test(trimmed);
      const hasReturning = /RETURNING\s+/i.test(trimmed);

      if (isInsert && !hasReturning) {
        pgSql += ' RETURNING *';
      }

      const client = conn || pgPool;
      try {
        const res = await client.query(pgSql, params);
        const row = res.rows?.[0];
        const lastInsertRowid = row?.id ? Number(row.id) : (row?.uid || 0);
        return {
          lastInsertRowid,
          changes: res.rowCount || 0,
          rows: res.rows
        };
      } catch (err: any) {
        if (isInsert && !hasReturning) {
          try {
            const fallbackSql = convertSqlForPg(sql);
            const res = await client.query(fallbackSql, params);
            return {
              lastInsertRowid: 0,
              changes: res.rowCount || 0,
              rows: res.rows
            };
          } catch (innerErr: any) {
            if (isPgNetworkError(innerErr)) {
              const isUnresolvable = innerErr.code === 'EAI_AGAIN' || innerErr.code === 'ENOTFOUND' || innerErr.message.includes('getaddrinfo');
              if (isUnresolvable) {
                logger.warn(`⚠️ PostgreSQL host is unresolvable or network is unreachable. Falling back to SQLite permanently for this session.`);
                usePg = false;
                ensureSqliteDb();
              } else if (process.env.DATABASE_URL || process.env.USE_POSTGRES === 'true') {
                 logger.error(`PostgreSQL Error (run-insert): ${innerErr.message}. SQLite fallback DISABLED.`);
                 throw new Error(`PostgreSQL Connection Failed: ${innerErr.message}`);
              }
              logger.warn(`PostgreSQL network issue (${innerErr.message}). Falling back to SQLite.`);
            } else {
              throw innerErr;
            }
          }
        } else if (isPgNetworkError(err)) {
          const isUnresolvable = err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND' || err.message.includes('getaddrinfo');
          if (isUnresolvable) {
            logger.warn(`⚠️ PostgreSQL host is unresolvable or network is unreachable. Falling back to SQLite permanently for this session.`);
            usePg = false;
            ensureSqliteDb();
          } else if (process.env.DATABASE_URL || process.env.USE_POSTGRES === 'true') {
             logger.error(`PostgreSQL Error (run): ${err.message}. SQLite fallback DISABLED.`);
             throw new Error(`PostgreSQL Connection Failed: ${err.message}`);
          }
          logger.warn(`PostgreSQL network issue (${err.message}). Falling back to SQLite.`);
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      if (isPgNetworkError(err)) {
        const isUnresolvable = err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND' || err.message.includes('getaddrinfo');
        if (isUnresolvable) {
          logger.warn(`⚠️ PostgreSQL host is unresolvable or network is unreachable. Falling back to SQLite permanently for this session.`);
          usePg = false;
          ensureSqliteDb();
        } else if (process.env.DATABASE_URL || process.env.USE_POSTGRES === 'true') {
           logger.error(`PostgreSQL Error (run-outer): ${err.message}. SQLite fallback DISABLED.`);
           throw new Error(`PostgreSQL Connection Failed: ${err.message}`);
        }
        logger.warn(`PostgreSQL network issue (${err.message}). Falling back to SQLite.`);
      } else {
        throw err;
      }
    }
  }

  const sqlite = (conn && typeof conn.prepare === 'function') ? conn : ensureSqliteDb();
  let statement = (!conn) ? statementCache.get(sql) : undefined;
  if (!statement) {
    statement = sqlite.prepare(sql);
    if (!conn) statementCache.set(sql, statement);
  }
  return statement.run(...params);
}

export async function transaction<T>(fn: (connection: any) => Promise<T>): Promise<T> {
  return legacyTransaction(fn);
}

async function legacyTransaction<T>(fn: (connection: any) => Promise<T>): Promise<T> {
  if (usePg && pgPool) {
    try {
      const client = await pgPool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        try { await client.query('ROLLBACK'); } catch {}
        if (isPgNetworkError(err)) {
          const isUnresolvable = (err as any)?.code === 'EAI_AGAIN' || (err as any)?.code === 'ENOTFOUND' || (err as any)?.message?.includes('getaddrinfo');
          if (isUnresolvable) {
            logger.warn(`⚠️ PostgreSQL host is unresolvable or network is unreachable. Falling back to SQLite permanently for this session.`);
            usePg = false;
            ensureSqliteDb();
          } else if (process.env.DATABASE_URL || process.env.USE_POSTGRES === 'true') {
             logger.error(`PostgreSQL Error (transaction): ${(err as any)?.message}. SQLite fallback DISABLED.`);
             throw new Error(`PostgreSQL Transaction Failed: ${(err as any)?.message}`);
          }
          logger.warn(`PostgreSQL network issue (${(err as any)?.message}). Falling back to SQLite.`);
        } else {
          throw err;
        }
      } finally {
        client.release();
      }
    } catch (err: any) {
      if (isPgNetworkError(err)) {
        const isUnresolvable = err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND' || err.message.includes('getaddrinfo');
        if (isUnresolvable) {
          logger.warn(`⚠️ PostgreSQL host is unresolvable or network is unreachable. Falling back to SQLite permanently for this session.`);
          usePg = false;
          ensureSqliteDb();
        } else if (process.env.DATABASE_URL || process.env.USE_POSTGRES === 'true') {
           logger.error(`PostgreSQL Error (transaction-outer): ${err.message}. SQLite fallback DISABLED.`);
           throw new Error(`PostgreSQL Connection Failed: ${err.message}`);
        }
        logger.warn(`PostgreSQL network issue (${err.message}). Falling back to SQLite.`);
      } else {
        throw err;
      }
    }
  }

  const sqlite = ensureSqliteDb();
  const unlock = await dbMutex.lock();
  const isNested = sqlite.inTransaction;
  if (!isNested) sqlite.prepare('BEGIN').run();
  try {
    const result = await fn(sqlite);
    if (!isNested) sqlite.prepare('COMMIT').run();
    return result;
  } catch (err) {
    if (!isNested) sqlite.prepare('ROLLBACK').run();
    throw err;
  } finally {
    unlock();
  }
}

export async function runRawSql(sql: string) {
  if (!pgPool) {
    throw new Error("PostgreSQL client pool is not initialized! All operations are configured for PostgreSQL only.");
  }
  return await pgPool.query(sql);
}

export const db = {
  prepare(sql: string) {
    return {
      get(...params: any[]) { return get(sql, params); },
      all(...params: any[]) { return query(sql, params); },
      run(...params: any[]) { return run(sql, params); },
      exec(s: string) { return query(s, []); }
    };
  },
  exec(sql: string) { return query(sql, []); },
  pragma(sql: string) {
    return null;
  },
  transaction<T>(fn: (client: any) => Promise<T>) {
    return transaction(fn);
  },
  get inTransaction() {
    return false;
  }
};

export default db;
