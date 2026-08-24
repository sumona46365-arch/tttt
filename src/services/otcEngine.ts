import { query } from '../db/mysql-db.ts';
import { 
  markets_real, markets_demo, 
  history_real, history_demo, 
  currentCandles_real, currentCandles_demo,
  saveCandleToDB_v2, TIMEFRAMES, timeframeSecondsMap,
  isMarketClosedAt
} from './marketService.ts';
import { getIO } from './socketService.ts';
import { tradeExposureCache, manipulatedExposureCache } from './tradeService.ts';
import { globalManipulationMode } from './marketService.ts';
import { markets } from '../markets.ts';

const steeringTradesCache = new Map<string, any[]>();

export async function syncSteeringTrades() {
  try {
    const allActive = await query(
      `SELECT market_id, is_demo, entry_price, direction, target_result, expiry_time 
       FROM trades 
       WHERE status = 'open' AND target_result IS NOT NULL`
    ) as any[];
    
    const newCache = new Map<string, any[]>();
    for (const t of allActive) {
      const type = t.is_demo ? 'demo' : 'real';
      const key = `${t.market_id}_${type}`;
      if (!newCache.has(key)) newCache.set(key, []);
      newCache.get(key)!.push(t);
    }
    
    steeringTradesCache.clear();
    for (const [k, v] of newCache) {
      steeringTradesCache.set(k, v);
    }
  } catch (e) {
    // Fail silently
  }
}

// Initial sync and then every 3 seconds
syncSteeringTrades();
setInterval(syncSteeringTrades, 3000);

// Dynamic Trend State Tracker for realistic, unique, cyclic market movements (like professional trading apps)
interface MarketTrend {
  currentTrend: 'up' | 'down' | 'sideways';
  trendIntensity: number;
  cycleTicksRemaining: number;
  momentum: number;
}

const marketTrendStates: Record<string, MarketTrend> = {};
const candleVolatilityStates: Record<string, any> = {};

