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
      borderVisible: false,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
      priceFormat: {
        type: 'price',
        precision: 5,
        minMove: 0.00001,
      },
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    // 1. Generate Seamless Historical Data (No Gaps on App Load)
    const historyCount = 100;
    const historicalData: CandlestickData<Time>[] = [];
    const nowInit = Date.now();
    let historyTime = (Math.floor(nowInit / (timeframeSeconds * 1000)) * timeframeSeconds) - (historyCount * timeframeSeconds);
    let historyPrice = 1.11250; // Starting price roughly matching screenshot

    for (let i = 0; i < historyCount; i++) {
      const open = historyPrice;
      const isUp = Math.random() > 0.5;
      const bodySize = (Math.random() * 0.0006) + 0.0002; 
      const close = isUp ? open + bodySize : open - bodySize;
      const wickUpper = close > open ? close + Math.random() * 0.0004 : open + Math.random() * 0.0004;
      const wickLower = close > open ? open - Math.random() * 0.0004 : close - Math.random() * 0.0004;
      
      historicalData.push({
        time: historyTime as Time,
        open,
        high: wickUpper,
        low: wickLower,
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
    let lastTickTime = 0;
    let nextTickDelay = 50; // Ultra-fast ticks for fluid movement
    let targetPrice = historyPrice;
    let visualPrice = historyPrice;
    
    // Volatility and Trend parameters for "Natural" movement
    let currentVolatility = 0.0006;
    let volatilityBurstTimer = 0;
    let internalTrend = 0; // Cumulative momentum within a 5s candle
    let trendTimer = 0;

    const updateLoop = () => {
      if (!seriesRef.current) return;

      const now = Date.now();
      const candleTime = (Math.floor(now / (timeframeSeconds * 1000)) * timeframeSeconds) as Time;

      // 1. Core Logic Update (Ticks) - Simulating dynamic market behavior
      if (now - lastTickTime > nextTickDelay) {
        lastTickTime = now;
        
        // Dynamic trend switching for erratic movements (creating wicks/reversals)
        if (trendTimer <= 0) {
          internalTrend = (Math.random() - 0.5) * 0.0008;
          trendTimer = Math.random() * 3000 + 1000; // Change trend every 1-4 seconds
        } else {
          trendTimer -= nextTickDelay;
        }

        // Randomly trigger volatility bursts for "Long Body" or "Fast" spikes
        if (volatilityBurstTimer <= 0) {
          if (Math.random() > 0.94) {
            volatilityBurstTimer = Math.random() * 3000 + 1000;
            currentVolatility = 0.0018; // High volatility spike
          } else {
            currentVolatility = 0.0003 + Math.random() * 0.0005; // Normal noise
          }
        } else {
          volatilityBurstTimer -= nextTickDelay;
        }

        nextTickDelay = Math.random() * 100 + 50; 
        
        // Movement calculation: Trend + Random Noise + Reversion tendency
        // Reversion tendency pulls price slightly back if it moves too far too fast
        const randomNoise = (Math.random() - 0.5) * currentVolatility;
        const drift = internalTrend;
        
        targetPrice += randomNoise + drift;
        
        // Occasionally "snap back" to create Dojis or Wicks
        if (Math.random() > 0.85) {
           const open = lastCandleRef.current ? lastCandleRef.current.open : targetPrice;
           targetPrice = targetPrice + (open - targetPrice) * 0.4; // Pull back towards open
        }
      }

      // 2. Natural Micro-Fluctuations (Live Vibration)
      const microJitter = (Math.random() - 0.5) * 0.00003;
      const effectiveTarget = targetPrice + microJitter;

      // 3. Fast + Smooth Interpolation (Lerp)
      const lerpFactor = 0.32; 
      visualPrice = visualPrice + (effectiveTarget - visualPrice) * lerpFactor;

      let updatedCandle: CandlestickData<Time>;

      // 4. Correct High/Low Formation Tracking
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
          // HIGH and LOW now track the ACTUAL visual extreme reached
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
