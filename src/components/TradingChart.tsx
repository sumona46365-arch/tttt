import React, { useEffect, useRef } from 'react';
import { createChart, ISeriesApi, CandlestickData, Time, CrosshairMode } from 'lightweight-charts';

export const TradingChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'>>(null);
  const requestRef = useRef<number>(0);
  const lastCandleRef = useRef<CandlestickData<Time> | null>(null);

  const timeframeSeconds = 5;
  const colors = {
    up: '#10b981',
    down: '#f43f5e',
    bg: '#0a0b0d',
    grid: 'rgba(255, 255, 255, 0.03)',
    border: '#1e222d',
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Load persisted zoom level
    const persistedBarSpacing = localStorage.getItem('trading_chart_bar_spacing');
    const initialBarSpacing = persistedBarSpacing ? parseFloat(persistedBarSpacing) : 22;

    // Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      layout: {
        background: { color: colors.bg },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: colors.border,
        autoScale: true,
        alignLabels: true,
        borderVisible: true,
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: true,
        barSpacing: initialBarSpacing,
        fixLeftEdge: true,
        fixRightEdge: true, // Prevent scrolling into the future/void
        rightOffset: 2,
        minBarSpacing: 5,
        maxBarSpacing: 80,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false, 
        pinch: false,      
      },
      kineticScroll: {
        touch: false,
        mouse: false,
      },
    });

    // Strict Clamping: Prevent the chart from ever being dragged into a blank state
    chart.timeScale().subscribeVisibleTimeRangeChange(() => {
      const timeScale = chart.timeScale();
      
      // Persist zoom level
      const currentSpacing = timeScale.options().barSpacing;
      if (currentSpacing) {
          localStorage.setItem('trading_chart_bar_spacing', currentSpacing.toString());
      }

      const visibleRange = timeScale.getVisibleRange();
      if (!visibleRange) return;
      
      // If user drags too far, we reset to the most recent data
      if (Number(visibleRange.to) < Date.now() / 1000 - 3600 * 24) {
        timeScale.scrollToRealTime();
      }
    });

    const candleSeries = (chart as any).addCandlestickSeries({
      upColor: colors.up,
      downColor: colors.down,
      borderVisible: true,
      borderUpColor: colors.up,
      borderDownColor: colors.down,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    // 1. Generate Seamless Historical Data (No Gaps on App Load)
    const historyCount = 100;
    const historicalData: CandlestickData<Time>[] = [];
    const nowInit = Date.now();
    let historyTime = (Math.floor(nowInit / (timeframeSeconds * 1000)) * timeframeSeconds) - (historyCount * timeframeSeconds);
    let historyPrice = 1589.60; // Starting price matching screenshot

    for (let i = 0; i < historyCount; i++) {
      const open = historyPrice;
      const roll = Math.random();
      let close = open;
      let high = open;
      let low = open;

      if (roll < 0.2) {
         // Doji
         close = open + (Math.random() - 0.5) * 0.1;
         high = open + Math.random() * 0.5;
         low = open - Math.random() * 0.5;
      } else if (roll < 0.4) {
         // Strong Trend (Marubozu)
         const dir = Math.random() > 0.5 ? 1 : -1;
         const bodySize = (Math.random() * 0.8) + 0.4;
         close = open + (dir * bodySize);
         high = Math.max(open, close) + (Math.random() * 0.05);
         low = Math.min(open, close) - (Math.random() * 0.05);
      } else if (roll < 0.6) {
         // Rejection (Hammer / Shooting Star)
         const isHammer = Math.random() > 0.5;
         const bodySize = (Math.random() * 0.2) + 0.05;
         close = open + (Math.random() > 0.5 ? bodySize : -bodySize);
         if (isHammer) {
             high = Math.max(open, close) + Math.random() * 0.1;
             low = Math.min(open, close) - ((Math.random() * 0.8) + 0.4);
         } else {
             high = Math.max(open, close) + ((Math.random() * 0.8) + 0.4);
             low = Math.min(open, close) - Math.random() * 0.1;
         }
      } else if (roll < 0.8) {
         // Small body
         const dir = Math.random() > 0.5 ? 1 : -1;
         const bodySize = Math.random() * 0.2 + 0.1;
         close = open + (dir * bodySize);
         high = Math.max(open, close) + Math.random() * 0.2;
         low = Math.min(open, close) - Math.random() * 0.2;
      } else {
         // Normal
         const dir = Math.random() > 0.5 ? 1 : -1;
         const bodySize = Math.random() * 0.5 + 0.2;
         close = open + (dir * bodySize);
         high = Math.max(open, close) + Math.random() * 0.4;
         low = Math.min(open, close) - Math.random() * 0.4;
      }

      historicalData.push({
        time: historyTime as Time,
        open,
        high,
        low,
        close,
      });
      historyPrice = close;
      historyTime += timeframeSeconds;
    }
    
    // 2. Pre-fill chart with history
    candleSeries.setData(historicalData);
    try {
      chart.timeScale().setVisibleLogicalRange({ from: historyCount - 30, to: historyCount + 2 });
    } catch (e) {}

    // 3. Perfect Sync: Real-time engine starts EXACTLY where history ended
    let visualPrice = historyPrice;
    let velocity = 0;

    // Personality variables for dynamic volatility
    let currentCandleStart = 0;
    let drift = 0;
    let volatilityMult = 1;
    let reversionStrength = 0;

    const updateLoop = () => {
      if (!seriesRef.current) return;

      const now = Date.now();
      const candleTime = (Math.floor(now / (timeframeSeconds * 1000)) * timeframeSeconds) as Time;

      // 1. High-Frequency Market Physics (Runs every frame at ~60 FPS)
      
      if (Number(candleTime) !== currentCandleStart) {
         currentCandleStart = Number(candleTime);
         // Roll new personality for the new 5-second candle
         const roll = Math.random();
         if (roll < 0.2) {
             // Doji: high reversion, low volatility
             drift = 0;
             volatilityMult = 0.5;
             reversionStrength = 0.15;
         } else if (roll < 0.4) {
             // Strong Trend (Marubozu): strong drift, low reversion
             drift = (Math.random() - 0.5) * 0.08;
             volatilityMult = 0.8;
             reversionStrength = 0.005;
         } else if (roll < 0.6) {
             // Rejection (Hammer/Shooting Star): strong initial burst, then we will reverse it.
             drift = (Math.random() - 0.5) * 0.05;
             volatilityMult = 1.2;
             reversionStrength = 0.08;
         } else if (roll < 0.8) {
             // Small Body: low volatility
             drift = (Math.random() - 0.5) * 0.02;
             volatilityMult = 0.4;
             reversionStrength = 0.03;
         } else {
             // Normal volatile
             drift = (Math.random() - 0.5) * 0.04;
             volatilityMult = 0.9;
             reversionStrength = 0.02;
         }
      }

      // Base random noise (Brownian motion) + drift
      const acceleration = ((Math.random() - 0.5) * 0.15 * volatilityMult) + drift;
      
      velocity += acceleration;
      
      // Friction/Damping: 0.92 gives it a "sharp" but fluid tick feel (like Quotex)
      velocity *= 0.92;

      // Rare volatility spikes (1.5% chance per frame)
      if (Math.random() > 0.985) {
          velocity += (Math.random() - 0.5) * 0.2 * volatilityMult; // Tamed
      }

      // Mean Reversion (The secret to DOJI and LONG WICKS)
      // We pull the price back towards the candle's open if it moves too far
      const open = lastCandleRef.current ? lastCandleRef.current.open : visualPrice;
      const dist = Math.abs(visualPrice - open);
      
      if (dist > 0.15) {
          // Spring force pulling it back. The further away, the stronger the pull.
          const reverseForce = (open - visualPrice) * reversionStrength; 
          velocity += reverseForce;
      }

      // Apply velocity directly to visual price
      visualPrice += velocity;

      let updatedCandle: CandlestickData<Time>;

      // 2. Correct OHLC Tracking
      if (!lastCandleRef.current || (Number(candleTime) > Number(lastCandleRef.current.time))) {
        // Start of a new candle
        const openPrice = lastCandleRef.current ? lastCandleRef.current.close : visualPrice;
        
        updatedCandle = {
          time: candleTime,
          open: openPrice,
          high: Math.max(openPrice, visualPrice),
          low: Math.min(openPrice, visualPrice),
          close: visualPrice,
        };
      } else {
        // Continuous development of the current candle
        updatedCandle = {
          ...lastCandleRef.current,
          close: visualPrice,
          high: Math.max(lastCandleRef.current.high, visualPrice),
          low: Math.min(lastCandleRef.current.low, visualPrice),
        };
      }

      lastCandleRef.current = updatedCandle;
      seriesRef.current.update(updatedCandle);

      requestRef.current = requestAnimationFrame(updateLoop);
    };

    requestRef.current = requestAnimationFrame(updateLoop);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (chartRef.current) chartRef.current.remove();
    };
  }, []);

  return (
    <div className="w-full bg-[#0a0b0d] rounded-xl border border-white/5 shadow-2xl overflow-hidden p-1">
      <div 
        ref={chartContainerRef} 
        className="w-full h-[450px] relative overflow-hidden"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