export async function updatePair(pair: string, type: 'real' | 'demo', now: number) {
  if (isMarketClosedAt(pair, now)) {
    return null;
  }
  const pool = type === 'real' ? markets_real : markets_demo;
  const historyPool = type === 'real' ? history_real : history_demo;
  const candlePool = type === 'real' ? currentCandles_real : currentCandles_demo;
  
  const m = pool[pair];
  if (!m) return null;

  const currentPrice = Number(m.price) || 100.00;

  // Initialize or update the cyclic trend state for this specific pair
  const trendKey = `${pair}_${type}`;
  if (!marketTrendStates[trendKey]) {
    const trends: ('up' | 'down' | 'sideways')[] = ['up', 'down', 'sideways'];
    // Use length and characters to seed different initial trends per pair
    const seedIndex = (pair.length + pair.charCodeAt(0)) % trends.length;
    marketTrendStates[trendKey] = {
      currentTrend: trends[seedIndex],
      trendIntensity: 0.15 + Math.random() * 0.35,
      cycleTicksRemaining: 40 + Math.floor(Math.random() * 120), // tick lifetime
      momentum: 0
    };
  }

  const state = marketTrendStates[trendKey];
  state.cycleTicksRemaining--;

  if (state.cycleTicksRemaining <= 0) {
    // Transition smoothly to a new market cycle
    const trends: ('up' | 'down' | 'sideways')[] = ['up', 'down', 'sideways'];
    const otherTrends = trends.filter(t => t !== state.currentTrend);
    state.currentTrend = otherTrends[Math.floor(Math.random() * otherTrends.length)];
    state.trendIntensity = 0.15 + Math.random() * 0.4;
    state.cycleTicksRemaining = 50 + Math.floor(Math.random() * 150);
  }

  // Determine market-specific volatility multipliers (Forex is stable, Cryptos/OTC are erratic/high payout)
  // Significantly increased to create "Big Steps" (ধাপ দিয়ে ওঠা-নামা)
  let volMult = 5.0; 
  if (pair.includes('(OTC)')) {
    volMult = 7.0; // Decisive OTC movements
  } else if (pair.includes('Crypto IDX') || pair.includes('IDX')) {
    volMult = 8.5; // Aggressive steps for Index
  } else if (pair.includes('/USD') && !pair.includes('EUR/') && !pair.includes('GBP/') && !pair.includes('AUD/')) {
    volMult = 6.0; 
  } else {
    volMult = 4.0; // Solid steps for Forex
  }

  // --- 5-Second Candle Micro-Volatility (Market Realism) ---
  const bucket5s = now - (now % 5);
  const candleStateKey = `${pair}_${type}`;
  
  if (!candleVolatilityStates[candleStateKey] || candleVolatilityStates[candleStateKey].start !== bucket5s) {
      const roll = Math.random();
      let pType = 'normal';
      let vMult = 1.0;
      
      if (roll < 0.15) { pType = 'doji'; vMult = 0.8; }
      else if (roll < 0.30) { pType = 'hammer'; vMult = 1.2; }
      else if (roll < 0.45) { pType = 'shooting_star'; vMult = 1.2; }
      else if (roll < 0.60) { pType = 'marubozu'; vMult = 1.1; }
      else if (roll < 0.75) { pType = 'small'; vMult = 0.6; }
      else { pType = 'normal'; vMult = 1.0; }
      
      candleVolatilityStates[candleStateKey] = { start: bucket5s, type: pType, volMult: vMult, initialDir: Math.random() > 0.5 ? 1 : -1 };
  }
  const cState = candleVolatilityStates[candleStateKey];

  // Base random price noise (dynamic based on candle personality)
  const randNoise = (Math.random() - 0.5) * 1.5 * cState.volMult; 

  // Macro trend bias
  let trendBias = 0;
  if (state.currentTrend === 'up') trendBias = state.trendIntensity * 1.5;
  else if (state.currentTrend === 'down') trendBias = -state.trendIntensity * 1.5;
  else trendBias = (Math.random() - 0.5) * 0.4;

  state.momentum = (state.momentum * 0.85) + (trendBias * 0.15);

  const rawVolatility = markets[pair]?.volatility || 0.0002;
  const baseVolatility = rawVolatility / currentPrice;
  
  // Calculate raw change
  const tickChangePercent = (randNoise * 0.1 + state.momentum * 0.9) * baseVolatility * volMult;
  let change = currentPrice * tickChangePercent;
  
  // Apply Micro-Bias (Rejection/Wicks/Doji forces)
  const active5sCandle = candlePool[pair]?.["5 seconds"];
  if (active5sCandle) {
      const openPrice = active5sCandle.open;
      const elapsedSec = now - bucket5s;
      const distToOpen = currentPrice - openPrice;
      const rawPriceChangeLimit = currentPrice * baseVolatility * volMult * 0.5; // Drastically reduced for organic wicks
      
      let microBias = 0;
      if (cState.type === 'doji') {
          microBias = -distToOpen * 0.15; // Gentler magnetic pull
      } else if (cState.type === 'marubozu') {
          microBias = cState.initialDir * rawPriceChangeLimit * 0.3;
      } else if (cState.type === 'hammer') {
          if (elapsedSec < 3) {
             microBias = -rawPriceChangeLimit * 0.8; 
          } else {
             microBias = (openPrice - currentPrice) * 0.15 + (rawPriceChangeLimit * 0.3); 
          }
      } else if (cState.type === 'shooting_star') {
          if (elapsedSec < 3) {
             microBias = rawPriceChangeLimit * 0.8; 
          } else {
             microBias = (openPrice - currentPrice) * 0.15 - (rawPriceChangeLimit * 0.3); 
          }
      }
      
      change += microBias;
  }

  // --- Natural Outcome Steering ---
  // If there are active trades with target outcomes, we steer the price naturally using CACHED data for performance.
  const steeringKey = `${pair}_${type}`;
  const activeSteeringTrades = steeringTradesCache.get(steeringKey) || [];

  if (activeSteeringTrades.length > 0) {
    let totalSteeringBias = 0;
    for (const trade of activeSteeringTrades) {
      const entry = parseFloat(trade.entry_price);
      const timeLeft = trade.expiry_time - now;
      if (timeLeft <= 0) continue;

      // Determine "Safe Zone" beyond entry
      const winThreshold = entry * 0.0001; 
      
      let targetPrice;
      if (trade.target_result === 'win') {
        targetPrice = trade.direction === 'up' ? entry + winThreshold : entry - winThreshold;
      } else if (trade.target_result === 'loss') {
        targetPrice = trade.direction === 'up' ? entry - winThreshold : entry + winThreshold;
      } else {
        targetPrice = entry;
      }

      const distance = targetPrice - currentPrice;
      // Smoothing factor: more gradual weight to prevent shaky jumps
      // Weight decreases as we get closer to the target or as time remains
      const steeringForce = 1.0 / Math.max(timeLeft + 2, 3); // Added padding for smoothness
      totalSteeringBias += (distance * steeringForce * 0.12); 
    }
    
    // Cap the steering to prevent "unnatural" jumps
    const maxSteer = currentPrice * 0.0003; // Slightly lower cap for extra smoothness
    const appliedSteer = Math.max(-maxSteer, Math.min(maxSteer, totalSteeringBias));
    
    // Dampen noise slightly when steering is active to make it look guided
    change = (change * 0.7) + appliedSteer;
  }

  // Admin Pressure / Manipulation support
  const exposureKey = `${pair}_${type}`;
  const exposure = tradeExposureCache.get(exposureKey) || 0;
  const manipExposure = manipulatedExposureCache.get(exposureKey) || 0;
  
  let bias = 0;
  if (globalManipulationMode === 'always_loss') {
    bias = exposure > 0 ? -0.0004 : 0.0004;
  } else if (globalManipulationMode === 'always_win') {
    bias = exposure > 0 ? 0.0004 : -0.0004;
  }
  if (manipExposure !== 0) {
    bias += manipExposure > 0 ? 0.0005 : -0.0005;
  }
  if (m.pressure) {
    bias += (m.pressure / 100) * 0.0005;
  }

  let newPrice = Number((currentPrice + change + (bias * currentPrice)).toFixed(5));
  if (newPrice <= 0) newPrice = 1.00;
  m.price = newPrice;

  // Update all timeframes
  for (const tf of TIMEFRAMES) {
    const tfSeconds = timeframeSecondsMap[tf];
    const bucketTime = now - (now % tfSeconds);
    if (!candlePool[pair]) candlePool[pair] = {};
    let activeCandle = candlePool[pair][tf];

    if (!activeCandle) {
      candlePool[pair][tf] = {
        open: newPrice,
        high: newPrice,
        low: newPrice,
        close: newPrice,
        volume: Math.random() * 20 + 5,
        openTime: bucketTime,
        closeTime: bucketTime + tfSeconds
      };
      saveCandleToDB_v2(pair, type, tf, candlePool[pair][tf]);
    } else if (bucketTime > activeCandle.openTime) {
      // Completed candle
      const completed = { ...activeCandle };
      saveCandleToDB_v2(pair, type, tf, completed);

      if (!historyPool[pair]) historyPool[pair] = {};
      if (!historyPool[pair][tf]) historyPool[pair][tf] = [];
      
      const historyRow = {
        time: completed.openTime,
        open: completed.open,
        high: completed.high,
        low: completed.low,
        close: completed.close,
        volume: completed.volume,
        openTime: completed.openTime,
        closeTime: completed.closeTime
      };

      historyPool[pair][tf].push(historyRow);
      if (historyPool[pair][tf].length > 1000) historyPool[pair][tf].shift();

      try {
        getIO().to(`market_${pair}_${type}`).emit('candle_complete', { pair, timeframe: tf, candle: historyRow });
      } catch(e) {}

      // New candle starts precisely at previous close
      candlePool[pair][tf] = {
        open: completed.close,
        high: Math.max(completed.close, newPrice),
        low: Math.min(completed.close, newPrice),
        close: newPrice,
        volume: Math.random() * 20 + 5,
        openTime: bucketTime,
        closeTime: bucketTime + tfSeconds
      };
      saveCandleToDB_v2(pair, type, tf, candlePool[pair][tf]);
    } else {
      activeCandle.close = newPrice;
      activeCandle.high = Math.max(activeCandle.high, newPrice);
      activeCandle.low = Math.min(activeCandle.low, newPrice);
      activeCandle.volume += Math.random() * 2;
    }
  }

  const active5s = candlePool[pair]?.["5 seconds"];
  return {
    price: newPrice,
    time: now,
    candle: active5s ? {
      time: active5s.openTime,
      open: active5s.open,
      high: active5s.high,
      low: active5s.low,
      close: active5s.close,
      volume: active5s.volume
    } : null
  };
}
