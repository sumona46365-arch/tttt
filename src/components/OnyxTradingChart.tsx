import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';

// Onyx Option Signature Colors
const ONYX_THEME = {
  background: '#0a0b0d', // Deep dark
  upColor: '#00c076',     // Onyx Green
  downColor: '#ff3b30',   // Onyx Red
  gridColor: 'rgba(42, 46, 57, 0.2)',
  textColor: '#d1d4dc',
  borderColor: '#2a2e39',
};

export const OnyxTradingChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Load persisted zoom level
    const persistedBarSpacing = localStorage.getItem('onyx_chart_bar_spacing');
    const initialBarSpacing = persistedBarSpacing ? parseFloat(persistedBarSpacing) : 22;

    // 1. Initialize Chart with Professional Scaling and Interaction
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      layout: {
        background: { type: ColorType.Solid, color: ONYX_THEME.background },
        textColor: ONYX_THEME.textColor,
      },
      grid: {
        vertLines: { color: ONYX_THEME.gridColor },
        horzLines: { color: ONYX_THEME.gridColor },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: ONYX_THEME.borderColor,
        autoScale: true, // Pillar: Keep candles within area
        alignLabels: true,
        borderVisible: true,
      },
      timeScale: {
        borderColor: ONYX_THEME.borderColor,
        timeVisible: true,
        secondsVisible: true,
        barSpacing: initialBarSpacing,
        fixLeftEdge: true,
        rightOffset: 10,
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

    // Persist zoom level on change
    chart.timeScale().subscribeVisibleTimeRangeChange(() => {
        const currentSpacing = chart.timeScale().options().barSpacing;
        if (currentSpacing) {
            localStorage.setItem('onyx_chart_bar_spacing', currentSpacing.toString());
        }
    });

    // 2. Pillar 4: Visual Polish (Emerald & Rose)
    const candleSeries = (chart as any).addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#f43f5e',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
      priceFormat: {
        type: 'price',
        precision: 5,
        minMove: 0.00001,
      },
    });

    seriesRef.current = candleSeries;

    // 3. Pillar 1 & 2: Continuity and Global Sync Logic
    const timeframeSeconds = 5;
    let lastCandle: any = null;
    let targetPrice = 1.25400;
    let visualPrice = 1.25400;
    let lastTickTime = Date.now();
    let currentVolatility = 0.00035;
    let volatilityBurstTimer = 0;
    let internalTrend = 0;
    let trendTimer = 0;
    const requestRef = useRef<number>(0);

    const updateLoop = () => {
      if (!seriesRef.current) return;

      const now = Date.now();
      const candleTime = Math.floor(now / (timeframeSeconds * 1000)) * timeframeSeconds;
      
      // 1. Tick Update (Erratic Market Behavior)
      if (now - lastTickTime > 80) { 
        lastTickTime = now;

        if (trendTimer <= 0) {
          internalTrend = (Math.random() - 0.5) * 0.0006;
          trendTimer = Math.random() * 4000 + 1000;
        } else {
          trendTimer -= 80;
        }

        if (volatilityBurstTimer <= 0) {
          if (Math.random() > 0.95) {
            volatilityBurstTimer = Math.random() * 3000 + 1000;
            currentVolatility = 0.0012; 
          } else {
            currentVolatility = 0.0001 + Math.random() * 0.0003;
          }
        } else {
          volatilityBurstTimer -= 80;
        }

        const randomJump = (Math.random() - 0.5) * currentVolatility;
        targetPrice += randomJump + internalTrend;

        // "Wick Logic": Random pullbacks within the same 5s cycle
        if (Math.random() > 0.9) {
          const open = lastCandle ? lastCandle.open : targetPrice;
          targetPrice = targetPrice + (open - targetPrice) * 0.5;
        }
      }

      // 2. Micro-Jitter
      const microJitter = (Math.random() - 0.5) * 0.00002;
      const effectiveTarget = targetPrice + microJitter;

      // 3. Interpolation
      const lerpFactor = 0.30;
      visualPrice = visualPrice + (effectiveTarget - visualPrice) * lerpFactor;

      let updatedCandle;

      // 4. Natural OHLC Tracking
      if (!lastCandle || Number(candleTime) > Number(lastCandle.time)) {
        const openPrice = lastCandle ? lastCandle.close : visualPrice;
        
        updatedCandle = {
          time: candleTime as any,
          open: openPrice,
          high: Math.max(openPrice, visualPrice),
          low: Math.min(openPrice, visualPrice),
          close: visualPrice,
        };
      } else {
        updatedCandle = {
          ...lastCandle,
          close: visualPrice,
          high: Math.max(lastCandle.high, visualPrice),
          low: Math.min(lastCandle.low, visualPrice),
        };
      }

      lastCandle = updatedCandle;
      seriesRef.current.update(updatedCandle);
      
      requestRef.current = requestAnimationFrame(updateLoop);
    };

    requestRef.current = requestAnimationFrame(updateLoop);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  function THEME_RED_OR_GREEN() { return ONYX_THEME.downColor; }

  return (
    <div className="w-full bg-[#0a0b0d] rounded-xl overflow-hidden border border-[#2a2e39] mb-4">
      <div className="px-4 py-3 border-b border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00c076] rounded-full animate-pulse" />
          <span className="text-white font-bold text-sm tracking-wider">ONYX ENGINE LIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs">TF: 5S</span>
          <span className="text-gray-500 text-xs">UTC+6</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};
