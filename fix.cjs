const fs = require('fs');
let content = fs.readFileSync('src/db/mysql-db.ts', 'utf8');

content = content.replace(
`  const pool = new pg.Pool({
    connectionString,
    ssl: sslConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Retry connecting to PostgreSQL on startup`,
`  const pool = new pg.Pool({
    connectionString,
    ssl: sslConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pgPool = pool;

  // Retry connecting to PostgreSQL on startup`
);

content = content.replace(
`      logger.info("✅ PostgreSQL connected successfully! All app data will persist in PostgreSQL.");
      pgPool = pool;
      usePg = true;
      await initPgTables(pgPool);`,
`      logger.info("✅ PostgreSQL connected successfully! All app data will persist in PostgreSQL.");
      await initPgTables(pool);`
);

content = content.replace(
`        logger.info(\`PostgreSQL unavailable in preview container. Falling back to SQLite for local preview.\`);
        logger.error("PostgreSQL connection issue: " + err.message);
        pgPool = null;`,
`        logger.error("PostgreSQL connection issue: " + err.message);`
);

fs.writeFileSync('src/db/mysql-db.ts', content);
