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
      borderVisible: true,
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    seriesRef.current = candleSeries;

    // 3. Pillar 1 & 2: Continuity and Global Sync Logic
    const timeframeSeconds = 5;
    let lastCandle: any = null;
    let visualPrice = 1589.60;
    let velocity = 0;
    let drift = 0;
    let volatilityMult = 1;
    let reversionStrength = 0;
    let currentCandleStart = 0;

    const requestRef = useRef<number>(0);

    const updateLoop = () => {
      if (!seriesRef.current) return;

      const now = Date.now();
      const candleTime = Math.floor(now / (timeframeSeconds * 1000)) * timeframeSeconds;
      
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
          velocity += (Math.random() - 0.5) * 0.2 * volatilityMult;
      }

      // Mean Reversion (The secret to DOJI and LONG WICKS)
      // We pull the price back towards the candle's open if it moves too far
      const open = lastCandle ? lastCandle.open : visualPrice;
      const dist = Math.abs(visualPrice - open);
      
      if (dist > 0.15) {
          // Spring force pulling it back. The further away, the stronger the pull.
          const reverseForce = (open - visualPrice) * reversionStrength; 
          velocity += reverseForce;
      }

      // Apply velocity directly to visual price
      visualPrice += velocity;

      let updatedCandle;

      // 2. Natural OHLC Tracking
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
