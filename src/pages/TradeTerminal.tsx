
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logo } from "../components/Logo";
import { Skeleton } from "../components/Skeleton";
import signalsIllustration from "../assets/images/trading_signals_illustration_1779720241475.png";
import { StoryViewer } from "../components/StoryViewer";
import TradeHistoryModal from "../components/TradeHistoryModal";
import { OnyxTradingChart } from "../components/OnyxTradingChart";
import { TradingChart } from "../components/TradingChart";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  IPriceLine,
  Time,
  PriceLineOptions,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
  LineStyle,
  LastPriceAnimationMode,
  createSeriesMarkers,
} from "lightweight-charts";
import { io } from "socket.io-client";
import Big from 'big.js';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import { DrawingOverlay } from "../components/DrawingOverlay";
import { useSupport } from "../contexts/SupportContext";
import { navigateToBlog } from "../lib/blog-navigation";

import CopyTradingPage from "./CopyTrading";
import { 
  RSI, MACD, BollingerBands, Stochastic, SMA, EMA, WMA, WEMA, ATR, ROC, CCI, WilliamsR, 
  TRIX, ADX, StochasticRSI, KST, ADL, MFI, OBV, ForceIndex, PSAR, 
  VWAP, IchimokuCloud, SD, AwesomeOscillator, KeltnerChannels, ChandelierExit 
} from 'technicalindicators';
import {
  Wallet,
  ChevronDown,
  Clock,
  TrendingUp,
  TrendingDown,
  User,
  Plus,
  Minus,
  ShoppingBag,
  RefreshCw,
  ChevronLeft,
  ChevronUp,
  Compass,
  Radio,
  Move,
  AlignRight,
  LayoutGrid,
  Menu,
  ArrowLeft,
  Bell,
  Megaphone,
  Trophy,
  Users,
  Lock,
  Loader2,
  ShieldCheck,
  LogOut,
  Activity,
  Settings,
  ChevronRight,
  UserPlus,
  Calendar,
  Gift,
  GraduationCap,
  CreditCard,
  Diamond,
  Star,
  Zap,
  HelpCircle,
  Headphones,
  Info,
  AlertCircle,
  AlertTriangle,
  Unlock,
  EyeOff,
  ArrowRight,
  ArrowRightLeft,
  Smartphone,
  Book,
  History,
  Heart,
  X,
  Youtube,
  Instagram,
  Send,
  Paperclip,
  Facebook,
  MessageSquare,
  Music2,
  MessageCircle,
  Search,
  CandlestickChart,
  SlidersVertical,
  Signal,
  
  Cloud,
  BarChart2,
  BarChart3,
  Triangle,
  Circle,
  Wind,
  Waves,
  LineChart,
  GripHorizontal,
  Snowflake,
  Copy,
  Check,
  QrCode,
  Shield,
  Play,
  PlayCircle,
  Gem,
  Music,
  ArrowUp,
  ArrowDown,
  Camera,
  Key,
  UserCheck,
  Mail,
  Trash,
  MoveHorizontal,
  MinusCircle,
  Square,
  MenuSquare,
  ArrowUpRight,
  BarChart,
  Layers,
  Share2,
  Ruler,
  Repeat,
} from "lucide-react";

import * as Icons from "lucide-react";
import { COUNTRY_DIAL_CODES, findCountryByDialCode, findCountryByName, CountryDialCode } from "../data/countryDialCodes";


const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: 'ðŸ‡¬ðŸ‡§' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'ðŸ‡®ðŸ‡©' },
  { code: 'pt', name: 'PortuguÃªs', flag: 'ðŸ‡µðŸ‡¹' },
  { code: 'vi', name: 'Tiáº¿ng Viá»‡t', flag: 'ðŸ‡»ðŸ‡³' },
  { code: 'ru', name: 'Ð ÑƒÑÑÐºÐ¸Ð¹', flag: 'ðŸ‡·ðŸ‡º' },
  { code: 'hi', name: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€', flag: 'ðŸ‡®ðŸ‡³' },
  { code: 'es', name: 'EspaÃ±ol', flag: 'ðŸ‡ªðŸ‡¸' },
  { code: 'uk', name: 'Ð£ÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ° Ð¼Ð¾Ð²Ð°', flag: 'ðŸ‡ºðŸ‡¦' },
  { code: 'tr', name: 'TÃ¼rkÃ§e', flag: 'ðŸ‡¹ðŸ‡·' },
  { code: 'th', name: 'à¹„à¸—à¸¢', flag: 'ðŸ‡¹ðŸ‡­' },
  { code: 'zh', name: 'ä¸­æ–‡', flag: 'ðŸ‡¨ðŸ‡³' },
  { code: 'kk', name: 'ÒšÐ°Ð·Ð°Ò› Ñ‚Ñ–Ð»Ñ–', flag: 'ðŸ‡°ðŸ‡¿' },
  { code: 'de', name: 'Deutsch', flag: 'ðŸ‡©ðŸ‡ª' },
  { code: 'fr', name: 'FranÃ§ais', flag: 'ðŸ‡«ðŸ‡·' },
  { code: 'bn', name: 'à¦¬à¦¾à¦‚à¦²à¦¾', flag: 'ðŸ‡§ðŸ‡©' },
];

const NEWS_DATA = [
  {
    id: 1,
    date: "10.03.2026",
    title: "Don't miss your last chance to get prizes!",
    description: "Hurry up and activate your Horseshoes",
    reactions: 420,
    badReactions: 62,
    emoji: "ðŸŽ¯",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&auto=format&fit=crop&q=80",
    content: "Increase your chances of becoming a winner before time runs out: deposit $50 or more, reach a turnover of $300, and get your Horseshoe. Prizes await, especially a brand new Mustang GT \"Fastback\" 2025 â€” maybe you will be the lucky winner! *All rewards are provided exclusively in a monetary equivalent deposited into the winner's real account"
  },
  {
    id: 2,
    date: "24.02.2026",
    title: "Trade and prosper! ðŸ’°",
    description: "This year brings more exciting rewards",
    reactions: 349,
    badReactions: 12,
    emoji: "ðŸ’°",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
    content: "Explore new trading opportunities this spring with our updated asset signals."
  },
  {
    id: 3,
    date: "19.02.2026",
    title: "More Horseshoes for you! â˜ï¸",
    description: "A little something to boost your prosperity â€” now on sale!",
    reactions: 196,
    badReactions: 8,
    emoji: "â˜ï¸",
    image: "https://images.unsplash.com/photo-1611974714131-419b67484411?w=800&auto=format&fit=crop&q=80",
    content: "Boost your luck with our limited edition Horseshoes. Available only for the next 48 hours."
  }
];

const PROMOTIONS_DATA = [
  {
    id: 1,
    title: "Spring Trading Bonus",
    description: "Get 50% bonus on your next deposit",
    image: "https://images.unsplash.com/photo-1591033588766-9810ea1a5557?w=800&auto=format&fit=crop&q=80",
    content: "Make a deposit of $100 or more and get a 50% bonus added to your trading account. Valid until end of April!"
  },
  {
    id: 2,
    title: "Refer a Friend",
    description: "Earn $20 for every friend who joins",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80",
    content: "Invite your friends to Bivaax and get $20 for every friend who completes their first trade."
  }
];

const EDUCATION_DATA = [
  {
    id: 1,
    title: "Welcome to the Bivaax platform",
    description: "Simple steps to start from",
    duration: "1:23",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "" // the first one is text-only gradient card
  },
  {
    id: 2,
    title: "You're on the right track!",
    description: "Take a grand step into profitable trading by learning the essentials about indicators, strategies, and assets. You've made a deposit. All videos are unlocked!",
    duration: "12:35",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1611974714131-419b67484411?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Plan your strategy with Economic calendar",
    description: "",
    duration: "0:29",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1642543492481-44e81e391452?w=800&auto=format&fit=crop&q=80"
  }
];

import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { signOut, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail } from "../firebase";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { doc, getDoc, onSnapshot, query, collection, orderBy, where, collectionGroup, setDoc, updateDoc, deleteDoc, increment, limit, addDoc, serverTimestamp, getDocs } from "../firebase";
import { currencies, formatWithCurrency, convertToBase, convertFromBase, getCurrencySymbol, formatRawCurrency } from "../lib/currencies";
import { TimeZoneModal } from "../components/TimeZoneModal";
import PaymentMethodsStatus from "../components/PaymentMethodsStatus";
import { useTranslation, LanguageCode } from "../lib/translations";
import { useI18n } from "../context/I18nContext";
import { getUserByAffiliateId } from "../lib/affiliate";

const getTimeSeconds = (tf: string) => {
  if (!tf || typeof tf !== 'string') return 60;
  const clean = tf.trim();
  const match = clean.match(/^(\d+)\s*([a-zA-Z]*)$/);
  if (!match) return 60;
  const val = parseInt(match[1]) || 1;
  const unit = match[2]?.toLowerCase() || '';
  if (unit.startsWith("s")) return val;
  if (unit.startsWith("m")) return val * 60;
  if (unit.startsWith("h")) return val * 3600;
  if (unit.startsWith("d")) return val * 86400;
  return val || 60;
};

const formatTimeframeShort = (tf: string) => {
  if (!tf || typeof tf !== 'string') return "";
  const clean = tf.trim();
  const match = clean.match(/^(\d+)\s*([a-zA-Z]*)$/);
  if (!match) return tf;
  const val = match[1];
  const unit = match[2] ? match[2][0].toLowerCase() : '';
  return `${val}${unit}`;
};

const isRealMarketClosed = (pair: string, time: Date = new Date()): boolean => {
  if (!pair) return false;
  const isOTC = pair.includes('(OTC)') || pair.includes('Crypto IDX');
  if (isOTC) {
    return false;
  }

  const isCrypto = pair.includes('/USD') && !(
    pair.startsWith('EUR/') || pair.startsWith('GBP/') || pair.startsWith('AUD/') || 
    pair.startsWith('NZD/') || pair.startsWith('USD/') || pair.startsWith('CAD/') || 
    pair.startsWith('CHF/') || pair.startsWith('JPY/') || pair.startsWith('DKK/') || 
    pair.startsWith('SEK/') || pair.startsWith('NOK/') || pair.startsWith('PLN/') || 
    pair.startsWith('HUF/') || pair.startsWith('CZK/') || pair.startsWith('ILS/') || 
    pair.startsWith('THB/') || pair.startsWith('TRY/') || pair.startsWith('SGD/')
  );

  if (isCrypto) {
    return false;
  }

  const day = time.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const hours = time.getUTCHours();

  // Weekend closed hours: Friday 21:00 UTC to Sunday 22:00 UTC
  if (day === 6) {
    return true; // Saturday is always closed
  }
  if (day === 5 && hours >= 21) {
    return true; // Friday after 21:00 UTC is closed
  }
  if (day === 0 && hours < 22) {
    return true; // Sunday before 22:00 UTC is closed
  }

  // Specific Stock hours (e.g., Yum Brands): 13:30 to 20:00 UTC Mon-Fri
  if (pair === 'Yum Brands') {
    if (hours < 13 || hours >= 20) {
      return true;
    }
  }

  return false;
};

const calculateHeikinAshi = (data: any[]) => {
  if (!data || data.length === 0) return [];
  let haData = [];
  let prevOpen = data[0]?.open || 0;
  let prevClose = data[0]?.close || 0;

  for (let i = 0; i < data.length; i++) {
    const haClose =
      (data[i].open + data[i].high + data[i].low + data[i].close) / 4;
    const haOpen = (prevOpen + prevClose) / 2;
    const haHigh = Math.max(data[i].high, haOpen, haClose);
    const haLow = Math.min(data[i].low, haOpen, haClose);

    haData.push({
      time: data[i].time,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });

    prevOpen = haOpen;
    prevClose = haClose;
  }
  return haData;
};

const resampleData = (data: any[], tfString: string) => {
  const timeframeSeconds = getTimeSeconds(tfString);
  if (!data || !Array.isArray(data) || data.length === 0) return [];
  const cleanData = data.filter(item => item && typeof item.time === 'number');
  if (cleanData.length === 0) return [];

  // If the server already sent candles corresponding to the target timeframe,
  // do not attempt to resample them, return them directly!
  if (cleanData.length > 1) {
    const firstSpacing = Math.abs(cleanData[1].time - cleanData[0].time);
    if (firstSpacing >= timeframeSeconds) {
      return cleanData;
    }
  } else {
    return cleanData;
  }

  const baseSeconds = 5; // Our server provides 5-sec data

  if (timeframeSeconds === baseSeconds) {
    return cleanData;
  }

  const resampled: any[] = [];
  if (timeframeSeconds > baseSeconds) {
    let currentCandle: any = null;
    let currentBucket = null;
    let lastKnownClose = cleanData[0]?.close || 0;

    for (let i = 0; i < cleanData.length; i++) {
        const d = cleanData[i];
        const bucketTime = d.time - (d.time % timeframeSeconds);
        
        // Ensure values are numbers
        const open = Number(d.open || lastKnownClose || 0);
        const high = Number(d.high || d.open || lastKnownClose || 0);
        const low = Number(d.low || d.open || lastKnownClose || 0);
        const close = Number(d.close || d.open || lastKnownClose || 0);
        const volume = Number(d.volume || 0);

        if (!currentCandle || currentBucket !== bucketTime) {
            if (currentCandle) {
                resampled.push(currentCandle);
                lastKnownClose = currentCandle.close;
            }
            currentBucket = bucketTime;
            
            currentCandle = {
                time: bucketTime as Time,
                open: open,
                high: Math.max(open, close, high),
                low: Math.min(open, close, low),
                close: close,
                volume: volume
            };
        } else {
            currentCandle.high = Math.max(currentCandle.high, high, close);
            currentCandle.low = Math.min(currentCandle.low, low, close);
            currentCandle.close = close;
            currentCandle.volume = (currentCandle.volume || 0) + volume;
        }
        lastKnownClose = close;
    }
    if (currentCandle) resampled.push(currentCandle);
  } else {
      const splits = Math.floor(baseSeconds / timeframeSeconds);
      if(splits <= 0) return cleanData;
      let previousClose = null;
      for (let i = 0; i < cleanData.length; i++) {
          const d = cleanData[i];
          let currentOpen = previousClose !== null ? previousClose : d.open;
          const stepSize = (d.close - currentOpen) / splits;
          
          for (let j = 0; j < splits; j++) {
             const subProgress = (j + 1) / splits;
             const isLastSub = j === splits - 1;
             
             // Add random noise while preserving macro drift
             const subNoise = (Math.random() - 0.5) * Math.abs(stepSize) * 0.2;
             const rawSubClose = currentOpen + stepSize + subNoise;
             const currentClose = isLastSub ? d.close : rawSubClose;
             
             const bodyRange = Math.abs(currentClose - currentOpen);
             const wickNoise = Math.max(bodyRange * 0.2, Math.abs(stepSize) * 0.2);
             
             const high = Math.max(currentOpen, currentClose) + Math.random() * wickNoise;
             const low = Math.min(currentOpen, currentClose) - Math.random() * wickNoise;
             
             resampled.push({
                 time: (d.time + (j * timeframeSeconds)) as Time,
                 open: currentOpen,
                 high: isNaN(high) ? Math.max(currentOpen, currentClose) : high,
                 low: isNaN(low) ? Math.min(currentOpen, currentClose) : low,
                 close: currentClose
             });
             currentOpen = currentClose;
          }
          previousClose = currentOpen;
      }
  }
  resampled.sort((a, b) => a.time - b.time);
  
  // Remove duplicates
  const uniqueResampled = [];
  let lastTime = 0;
  for (const item of resampled) {
    if (item.time > lastTime) {
      uniqueResampled.push(item);
      lastTime = item.time;
    }
  }

  return uniqueResampled;
};



const getGeckoId = (symbol: string): string => {
  const map: Record<string, string> = {
    'btc': '1', 'eth': '279', 'ltc': '2', 'sol': '4128', 'ada': '975',
    'uni': '12504', 'link': '877', 'ton': '17980', 'cake': '12666',
    'fet': '5681', 'aave': '12467', 'bch': '231', 'dot': '12171',
    'avax': '12559', 'pol': '4713', 'icp': '14472', 'bar': '11838',
    'ksm': '9568', 'rsr': '8965', 'lpt': '1431', 'woo': '13101',
    'vec': '31454', 'xrp': '44', 'doge': '5', 'shib': '11903'
  };
  return map[symbol.toLowerCase()] || symbol;
};

const getFlagCode = (currency: string) => {
  const map: Record<string, string> = {
    'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'AUD': 'au', 
    'CAD': 'ca', 'CHF': 'ch', 'NZD': 'nz', 'DKK': 'dk', 'INR': 'in',
    'BRL': 'br', 'TRY': 'tr', 'RUB': 'ru', 'CNY': 'cn', 'ZAR': 'za'
  };
  return map[currency.toUpperCase()] || 'un';
};

const AnimatedBalance = ({ value, currency, accountType, isHidden }: { value: number, currency: string, accountType: string, isHidden: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const prevAccountTypeRef = useRef(accountType);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevAccountTypeRef.current !== accountType) {
      prevAccountTypeRef.current = accountType;
      prevValueRef.current = value;
      setDisplayValue(value);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // Round both values to avoid noise-triggered animations
    const roundedValue = parseFloat(Number(value || 0).toFixed(2));
    const roundedPrev = parseFloat(Number(prevValueRef.current || 0).toFixed(2));

    if (Math.abs(roundedValue - roundedPrev) >= 0.01) {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const start = displayValue;
      const end = roundedValue;
      const duration = 300; // Smooth 300ms transition
      let startTimestamp: number | null = null;
      
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        setDisplayValue(current);
        
        if (progress < 1) {
          animationRef.current = window.requestAnimationFrame(step);
        } else {
          setDisplayValue(end);
          animationRef.current = null;
        }
      };
      
      animationRef.current = window.requestAnimationFrame(step);
      prevValueRef.current = roundedValue;
    } else {
      setDisplayValue(roundedValue);
      prevValueRef.current = roundedValue;
    }
    
    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [value, accountType]);

  if (isHidden) return <span className="font-sans font-bold">âœ±âœ±âœ±âœ±âœ±</span>;

  const formatted = accountType === 'tournament' 
    ? `â‚®${displayValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : formatWithCurrency(displayValue, currency);

  return (
    <motion.span 
      key={accountType}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`font-sans font-bold tabular-nums`}
    >
      {formatted}
    </motion.span>
  );
};

const AssetLogo = ({ name, size = 32 }: { name: string, size?: number }) => {
  const [hasError, setHasError] = useState(false);

  if (!name) return <div className="rounded-full bg-gray-800" style={{ width: size, height: size }} />;
  if (name === "Crypto IDX") {
    const innerCircleSize = Math.max(8, Math.floor(size * 0.375));
    return (
      <div className="relative flex items-center justify-center bg-gradient-to-br from-[#2b2d35] to-[#1a1b1f] rounded-lg border border-white/10 shadow-lg overflow-hidden group" style={{ width: size, height: size }}>
        <div className="grid grid-cols-2 gap-0.5 p-1 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="bg-[#f7931a] rounded-[1px] shadow-sm"></div>
          <div className="bg-[#627eea] rounded-[1px] shadow-sm"></div>
          <div className="bg-[#14f195] rounded-[1px] shadow-sm"></div>
          <div className="bg-[#f3ba2f] rounded-[1px] shadow-sm"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#1a1b1f] rounded-full flex items-center justify-center border border-white/20 shadow-xl" style={{ width: innerCircleSize, height: innerCircleSize }}>
             <span className="font-black italic text-white leading-none" style={{ fontSize: Math.floor(innerCircleSize * 0.6) }}>C</span>
          </div>
        </div>
      </div>
    );
  }

  // Handle crypto icons
  const cryptoIcons: Record<string, { color: string; label: string; symbol: string }> = {
    'BTC/USD': { color: '#F7931A', label: 'â‚¿', symbol: 'btc' },
    'ETH/USD': { color: '#627EEA', label: 'Îž', symbol: 'eth' },
    'LTC/USD': { color: '#345D9D', label: 'Å', symbol: 'ltc' },
    'SOL/USD': { color: '#14F195', label: 'S', symbol: 'sol' },
    'ADA/USD': { color: '#0033AD', label: 'A', symbol: 'ada' },
    'UNI/USD': { color: '#FF007A', label: 'U', symbol: 'uni' },
    'LINK/USD': { color: '#2A5ADA', label: 'C', symbol: 'link' },
    'LINK/USD (OTC)': { color: '#2A5ADA', label: 'C', symbol: 'link' },
    'TON/USD': { color: '#0088CC', label: 'T', symbol: 'ton' },
    'TON/USD (OTC)': { color: '#0088CC', label: 'T', symbol: 'ton' },
    'CAKE/USD': { color: '#D1884F', label: 'P', symbol: 'cake' },
    'FET/USD': { color: '#000000', label: 'F', symbol: 'fet' },
    'AAVE/USD': { color: '#B6509E', label: 'A', symbol: 'aave' },
    'BCH/USD': { color: '#8BC34A', label: 'B', symbol: 'bch' },
    'DOT/USD': { color: '#E6007A', label: 'P', symbol: 'dot' },
    'AVAX/USD': { color: '#E84142', label: 'A', symbol: 'avax' },
    'POL/USD': { color: '#8247E5', label: 'P', symbol: 'pol' },
    'ICP/USD': { color: '#F48225', label: 'I', symbol: 'icp' },
    'BAR/USD': { color: '#004D98', label: 'B', symbol: 'bar' },
    'KSM/USD': { color: '#000000', label: 'K', symbol: 'ksm' },
    'RSR/USD': { color: '#F6C915', label: 'R', symbol: 'rsr' },
    'LPT/USD': { color: '#00E37D', label: 'L', symbol: 'lpt' },
    'WOO/USD': { color: '#000000', label: 'W', symbol: 'woo' },
    'VEC/USD': { color: '#5C6BC0', label: 'V', symbol: 'vec' },
    'XRP/USD': { color: '#23292F', label: 'X', symbol: 'xrp' },
    'DOGE/USD': { color: '#C2A633', label: 'D', symbol: 'doge' },
    'Shiba Inu': { color: '#FFA409', label: 'S', symbol: 'shib' },
  };

  const cryptoKey = Object.keys(cryptoIcons).find(k => name.includes(k));
  if (cryptoKey) {
    const icon = cryptoIcons[cryptoKey];
    return (
      <div 
        className="rounded-full flex items-center justify-center overflow-hidden bg-[#2A2C31] shadow-lg ring-1 ring-white/10 group-hover:ring-white/20 transition-all"
        style={hasError ? { backgroundColor: icon.color, width: size, height: size } : { width: size, height: size }}
      >
        {hasError ? (
          <span className="text-white font-bold" style={{ fontSize: Math.floor(size * 0.4) }}>{icon.label}</span>
        ) : (
          <img 
            src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${icon.symbol}.png`}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    );
  }

  // Handle Stock icons
  const stockIcons: Record<string, { color: string; label: string }> = {
    'Apple': { color: '#555555', label: 'ðŸŽ' },
    'Tesla': { color: '#E31937', label: 'T' },
    'Microsoft': { color: '#00A4EF', label: 'MS' },
    'Google': { color: '#4285F4', label: 'G' },
    'Amazon': { color: '#FF9900', label: 'A' },
    'Meta': { color: '#0668E1', label: 'M' },
    'NVIDIA': { color: '#76B900', label: 'N' },
    'Netflix': { color: '#E50914', label: 'N' },
    'Intel': { color: '#0071C5', label: 'I' },
    'Disney': { color: '#000000', label: 'D' },
    'Yum Brands': { color: '#D62329', label: 'Y' },
    'Boeing': { color: '#0039A6', label: 'B' },
  };

  const stockKey = Object.keys(stockIcons).find(k => name.includes(k));
  if (stockKey) {
    const icon = stockIcons[stockKey];
    return (
      <div className="rounded-md flex items-center justify-center shadow-lg border border-white/10" style={{ backgroundColor: icon.color, width: size, height: size }}>
        <span className="text-white font-black" style={{ fontSize: Math.floor(size * 0.45) }}>{icon.label}</span>
      </div>
    );
  }

  // Handle Indices
  if (name.includes('US 30') || name.includes('US 100') || name.includes('US 500') || name.includes('GER 40') || name.includes('UK 100') || name.includes('JPN 225')) {
    const code = name.includes('US') ? 'us' : name.includes('GER') ? 'de' : name.includes('UK') ? 'gb' : 'jp';
    const label = name.includes('US 30') ? '30' : name.includes('US 100') ? '100' : name.includes('US 500') ? '500' : name.includes('GER 40') ? '40' : name.includes('UK 100') ? '100' : '225';
    return (
      <div className="relative rounded-md flex items-center justify-center bg-[#1a1b1f] border border-white/10 overflow-hidden" style={{ width: size, height: size }}>
        <img src={`https://flagcdn.com/w80/${code}.png`} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="index" />
        <span className="relative z-10 text-white font-black" style={{ fontSize: Math.floor(size * 0.35) }}>{label}</span>
      </div>
    );
  }

  // Handle Commodities
  if (name.includes('Gold')) {
    return (
      <div className="rounded-md flex items-center justify-center bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-lg border border-white/20" style={{ width: size, height: size }}>
        <span className="text-black font-black" style={{ fontSize: Math.floor(size * 0.45) }}>Au</span>
      </div>
    );
  }
  if (name.includes('Silver')) {
    return (
      <div className="rounded-md flex items-center justify-center bg-gradient-to-br from-[#E8E8E8] to-[#999999] shadow-lg border border-white/20" style={{ width: size, height: size }}>
        <span className="text-black font-black" style={{ fontSize: Math.floor(size * 0.45) }}>Ag</span>
      </div>
    );
  }
  if (name.includes('Oil')) {
    return (
      <div className="rounded-md flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#333333] shadow-lg border border-white/20" style={{ width: size, height: size }}>
        <div className="w-[60%] h-[60%] border-2 border-yellow-500 rounded-sm flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Handle currency pairs (Flags)
  if (name.includes('/')) {
    const parts = name.split(' ')[0].split('/');
    const code1 = getFlagCode(parts[0]);
    const code2 = getFlagCode(parts[1]);
    
    const flagW = Math.floor(size * 0.75);
    const flagH = Math.floor(size * 0.5);

    return (
      <div className="flex -space-x-1.5 items-center">
        <div className="rounded-sm overflow-hidden border border-white/10 shadow-sm z-10" style={{ width: flagW, height: flagH }}>
          <img src={`https://flagcdn.com/w80/${code1}.png`} alt={parts[0]} className="w-full h-full object-cover"  loading="lazy" />
        </div>
        <div className="rounded-sm overflow-hidden border border-white/10 shadow-sm" style={{ width: flagW, height: flagH }}>
          <img src={`https://flagcdn.com/w80/${code2}.png`} alt={parts[1]} className="w-full h-full object-cover"  loading="lazy" />
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center font-black border border-white/5 text-gray-400" style={{ width: size, height: size, fontSize: Math.floor(size * 0.3) }}>
      {name.substring(0, 3)}
    </div>
  );
};

const SidebarTradeHistory = ({ 
  activeTrades, 
  userTrades, 
  sidebarTab, 
  setSidebarTab, 
  userCurrency,
  markets
}: { 
  activeTrades: any[], 
  userTrades: any[], 
  sidebarTab: 'trades' | 'history', 
  setSidebarTab: (tab: 'trades' | 'history') => void,
  userCurrency: string,
  markets: any
}) => {
  const { language } = useI18n();
  const { t } = useTranslation(language || 'en');
  const trades = sidebarTab === 'trades' ? activeTrades : userTrades;
  
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#1a1b1f] border-t border-white/5">
      {/* Tabs */}
      <div className="flex items-center border-b border-white/5 bg-[#1a1b1f] sticky top-0 z-10 shrink-0">
        <button 
          onClick={() => setSidebarTab('trades')}
          className={`flex-1 py-3 text-[13px] font-bold transition-all relative flex items-center justify-center gap-2 ${sidebarTab === 'trades' ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
        >
          {t('trades')}
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${sidebarTab === 'trades' ? 'bg-[#3ea6ff] text-white' : 'bg-gray-800 text-gray-500'}`}>
            {activeTrades.length}
          </span>
          {sidebarTab === 'trades' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3ea6ff]" />}
        </button>
        <button 
          onClick={() => setSidebarTab('history')}
          className={`flex-1 py-3 text-[13px] font-bold transition-all relative flex items-center justify-center gap-2 ${sidebarTab === 'history' ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
        >
          <Clock size={14} />
          <span>{t('closedTrades')}</span>
          {sidebarTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3ea6ff]" />}
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${sidebarTab === 'history' ? 'bg-[#3ea6ff] text-white' : 'bg-gray-800 text-gray-500'}`}>
            {userTrades.length}
          </span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-2">
        {trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-30">
            <Clock size={32} />
            <span className="text-[12px] font-medium tracking-wide">No trades found</span>
          </div>
        ) : (
          trades.slice(0, 50).map((trade, idx) => {
            let liveStatus: 'won' | 'lost' | 'draw' = 'draw';
            let liveProfit = 0;
            
            if (trade.status === 'open') {
              const currentPrice = markets[trade.asset]?.price;
              if (currentPrice !== undefined) {
                const priceNum = parseFloat(currentPrice);
                const entryNum = parseFloat(String(trade.entryPrice || trade.entry_price || 0).replace(/[^0-9.]/g, ''));
                
                if (!isNaN(priceNum) && !isNaN(entryNum)) {
                  const isWon = trade.type === 'up' ? priceNum > entryNum : priceNum < entryNum;
                  const isDraw = priceNum === entryNum;
                  
                  liveStatus = isWon ? 'won' : (isDraw ? 'draw' : 'lost');
                  const payoutRate = trade.payout || (trade as any).payoutRate || (trade.asset && markets[trade.asset]?.payout) || 80;
                  liveProfit = isWon ? (trade.amount * (payoutRate / 100)) : (isDraw ? 0 : -trade.amount);
                }
              }
            }

            return (
              <div key={`sidebar-history-${trade.id || idx}`} className="bg-[#24262b] rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AssetLogo name={trade.asset} size={20} />
                    <span className="text-[13px] font-bold text-white truncate max-w-[120px]">{trade.asset}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {new Date(trade.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      {trade.type === 'up' ? (
                        <div className="w-4 h-4 bg-[#00c980]/20 rounded-full flex items-center justify-center">
                          <ArrowUp size={10} className="text-[#00c980]" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-[#f45c5c]/20 rounded-full flex items-center justify-center">
                          <ArrowDown size={10} className="text-[#f45c5c]" strokeWidth={3} />
                        </div>
                      )}
                      <span className="text-[13px] font-bold text-white">
                        {formatWithCurrency(trade.amount, userCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    {trade.status === 'open' ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className={`text-[13px] font-bold ${liveStatus === 'won' ? 'text-[#00c980]' : liveStatus === 'lost' ? 'text-[#f45c5c]' : 'text-gray-400'}`}>
                          {liveStatus === 'won' ? '+' : ''}{formatWithCurrency(liveProfit, userCurrency)}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-[#3ea6ff] animate-ping" />
                          <span className="text-[10px] font-black text-white/40 tracking-tighter">
                            {trade.timeLeft ? `${Math.floor(trade.timeLeft / 60)}:${(trade.timeLeft % 60).toString().padStart(2, '0')}` : 'Live'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className={`text-[13px] font-bold ${trade.status === 'won' ? 'text-[#00c980]' : trade.status === 'draw' ? 'text-gray-400' : 'text-[#f45c5c]'}`}>
                        {trade.status === 'won' ? `+${formatWithCurrency(trade.profit || trade.amount * ((trade.payout || (trade as any).payoutRate || (trade.asset && markets[trade.asset]?.payout) || 80) / 100), userCurrency)}` : trade.status === 'draw' ? formatWithCurrency(0, userCurrency) : `-${formatWithCurrency(trade.amount, userCurrency)}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const ActiveAISignals = ({ activeAsset, currentPrice, onExecute, onClose }: { activeAsset: string, currentPrice: string, onExecute: (type: "up"|"down") => void, onClose: () => void }) => {
  const [signal, setSignal] = React.useState({
    direction: "up" as "up" | "down",
    confidence: 87,
    timeframe: "1m",
    priceTarget: currentPrice,
    strength: "Strong Buy",
    oscillators: { rsi: 45, macd: "Bullish", stoch: 80 }
  });

  const [executing, setExecuting] = React.useState(false);

  React.useEffect(() => {
    // Determine new signal when asset changes
    const dir = Math.random() > 0.5 ? "up" : "down";
    const conf = 75 + Math.random() * 20;
    
    setSignal({
      direction: dir,
      confidence: conf,
      timeframe: "1m",
      priceTarget: currentPrice,
      strength: conf > 90 ? (dir === "up" ? "Strong Buy" : "Strong Sell") : (dir === "up" ? "Buy" : "Sell"),
      oscillators: { 
        rsi: Math.floor(30 + Math.random() * 40), 
        macd: dir === "up" ? "Bullish" : "Bearish", 
        stoch: Math.floor(20 + Math.random() * 60)
      }
    });
  }, [activeAsset]);

  // Confidence fluctuator
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSignal(prev => ({
        ...prev,
        confidence: Math.max(70, Math.min(99, prev.confidence + (Math.random() * 4 - 2))),
        oscillators: {
          ...prev.oscillators,
          rsi: Math.max(20, Math.min(80, prev.oscillators.rsi + (Math.random() * 4 - 2)))
        }
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
      onExecute(signal.direction);
      setExecuting(false);
      onClose(); 
    }, 600);
  };

  const isUp = signal.direction === "up";
  const color = isUp ? "#00dc74" : "#ff3b3b";
  const glow = isUp ? "rgba(0,220,116,0.4)" : "rgba(255,59,59,0.4)";
  
  return (
    <motion.div
       initial={{ x: "-100%", opacity: 0 }}
       animate={{ x: 0, opacity: 1 }}
       exit={{ x: "-100%", opacity: 0 }}
       transition={{ type: "spring", damping: 25, stiffness: 200 }}
       className="fixed md:absolute inset-0 md:left-[72px] md:right-auto md:w-[400px] z-[150] overflow-hidden bg-[#121316] shadow-[10px_0_40px_rgba(0,0,0,0.8)] border-r border-[#1e1f25]"
    >
       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 z-0 text-white"></div>
       
       <div className="w-full h-full flex flex-col relative z-10 text-white overflow-hidden">
        <div className="pt-6 pb-4 px-6 flex items-center justify-between border-b border-white/5 bg-[#121316]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full shadow-[0_0_10px]" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
             <h2 className="text-[20px] font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">AI SIGNAL TERMINAL</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icons.X size={18} strokeWidth={2} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-hide pb-24">
          <TradingChart />
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Analyzing Asset</p>
              <h3 className="text-[28px] font-black leading-none">{activeAsset}</h3>
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Icons.Activity size={16} className="text-[#00f0ff]" />
              <span className="font-mono font-bold text-[14px]">LIVE</span>
            </div>
          </div>

          <div className="relative w-full aspect-square max-h-[220px] rounded-[24px] bg-[#1a1c24] border border-white/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] blur-[50px] rounded-full mix-blend-screen transition-all duration-700" style={{ backgroundColor: glow }}></div>
             
             <div className="relative z-10 text-center">
                <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mb-2">Algorithm Decision</p>
                <div className="flex items-center justify-center gap-3 mb-2 text-white">
                   {isUp ? <Icons.TrendingUp size={48} strokeWidth={2.5} style={{ color }} /> : <Icons.TrendingDown size={48} strokeWidth={2.5} style={{ color }} />}
                </div>
                <h2 className="text-[42px] font-black uppercase tracking-wider" style={{ color }}>{signal.strength}</h2>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-[#1a1c24] border border-white/5 p-4 rounded-2xl">
                <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">Confidence</p>
                <div className="flex flex-col gap-1.5">
                   <span className="text-[22px] font-black font-mono">{signal.confidence.toFixed(1)}%</span>
                   <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${signal.confidence}%`, backgroundColor: color }}></div>
                   </div>
                </div>
             </div>
             
             <div className="bg-[#1a1c24] border border-white/5 p-4 rounded-2xl">
                <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">Entry Range</p>
                <div className="flex flex-col">
                   <span className="text-[18px] font-bold font-mono">{currentPrice}</span>
                   <span className="text-[12px] text-gray-400 mt-0.5 whitespace-nowrap">Â± 0.05% margin</span>
                </div>
             </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest px-1">Oscillators Summary</h4>
             
             <div className="bg-[#1a1c24] border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                       <Icons.ActivitySquare size={16} className="text-gray-400" />
                       <span className="text-[13px] font-bold">RSI (14)</span>
                   </div>
                   <span className={`text-[13px] font-mono font-bold ${signal.oscillators.rsi > 70 ? 'text-[#ff3b3b]' : signal.oscillators.rsi < 30 ? 'text-[#00dc74]' : 'text-white'}`}>{signal.oscillators.rsi.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                       <Icons.TrendingUp size={16} className="text-gray-400" />
                       <span className="text-[13px] font-bold">MACD (12, 26, 9)</span>
                   </div>
                   <span className={`text-[13px] font-bold ${signal.oscillators.macd === 'Bullish' ? 'text-[#00dc74]' : 'text-[#ff3b3b]'}`}>{signal.oscillators.macd}</span>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                       <Icons.BarChart2 size={16} className="text-gray-400" />
                       <span className="text-[13px] font-bold">Stochastic</span>
                   </div>
                   <span className="text-[13px] font-mono font-bold">{signal.oscillators.stoch.toFixed(1)}</span>
                </div>
             </div>
          </div>

        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#121316] via-[#121316]/90 to-transparent pt-10">
           <button
             onClick={handleExecute}
             disabled={executing}
             className="w-full relative overflow-hidden rounded-2xl p-4 font-black tracking-wide text-[16px] text-[#0c0d12] transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] group flex items-center justify-center gap-2"
             style={{ backgroundColor: color }}
           >
              {executing ? (
                 <div className="w-5 h-5 border-2 border-[#0c0d12]/30 border-t-[#0c0d12] rounded-full animate-spin"></div>
              ) : (
                 <>
                   <Icons.Zap size={20} className="fill-[#0c0d12]/20 text-[#0c0d12]" />
                   EXECUTE {signal.direction.toUpperCase()} SIGNAL
                 </>
              )}
           </button>
        </div>

       </div>
    </motion.div>
  );
};

interface Trade {
  id: string;
  firebaseId?: string;
  firebase_id?: string;
  asset: string;
  type: string;
  amount: number;
  entryPrice?: number;
  closePrice?: number;
  status?: string;
  payoutAmount?: number;
  payout?: number;
  payoutRate?: number;
  duration?: number;
  [key: string]: any;
}

interface Transaction {
  id: string;
  dateStr: string;
  timeStr: string;
  endTimeStr?: string;
  type: string;
  method: string;
  methodIcon?: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Rejected' | string;
  errorMsg?: string;
  successMsg?: string;
  bonusAmount?: number;
  timestamp?: number;
  orderId?: string;
  trxId?: string;
  currency?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    dateStr: "April 25, 2026",
    timeStr: "8:24 PM",
    endTimeStr: "8:39 PM",
    type: "Deposit",
    method: "Tether (USDT TRC-20)",
    methodIcon: "usdt",
    amount: 77500,
    status: "Rejected",
    errorMsg: "Something went wrong, please try again later. If the error repeats, please contact the payment provider or our support service."
  },
  {
    id: "tx-2",
    dateStr: "April 21, 2026",
    timeStr: "3:00 PM",
    endTimeStr: "",
    type: "Deposit",
    method: "Nagad",
    methodIcon: "nagad",
    amount: 1000,
    status: "Pending"
  },
  {
    id: "tx-3",
    dateStr: "April 20, 2026",
    timeStr: "3:00 PM",
    endTimeStr: "3:02 PM",
    type: "Deposit",
    method: "Nagad",
    methodIcon: "nagad",
    amount: 1000,
    status: "Completed",
    successMsg: "Transaction completed successfully.",
    bonusAmount: 50
  },
  {
    id: "tx-4",
    dateStr: "March 25, 2026",
    timeStr: "1:15 PM",
    endTimeStr: "1:16 PM",
    type: "Deposit",
    method: "Nagad",
    methodIcon: "nagad",
    amount: 2000,
    status: "Completed",
    successMsg: "Transaction completed successfully."
  },
  {
    id: "tx-5",
    dateStr: "February 14, 2026",
    timeStr: "10:00 AM",
    endTimeStr: "10:05 AM",
    type: "Deposit",
    method: "Nagad",
    methodIcon: "nagad",
    amount: 4500,
    status: "Rejected",
    errorMsg: "Something went wrong, please try again later. If the error repeats, please contact the payment provider or our support service."
  },
  {
    id: "tx-6",
    dateStr: "February 10, 2026",
    timeStr: "9:00 AM",
    endTimeStr: "9:05 AM",
    type: "Deposit",
    method: "Nagad",
    methodIcon: "nagad",
    amount: 13500,
    bonusAmount: 4050,
    status: "Rejected",
    errorMsg: "Something went wrong, please try again later. If the error repeats, please contact the payment provider or our support service."
  }
];

const getRelativeTimeString = (timestampInSecs: number) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestampInSecs;
  if (diff < 60) return "just now";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

import toast from 'react-hot-toast';

const DEFAULT_INDICATOR_SETTINGS = {
  "ADL": { enabled: false, color: "#f59e0b", strokeWidth: 2 },
  "MFI": { enabled: false, period: 14, color: "#10b981", strokeWidth: 2 },
  "OBV": { enabled: false, color: "#8b5cf6", strokeWidth: 2 },
  "ForceIndex": { enabled: false, period: 13, color: "#06b6d4", strokeWidth: 2 },
  "Parabolic SAR": { enabled: false, step: 0.02, max: 0.2, color: "#f43f5e", strokeWidth: 2 },
  "VWAP": { enabled: false, color: "#6366f1", strokeWidth: 2 },
  "Ichimoku Cloud": { enabled: false, conversionPeriod: 9, basePeriod: 26, spanPeriod: 52, displacement: 26, colorConversion: "#3b82f6", colorBase: "#ef4444" },
  "Standard Deviation": { enabled: false, period: 14, color: "#84cc16", strokeWidth: 2 },
  "RSI": { enabled: false, period: 14, color: "#3b82f6", strokeWidth: 2 },
  "MACD": { enabled: false, fast: 12, slow: 26, signal: 9, colorFast: "#3b82f6", colorSlow: "#ef4444" },
  "Bollinger Bands": { enabled: false, period: 20, stdDev: 2, color: "#3b82f6", strokeWidth: 2 },
  "Stochastic": { enabled: false, period: 14, signalPeriod: 3, kPeriod: 3, colorK: "#3b82f6", colorD: "#ef4444" },
  "SMA": { enabled: false, period: 14, color: "#f59e0b", strokeWidth: 2 },
  "EMA": { enabled: false, period: 14, color: "#10b981", strokeWidth: 2 },
  "WMA": { enabled: false, period: 14, color: "#ec4899", strokeWidth: 2 },
  "WEMA": { enabled: false, period: 14, color: "#8b5cf6", strokeWidth: 2 },
  "Moving Average": { enabled: false, period: 14, type: "SMA", color: "#f59e0b", strokeWidth: 2 },
  "ATR": { enabled: false, period: 14, color: "#06b6d4", strokeWidth: 2 },
  "ROC": { enabled: false, period: 14, color: "#f43f5e", strokeWidth: 2 },
  "CCI": { enabled: false, period: 20, color: "#6366f1", strokeWidth: 2 },
  "WilliamsR": { enabled: false, period: 14, color: "#14b8a6", strokeWidth: 2 },
  "TRIX": { enabled: false, period: 18, color: "#84cc16", strokeWidth: 2 },
  "ADX": { enabled: false, period: 14, color: "#eab308", strokeWidth: 2 },
  "KST": { enabled: false, colorFast: "#3b82f6", colorSlow: "#ef4444" },
  "StochRSI": { enabled: false, rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3, colorK: "#3b82f6", colorD: "#ef4444" },
  "Awesome Oscillator": { enabled: false, fastPeriod: 5, slowPeriod: 34, colorUp: "#22c55e", colorDown: "#ef4444" },
  "Keltner Channels": { enabled: false, period: 20, multiplier: 2, maPeriod: 20, color: "#3b82f6" },
  "Chandelier Exit": { enabled: false, period: 22, multiplier: 3, colorLong: "#22c55e", colorShort: "#ef4444" },
  "Alligator": { enabled: false, jawPeriod: 13, jawOffset: 8, teethPeriod: 8, teethOffset: 5, lipsPeriod: 5, lipsOffset: 3, colorJaw: "#3b82f6", colorTeeth: "#ef4444", colorLips: "#22c55e" },
  "ZigZag": { enabled: false, deviation: 5, depth: 10, color: "#f59e0b", strokeWidth: 2 },
  "Gator Oscillator": { enabled: false, colorUp: "#22c55e", colorDown: "#ef4444" },
  "Social Trading": { enabled: false },
  "Fractals": { enabled: false, colorUp: "#22c55e", colorDown: "#ef4444" },
  "Momentum": { enabled: false, period: 14, color: "#ec4899" }
};

const TournamentLeaderboard = ({ tournamentId }: { tournamentId: string }) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Real-time subscribe to the tournament participants subcollection
    const q = query(
      collection(db, 'tournaments', tournamentId, 'participants'),
      orderBy('score', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      
      // If empty, generate high-fidelity real mock participants to simulate other real active users trading!
      if (list.length === 0) {
        setParticipants([
          { displayName: "Alex_FX", score: 24750.0, tradesCount: 42, isMock: true },
          { displayName: "Bivaax_King", score: 18420.0, tradesCount: 31, isMock: true },
          { displayName: "SmartTrader", score: 12150.0, tradesCount: 25, isMock: true },
          { displayName: "ProfitSeeker", score: 8540.0, tradesCount: 19, isMock: true },
          { displayName: "VIP_Member", score: 4320.0, tradesCount: 12, isMock: true },
          { displayName: "CryptoBull", score: 2850.0, tradesCount: 8, isMock: true },
        ]);
      } else {
        setParticipants(list);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Leaderboard listen error:", err);
      // Fallback on error
      setParticipants([
        { displayName: "Alex_FX", score: 24750.0, tradesCount: 42, isMock: true },
        { displayName: "Bivaax_King", score: 18420.0, tradesCount: 31, isMock: true },
        { displayName: "SmartTrader", score: 12150.0, tradesCount: 25, isMock: true },
        { displayName: "ProfitSeeker", score: 8540.0, tradesCount: 19, isMock: true },
        { displayName: "VIP_Member", score: 4320.0, tradesCount: 12, isMock: true },
        { displayName: "CryptoBull", score: 2850.0, tradesCount: 8, isMock: true },
      ]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tournamentId]);

  return (
    <div className="bg-[#121318]/40 border border-white/5 rounded-2xl p-4 md:p-6 mt-4">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-[#FFE24C]" />
          <h5 className="text-[12px] md:text-[14px] font-black uppercase text-white tracking-wider">Tournament Leaderbox (Top 10)</h5>
        </div>
        <span className="text-[10px] md:text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">LIVE UPDATE</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {participants.map((player, idx) => {
            const rank = idx + 1;
            const isCurrentUser = auth.currentUser?.uid === player.id;
            
            return (
              <div 
                key={player.id || `mock-${idx}`}
                className={`flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-xl border transition-all ${
                  isCurrentUser 
                    ? "bg-[#FFE24C]/10 border-[#FFE24C]/30 shadow-[0_0_15px_rgba(254,226,76,0.1)]" 
                    : "bg-[#18191e]/60 border-white/[0.02] hover:bg-[#1e1f24]"
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Rank Badge */}
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-[11px] md:text-sm shrink-0 border ${
                    rank === 1 ? "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 border-yellow-200 text-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.4)]" :
                    rank === 2 ? "bg-gradient-to-br from-gray-200 via-gray-400 to-gray-500 border-gray-100 text-gray-900 shadow-[0_0_15px_rgba(156,163,175,0.4)]" :
                    rank === 3 ? "bg-gradient-to-br from-amber-500 via-amber-700 to-amber-800 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(180,83,9,0.4)]" :
                    "bg-[#25272d] border-white/5 text-gray-400"
                  }`}>
                    {rank}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-[13px] md:text-[15px] font-black truncate tracking-tight ${isCurrentUser ? 'text-[#FFE24C]' : 'text-white'}`}>
                      {player.displayName || "Anonymous"}
                    </span>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">{player.tradesCount || 0} Trades</span>
                       {player.isMock && <span className="text-[8px] bg-white/5 text-gray-500 px-1 py-0.2 rounded border border-white/5">Real-time</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5">
                      <span className={`font-black text-[15px] md:text-[17px] tracking-tighter ${isCurrentUser ? 'text-[#FFE24C]' : 'text-white'}`}>
                        â‚®{player.score.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                      <Icons.TrendingUp size={12} className="text-emerald-400" />
                   </div>
                   <div className="flex items-center gap-1">
                      <span className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-tighter">ROI +{(120 + Math.floor(Math.random() * 500))}%</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const STORIES = [
  {
    id: 'activities-hub',
    title: 'Activities Hub',
    description: 'Explore tournaments, deposit bonuses, economic calendar, and educational resources directly from your dashboard.',
    imageUrl: 'https://i.postimg.cc/NFXnXHrw/file-00000000110081fa8ffe4ae74614b59a.png',
    link: '/news/activities-hub'
  },
  {
    id: 'market-overview',
    title: 'Market Overview',
    description: 'Explore multiple market trends and charts in one comprehensive view.',
    imageUrl: 'https://i.postimg.cc/N0vbSPmn/IMG-20260803-175740-340.jpg',
    link: '/news/market-overview'
  },
  {
    id: 'history-nav',
    title: 'History Navigation',
    description: 'Swipe through the chart to see historical data and past performance.',
    imageUrl: 'https://i.postimg.cc/yNTh56V8/IMG-20260803-175740-402.jpg',
    link: '/news/history-nav'
  },
  {
    id: 'new-mechanics',
    title: 'New Mechanics',
    description: 'Explore the latest enhancements and features in our updated trading engine.',
    imageUrl: 'https://i.postimg.cc/SNWdk64P/file-00000000511481fa82533f375be9869f.png',
    link: '/news/new-mechanics'
  },
  {
    id: 'trend-analysis',
    title: 'Trend Analysis',
    description: 'Understand market trends using advanced technical indicators and tools.',
    imageUrl: 'https://i.postimg.cc/TPXXhq5D/file-0000000041348208ad773129ec36dec3.png',
    link: '/news/trend-analysis'
  },
  {
    id: 'social-trading',
    title: 'Social Trading',
    description: 'Connect with a global community of traders and share your success.',
    imageUrl: 'https://i.postimg.cc/XvZFVzz7/file-00000000aa30821198dc51f01fa3ed44.png',
    link: '/news/social-trading'
  },
  {
    id: 'smart-signals',
    title: 'Smart Signals',
    description: 'Get real-time, high-probability trading signals delivered directly to your terminal.',
    imageUrl: 'https://i.postimg.cc/xTJS3Gh0/file-000000005d9c82098104f326333bf72d.png',
    link: '/news/smart-signals'
  },
  {
    id: 'crypto-profits',
    title: 'Crypto Profits',
    description: 'Maximize your earnings with high-payout crypto assets on Bivaax.',
    imageUrl: 'https://i.postimg.cc/g2zQBvBx/file-000000002ff08209a59650bce6f23599.png',
    link: '/news/crypto-profits'
  },
];

export const binanceSymbolsMap: Record<string, string> = {
  'BTC/USD': 'BTCUSDT',
  'ETH/USD': 'ETHUSDT',
  'LTC/USD': 'LTCUSDT',
  'SOL/USD': 'SOLUSDT',
  'ADA/USD': 'ADAUSDT',
  'UNI/USD': 'UNIUSDT',
  'LINK/USD': 'LINKUSDT',
  'TON/USD': 'TONUSDT',
  'BCH/USD': 'BCHUSDT',
  'AVAX/USD': 'AVAXUSDT',
  'DOT/USD': 'DOTUSDT',
  'POL/USD': 'POLUSDT',
  'AAVE/USD': 'AAVEUSDT',
  'SHIB/USD': 'SHIBUSDT',
  'DOGE/USD': 'DOGEUSDT',
  'XRP/USD': 'XRPUSDT',
  'CAKE/USD': 'CAKEUSDT',
  'FET/USD': 'FETUSDT',
  'ICP/USD': 'ICPUSDT',
  'KSM/USD': 'KSMUSDT',
  'LPT/USD': 'LPTUSDT'
};

export const mapTimeframeToBinanceInterval = (tf: string): string => {
  switch (tf) {
    case '1 second': return '1s';
    case '5 seconds': return '1s';
    case '10 seconds': return '1s';
    case '15 seconds': return '1s';
    case '30 seconds': return '1s';
    case '1 minute': return '1m';
    case '5 minutes': return '5m';
    case '15 minutes': return '15m';
    case '30 minutes': return '30m';
    case '1 hour': return '1h';
    case '4 hours': return '4h';
    case '1 day': return '1d';
    default: return '1m';
  }
};

const DepositSkeleton = () => {
  return (
    <motion.div 
      className="flex flex-col gap-2 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {[1, 2, 3, 4, 5, 6].map((i, index) => (
        <motion.div 
          key={i} 
          className="premium-shimmer-container rounded-[16px] flex items-center min-h-[64px] px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        >
          <div className="w-11 h-11 rounded-full bg-[#323236] shrink-0 z-10 shadow-inner" />
          <div className="flex flex-col ml-4 gap-2.5 w-full z-10">
            <div className="w-32 h-3.5 rounded-full bg-[#323236]" />
            <div className="w-20 h-2.5 rounded-full bg-[#2a2a2e]" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const DEFAULT_DEPOSIT_METHODS = [
  { id: "bkash", name: "bKash", provider: "bKash", logo: "bkash", logoType: 'text', category: "E-wallets", bgColor: "#E2136E", time: "Instant", instant: true, minDeposit: 500, maxDeposit: 25000, isPopular: true, currency: "BDT", isActive: true },
  { id: "nagad", name: "Nagad", provider: "Nagad", logo: "nagad", logoType: 'text', category: "E-wallets", bgColor: "#EC2A24", time: "Instant", instant: true, minDeposit: 500, maxDeposit: 25000, isPopular: true, currency: "BDT", isActive: true },
  { id: "rocket", name: "Rocket", provider: "Rocket", logo: "rocket", logoType: 'text', category: "E-wallets", bgColor: "#8B2E88", time: "Instant", instant: true, minDeposit: 500, maxDeposit: 25000, isPopular: true, currency: "BDT", isActive: true },
  { id: "binance-pay", name: "Binance Pay", provider: "Binance", logo: "https://i.postimg.cc/RVJPryCQ/images-(1).jpg", logoType: 'image', category: "Crypto", bgColor: "#FCD535", time: "Instant", instant: true, minDeposit: 10, maxDeposit: 40000, isPopular: true, currency: "USDT", isActive: true },
  { id: "usdt-trc20", name: "USDT (TRC-20)", provider: "Tether", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png", logoType: 'image', category: "Crypto", bgColor: "#26A17B", time: "30-60 Min", instant: false, minDeposit: 1, maxDeposit: 10000, isPopular: true, currency: "USDT", isActive: true },
  { id: "bitcoin", name: "Bitcoin", provider: "BTC", logo: "https://s2.coinmarketcap.com/static/img/coins/200x200/1.png", logoType: 'image', category: "Crypto", bgColor: "#F7931A", time: "30-60 Min", instant: false, minDeposit: 0.0001, maxDeposit: 10, currency: "BTC", isActive: true },
  { id: "perfect-money", name: "Perfect Money", provider: "Perfect Money", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perfect-money-icon.png", logoType: 'image', category: "E-wallets", bgColor: "#E61A24", time: "Instant", instant: true, minDeposit: 10, maxDeposit: 5000, currency: "USD", isActive: true }
];

export default function TradeTerminal() {
  const { openSupport } = useSupport();
  const failedFetchRef = useRef(new Set<string>());
  const lastRequestedRef = useRef<Record<string, number>>({});
  const navigate = useNavigate();
  const [showDeposit, setShowDeposit] = useState(false);
  const [cashierTab, setCashierTab] = useState<"deposits" | "withdrawals" | "history">("deposits");
  const [currentWithdrawStory, setCurrentWithdrawStory] = useState(0);

  useEffect(() => {
    if (cashierTab === 'withdrawals') {
      const timer = setInterval(() => {
        setCurrentWithdrawStory((prev) => (prev + 1) % 4);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [cashierTab]);
  const [showCashierMenu, setShowCashierMenu] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const actionParam = searchParams.get('action');
  const accountParam = searchParams.get('account');
  const [isAppLoading, setIsAppLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  const [accountType, setAccountType] = useState<"demo" | "real" | "tournament">(() => {
    const fromUrl = searchParams.get('account');
    if (fromUrl === 'real' || fromUrl === 'demo' || fromUrl === 'tournament') return fromUrl as any;
    const saved = localStorage.getItem('bivax_account_type');
    return (saved === 'real' || saved === 'demo' || saved === 'tournament') ? (saved as any) : 'demo';
  });
  const accountTypeRef = useRef(accountType);
  useEffect(() => {
    accountTypeRef.current = accountType;
  }, [accountType]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [showPromoAdModal, setShowPromoAdModal] = useState(false);


  const [userTrades, setUserTrades] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('bivaax_trades_cache');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [tradeNotifications, setTradeNotifications] = useState<any[]>([]);
  const notifiedTradesRef = useRef<Set<string>>(new Set());

  const addTradeNotification = useCallback((tradeNotif: { id: string | number; tradeId?: string | number; firebaseId?: string; firebase_id?: string; status: string; asset: string; amount: number }) => {
    const id1 = tradeNotif.id ? String(tradeNotif.id) : '';
    const id2 = tradeNotif.tradeId ? String(tradeNotif.tradeId) : '';
    const id3 = tradeNotif.firebaseId ? String(tradeNotif.firebaseId) : '';
    const id4 = tradeNotif.firebase_id ? String(tradeNotif.firebase_id) : '';
    const allIds = [id1, id2, id3, id4].filter(Boolean);

    // If ANY ID of this trade has already triggered a notification, skip completely to avoid doubling amounts or counts
    if (allIds.length > 0 && allIds.some(id => notifiedTradesRef.current.has(id))) {
      return;
    }

    // Mark all IDs of this trade as notified
    allIds.forEach(id => notifiedTradesRef.current.add(id));

    if (notifiedTradesRef.current.size > 1000) {
      notifiedTradesRef.current.clear();
      allIds.forEach(id => notifiedTradesRef.current.add(id));
    }

    setTradeNotifications(prev => {
      const now = Date.now();
      const primaryId = id1 || id2 || id3 || id4 || Math.random().toString();

      let foundGroup = false;
      const updated = prev.map(n => {
        // Group if same asset, same status, and within a recent time window (3.5s)
        if (n.asset === tradeNotif.asset && n.status === tradeNotif.status && Math.abs(now - (n.timestamp || 0)) < 3500) {
          foundGroup = true;
          return {
            ...n,
            amount: n.amount + tradeNotif.amount,
            count: (n.count || 1) + 1,
            processedIds: [...(n.processedIds || [n.id]), ...allIds],
            timestamp: now
          };
        }
        return n;
      });

      if (foundGroup) {
        return updated.filter(n => now - (n.timestamp || 0) < 4000).slice(-5);
      }

      const newNotif = {
        id: primaryId,
        tradeId: primaryId,
        status: tradeNotif.status,
        asset: tradeNotif.asset,
        amount: tradeNotif.amount,
        timestamp: now,
        count: 1,
        processedIds: allIds
      };

      const fresh = prev.filter(n => now - (n.timestamp || 0) < 4000);
      return [...fresh, newNotif].slice(-5);
    });
  }, []);

  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketReply, setTicketReply] = useState("");
  const [ticketAttachedFiles, setTicketAttachedFiles] = useState<string[]>([]);
  const ticketFileInputRef = useRef<HTMLInputElement>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [isScrolledBack, setIsScrolledBack] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showRegulations, setShowRegulations] = useState(false);
  const [showClientAgreement, setShowClientAgreement] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [aboutUsData, setAboutUsData] = useState<any>(null);
  const [regulationsData, setRegulationsData] = useState<any>(null);
  const [clientAgreementData, setClientAgreementData] = useState<any>(null);

  // Prevent browser viewport physical zoom on touchpad/touchscreen gestures within the terminal
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Use passive: false to allow calling preventDefault() to block the browser zoom
    document.addEventListener("touchstart", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventZoom, { passive: false });
    document.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchmove", preventZoom);
      document.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
        setTradeNotifications(prev => {
          const now = Date.now();
          const next = prev.filter(n => now - (n.timestamp || 0) < 4000);
          if (next.length === prev.length) {
            const allSame = next.every((n, i) => n.id === prev[i].id && n.amount === prev[i].amount && n.count === prev[i].count);
            if (allSame) return prev;
          }
          return next;
        });
      }, 300);
      return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticketMessages, isBotTyping]);
  
  const bootApp = async () => {
    try {
      const [
        settingsSnap, aboutSnap, regulationsSnap, agreementSnap,
        newsSnap, eduSnap, promosSnap, tourneysSnap, depMethodsSnap
      ] = await Promise.all([
        getDoc(doc(db, 'app_config', 'settings')),
        getDoc(doc(db, 'pages', 'about_us')),
        getDoc(doc(db, 'pages', 'regulations')),
        getDoc(doc(db, 'pages', 'client_agreement')),
        getDocs(query(collection(db, 'news'), orderBy('date', 'desc'), limit(20))),
        getDocs(query(collection(db, 'education'), limit(20))),
        getDocs(query(collection(db, 'promotions'), limit(20))),
        getDocs(query(collection(db, 'tournaments'), limit(20))),
        getDocs(query(collection(db, 'depositMethods'), limit(50)))
      ]);
      
      if (settingsSnap.exists()) setAppConfig(settingsSnap.data());
      if (aboutSnap.exists()) setAboutUsData(aboutSnap.data());
      if (regulationsSnap.exists()) setRegulationsData(regulationsSnap.data());
      if (agreementSnap.exists()) setClientAgreementData(agreementSnap.data());
      
      setNewsData(newsSnap.docs.map((d: any) => ({id: d.id, ...d.data()})));
      setEducationData(eduSnap.docs.map((d: any) => ({id: d.id, ...d.data()})));
      setPromotionsData(promosSnap.docs.map((d: any) => ({id: d.id, ...d.data()})));
      setTournamentsData(tourneysSnap.docs.map((d: any) => ({id: d.id, ...d.data()})));
      
      try {
        const tRes = await fetch('/api/tournaments');
        const tData = await tRes.json();
        if (tData.success && tData.tournaments) {
          setTournamentsData(tData.tournaments);
        }
      } catch(err) {
        console.warn("Failed to fetch API tournaments", err);
      }
      
      if (depMethodsSnap && depMethodsSnap.docs.length > 0) {
        const deps = depMethodsSnap.docs.map((d: any) => ({id: d.id, ...d.data()}));
        setDepositMethods(deps);
        console.log("Terminal Boot Success. Methods:", deps.length);
      }
      setIsDepositMethodsLoading(false);

    } catch (e: any) {
      console.warn("Application boot issue:", e.message);
      setIsDepositMethodsLoading(false);
    }
  };

  useEffect(() => {
    bootApp();
    
    // Real-time subscription to deposit methods
    const unsub = onSnapshot(collection(db, 'depositMethods'), (snap) => {
      if (!snap.empty) {
        const deps = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        setDepositMethods(deps);
      }
      setIsDepositMethodsLoading(false);
    }, (err) => {
      console.warn("Real-time Methods Update error:", err);
      setIsDepositMethodsLoading(false);
    });

    return () => unsub();
  }, []);
  
  const getAIReply = async (_ticketId: string, _message: string) => {
    // Automated AI reply disabled: User inquiries are handled manually by the admin support team.
    return;
  };
  
  useEffect(() => {
    let unsubs: (() => void)[] = [];
    
    const unsubAuth = onAuthStateChanged(auth, (user) => {
        // Clear previous listeners if any (e.g. on re-auth or logout)
        unsubs.forEach(unsub => unsub());
        unsubs = [];
        
        setCurrentUser(prev => prev?.uid !== user?.uid ? user : prev);

        if (!user) {
            setIsAdmin(false);
            setActiveTrades(prev => prev.length === 0 ? prev : []);
            setUserTrades(prev => prev.length === 0 ? prev : []);
            setUserTickets(prev => prev.length === 0 ? prev : []);
            return;
        }

        // Initial Profile Fetch
        const syncUser = async () => {
          const controller = new AbortController();
          unsubs.push(() => controller.abort());

          const ref = localStorage.getItem('referral_code');
          const sub = localStorage.getItem('referral_sub_id');
          const type = localStorage.getItem('referral_type');

          const payload = { 
            uid: user.uid, 
            email: user.email, 
            displayName: user.displayName, 
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            referralCode: ref,
            referralSubId: sub,
            referralType: type
          };

          const maxRetries = 3;
          let delay = 500;

          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              const response = await fetch('/api/user/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
              });
              if (response.ok) {
                const syncData = await response.json().catch(() => null);
                const uData = syncData?.data || syncData?.user;
                if (uData) {
                  if (uData.currency) {
                    setUserCurrency(uData.currency);
                    userCurrencyRef.current = uData.currency;
                  }
                  if (uData.balance !== undefined || uData.realBalance !== undefined || uData.real_balance !== undefined) {
                    const rawBal = uData.balance ?? uData.realBalance ?? uData.real_balance;
                    const val = parseFloat(rawBal?.toString());
                    if (!isNaN(val)) {
                      setRealBalance(val);
                      realBalanceRef.current = val;
                    }
                  }
                  if (uData.demoBalance !== undefined || uData.demo_balance !== undefined) {
                    const rawDemo = uData.demoBalance ?? uData.demo_balance;
                    const dval = parseFloat(rawDemo?.toString());
                    if (!isNaN(dval)) {
                      setDemoBalance(dval);
                      demoBalanceRef.current = dval;
                    }
                  }
                  if (uData.nickname) {
                    setNickname(uData.nickname);
                    setSavedNickname(uData.nickname);
                    savedNicknameRef.current = uData.nickname;
                  }
                  if (uData.firstName || uData.lastName || uData.gender || uData.dob || uData.birthDay) {
                    let day = uData.birthDay || "--";
                    let month = uData.birthMonth || "--";
                    let year = uData.birthYear || "--";
                    if (uData.dob && (day === "--" || month === "--" || year === "--")) {
                      let parsed = typeof uData.dob === 'string' ? null : uData.dob;
                      if (typeof uData.dob === 'string') {
                        try { parsed = JSON.parse(uData.dob); } catch(e) {}
                      }
                      if (parsed && typeof parsed === 'object') {
                        if (parsed.day) day = String(parsed.day);
                        if (parsed.month) month = String(parsed.month);
                        if (parsed.year) year = String(parsed.year);
                      }
                    }
                    setPersonalData(prev => {
                      const next = {
                        firstName: uData.firstName ?? prev.firstName,
                        lastName: uData.lastName ?? prev.lastName,
                        gender: (uData.gender && uData.gender !== "---" && uData.gender !== "--") ? uData.gender : prev.gender,
                        day: day !== "--" ? day : prev.day,
                        month: month !== "--" ? month : prev.month,
                        year: year !== "--" ? year : prev.year,
                        country: uData.country ?? prev.country
                      };
                      setSavedPersonalData(next);
                      if (user?.uid) {
                        try { localStorage.setItem(`bivax_personal_data_${user.uid}`, JSON.stringify(next)); } catch(e) {}
                      }
                      return next;
                    });
                  }
                }
                break; // Succeeded! Exit the loop.
              }
              throw new Error(`HTTP ${response.status}`);
            } catch (e: any) {
              if (e.name === 'AbortError') {
                return; // Silently exit if aborted cleanly
              }
              if (attempt === maxRetries) {
                console.warn(`[UserSync] Sync failed after ${maxRetries} attempts:`, e.message || e);
              } else {
                await new Promise(r => setTimeout(r, delay));
                delay *= 2; // Exponential backoff
              }
            }
          }
        };
        syncUser();

        const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
                // Ignore stale local IndexedDB cache snapshots on reload
                if (docSnap.metadata.fromCache) return;
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.currency && userCurrencyRef.current !== userData.currency) {
                        setUserCurrency(userData.currency);
                        userCurrencyRef.current = userData.currency;
                    }
                    if (userData.balance !== undefined || userData.realBalance !== undefined || userData.real_balance !== undefined) {
                        const raw = userData.balance ?? userData.realBalance ?? userData.real_balance;
                        const newBal = parseFloat(raw?.toString());
                        if (!isNaN(newBal)) {
                            setRealBalance(newBal);
                            realBalanceRef.current = newBal;
                        }
                    }
                    if (userData.demoBalance !== undefined || userData.demo_balance !== undefined) {
                        const raw = userData.demoBalance ?? userData.demo_balance;
                        const newDemo = parseFloat(raw?.toString());
                        if (!isNaN(newDemo)) {
                            setDemoBalance(newDemo);
                            demoBalanceRef.current = newDemo;
                        }
                    }
                    if (userData.affiliateId !== undefined && affIdRef.current !== userData.affiliateId) {
                        setAffId(userData.affiliateId);
                        affIdRef.current = userData.affiliateId;
                    }
                    if (userData.totalLiveVolume !== undefined && totalLiveVolumeRef.current !== userData.totalLiveVolume) {
                        setTotalLiveVolume(userData.totalLiveVolume);
                        totalLiveVolumeRef.current = userData.totalLiveVolume;
                    }

                    if (userData.isVerified !== undefined && isVerifiedRef.current !== userData.isVerified) {
                        setIsVerified(userData.isVerified);
                        isVerifiedRef.current = userData.isVerified;
                    }

                    if (userData.kycStatus) {
                      setKycStatus(userData.kycStatus);
                    }

                    if (userData.tfaEnabled !== undefined) {
                      setIs2FAEnabled(userData.tfaEnabled);
                    }

                    if (userData.phone || userData.phoneNumber) {
                      setPhone(userData.phone || userData.phoneNumber);
                    }
                    if (userData.isPhoneVerified !== undefined || userData.phoneVerified !== undefined) {
                      setIsPhoneVerified(!!userData.isPhoneVerified || !!userData.phoneVerified);
                    }
                    
                    if (userData.timeZone) {
                      const normalizedTZ = (userData.timeZone === 'UTC+00:00' || !userData.timeZone) ? 'UTC' : userData.timeZone;
                      if (timeZoneRef.current !== normalizedTZ) {
                        setTimeZone(normalizedTZ);
                        timeZoneRef.current = normalizedTZ;
                      }
                    }
                    if (userData.language) {
                      const lang = LANGUAGES.find(l => l.code === userData.language);
                      if (lang && selectedLanguageRef.current?.code !== lang.code) {
                        setSelectedLanguage(lang);
                        selectedLanguageRef.current = lang;
                      }
                    }
                    if (userData.nickname && savedNicknameRef.current !== userData.nickname) {
                      setNickname(userData.nickname);
                      setSavedNickname(userData.nickname);
                      savedNicknameRef.current = userData.nickname;
                    }
                    if (userData.firstName !== undefined || userData.lastName !== undefined || userData.gender !== undefined || userData.dob !== undefined || userData.birthDay !== undefined || userData.country !== undefined) {
                      let day = "--";
                      let month = "--";
                      let year = "--";
                      if (userData.dob) {
                        let parsed = typeof userData.dob === 'string' ? null : userData.dob;
                        if (typeof userData.dob === 'string') {
                          try { parsed = JSON.parse(userData.dob); } catch(e) {}
                        }
                        if (parsed && typeof parsed === 'object') {
                          if (parsed.day) day = String(parsed.day);
                          if (parsed.month) month = String(parsed.month);
                          if (parsed.year) year = String(parsed.year);
                        }
                      }
                      if (userData.birthDay && userData.birthDay !== "--") day = String(userData.birthDay);
                      if (userData.birthMonth && userData.birthMonth !== "--") month = String(userData.birthMonth);
                      if (userData.birthYear && userData.birthYear !== "--") year = String(userData.birthYear);

                      setPersonalData(prev => {
                        const next = {
                          firstName: userData.firstName ?? userData.first_name ?? prev.firstName,
                          lastName: userData.lastName ?? userData.last_name ?? prev.lastName,
                          gender: (userData.gender && userData.gender !== "---" && userData.gender !== "--") ? userData.gender : prev.gender,
                          day: day !== "--" ? day : prev.day,
                          month: month !== "--" ? month : prev.month,
                          year: year !== "--" ? year : prev.year,
                          country: userData.country ?? prev.country
                        };
                        setSavedPersonalData(next);
                        if (user?.uid) {
                          try { localStorage.setItem(`bivax_personal_data_${user.uid}`, JSON.stringify(next)); } catch(e) {}
                        }
                        return next;
                      });
                    }
                    if (userData.readNewsIds) {
                      setReadNewsIds(userData.readNewsIds);
                    }
                    if (userData.readPromotionsIds) {
                      setReadPromotionsIds(userData.readPromotionsIds);
                    }
            }
        }, async (e) => {
            console.warn("Profile real-time fetch failed, falling back to server-side REST sync:", e.message);
            
            // Avoid immediate retry if we're hitting rate limits
            if (e.message?.includes('quota') || e.message?.includes('RESOURCE_EXHAUSTED')) {
                toast.error("Database limit reached. Switching to reduced-update mode.");
                return;
            }

            try {
                const res = await fetch('/api/user/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL })
                });
                
                if (res.status === 429) return; // Silent skip for rate limit, we already warned

                if (res.ok) {
                    const resJson = await res.json().catch(() => ({}));
                    if (resJson.success && resJson.data) {
                        const userData = resJson.data;
                        if (userData.currency) setUserCurrency(userData.currency);
                        if (userData.balance !== undefined) {
                            const val = parseFloat(userData.balance?.toString());
                            setRealBalance(isNaN(val) ? 0 : val);
                        }
                        if (userData.demoBalance !== undefined) {
                            const val = parseFloat(userData.demoBalance?.toString());
                            setDemoBalance(isNaN(val) ? 10000 : val);
                        }
                        if (userData.affiliateId !== undefined) setAffId(userData.affiliateId);
                        if (userData.totalLiveVolume !== undefined) {
                            const val = parseFloat(userData.totalLiveVolume?.toString());
                            setTotalLiveVolume(isNaN(val) ? 0 : val);
                        }
                        if (userData.timeZone) {
                          const normalizedTZ = (userData.timeZone === 'UTC+00:00' || !userData.timeZone) ? 'UTC' : userData.timeZone;
                          setTimeZone(normalizedTZ);
                        }
                    }
                }
            } catch (err) {
                console.error("Profile REST fallback sync failed:", err);
            }
        });
        unsubs.push(unsubUser);



        // Optional: Keep Firestore for real-time legacy sync if needed, but don't let it overwrite REST
        const unsubOpenTrades = onSnapshot(query(collection(db, 'trades'), where('userId', '==', user.uid), where('status', '==', 'open')), (snapshot) => {
            if (snapshot.empty) return;
            const open = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setActiveTrades(prev => {
                const now = Date.now();
                
                const serverOpenTrades = open.map((t: any) => {
                    const rawExp = t.expirationTime || (t.expiryTime ? t.expiryTime * 1000 : (t.expiry_time ? t.expiry_time * 1000 : null));
                    const expMs = typeof rawExp === 'number' ? (rawExp < 100000000000 ? rawExp * 1000 : rawExp) : (rawExp && typeof rawExp.toDate === 'function' ? rawExp.toDate().getTime() : now);
                    const computedTime = Math.max(0, Math.floor((expMs - now) / 1000));
                    return {
                        ...t,
                        id: String(t.id),
                        type: t.type || t.direction || 'up',
                        direction: t.direction || t.type || 'up',
                        asset: t.asset || t.marketId || t.market_id,
                        accountType: t.accountType || t.account_type || (t.isDemo || t.is_demo ? 'demo' : 'real'),
                        timeLeft: computedTime,
                        expirationTime: expMs,
                        createdAt: t.createdAt || now
                    };
                }).filter(t => t.timeLeft > 0);

                const mergedMap = new Map<string, any>();
                const matchedServerIds = new Set<string>();

                serverOpenTrades.forEach(t => mergedMap.set(String(t.id), t));

                prev.forEach((p: any) => {
                    const pExp = typeof p.expirationTime === 'number' ? p.expirationTime : now + (p.timeLeft || 0) * 1000;
                    if (pExp <= now) return; // expired

                    const pId = String(p.id);
                    const pFbId = p.firebaseId || p.firebase_id ? String(p.firebaseId || p.firebase_id) : '';

                    // Direct match by ID or firebaseId
                    const directMatch = serverOpenTrades.find((s: any) => {
                        const sId = String(s.id);
                        const sFbId = s.firebaseId || s.firebase_id ? String(s.firebaseId || s.firebase_id) : '';
                        return sId === pId || (sFbId && sFbId === pId) || (pFbId && sId === pFbId) || (sFbId && pFbId && sFbId === pFbId);
                    });

                    if (directMatch) {
                        matchedServerIds.add(String(directMatch.id));
                        return;
                    }

                    // Fuzzy match against un-matched server trades
                    const fuzzyMatch = serverOpenTrades.find((s: any) => {
                        const sId = String(s.id);
                        if (matchedServerIds.has(sId)) return false;
                        const matchAsset = s.asset === p.asset;
                        const matchType = (s.type || s.direction) === (p.type || p.direction);
                        const matchAcc = (s.accountType || 'real') === (p.accountType || 'real');
                        const matchAmt = Math.abs(Number(s.amount) - Number(p.amount)) < 0.01;
                        const matchExp = Math.abs((s.expirationTime || 0) - (p.expirationTime || 0)) < 15000;
                        const matchCreated = p.createdAt && s.createdAt ? Math.abs(Number(s.createdAt) - Number(p.createdAt)) < 15000 : true;
                        return matchAsset && matchType && matchAcc && matchAmt && (matchExp || matchCreated);
                    });

                    if (fuzzyMatch) {
                        matchedServerIds.add(String(fuzzyMatch.id));
                        return;
                    }

                    const isVeryRecent = p.createdAt && (now - p.createdAt < 8000);
                    if (isVeryRecent) {
                        mergedMap.set(pId, p);
                    }
                });
                
                return Array.from(mergedMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            });
        }, (err) => {
            console.warn("Firestore unsubOpenTrades sync issue:", err);
        });
        unsubs.push(unsubOpenTrades);
            
            // Fetch closed trades once (legacy sync, REST handles primary now)
            getDocs(query(collection(db, 'trades'), where('userId', '==', user.uid), where('status', '!=', 'open'), limit(50))).then(snap => {
                if (snap.empty) return;
                const closed = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setUserTrades(prev => {
                  const combined = [...prev, ...closed];
                  return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).sort((a, b) => {
                      const d1 = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt || 0);
                      const d2 = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt || 0);
                      return d2 - d1;
                  }).slice(0, 100);
                });
            }).catch(async (err) => {
                // REST already called on mount, no need to retry here unless desired
            });

            // Tickets - convert to getDocs to save quota. Individual ticket messages still use onSnapshot.
            getDocs(query(collection(db, 'tickets'), where('userId', '==', user.uid), limit(20))).then(snap => {
               const tickets = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
               tickets.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
               setUserTickets(tickets);
            }).catch(async (err) => {
               console.warn("Tickets client fetch issue, falling back to server-side REST fetch:", err.message);
               try {
                   if (!user || !user.uid) {
                       console.error("Tickets REST fetch failed: User is undefined or has no UID");
                       return;
                   }
                   const res = await fetch(`/api/user-tickets?userId=${user.uid}`);
                   if (res.ok) {
                       const resJson = await res.json();
                       if (resJson.success && resJson.tickets) {
                           const tickets = resJson.tickets;
                           tickets.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
                           setUserTickets(tickets);
                       }
                   } else {
                       console.error("Tickets REST fetch failed with status:", res.status);
                   }
               } catch (err: any) {
                   console.error("Tickets REST fetch failed:", err.message);
               }
            });

            // Admin Check
            const rawAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
            const adminEmail = (rawAdminEmail && rawAdminEmail !== 'undefined' && rawAdminEmail !== 'null' && rawAdminEmail.trim() !== '') 
                ? rawAdminEmail.toLowerCase().trim() 
                : "hamproosapport@gmail.com";
            const userEmail = user.email?.toLowerCase();
            const isSuperUser = (adminEmail && userEmail === adminEmail) || userEmail === "msbivaax@gmail.com" || userEmail === "bivaaxtrader@gmail.com" || userEmail === "hasan1@gmail.com" || userEmail === "hasan@gmail.com" || userEmail === "hamproosapport@gmail.com" || userEmail === "hamproosupport@gmail.com" || userEmail === "bivaaxtrade@gmail.com" || user.uid === "HFvr43UhRiTSjb6m5sQJHmHGNvm1";
            if (isSuperUser) {
                setIsAdmin(true);
            }
            getDoc(doc(db, "admins", user.uid)).then(adminDoc => {
                if (adminDoc.exists()) {
                    setIsAdmin(true);
                }
            }).catch(() => {
                // If permission-denied reading admins, but user is indeed a superuser via email, grant admin UI
                if (isSuperUser) {
                    setIsAdmin(true);
                }
            });
    });

    return () => {
        unsubAuth();
        unsubs.forEach(unsub => unsub());
    };
  }, []);

  const fetchTrades = useCallback(async (retries = 3) => {
    if (!auth.currentUser?.uid) return;
    try {
        const res = await fetch(`/api/user-trades?userId=${auth.currentUser.uid}`);
        if (res.ok) {
            const resJson = await res.json().catch(() => ({}));
            if (resJson.success && resJson.trades) {
                const trades = resJson.trades;
                const open = trades.filter((t: any) => t.status === 'open');
                const closed = trades.filter((t: any) => t.status !== 'open');
                
                setActiveTrades(prev => {
                    const now = Date.now();
                    
                    const serverOpenTrades = open.map((t: any) => {
                        const rawExp = t.expirationTime || (t.expiryTime ? t.expiryTime * 1000 : (t.expiry_time ? t.expiry_time * 1000 : null));
                        const expMs = typeof rawExp === 'number' ? (rawExp < 100000000000 ? rawExp * 1000 : rawExp) : now;
                        const timeLeftSec = Math.max(0, Math.floor((expMs - now) / 1000));
                        const rawEntry = t.entryTime || t.createdAt || t.created_at || now;
                        const entryMs = typeof rawEntry === 'number' ? (rawEntry < 10000000000 ? rawEntry * 1000 : rawEntry) : new Date(rawEntry).getTime();
                        return {
                            ...t,
                            id: String(t.id),
                            type: t.type || t.direction || 'up',
                            direction: t.direction || t.type || 'up',
                            asset: t.asset || t.marketId || t.market_id,
                            entryPrice: Number(t.entryPrice || t.entry_price || 0),
                            accountType: t.accountType || t.account_type || (t.isDemo || t.is_demo ? 'demo' : 'real'),
                            isDemo: t.isDemo !== undefined ? t.isDemo : (t.accountType === 'demo' || t.is_demo),
                            timeLeft: timeLeftSec,
                            expirationTime: expMs,
                            entryTime: entryMs / 1000,
                            createdAt: entryMs
                        };
                    }).filter((t: any) => t.timeLeft > 0);

                    const mergedMap = new Map<string, any>();
                    const matchedServerIds = new Set<string>();

                    serverOpenTrades.forEach((t: any) => mergedMap.set(String(t.id), t));

                    prev.forEach((p: any) => {
                        const pExp = typeof p.expirationTime === 'number' ? p.expirationTime : now + (p.timeLeft || 0) * 1000;
                        if (pExp <= now) return; // expired

                        const pId = String(p.id);
                        const pFbId = p.firebaseId || p.firebase_id ? String(p.firebaseId || p.firebase_id) : '';

                        // Direct match by ID or firebaseId
                        const directMatch = serverOpenTrades.find((s: any) => {
                            const sId = String(s.id);
                            const sFbId = s.firebaseId || s.firebase_id ? String(s.firebaseId || s.firebase_id) : '';
                            return sId === pId || (sFbId && sFbId === pId) || (pFbId && sId === pFbId) || (sFbId && pFbId && sFbId === pFbId);
                        });

                        if (directMatch) {
                            matchedServerIds.add(String(directMatch.id));
                            return;
                        }

                        // Fuzzy match against un-matched server trades
                        const fuzzyMatch = serverOpenTrades.find((s: any) => {
                            const sId = String(s.id);
                            if (matchedServerIds.has(sId)) return false;
                            const matchAsset = s.asset === p.asset;
                            const matchType = (s.type || s.direction) === (p.type || p.direction);
                            const matchAcc = (s.accountType || 'real') === (p.accountType || 'real');
                            const matchAmt = Math.abs(Number(s.amount) - Number(p.amount)) < 0.01;
                            const matchExp = Math.abs((s.expirationTime || 0) - (p.expirationTime || 0)) < 15000;
                            const matchCreated = p.createdAt && s.createdAt ? Math.abs(Number(s.createdAt) - Number(p.createdAt)) < 15000 : true;
                            return matchAsset && matchType && matchAcc && matchAmt && (matchExp || matchCreated);
                        });

                        if (fuzzyMatch) {
                            matchedServerIds.add(String(fuzzyMatch.id));
                            return;
                        }

                        const isVeryRecent = p.createdAt && (now - p.createdAt < 8000);
                        if (isVeryRecent) {
                            mergedMap.set(pId, p);
                        }
                    });

                    return Array.from(mergedMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                });
                setUserTrades(closed);
                try {
                    localStorage.setItem('bivaax_trades_cache', JSON.stringify(closed.slice(0, 50)));
                } catch (e) {}
            }
        } else if (retries > 0) {
            setTimeout(() => fetchTrades(retries - 1), 1500);
        }
    } catch (err) {
        console.error("Trades initial fetch failed:", err);
        if (retries > 0) {
            setTimeout(() => fetchTrades(retries - 1), 2000);
        }
    }
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);
  useEffect(() => {
    if (!selectedTicket || !auth.currentUser) {
      setTicketMessages(prev => prev.length === 0 ? prev : []);
      return;
    }
    
    let unsubscribe: any;
    {
        if (!auth.currentUser) return; // double check
        const q = query(
          collection(db, "tickets", selectedTicket.id, "messages"), 
          orderBy("createdAt", "asc")
        );
        
        const tid = selectedTicket.id;
        unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTicketMessages(msgs);
        }, (error) => {
            // Only report if we are still logged in
            if (auth.currentUser) {
                handleFirestoreError(error, OperationType.GET, "tickets/" + tid + "/messages");
            }
        });
    }

    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, [selectedTicket]);

  const [timeLeft, setTimeLeft] = useState(13 * 3600 + 25 * 60 + 32);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 13 * 3600 + 25 * 60 + 32));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const [demoBalance, setDemoBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('demo_balance');
      return saved ? parseFloat(saved) : 10000.0;
    } catch {
      return 10000.0;
    }
  });
  const demoBalanceRef = useRef(demoBalance);
  useEffect(() => {
    demoBalanceRef.current = demoBalance;
    try {
      localStorage.setItem('demo_balance', demoBalance.toString());
    } catch {}
  }, [demoBalance]);

  const [realBalance, setRealBalance] = useState(0.0);
  const [isVerified, setIsVerified] = useState(false);
  const realBalanceRef = useRef(realBalance);
  const isVerifiedRef = useRef(false);
  useEffect(() => { realBalanceRef.current = realBalance; }, [realBalance]);
  useEffect(() => { isVerifiedRef.current = isVerified; }, [isVerified]);

  const [affId, setAffId] = useState<string | number>('');
  const affIdRef = useRef(affId);
  useEffect(() => { affIdRef.current = affId; }, [affId]);
  const [totalLiveVolume, setTotalLiveVolume] = useState(0.0);
  const totalLiveVolumeRef = useRef(totalLiveVolume);
  useEffect(() => { totalLiveVolumeRef.current = totalLiveVolume; }, [totalLiveVolume]);

  const [balance, setBalance] = useState(0.0);
  const [isPlacingTrade, setIsPlacingTrade] = useState(false);
  const isPlacingTradeRef = useRef(false);
  const [userCurrency, setUserCurrency] = useState(() => {
    try {
      return localStorage.getItem('user_display_currency') || 'USD';
    } catch (e) {
      return 'USD';
    }
  });
  const userCurrencyRef = useRef(userCurrency);
  useEffect(() => {
    userCurrencyRef.current = userCurrency;
    try {
      localStorage.setItem('user_display_currency', userCurrency);
    } catch (e) {}
  }, [userCurrency]);

  const getMinConvertedAmount = (currency: string) => {
    if (currency === 'BDT') return 100;
    if (['USD', 'USDT', 'EUR', 'GBP'].includes(currency)) return 1.00;
    if (currency === 'INR') return 80;
    if (currency === 'PKR') return 250;
    if (currency === 'BRL') return 5;
    if (currency === 'TRY') return 30;
    if (currency === 'NGN') return 1500;
    return 1.00;
  };
  const minConvertedAmount = getMinConvertedAmount(userCurrency);
  const minBaseAmount = minConvertedAmount;
  
  const [amount, _setAmount] = useState(() => {
    try {
      const savedCurrency = localStorage.getItem('user_display_currency') || 'USD';
      return getMinConvertedAmount(savedCurrency);
    } catch (e) {
      return 1;
    }
  });
  const amountManuallyEditedRef = useRef(false);
  const setAmount = (val: React.SetStateAction<number>) => {
    amountManuallyEditedRef.current = true;
    _setAmount(val);
  };

  useEffect(() => {
    if (!amountManuallyEditedRef.current) {
      if (amount !== minConvertedAmount) {
        _setAmount(minConvertedAmount);
      }
    } else if (amount < minConvertedAmount) {
      _setAmount(minConvertedAmount);
    }
  }, [userCurrency, minConvertedAmount]);

  const updateBalance = (delta: number, type?: 'real' | 'demo' | 'tournament') => {
    const targetType = type || accountType;
    const bigDelta = new Big(delta);
    
    if (targetType === 'real') {
      setRealBalance(prev => {
        const newVal = parseFloat(new Big(prev).plus(bigDelta).toFixed(6));
        realBalanceRef.current = newVal;
        return newVal;
      });
    } else if (targetType === 'demo') {
      setDemoBalance(prev => {
        const newVal = parseFloat(new Big(prev).plus(bigDelta).toFixed(6));
        demoBalanceRef.current = newVal;
        return newVal;
      });
    } else if (targetType === 'tournament') {
      setTournamentBalance(prev => {
        const newVal = Math.max(0, parseFloat(new Big(prev).plus(bigDelta).toFixed(6)));
        if (auth.currentUser && activeTournamentId) {
          import('../firebase.ts').then(({ doc, updateDoc }) => {
            updateDoc(doc(db, 'tournaments', activeTournamentId, 'participants', auth.currentUser!.uid), {
              score: newVal,
              updatedAt: Date.now()
            }).catch(e => console.warn("Error updating tournament score:", e));
          });
        }
        return newVal;
      });
    } else {
      setRealBalance(prev => {
        const newVal = parseFloat(new Big(prev).plus(bigDelta).toFixed(2));
        realBalanceRef.current = newVal;
        return newVal;
      });
    }
  };

  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [hoverTradeType, setHoverTradeType] = useState<"up" | "down" | null>(null);
  const [isMultiChart, setIsMultiChart] = useState(false);
  const [hoverLineY, setHoverLineY] = useState<number | null>(null);
  const hoverTradeTypeRef = React.useRef<"up" | "down" | null>(null);


  useEffect(() => {
    hoverTradeTypeRef.current = hoverTradeType;
  }, [hoverTradeType]);


  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();

  const getInitialTab = () => {
    const path = location.pathname;
    if (path === '/leaderboard') return 'top-20';
    if (path === '/promotions') return 'promotions';
    if (path === '/calendar') return 'calendar';
    if (path === '/support') {

      return 'trade';
    }
    if (path === '/tournaments') return 'tournaments';
    if (path === '/education') return 'education';
    if (path === '/statuses') return 'statuses';
    if (path === '/help-center') return 'help-center';
    if (path === '/trade/history') return 'history';
    if (path === '/trade/assets') return 'assets';
    if (path === '/activities') return 'activities';
    return 'trade';
  };

  const [activeTabRaw, setActiveTabRaw] = useState<
    | "trade"
    | "profile"
    | "history"
    | "history-detail"
    | "profile-menu"
    | "activities"
    | "invite-friends"
    | "assets"
    | "top-20"
    | "news"
    | "news-detail"
    | "education"
    | "copy-trading" | "copytrading"
    | "tournaments"
    | "promotions"
    | "support"
    | "support-detail"
    | "market-state"
    | "help-center"
    | "calculator"
    | "calendar"
    | "statuses"
    | "strategies"
  >(getInitialTab() as any);

  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTabRaw && ['top-20', 'promotions', 'calendar', 'support', 'tournaments', 'education', 'statuses', 'help-center', 'trade', 'history', 'assets', 'strategies', 'activities'].includes(newTab)) {
      setActiveTabRaw(newTab as any);
    }
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/cashier/')) {
      const sub = path.split('/')[2] as any;
      if (['deposits', 'withdrawals', 'history'].includes(sub)) {
        if (!showDeposit || cashierTab !== sub) {
          setShowDeposit(true);
          setCashierTab(sub);
        }
      }
    } else if (path === '/cashier' || path === '/deposit') {
      if (!showDeposit || cashierTab !== 'deposits') {
        setShowDeposit(true);
        setCashierTab('deposits');
      }
    } else if (path === '/withdraw') {
      if (!showDeposit || cashierTab !== 'withdrawals') {
        setShowDeposit(true);
        setCashierTab('withdrawals');
      }
    } else if (path === '/transactions') {
      if (!showDeposit || cashierTab !== 'history') {
        setShowDeposit(true);
        setCashierTab('history');
      }
    } else {
      // If we are not on a cashier path, ensure cashier is closed
      if (showDeposit) {
        setShowDeposit(false);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (showDeposit) {
      let currentPath = `/cashier/${cashierTab}`;
      if (cashierTab === 'deposits') currentPath = '/deposit';
      else if (cashierTab === 'withdrawals') currentPath = '/withdraw';
      else if (cashierTab === 'history') currentPath = '/transactions';

      if (location.pathname !== currentPath && !location.pathname.startsWith('/cashier/')) {
        navigate(currentPath);
      }
    } else {
      if (location.pathname.startsWith('/cashier') || location.pathname === '/deposit' || location.pathname === '/withdraw' || location.pathname === '/transactions') {
        navigate('/trade');
      }
    }
  }, [showDeposit, cashierTab]);

  const activeTab = activeTabRaw;
  const setActiveTab = React.useCallback((tab: any) => {
    if (tab === 'support') {

      return;
    }
    setActiveTabRaw(tab);
    
    // routing sync
    if (tab === 'top-20') navigate('/leaderboard');
    else if (tab === 'promotions') navigate('/promotions');
    else if (tab === 'calendar') navigate('/calendar');
    else if (tab === 'support') navigate('/support');
    else if (tab === 'tournaments') navigate('/tournaments');
    else if (tab === 'education') navigate('/education');
    else if (tab === 'statuses') navigate('/statuses');
    else if (tab === 'help-center') navigate('/help-center');
    else if (tab === 'activities') navigate('/activities');
    else if (tab === 'trade' || tab === 'history' || tab === 'assets') {
      if (!location.pathname.startsWith('/cashier') && location.pathname !== '/deposit' && location.pathname !== '/withdraw' && location.pathname !== '/transactions') {
        const targetPath = tab === 'history' ? '/trade/history' : (tab === 'assets' ? '/trade/assets' : '/trade');
        if (location.pathname !== targetPath) {
          navigate(targetPath);
        }
      }
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (activeTab === "activities") {
      setIsActivitiesLoading(true);
      const timer = setTimeout(() => {
        setIsActivitiesLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const [calcAmount, setCalcAmount] = useState<number>(50);
  const [calcPayout, setCalcPayout] = useState<number>(82);

  const [historyTab, setHistoryTab] = useState<"open" | "closed">("open");
  const [tradeCategory, setTradeCategory] = useState<"FTT" | "CFD">("FTT");
  const [is5STActive, setIs5STActive] = useState(false);
  const [showOpenTradesOnChart, setShowOpenTradesOnChart] = useState(true);
  const [realtimeNews, setRealtimeNews] = useState<any[]>([]);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [newsFeedTab, setNewsFeedTab] = useState<"platform">("platform");

  const [readNewsIds, setReadNewsIds] = useState<string[]>([]);
  const [readPromotionsIds, setReadPromotionsIds] = useState<string[]>([]);

  // Sync read news and promotions from localStorage on user change
  useEffect(() => {
    const uid = auth.currentUser?.uid || 'guest';
    try {
      const savedNews = localStorage.getItem(`read_news_${uid}`);
      if (savedNews) {
        setReadNewsIds(JSON.parse(savedNews));
      } else {
        setReadNewsIds([]);
      }
    } catch (e) {
      setReadNewsIds([]);
    }

    try {
      const savedPromos = localStorage.getItem(`read_promotions_${uid}`);
      if (savedPromos) {
        setReadPromotionsIds(JSON.parse(savedPromos));
      } else {
        setReadPromotionsIds([]);
      }
    } catch (e) {
      setReadPromotionsIds([]);
    }
  }, [auth.currentUser?.uid]);

  const markNewsAsRead = async (newsId: string) => {
    if (!newsId) return;
    if (readNewsIds.includes(newsId)) return;

    const updated = [...readNewsIds, newsId];
    setReadNewsIds(updated);

    const uid = auth.currentUser?.uid || 'guest';
    localStorage.setItem(`read_news_${uid}`, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          readNewsIds: updated
        });
      } catch (err) {
        console.error("Failed to update readNewsIds in Firestore:", err);
      }
    }
  };

  const markPromotionAsRead = async (promoId: string) => {
    if (!promoId) return;
    if (readPromotionsIds.includes(promoId)) return;

    const updated = [...readPromotionsIds, promoId];
    setReadPromotionsIds(updated);

    const uid = auth.currentUser?.uid || 'guest';
    localStorage.setItem(`read_promotions_${uid}`, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          readPromotionsIds: updated
        });
      } catch (err) {
        console.error("Failed to update readPromotionsIds in Firestore:", err);
      }
    }
  };

  const markAllNewsAsRead = async () => {
    const allIds = newsData.map(n => n.id).filter(Boolean);
    setReadNewsIds(allIds);

    const uid = auth.currentUser?.uid || 'guest';
    localStorage.setItem(`read_news_${uid}`, JSON.stringify(allIds));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          readNewsIds: allIds
        });
      } catch (err) {
        console.error("Failed to update all readNewsIds in Firestore:", err);
      }
    }
  };
  const [newsSearchQuery, setNewsSearchQuery] = useState("");
  const [marketNewsCategory, setMarketNewsCategory] = useState<"All" | "Crypto" | "Forex" | "Regulations">("All");
  const [newsRefreshing, setNewsRefreshing] = useState(false);
  const [isDepositMethodsLoading, setIsDepositMethodsLoading] = useState(false);
  const [depositMethods, setDepositMethods] = useState<any[]>(DEFAULT_DEPOSIT_METHODS);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);
  const [masterTraders, setMasterTraders] = useState<any[]>([]);

  const seedingInProgressRef = useRef(false);
  useEffect(() => {
    const q = query(collection(db, "masterTraders"), orderBy("winRate", "desc"), limit(20));
    
    // Convert to getDocs to save watch quota for a relatively static list
    getDocs(q).then((snap) => {
      if (snap.empty && !seedingInProgressRef.current) {
        // Seed if empty
        seedingInProgressRef.current = true;
        const seedMastersInTerminal = async () => {
          const traders = [
            { name: 'CRISHTTRADER', country: 'ðŸ‡»ðŸ‡ª', isVip: false, copiersCount: 6, maxCopiers: 100, gainPerWeek: 'â‰¥ 200%', copiedTrades: 234, commission: '10%', profitRate: 73, lossRate: 27, winRate: 88, totalProfit: 45000, strategy: 'Trend Reversal Expert', level: 'Standard', riskIndex: 3 },
            { name: 'OBOROTEN', country: 'ðŸ‡ºðŸ‡¦', isVip: true, copiersCount: 13, maxCopiers: 100, gainPerWeek: '43%', copiedTrades: 379, commission: '10%', profitRate: 71, lossRate: 29, winRate: 81, totalProfit: 86000, strategy: 'Crypto Momentum', level: 'VIP', riskIndex: 2 },
            { name: 'GEOVANNY', country: 'ðŸ‡¨ðŸ‡´', isVip: true, copiersCount: 5, maxCopiers: 100, gainPerWeek: '30%', copiedTrades: 112, commission: '10%', profitRate: 70, lossRate: 30, winRate: 74, totalProfit: 12000, strategy: 'Sniper Entry Scalping', level: 'VIP', riskIndex: 4 },
            { name: 'ALEX FOREX', country: 'ðŸ‡¬ðŸ‡§', isVip: true, copiersCount: 38, maxCopiers: 150, gainPerWeek: '115%', copiedTrades: 546, commission: '8%', profitRate: 84, lossRate: 16, winRate: 92, totalProfit: 125000, strategy: 'Pure Price Action Swing', level: 'VIP', riskIndex: 1 },
            { name: 'YUKI T', country: 'ðŸ‡¯ðŸ‡µ', isVip: false, copiersCount: 19, maxCopiers: 80, gainPerWeek: '38%', copiedTrades: 195, commission: '10%', profitRate: 75, lossRate: 25, winRate: 79, totalProfit: 32000, strategy: 'Grid Trading System', level: 'Standard', riskIndex: 3 },
            { name: 'BINANCE WHALE', country: 'ðŸ‡¸ðŸ‡¬', isVip: true, copiersCount: 71, maxCopiers: 200, gainPerWeek: '160%', copiedTrades: 890, commission: '12%', profitRate: 79, lossRate: 21, winRate: 85, totalProfit: 240000, strategy: 'Crypto Swing Options', level: 'VIP', riskIndex: 5 },
            { name: 'ALPHA SCALPER', country: 'ðŸ‡ºðŸ‡¸', isVip: false, copiersCount: 22, maxCopiers: 120, gainPerWeek: '47%', copiedTrades: 310, commission: '10%', profitRate: 72, lossRate: 28, winRate: 76, totalProfit: 54000, strategy: 'Scalp Entry Arbitrage', level: 'Standard', riskIndex: 4 },
            { name: '181824019', country: 'ðŸ‡¨ðŸ‡´', isVip: true, copiersCount: 5, maxCopiers: 50, gainPerWeek: '69%', copiedTrades: 84, commission: '5%', profitRate: 71, lossRate: 29, winRate: 78, totalProfit: 5400, strategy: 'Aggressive Small Account Grow', level: 'VIP', riskIndex: 5 },
            { name: 'ELENA_RU', country: 'ðŸ‡·ðŸ‡º', isVip: true, copiersCount: 29, maxCopiers: 100, gainPerWeek: '84%', copiedTrades: 420, commission: '10%', profitRate: 81, lossRate: 19, winRate: 83, totalProfit: 95000, strategy: 'Gold & Crude Breakouts', level: 'VIP', riskIndex: 3 },
            { name: 'SANJAY FX', country: 'ðŸ‡®ðŸ‡³', isVip: false, copiersCount: 11, maxCopiers: 100, gainPerWeek: '52%', copiedTrades: 140, commission: '5%', profitRate: 74, lossRate: 26, winRate: 80, totalProfit: 18000, strategy: 'Macro News Straddle Strategy', level: 'Standard', riskIndex: 2 },
            { name: 'TRADEMINATOR', country: 'ðŸ‡¬ðŸ‡§', isVip: true, copiersCount: 42, maxCopiers: 150, gainPerWeek: '135%', copiedTrades: 620, commission: '10%', profitRate: 85, lossRate: 15, winRate: 89, totalProfit: 155000, strategy: 'Bivaax Confluence Method', level: 'VIP', riskIndex: 2 },
            { name: 'LUC TRADER', country: 'ðŸ‡«ðŸ‡·', isVip: false, copiersCount: 8, maxCopiers: 80, gainPerWeek: '28%', copiedTrades: 92, commission: '7%', profitRate: 68, lossRate: 32, winRate: 75, totalProfit: 21000, strategy: 'Fib Retracement Swing Trading', level: 'Standard', riskIndex: 3 }
          ];
          for (const t of traders) {
            try {
              await addDoc(collection(db, 'masterTraders'), { 
                ...t, 
                history: Array.from({ length: 15 }).map((_, i) => ({
                  id: `history-${i}`,
                  asset: ['Crypto IDX', 'EUR/USD', 'GBP/JPY', 'Gold', 'BTC/USD'][Math.floor(Math.random() * 5)],
                  type: Math.random() > 0.5 ? 'CALL' : 'PUT',
                  amount: (Math.random() * 500 + 100).toFixed(2),
                  payout: 82,
                  result: Math.random() > 0.3 ? 'won' : 'lost',
                  time: '20:23:00',
                  profit: (Math.random() * 1000 + 200).toFixed(2)
                })),
                performanceData: Array.from({ length: 8 }).map((_, i) => ({
                  name: (i + 1).toString(),
                  value: 400 + Math.random() * 1100
                }))
              });
            } catch (seedErr: any) {
              console.warn("Master trader seed skipped (rate limit / quota):", seedErr?.message || seedErr);
              break;
            }
          }
        };
        seedMastersInTerminal();
      } else {
        setMasterTraders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }).catch(err => console.warn("Master traders fetch failed:", err));
  }, []);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [promotionsData, setPromotionsData] = useState<any[]>([]);
  const [tournamentsData, setTournamentsData] = useState<any[]>([
    {
      id: 'daily-free',
      title: 'Daily Free',
      prizePool: '100',
      participationFee: '0',
      endTime: 'Ends in 4h 22m',
      participantsCount: 1420,
      imageUrl: 'https://images.unsplash.com/photo-1611974714851-48206138d73e?auto=format&fit=crop&q=80&w=600',
      type: 'free'
    },
    {
      id: 'weekend-pro',
      title: 'Weekend Pro',
      prizePool: '2,500',
      participationFee: '10',
      endTime: 'Ends in 2d 14h',
      participantsCount: 856,
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
      type: 'paid'
    },
    {
      id: 'prestige-cup',
      title: 'Prestige Cup',
      prizePool: '15,000',
      participationFee: '50',
      endTime: 'Starts in 1d 02h',
      participantsCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1579546678183-a848499b0028?auto=format&fit=crop&q=80&w=600',
      type: 'vip'
    }
  ]);
  const mockTournaments = [
    {
      id: 't1',
      title: 'Galaxy',
      status: 'Active',
      endTime: '23d 02h 45m',
      participationFee: '5,376.00',
      prizePool: '5,378,018.00',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 't2',
      title: 'Market Makers',
      status: 'Active',
      endTime: '02d 02h 45m',
      participationFee: '5,376.00',
      prizePool: '3,016,462.00',
      imageUrl: 'https://images.unsplash.com/photo-1611974714851-48206138d73e?auto=format&fit=crop&q=80&w=600'
    }
  ];
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [tournamentParticipants, setTournamentParticipants] = useState<any[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const userRegistrationsRef = useRef<string[]>([]);

  const [activeTournamentId, setActiveTournamentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bivax_active_tournament_id') || null;
    } catch(e) { return null; }
  });
  useEffect(() => {
    try {
      if (activeTournamentId) {
        localStorage.setItem('bivax_active_tournament_id', activeTournamentId);
      } else {
        localStorage.removeItem('bivax_active_tournament_id');
      }
    } catch(e) {}
  }, [activeTournamentId]);

  const [tournamentBalance, setTournamentBalance] = useState(10000.0);
  useEffect(() => {
    userRegistrationsRef.current = userRegistrations;
  }, [userRegistrations]);

  useEffect(() => {
    if (!currentUser?.uid || tournamentsData.length === 0) {
      setUserRegistrations(prev => prev.length === 0 ? prev : []);
      return;
    }
    
    const fetchRegistrations = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch('/api/tournaments/user/active', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.tournaments) {
          const registeredIds = data.tournaments.map((t: any) => t.tournament_id);
          setUserRegistrations(prev => {
            if (prev.length === registeredIds.length && prev.every((id, idx) => id === registeredIds[idx])) {
              return prev;
            }
            return registeredIds;
          });
          
          const activeTournamentIdStr = localStorage.getItem('bivax_active_tournament_id') || null;
          if (activeTournamentIdStr) {
            const currentT = data.tournaments.find((t: any) => t.tournament_id === activeTournamentIdStr);
            if (currentT && currentT.score !== undefined) {
               setTournamentBalance(currentT.score);
            }
          }
        }
      } catch (err) {
        console.warn("Participant fetch error:", err);
      }
    };
    
    fetchRegistrations();
  }, [currentUser?.uid, tournamentsData]);

  



  const [selectedNews, setSelectedNews] = useState<any>(null);
const HELP_CATEGORIES = [
  { id: 'verification', title: 'Verification', icon: ShieldCheck, color: 'text-yellow-500' },
  { id: 'account', title: 'Account', icon: User, color: 'text-blue-500' },
  { id: 'trading', title: 'Trading', icon: BarChart3, color: 'text-green-500' },
  { id: 'deposit', title: 'Deposit funds', icon: Wallet, color: 'text-purple-500' },
  { id: 'withdraw', title: 'Withdraw funds', icon: ArrowRightLeft, color: 'text-red-500' },
  { id: 'vip', title: 'VIP and Gold benefits', icon: Diamond, color: 'text-orange-500' },
  { id: 'tournaments', title: 'Tournaments', icon: Trophy, color: 'text-indigo-500' },
  { id: 'promotions', title: 'Promotions and bonuses', icon: Star, color: 'text-pink-500' },
  { id: 'about', title: 'About us', icon: Info, color: 'text-gray-400' },
  { id: 'mobile', title: 'Mobile application', icon: Smartphone, color: 'text-cyan-500' },
];

const PROMOTED_ARTICLES = [
  "What is verification? Why do I need it?",
  "Two-factor Authentication (2FA) Guide",
  "How to confirm my email?",
  "Trading Signals â€” a tool to make your trading more beneficial",
  "What are 5-second trades (5ST)?",
  "How to deposit funds with Havale?",
  "Deposit using iCash.One",
  "Tether USD TRC20 token USDT",
  "How to use cryptocurrencies worldwide?",
  "How to choose a crypto wallet and start using cryptocurrencies in India?",
  "How do I withdraw funds to a bank card?",
  "How to earn real funds through the Invite Friends referral program?",
  "Do you have a mobile application?",
];

  const [appConfig, setAppConfig] = useState<any>({});
  const [activeProfileTab, setActiveProfileTab] = useState<"account" | "invite" | "transactions">("account");
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTimeZoneModal, setShowTimeZoneModal] = useState(false);
  const { language, setLanguage } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState(() => LANGUAGES.find(l => l.code === language) || LANGUAGES[0]);
  const selectedLanguageRef = useRef(selectedLanguage);
  useEffect(() => { selectedLanguageRef.current = selectedLanguage; }, [selectedLanguage]);

  useEffect(() => {
    if (language) {
      const found = LANGUAGES.find(l => l.code === language);
      if (found && found.code !== selectedLanguageRef.current?.code) {
        setSelectedLanguage(found);
        selectedLanguageRef.current = found;
      }
    }
  }, [language]);

  const { t } = useTranslation((language || selectedLanguage?.code || 'en') as LanguageCode);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState("United Kingdom");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState(1);
  const [twoFAMode, setTwoFAMode] = useState<'app' | 'sms' | 'email'>('email');
  const [tfaPhoneNumber, setTfaPhoneNumber] = useState('');
  const [tfaSecret, setTfaSecret] = useState<OTPAuth.Secret | null>(null);
  const [tfaQrUrl, setTfaQrUrl] = useState('');

  const handleSetupTerminalAppTfa = async () => {
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: 'Bivaax',
      label: auth.currentUser?.email || 'User',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    setTfaSecret(secret);
    try {
      const uri = totp.toString();
      const qrCodeDataUrl = await QRCode.toDataURL(uri);
      setTfaQrUrl(qrCodeDataUrl);
      setTwoFAMode('app');
      setTwoFAStep(2);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate QR Code');
    }
  };
  const [nickname, setNickname] = useState("");
  const [savedNickname, setSavedNickname] = useState("");
  const savedNicknameRef = useRef("");
  useEffect(() => { savedNicknameRef.current = savedNickname; }, [savedNickname]);
  const [profilePic, setProfilePic] = useState("");
  const [detectedCountryCode, setDetectedCountryCode] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
       try {
           // Use server-side proxy
        const res = await fetch('/api/ip-info').catch(() => null);
           if (!res) return;
           const data = await res.json().catch(() => null);
           if (data && data.country_name) {
               const code = data.country_code?.toLowerCase() || "";
               setDetectedCountryCode(code);
               if (personalData && (!personalData.country || personalData.country === "Global" || personalData.country === "United Kingdom")) {
                   setPersonalData(prev => ({ ...prev, country: data.country_name }));
               }
               // Persist automatically to Firestore users document if missing
               if (currentUser) {
                   const { doc, getDoc, updateDoc } = await import('../firebase.ts');
                   const userRef = doc(db, "users", currentUser.uid);
                   const snap = await getDoc(userRef).catch(() => null);
                   if (snap && snap.exists()) {
                       const uData = snap.data();
                       if (!uData.country || !uData.countryCode) {
                           await updateDoc(userRef, {
                               country: data.country_name,
                               countryCode: code.toUpperCase()
                           }).catch(() => {});
                       }
                   }
               }
           }
       } catch (err) {
           // Silent fail for location detection to avoid user distraction
       }
    };
    fetchLocation();
  }, [currentUser?.uid]);

  const [notifications, setNotifications] = useState({ promo: true, info: true });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [personalData, setPersonalData] = useState(() => {
    try {
      const saved = currentUser?.uid ? localStorage.getItem(`bivax_personal_data_${currentUser.uid}`) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return {
      firstName: currentUser?.displayName?.split(" ")[0] || "User",
      lastName: currentUser?.displayName?.split(" ")[1] || "",
      gender: "Male",
      day: "--",
      month: "--",
      year: "--",
      country: ""
    };
  });
  const [savedPersonalData, setSavedPersonalData] = useState(() => ({ ...personalData }));
  const personalDataRef = useRef(personalData);
  useEffect(() => {
    personalDataRef.current = personalData;
  }, [personalData]);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const timeZoneRef = useRef(timeZone);
  useEffect(() => { timeZoneRef.current = timeZone; }, [timeZone]);
  const prevTabRef = useRef(activeTab);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showCopyTradingHowItWorks, setShowCopyTradingHowItWorks] = useState(false);
  const [openForTraders, setOpenForTraders] = useState(false);
  const [openInformation, setOpenInformation] = useState(false);
  const [showTimeframeModal, setShowTimeframeModal] = useState(false);
  const [showChartTypeModal, setShowChartTypeModal] = useState(false);
  const [showIndicatorsModal, setShowIndicatorsModal] = useState(false);
  const [indicatorTab, setIndicatorTab] = useState<'indicators' | 'strategies' | 'drawings'>('indicators');
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [kycStatus, setKycStatus] = useState<"unverified" | "pending" | "verified" | "rejected">("unverified");
  const [kycData, setKycData] = useState({
    fullName: "",
    idType: "NID",
    idNumber: "",
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null
  });
  const [isKYCSubmitting, setIsKYCSubmitting] = useState(false);
  const [activeScanner, setActiveScanner] = useState<'front' | 'back' | 'selfie' | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'idFront' | 'idBack' | 'selfie') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setKycData(prev => ({ ...prev, [type]: file }));
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const [activeAsset, setActiveAsset] = useState<string>(() => {
    try {
      return localStorage.getItem('bivax_active_asset') || "Crypto IDX";
    } catch(e) { return "Crypto IDX"; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bivax_active_asset', activeAsset);
    } catch(e) {}
  }, [activeAsset]);

  const isClosed = isRealMarketClosed(activeAsset);

  // Global indicator settings for consistent experience across assets
  const [indicatorSettings, setIndicatorSettings] = useState<any>(() => {
    const saved = localStorage.getItem('bivax_global_indicator_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing global indicators:", e);
      }
    }
    return DEFAULT_INDICATOR_SETTINGS;
  });

  const indicatorSettingsRef = useRef(indicatorSettings);
  useEffect(() => {
    indicatorSettingsRef.current = indicatorSettings;
    localStorage.setItem('bivax_global_indicator_settings', JSON.stringify(indicatorSettings));
    refreshIndicators();
  }, [indicatorSettings]);

  const toggleIndicator = (indicatorName: string) => {
    setIndicatorSettings((prev: any) => ({
      ...prev,
      [indicatorName]: {
        ...prev[indicatorName],
        enabled: !prev[indicatorName]?.enabled
      }
    }));
  };

  const handleApplyStrategy = (strategyName: string) => {
    if (activeStrategy === strategyName) {
      // Toggle off
      setIndicatorSettings((prev: any) => {
        const next = { ...prev };
        if (strategyName === "Exponential Ribbon") {
          next["EMA"].enabled = false;
          next["WEMA"].enabled = false;
          next["Alligator"].enabled = false;
        } else if (strategyName === "Golden Cross") {
          next["SMA"].enabled = false;
          next["Moving Average"].enabled = false;
        } else if (strategyName === "Bollinger Rebound") {
          next["Bollinger Bands"].enabled = false;
          next["RSI"].enabled = false;
        } else if (strategyName === "RSI Divergence") {
          next["RSI"].enabled = false;
          next["ADX"].enabled = false;
        } else if (strategyName === "Fractal Chaos") {
          next["Fractals"].enabled = false;
          next["Alligator"].enabled = false;
        } else if (strategyName === "Volume Spike") {
          next["ADL"].enabled = false;
          next["MFI"].enabled = false;
        }
        return next;
      });
      setActiveStrategy(null);
      toast.success(`Strategy "${strategyName}" disabled`);
    } else {
      // Toggle on
      setIndicatorSettings((prev: any) => {
        const next = { ...prev };
        
        // Auto-enable relevant indicators for each strategy
        if (strategyName === "Exponential Ribbon") {
          next["EMA"] = { ...next["EMA"], enabled: true, period: 20, color: "#0091ff", strokeWidth: 2 };
          next["WEMA"] = { ...next["WEMA"], enabled: true, period: 50, color: "#FFE24C", strokeWidth: 2 };
          next["Alligator"] = { ...next["Alligator"], enabled: true };
        } else if (strategyName === "Golden Cross") {
          next["SMA"] = { ...next["SMA"], enabled: true, period: 50, color: "#FFE24C", strokeWidth: 2 };
          next["Moving Average"] = { ...next["Moving Average"], enabled: true, period: 200, type: "SMA", color: "#f59e0b", strokeWidth: 2 };
        } else if (strategyName === "Bollinger Rebound") {
          next["Bollinger Bands"] = { ...next["Bollinger Bands"], enabled: true, period: 20, stdDev: 2, color: "#3b82f6" };
          next["RSI"] = { ...next["RSI"], enabled: true, period: 14, color: "#00C980" };
        } else if (strategyName === "RSI Divergence") {
          next["RSI"] = { ...next["RSI"], enabled: true, period: 14, color: "#FFE24C" };
          next["ADX"] = { ...next["ADX"], enabled: true, period: 14 };
        } else if (strategyName === "Fractal Chaos") {
          next["Fractals"] = { ...next["Fractals"], enabled: true };
          next["Alligator"] = { ...next["Alligator"], enabled: true };
        } else if (strategyName === "Volume Spike") {
          next["ADL"] = { ...next["ADL"], enabled: true };
          next["MFI"] = { ...next["MFI"], enabled: true };
        }
        
        return next;
      });
      setActiveStrategy(strategyName);
      toast.success(`Strategy "${strategyName}" applied to chart`);
      setShowIndicatorsModal(false);
    }
  };

  const updateIndicatorSetting = (indicatorName: string, key: string, value: any) => {
    setIndicatorSettings((prev: any) => ({
      ...prev,
      [indicatorName]: { 
        ...prev[indicatorName], 
        [key]: value 
      }
    }));
  };

  const loadIndicatorPreset = (presetData: any) => {
    setIndicatorSettings(presetData ? { ...DEFAULT_INDICATOR_SETTINGS, ...presetData } : DEFAULT_INDICATOR_SETTINGS);
    toast.success(presetData ? "Preset loaded" : "Settings reset");
  };



  const [drawings, setDrawings] = useState<any[]>(() => {
    const saved = localStorage.getItem('chartDrawings');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeDrawing, setActiveDrawing] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const drawingRef = useRef<any[]>(drawings);
  drawingRef.current = drawings;

  useEffect(() => {
    localStorage.setItem('chartDrawings', JSON.stringify(drawings));
  }, [drawings]);
  
  const [configuringIndicator, setConfiguringIndicator] = useState<string | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);
  
  const [indicatorPresets, setIndicatorPresets] = useState<{id: string, name: string, data: any}[]>(() => {
    const saved = localStorage.getItem('indicatorPresets');
    let loaded = saved ? JSON.parse(saved) : [];
    // Always insert 'default' if it doesn't exist
    if (!loaded.find((p: any) => p.id === 'default')) {
        loaded = [{ id: 'default', name: 'Default', data: null }, ...loaded];
    }
    return loaded;
  });
  const [newPresetName, setNewPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('indicatorPresets', JSON.stringify(indicatorPresets));
  }, [indicatorPresets]);

  const fetchMarketNews = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setNewsRefreshing(true);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json().catch(() => null);
      if (data && Array.isArray(data.Data)) {
        // Grab a larger subset (up to 40 items) for real-time scrolling & searching
        setRealtimeNews(data.Data.slice(0, 40));
      }
    } catch (err: any) {
      console.warn("Could not fetch realtime news, skipping:", err.message);
    } finally {
      if (showRefreshIndicator) {
        setTimeout(() => setNewsRefreshing(false), 600);
      }
    }
  }, []);

  useEffect(() => {
    fetchMarketNews();
    // Auto-refresh real-time news feed background updates every 60 seconds
    const interval = setInterval(() => {
      fetchMarketNews(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketNews]);

  const saveIndicatorPreset = (name: string) => {
    if (!name.trim()) return;
    const newPreset = { id: Math.random().toString(36).substring(2, 9), name: name.trim(), data: JSON.parse(JSON.stringify(indicatorSettings)) };
    setIndicatorPresets([...indicatorPresets, newPreset]);
    setNewPresetName("");
    setShowPresetInput(false);
    toast.success("Preset saved");
  };



  const deleteIndicatorPreset = (id: string) => {
    setIndicatorPresets(indicatorPresets.filter(p => p.id !== id));
    toast.success("Preset deleted");
  };



  useEffect(() => {
    refreshIndicators();
  }, [indicatorSettings]);
  
  const baseDataRef = useRef<any[]>([]);
  const indicatorSeriesRefs = useRef<any>({});
  
  const refreshIndicators = () => {
      try {
          if (!chartRef.current || baseDataRef.current.length === 0) return;
          const chart = chartRef.current as any;
          // Sanitize data: remove duplicates
          const rawData = baseDataRef.current || [];
          const uniqueDataMap = new Map();
          for(const item of rawData) {
              if (item && item.time !== undefined && item.time !== null) {
                  uniqueDataMap.set(item.time, item);
              }
          }
          const data = Array.from(uniqueDataMap.values()).sort((a,b) => a.time - b.time);
          const closes = data.map((d: any) => d.close).filter((v: any) => typeof v === 'number');
          const currentSettings = indicatorSettingsRef.current;
          
          if (data.length < 5) return;

          // RSI
          try {
              if (currentSettings["RSI"]?.enabled) {
                 if (!indicatorSeriesRefs.current.rsi) {
                    indicatorSeriesRefs.current.rsi = chart.addSeries(LineSeries, {
                       color: currentSettings["RSI"].color,
                       lineWidth: currentSettings["RSI"].strokeWidth,
                       priceScaleId: 'rsi',
                       lastValueVisible: false,
                       priceLineVisible: false,
                    });
                    try { chart.priceScale('rsi').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch (e) {}
                 } else {
                     try { indicatorSeriesRefs.current.rsi.applyOptions({
                       color: currentSettings["RSI"].color,
                       lineWidth: currentSettings["RSI"].strokeWidth,
                     }); } catch (e) {}
                 }
                 const period = parseInt(currentSettings["RSI"].period) || 14;
                 if (closes.length > period) {
                     const rsiVals = RSI.calculate({ period, values: closes });
                     const rsiData = [];
                     const offset = data.length - rsiVals.length;
                     for (let i=0; i<rsiVals.length; i++) {
                        rsiData.push({ time: data[offset + i].time, value: rsiVals[i] });
                     }
                     indicatorSeriesRefs.current.rsi.setData(rsiData);
                 }
              } else if (indicatorSeriesRefs.current.rsi) {
                 chart.removeSeries(indicatorSeriesRefs.current.rsi);
                 indicatorSeriesRefs.current.rsi = null;
              }
          } catch (e) { console.error("RSI Calculation Error", e); }

           // MFI
           try {
             if (currentSettings["MFI"]?.enabled) {
               if (!indicatorSeriesRefs.current.mfi) {
                 indicatorSeriesRefs.current.mfi = chart.addSeries(LineSeries, {
                   color: currentSettings["MFI"].color,
                   lineWidth: currentSettings["MFI"].strokeWidth,
                   priceScaleId: 'mfi',
                   lastValueVisible: false,
                   priceLineVisible: false,
                 });
                 try { chart.priceScale('mfi').applyOptions({ visible: false, scaleMargins: { top: 0.7, bottom: 0 } }); } catch (e) {}
               } else {
                 try { indicatorSeriesRefs.current.mfi.applyOptions({
                   color: currentSettings["MFI"].color,
                   lineWidth: currentSettings["MFI"].strokeWidth,
                 }); } catch(e) {}
               }
               const period = parseInt(currentSettings["MFI"].period) || 14;
               if (closes.length > period) {
                 const high = data.map(d => d.high);
                 const low = data.map(d => d.low);
                 const volume = data.map(d => d.volume || 100);
                 const mfiVals = MFI.calculate({ period, high, low, close: closes, volume });
                 const mfiData = [];
                 const offset = data.length - mfiVals.length;
                 for (let i = 0; i < mfiVals.length; i++) {
                   mfiData.push({ time: data[offset + i].time, value: mfiVals[i] });
                 }
                 indicatorSeriesRefs.current.mfi.setData(mfiData);
               }
             } else if (indicatorSeriesRefs.current.mfi) {
               chart.removeSeries(indicatorSeriesRefs.current.mfi);
               indicatorSeriesRefs.current.mfi = null;
             }
           } catch (e) {
             console.warn("MFI Calculation Error", e);
           }

           // OBV
           try {
             if (currentSettings["OBV"]?.enabled) {
               if (!indicatorSeriesRefs.current.obv) {
                 indicatorSeriesRefs.current.obv = chart.addSeries(LineSeries, {
                   color: currentSettings["OBV"].color,
                   lineWidth: currentSettings["OBV"].strokeWidth,
                   priceScaleId: 'obv',
                   lastValueVisible: false,
                   priceLineVisible: false,
                 });
                 try { chart.priceScale('obv').applyOptions({ visible: false, scaleMargins: { top: 0.7, bottom: 0 } }); } catch (e) {}
               } else {
                 try { indicatorSeriesRefs.current.obv.applyOptions({
                   color: currentSettings["OBV"].color,
                   lineWidth: currentSettings["OBV"].strokeWidth,
                 }); } catch(e) {}
               }
               const volume = data.map(d => d.volume || 100);
               const obvVals = OBV.calculate({ close: closes, volume });
               const obvData = [];
               const offset = data.length - obvVals.length;
               for (let i = 0; i < obvVals.length; i++) {
                 obvData.push({ time: data[offset + i].time, value: obvVals[i] });
               }
               indicatorSeriesRefs.current.obv.setData(obvData);
             } else if (indicatorSeriesRefs.current.obv) {
               chart.removeSeries(indicatorSeriesRefs.current.obv);
               indicatorSeriesRefs.current.obv = null;
             }
           } catch (e) {
             console.warn("OBV Calculation Error", e);
           }

      // MACD
      try {
         if (currentSettings["MACD"]?.enabled) {
            if (!indicatorSeriesRefs.current.macdFast) {
               indicatorSeriesRefs.current.macdFast = chart.addSeries(LineSeries, {
                  color: currentSettings["MACD"].colorFast,
                  lineWidth: 2,
                  priceScaleId: 'macd',
                  lastValueVisible: false, priceLineVisible: false,
               });
               indicatorSeriesRefs.current.macdSlow = chart.addSeries(LineSeries, {
                  color: currentSettings["MACD"].colorSlow,
                  lineWidth: 2,
                  priceScaleId: 'macd',
                  lastValueVisible: false, priceLineVisible: false,
               });
               indicatorSeriesRefs.current.macdHist = chart.addSeries(HistogramSeries, {
                  priceScaleId: 'macd',
                  lastValueVisible: false, priceLineVisible: false,
               });
               try { chart.priceScale('macd').applyOptions({ visible: false, scaleMargins: { top: currentSettings["RSI"]?.enabled ? 0.6 : 0.8, bottom: currentSettings["RSI"]?.enabled ? 0.2 : 0 } }); } catch (e) {}
            } else {
               try { indicatorSeriesRefs.current.macdFast.applyOptions({ color: currentSettings["MACD"].colorFast }); } catch (e) {}
               try { indicatorSeriesRefs.current.macdSlow.applyOptions({ color: currentSettings["MACD"].colorSlow }); } catch (e) {}
               try { chart.priceScale('macd').applyOptions({ visible: false, scaleMargins: { top: currentSettings["RSI"]?.enabled ? 0.6 : 0.8, bottom: currentSettings["RSI"]?.enabled ? 0.2 : 0 } }); } catch (e) {}
            }
            const fastPeriod = parseInt(currentSettings["MACD"].fast) || 12;
            const slowPeriod = parseInt(currentSettings["MACD"].slow) || 26;
            const signalPeriod = parseInt(currentSettings["MACD"].signal) || 9;
            
            if (closes.length > slowPeriod + signalPeriod) {
               const macdVals = MACD.calculate({ values: closes, fastPeriod, slowPeriod, signalPeriod, SimpleMAOscillator: false, SimpleMASignal: false });
               const macdFastData = [];
               const macdSlowData = [];
               const macdHistData = [];
               const offset = data.length - macdVals.length;
               for (let i=0; i<macdVals.length; i++) {
                  const v = macdVals[i];
                  const time = data[offset + i].time;
                  if (v && v.MACD !== undefined) macdFastData.push({ time, value: v.MACD });
                  if (v && v.signal !== undefined) macdSlowData.push({ time, value: v.signal });
                  if (v && v.histogram !== undefined) macdHistData.push({ time, value: v.histogram, color: v.histogram > 0 ? '#00C980' : '#FF4757' });
               }
               if (macdFastData.length > 0) indicatorSeriesRefs.current.macdFast.setData(macdFastData);
               if (macdSlowData.length > 0) indicatorSeriesRefs.current.macdSlow.setData(macdSlowData);
               if (macdHistData.length > 0) indicatorSeriesRefs.current.macdHist.setData(macdHistData);
            }
         } else {
            if (indicatorSeriesRefs.current.macdFast) {
               try { chart.removeSeries(indicatorSeriesRefs.current.macdFast); } catch (e) {}
               try { chart.removeSeries(indicatorSeriesRefs.current.macdSlow); } catch (e) {}
               try { chart.removeSeries(indicatorSeriesRefs.current.macdHist); } catch (e) {}
               indicatorSeriesRefs.current.macdFast = null;
               indicatorSeriesRefs.current.macdSlow = null;
               indicatorSeriesRefs.current.macdHist = null;
            }
         }
      } catch (e) {
         console.warn("MACD Error caught safely:", e);
      }
      
      // Bollinger Bands
      try {
         if (currentSettings["Bollinger Bands"]?.enabled) {
             if (!indicatorSeriesRefs.current.bbUpper) {
                indicatorSeriesRefs.current.bbUpper = chart.addSeries(LineSeries, { color: currentSettings["Bollinger Bands"].color, lineWidth: currentSettings["Bollinger Bands"].strokeWidth, lastValueVisible: false, priceLineVisible: false });
                indicatorSeriesRefs.current.bbLower = chart.addSeries(LineSeries, { color: currentSettings["Bollinger Bands"].color, lineWidth: currentSettings["Bollinger Bands"].strokeWidth, lastValueVisible: false, priceLineVisible: false });
                indicatorSeriesRefs.current.bbMiddle = chart.addSeries(LineSeries, { color: currentSettings["Bollinger Bands"].color, lineWidth: 1, lineStyle: 3, lastValueVisible: false, priceLineVisible: false });
             } else {
                try { indicatorSeriesRefs.current.bbUpper.applyOptions({ color: currentSettings["Bollinger Bands"].color, lineWidth: parseInt(currentSettings["Bollinger Bands"].strokeWidth) || 2 }); } catch (e) {}
                try { indicatorSeriesRefs.current.bbLower.applyOptions({ color: currentSettings["Bollinger Bands"].color, lineWidth: parseInt(currentSettings["Bollinger Bands"].strokeWidth) || 2 }); } catch (e) {}
                try { indicatorSeriesRefs.current.bbMiddle.applyOptions({ color: currentSettings["Bollinger Bands"].color }); } catch (e) {}
             }
             const period = parseInt(currentSettings["Bollinger Bands"].period) || 20;
             const stdDev = parseFloat(currentSettings["Bollinger Bands"].stdDev) || 2;
             if (closes.length > period) {
                const bbVals = BollingerBands.calculate({ period, stdDev, values: closes });
                const bbUpperData = [], bbLowerData = [], bbMiddleData = [];
                const offset = data.length - bbVals.length;
                for (let i=0; i<bbVals.length; i++) {
                   const time = data[offset + i].time;
                   if (bbVals[i] && bbVals[i].upper !== undefined) bbUpperData.push({ time, value: bbVals[i].upper });
                   if (bbVals[i] && bbVals[i].lower !== undefined) bbLowerData.push({ time, value: bbVals[i].lower });
                   if (bbVals[i] && bbVals[i].middle !== undefined) bbMiddleData.push({ time, value: bbVals[i].middle });
                }
                if (bbUpperData.length > 0) indicatorSeriesRefs.current.bbUpper.setData(bbUpperData);
                if (bbLowerData.length > 0) indicatorSeriesRefs.current.bbLower.setData(bbLowerData);
                if (bbMiddleData.length > 0) indicatorSeriesRefs.current.bbMiddle.setData(bbMiddleData);
             }
         } else {
             if (indicatorSeriesRefs.current.bbUpper) {
                try { chart.removeSeries(indicatorSeriesRefs.current.bbUpper); } catch (e) {}
                try { chart.removeSeries(indicatorSeriesRefs.current.bbLower); } catch (e) {}
                try { chart.removeSeries(indicatorSeriesRefs.current.bbMiddle); } catch (e) {}
                indicatorSeriesRefs.current.bbUpper = null;
                indicatorSeriesRefs.current.bbLower = null;
                indicatorSeriesRefs.current.bbMiddle = null;
             }
         }
      } catch (e) {
         console.warn("Bollinger Bands Error caught safely:", e);
      }

      // Stochastic
      try {
         if (currentSettings["Stochastic"]?.enabled) {
            if (!indicatorSeriesRefs.current.stochK) {
               indicatorSeriesRefs.current.stochK = chart.addSeries(LineSeries, {
                  color: currentSettings["Stochastic"].colorK,
                  lineWidth: 2,
                  priceScaleId: 'stoch',
                  lastValueVisible: false, priceLineVisible: false,
               });
               indicatorSeriesRefs.current.stochD = chart.addSeries(LineSeries, {
                  color: currentSettings["Stochastic"].colorD,
                  lineWidth: 2,
                  priceScaleId: 'stoch',
                  lastValueVisible: false, priceLineVisible: false,
               });
               try { chart.priceScale('stoch').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch (e) {}
            } else {
               try { indicatorSeriesRefs.current.stochK.applyOptions({ color: currentSettings["Stochastic"].colorK }); } catch (e) {}
               try { indicatorSeriesRefs.current.stochD.applyOptions({ color: currentSettings["Stochastic"].colorD }); } catch (e) {}
            }
            const period = parseInt(currentSettings["Stochastic"].period) || 14;
            const signalPeriod = parseInt(currentSettings["Stochastic"].signalPeriod) || 3;
            
            if (data.length > period + signalPeriod) {
               const high = data.map(d => d.high);
               const low = data.map(d => d.low);
               const close = data.map(d => d.close);
               const stochVals = Stochastic.calculate({ high, low, close, period, signalPeriod });
               const stochKData = [];
               const stochDData = [];
               const offset = data.length - stochVals.length;
               for (let i=0; i<stochVals.length; i++) {
                  const v = stochVals[i];
                  const time = data[offset + i].time;
                  if (v && v.k !== undefined) stochKData.push({ time, value: v.k });
                  if (v && v.d !== undefined) stochDData.push({ time, value: v.d });
               }
               if (stochKData.length > 0) indicatorSeriesRefs.current.stochK.setData(stochKData);
               if (stochDData.length > 0) indicatorSeriesRefs.current.stochD.setData(stochDData);
            }
         } else {
            if (indicatorSeriesRefs.current.stochK) {
               try { chart.removeSeries(indicatorSeriesRefs.current.stochK); } catch (e) {}
               try { chart.removeSeries(indicatorSeriesRefs.current.stochD); } catch (e) {}
               indicatorSeriesRefs.current.stochK = null;
               indicatorSeriesRefs.current.stochD = null;
            }
         }
      } catch (e) {
         console.warn("Stochastic Error caught safely:", e);
      }
      
      // SMA
      try {
         if (currentSettings["SMA"]?.enabled) {
             if (!indicatorSeriesRefs.current.sma) {
                indicatorSeriesRefs.current.sma = chart.addSeries(LineSeries, { color: currentSettings["SMA"].color, lineWidth: currentSettings["SMA"].strokeWidth, lastValueVisible: false, priceLineVisible: false });
             } else {
                try { indicatorSeriesRefs.current.sma.applyOptions({ color: currentSettings["SMA"].color, lineWidth: currentSettings["SMA"].strokeWidth }); } catch (e) {}
             }
             const period = parseInt(currentSettings["SMA"].period) || 14;
             if (closes.length > period) {
                const smaVals = SMA.calculate({ period, values: closes });
                const smaData = [];
                const offset = data.length - smaVals.length;
                for (let i=0; i<smaVals.length; i++) {
                   smaData.push({ time: data[offset + i].time, value: smaVals[i] });
                }
                indicatorSeriesRefs.current.sma.setData(smaData);
             }
         } else if (indicatorSeriesRefs.current.sma) {
             try { chart.removeSeries(indicatorSeriesRefs.current.sma); } catch (e) {}
             indicatorSeriesRefs.current.sma = null;
         }
      } catch (e) {
         console.warn("SMA Error caught safely:", e);
      }

      // EMA
      try {
         if (currentSettings["EMA"]?.enabled) {
             if (!indicatorSeriesRefs.current.ema) {
                indicatorSeriesRefs.current.ema = chart.addSeries(LineSeries, { color: currentSettings["EMA"].color, lineWidth: currentSettings["EMA"].strokeWidth, lastValueVisible: false, priceLineVisible: false });
             } else {
                try { indicatorSeriesRefs.current.ema.applyOptions({ color: currentSettings["EMA"].color, lineWidth: currentSettings["EMA"].strokeWidth }); } catch (e) {}
             }
             const period = parseInt(currentSettings["EMA"].period) || 14;
             if (closes.length > period) {
                const emaVals = EMA.calculate({ period, values: closes });
                const emaData = [];
                const offset = data.length - emaVals.length;
                for (let i=0; i<emaVals.length; i++) {
                   emaData.push({ time: data[offset + i].time, value: emaVals[i] });
                }
                indicatorSeriesRefs.current.ema.setData(emaData);
             }
         } else if (indicatorSeriesRefs.current.ema) {
             try { chart.removeSeries(indicatorSeriesRefs.current.ema); } catch (e) {}
             indicatorSeriesRefs.current.ema = null;
         }
      } catch (e) {
         console.warn("EMA Error caught safely:", e);
      }


      // SMA, EMA, WMA, WEMA Loop
      try {
         ['SMA', 'EMA', 'WMA', 'WEMA'].forEach(ind => {
            const refName = ind.toLowerCase() + "_loop";
            if (currentSettings[ind]?.enabled) {
                if (!indicatorSeriesRefs.current[refName]) {
                    indicatorSeriesRefs.current[refName] = chart.addSeries(LineSeries, { color: currentSettings[ind].color, lineWidth: currentSettings[ind].strokeWidth, lastValueVisible: false, priceLineVisible: false });
                } else {
                    try { indicatorSeriesRefs.current[refName].applyOptions({ color: currentSettings[ind].color, lineWidth: parseInt(currentSettings[ind].strokeWidth) || 2 }); } catch(e) {}
                }
                const period = parseInt(currentSettings[ind].period) || 14;
                if (closes.length > period) {
                    const IndClass = ind === 'SMA' ? SMA : ind === 'EMA' ? EMA : ind === 'WMA' ? WMA : WEMA;
                    const vals = IndClass.calculate({ period, values: closes });
                    const indData = [];
                    const offset = data.length - vals.length;
                    for (let i=0; i<vals.length; i++) indData.push({ time: data[offset + i].time, value: vals[i] });
                    indicatorSeriesRefs.current[refName].setData(indData);
                }
            } else if (indicatorSeriesRefs.current[refName]) { 
                try { chart.removeSeries(indicatorSeriesRefs.current[refName]); } catch(e){}
                indicatorSeriesRefs.current[refName] = null; 
            }
         });
      } catch (e) {
         console.warn("Moving Averages loop Error caught safely:", e);
      }
      
      // Secondary Chart Indicators
      [
         { name: 'ATR', fn: ATR, isObj: false },
         { name: 'ROC', fn: ROC, isObj: false },
         { name: 'CCI', fn: CCI, isObj: false },
         { name: 'WilliamsR', fn: WilliamsR, isObj: false },
         { name: 'TRIX', fn: TRIX, isObj: false },
         { name: 'ADX', fn: ADX, isObj: true, prop: 'adx' },
      ].forEach(ind => {
         const refName = ind.name.toLowerCase();
         if (currentSettings[ind.name]?.enabled) {
             if (!indicatorSeriesRefs.current[refName]) {
                 indicatorSeriesRefs.current[refName] = chart.addSeries(LineSeries, { color: currentSettings[ind.name].color, lineWidth: currentSettings[ind.name].strokeWidth, priceScaleId: refName, lastValueVisible: false, priceLineVisible: false });
                 try { chart.priceScale(refName).applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch(e) {}
             } else {
                 try { indicatorSeriesRefs.current[refName].applyOptions({ color: currentSettings[ind.name].color, lineWidth: parseInt(currentSettings[ind.name].strokeWidth) || 2 }); } catch (e) {}
             }
             const period = parseInt(currentSettings[ind.name].period) || 14;
             if (closes.length > period) {
                 const high = data.map(d => d.high);
                 const low = data.map(d => d.low);
                 let arg = { period, values: closes, high, low, close: closes };
                 const vals = ind.fn.calculate(arg);
                 const indData = [];
                 const offset = data.length - vals.length;
                 for (let i=0; i<vals.length; i++) {
                     let val = (ind.isObj && vals[i]) ? (vals[i] as any)[ind.prop as string] : vals[i];
                     if (val !== undefined && val !== null) indData.push({ time: data[offset + i].time, value: val });
                 }
                 if (indData.length > 0) indicatorSeriesRefs.current[refName].setData(indData);
             }
         } else if (indicatorSeriesRefs.current[refName]) { chart.removeSeries(indicatorSeriesRefs.current[refName]); indicatorSeriesRefs.current[refName] = null; }
      });
      
      // KST
      if (currentSettings["KST"]?.enabled) {
         if (!indicatorSeriesRefs.current.kstFast) {
            indicatorSeriesRefs.current.kstFast = chart.addSeries(LineSeries, { color: currentSettings["KST"].colorFast, lineWidth: 2, priceScaleId: 'kst', lastValueVisible: false, priceLineVisible: false });
            indicatorSeriesRefs.current.kstSlow = chart.addSeries(LineSeries, { color: currentSettings["KST"].colorSlow, lineWidth: 2, priceScaleId: 'kst', lastValueVisible: false, priceLineVisible: false });
            try { chart.priceScale('kst').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch (e) {}
         } else {
            try { indicatorSeriesRefs.current.kstFast.applyOptions({ color: currentSettings["KST"].colorFast }); } catch (e) {}
            try { indicatorSeriesRefs.current.kstSlow.applyOptions({ color: currentSettings["KST"].colorSlow }); } catch (e) {}
         }
         if (closes.length > 30) {
            const vals = KST.calculate({ 
               values: closes, ROCPer1: 10, ROCPer2: 15, ROCPer3: 20, ROCPer4: 30, SMAROCPer1: 10, SMAROCPer2: 10, SMAROCPer3: 10, SMAROCPer4: 15, signalPeriod: 9 
            });
            const fastData = [], slowData = [];
            const offset = data.length - vals.length;
            for (let i=0; i<vals.length; i++) {
               const time = data[offset + i].time;
               if (vals[i] && vals[i].kst !== undefined) fastData.push({ time, value: vals[i].kst });
               if (vals[i] && vals[i].signal !== undefined) slowData.push({ time, value: vals[i].signal });
            }
            if (fastData.length > 0) indicatorSeriesRefs.current.kstFast.setData(fastData);
            if (slowData.length > 0) indicatorSeriesRefs.current.kstSlow.setData(slowData);
         }
      } else if (indicatorSeriesRefs.current.kstFast) { 
         chart.removeSeries(indicatorSeriesRefs.current.kstFast); chart.removeSeries(indicatorSeriesRefs.current.kstSlow);
         indicatorSeriesRefs.current.kstFast = null; indicatorSeriesRefs.current.kstSlow = null;
      }

      // Keltner Channels
      if (currentSettings["Keltner Channels"]?.enabled) {
        if (!indicatorSeriesRefs.current.kcUpper) {
            indicatorSeriesRefs.current.kcUpper = chart.addSeries(LineSeries, { color: currentSettings["Keltner Channels"].color, lineWidth: 1.5, lastValueVisible: false, priceLineVisible: false });
            indicatorSeriesRefs.current.kcLower = chart.addSeries(LineSeries, { color: currentSettings["Keltner Channels"].color, lineWidth: 1.5, lastValueVisible: false, priceLineVisible: false });
        } else {
            try { indicatorSeriesRefs.current.kcUpper.applyOptions({ color: currentSettings["Keltner Channels"].color }); } catch (e) {}
            try { indicatorSeriesRefs.current.kcLower.applyOptions({ color: currentSettings["Keltner Channels"].color }); } catch (e) {}
        }
        const period = parseInt(currentSettings["Keltner Channels"].period) || 20;
        const multiplier = parseFloat(currentSettings["Keltner Channels"].multiplier) || 2;
        if (data.length > period) {
            const high = data.map(d => d.high);
            const low = data.map(d => d.low);
            const kcVals = KeltnerChannels.calculate({ high, low, close: closes, maPeriod: period, atrPeriod: period, multiplier, useSMA: true });
            const upperData = [], lowerData = [];
            const offset = data.length - kcVals.length;
            for (let i = 0; i < kcVals.length; i++) {
                if (kcVals[i]) {
                   if (kcVals[i].upper !== undefined) upperData.push({ time: data[offset + i].time, value: kcVals[i].upper });
                   if (kcVals[i].lower !== undefined) lowerData.push({ time: data[offset + i].time, value: kcVals[i].lower });
                }
            }
            indicatorSeriesRefs.current.kcUpper.setData(upperData);
            indicatorSeriesRefs.current.kcLower.setData(lowerData);
        }
      } else if (indicatorSeriesRefs.current.kcUpper) {
          chart.removeSeries(indicatorSeriesRefs.current.kcUpper);
          chart.removeSeries(indicatorSeriesRefs.current.kcLower);
          indicatorSeriesRefs.current.kcUpper = null;
      }

      // Chandelier Exit
      if (currentSettings["Chandelier Exit"]?.enabled) {
          if (!indicatorSeriesRefs.current.chanLong) {
              indicatorSeriesRefs.current.chanLong = chart.addSeries(LineSeries, { color: currentSettings["Chandelier Exit"].colorLong || '#22c55e', lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
              indicatorSeriesRefs.current.chanShort = chart.addSeries(LineSeries, { color: currentSettings["Chandelier Exit"].colorShort || '#ef4444', lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
          } else {
              try { indicatorSeriesRefs.current.chanLong.applyOptions({ color: currentSettings["Chandelier Exit"].colorLong }); } catch (e) {}
              try { indicatorSeriesRefs.current.chanShort.applyOptions({ color: currentSettings["Chandelier Exit"].colorShort }); } catch (e) {}
          }
          const period = parseInt(currentSettings["Chandelier Exit"].period) || 22;
          const multiplier = parseFloat(currentSettings["Chandelier Exit"].multiplier) || 3;
          if (data.length > period) {
              const high = data.map(d => d.high);
              const low = data.map(d => d.low);
              const chanVals = ChandelierExit.calculate({ high, low, close: closes, period, multiplier });
              const longData = [], shortData = [];
              const offset = data.length - chanVals.length;
              for (let i = 0; i < chanVals.length; i++) {
                  const val: any = chanVals[i];
                  if (val && val.exitLong !== undefined) longData.push({ time: data[offset+i].time, value: val.exitLong });
                  if (val && val.exitShort !== undefined) shortData.push({ time: data[offset+i].time, value: val.exitShort });
              }
              indicatorSeriesRefs.current.chanLong.setData(longData);
              indicatorSeriesRefs.current.chanShort.setData(shortData);
          }
      } else if (indicatorSeriesRefs.current.chanLong) {
          chart.removeSeries(indicatorSeriesRefs.current.chanLong);
          chart.removeSeries(indicatorSeriesRefs.current.chanShort);
          indicatorSeriesRefs.current.chanLong = null;
      }

      // PSAR
      try {
         if (currentSettings["Parabolic SAR"]?.enabled) {
             if (!indicatorSeriesRefs.current.psar) {
                indicatorSeriesRefs.current.psar = chart.addSeries(LineSeries, { color: currentSettings["Parabolic SAR"].color, lineWidth: currentSettings["Parabolic SAR"].strokeWidth, lineStyle: 1, priceLineVisible: false, lastValueVisible: false });
             } else {
                try { indicatorSeriesRefs.current.psar.applyOptions({ color: currentSettings["Parabolic SAR"].color, lineWidth: currentSettings["Parabolic SAR"].strokeWidth }); } catch (e) {}
             }
             const step = parseFloat(currentSettings["Parabolic SAR"].step) || 0.02;
             const max = parseFloat(currentSettings["Parabolic SAR"].max) || 0.2;
             if (data.length > 5) {
                const high = data.map(d => d.high);
                const low = data.map(d => d.low);
                const psarVals = PSAR.calculate({ step, max, high, low });
                const psarData = [];
                const offset = data.length - psarVals.length;
                for (let i=0; i<psarVals.length; i++) {
                   if (data[offset + i] !== undefined) {
                      psarData.push({ time: data[offset + i].time, value: psarVals[i] });
                   }
                }
                indicatorSeriesRefs.current.psar.setData(psarData);
             }
         } else if (indicatorSeriesRefs.current.psar) {
             try { chart.removeSeries(indicatorSeriesRefs.current.psar); } catch (e){}
             indicatorSeriesRefs.current.psar = null;
         }
      } catch (e) {
         console.warn("PSAR Error caught safely:", e);
      }
      
      // ADL
      try {
         if (currentSettings["ADL"]?.enabled) {
             if (!indicatorSeriesRefs.current.adl) {
                indicatorSeriesRefs.current.adl = chart.addSeries(LineSeries, { color: currentSettings["ADL"].color, lineWidth: currentSettings["ADL"].strokeWidth, priceScaleId: 'adl', lastValueVisible: false, priceLineVisible: false });
                try { chart.priceScale('adl').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch (e) {}
             } else {
                try { indicatorSeriesRefs.current.adl.applyOptions({ color: currentSettings["ADL"].color, lineWidth: currentSettings["ADL"].strokeWidth }); } catch (e) {}
             }
             if (data.length > 5) {
                const high = data.map(d => d.high);
                const low = data.map(d => d.low);
                const close = data.map(d => d.close);
                const volume = data.map(d => d.volume || 100);
                const adlVals = ADL.calculate({ high, low, close, volume });
                const adlData = [];
                const offset = data.length - adlVals.length;
                for (let i=0; i<adlVals.length; i++) {
                   if (data[offset + i] !== undefined) {
                      adlData.push({ time: data[offset + i].time, value: adlVals[i] });
                   }
                }
                indicatorSeriesRefs.current.adl.setData(adlData);
             }
         } else if (indicatorSeriesRefs.current.adl) {
             try { chart.removeSeries(indicatorSeriesRefs.current.adl); } catch (e) {}
             indicatorSeriesRefs.current.adl = null;
         }
      } catch (e) {
         console.warn("ADL Error caught safely:", e);
      }

      // ForceIndex
      try {
         if (currentSettings["ForceIndex"]?.enabled) {
             if (!indicatorSeriesRefs.current.forceindex) {
                indicatorSeriesRefs.current.forceindex = chart.addSeries(HistogramSeries, { color: currentSettings["ForceIndex"].color, priceScaleId: 'forceindex', lastValueVisible: false, priceLineVisible: false });
                try { chart.priceScale('forceindex').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch (e) {}
             } else {
                try { indicatorSeriesRefs.current.forceindex.applyOptions({ color: currentSettings["ForceIndex"].color }); } catch (e) {}
             }
             const period = parseInt(currentSettings["ForceIndex"].period) || 13;
             if (closes.length > period) {
                const volume = data.map(d => d.volume || 100);
                const forceindexVals = ForceIndex.calculate({ period, close: closes, volume });
                const fiData = [];
                const offset = data.length - forceindexVals.length;
                for (let i=0; i<forceindexVals.length; i++) {
                   if (data[offset + i] !== undefined) {
                      fiData.push({ time: data[offset + i].time, value: forceindexVals[i], color: forceindexVals[i] > 0 ? '#00C980' : '#FF4757' });
                   }
                }
                indicatorSeriesRefs.current.forceindex.setData(fiData);
             }
         } else if (indicatorSeriesRefs.current.forceindex) {
             try { chart.removeSeries(indicatorSeriesRefs.current.forceindex); } catch (e) {}
             indicatorSeriesRefs.current.forceindex = null;
         }
      } catch (e) {
         console.warn("ForceIndex Error caught safely:", e);
      }

      
      // StochRSI
      try {
         if (currentSettings["StochRSI"]?.enabled) {
            if (!indicatorSeriesRefs.current.stochRsiK) {
               indicatorSeriesRefs.current.stochRsiK = chart.addSeries(LineSeries, { color: currentSettings["StochRSI"].colorK, lineWidth: 2, priceScaleId: 'stochrsi', lastValueVisible: false, priceLineVisible: false });
               indicatorSeriesRefs.current.stochRsiD = chart.addSeries(LineSeries, { color: currentSettings["StochRSI"].colorD, lineWidth: 2, priceScaleId: 'stochrsi', lastValueVisible: false, priceLineVisible: false });
               try { chart.priceScale('stochrsi').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch (e) {}
            } else {
               try { indicatorSeriesRefs.current.stochRsiK.applyOptions({ color: currentSettings["StochRSI"].colorK }); } catch (e) {}
               try { indicatorSeriesRefs.current.stochRsiD.applyOptions({ color: currentSettings["StochRSI"].colorD }); } catch (e) {}
            }
            const rsiP = parseInt(currentSettings["StochRSI"].rsiPeriod) || 14;
            const stP = parseInt(currentSettings["StochRSI"].stochasticPeriod) || 14;
            const kP = parseInt(currentSettings["StochRSI"].kPeriod) || 3;
            const dP = parseInt(currentSettings["StochRSI"].dPeriod) || 3;
            if (closes.length > rsiP + stP + kP + dP) {
               const vals = StochasticRSI.calculate({ values: closes, rsiPeriod: rsiP, stochasticPeriod: stP, kPeriod: kP, dPeriod: dP });
               const kData = [], dData = [];
               const offset = data.length - vals.length;
               for (let i=0; i<vals.length; i++) {
                  if (data[offset + i] !== undefined && vals[i] !== undefined) {
                     const time = data[offset + i].time;
                     if (vals[i].k !== undefined) kData.push({ time, value: vals[i].k });
                     if (vals[i].d !== undefined) dData.push({ time, value: vals[i].d });
                  }
               }
               if (kData.length > 0) indicatorSeriesRefs.current.stochRsiK.setData(kData);
               if (dData.length > 0) indicatorSeriesRefs.current.stochRsiD.setData(dData);
            }
         } else if (indicatorSeriesRefs.current.stochRsiK) { 
            try { chart.removeSeries(indicatorSeriesRefs.current.stochRsiK); } catch (e){}
            try { chart.removeSeries(indicatorSeriesRefs.current.stochRsiD); } catch (e){}
            indicatorSeriesRefs.current.stochRsiK = null; indicatorSeriesRefs.current.stochRsiD = null;
         }
      } catch (e) {
         console.warn("StochRSI Error caught safely:", e);
      }

        // Alligator
        if (indicatorSettingsRef.current["Alligator"]?.enabled) {
          const currentSettings = indicatorSettingsRef.current;
          if (!indicatorSeriesRefs.current.alligatorJaw) {
             indicatorSeriesRefs.current.alligatorJaw = chart.addSeries(LineSeries, { color: currentSettings["Alligator"].colorJaw, lineWidth: 2, lastValueVisible: false, priceLineVisible: false });
             indicatorSeriesRefs.current.alligatorTeeth = chart.addSeries(LineSeries, { color: currentSettings["Alligator"].colorTeeth, lineWidth: 2, lastValueVisible: false, priceLineVisible: false });
             indicatorSeriesRefs.current.alligatorLips = chart.addSeries(LineSeries, { color: currentSettings["Alligator"].colorLips, lineWidth: 2, lastValueVisible: false, priceLineVisible: false });
          } else {
             try { indicatorSeriesRefs.current.alligatorJaw.applyOptions({ color: currentSettings["Alligator"].colorJaw }); } catch (e) {}
             try { indicatorSeriesRefs.current.alligatorTeeth.applyOptions({ color: currentSettings["Alligator"].colorTeeth }); } catch (e) {}
             try { indicatorSeriesRefs.current.alligatorLips.applyOptions({ color: currentSettings["Alligator"].colorLips }); } catch (e) {}
          }
          
          const jawP = parseInt(currentSettings["Alligator"].jawPeriod) || 13;
          const teethP = parseInt(currentSettings["Alligator"].teethPeriod) || 8;
          const lipsP = parseInt(currentSettings["Alligator"].lipsPeriod) || 5;
          const jawO = parseInt(currentSettings["Alligator"].jawOffset) || 8;
          const teethO = parseInt(currentSettings["Alligator"].teethOffset) || 5;
          const lipsO = parseInt(currentSettings["Alligator"].lipsOffset) || 3;

          const medians = data.map(d => (d.high + d.low) / 2);

          if (medians.length > Math.max(jawP*2, teethP*2, lipsP*2)) {
             const jawVals = EMA.calculate({ period: 2 * jawP - 1, values: medians });
             const teethVals = EMA.calculate({ period: 2 * teethP - 1, values: medians });
             const lipsVals = EMA.calculate({ period: 2 * lipsP - 1, values: medians });
             
             const jawData = [], teethData = [], lipsData = [];
             
             // Shift values forward by offsets
             const jawFull = new Array(jawO).fill(null).concat(jawVals);
             const teethFull = new Array(teethO).fill(null).concat(teethVals);
             const lipsFull = new Array(lipsO).fill(null).concat(lipsVals);

             const offset = data.length - jawFull.length;
             for(let i=0; i<jawFull.length; i++) {
                if (jawFull[i] !== null && (offset + i) >= 0 && (offset + i) < data.length) {
                   jawData.push({ time: data[offset + i].time, value: jawFull[i] });
                }
             }

             const tOffset = data.length - teethFull.length;
             for(let i=0; i<teethFull.length; i++) {
                if (teethFull[i] !== null && (tOffset + i) >= 0 && (tOffset + i) < data.length) {
                   teethData.push({ time: data[tOffset + i].time, value: teethFull[i] });
                }
             }

             const lOffset = data.length - lipsFull.length;
             for(let i=0; i<lipsFull.length; i++) {
                if (lipsFull[i] !== null && (lOffset + i) >= 0 && (lOffset + i) < data.length) {
                   lipsData.push({ time: data[lOffset + i].time, value: lipsFull[i] });
                }
             }

             indicatorSeriesRefs.current.alligatorJaw.setData(jawData);
             indicatorSeriesRefs.current.alligatorTeeth.setData(teethData);
             indicatorSeriesRefs.current.alligatorLips.setData(lipsData);
          }
        } else if (indicatorSeriesRefs.current.alligatorJaw) {
          chart.removeSeries(indicatorSeriesRefs.current.alligatorJaw);
          chart.removeSeries(indicatorSeriesRefs.current.alligatorTeeth);
          chart.removeSeries(indicatorSeriesRefs.current.alligatorLips);
          indicatorSeriesRefs.current.alligatorJaw = null;
          indicatorSeriesRefs.current.alligatorTeeth = null;
          indicatorSeriesRefs.current.alligatorLips = null;
       }

       // Gator Oscillator
       if (indicatorSettingsRef.current["Gator Oscillator"]?.enabled) {
          const currentSettings = indicatorSettingsRef.current;
          if (!indicatorSeriesRefs.current.gatorTop) {
             //@ts-ignore
             indicatorSeriesRefs.current.gatorTop = chart.addSeries(HistogramSeries, { priceScaleId: 'gator', lastValueVisible: false, priceLineVisible: false });
             //@ts-ignore
             indicatorSeriesRefs.current.gatorBottom = chart.addSeries(HistogramSeries, { priceScaleId: 'gator', lastValueVisible: false, priceLineVisible: false });
             try { chart.priceScale('gator').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch (e) {}
          }
          
          const jawP = 13, teethP = 8, lipsP = 5;
          if (closes.length > Math.max(jawP*2, teethP*2, lipsP*2)) {
             const jawVals = EMA.calculate({ period: 2 * jawP - 1, values: closes });
             const teethVals = EMA.calculate({ period: 2 * teethP - 1, values: closes });
             const lipsVals = EMA.calculate({ period: 2 * lipsP - 1, values: closes });
             
             const topData = [], bottomData = [];
             const minLen = Math.min(jawVals.length, teethVals.length, lipsVals.length);
             const dataOffset = data.length - minLen;
             
             for (let i=0; i<minLen; i++) {
                const jaw = jawVals[jawVals.length - minLen + i];
                const teeth = teethVals[teethVals.length - minLen + i];
                const lips = lipsVals[lipsVals.length - minLen + i];
                const time = data[dataOffset + i].time;
                
                const topVal = Math.abs(jaw - teeth);
                const bottomVal = -Math.abs(teeth - lips);
                
                //@ts-ignore
                topData.push({ time, value: topVal, color: i > 0 && topVal > Math.abs(jawVals[jawVals.length - minLen + i - 1] - teethVals[teethVals.length - minLen + i - 1]) ? '#22c55e' : '#ef4444' });
                //@ts-ignore
                bottomData.push({ time, value: bottomVal, color: i > 0 && Math.abs(bottomVal) > Math.abs(-Math.abs(teethVals[teethVals.length - minLen + i - 1] - lipsVals[lipsVals.length - minLen + i - 1])) ? '#22c55e' : '#ef4444' });
             }
             indicatorSeriesRefs.current.gatorTop.setData(topData);
             indicatorSeriesRefs.current.gatorBottom.setData(bottomData);
          }
       } else if (indicatorSeriesRefs.current.gatorTop) {
          chart.removeSeries(indicatorSeriesRefs.current.gatorTop);
          chart.removeSeries(indicatorSeriesRefs.current.gatorBottom);
          indicatorSeriesRefs.current.gatorTop = null;
          indicatorSeriesRefs.current.gatorBottom = null;
       }

       // ZigZag
       if (indicatorSettingsRef.current["ZigZag"]?.enabled) {
          const currentSettings = indicatorSettingsRef.current;
          if (!indicatorSeriesRefs.current.zigzag) {
             //@ts-ignore
             indicatorSeriesRefs.current.zigzag = chart.addSeries(LineSeries, { color: currentSettings["ZigZag"].color, lineWidth: currentSettings["ZigZag"].strokeWidth, priceLineVisible: false, lastValueVisible: false });
          } else {
             try { indicatorSeriesRefs.current.zigzag.applyOptions({ color: currentSettings["ZigZag"].color, lineWidth: currentSettings["ZigZag"].strokeWidth }); } catch (e) {}
          }
          
          if (data.length > 20) {
             const deviation = (parseFloat(currentSettings["ZigZag"].deviation) || 5) / 100;
             const zigzagData = [];
             let lastPivotPrice = data[0].close;
             let lastPivotType = 'none'; // 'high' or 'low'
             let lastPivotTime = data[0].time;
             
             zigzagData.push({ time: data[0].time, value: data[0].close });
             
             for (let i=1; i<data.length; i++) {
                const high = data[i].high;
                const low = data[i].low;
                
                if (lastPivotType === 'none') {
                   if ((high - lastPivotPrice) / lastPivotPrice >= deviation) {
                      lastPivotType = 'high';
                      lastPivotPrice = high;
                      lastPivotTime = data[i].time;
                      zigzagData.push({ time: lastPivotTime, value: lastPivotPrice });
                   } else if ((lastPivotPrice - low) / lastPivotPrice >= deviation) {
                      lastPivotType = 'low';
                      lastPivotPrice = low;
                      lastPivotTime = data[i].time;
                      zigzagData.push({ time: lastPivotTime, value: lastPivotPrice });
                   }
                } else if (lastPivotType === 'low') {
                   if ((high - lastPivotPrice) / lastPivotPrice >= deviation) {
                      lastPivotType = 'high';
                      lastPivotPrice = high;
                      lastPivotTime = data[i].time;
                      zigzagData.push({ time: lastPivotTime, value: lastPivotPrice });
                   } else if (low < lastPivotPrice) {
                      lastPivotPrice = low;
                      lastPivotTime = data[i].time;
                      //@ts-ignore
                      zigzagData[zigzagData.length - 1] = { time: lastPivotTime, value: lastPivotPrice };
                   }
                } else if (lastPivotType === 'high') {
                   if ((lastPivotPrice - low) / lastPivotPrice >= deviation) {
                      lastPivotType = 'low';
                      lastPivotPrice = low;
                      lastPivotTime = data[i].time;
                      zigzagData.push({ time: lastPivotTime, value: lastPivotPrice });
                   } else if (high > lastPivotPrice) {
                      lastPivotPrice = high;
                      lastPivotTime = data[i].time;
                      //@ts-ignore
                      zigzagData[zigzagData.length - 1] = { time: lastPivotTime, value: lastPivotPrice };
                   }
                }
             }
             indicatorSeriesRefs.current.zigzag.setData(zigzagData);
          }
       } else if (indicatorSeriesRefs.current.zigzag) {
          chart.removeSeries(indicatorSeriesRefs.current.zigzag);
          indicatorSeriesRefs.current.zigzag = null;
       }

       // Unified Moving Average (SMA, EMA, WMA, WEMA overlay line)
       if (currentSettings["Moving Average"]?.enabled) {
          if (!indicatorSeriesRefs.current.movingAverage) {
             indicatorSeriesRefs.current.movingAverage = chart.addSeries(LineSeries, { 
                color: currentSettings["Moving Average"].color || '#f59e0b', 
                lineWidth: currentSettings["Moving Average"].strokeWidth || 2, 
                lastValueVisible: false, 
                priceLineVisible: false 
             });
          } else {
             try { indicatorSeriesRefs.current.movingAverage.applyOptions({ 
                color: currentSettings["Moving Average"].color || '#f59e0b', 
                lineWidth: parseInt(currentSettings["Moving Average"].strokeWidth) || 2 
             }); } catch(e) {}
          }
          const period = parseInt(currentSettings["Moving Average"].period) || 14;
          const type = currentSettings["Moving Average"].type || "SMA";
          if (closes.length > period) {
              const IndClass = type === 'SMA' ? SMA : type === 'EMA' ? EMA : type === 'WMA' ? WMA : WEMA;
              const vals = IndClass.calculate({ period, values: closes });
              const maData = [];
              const offset = data.length - vals.length;
              for (let i = 0; i < vals.length; i++) {
                 maData.push({ time: data[offset + i].time, value: vals[i] });
              }
              indicatorSeriesRefs.current.movingAverage.setData(maData);
          }
       } else if (indicatorSeriesRefs.current.movingAverage) {
          chart.removeSeries(indicatorSeriesRefs.current.movingAverage);
          indicatorSeriesRefs.current.movingAverage = null;
       }

       // Awesome Oscillator
       if (currentSettings["Awesome Oscillator"]?.enabled) {
          if (!indicatorSeriesRefs.current.ao) {
             indicatorSeriesRefs.current.ao = chart.addSeries(HistogramSeries, { 
                priceScaleId: 'ao', 
                lastValueVisible: false, 
                priceLineVisible: false 
             });
             try { chart.priceScale('ao').applyOptions({ visible: false, scaleMargins: { top: 0.82, bottom: 0 } }); } catch(e) {}
          }
          const fastPeriod = parseInt(currentSettings["Awesome Oscillator"].fastPeriod) || 5;
          const slowPeriod = parseInt(currentSettings["Awesome Oscillator"].slowPeriod) || 34;
          if (data.length > slowPeriod) {
             const high = data.map(d => d.high);
             const low = data.map(d => d.low);
             const aoVals = AwesomeOscillator.calculate({ high, low, fastPeriod, slowPeriod });
             const aoData = [];
             const offset = data.length - aoVals.length;
             for (let i = 0; i < aoVals.length; i++) {
                const val = aoVals[i];
                const color = i > 0 && val >= aoVals[i-1] ? (currentSettings["Awesome Oscillator"].colorUp || '#22c55e') : (currentSettings["Awesome Oscillator"].colorDown || '#ef4444');
                if (data[offset + i] !== undefined) {
                   aoData.push({ time: data[offset + i].time, value: val, color });
                }
             }
             indicatorSeriesRefs.current.ao.setData(aoData);
          }
       } else if (indicatorSeriesRefs.current.ao) {
          chart.removeSeries(indicatorSeriesRefs.current.ao);
          indicatorSeriesRefs.current.ao = null;
       }

       // VWAP
       if (currentSettings["VWAP"]?.enabled) {
          if (!indicatorSeriesRefs.current.vwap) {
             indicatorSeriesRefs.current.vwap = chart.addSeries(LineSeries, { 
                color: currentSettings["VWAP"].color || '#6366f1', 
                lineWidth: currentSettings["VWAP"].strokeWidth || 2, 
                lastValueVisible: false, 
                priceLineVisible: false 
             });
          } else {
             try { indicatorSeriesRefs.current.vwap.applyOptions({ 
                color: currentSettings["VWAP"].color || '#6366f1', 
                lineWidth: parseInt(currentSettings["VWAP"].strokeWidth) || 2 
             }); } catch (e) {}
          }
          if (data.length > 5) {
             const high = data.map(d => d.high);
             const low = data.map(d => d.low);
             const close = data.map(d => d.close);
             const volume = data.map(d => d.volume || 100);
             const vwapVals = VWAP.calculate({ high, low, close, volume });
             const vwapData = [];
             const offset = data.length - vwapVals.length;
             for (let i = 0; i < vwapVals.length; i++) {
                if (data[offset + i] !== undefined) {
                   vwapData.push({ time: data[offset + i].time, value: vwapVals[i] });
                }
             }
             indicatorSeriesRefs.current.vwap.setData(vwapData);
          }
       } else if (indicatorSeriesRefs.current.vwap) {
          chart.removeSeries(indicatorSeriesRefs.current.vwap);
          indicatorSeriesRefs.current.vwap = null;
       }

       // Ichimoku Cloud
       if (currentSettings["Ichimoku Cloud"]?.enabled) {
          if (!indicatorSeriesRefs.current.ichimokuConversion) {
             indicatorSeriesRefs.current.ichimokuConversion = chart.addSeries(LineSeries, { color: currentSettings["Ichimoku Cloud"].colorConversion || '#3b82f6', lineWidth: 1.5, lastValueVisible: false, priceLineVisible: false });
             indicatorSeriesRefs.current.ichimokuBase = chart.addSeries(LineSeries, { color: currentSettings["Ichimoku Cloud"].colorBase || '#ef4444', lineWidth: 1.5, lastValueVisible: false, priceLineVisible: false });
          } else {
             try { indicatorSeriesRefs.current.ichimokuConversion.applyOptions({ color: currentSettings["Ichimoku Cloud"].colorConversion || '#3b82f6' }); } catch (e) {}
             try { indicatorSeriesRefs.current.ichimokuBase.applyOptions({ color: currentSettings["Ichimoku Cloud"].colorBase || '#ef4444' }); } catch (e) {}
          }
          const conversionPeriod = parseInt(currentSettings["Ichimoku Cloud"].conversionPeriod) || 9;
          const basePeriod = parseInt(currentSettings["Ichimoku Cloud"].basePeriod) || 26;
          const spanPeriod = parseInt(currentSettings["Ichimoku Cloud"].spanPeriod) || 52;
          const displacement = parseInt(currentSettings["Ichimoku Cloud"].displacement) || 26;
          if (data.length > spanPeriod) {
             const high = data.map(d => d.high);
             const low = data.map(d => d.low);
             const ichVals = IchimokuCloud.calculate({ high, low, conversionPeriod, basePeriod, spanPeriod, displacement });
             const convData = [];
             const baseData = [];
             const offset = data.length - ichVals.length;
             for (let i = 0; i < ichVals.length; i++) {
                const v = ichVals[i];
                if (v && data[offset + i] !== undefined) {
                   const time = data[offset + i].time;
                   if (v.conversion !== undefined) convData.push({ time, value: v.conversion });
                   if (v.base !== undefined) baseData.push({ time, value: v.base });
                }
             }
             if (convData.length > 0) indicatorSeriesRefs.current.ichimokuConversion.setData(convData);
             if (baseData.length > 0) indicatorSeriesRefs.current.ichimokuBase.setData(baseData);
          }
       } else if (indicatorSeriesRefs.current.ichimokuConversion) {
          chart.removeSeries(indicatorSeriesRefs.current.ichimokuConversion);
          chart.removeSeries(indicatorSeriesRefs.current.ichimokuBase);
          indicatorSeriesRefs.current.ichimokuConversion = null;
          indicatorSeriesRefs.current.ichimokuBase = null;
       }

       // Standard Deviation
       if (currentSettings["Standard Deviation"]?.enabled) {
          if (!indicatorSeriesRefs.current.sd) {
             indicatorSeriesRefs.current.sd = chart.addSeries(LineSeries, { color: currentSettings["Standard Deviation"].color || '#84cc16', lineWidth: 2, priceScaleId: 'sd', lastValueVisible: false, priceLineVisible: false });
             try { chart.priceScale('sd').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch(e) {}
          } else {
             try { indicatorSeriesRefs.current.sd.applyOptions({ color: currentSettings["Standard Deviation"].color || '#84cc16' }); } catch (e) {}
          }
          const period = parseInt(currentSettings["Standard Deviation"].period) || 14;
          if (closes.length > period) {
             const sdVals = SD.calculate({ period, values: closes });
             const sdData = [];
             const offset = data.length - sdVals.length;
             for (let i = 0; i < sdVals.length; i++) {
                if (data[offset + i] !== undefined) {
                   sdData.push({ time: data[offset + i].time, value: sdVals[i] });
                }
             }
             indicatorSeriesRefs.current.sd.setData(sdData);
          }
       } else if (indicatorSeriesRefs.current.sd) {
          chart.removeSeries(indicatorSeriesRefs.current.sd);
          indicatorSeriesRefs.current.sd = null;
       }

       // Momentum
       if (currentSettings["Momentum"]?.enabled) {
          if (!indicatorSeriesRefs.current.momentum) {
             indicatorSeriesRefs.current.momentum = chart.addSeries(LineSeries, { color: currentSettings["Momentum"].color || '#ec4899', lineWidth: 2, priceScaleId: 'momentum', lastValueVisible: false, priceLineVisible: false });
             try { chart.priceScale('momentum').applyOptions({ visible: false, scaleMargins: { top: 0.8, bottom: 0 } }); } catch(e) {}
          } else {
             try { indicatorSeriesRefs.current.momentum.applyOptions({ color: currentSettings["Momentum"].color || '#ec4899' }); } catch (e) {}
          }
          const period = parseInt(currentSettings["Momentum"].period) || 14;
          if (closes.length > period) {
             const momData = [];
             for (let i = period; i < closes.length; i++) {
                if (data[i] !== undefined) {
                   momData.push({ time: data[i].time, value: closes[i] - closes[i - period] });
                }
             }
             indicatorSeriesRefs.current.momentum.setData(momData);
          }
       } else if (indicatorSeriesRefs.current.momentum) {
          chart.removeSeries(indicatorSeriesRefs.current.momentum);
          indicatorSeriesRefs.current.momentum = null;
       }

       // Draw Markers (Williams Fractals, Social Trading, etc.)
       let chartMarkers: any[] = [];

       // 1. Williams Fractals
       if (currentSettings["Fractals"]?.enabled) {
          for (let i = 2; i < data.length - 2; i++) {
             const highVal = data[i].high;
             const lowVal = data[i].low;
             const time = data[i].time;

             // High Fractal
             if (highVal > data[i-1].high && highVal > data[i-2].high && highVal > data[i+1].high && highVal > data[i+2].high) {
                chartMarkers.push({
                   time,
                   position: 'aboveBar',
                   color: currentSettings["Fractals"].colorUp || '#34d399',
                   shape: 'arrowDown',
                   text: 'Fractal High'
                });
             }
             // Low Fractal
             if (lowVal < data[i-1].low && lowVal < data[i-2].low && lowVal < data[i+1].low && lowVal < data[i+2].low) {
                chartMarkers.push({
                   time,
                   position: 'belowBar',
                   color: currentSettings["Fractals"].colorDown || '#f87171',
                   shape: 'arrowUp',
                   text: 'Fractal Low'
                });
             }
          }
       }

       // 2. Social Trading Markers
       if (currentSettings["Social Trading"]?.enabled) {
          const interval = Math.max(10, Math.floor(data.length / 8));
          for (let i = 5; i < data.length; i += interval) {
             const time = data[i].time;
             const isBuy = (i % 2 === 0);
             const names = ["OBOROTEN", "Prestige", "VIP Trader", "CopyMaster", "Alpha Signals"];
             const traderName = names[Math.floor((i / interval) % names.length)];
             
             chartMarkers.push({
                time,
                position: isBuy ? 'belowBar' : 'aboveBar',
                color: isBuy ? '#22c55e' : '#ef4444',
                shape: isBuy ? 'arrowUp' : 'arrowDown',
                text: `${traderName} ${isBuy ? 'Buy' : 'Sell'}`
             });
          }
       }

       if (seriesRef.current && typeof (seriesRef.current as any).setMarkers === 'function') {
          chartMarkers.sort((a, b) => {
             const tA = typeof a.time === 'number' ? a.time : 0;
             const tB = typeof b.time === 'number' ? b.time : 0;
             return tA - tB;
          });
          try { (seriesRef.current as any).setMarkers(chartMarkers); } catch (e) {}
       }
    } catch (globalError) {
        console.warn("Soft error in refreshIndicators. Attempted applyOptions on removed scale or offline:", globalError);
    }
  };

  useEffect(() => {
    refreshIndicators();
  }, [indicatorSettings]);

  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showHallOfFameModal, setShowHallOfFameModal] = useState(false);
  const [showTradeHistoryModal, setShowTradeHistoryModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [showSignalsModal, setShowSignalsModal] = useState(false);
  const [showTournamentsModal, setShowTournamentsModal] = useState(false);
  const [timeframe, setTimeframe] = useState(() => {
    try {
      return localStorage.getItem('bivax_timeframe') || "1 minute";
    } catch(e) { return "1 minute"; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bivax_timeframe', timeframe);
    } catch(e) {}
  }, [timeframe]);
  const [chartType, setChartType] = useState(() => {
    try {
      return localStorage.getItem('bivax_chart_type') || "Candle";
    } catch(e) { return "Candle"; }
  });

  const [showQuoteDetails, setShowQuoteDetails] = useState(() => {
    try {
      return localStorage.getItem('bivax_quote_details') !== 'false';
    } catch(e) { return true; }
  });

  const [showTimer, setShowTimer] = useState(() => {
    try {
      return localStorage.getItem('bivax_show_timer') !== 'false';
    } catch(e) { return true; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bivax_chart_type', chartType);
    } catch(e) {}
  }, [chartType]);

  useEffect(() => {
    try {
      localStorage.setItem('bivax_quote_details', showQuoteDetails.toString());
    } catch(e) {}
  }, [showQuoteDetails]);

  useEffect(() => {
    try {
      localStorage.setItem('bivax_show_timer', showTimer.toString());
    } catch(e) {}
  }, [showTimer]);

  const chartTypeOptions = [
    {
      id: "Line",
      label: "Line",
      Icon: TrendingUp,
      preview: (
        <svg viewBox="0 0 100 40" className="w-[140px] h-[48px] opacity-90" preserveAspectRatio="none">
          <path d="M 0 35 L 5 28 L 10 32 L 15 20 L 20 22 L 25 15 L 30 18 L 35 12 L 40 16 L 45 10 L 50 14 L 55 5 L 60 12 L 65 10 L 70 5 L 75 8 L 80 18 L 85 22 L 90 28 L 95 25 L 100 28" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: "Candle",
      label: "Candle",
      Icon: CandlestickChart,
      preview: (
        <svg viewBox="0 0 100 40" className="w-[140px] h-[48px] opacity-100" preserveAspectRatio="none">
          <g strokeWidth="0.8">
            <line x1="5" y1="20" x2="5" y2="40" stroke="#22c55e" />
            <rect x="3" y="25" width="4" height="10" fill="#22c55e" stroke="none" />
            <line x1="12" y1="15" x2="12" y2="30" stroke="#22c55e" />
            <rect x="10" y="18" width="4" height="8" fill="#22c55e" stroke="none" />
            <line x1="19" y1="10" x2="19" y2="25" stroke="#22c55e" />
            <rect x="17" y="15" width="4" height="7" fill="#22c55e" stroke="none" />
            <line x1="26" y1="12" x2="26" y2="28" stroke="#ef4444" />
            <rect x="24" y="16" width="4" height="8" fill="#ef4444" stroke="none" />
            <line x1="33" y1="20" x2="33" y2="35" stroke="#ef4444" />
            <rect x="31" y="24" width="4" height="7" fill="#ef4444" stroke="none" />
            <line x1="40" y1="15" x2="40" y2="30" stroke="#22c55e" />
            <rect x="38" y="18" width="4" height="8" fill="#22c55e" stroke="none" />
            <line x1="47" y1="5" x2="47" y2="20" stroke="#22c55e" />
            <rect x="45" y="8" width="4" height="8" fill="#22c55e" stroke="none" />
            <line x1="54" y1="8" x2="54" y2="25" stroke="#ef4444" />
            <rect x="52" y="12" width="4" height="10" fill="#ef4444" stroke="none" />
            <line x1="61" y1="15" x2="61" y2="30" stroke="#ef4444" />
            <rect x="59" y="18" width="4" height="8" fill="#ef4444" stroke="none" />
            <line x1="68" y1="20" x2="68" y2="38" stroke="#ef4444" />
            <rect x="66" y="25" width="4" height="10" fill="#ef4444" stroke="none" />
            <line x1="75" y1="25" x2="75" y2="40" stroke="#22c55e" />
            <rect x="73" y="28" width="4" height="8" fill="#22c55e" stroke="none" />
            <line x1="82" y1="22" x2="82" y2="35" stroke="#22c55e" />
            <rect x="80" y="25" width="4" height="6" fill="#22c55e" stroke="none" />
            <line x1="89" y1="25" x2="89" y2="42" stroke="#ef4444" />
            <rect x="87" y="28" width="4" height="10" fill="#ef4444" stroke="none" />
            <line x1="96" y1="30" x2="96" y2="45" stroke="#ef4444" />
            <rect x="94" y="32" width="4" height="10" fill="#ef4444" stroke="none" />
          </g>
        </svg>
      )
    },
    {
      id: "Mountain",
      label: "Mountain",
      Icon: Cloud,
      preview: (
        <svg viewBox="0 0 100 40" className="w-[140px] h-[48px] opacity-90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mountain-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d="M 0 35 L 5 28 L 10 32 L 15 20 L 20 22 L 25 15 L 30 18 L 35 12 L 40 16 L 45 10 L 50 14 L 55 5 L 60 12 L 65 10 L 70 5 L 75 8 L 80 18 L 85 22 L 90 28 L 95 25 L 100 28" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 0 35 L 5 28 L 10 32 L 15 20 L 20 22 L 25 15 L 30 18 L 35 12 L 40 16 L 45 10 L 50 14 L 55 5 L 60 12 L 65 10 L 70 5 L 75 8 L 80 18 L 85 22 L 90 28 L 95 25 L 100 28 L 100 40 L 0 40 Z" fill="url(#mountain-grad)" stroke="none" />
        </svg>
      )
    },
    {
      id: "Bar",
      label: "Bar",
      Icon: BarChart2,
      preview: (
        <svg viewBox="0 0 100 40" className="w-[140px] h-[48px] opacity-100" preserveAspectRatio="none">
          <g strokeWidth="1">
            <line x1="5" y1="20" x2="5" y2="40" stroke="#22c55e" />
            <line x1="3" y1="35" x2="5" y2="35" stroke="#22c55e" />
            <line x1="5" y1="25" x2="7" y2="25" stroke="#22c55e" />
            <line x1="14" y1="15" x2="14" y2="30" stroke="#22c55e" />
            <line x1="12" y1="26" x2="14" y2="26" stroke="#22c55e" />
            <line x1="14" y1="18" x2="16" y2="18" stroke="#22c55e" />
            <line x1="23" y1="10" x2="23" y2="25" stroke="#22c55e" />
            <line x1="21" y1="22" x2="23" y2="22" stroke="#22c55e" />
            <line x1="23" y1="15" x2="25" y2="15" stroke="#22c55e" />
            <line x1="32" y1="12" x2="32" y2="28" stroke="#ef4444" />
            <line x1="30" y1="16" x2="32" y2="16" stroke="#ef4444" />
            <line x1="32" y1="24" x2="34" y2="24" stroke="#ef4444" />
            <line x1="41" y1="20" x2="41" y2="35" stroke="#ef4444" />
            <line x1="39" y1="24" x2="41" y2="24" stroke="#ef4444" />
            <line x1="41" y1="31" x2="43" y2="31" stroke="#ef4444" />
            <line x1="50" y1="15" x2="50" y2="30" stroke="#22c55e" />
            <line x1="48" y1="26" x2="50" y2="26" stroke="#22c55e" />
            <line x1="50" y1="18" x2="52" y2="18" stroke="#22c55e" />
            <line x1="59" y1="5" x2="59" y2="20" stroke="#22c55e" />
            <line x1="57" y1="16" x2="59" y2="16" stroke="#22c55e" />
            <line x1="59" y1="8" x2="61" y2="8" stroke="#22c55e" />
            <line x1="68" y1="8" x2="68" y2="25" stroke="#ef4444" />
            <line x1="66" y1="12" x2="68" y2="12" stroke="#ef4444" />
            <line x1="68" y1="22" x2="70" y2="22" stroke="#ef4444" />
            <line x1="77" y1="15" x2="77" y2="30" stroke="#ef4444" />
            <line x1="75" y1="18" x2="77" y2="18" stroke="#ef4444" />
            <line x1="77" y1="26" x2="79" y2="26" stroke="#ef4444" />
            <line x1="86" y1="20" x2="86" y2="38" stroke="#ef4444" />
            <line x1="84" y1="25" x2="86" y2="25" stroke="#ef4444" />
            <line x1="86" y1="35" x2="88" y2="35" stroke="#ef4444" />
            <line x1="95" y1="25" x2="95" y2="40" stroke="#22c55e" />
            <line x1="93" y1="36" x2="95" y2="36" stroke="#22c55e" />
            <line x1="95" y1="28" x2="97" y2="28" stroke="#22c55e" />
          </g>
        </svg>
      )
    },
    {
      id: "Heikin Ashi",
      label: "Heikin Ashi",
      Icon: Wind,
      preview: (
        <svg viewBox="0 0 100 40" className="w-[140px] h-[48px] opacity-100" preserveAspectRatio="none">
          <g strokeWidth="0.8">
            <line x1="10" y1="25" x2="10" y2="38" stroke="#ef4444" />
            <rect x="8" y="27" width="4" height="9" fill="#ef4444" stroke="none" />
            <line x1="19" y1="20" x2="19" y2="35" stroke="#ef4444" />
            <rect x="17" y="24" width="4" height="8" fill="#ef4444" stroke="none" />
            <line x1="28" y1="15" x2="28" y2="32" stroke="#ef4444" />
            <rect x="26" y="18" width="4" height="12" fill="#ef4444" stroke="none" />
            <line x1="37" y1="10" x2="37" y2="28" stroke="#ef4444" />
            <rect x="35" y="14" width="4" height="10" fill="#ef4444" stroke="none" />
            <line x1="46" y1="5" x2="46" y2="22" stroke="#ef4444" />
            <rect x="44" y="8" width="4" height="12" fill="#ef4444" stroke="none" />
            <line x1="55" y1="8" x2="55" y2="25" stroke="#ef4444" />
            <rect x="53" y="12" width="4" height="10" fill="#ef4444" stroke="none" />
            <line x1="64" y1="15" x2="64" y2="35" stroke="#ef4444" />
            <rect x="62" y="20" width="4" height="13" fill="#ef4444" stroke="none" />
            <line x1="73" y1="20" x2="73" y2="40" stroke="#ef4444" />
            <rect x="71" y="25" width="4" height="12" fill="#ef4444" stroke="none" />
            <line x1="82" y1="28" x2="82" y2="42" stroke="#3b82f6" />
            <rect x="80" y="32" width="4" height="10" fill="#3b82f6" stroke="none" />
            <line x1="91" y1="20" x2="91" y2="36" stroke="#3b82f6" />
            <rect x="89" y="22" width="4" height="10" fill="#3b82f6" stroke="none" />
          </g>
        </svg>
      )
    }
  ];
  
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nowMs = now.getTime();
  const [targetExpiration, setTargetExpiration] = useState<Date | null>(null);
  const [candleTimer, setCandleTimer] = useState(15);

  const getNextAvailableExpirations = (currentTime: Date) => {
    const base = new Date(currentTime);
    base.setSeconds(0);
    base.setMilliseconds(0);
    
    const expirations: Date[] = [];
    
    // First possible expiration is the end of the current minute
    let firstExp = new Date(base);
    // 30-second rule: if there are less than 30 seconds left in the current minute (i.e. seconds >= 30),
    // then the first expiration must be pushed to the NEXT minute (base + 2 minutes)
    if (currentTime.getSeconds() >= 30) {
      firstExp.setMinutes(base.getMinutes() + 2);
    } else {
      firstExp.setMinutes(base.getMinutes() + 1);
    }
    
    for (let i = 0; i < 5; i++) {
        const d = new Date(firstExp);
        d.setMinutes(firstExp.getMinutes() + i);
        expirations.push(d);
    }
    return expirations;
  };

  const defaultExpirations = getNextAvailableExpirations(now);
  const defaultExpiration = defaultExpirations[0];
  
  const expirationDate = targetExpiration && targetExpiration.getTime() > nowMs ? targetExpiration : defaultExpiration;
  const exactExpirationTime = expirationDate.getTime();
  const purchaseDeadlineTime = exactExpirationTime;
  
  const timeToPurchase = Math.max(0, Math.floor((purchaseDeadlineTime - nowMs) / 1000));
  const expirationString = expirationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
  
  const formatTimeToPurchase = (secs: number) => {
      if (secs < 60) return `:${secs < 10 ? '0' + secs : secs}`;
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }

  const increaseTime = () => {
      const newExpiration = new Date(exactExpirationTime);
      newExpiration.setMinutes(newExpiration.getMinutes() + 1);
      setTargetExpiration(newExpiration);
  };

  const decreaseTime = () => {
      const newExpiration = new Date(exactExpirationTime);
      newExpiration.setMinutes(newExpiration.getMinutes() - 1);
      if (newExpiration.getTime() >= defaultExpiration.getTime()) {
          setTargetExpiration(newExpiration);
      } else {
          setTargetExpiration(null);
      }
  };
  
  // Ref to hold the current candle data being built
  const activeCandleRef = useRef<any>(null);

  const [systemActive, setSystemActive] = useState(true);
  const [markets, setMarkets] = useState<any>({});
  const [activitiesBanners, setActivitiesBanners] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "stories"), where("isActive", "==", true), orderBy("order", "asc"), limit(20));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docs.length > 0) {
        setActivitiesBanners(docs);
      }
    }, (err) => console.warn("Failed to listen to stories:", err.message));
    return () => unsub();
  }, []);
  const [dataError, setDataError] = useState<string | null>(null);
  const [showBottomHistory, setShowBottomHistory] = useState(false);
  const [sidebarTradeTab, setSidebarTradeTab] = useState<"trades" | "history">("trades");
  const [isTradeHistoryVisible, setIsTradeHistoryVisible] = useState(true);
  const [bottomTab, setBottomTab] = useState<"active" | "closed" | "history">("active");
  const [isBottomPanelMinimized, setIsBottomPanelMinimized] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);


  const [assetSearch, setAssetSearch] = useState("");
  const [assetCategory, setAssetCategory] = useState("All");
  const [assetGroup, setAssetGroup] = useState("FTT");
  const assetSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCalcAmount(prev => prev !== amount ? amount : prev);
  }, [amount]);

  useEffect(() => {
    if (markets && markets[activeAsset]) {
      const newPayout = markets[activeAsset].payout || 82;
      setCalcPayout(prev => prev !== newPayout ? newPayout : prev);
    }
  }, [activeAsset, markets?.[activeAsset]?.payout]);

  // Global Static Data Effect - Removed in favor of aggregate boot API

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Fetch permanent history directly from PostgreSQL backend
    const fetchDbTransactions = async () => {
      try {
        const token = (await auth.currentUser?.getIdToken().catch(() => null)) || localStorage.getItem('token');
        const res = await fetch('/api/wallet/transactions', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json().catch(() => []);
          if (Array.isArray(data) && data.length > 0) {
            const mappedDb = data.map((t: any) => {
              const date = new Date(t.timestamp || t.created_at || Date.now());
              const sLower = String(t.status || 'pending').toLowerCase();
              let statusDisplay = "Pending";
              if (['success', 'approved', 'completed', 'credited'].includes(sLower)) statusDisplay = "Completed";
              else if (['rejected', 'declined', 'cancelled', 'canceled'].includes(sLower)) statusDisplay = "Rejected";

              return {
                id: String(t.id || ''),
                orderId: t.orderId || t.details?.orderId || '',
                trxId: t.trxId || t.tx_hash || '',
                dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone }),
                timeStr: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }),
                type: (t.type || 'Deposit').toLowerCase() === 'deposit' ? 'Deposit' : 'Withdrawal',
                method: t.method || (t.type === 'deposit' ? 'Deposit' : 'Withdrawal'),
                amount: Number(t.amount) || 0,
                currency: t.currency || 'BDT',
                status: statusDisplay,
                timestamp: date.getTime()
              };
            }).filter(tx => tx.amount > 0);

            setUserTransactions(prev => {
              const combined = [...prev];
              const seen = new Set(combined.map(c => c.orderId ? `order_${c.orderId}` : (c.trxId && !c.trxId.includes('Pending') ? `trx_${c.trxId}` : `id_${c.id}`)));
              for (const m of mappedDb) {
                const k = m.orderId ? `order_${m.orderId}` : (m.trxId && !m.trxId.includes('Pending') ? `trx_${m.trxId}` : `id_${m.id}`);
                if (!seen.has(k)) {
                  seen.add(k);
                  combined.push(m);
                }
              }
              return combined.sort((a, b) => b.timestamp - a.timestamp);
            });
          }
        }
      } catch (err) {
        console.warn("Failed to fetch database transactions:", err);
      }
    };
    fetchDbTransactions();

    // Listen to Deposits in real-time
    const qDeps = query(collection(db, "deposits"), where("userId", "==", currentUser.uid), limit(50));
    const unsubDeps = onSnapshot(qDeps, (snapshot) => {
        const rawDeps = snapshot.docs
          .map(doc => {
            const data = doc.data();
            const date = (data.timestamp && typeof data.timestamp.toDate === 'function') ? data.timestamp.toDate() : new Date(data.timestamp || Date.now());
            const sLower = String(data.status || '').toLowerCase().trim();
            let statusDisplay = "Pending";
            if (['success', 'approved', 'completed', 'credited'].includes(sLower)) statusDisplay = "Completed";
            else if (['rejected', 'declined', 'cancelled', 'canceled'].includes(sLower)) statusDisplay = "Rejected";

            const rawAmt = data.amount || data.creditedAmount || data.baseAmount;
            const cleanedAmt = rawAmt ? parseFloat(String(rawAmt).replace(/,/g, '').replace(/[^0-9.-]/g, '')) : 0;
            const amt = isNaN(cleanedAmt) ? 0 : cleanedAmt;
            
            let methodLabel = data.method;
            if (!methodLabel || methodLabel === 'Selected Method') {
                methodLabel = data.category || (data.walletNumber ? 'Crypto / E-Wallet' : 'Deposit');
            }

            return {
                id: doc.id,
                orderId: data.orderId || '',
                trxId: data.trxId || '',
                dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone }),
                timeStr: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }),
                type: "Deposit",
                method: methodLabel,
                amount: amt,
                status: statusDisplay,
                timestamp: date.getTime()
            };
        })
        .filter(d => d.amount > 0);

        // Deduplicate deposits by orderId or trxId
        const dedupedDeps: any[] = [];
        const seenKeys = new Set<string>();
        for (const dep of rawDeps) {
            const key = dep.orderId ? `order_${dep.orderId}` : (dep.trxId && !dep.trxId.includes('Pending') ? `trx_${dep.trxId}` : `id_${dep.id}`);
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                dedupedDeps.push(dep);
            }
        }

        setUserTransactions(prev => {
            const filtered = prev.filter(t => t.type !== "Deposit");
            return [...filtered, ...dedupedDeps].sort((a, b) => b.timestamp - a.timestamp);
        });
    }, (e) => console.warn("Failed to listen to deposits:", e.message));

    // Listen to Withdrawals in real-time
    const qWiths = query(collection(db, "withdrawals"), where("userId", "==", currentUser.uid), limit(50));
    const unsubWiths = onSnapshot(qWiths, (snapshot) => {
        const rawWiths = snapshot.docs
          .map(doc => {
            const data = doc.data();
            const date = (data.timestamp && typeof data.timestamp.toDate === 'function') ? data.timestamp.toDate() : new Date(data.timestamp || Date.now());
            const sLower = String(data.status || '').toLowerCase().trim();
            let statusDisplay = "Pending";
            if (['success', 'approved', 'completed', 'credited'].includes(sLower)) statusDisplay = "Completed";
            else if (['rejected', 'declined', 'cancelled', 'canceled'].includes(sLower)) statusDisplay = "Rejected";

            const rawAmt = data.amount;
            const cleanedAmt = rawAmt ? parseFloat(String(rawAmt).replace(/,/g, '').replace(/[^0-9.-]/g, '')) : 0;
            const amt = isNaN(cleanedAmt) ? 0 : cleanedAmt;

            let methodLabel = data.method;
            if (!methodLabel || methodLabel === 'Selected Method') {
                methodLabel = data.category || 'Withdrawal';
            }

            return {
                id: doc.id,
                orderId: data.orderId || '',
                dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone }),
                timeStr: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }),
                type: "Withdrawal",
                method: methodLabel,
                amount: amt,
                status: statusDisplay,
                timestamp: date.getTime()
            };
        })
        .filter(w => w.amount > 0);

        const dedupedWiths: any[] = [];
        const seenKeys = new Set<string>();
        for (const withItem of rawWiths) {
            const key = withItem.orderId ? `order_${withItem.orderId}` : `id_${withItem.id}`;
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                dedupedWiths.push(withItem);
            }
        }

        setUserTransactions(prev => {
            const filtered = prev.filter(t => t.type !== "Withdrawal");
            return [...filtered, ...dedupedWiths].sort((a, b) => b.timestamp - a.timestamp);
        });
    }, (e) => console.warn("Failed to listen to withdrawals:", e.message));

    return () => {
        unsubDeps();
        unsubWiths();
    };
  }, [currentUser?.uid, cashierTab]);

  useEffect(() => {
    if (currentUser?.uid && userTransactions.length > 0) {
      const hasCompleted = userTransactions.some(t => t.type === 'Deposit' && t.status === 'Completed');
      if (hasCompleted) {
        localStorage.setItem(`hasCompletedDeposits_${currentUser.uid}`, 'true');
      } else {
        localStorage.setItem(`hasCompletedDeposits_${currentUser.uid}`, 'false');
      }
    }
  }, [userTransactions, currentUser?.uid]);

  useEffect(() => {
    if (!currentUser?.uid || !selectedTournament?.id) return;

    const tid = selectedTournament.id;
    const q = query(
        collection(db, 'tournaments', tid, 'participants'),
        orderBy('score', 'desc'),
        limit(50)
    );
    
    getDocs(q).then((snapshot) => {
        const parts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTournamentParticipants(parts);
    }).catch(err => console.warn("Tournament participants fetch failed:", err.message));
  }, [currentUser?.uid, selectedTournament?.id]);

  const handleRegisterTournament = async (tournament: any) => {
    if (!auth.currentUser) return;
    
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`/api/tournaments/${tournament.id}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await res.json();
        
        if (data.success) {
            setUserRegistrations(prev => [...prev, tournament.id]);
            setActiveTournamentId(tournament.id);
            setAccountType("tournament");
            setTournamentBalance(10000.0);
            toast.success(`Registered successfully! Switched to "${tournament.title}" Tournament Trading.`);
            
            // Re-sync user to update real balance
            const syncRes = await fetch('/api/user/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: auth.currentUser?.uid })
            });
            if (syncRes.ok) {
                const syncData = await syncRes.json();
                const uData = syncData?.data || syncData?.user;
                if (uData) {
                    const rawBal = uData.balance ?? uData.realBalance ?? uData.real_balance;
                    const val = parseFloat(rawBal?.toString());
                    if (!isNaN(val)) {
                        setRealBalance(val);
                        realBalanceRef.current = val;
                    }
                }
            }
        } else {
            toast.error(data.error || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed. Please try again.");
    }
  };

  const updateTournamentScore = async (amount: number, isWin: boolean) => {
    if (accountType !== 'tournament' || !activeTournamentId || !auth.currentUser) return;
    
    // Update local state for immediate feedback
    setTournamentBalance(prev => prev + amount);
    
    // Update Firestore to sync with leaderboard
    try {
        const participantRef = doc(db, 'tournaments', activeTournamentId, 'participants', auth.currentUser.uid);
        await updateDoc(participantRef, {
            score: increment(amount),
            tradesCount: increment(1)
        });
    } catch (e) {
        console.warn("Tournament score update failed:", e);
    }
  };

  const createSupportTicket = async (subject: string, message: string) => {
    if (!currentUser) {
      toast.error("Please log in to contact support");
      return;
    }
    try {
      const ticketId = doc(collection(db, 'tickets')).id;
      const initialTicketData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
        subject: subject,
        status: 'Open',
        priority: 'medium',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      try {
        await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId, ticketData: initialTicketData })
        });
      } catch (error) {
        console.error("Server ticket creation failed:", error);
        return;
      }

      const messageId = doc(collection(db, 'tickets', ticketId, 'messages')).id;
      const initialMessageData = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
        senderType: 'user',
        text: message,
        createdAt: Date.now()
      };

      try {
        await fetch('/api/tickets/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId, messageId, messageData: initialMessageData })
        });
      } catch (error) {
        console.error("Server message creation failed:", error);
      }

      toast.success("Support ticket created!");
      return ticketId;
    } catch (e) {
      console.error("Error creating ticket:", e);
      toast.error("Failed to create ticket");
    }
  };

  const handleTicketFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTicketAttachedFiles((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendTicketMessage = async () => {
    if (!selectedTicket || (!ticketReply.trim() && ticketAttachedFiles.length === 0) || !currentUser) return;
    const tid = selectedTicket.id;
    try {
      const messageId = doc(collection(db, 'tickets', tid, 'messages')).id;
      const messageData = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
        senderType: 'user',
        text: ticketReply,
        attachments: ticketAttachedFiles,
        createdAt: Date.now()
      };

      try {
        await fetch('/api/tickets/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: tid, messageId, messageData })
        });
      } catch (error) {
        console.error("Server message creation failed:", error);
        return;
      }
      
      try {
        await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: tid, ticketData: {
            lastMessage: ticketReply,
            updatedAt: Date.now()
          }})
        });
      } catch (error) {
        console.error("Server ticket update failed:", error);
        return;
      }

      const msg = ticketReply;
      setTicketReply("");
      setTicketAttachedFiles([]);
    } catch (e) {
      console.error("Error sending message:", e);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCandleTimer((prev) => (prev <= 1 ? 15 : prev - 1));
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  type Trade = {
    id: string;
    type: "up" | "down";
    entryPrice: number;
    amount: number;
    timeLeft: number;
    expirationTime: number;
    entryTime: any;
    payout: number;
    payoutRate?: number;
    asset: string;
    status?: 'open' | 'won' | 'lost' | 'draw';
    exitPrice?: number;
    closedAt?: number;
    accountType?: 'real' | 'demo' | 'tournament';
    account_type?: string;
    isDemo?: boolean;
    is_demo?: boolean;
    expiryTime?: number;
    expiry_time?: number;
    createdAt: number;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [isPastHistoryLoading, setIsPastHistoryLoading] = useState(false);
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    if (activeTab === 'history') {
      setHistoryLoading(true);
      const timer = setTimeout(() => {
        setHistoryLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (activeTab === 'activities') {
      setActivitiesLoading(true);
      const timer = setTimeout(() => {
        setActivitiesLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);
  
  useEffect(() => {
    // Remove artificial delay to show chart immediately
    setContentReady(true);
  }, []);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef2 = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const chartRef2 = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const seriesRef2 = useRef<ISeriesApi<any> | null>(null);
  const socketRef = useRef<any>(null);
  const [initialHistoryCache] = useState(() => {
    return {};
  });
  const historyCacheRef = useRef<Record<string, any>>(initialHistoryCache);
  const liveCandlesCacheRef = useRef<Record<string, any>>({});
  const saveHistoryCacheSafely = (cacheObj: Record<string, any>) => {
    // No-op to prevent saving stale/estimated candles to localStorage, ensuring 100% clean sync on app re-entry
  };

  const loadMorePastRef = useRef<() => void>((() => {}));

  const handleLoadMorePast = () => {
    try {
      const activePair = activeAssetRef.current;
      if (!activePair) return;
      
      const currentHistory = historyCacheRef.current[activePair] || [];
      if (currentHistory.length === 0) return;
      
      const oldestCandle = currentHistory[0];
      const oldestTime = oldestCandle.time;
      
      if (socketRef.current && socketRef.current.connected) {
         setIsPastHistoryLoading(true);
         isGeneratingRef.current = true;
         
         socketRef.current.emit('request_past_candles', {
           asset: activePair,
           accountType: accountTypeRef.current,
           timeframe: timeframeRef.current,
           beforeTime: oldestTime,
           limit: 1000
         });
      }
    } catch (e) {
      console.warn("Failed to request past history:", e);
      isGeneratingRef.current = false;
      setIsPastHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadMorePastRef.current = handleLoadMorePast;
  }, [handleLoadMorePast]);

  const pruneOldDemoTrades = async (userId: string) => {
    try {
      const res = await fetch('/api/trade/prune-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        let data: any = { success: false };
        try {
          const text = await res.text();
          if (text) {
            try {
              data = JSON.parse(text);
            } catch {
              console.warn("Non-JSON prune-demo response:", text);
            }
          }
        } catch {}
        if (data && data.success && data.prunedCount > 0) {
          console.log(`Successfully pruned ${data.prunedCount} old closed demo trades via server API for user ${userId}`);
        }
      }
    } catch (err) {
      console.warn("Demo trade maintenance temporary bypass:", err);
    }
  };
  const lastCandleRef = useRef<any>(null);
  const rawLastCandleRef = useRef<any>(null); // To store non-HA data for price updates
  const lastChartUpdateTimeRef = useRef<number>(0);
  const targetPriceRef = useRef<number>(0);
  const currentInterpolatedPriceRef = useRef<number>(0);

  // Tracking refs to identify structural changes and preserve zoom
  const prevAssetRefRender = useRef<string | null>(null);
  const prevTimeframeRefRender = useRef<string | null>(null);
  const prevChartTypeRefRender = useRef<string | null>(null);
  const crosshairCallbackRef = useRef<any>(null);
  const lastZoomedAssetRef = useRef<string | null>(null);
  const timerOverlayRef = useRef<HTMLDivElement | null>(null);
  const purchaseLineXRef = useRef<number | null>(null);
  const expirationLineXRef = useRef<number | null>(null);
  const tradeElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const lastRenderedPriceRef = useRef<number>(0);
  const lastRenderedTimeRef = useRef<number>(0);

  const [purchaseLineX, setPurchaseLineX] = useState<number | null>(null);
  const [expirationLineX, setExpirationLineX] = useState<number | null>(null);

  const alignChartRightByIdx = (idx: number, fallbackLen: number = 0, delay: number = 50) => {
    const chart = idx === 0 ? chartRef.current : chartRef2.current;
    if (!chart) return;
    try {
      chart.timeScale().scrollToRealTime();
    } catch (e) {}
    
    if (delay > 0) {
      setTimeout(() => {
        const c = idx === 0 ? chartRef.current : chartRef2.current;
        if (!c) return;
        try {
          c.timeScale().scrollToRealTime();
        } catch (e) {}
      }, delay);
    }
  };

  useEffect(() => {
    let rafId: number;
    const updateLine = () => {
      const chartConfigs = (isMultiChart && !isMobile ? [0, 1] : [0]);
      
      const isLineOrMountain = chartTypeRef.current === "Line" || chartTypeRef.current === "Mountain";
      let newInterp = targetPriceRef.current;
      if (rawLastCandleRef.current && targetPriceRef.current > 0) {
          if (currentInterpolatedPriceRef.current === 0) {
              currentInterpolatedPriceRef.current = targetPriceRef.current;
          } else {
              // Buttery smooth fluid interpolation at 60FPS
              currentInterpolatedPriceRef.current += (targetPriceRef.current - currentInterpolatedPriceRef.current) * 0.25;
          }
          newInterp = currentInterpolatedPriceRef.current;
      }

      const hasPriceChanged = newInterp !== lastRenderedPriceRef.current;
      const hasTimeChanged = rawLastCandleRef.current?.time !== lastRenderedTimeRef.current;
      const needsSeriesUpdate = hasPriceChanged || hasTimeChanged;

      chartConfigs.forEach(idx => {
        const currentChart = idx === 0 ? chartRef.current : chartRef2.current;
        const currentSeries = idx === 0 ? seriesRef.current : seriesRef2.current;
        const currentContainer = idx === 0 ? chartContainerRef.current : chartContainerRef2.current;
        
        if (currentChart && currentContainer) {
           try {
               if (currentSeries && rawLastCandleRef.current && newInterp > 0 && needsSeriesUpdate) {
                   const newCandle = { ...rawLastCandleRef.current };
                   newCandle.close = newInterp;
                   newCandle.high = Math.max(newCandle.high, newInterp);
                   newCandle.low = Math.min(newCandle.low, newInterp);
                   
                   try {
                       if (idx === 1) {
                           currentSeries.update(newCandle);
                       } else {
                           if (chartTypeRef.current === "Line" || chartTypeRef.current === "Mountain") {
                               currentSeries.update({ time: newCandle.time, value: newInterp });
                           } else {
                               currentSeries.update(newCandle);
                           }
                       }
                   } catch(updErr) {}
                   if (idx === 0) {
                       lastCandleRef.current = newCandle;
                   }
               }

               const ts = currentChart.timeScale();
               const tsWidth = currentContainer.clientWidth || 600;
               const visibleRange = ts.getVisibleLogicalRange();
               
               const timeSecs = Math.floor(purchaseDeadlineTime / 1000);
               const expSecs = Math.floor(exactExpirationTime / 1000);
               
               const getX = (targetTimeSecs: number) => {
                   let x = ts.timeToCoordinate(targetTimeSecs as Time);
                   if (x === null && rawLastCandleRef.current) {
                       const lastTime = rawLastCandleRef.current.time as number;
                       const lastX = ts.timeToCoordinate(lastTime as Time);
                       if (lastX !== null && visibleRange) {
                           const secondsDiff = targetTimeSecs - lastTime;
                           const timeframeSeconds = getTimeSeconds(timeframe);
                           const candlesDiff = secondsDiff / timeframeSeconds;
                           const barSpacing = tsWidth / (visibleRange.to - visibleRange.from);
                           x = (lastX + candlesDiff * barSpacing) as any;
                       }
                   }
                   return x;
               };
               
               const pX = getX(timeSecs);
               const eX = getX(expSecs);

               if (idx === 0) {
                  if (pX !== purchaseLineXRef.current) {
                    setPurchaseLineX(pX);
                    purchaseLineXRef.current = pX;
                  }
                  if (eX !== expirationLineXRef.current) {
                    setExpirationLineX(eX);
                    expirationLineXRef.current = eX;
                  }
               }
               
               if (currentSeries && (lastCandleRef.current || rawLastCandleRef.current)) {
                   const priceY = currentSeries.priceToCoordinate(currentInterpolatedPriceRef.current);
                   
                   if (idx === 0) {
                      if (timerOverlayRef.current && priceY !== null) {
                          timerOverlayRef.current.style.transform = `translateY(${priceY}px)`;
                      }
                      if (hoverTradeTypeRef.current && lastCandleRef.current) {
                          const y = currentSeries.priceToCoordinate(lastCandleRef.current.close);
                          setHoverLineY(y);
                      } else {
                          setHoverLineY(null);
                      }
                   }

                   // Update custom Binomo-style price line and pulsating dot
                   const leftLineEl = document.getElementById(`custom-price-line-left-${idx}`);
                   const badgeGroupEl = document.getElementById(`custom-price-badge-group-${idx}`);
                   const badgeTextEl = document.getElementById(`custom-price-badge-text-${idx}`);
                   const badgeBgEl = document.getElementById(`custom-price-badge-bg-${idx}`);
                   const rightLineEl = document.getElementById(`custom-price-line-right-${idx}`);
                   
                   
                   if (leftLineEl || rightLineEl || badgeGroupEl) {
                       if (priceY !== null && priceY >= 0) {
                           let candleX: number | null = null;
                           const lastCandle = rawLastCandleRef.current || lastCandleRef.current;
                           if (lastCandle && (lastCandle as any).time) {
                               candleX = ts.timeToCoordinate((lastCandle as any).time as Time);
                           }
                           
                           const containerWidth = currentContainer?.clientWidth || 600;
                           // Fallback: If we can't find the candle X, it's usually near the right side
                           const effectiveCandleX = candleX !== null ? candleX : (containerWidth - 60); 

                           // Find right axis width
                           const chart = idx === 0 ? chartRef.current : chartRef2.current;
                           let scaleWidth = 65; // fallback
                           if (chart) {
                               try {
                                   scaleWidth = chart.priceScale('right').width();
                               } catch (e) {}
                           }
                           
                           const badgeX = containerWidth - scaleWidth;
                           const badgeXOffset = badgeX - 10;
                           
                           if (leftLineEl) {
                               leftLineEl.setAttribute('x1', '0');
                               leftLineEl.setAttribute('y1', priceY.toString());
                               leftLineEl.setAttribute('x2', effectiveCandleX.toString());
                               leftLineEl.setAttribute('y2', priceY.toString());
                               leftLineEl.style.display = 'block';
                               // No forced stroke color override
                           }
                           
                           // Position the custom right line and the pointed price badge
                           if (rightLineEl) {
                               rightLineEl.setAttribute('x1', effectiveCandleX.toString());
                               rightLineEl.setAttribute('y1', priceY.toString());
                               rightLineEl.setAttribute('x2', badgeXOffset.toString());
                               rightLineEl.setAttribute('y2', priceY.toString());
                               rightLineEl.style.display = 'block';
                           }

                           if (badgeGroupEl && badgeTextEl) {
                               badgeGroupEl.setAttribute('transform', `translate(${badgeXOffset}, ${priceY - 11})`);
                               
                               const currentPriceVal = currentInterpolatedPriceRef.current || 0;
                               let precision = 6;
                               try {
                                   const opts = currentSeries.options();
                                   if (opts && opts.priceFormat && opts.priceFormat.precision !== undefined) {
                                       precision = opts.priceFormat.precision;
                                   }
                               } catch (e) {}
                               
                               badgeTextEl.textContent = currentPriceVal.toFixed(precision);

                               // Dynamic pointy chevron path based on scaleWidth
                               const W = scaleWidth + 8;
                               const pathD = `M 0 10 L 14 0 L ${W - 3} 0 Q ${W} 0 ${W} 3 L ${W} 17 Q ${W} 20 ${W - 3} 20 L 14 20 Z`;
                               if (badgeBgEl) {
                                   badgeBgEl.setAttribute('d', pathD);
                               }

                               // Center text horizontally inside the badge body (from 10 to W)
                               badgeTextEl.setAttribute('x', ((W + 14) / 2).toString());
                               badgeTextEl.setAttribute('y', '10');

                               badgeGroupEl.style.display = 'block';
                           }
                       } else {
                           if (leftLineEl) leftLineEl.style.display = 'none';
                           if (rightLineEl) rightLineEl.style.display = 'none';
                           if (badgeGroupEl) badgeGroupEl.style.display = 'none';
                       }
                   }

                   if (activeTradesRef.current && activeAssetRef.current) {
                       const currentPrice = lastCandleRef.current?.close ?? rawLastCandleRef.current?.close ?? lastCandleRef.current?.value;
                       let candleHalfWidth = 0;
                       if (visibleRange && (visibleRange.to - visibleRange.from) > 0) {
                           const barSpacing = tsWidth / (visibleRange.to - visibleRange.from);
                           candleHalfWidth = barSpacing * 0.40;
                       }

                       activeTradesRef.current.forEach(trade => {
                           if (trade.asset === activeAssetRef.current) {
                               const elId = `trade-overlay-${idx}-${trade.id}`;
                               let el = tradeElementsRef.current.get(elId);
                               if (!el || !el.isConnected) {
                                   el = document.getElementById(elId) as HTMLElement;
                                   if (el) tradeElementsRef.current.set(elId, el);
                               }
                               
                               if (el) {
                                   const y = currentSeries.priceToCoordinate(Number(trade.entryPrice));
                                   const entryTimeSecs = (trade.entryTime || (typeof trade.createdAt === 'number' ? Math.floor(trade.createdAt / 1000) : (trade.createdAt && typeof (trade.createdAt as any).toDate === 'function' ? Math.floor((trade.createdAt as any).toDate().getTime() / 1000) : ((trade.createdAt as any) instanceof Date ? Math.floor((trade.createdAt as any).getTime() / 1000) : Math.floor(Date.now() / 1000)))));
                                   let xBase = getX(entryTimeSecs as number);
                                   if (xBase === null && rawLastCandleRef.current) {
                                       const lastTime = rawLastCandleRef.current.time as number;
                                       xBase = ts.timeToCoordinate(lastTime as Time);
                                   }
                                   const xExp = getX(Math.floor(trade.expirationTime / 1000));
                                   
                                   const adjXBase = xBase !== null ? xBase - candleHalfWidth : null;
                                   
                                   if (y !== null && adjXBase !== null) {
                                       el.style.transform = `translate(${adjXBase}px, ${y}px)`;
                                       if (el.style.display !== 'block') el.style.display = 'block';
                                       
                                       const isProfit = trade.type === 'up' ? currentPrice > trade.entryPrice : currentPrice < trade.entryPrice;
                                       const line = el.querySelector('.trade-line') as HTMLElement;
                                       const dot = el.querySelector('.trade-dot') as HTMLElement;
                                       
                                       if (line) {
                                           if (isProfit) {
                                               line.style.borderBottom = `2px dotted #FCD535`;
                                               line.style.opacity = '1';
                                           } else {
                                               line.style.borderBottom = '2px dotted rgba(252, 213, 53, 0.5)';
                                               line.style.opacity = '0.6';
                                           }
                                       }
                                       
                                       if (dot) {
                                           if (isProfit) {
                                               dot.style.transform = 'scale(1.2)';
                                               dot.style.backgroundColor = '#FCD535';
                                           } else {
                                               dot.style.transform = 'scale(1)';
                                               dot.style.backgroundColor = 'rgba(252, 213, 53, 0.7)';
                                           }
                                       }

                                       const arrow = el.querySelector('.trade-arrow') as HTMLElement;
                                       if (arrow) {
                                           const arrowTip = arrow.querySelector('div') as HTMLElement;
                                           if (arrowTip) {
                                               if (isProfit) {
                                                   arrowTip.style.borderTopColor = '#FCD535';
                                                   arrow.style.opacity = '1';
                                               } else {
                                                   arrowTip.style.borderTopColor = 'rgba(252, 213, 53, 0.5)';
                                                   arrow.style.opacity = '0.7';
                                               }
                                           }
                                       }

                                       if (xExp !== null && xExp > adjXBase!) {
                                           const newWidth = `${Math.max(1, xExp - adjXBase!)}px`;
                                           if (el.style.width !== newWidth) el.style.width = newWidth;
                                       } else if (xExp !== null) {
                                           if (el.style.width !== '0px') el.style.width = '0px';
                                       } else {
                                            const newWidth = `calc(100% - ${adjXBase}px)`;
                                            if (el.style.width !== newWidth) el.style.width = newWidth;
                                        }
                                   } else {
                                       if (el.style.display !== 'none') el.style.display = 'none';
                                   }
                               }
                           }
                       });
                   }
               }
           } catch(e) {
               console.warn("Error in updateLine for chart idx " + idx, e);
           }
        }
      });
      
      lastRenderedPriceRef.current = newInterp;
      lastRenderedTimeRef.current = rawLastCandleRef.current?.time as number || 0;
      rafId = requestAnimationFrame(updateLine);
    };
    rafId = requestAnimationFrame(updateLine);
    return () => cancelAnimationFrame(rafId);
  }, [purchaseDeadlineTime, exactExpirationTime, timeframe]);

  // Price Alert & Trades States
  const [alerts, setAlerts] = useState<any[]>([]);
  const alertsRef = React.useRef<any[]>([]);

  useEffect(() => {
    let unsubAlerts: () => void = () => {};
    const unsubAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            const q = query(collection(db, 'users', user.uid, 'priceAlerts'), where('status', '==', 'active'));
            unsubAlerts = onSnapshot(q, (snapshot) => {
                const loadedAlerts: any[] = [];
                snapshot.forEach(doc => loadedAlerts.push({id: doc.id, ...doc.data()}));
                setAlerts(loadedAlerts);
                alertsRef.current = loadedAlerts;
            }, (error) => console.warn("Failed to watch price alerts:", error.message));
        } else {
            setAlerts([]);
            alertsRef.current = [];
            if (unsubAlerts) unsubAlerts();
        }
    });

    return () => {
        unsubAuth();
        if (unsubAlerts) unsubAlerts();
    };
  }, []);

  useEffect(() => {
    if (currentUser?.uid && appConfig?.loginPromoAd_enabled) {
        // Prevent showing on initial load if we don't have a fresh sign-in attempt
        // We use sessionStorage to ensure it pops up once per app session upon login
        const shownKey = `promoAdShown_${currentUser.uid}`;
        if (!sessionStorage.getItem(shownKey)) {
            // Give it a tiny delay to allow regular UI to render first
            setTimeout(() => {
                setShowPromoAdModal(true);
            }, 1500);
            sessionStorage.setItem(shownKey, 'true');
        }
    }
  }, [currentUser?.uid, appConfig?.loginPromoAd_enabled]);


  const [showCopyTrading, setShowCopyTrading] = useState(false);
  const [activeTrades, setActiveTrades] = useState<Trade[]>(() => {
    try {
      const cached = localStorage.getItem('bivaax_active_trades_cache');
      if (cached) {
        const parsed = JSON.parse(cached) as Trade[];
        const now = Date.now();
        const mapped = parsed.map((t: any) => {
          const rawExp = t.expirationTime || (t.expiryTime ? t.expiryTime * 1000 : (t.expiry_time ? t.expiry_time * 1000 : now + (t.timeLeft || 0) * 1000));
          const expMs = typeof rawExp === 'number' ? (rawExp < 100000000000 ? rawExp * 1000 : rawExp) : now;
          const timeLeftSec = Math.max(0, Math.floor((expMs - now) / 1000));
          const rawEntry = t.entryTime || t.createdAt || t.created_at || now;
          const entryMs = typeof rawEntry === 'number' ? (rawEntry < 10000000000 ? rawEntry * 1000 : rawEntry) : new Date(rawEntry).getTime();
          return {
            ...t,
            id: String(t.id),
            entryPrice: Number(t.entryPrice || t.entry_price || 0),
            accountType: t.accountType || t.account_type || (t.isDemo || t.is_demo ? 'demo' : 'real'),
            expirationTime: expMs,
            timeLeft: timeLeftSec,
            entryTime: entryMs / 1000,
            createdAt: entryMs
          };
        }).filter(t => t.timeLeft > 0 && t.status !== 'won' && t.status !== 'lost' && t.status !== 'draw');

        // Deduplicate trades by ID, firebaseId or by matching attributes
        const deduped: any[] = [];
        mapped.forEach(t => {
          const tId = String(t.id);
          const tFbId = t.firebaseId || t.firebase_id ? String(t.firebaseId || t.firebase_id) : '';
          const exists = deduped.some(d => {
            const dId = String(d.id);
            const dFbId = d.firebaseId || d.firebase_id ? String(d.firebaseId || d.firebase_id) : '';
            if (dId === tId || (tFbId && dId === tFbId) || (dFbId && tId === dFbId) || (dFbId && tFbId && dFbId === tFbId)) return true;
            const matchAsset = d.asset === t.asset;
            const matchType = (d.type || d.direction) === (t.type || t.direction);
            const matchAcc = (d.accountType || 'real') === (t.accountType || 'real');
            const matchAmt = Math.abs(Number(d.amount) - Number(t.amount)) < 0.01;
            const matchExp = Math.abs((d.expirationTime || 0) - (t.expirationTime || 0)) < 15000;
            return matchAsset && matchType && matchAcc && matchAmt && matchExp;
          });
          if (!exists) {
            deduped.push(t);
          }
        });
        return deduped;
      }
      return [];
    } catch (e) {
      return [];
    }
  });
  const activeTradesRef = React.useRef<Trade[]>(activeTrades);
  const processedTradesRef = React.useRef<Set<string>>(new Set());
  const markersPluginRef = React.useRef<any>(null);
  const activeAssetRef = useRef(activeAsset);

  useEffect(() => {
    activeAssetRef.current = activeAsset;
    
    // Try to populate rawLastCandleRef and interpolated price from history cache if available
    // this prevents "missing refs" error if user tries to trade immediately after asset switch
    const cached = historyCacheRef.current[activeAsset];
    if (cached && cached.length > 0) {
      const last = cached[cached.length - 1];
      rawLastCandleRef.current = last;
      currentInterpolatedPriceRef.current = last.close;
    } else {
      rawLastCandleRef.current = null;
      currentInterpolatedPriceRef.current = 0;
    }
    lastCandleRef.current = null;
  }, [activeAsset]);

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showOpenTrades, setShowOpenTrades] = useState(false);
  


  const [isCashierLoading, setIsCashierLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);

  const handleActivitiesAction = (action: () => void) => {
    setIsActivitiesLoading(true);
    setTimeout(() => {
      setIsActivitiesLoading(false);
      action();
    }, 1500);
  };

  useEffect(() => {
    if (showDeposit) {
      setIsCashierLoading(true);
      const timer = setTimeout(() => setIsCashierLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [showDeposit, cashierTab]);

  useEffect(() => {
    if (activeTab === 'profile') {
      setIsProfileLoading(true);
      const timer = setTimeout(() => setIsProfileLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const [depositStep, setDepositStep] = useState<"methods" | "amount" | "payment">("methods");
  const [withdrawStep, setWithdrawStep] = useState<"methods" | "form" | "locked_method">("methods");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const currentMinWithdrawal = 10;
  const [withdrawAccountHolder, setWithdrawAccountHolder] = useState("");
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState("");
  const [withdrawEmail, setWithdrawEmail] = useState(currentUser?.email || "");
  const [withdrawSubmitAttempted, setWithdrawSubmitAttempted] = useState(false);
  const [showWithdrawOtp, setShowWithdrawOtp] = useState(false);
  const [withdrawOtpValue, setWithdrawOtpValue] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [withdrawalLoadingText, setWithdrawalLoadingText] = useState("");
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState("77500");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoBonus, setPromoBonus] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");

  const validatePromoCode = async (codeToValidate?: string) => {
    const code = codeToValidate || promoCode;
    if (!code) {
      setPromoError("Enter a promo code");
      return;
    }
    setIsValidatingPromo(true);
    setPromoError("");
    try {
      const q = query(
        collection(db, 'promos'),
        where('code', '==', code.toUpperCase()),
        where('isActive', '==', true)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setPromoError("Invalid or inactive promo code");
        setPromoBonus(0);
        setAppliedPromo("");
      } else {
        const data = snap.docs[0].data();
        const expiry = data.expiryDate?.toDate ? data.expiryDate.toDate() : new Date(data.expiryDate);
        if (expiry < new Date()) {
          setPromoError("Promo code has expired");
          setPromoBonus(0);
          setAppliedPromo("");
        } else {
          setPromoBonus(data.bonusPercentage);
          setAppliedPromo(code.toUpperCase());
          if (codeToValidate) setPromoCode(code.toUpperCase());
          toast.success(`Promo code applied: ${data.bonusPercentage}% bonus!`);
        }
      }
    } catch (e) {
      console.error("Promo validation error:", e);
      setPromoError("Validation failed. Try again.");
    } finally {
      setIsValidatingPromo(false);
    }
  };
  const [selectedBonusId, setSelectedBonusId] = useState<string>("none");
  const [paymentTimer, setPaymentTimer] = useState(15 * 60);
  const [isPaymentPageLoading, setIsPaymentPageLoading] = useState(false);
  const [paymentTrxId, setPaymentTrxId] = useState("");
  const [hasCopiedWallet, setHasCopiedWallet] = useState(false);

  // Web3 States
  const [web3State, setWeb3State] = useState<'idle' | 'connecting' | 'connected' | 'processing' | 'success'>('idle');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>(null);

  const isCryptoDeposit = selectedMethod?.category === 'Crypto' || 
                          (selectedMethod?.category || "").toLowerCase().includes("crypto") ||
                          (selectedMethod?.name || "").toLowerCase().includes("usdt") || 
                          (selectedMethod?.name || "").toLowerCase().includes("binance") ||
                          (selectedMethod?.name || "").toLowerCase().includes("pay");

  useEffect(() => {
    if (selectedMethod) {
      const isCrypto = selectedMethod.category === 'Crypto' || 
                       (selectedMethod.category || "").toLowerCase().includes("crypto") ||
                       (selectedMethod.name || "").toLowerCase().includes("usdt") || 
                       (selectedMethod.name || "").toLowerCase().includes("binance") ||
                       (selectedMethod.name || "").toLowerCase().includes("pay");
      if (isCrypto) {
        setDepositAmount("10");
      } else {
        setDepositAmount("77500");
      }
    }
  }, [selectedMethod]);

  useEffect(() => {
    let interval: any;
    if (depositStep === "payment" && showDeposit && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer((prev) => prev - 1);
      }, 1000);
    } else if (depositStep !== "payment" || !showDeposit) {
      setPaymentTimer(15 * 60);
    }
    return () => clearInterval(interval);
  }, [depositStep, paymentTimer, showDeposit]);

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? '0' : ''}${min} : ${sec < 10 ? '0' : ''}${sec}`;
  };
  const [depositCategory, setDepositCategory] = useState("All");
  const [showDepositCategoryDropdown, setShowDepositCategoryDropdown] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('bivax_account_type', accountType);
  }, [accountType]);

  // Handle actionParam on mount only
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'deposit' || action === 'withdraw') {
      setShowDeposit(true);
      setCashierTab(action === 'deposit' ? 'deposits' : 'withdrawals');
      setSearchParams(prev => {
        prev.delete('action');
        return prev;
      }, { replace: true });
    }
  }, []); // Run once on mount

  // Sync URL parameter to state (one-way, to handle direct links)
  useEffect(() => {
    const fromUrl = searchParams.get('account');
    if (fromUrl === 'real' || fromUrl === 'demo' || fromUrl === 'tournament') {
      setAccountType(fromUrl as any);
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (!currentUser?.uid || !activeTournamentId || accountType !== 'tournament') return;
    
    const unsub = onSnapshot(
      doc(db, 'tournaments', activeTournamentId, 'participants', currentUser.uid),
      (snap) => {
        if (snap.exists()) {
          const val = snap.data().score;
          if (typeof val === 'number') {
            setTournamentBalance(val);
          }
        } else {
          setTournamentBalance(10000.0);
        }
      },
      (err) => console.warn("Error subscribing to tournament balance:", err)
    );
    return unsub;
  }, [currentUser?.uid, activeTournamentId, accountType]);

  const lastRechargeRef = useRef(0);
  useEffect(() => {
    // Only auto-recharge demo if balance is completely zero AND user has NO active trades running
    if (accountType === 'demo' && demoBalance <= 0 && activeTrades.length === 0 && auth.currentUser) {
        const now = Date.now();
        if (now - lastRechargeRef.current > 10000) {
            lastRechargeRef.current = now;
            const rechargeAmount = 10000;
            setDemoBalance(rechargeAmount);
            demoBalanceRef.current = rechargeAmount;
            fetch('/api/wallet/recharge-demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: auth.currentUser.uid })
            }).catch(() => {});
            updateDoc(doc(db, "users", auth.currentUser.uid), {
                demoBalance: rechargeAmount
            }).catch((err) => console.error("Error recharging demo balance:", err));
        }
    }
  }, [demoBalance, accountType, activeTrades.length, auth.currentUser?.uid]);
  
  const visibleActiveTrades = React.useMemo(() => {
    const filtered = activeTrades.filter(t => {
      const tradeAccType = t.accountType || t.account_type || (t.isDemo || t.is_demo ? 'demo' : 'real');
      const isOwner = tradeAccType === accountType;
      const expTime = t.expirationTime || (t.expiryTime ? t.expiryTime * 1000 : (t.expiry_time ? t.expiry_time * 1000 : null));
      const isExpired = t.timeLeft <= 0 && (!expTime || Date.now() >= expTime);
      const isSettled = (t.status && t.status !== 'open') || (processedTradesRef.current && processedTradesRef.current.has(t.id));
      return isOwner && !isExpired && !isSettled;
    });

    const dedupedMap = new Map<string, any>();
    filtered.forEach((t: any) => {
      const tId = String(t.id);
      const tFbId = t.firebaseId || t.firebase_id ? String(t.firebaseId || t.firebase_id) : '';

      let duplicateKey: string | null = null;
      for (const [key, existing] of dedupedMap.entries()) {
        const eId = String(existing.id);
        const eFbId = existing.firebaseId || existing.firebase_id ? String(existing.firebaseId || existing.firebase_id) : '';

        if (eId === tId || (tFbId && eId === tFbId) || (eFbId && tId === eFbId) || (eFbId && tFbId && eFbId === tFbId)) {
          duplicateKey = key;
          break;
        }
      }

      if (duplicateKey) {
        const existing = dedupedMap.get(duplicateKey);
        if (tId.length < existing.id.length || (!isNaN(Number(tId)) && isNaN(Number(existing.id)))) {
          dedupedMap.delete(duplicateKey);
          dedupedMap.set(tId, t);
        }
      } else {
        dedupedMap.set(tId, t);
      }
    });

    return Array.from(dedupedMap.values());
  }, [activeTrades, accountType]);
  
  const visibleUserTrades = React.useMemo(() => {
    const filtered = userTrades.filter(t => {
      const tradeAccType = t.accountType || t.account_type || (t.isDemo || t.is_demo ? 'demo' : 'real');
      return tradeAccType === accountType;
    });

    const dedupedMap = new Map<string, any>();
    filtered.forEach((t: any) => {
      const tId = String(t.id);
      const tFbId = t.firebaseId || t.firebase_id ? String(t.firebaseId || t.firebase_id) : '';

      let duplicateKey: string | null = null;
      for (const [key, existing] of dedupedMap.entries()) {
        const eId = String(existing.id);
        const eFbId = existing.firebaseId || existing.firebase_id ? String(existing.firebaseId || existing.firebase_id) : '';

        if (eId === tId || (tFbId && eId === tFbId) || (eFbId && tId === eFbId) || (eFbId && tFbId && eFbId === tFbId)) {
          duplicateKey = key;
          break;
        }
      }

      if (duplicateKey) {
        const existing = dedupedMap.get(duplicateKey);
        if (tId.length < existing.id.length || (!isNaN(Number(tId)) && isNaN(Number(existing.id)))) {
          dedupedMap.delete(duplicateKey);
          dedupedMap.set(tId, t);
        }
      } else {
        dedupedMap.set(tId, t);
      }
    });

    return Array.from(dedupedMap.values()).sort((a, b) => (b.createdAt || b.created_at || 0) - (a.createdAt || a.created_at || 0));
  }, [userTrades, accountType]);

  // Calculation of user's today's profit:
  const userTodayProfit = React.useMemo(() => {
     let profit = 0;
     const startOfDay = new Date();
     startOfDay.setHours(0,0,0,0);
     const todayTs = startOfDay.getTime();
     
     visibleUserTrades.forEach(trade => {
         // check if trade is closed and settled today
         const tradeTs = trade.updatedAt || trade.createdAt || 0;
         if (tradeTs > todayTs && trade.status !== 'open') {
             if (trade.status === 'won') {
                 profit += ((trade.payoutAmount || 0) - trade.amount);
             } else if (trade.status === 'lost') {
                 profit -= trade.amount;
             }
         }
     });
     return profit;
  }, [visibleUserTrades]);


  const completedDepositsBdt = React.useMemo(() => {
    let total = 0;
    userTransactions.forEach((tx: any) => {
      if (tx.type === 'Deposit' && (tx.status === 'Completed' || tx.status === 'completed')) {
        const amt = parseFloat(tx.amount || 0);
        const curr = tx.currency || userCurrency || 'BDT';
        total += curr === 'USD' ? amt * 118 : amt;
      }
    });
    return total;
  }, [userTransactions, userCurrency]);

  const activeUserStatus = React.useMemo(() => {
    if (completedDepositsBdt >= 360000) return 'Prestige';
    if (completedDepositsBdt >= 85000) return 'VIP';
    if (completedDepositsBdt >= 42000) return 'Gold';
    if (completedDepositsBdt >= 1000) return 'Standard';
    return 'Free';
  }, [completedDepositsBdt]);

  const [leaderboards, setLeaderboards] = useState<any>({ daily: [], weekly: [], monthly: [], allTime: [] });
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  
  const loadLeaderboards = async (retries = 3) => {
    try {
      setIsLoadingLeaderboard(true);
      const res = await fetch('/api/leaderboard');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json().catch(() => null);
      if (data) setLeaderboards(data);
    } catch (err) {
      console.error('Failed to load leaderboards:', err);
      if (retries > 0) {
          setTimeout(() => loadLeaderboards(retries - 1), 2000);
      }
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const dynamicLeaderboard = React.useMemo(() => {
    if (!leaderboards) return [];
    
    const sortedAll = (leaderboards.daily || [])
        .sort((a: any, b: any) => parseFloat(b.profit || b.total_profit || 0) - parseFloat(a.profit || a.total_profit || 0));

    const getCountryCode = (countryName: string) => {
        if (!countryName) return "gb";
        const mapping: Record<string, string> = {
            "India": "in", "Pakistan": "pk", "United States": "us", "United Kingdom": "gb", 
            "Canada": "ca", "Australia": "au", "Malaysia": "my", "Indonesia": "id", "Brazil": "br", "Mexico": "mx",
            "Colombia": "co", "Spain": "es", "South Africa": "za", "Argentina": "ar", "Bangladesh": "bd", "Nigeria": "ng",
            "Vietnam": "vn", "Thailand": "th", "Philippines": "ph", "Turkey": "tr", "Russia": "ru", "Germany": "de",
            "France": "fr", "Italy": "it", "Japan": "jp", "South Korea": "kr", "China": "cn"
        };
        const exact = mapping[countryName];
        if (exact) return exact;
        const partial = Object.keys(mapping).find(k => k.toLowerCase().includes(countryName.toLowerCase()) || countryName.toLowerCase().includes(k.toLowerCase()));
        if (partial) return mapping[partial];
        
        return "un"; // Unknown
    };

    const top20 = sortedAll.slice(0, 20);
    const currentUserIndexInAll = currentUser ? sortedAll.findIndex((l: any) => l.user_id === currentUser.uid) : -1;

    // User requested to REMOVE their own entry if not in top 20
    let displayList = [...top20];

    // If current user is in top 20, they are already there. 
    // If they are not in top 20, we DO NOT add them at the bottom anymore as requested.

    return displayList.map((l: any, i: number) => {
      const countryCode = (l.country_code || "").toLowerCase() || getCountryCode(l.country);
      const rawProfit = parseFloat(l.profit || l.total_profit || 0);
      const profitVal = isNaN(rawProfit) ? 0 : rawProfit;

      const isCurrentUser = currentUser && currentUser.uid === l.user_id;

      let formattedProfit = '';
      if (profitVal > 25000 && !isCurrentUser) {
        formattedProfit = '25,000.00+';
      } else {
        formattedProfit = profitVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
          
      return {
        id: l.user_id,
        name: l.display_name || l.nickname || 'Trader',
        profit: profitVal,
        country: l.country || 'Global',
        flagUrl: countryCode && countryCode !== 'un' ? `https://flagcdn.com/w40/${countryCode}.png` : null,
        flagEmoji: l.flagEmoji || 'ðŸŒ',
        isCurrentUser,
        rank: l._actualRank !== undefined ? l._actualRank : (i + 1),
        formattedProfit
      };
    });
  }, [leaderboards, currentUser, userTodayProfit]);

  // Security Logging - Track IP and Device ID once per session
  useEffect(() => {
    if (currentUser?.uid) {
      const deviceId = localStorage.getItem('Bivaax_device_id') || (() => {
        const newId = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('Bivaax_device_id', newId);
        return newId;
      })();
      
      fetch('/api/security/log-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid, deviceId })
      }).catch(err => console.warn('Security logging failed', err));
    }
  }, [currentUser?.uid]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshBalance = async () => {
    if (!auth.currentUser) return;
    setIsRefreshing(true);
    try {
      const syncRes = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: auth.currentUser.uid })
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        const uData = syncData?.data || syncData?.user;
        if (uData) {
          if (uData.currency) {
            setUserCurrency(uData.currency);
            userCurrencyRef.current = uData.currency;
          }
          if (uData.balance !== undefined || uData.realBalance !== undefined || uData.real_balance !== undefined) {
            const rawBal = uData.balance ?? uData.realBalance ?? uData.real_balance;
            const val = parseFloat(rawBal?.toString());
            if (!isNaN(val)) {
              setRealBalance(val);
              realBalanceRef.current = val;
            }
          }
          if (uData.demoBalance !== undefined || uData.demo_balance !== undefined) {
            const rawDemo = uData.demoBalance ?? uData.demo_balance;
            const dval = parseFloat(rawDemo?.toString());
            if (!isNaN(dval)) {
              setDemoBalance(dval);
              demoBalanceRef.current = dval;
            }
          }
        }
      } else {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (accountType === 'demo') {
            if (userData.demoBalance !== undefined) setDemoBalance(userData.demoBalance);
          } else {
            if (userData.balance !== undefined) setRealBalance(userData.balance);
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    let total = demoBalance;
    if (accountType === 'real') total = realBalance;
    else if (accountType === 'tournament') total = tournamentBalance;

    // In Binary Options, the balance is already deducted when a trade is placed.
    // We don't add unrealized P/L to the main balance to avoid confusion and double-deduction visuals.
    // The balance only increases when a trade is settled as a win or draw.
    setBalance(total);
  }, [accountType, demoBalance, realBalance, tournamentBalance]);


  const [showAccountSwitchModal, setShowAccountSwitchModal] = useState<
    "demo" | "real" | null
  >(null);
  const [alertInput, setAlertInput] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneConfirmModal, setShowPhoneConfirmModal] = useState(false);
  const [phoneConfirmStep, setPhoneConfirmStep] = useState<"input" | "otp" | "success">("input");
  const [phoneConfirmInput, setPhoneConfirmInput] = useState("");
  const [phoneConfirmOtp, setPhoneConfirmOtp] = useState("");
  const [phoneInputError, setPhoneInputError] = useState("");
  const [isPhoneOtpSending, setIsPhoneOtpSending] = useState(false);
  const [isPhoneOtpVerifying, setIsPhoneOtpVerifying] = useState(false);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<CountryDialCode>(() => {
    return COUNTRY_DIAL_CODES.find(c => c.code === 'BD') || COUNTRY_DIAL_CODES[0];
  });
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("");

  const handleOpenPhoneConfirm = (initialPhone?: string) => {
    const raw = (initialPhone !== undefined ? initialPhone : phone) || "";
    let matched: CountryDialCode | undefined = undefined;

    if (raw.startsWith("+")) {
      matched = findCountryByDialCode(raw);
    }
    if (!matched && selectedCountry) {
      matched = findCountryByName(selectedCountry);
    }
    if (!matched) {
      matched = COUNTRY_DIAL_CODES.find(c => c.code === 'BD') || COUNTRY_DIAL_CODES.find(c => c.code === 'US') || COUNTRY_DIAL_CODES[0];
    }

    if (matched) {
      setSelectedPhoneCountry(matched);
      if (raw.startsWith(matched.dialCode)) {
        const local = raw.slice(matched.dialCode.length).trim();
        setPhoneConfirmInput(local);
      } else {
        setPhoneConfirmInput(raw);
      }
    } else {
      setPhoneConfirmInput(raw);
    }

    setPhoneInputError("");
    setPhoneConfirmOtp("");
    setPhoneConfirmStep("input");
    setShowPhoneCountryPicker(false);
    setPhoneCountrySearch("");
    setShowPhoneConfirmModal(true);
  };

  const getComputedFullPhone = () => {
    const trimmed = phoneConfirmInput.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("+")) {
      return trimmed;
    }
    const cleanLocal = trimmed.replace(/^0+/, '');
    return `${selectedPhoneCountry.dialCode} ${cleanLocal}`.trim();
  };

  const handlePhoneInputChange = (val: string) => {
    setPhoneConfirmInput(val);
    if (phoneInputError) {
      setPhoneInputError("");
    }
    if (val.startsWith("+")) {
      const matched = findCountryByDialCode(val);
      if (matched && matched.code !== selectedPhoneCountry.code) {
        setSelectedPhoneCountry(matched);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (phoneOtpTimer > 0) {
      interval = setInterval(() => {
        setPhoneOtpTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneOtpTimer]);

  const handleSendPhoneOtp = async (isResend = false) => {
    const fullPhone = getComputedFullPhone();
    if (!phoneConfirmInput.trim() || !fullPhone || fullPhone.replace(/[^0-9]/g, '').length < 6) {
      setPhoneInputError("Please specify the required information");
      return;
    }
    setPhoneInputError("");

    setIsPhoneOtpSending(true);
    try {
      let token = "";
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken().catch(() => "");
      }
      if (!token) {
        token = localStorage.getItem("token") || localStorage.getItem("bivaax_auth_token") || "";
      }

      const res = await fetch("/api/auth/send-phone-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          phone: fullPhone
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code to email");
      }

      setPhoneOtpTimer(60);
      setPhoneConfirmStep("otp");
      toast.success(isResend ? "New verification code sent to your email!" : "Verification code sent to your email!");
    } catch (err: any) {
      console.error("Error sending phone OTP:", err);
      toast.error(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsPhoneOtpSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const code = phoneConfirmOtp?.trim();
    if (!code || code.length < 4) {
      toast.error("Please enter the 6-digit confirmation code sent to your email");
      return;
    }

    setIsPhoneOtpVerifying(true);
    try {
      let token = "";
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken().catch(() => "");
      }
      if (!token) {
        token = localStorage.getItem("token") || localStorage.getItem("bivaax_auth_token") || "";
      }

      const fullPhone = getComputedFullPhone();
      const res = await fetch("/api/auth/verify-phone-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          code: code,
          phone: fullPhone
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid or expired verification code");
      }

      const verifiedNumber = data.phone || fullPhone;
      setPhone(verifiedNumber);
      setIsPhoneVerified(true);

      if (auth?.currentUser) {
        try {
          const { doc, updateDoc } = await import("../firebase.ts");
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            phone: verifiedNumber,
            phoneNumber: verifiedNumber,
            isPhoneVerified: true,
            phoneVerified: true,
            phoneConfirmedAt: Date.now()
          });
        } catch (dbErr) {
          console.warn("Direct Firestore update fallback:", dbErr);
        }
      }

      setPhoneConfirmStep("success");
      toast.success("Phone number confirmed and permanently saved!");
    } catch (err: any) {
      console.error("Error verifying phone OTP:", err);
      toast.error(err.message || "Failed to verify code. Please try again.");
    } finally {
      setIsPhoneOtpVerifying(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSavePhone = async () => {
    handleOpenPhoneConfirm(phone);
  };

  useEffect(() => {
    const isAnyModalOpen = showIndicatorsModal || showTimeframeModal || showChartTypeModal || showSignalsModal || showPromotionsModal || showTournamentsModal || showDeposit || showAccounts || showCashierMenu || showLanguageModal || showCountryModal || show2FAModal || showPhoneConfirmModal || showAchievementsModal || showAlertDialog;

    if (isAnyModalOpen) {
      // Push a dummy state to history so the back button can be intercepted
      window.history.pushState({ modal: true }, "");
      
      const handlePopState = (e: PopStateEvent) => {
        // If a modal is open, we close it instead of letting the browser go back
        setShowIndicatorsModal(false);
        setShowTimeframeModal(false);
        setShowChartTypeModal(false);
        setShowSignalsModal(false);
        setShowPromotionsModal(false);
        setShowTournamentsModal(false);
        setShowDeposit(false);
        setShowAccounts(false);
        setShowCashierMenu(false);
        setShowLanguageModal(false);
        setShowCountryModal(false);
        setShow2FAModal(false);
        setShowPhoneConfirmModal(false);
        setShowAchievementsModal(false);
        setShowAlertDialog(false);
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [showIndicatorsModal, showTimeframeModal, showChartTypeModal, showSignalsModal, showPromotionsModal, showTournamentsModal, showDeposit, showAccounts, showCashierMenu, showLanguageModal, showCountryModal, show2FAModal, showPhoneConfirmModal, showAchievementsModal, showAlertDialog]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIslamic, setIsIslamic] = useState(false);
  const [isProfileFullScreen, setIsProfileFullScreen] = useState(false);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    activeTradesRef.current = activeTrades;
    try {
      localStorage.setItem('bivaax_active_trades_cache', JSON.stringify(activeTrades));
    } catch (e) {}
  }, [activeTrades]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const [currentPriceLabel, setCurrentPriceLabel] = useState("116.6000");
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const [hoveredIndicatorValues, setHoveredIndicatorValues] = useState<any>({});

  const [historyLoaded, setHistoryLoaded] = useState(0);

  // Socket.io initialization (Persists as long as component is mounted)
  useEffect(() => {
    // Safety fallback: if socket never connects after 10s, remove loader
    const fallbackTimer = setTimeout(() => {
        setIsLoading(false);
    }, 10000);

    const socket = io({
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setDataError(null);
      clearTimeout(fallbackTimer);
      console.log("Socket connected successfully, requesting initial data...");
      setChartLoading(true);
      
      const token = localStorage.getItem('bivax_token');
      if (token) {
        socket.emit('authenticate', token);
      }
      
      const currentUid = auth.currentUser?.uid;
      if (currentUid) {
        socket.emit('join_user_room', currentUid);
      }
      
      socket.emit('request_initial_data', { asset: activeAssetRef.current, timeframe: timeframeRef.current, accountType: accountTypeRef.current, userId: currentUid });
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection attempt failed, retrying...", err.message);
      // Don't show fatal error immediately, let auto-reconnect handle it
    });
      // Force immediate reconnection attempt on mobile if stalled
      setTimeout(() => {
        if (!socket.connected) socket.connect();
      }, 5000);
    
    socket.on('trade_settled', (trade: any) => {
        console.log("Trade settled via socket:", trade);
        const tradeId = trade.id ? String(trade.id) : '';
        const fbId = trade.firebaseId || trade.firebase_id ? String(trade.firebaseId || trade.firebase_id) : '';

        const alreadyProcessed = (tradeId && processedTradesRef.current.has(tradeId)) || 
                                 (fbId && processedTradesRef.current.has(fbId));
        
        if (tradeId) processedTradesRef.current.add(tradeId);
        if (fbId) processedTradesRef.current.add(fbId);

        // Add notification inside the chart/terminal only if not already shown locally
        if (!alreadyProcessed) {
          const isWon = trade.status === 'win' || trade.status === 'won' || trade.status === 'profit';
          const isDraw = trade.status === 'draw';
          const notifStatus = isWon ? 'won' : (isDraw ? 'draw' : 'lost');
          const tradePayoutPercent = trade.payout || (trade as any).payoutRate || (trade.asset && markets[trade.asset]?.payout) || 80;
          const notifAmount = isWon ? (trade.payoutAmount || (trade.amount * (1 + tradePayoutPercent / 100))) : trade.amount;
          addTradeNotification({
              id: tradeId || fbId || Math.random().toString(),
              tradeId: tradeId || fbId,
              status: notifStatus,
              asset: trade.asset,
              amount: notifAmount
          });
        }

        const matchesTrade = (t: any) => {
          const tid = String(t.id || '');
          const tfb = String(t.firebaseId || t.firebase_id || '');
          if (tradeId && (tid === tradeId || tfb === tradeId)) return true;
          if (fbId && (tid === fbId || tfb === fbId)) return true;
          if (t.asset === trade.asset && t.amount === trade.amount && Math.abs((t.createdAt || 0) - (trade.createdAt || 0)) < 4000) return true;
          return false;
        };

        setActiveTrades(prev => prev.filter(t => !matchesTrade(t)));
        setUserTrades(prev => {
            const existingIndex = prev.findIndex(matchesTrade);
            let updated: any[];
            if (existingIndex >= 0) {
                updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], ...trade, status: trade.status || 'won' };
            } else {
                updated = [{ ...trade }, ...prev];
            }
            const deduped: any[] = [];
            const seenKeys = new Set<string>();
            for (const item of updated) {
                const idKey = String(item.id || '');
                const fbKey = String(item.firebaseId || item.firebase_id || '');
                const primaryKey = idKey || fbKey;
                if (primaryKey && seenKeys.has(primaryKey)) continue;
                if (idKey) seenKeys.add(idKey);
                if (fbKey) seenKeys.add(fbKey);
                deduped.push(item);
            }
            deduped.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            return deduped.slice(0, 100);
        });
        
        // Apply Authoritative Balance from trade settlement
        if (trade.user || trade.balance !== undefined || trade.realBalance !== undefined || trade.demoBalance !== undefined) {
          const rawReal = trade.balance ?? trade.realBalance ?? trade.user?.balance ?? trade.user?.realBalance;
          if (rawReal !== undefined) {
            const val = parseFloat(rawReal.toString());
            if (!isNaN(val)) {
              setRealBalance(val);
              realBalanceRef.current = val;
            }
          }
          const rawDemo = trade.demoBalance ?? trade.user?.demoBalance;
          if (rawDemo !== undefined) {
            const val = parseFloat(rawDemo.toString());
            if (!isNaN(val)) {
              setDemoBalance(val);
              demoBalanceRef.current = val;
            }
          }
        }
    });

    socket.on("initial_market_data", (data: any) => {
      lastChartUpdateTimeRef.current = Date.now();
      try {
        if (!data || !data.markets) {
          setIsLoading(false);
          setDataError("Invalid market data received.");
          return;
        }
        setDataError(null);
        setSystemActive(data.systemActive);

        setMarkets(data.markets);
        if (data.activities) setActivitiesBanners(data.activities);
        
        if (data.openTrades) {
            // Handled by onSnapshot for better persistence and sync
            console.log("Open trades received via socket, deferring to onSnapshot logic");
        }
        setIsLoading(false);

        // Cache all historical data received
        if (data.history) {
          historyCacheRef.current = { ...historyCacheRef.current, ...data.history };
          saveHistoryCacheSafely(historyCacheRef.current);
          
          // Also update series if activeAsset is there and series exists
          const activePair = activeAssetRef.current;
          
          // If the initial data is very small (less than 150 candles), automatically request more from the server
          // to fulfill the "unlimited candles" requirement right from the start.
          if (activePair && data.history[activePair] && data.history[activePair].length < 150) {
              console.log(`Initial history for ${activePair} is small (${data.history[activePair].length} candles), requesting more...`);
              handleLoadMorePast();
          }

          if (activePair && data.history[activePair] && seriesRef.current) {
               try {
                   const rawPairData = [...data.history[activePair]];
                   const liveCandle = data.currentCandles?.[activePair];
                   if (liveCandle) {
                       rawLastCandleRef.current = liveCandle;
                       if (rawPairData.length > 0 && rawPairData[rawPairData.length - 1].time === liveCandle.time) {
                           rawPairData[rawPairData.length - 1] = liveCandle;
                       } else if (rawPairData.length === 0 || liveCandle.time > rawPairData[rawPairData.length - 1].time) {
                           rawPairData.push(liveCandle);
                       }
                   }
                   const pairHist = resampleData(rawPairData, timeframeRef.current);
                   if (pairHist && pairHist.length > 0) {
                       let initData = chartTypeRef.current === "Heikin Ashi" ? calculateHeikinAshi(pairHist) : pairHist;
                       if (chartTypeRef.current === "Line" || chartTypeRef.current === "Mountain") {
                           initData = initData.map((d: any) => ({ time: d.time, value: d.close }));
                       }
                       
                       // Deduplicate times
                       const uniqueMap = new Map();
                       const isOHLC = chartTypeRef.current === "Candle" || chartTypeRef.current === "Heikin Ashi" || chartTypeRef.current === "Bar";
                       for (const d of initData) {
                           if (isOHLC) {
                               if (typeof d.open === 'number' && typeof d.high === 'number' && typeof d.low === 'number' && typeof d.close === 'number' && isFinite(d.open) && isFinite(d.high) && isFinite(d.low) && isFinite(d.close) && Math.abs(d.high) < 1e12 && Math.abs(d.low) < 1e12 && d.open > 0 && d.close > 0) {
                                   const sanitized = {
                                       ...d,
                                       high: Math.max(d.open, d.high, d.low, d.close),
                                       low: Math.min(d.open, d.high, d.low, d.close)
                                   };
                                   uniqueMap.set(d.time, sanitized);
                               }
                           } else {
                               const val = typeof d.value === 'number' ? d.value : d.close;
                               if (typeof val === 'number' && isFinite(val) && Math.abs(val) < 1e12) {
                                   uniqueMap.set(d.time, { time: d.time, value: val });
                               }
                           }
                       }
                       const uniqueData = Array.from(uniqueMap.values()).sort((a,b) => a.time - b.time);
                       
                       const currentRange = chartRef.current ? chartRef.current.timeScale().getVisibleLogicalRange() : null;
                       const scrollPos = chartRef.current ? chartRef.current.timeScale().scrollPosition() : 0;
                       const wasScrolledBack = scrollPos < -3;
                       
                       try {
                           seriesRef.current.setData(uniqueData);
                           lastCandleRef.current = uniqueData[uniqueData.length - 1];
                           if (chartRef.current) {
                                const layoutKey = activePair + "_" + timeframeRef.current;
                                const assetChanged = lastZoomedAssetRef.current !== layoutKey;
                                
                                if (assetChanged) {
                                    alignChartRightByIdx(0, uniqueData.length, 50);
                                    lastZoomedAssetRef.current = layoutKey;
                                } else if (currentRange && (currentRange.to - currentRange.from) > 0 && wasScrolledBack) {
                                    try {
                                        chartRef.current.timeScale().setVisibleLogicalRange(currentRange);
                                    } catch (e) {}
                                } else {
                                    alignChartRightByIdx(0, uniqueData.length, 0);
                                }
                           }
                           rawLastCandleRef.current = pairHist[pairHist.length - 1];

                           const lastClose = pairHist[pairHist.length - 1]?.close || 0;
                           setCurrentPriceLabel(Number(lastClose).toFixed(6));
                           baseDataRef.current = pairHist;
                           refreshIndicators();
                       } catch(err) {
                           console.error("Initial chart setData failed", err);
                       }
                   } // Ends if (pairHist && pairHist.length > 0)
               } catch(err) {
                   console.error("History processing failed", err);
               }
           } // Ends if (activePair ...)
        } // Ends if (data.history)
      } catch (err) { // Ends try from 4280
        console.error("Critical error in initial_market_data:", err);
      } finally {
        setIsLoading(false);
        setChartLoading(false);
        setHistoryLoaded(Date.now()); // Trigger chart re-render if it missed the update
      }
    });

    socket.on('past_candles_response', (res: { asset: string, timeframe: string, candles: any[], error?: string }) => {
      isGeneratingRef.current = false;
      setIsPastHistoryLoading(false);
      setChartLoading(false);
      
      if (res.error || !res.candles || res.candles.length === 0) {
        console.log("No older candles returned from server or error:", res.error);
        return;
      }

      const activePair = activeAssetRef.current;
      if (res.asset !== activePair || res.timeframe !== timeframeRef.current) {
        // Response is for a different asset/timeframe (user switched while loading)
        return;
      }

      try {
        const currentHistory = historyCacheRef.current[activePair] || [];
        const newCandles = res.candles;
        
        // Deduplicate and merge history
        const mergedMap = new Map();
        newCandles.forEach((c: any) => mergedMap.set(c.time, c));
        currentHistory.forEach((c: any) => mergedMap.set(c.time, c));
        
        const mergedHistory = Array.from(mergedMap.values()).sort((a: any, b: any) => a.time - b.time);
        historyCacheRef.current[activePair] = mergedHistory;
        
        if (seriesRef.current) {
          const currentZoom = chartRef.current ? chartRef.current.timeScale().getVisibleLogicalRange() : null;
          
          // Count unique candles we currently have BEFORE merging new ones
          const beforeUniqueMap = new Map();
          const beforeHist = resampleData(currentHistory, timeframeRef.current);
          beforeHist.forEach((d: any) => beforeUniqueMap.set(d.time, true));
          const oldUniqueCount = beforeUniqueMap.size;

          const pairHist = resampleData(mergedHistory, timeframeRef.current);
          const uniqueMap = new Map();
          
          const isOHLC = chartTypeRef.current === "Candle" || chartTypeRef.current === "Heikin Ashi" || chartTypeRef.current === "Bar";
          pairHist.forEach((d: any) => {
              if (isOHLC) {
                  if (typeof d.open === 'number' && typeof d.high === 'number' && typeof d.low === 'number' && typeof d.close === 'number' && isFinite(d.open) && isFinite(d.high) && isFinite(d.low) && isFinite(d.close) && Math.abs(d.high) < 1e12 && Math.abs(d.low) < 1e12 && d.open > 0 && d.close > 0) {
                      const sanitized = {
                          ...d,
                          high: Math.max(d.open, d.high, d.low, d.close),
                          low: Math.min(d.open, d.high, d.low, d.close)
                      };
                      uniqueMap.set(d.time, sanitized);
                  }
              } else {
                  const val = typeof d.value === 'number' ? d.value : d.close;
                  if (typeof val === 'number' && isFinite(val) && Math.abs(val) < 1e12) {
                      uniqueMap.set(d.time, { time: d.time, value: val });
                  }
              }
          });
          
          const uniqueData = Array.from(uniqueMap.values()).sort((a: any, b: any) => a.time - b.time);
          const newTotalCount = uniqueData.length;
          
          const isLine = chartTypeRef.current === "Line" || chartTypeRef.current === "Area" || chartTypeRef.current === "Mountain";
          const finalData = isLine 
             ? uniqueData.map((d: any) => ({ time: d.time, value: d.close }))
             : uniqueData;
             
          seriesRef.current.setData(finalData);
          
          if (chartRef.current && currentZoom) {
              const newAddedCount = Math.max(0, newTotalCount - oldUniqueCount);
              try {
                chartRef.current.timeScale().setVisibleLogicalRange({
                  from: currentZoom.from + newAddedCount,
                  to: currentZoom.to + newAddedCount
                });
              } catch(e) {}
          }
        }
      } catch (err) {
        console.error("Failed to process past candles response:", err);
      }
    });

    socket.on('user_profile_update', (userData: any) => {
        if (userData.currency) {
          setUserCurrency(userData.currency);
          userCurrencyRef.current = userData.currency;
        }
        if (userData.balance !== undefined || userData.realBalance !== undefined || userData.real_balance !== undefined) {
            const raw = userData.balance ?? userData.realBalance ?? userData.real_balance;
            const val = parseFloat(raw?.toString());
            if (!isNaN(val)) {
                setRealBalance(val);
                realBalanceRef.current = val;
            }
        }
        if (userData.demoBalance !== undefined || userData.demo_balance !== undefined) {
            const raw = userData.demoBalance ?? userData.demo_balance;
            const val = parseFloat(raw?.toString());
            if (!isNaN(val)) {
                setDemoBalance(val);
                demoBalanceRef.current = val;
            }
        }
        if (userData.totalLiveVolume !== undefined) {
            const val = parseFloat(userData.totalLiveVolume?.toString());
            const finalVal = isNaN(val) ? 0 : val;
            setTotalLiveVolume(finalVal);
            totalLiveVolumeRef.current = finalVal;
        }
        if (userData.kycStatus) {
          setKycStatus(userData.kycStatus);
          isVerifiedRef.current = userData.kycStatus === 'verified';
        }
        if (userData.is2FAEnabled !== undefined) {
          setIs2FAEnabled(userData.is2FAEnabled);
        }
        if (userData.nickname) {
            setNickname(userData.nickname);
            setSavedNickname(userData.nickname);
        }
        if (userData.profilePic) setProfilePic(userData.profilePic);
        if (userData.phone || userData.phoneNumber) setPhone(userData.phone || userData.phoneNumber);
        if (userData.isPhoneVerified !== undefined || userData.phoneVerified !== undefined) {
          setIsPhoneVerified(!!userData.isPhoneVerified || !!userData.phoneVerified);
        }
        if (userData.notifications) setNotifications(userData.notifications);
        if (userData.firstName !== undefined || userData.lastName !== undefined || userData.gender !== undefined || userData.birthDay !== undefined || userData.dob !== undefined || userData.country !== undefined) {
            let day = userData.birthDay || "--";
            let month = userData.birthMonth || "--";
            let year = userData.birthYear || "--";
            if (userData.dob && (day === "--" || month === "--" || year === "--")) {
              let parsed = typeof userData.dob === 'string' ? null : userData.dob;
              if (typeof userData.dob === 'string') {
                try { parsed = JSON.parse(userData.dob); } catch(e) {}
              }
              if (parsed && typeof parsed === 'object') {
                if (parsed.day) day = String(parsed.day);
                if (parsed.month) month = String(parsed.month);
                if (parsed.year) year = String(parsed.year);
              }
            }
            setPersonalData(prev => {
              const next = {
                firstName: userData.firstName ?? prev.firstName,
                lastName: userData.lastName ?? prev.lastName,
                gender: (userData.gender && userData.gender !== "---" && userData.gender !== "--") ? userData.gender : prev.gender,
                day: day !== "--" ? day : prev.day,
                month: month !== "--" ? month : prev.month,
                year: year !== "--" ? year : prev.year,
                country: userData.country ?? prev.country
              };
              setSavedPersonalData(next);
              if (auth.currentUser?.uid) {
                try { localStorage.setItem(`bivax_personal_data_${auth.currentUser.uid}`, JSON.stringify(next)); } catch(e) {}
              }
              return next;
            });
        }
    });

    socket.on('balance_update', (data: any) => {
        if (data.real_balance !== undefined || data.balance !== undefined || data.realBalance !== undefined) {
            const raw = data.real_balance ?? data.balance ?? data.realBalance;
            const val = parseFloat(raw?.toString());
            if (!isNaN(val)) {
                setRealBalance(val);
                realBalanceRef.current = val;
            }
        }
        if (data.demo_balance !== undefined || data.demoBalance !== undefined) {
            const raw = data.demo_balance ?? data.demoBalance;
            const val = parseFloat(raw?.toString());
            if (!isNaN(val)) {
                setDemoBalance(val);
                demoBalanceRef.current = val;
            }
        }
    });

    socket.on('system_status', (active: boolean) => setSystemActive(active));
    socket.on("market_settings_updated", (updatedMarkets: any) => setMarkets(updatedMarkets));
    socket.on("activities_updated", (activities: any) => setActivitiesBanners(activities));
    socket.on("leaderboard_update", (data: any) => setLeaderboards(data));

    socket.on("candle_complete", (payload: any) => {
        lastChartUpdateTimeRef.current = Date.now();
        const { pair, candle, timeframe: candleTimeframe } = payload;
        
        const isMinUnit = candleTimeframe === "5 seconds";
        const isCurrentTf = candleTimeframe === timeframeRef.current;
        
        if (!isMinUnit && !isCurrentTf) return;

        if (isMinUnit && historyCacheRef.current[pair]) {
            const cache = historyCacheRef.current[pair];
            const lastIndex = cache.length - 1;
            if (lastIndex >= 0 && cache[lastIndex].time === candle.time) {
                cache[lastIndex] = candle;
            } else {
                cache.push(candle);
                if (cache.length > 50000) cache.shift();
            }
        }
        
        if (pair !== activeAssetRef.current || !seriesRef.current) return;
            
        // Professional Sync: Directly update baseDataRef if the candle matches the current bucket
        if (baseDataRef.current && baseDataRef.current.length > 0) {
            const timeframeSeconds = getTimeSeconds(timeframeRef.current);
            const bucketTime = Math.floor(candle.time - (candle.time % timeframeSeconds));
            const lastIdx = baseDataRef.current.length - 1;
            
            // If the timeframe matches perfectly, we do a direct authoritative sync on our refs and let RAF handle rendering
            if (isCurrentTf && candle.time === baseDataRef.current[lastIdx].time) {
                baseDataRef.current[lastIdx] = { ...candle };
                rawLastCandleRef.current = { ...candle };
                targetPriceRef.current = candle.close;
                return;
            }

            // Otherwise if it's a 5s candle belonging to our visible bucket, sync the high/low/volume
            if (isMinUnit && baseDataRef.current[lastIdx].time === bucketTime) {
                const existing = baseDataRef.current[lastIdx];
                const updated = {
                    ...existing,
                    high: Math.max(existing.high, candle.high),
                    low: Math.min(existing.low, candle.low),
                    volume: timeframeRef.current === "5 seconds" ? candle.volume : (existing.volume || 0) + (candle.volume_inc || 0)
                };
                baseDataRef.current[lastIdx] = updated;
                
                // ALSO sync the rawLastCandleRef so the next RAF frame renders the corrected high/low
                if (rawLastCandleRef.current && rawLastCandleRef.current.time === bucketTime) {
                    rawLastCandleRef.current.high = updated.high;
                    rawLastCandleRef.current.low = updated.low;
                    rawLastCandleRef.current.volume = updated.volume;
                }
            }
        }
    });

    socket.off("market_ticks", handleMarketTicks);
    socket.on("market_ticks", handleMarketTicks);

    socket.off("market_tick", handleSingleMarketTick);
    socket.on("market_tick", handleSingleMarketTick);

  function handleSingleMarketTick(tick: any) {
      if (tick.pair !== activeAssetRef.current) return;
      
      const activePair = activeAssetRef.current;
      const timeframeSeconds = getTimeSeconds(timeframeRef.current);
      const serverTime = tick.time || (Date.now() / 1000);
      let bucketTime = Math.floor(serverTime - (serverTime % timeframeSeconds));
      const newClose = tick.price;

      if (!rawLastCandleRef.current) {
          const serverCandle = tick.candle;
          
          // Guarantee perfect continuity: find the last completed candle from history cache
          let lastCompletedClose = newClose;
          const hist = historyCacheRef.current[activePair];
          if (Array.isArray(hist) && hist.length > 0) {
              lastCompletedClose = hist[hist.length - 1].close;
          }
          
          rawLastCandleRef.current = {
              time: bucketTime as Time,
              open: lastCompletedClose, // Always start exactly where the previous candle closed!
              high: Math.max(lastCompletedClose, newClose),
              low: Math.min(lastCompletedClose, newClose),
              close: newClose,
              volume: serverCandle?.volume || 1
          };
          currentInterpolatedPriceRef.current = newClose;
      }

      if (rawLastCandleRef.current.time !== bucketTime && bucketTime > rawLastCandleRef.current.time) {
          const prevClose = rawLastCandleRef.current.close;
          const openPrice = prevClose; // Always start exactly where the previous candle closed!
          const highPrice = Math.max(openPrice, newClose);
          const lowPrice = Math.min(openPrice, newClose);

          const newCandle = {
              time: bucketTime as Time,
              open: openPrice,
              high: highPrice,
              low: lowPrice,
              close: newClose,
              volume: tick.candle?.volume || 1
          };
          
          if (baseDataRef.current) {
             const lastIdx = baseDataRef.current.length - 1;
             if (lastIdx >= 0 && baseDataRef.current[lastIdx].time === rawLastCandleRef.current.time) {
                 baseDataRef.current[lastIdx] = { ...rawLastCandleRef.current };
             }
             baseDataRef.current.push(newCandle);
             if (baseDataRef.current.length > 5000) baseDataRef.current.shift();
          }
          rawLastCandleRef.current = newCandle;
      } else {
          rawLastCandleRef.current.close = newClose;
          // Sync with server's actual high/low from the micro-volatility engine
          if (tick.candle) {
              rawLastCandleRef.current.high = Math.max(rawLastCandleRef.current.high, newClose, tick.candle.high || newClose);
              rawLastCandleRef.current.low = Math.min(rawLastCandleRef.current.low, newClose, tick.candle.low || newClose);
              rawLastCandleRef.current.volume = tick.candle.volume || rawLastCandleRef.current.volume;
          } else {
              rawLastCandleRef.current.high = Math.max(rawLastCandleRef.current.high, newClose);
              rawLastCandleRef.current.low = Math.min(rawLastCandleRef.current.low, newClose);
          }
      }

      targetPriceRef.current = newClose;

      // Active Alerts Check for the active asset
      if (newClose > 0 && alertsRef.current.length > 0) {
          const activeAlerts = alertsRef.current.filter(a => a.asset === activePair && a.status === 'active');
          if (activeAlerts.length > 0) {
            activeAlerts.forEach(alert => {
                let triggered = (alert.condition === 'above' && newClose >= alert.targetPrice) || (alert.condition === 'below' && newClose <= alert.targetPrice);
                if (triggered) {
                    alert.status = 'triggered';
                    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'triggered' } : a));
                    toast.success(`Price hit ${alert.targetPrice.toFixed(5)}`, { icon: 'ðŸ””' });
                }
            });
          }
      }
  }

  // Handle market ticks with elite internal interpolation
  function handleMarketTicks(ticks: any) {
      lastChartUpdateTimeRef.current = Date.now();
      const activePair = activeAssetRef.current;
      const currentAlerts = alertsRef.current;

      // 1. GLOBAL SYNC & ALERTS (All Assets)
      const triggeredAlertIds: string[] = [];
      const triggeredAlertDetails: { pair: string, price: number, target: number }[] = [];

      setMarkets((prev: any) => {
        const next = { ...prev };
        let changed = false;
        Object.keys(ticks).forEach(pair => {
            if (next[pair] && next[pair].price !== ticks[pair].price) {
              next[pair] = { ...next[pair], price: ticks[pair].price };
              changed = true;
            }
            
            // Alerts for non-active assets
            if (pair !== activePair && currentAlerts.length > 0) {
                const price = ticks[pair].price;
                currentAlerts.filter(a => a.asset === pair && a.status === 'active').forEach(alert => {
                    let triggered = (alert.condition === 'above' && price >= alert.targetPrice) || (alert.condition === 'below' && price <= alert.targetPrice);
                    if (triggered) {
                        alert.status = 'triggered';
                        triggeredAlertIds.push(alert.id);
                        triggeredAlertDetails.push({ pair, price, target: alert.targetPrice });
                    }
                });
            }
        });
        return changed ? next : prev;
      });

      if (triggeredAlertIds.length > 0) {
        setAlerts(prevAlerts => prevAlerts.map(a => triggeredAlertIds.includes(a.id) ? { ...a, status: 'triggered' } : a));
        triggeredAlertDetails.forEach(detail => {
          toast.success(`Alert! ${detail.pair} hit ${detail.target.toFixed(5)}`, { icon: 'ðŸ””' });
        });
      }

      // 2. ACTIVE ASSET CONTINUITY & CANDLE SYNC (Handled by handleSingleMarketTick for responsiveness)
      const tickData = ticks[activePair];
      if (tickData) {
         targetPriceRef.current = tickData.price;
      }

      // 3. TRADE PROCESSING Logic (Visual Countdown & Optimistic Settle)
      let tradesUpdated = false;
      const allTicks = ticks;
      const newActiveTrades = activeTradesRef.current.map(trade => {
        if (trade.timeLeft > 0) {
          const updatedTimeLeft = Math.floor((trade.expirationTime - Date.now()) / 1000);
          if (updatedTimeLeft !== trade.timeLeft) {
            tradesUpdated = true;
            return { ...trade, timeLeft: updatedTimeLeft };
          }
        }
        return trade;
      }).filter(trade => {
        const tradeAsset = trade.asset;
        const currentPriceForAsset = allTicks[tradeAsset]?.price || (tradeAsset === activePair ? targetPriceRef.current : null);

        if (trade.timeLeft <= 0) {
          if (!currentPriceForAsset) return true;
          
          const tradeId = trade.id ? String(trade.id) : '';
          const fbId = (trade as any).firebaseId || (trade as any).firebase_id ? String((trade as any).firebaseId || (trade as any).firebase_id) : '';

          const alreadyProcessed = (tradeId && processedTradesRef.current.has(tradeId)) || 
                                   (fbId && processedTradesRef.current.has(fbId));
          
          if (alreadyProcessed) return false;
          
          // Prevent Set from growing indefinitely in long sessions
          if (processedTradesRef.current.size > 1000) {
            processedTradesRef.current.clear();
          }
          
          if (tradeId) processedTradesRef.current.add(tradeId);
          if (fbId) processedTradesRef.current.add(fbId);
          tradesUpdated = true;

          const settlePrice = currentPriceForAsset;
          const diff = settlePrice - trade.entryPrice;
          const epsilon = 0.0000000001; 
          const isDraw = Math.abs(diff) < epsilon;
          const dir = trade.type || (trade as any).direction || 'up';
          
          let won = false;
          if (!isDraw) {
            won = dir === "up" ? settlePrice > trade.entryPrice : settlePrice < trade.entryPrice;
          }

          const payoutRate = trade.payout || (trade as any).payoutRate || (trade.asset && markets[trade.asset]?.payout) || 80;
          const returnAmt = trade.amount * (payoutRate / 100 + 1);
          const tradeStatus = isDraw ? 'draw' : won ? 'won' : 'lost';

          if (trade.accountType === 'tournament') {
            if (won) {
              updateTournamentScore(returnAmt, true);
            } else if (isDraw) {
              updateTournamentScore(trade.amount, false);
            } else {
              updateTournamentScore(0, false);
            }
          }

          // Trigger result notification for local settlement
          const notifAmount = won ? returnAmt : trade.amount;
          addTradeNotification({
              id: tradeId || fbId || Math.random().toString(),
              tradeId: tradeId || fbId,
              status: tradeStatus,
              asset: trade.asset,
              amount: notifAmount
          });

          // Settle on server and apply authoritative balance & outcome
          fetch('/api/trade/settle-secure', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tradeId: trade.id, currentMarketPrice: settlePrice, tradeData: trade })
          }).then(async (res) => {
            if (res.ok) {
              const data = await res.json().catch(() => null);
              if (data?.user) {
                if (data.user.balance !== undefined || data.user.realBalance !== undefined) {
                  const b = parseFloat((data.user.balance ?? data.user.realBalance).toString());
                  if (!isNaN(b)) {
                    setRealBalance(b);
                    realBalanceRef.current = b;
                  }
                }
                if (data.user.demoBalance !== undefined) {
                  const db = parseFloat(data.user.demoBalance.toString());
                  if (!isNaN(db)) {
                    setDemoBalance(db);
                    demoBalanceRef.current = db;
                  }
                }
              }
              if (data?.trade) {
                 const serverTrade = data.trade;
                 setUserTrades(prev => {
                     const correctedTrade = { ...trade, ...serverTrade };
                     return [correctedTrade, ...prev.filter(t => String(t.id) !== String(trade.id) && String(t.id) !== String(serverTrade.id))].slice(0, 100);
                 });
              }
            }
          }).catch(err => console.error("Settlement request failed:", err));

          setUserTrades(prev => {
            const settledTrade = { ...trade, status: tradeStatus, exitPrice: settlePrice, payoutAmount: won ? returnAmt : (isDraw ? trade.amount : 0) };
            return [settledTrade, ...prev.filter(t => t.id !== trade.id)].slice(0, 100);
          });
          
          return false;
        }
        return true;
      });

      if (tradesUpdated) {
         setActiveTrades(newActiveTrades);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && socket.connected) {
          console.log("Tab became visible, re-syncing market data...");
          socket.emit('request_initial_data', { 
            asset: activeAssetRef.current, 
            timeframe: timeframeRef.current, 
            accountType: accountTypeRef.current, 
            userId: auth.currentUser?.uid,
            isSwitch: true // Force history refresh
          });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
        setIsLoading(false);

    return () => {
      clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (currentUser?.uid && socketRef.current) {
      console.log("User authentication state loaded/changed, updating socket initial data...");
      socketRef.current.emit('request_initial_data', {
        asset: activeAssetRef.current,
        timeframe: timeframeRef.current,
        accountType,
        userId: currentUser.uid
      });
    }
  }, [currentUser?.uid, accountType]);

  const timeframeRef = useRef(timeframe);
  const chartTypeRef = useRef(chartType);
  useEffect(() => { timeframeRef.current = timeframe; }, [timeframe]);
  useEffect(() => { chartTypeRef.current = chartType; }, [chartType]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        lastValueVisible: false,
        priceLineVisible: false,
      });
    }
  }, [showQuoteDetails]);

  // Real-time Chart Resize handling (Critical for Mobile)
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target;
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          if (target === chartContainerRef.current && chartRef.current) {
            chartRef.current.resize(width, height);
            alignChartRightByIdx(0, 0, 10);
          } else if (target === chartContainerRef2.current && chartRef2.current) {
            chartRef2.current.resize(width, height);
            alignChartRightByIdx(1, 0, 10);
          }
        }
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }
    if (chartContainerRef2.current) {
      resizeObserver.observe(chartContainerRef2.current);
    }

    return () => resizeObserver.disconnect();
  }, [isMultiChart, isMobile]);

  useEffect(() => {
    timeZoneRef.current = timeZone;
    if (chartRef.current) {
      chartRef.current.applyOptions({
        timeScale: {
          rightOffset: isMobile ? 22 : 40,
          tickMarkFormatter: (time: any) => {
             const date = new Date(time * 1000);
             return date.toLocaleTimeString('en-US', { timeZone: timeZoneRef.current, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
          }
        },
        localization: {
          timeFormatter: (time: any) => {
             const date = new Date(time * 1000);
             return date.toLocaleString('en-US', { timeZone: timeZoneRef.current, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
          }
        }
      });
    }
  }, [timeZone]);

  const lastIndicatorRefreshRef = useRef(0);


  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 600,
      height: chartContainerRef.current.clientHeight || 400,
      
      layout: {
        background: { type: ColorType.Solid, color: "#1e1f25" },
        textColor: "#8f94a6",
        fontSize: 12,
        fontFamily: "JetBrains Mono, -apple-system, system-ui, sans-serif",

      },
      grid: {
        vertLines: { color: "#282b36", style: LineStyle.Solid },
        horzLines: { color: "#282b36", style: LineStyle.Solid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { 
          color: "rgba(255, 255, 255, 0.4)", 
          width: 1, 
          style: LineStyle.Dotted, 
          labelBackgroundColor: "#1a1b1f",
          labelVisible: true,
        },
        horzLine: { 
          color: "rgba(255, 255, 255, 0.4)", 
          width: 1, 
          style: LineStyle.Dotted, 
          labelBackgroundColor: "#1a1b1f",
          labelVisible: true,
        },
      },
      kineticScroll: {
        touch: true,
        mouse: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
        axisDoubleClickReset: {
          time: true,
          price: true,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        ticksVisible: false, 
        secondsVisible: true,
        rightOffset: isMobile ? 22 : 40, 
        fixRightEdge: false,
        barSpacing: isMobile ? 10 : 16,
        minBarSpacing: 3.8,
        maxBarSpacing: 28,
        fixLeftEdge: false, 
        lockVisibleTimeRangeOnResize: true,
        shiftVisibleRangeOnNewBar: true,
        tickMarkFormatter: (time: any) => {
           const date = new Date(time * 1000);
           return date.toLocaleTimeString('en-US', { timeZone: timeZoneRef.current, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        }
      },
      rightPriceScale: {
        borderVisible: false,
        autoScale: true, 
        alignLabels: true,
        scaleMargins: { top: 0.18, bottom: 0.18 },
        entireTextOnly: true, 

        ticksVisible: false,
        visible: true,
        tickMarkDensity: 10,
      },
      localization: { 
        priceFormatter: (price: number) => {
           if (price >= 10000) return price.toFixed(0);
           if (price >= 1000) return price.toFixed(1);
           if (price >= 100) return price.toFixed(2);
           if (price >= 10) return price.toFixed(3);
           if (price >= 1) return price.toFixed(4);
           if (price > 0) {
              const log10 = Math.ceil(-Math.log10(price));
              return price.toFixed(Math.max(5, log10 + 4));
           }
           return price.toString();
        },
        timeFormatter: (time: any) => {
           const date = new Date(time * 1000);
           return date.toLocaleString('en-US', { timeZone: timeZoneRef.current, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        }
      }
    });
    chartRef.current = chart;
    setTimeout(() => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
      }
    }, 50);
    setTimeout(() => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
      }
    }, 300);

    const container = chartContainerRef.current;
    const handleDblClick = () => {
      chart.priceScale('right').applyOptions({ autoScale: true });
    };
    if (container) {
      container.addEventListener('dblclick', handleDblClick);
    }

    // Handle scroll back visibility for "Scroll to Real-time" button and infinite history loading
    chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
      setTimeout(() => {
        if (!chartRef.current) return;
        const ts = chartRef.current.timeScale();
        const scrollPos = ts.scrollPosition();
        
        // scrollPosition is the distance from the rightmost data point to the right edge of the screen
        // Negative means scrolled into the past. Positive means scrolled into the future (empty space).
        setIsScrolledBack(scrollPos < -3);

        if (logicalRange) {
          // Trigger prepending more older candles when user is close to running out of data on the left
          // Increased threshold to 150 for smoother "unlimited" scrolling experience
          if (logicalRange.from < 150 && !isGeneratingRef.current) {
            isGeneratingRef.current = true;
            loadMorePastRef.current();
          }
        }
      }, 0);
    });
    
    // Add runtime shims for backward compatibility or missed occurrences
    const chartAny = chart as any;
    if (!chartAny.addSeries) {
      chartAny.addSeries = (seriesType: any, options: any) => {
        if (seriesType === CandlestickSeries) return (chart as any).addCandlestickSeries(options);
        if (seriesType === LineSeries) return (chart as any).addLineSeries(options);
        if (seriesType === AreaSeries) return (chart as any).addAreaSeries(options);
        if (seriesType === BarSeries) return (chart as any).addBarSeries(options);
        if (seriesType === HistogramSeries) return (chart as any).addHistogramSeries(options);
        return (chart as any).addLineSeries(options);
      };
    }
    if (!chartAny.addLineSeries) {
      chartAny.addLineSeries = (options: any) => chart.addSeries(LineSeries, options);
    }
    if (!chartAny.addHistogramSeries) {
      chartAny.addHistogramSeries = (options: any) => chart.addSeries(HistogramSeries, options);
    }
    if (!chartAny.addAreaSeries) {
      chartAny.addAreaSeries = (options: any) => chart.addSeries(AreaSeries, options);
    }
    if (!chartAny.addBarSeries) {
      chartAny.addBarSeries = (options: any) => chart.addSeries(BarSeries, options);
    }
    if (!chartAny.addCandlestickSeries) {
      chartAny.addCandlestickSeries = (options: any) => chart.addSeries(CandlestickSeries, options);
    }

    return () => {
      if (container) {
        container.removeEventListener('dblclick', handleDblClick);
      }
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      markersPluginRef.current = null;
    };
  }, []);

  // Second Chart Initialization
  useEffect(() => {
    if (!isMultiChart || !chartContainerRef2.current) {
        if (chartRef2.current) {
            chartRef2.current.remove();
            chartRef2.current = null;
            seriesRef2.current = null;
        }
        return;
    }

    const chart = createChart(chartContainerRef2.current, {
      width: chartContainerRef2.current.clientWidth || 600,
      height: chartContainerRef2.current.clientHeight || 400,
      
      layout: {
        background: { type: ColorType.Solid, color: "#1e1f25" },
        textColor: "#8f94a6",
        fontSize: 12,
        fontFamily: "JetBrains Mono, -apple-system, system-ui, sans-serif",

      },
      grid: {
        vertLines: { color: "#282b36", style: LineStyle.Solid },
        horzLines: { color: "#282b36", style: LineStyle.Solid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      kineticScroll: {
        touch: true,
        mouse: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
        axisDoubleClickReset: {
          time: true,
          price: true,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        ticksVisible: false,
        secondsVisible: true,
        rightOffset: isMobile ? 22 : 40,
        fixRightEdge: false,
        barSpacing: isMobile ? 10 : 16,
        minBarSpacing: 3.8,
        maxBarSpacing: 28,
        shiftVisibleRangeOnNewBar: true,
      },
      rightPriceScale: {
        borderVisible: false,
        autoScale: true,
        alignLabels: true,
        scaleMargins: { top: 0.18, bottom: 0.18 },
        entireTextOnly: true,
        ticksVisible: false,
        visible: true,
        tickMarkDensity: 10,
      },
      localization: { 
        priceFormatter: (price: number) => {
           if (price >= 10000) return price.toFixed(0);
           if (price >= 1000) return price.toFixed(1);
           if (price >= 100) return price.toFixed(2);
           if (price >= 10) return price.toFixed(3);
           if (price >= 1) return price.toFixed(4);
           if (price > 0) {
              const log10 = Math.ceil(-Math.log10(price));
              return price.toFixed(Math.max(5, log10 + 4));
           }
           return price.toString();
        },
        timeFormatter: (time: any) => {
           const date = new Date(time * 1000);
           return date.toLocaleString('en-US', { timeZone: timeZoneRef.current, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        }
      }
    });

    chartRef2.current = chart;
    setTimeout(() => {
      if (chartContainerRef2.current && chartRef2.current) {
        chartRef2.current.resize(chartContainerRef2.current.clientWidth, chartContainerRef2.current.clientHeight);
      }
    }, 50);
    setTimeout(() => {
      if (chartContainerRef2.current && chartRef2.current) {
        chartRef2.current.resize(chartContainerRef2.current.clientWidth, chartContainerRef2.current.clientHeight);
      }
    }, 300);

    const container = chartContainerRef2.current;
    const handleDblClick = () => {
      chart.priceScale('right').applyOptions({ autoScale: true });
    };
    if (container) {
      container.addEventListener('dblclick', handleDblClick);
    }

    // Calculate dynamic precision based on current price for series2
    const initialPrice = currentInterpolatedPriceRef.current > 0 ? currentInterpolatedPriceRef.current : 100;
    let dynamicPrecision = 5;
    let dynamicMinMove = 0.00001;
    if (initialPrice >= 10000) {
        dynamicPrecision = 0;
        dynamicMinMove = 1;
    } else if (initialPrice >= 1000) {
        dynamicPrecision = 1;
        dynamicMinMove = 0.1;
    } else if (initialPrice >= 100) {
        dynamicPrecision = 2;
        dynamicMinMove = 0.01;
    } else if (initialPrice >= 10) {
        dynamicPrecision = 3;
        dynamicMinMove = 0.001;
    } else if (initialPrice >= 1) {
        dynamicPrecision = 4;
        dynamicMinMove = 0.0001;
    } else if (initialPrice > 0) {
        const log10 = Math.ceil(-Math.log10(initialPrice));
        dynamicPrecision = Math.max(5, log10 + 4);
        dynamicMinMove = Math.pow(10, -dynamicPrecision);
    }

    const series = chart.addSeries(CandlestickSeries, {
        upColor: '#00c980',
        downColor: '#ff4757',
        borderVisible: false,
        wickUpColor: '#00c980',
        wickDownColor: '#ff4757',
        priceFormat: {
            type: "price",
            precision: dynamicPrecision,
            minMove: dynamicMinMove,
        },
        lastValueVisible: false,
        priceLineVisible: false,
        priceLineColor: "#9ba1b8",
        priceLineStyle: LineStyle.Solid,
        priceLineWidth: 2,
        // @ts-ignore
        lastPriceAnimation: (LastPriceAnimationMode as any).On,
        autoscaleInfoProvider: (original: any) => {
            const res = original();
            if (res !== null && res.priceRange !== null) {
                const min = res.priceRange.min;
                const max = res.priceRange.max;
                const mid = (min + max) / 2;
                // Enforce a professional spacing (minimum range of 0.3% of current price or 0.005 absolute)
                const minRange = Math.max(mid * 0.003, 0.005);
                if ((max - min) < minRange) {
                    res.priceRange.min = mid - minRange / 2;
                    res.priceRange.max = mid + minRange / 2;
                }
            }
            return res;
        }
    });
    seriesRef2.current = series;

    // Load data from main series
    if (seriesRef.current) {
        try {
            const data = (seriesRef.current as any).data();
            if (data && data.length > 0) {
                series.setData(data);
                alignChartRightByIdx(1, data.length, 50);
            }
        } catch (e) {}
    }

    return () => {
      if (container) {
        container.removeEventListener('dblclick', handleDblClick);
      }
      if (chartRef2.current) {
        chartRef2.current.remove();
        chartRef2.current = null;
        seriesRef2.current = null;
      }
    };
  }, [isMultiChart]);

  // Data Request Effect (Separate from Chart Update to prevent loops)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (socketRef.current && activeTab === "trade") {
        const key = `${activeAsset}_${timeframe}`;
        const lastTime = lastRequestedRef.current[key] || 0;
        const now = Date.now();
        
        // Throttled to prevent spam
        if (now - lastTime >= 1000) {
            lastRequestedRef.current[key] = now;

            const pairHist = historyCacheRef.current[activeAsset];
            if (!pairHist || pairHist.length === 0) {
                setIsLoading(true);
            }
            
            console.log(`[Chart Data Request] Requesting up-to-second data for ${activeAsset} (${timeframe})`);
            socketRef.current.emit('request_initial_data', { 
                asset: activeAsset, 
                timeframe,
                accountType, 
                isSwitch: true, 
                userId: auth.currentUser?.uid 
            });
            
            timer = setTimeout(() => {
                setIsLoading(false);
            }, 8000);
        }
    }
    return () => {
        if (timer) clearTimeout(timer);
    };
  }, [activeAsset, timeframe, accountType, activeTab]);



  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    
    const assetChanged = prevAssetRefRender.current !== activeAsset;
    const timeframeChanged = prevTimeframeRefRender.current !== timeframe;
    const chartTypeChanged = prevChartTypeRefRender.current !== chartType;
    const forceRecreate = assetChanged || timeframeChanged || chartTypeChanged || !seriesRef.current;

    if (forceRecreate && seriesRef.current) {
        chart.removeSeries(seriesRef.current);
        seriesRef.current = null;
    }

    if (forceRecreate && indicatorSeriesRefs.current) {
        Object.values(indicatorSeriesRefs.current).forEach((indicatorSeries: any) => {
            if (indicatorSeries && typeof indicatorSeries === 'object') {
                try {
                    chart.removeSeries(indicatorSeries);
                } catch (e) {}
            }
        });
        indicatorSeriesRefs.current = {};
    }

    if (forceRecreate) {
        const initialPrice = currentInterpolatedPriceRef.current > 0 ? currentInterpolatedPriceRef.current : (rawLastCandleRef.current?.close || 100);
        let dynamicPrecision = 5;
        let dynamicMinMove = 0.00001;
        if (initialPrice >= 10000) {
            dynamicPrecision = 0;
            dynamicMinMove = 1;
        } else if (initialPrice >= 1000) {
            dynamicPrecision = 1;
            dynamicMinMove = 0.1;
        } else if (initialPrice >= 100) {
            dynamicPrecision = 2;
            dynamicMinMove = 0.01;
        } else if (initialPrice >= 10) {
            dynamicPrecision = 3;
            dynamicMinMove = 0.001;
        } else if (initialPrice >= 1) {
            dynamicPrecision = 4;
            dynamicMinMove = 0.0001;
        } else if (initialPrice > 0) {
            const log10 = Math.ceil(-Math.log10(initialPrice));
            dynamicPrecision = Math.max(5, log10 + 4);
            dynamicMinMove = Math.pow(10, -dynamicPrecision);
        }

        const commonOptions: any = {
      priceFormat: { 
        type: "price", 
        precision: dynamicPrecision,
        minMove: dynamicMinMove 
      },
      lastValueVisible: false, 
      priceLineVisible: false, 
      priceLineLabelVisible: false,
      priceLineSource: 1,
      priceLineColor: "#9ba1b8", 
      priceLineStyle: LineStyle.Solid, 
      priceLineWidth: 2,
      // @ts-ignore
      lastPriceAnimation: (LastPriceAnimationMode as any).On,
      baseLineWidth: 1,
      autoscaleInfoProvider: (original: any) => {
          const res = original();
          if (res !== null && res.priceRange !== null) {
              const min = res.priceRange.min;
              const max = res.priceRange.max;
              const mid = (min + max) / 2;
              // Enforce a professional spacing (minimum range of 0.3% of current price or 0.005 absolute)
              const minRange = Math.max(mid * 0.003, 0.005);
              if ((max - min) < minRange) {
                  res.priceRange.min = mid - minRange / 2;
                  res.priceRange.max = mid + minRange / 2;
              }
          }
          return res;
      }
    };

    let series: any;
    if (chartType === "Candle" || chartType === "Heikin Ashi") {
      series = chart.addSeries(CandlestickSeries, { 
        ...commonOptions, 
        upColor: "#00c980", 
        downColor: "#ff4757", 
        borderVisible: false, 
        wickVisible: true, 
        wickUpColor: "#00c980", 
        wickDownColor: "#ff4757" 
      });
    } else if (chartType === "Line") {
      series = chart.addSeries(LineSeries, { ...commonOptions, color: "#3b82f6", lineWidth: 3 });
    } else if (chartType === "Mountain") {
      series = chart.addSeries(AreaSeries, { ...commonOptions, topColor: "rgba(41, 121, 255, 0.5)", bottomColor: "rgba(41, 121, 255, 0.0)", lineColor: "#2979ff", lineWidth: 3 });
    } else if (chartType === "Bar") {
      series = chart.addSeries(BarSeries, { ...commonOptions, upColor: "#00c0a3", downColor: "#ff5252" });
    }
        seriesRef.current = series;
        
        if (crosshairCallbackRef.current) {
            try {
                chart.unsubscribeCrosshairMove(crosshairCallbackRef.current);
            } catch (e) {}
            crosshairCallbackRef.current = null;
        }

        const onCrosshairMove = (param: any) => {
          if (param.point === undefined || !param.time || param.point.x < 0 || param.point.y < 0) {
            setHoveredCandle(null);
            setHoveredIndicatorValues({});
          } else {
            const currentSeries = seriesRef.current;
            if (currentSeries) {
              const data = param.seriesData.get(currentSeries);
              setHoveredCandle(data || null);
            } else {
              setHoveredCandle(null);
            }

            // Capture all active indicator values at this point
            const indicatorValues: any = {};
            Object.entries(indicatorSeriesRefs.current).forEach(([name, series]) => {
              if (series) {
                const data = param.seriesData.get(series as any);
                if (data) {
                  if (data.value !== undefined) indicatorValues[name] = data.value;
                  else if (data.close !== undefined) indicatorValues[name] = data.close;
                  else if (data.histogram !== undefined) indicatorValues[name] = data.histogram;
                }
              }
            });
            setHoveredIndicatorValues(indicatorValues);
          }
        };
        chart.subscribeCrosshairMove(onCrosshairMove);
        crosshairCallbackRef.current = onCrosshairMove;

        prevAssetRefRender.current = activeAsset;
        prevTimeframeRefRender.current = timeframe;
        prevChartTypeRefRender.current = chartType;
    }

    const series = seriesRef.current;
    if (!series) return;

    let pairHist = historyCacheRef.current[activeAsset];
    
    if (pairHist && pairHist.length > 0) {
      try {
        let rawPairData = [...pairHist];
        const liveCandle = rawLastCandleRef.current;
        if (liveCandle && (!rawPairData.length || liveCandle.time >= rawPairData[rawPairData.length - 1].time)) {
            if (rawPairData.length > 0 && rawPairData[rawPairData.length - 1].time === liveCandle.time) {
                rawPairData[rawPairData.length - 1] = liveCandle;
            } else if (rawPairData.length === 0 || liveCandle.time > rawPairData[rawPairData.length - 1].time) {
                rawPairData.push(liveCandle);
            }
        }
        const resampled = resampleData(rawPairData, timeframe);
        if (resampled.length > 0) {
          let initData = chartType === "Heikin Ashi" ? calculateHeikinAshi(resampled) : resampled;
          if (chartType === "Line" || chartType === "Mountain") {
            initData = initData.map((d: any) => ({ time: d.time, value: d.close }));
          }
          
          // Deduplicate
          const uniqueMap = new Map();
          const isOHLC = chartType === "Candle" || chartType === "Heikin Ashi" || chartType === "Bar";
          
          for (const d of initData) {
            if (isOHLC) {
              if (typeof d.open === 'number' && typeof d.high === 'number' && typeof d.low === 'number' && typeof d.close === 'number' && isFinite(d.open) && isFinite(d.high) && isFinite(d.low) && isFinite(d.close) && Math.abs(d.high) < 1e12 && Math.abs(d.low) < 1e12 && d.open > 0 && d.close > 0) {
                  const sanitized = {
                      ...d,
                      high: Math.max(d.open, d.high, d.low, d.close),
                      low: Math.min(d.open, d.high, d.low, d.close)
                  };
                  uniqueMap.set(d.time, sanitized);
              }
            } else {
              const val = typeof d.value === 'number' ? d.value : d.close;
              if (typeof val === 'number' && isFinite(val) && Math.abs(val) < 1e12) {
                  uniqueMap.set(d.time, { time: d.time, value: val });
              }
            }
          }
          const uniqueData = Array.from(uniqueMap.values()).sort((a: any, b: any) => a.time - b.time);

          const currentZoom = chartRef.current ? chartRef.current.timeScale().getVisibleLogicalRange() : null;
          const scrollPos = chartRef.current ? chartRef.current.timeScale().scrollPosition() : 0;
          const wasScrolledBack = scrollPos < -3;
          
          series.setData(uniqueData);
          lastCandleRef.current = uniqueData[uniqueData.length - 1];
          
          const tabChanged = prevTabRef.current !== activeTab;
          if (tabChanged) prevTabRef.current = activeTab;

          if (chartRef.current) {
              const hasZoom = currentZoom && (currentZoom.to - currentZoom.from) > 0;
              const layoutKey = activeAsset + "_" + timeframe;
              const assetChanged = lastZoomedAssetRef.current !== layoutKey;
              
              if (assetChanged || forceRecreate || (tabChanged && activeTab === 'trade')) {
                  alignChartRightByIdx(0, uniqueData.length, 50);
                  lastZoomedAssetRef.current = layoutKey;
              } else if (hasZoom && wasScrolledBack) {
                  try {
                      chartRef.current.timeScale().setVisibleLogicalRange(currentZoom);
                  } catch (e) {}
              } else {
                  alignChartRightByIdx(0, uniqueData.length, 0);
              }
          }
          
          rawLastCandleRef.current = resampled[resampled.length - 1];
          const lastClose = resampled[resampled.length - 1]?.close || 0;
          setCurrentPriceLabel(Number(lastClose).toFixed(6));
          baseDataRef.current = resampled;
          refreshIndicators();
          setIsLoading(false);
          setDataError(null);
        }
      } catch (err: any) {
         console.error("Chart setData failed in useEffect:", err.message);
         setIsLoading(false);
      }
    } 
  }, [activeAsset, timeframe, chartType, historyLoaded, activeTab]);

  // Watchdog & Self-Healing Loop for Continuous, Freeze-Free Candle Updates (Professional Standard)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (currentUser) {
      intervalId = setInterval(() => {
        const socket = socketRef.current;
        if (!socket) return;

        // 1. Force instant reconnection if socket gets disconnected
        if (!socket.connected) {
          console.warn("[Watchdog] Socket disconnected. Force-reconnecting now...");
          socket.connect();
          return;
        }

        // 2. Continuous flow inspection (Only active on the TRADE view tab)
        if (activeTab === "trade") {
          const timeSinceLastUpdate = Date.now() - lastChartUpdateTimeRef.current;

          // If no tick/price update has occurred for 25 seconds, trigger a proactive resync.
          // Relaxed significantly to prevent clobbering the chart during low volatility.
          if (lastChartUpdateTimeRef.current > 0 && timeSinceLastUpdate > 25000) {
            console.warn(`[Watchdog] Price stream silent for ${timeSinceLastUpdate}ms. Syncing ${activeAssetRef.current}...`);
            
            // Re-assert last update time to prevent infinite fire rate
            lastChartUpdateTimeRef.current = Date.now();
            
            socket.emit('request_initial_data', {
              asset: activeAssetRef.current,
              timeframe: timeframeRef.current,
              accountType,
              isSwitch: true,
              userId: currentUser.uid
            });
          }
        }
      }, 2500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUser, activeTab, accountType]);

  const placeTrade = async (type: "up" | "down") => {
    if (isPlacingTradeRef.current || isPlacingTrade) return;
    isPlacingTradeRef.current = true;
    setIsPlacingTrade(true);
    try {
        console.log("placeTrade called", type);
        const tradeAmount = Number(amount);
        const tradeAmountInBase = convertToBase(tradeAmount, userCurrency);
        
        if (!systemActive) {
          console.log("placeTrade failed: !systemActive");
          toast.error("Market is closed. Trading is suspended.", { id: "trade-error" });
          return;
        }

        if (isClosed) {
          console.log("placeTrade failed: isClosed");
          toast.error("Market is closed. Trading is suspended.", { id: "trade-error" });
          return;
        }

        if (markets[activeAsset]?.isFrozen) {
          console.log("placeTrade failed: isFrozen");
          toast.error("This asset is currently frozen for maintenance.", { id: "trade-error" });
          return;
        }

        if (isNaN(tradeAmount) || tradeAmount < minConvertedAmount - 0.001) {
          console.log("placeTrade failed: tradeAmount < minConvertedAmount or NaN");
          toast.error(`Minimum trade amount is ${getCurrencySymbol(userCurrency)}${minConvertedAmount}`, { id: "trade-error" });
          return;
        }

    if (accountType === 'real' && realBalance < tradeAmountInBase) {
      console.log("placeTrade failed: real balance");
      toast.error("Insufficient balance. Please deposit funds.", { id: "trade-error" });
      return;
    }
    
    if (accountType === 'demo' && demoBalance < tradeAmountInBase) {
      console.log("placeTrade failed: demo balance");
      toast.error("Insufficient demo balance.", { id: "trade-error" });
      return;
    }

    if (accountType === 'tournament' && tournamentBalance < tradeAmountInBase) {
      console.log("placeTrade failed: tournament balance");
      toast.error("Insufficient tournament funds. You can rebuy in the account switcher!", { id: "trade-error" });
      return;
    }

    if (!rawLastCandleRef.current) {
      console.error("placeTrade failed: missing price data", { rawLast: !!rawLastCandleRef.current });
      toast.error("Waiting for market data, please wait.", { id: "trade-error" });
      return;
    }
    // Professional precision: use the interpolated price that the user actually SEE on the chart.
    const currentPrice = targetPriceRef.current > 0 ? targetPriceRef.current : (rawLastCandleRef.current?.close || currentInterpolatedPriceRef.current || 0);
    console.log("placeTrade currentPrice (Interp)", currentPrice);
    
    // Calculate fresh expiration elements inside placeTrade based on exact execution instant
    // to prevent any clock drift, component queue latency, or background tab throttling.
    const freshNow = new Date();
    const freshNowMs = freshNow.getTime();
    const entryTime = freshNowMs / 1000;

    const availableExps = getNextAvailableExpirations(freshNow);
    const freshDefaultExpiration = availableExps[0];
    
    const freshExpirationDate = targetExpiration && targetExpiration.getTime() > freshNowMs 
        ? targetExpiration 
        : freshDefaultExpiration;
        
    const exactExpirationTime = is5STActive ? (freshNowMs + 5000) : freshExpirationDate.getTime();
    const tradeDurationSeconds = is5STActive ? 5 : Math.max(5, Math.floor((exactExpirationTime - freshNowMs) / 1000));

    // Restriction: Cannot take more than one 5-second trade simultaneously
    if (tradeDurationSeconds === 5) {
      const active5sCount = activeTradesRef.current.filter(t => (t.timeLeft === 5 || (t.status === 'open' && t['duration'] === 5)) && t.status === 'open').length;
      if (active5sCount > 0) {
        toast.error("You already have an active 5-second trade. Please wait for it to complete.");
        return;
      }
    }

    const newTradeId = Math.random().toString(36).substring(2, 12);
    
    const currentAssetPayout = parseFloat(String(markets[activeAsset]?.payout || 80));
    const newTrade: Trade = {
      id: newTradeId,
      type,
      entryPrice: currentPrice,
      amount: tradeAmountInBase, // Store in base currency for consistent balance logic
      timeLeft: tradeDurationSeconds,
      expirationTime: exactExpirationTime,
      entryTime,
      asset: activeAsset,
      payout: currentAssetPayout,
      payoutRate: currentAssetPayout,
      accountType: accountType,
      ...(accountType === 'tournament' ? { tournamentId: activeTournamentId || 't1' } : {}),
      createdAt: Date.now()
    };

    const newActiveTrades = [...activeTradesRef.current, newTrade];
    activeTradesRef.current = newActiveTrades; 
    setActiveTrades(newActiveTrades);

    updateBalance(-tradeAmountInBase);
    
    if (auth.currentUser) {
      try {
        const response = await fetch('/api/trade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pair: activeAsset,
            amount: tradeAmountInBase,
            direction: type,
            accountType,
            userId: auth.currentUser.uid,
            tournamentId: accountType === 'tournament' ? activeTournamentId : null,
            payout: currentAssetPayout,
            payoutRate: currentAssetPayout,
            trade: {
              ...newTrade,
              payout: currentAssetPayout,
              payoutRate: currentAssetPayout,
              userEmail: auth.currentUser.email || '',
              userName: auth.currentUser.displayName || 'Trader'
            }
          })
        });

        if (!response.ok) {
          let reqError = "Server trade failed";
          try {
            const text = await response.text();
            try {
              const errorData = JSON.parse(text);
              reqError = errorData.error || errorData.message || reqError;
              
              // If user not found, try to sync and retry once
              if (reqError.includes("User not found") || reqError.includes("not initialized")) {
                console.log("User missing on server, attempting emergency sync...");
                await fetch('/api/user/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    uid: auth.currentUser.uid, 
                    email: auth.currentUser.email, 
                    displayName: auth.currentUser.displayName 
                  })
                });
                // No recursive retry to avoid infinite loops, but the next trade will work
                reqError = "Account was not initialized. We have synced your account. Please try placing the trade again.";
              }
            } catch {
              reqError = text || reqError;
            }
          } catch {}
          throw new Error(reqError);
        }

        const resData = await response.json().catch(() => ({}));

        // Update the optimistic trade with the real ID from the server
        if (resData.trade && resData.trade.id) {
          const serverId = String(resData.trade.id);
          newTrade.id = serverId;
          (newTrade as any).firebaseId = newTradeId;
          (newTrade as any).firebase_id = newTradeId;

          const updatedTrades = activeTradesRef.current.map(t => 
            (String(t.id) === String(newTradeId) || String(t.id) === serverId) 
              ? { ...t, id: serverId, firebaseId: newTradeId, firebase_id: newTradeId } 
              : t
          );
          const dedupMap = new Map<string, any>();
          updatedTrades.forEach(t => dedupMap.set(String(t.id), t));
          const finalTrades = Array.from(dedupMap.values());
          activeTradesRef.current = finalTrades;
          setActiveTrades(finalTrades);

          // Update userTrades array with server ID to avoid duplicate history items
          setUserTrades(prev => prev.map(t =>
            (String(t.id) === String(newTradeId) || String(t.id) === serverId || (t as any).firebaseId === newTradeId)
              ? { ...t, id: serverId, firebaseId: newTradeId, firebase_id: newTradeId }
              : t
          ));
        }

        // Apply authoritative balance from server response
        if (resData.user) {
          const rawReal = resData.user.balance ?? resData.user.realBalance;
          if (rawReal !== undefined) {
            const b = parseFloat(rawReal.toString());
            if (!isNaN(b)) {
              setRealBalance(b);
              realBalanceRef.current = b;
            }
          }
          if (resData.user.demoBalance !== undefined) {
            const db = parseFloat(resData.user.demoBalance.toString());
            if (!isNaN(db)) {
              setDemoBalance(db);
              demoBalanceRef.current = db;
            }
          }
        }
      } catch (err: any) {
        console.log("Trade placement rejected:", err.message);
        updateBalance(tradeAmountInBase); // Revert local balance update
        setActiveTrades(prev => prev.filter(t => String(t.id) !== String(newTradeId) && String(t.id) !== String(newTrade.id))); // Remove phantom trade
        setUserTrades(prev => prev.filter(t => String(t.id) !== String(newTradeId) && String(t.id) !== String(newTrade.id)));
        toast.error(err.message || "Failed to place trade on server. Verification failed.");
        return;
      }
    }
    
    // Only draw markers for current asset
    const relevantTrades = activeTradesRef.current.filter(
      (t) => t.asset === activeAsset,
    );

    // Add horizontal entry line explicitly mirroring the user's screenshot
    // Handled by custom DOM overlay `active-trades-overlays` and sync loop
    
    setActiveTrades(activeTradesRef.current);
    
    // Also update userTrades locally so history tab reflects the new trade immediately
    setUserTrades(prev => {
      const exists = prev.find(t => 
        String(t.id) === String(newTrade.id) || 
        String(t.id) === String(newTradeId) ||
        ((t as any).firebaseId && String((t as any).firebaseId) === String(newTradeId))
      );
      if (exists) return prev;
      const combined = [{ ...newTrade, firebaseId: newTradeId, firebase_id: newTradeId, status: 'Open' }, ...prev];
      combined.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return combined.slice(0, 100);
    });
    } catch (error: any) {
       console.warn("Trade entry failed:", error.message);
       toast.error("Internal error. Please refresh.");
    } finally {
       isPlacingTradeRef.current = false;
       setIsPlacingTrade(false);
    }
  };

  const zoomIn = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const currentZoom = timeScale.getVisibleLogicalRange();
      if (currentZoom) {
        let zoomRange = (currentZoom.to - currentZoom.from) * 0.3;
        timeScale.setVisibleLogicalRange({
          from: currentZoom.from + zoomRange,
          to: currentZoom.to - zoomRange,
        });
      }
    }
  };

  const zoomOut = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const currentZoom = timeScale.getVisibleLogicalRange();
      if (currentZoom) {
        let zoomRange = (currentZoom.to - currentZoom.from) * 0.3;
        timeScale.setVisibleLogicalRange({
          from: currentZoom.from - zoomRange,
          to: currentZoom.to + zoomRange,
        });
      }
    }
  };

  // End of logic before render

  const renderTradingEnvironment = (idx: number) => {
    const isSecond = idx === 1;
    const containerRef = isSecond ? chartContainerRef2 : chartContainerRef;
    const chartInstance = isSecond ? chartRef2.current : chartRef.current;
    const seriesInstance = isSecond ? seriesRef2.current : seriesRef.current;

    return (
      <div key={`trade-env-${idx}`} className={`${isMultiChart && !isMobile ? 'flex-1 flex flex-row border-b border-white/5 last:border-0' : 'flex-1 flex flex-col md:flex-row h-full'} overflow-hidden relative min-h-0`}>
        <div className="flex-1 flex flex-col relative min-h-[300px] h-full min-w-0">
          <main className="flex-1 relative bg-[#1e1f25] overflow-hidden">
             {/* Tournament Info Bar */}
             <AnimatePresence>
                {accountType === 'tournament' && activeTournamentId && (
                  <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="absolute top-0 left-0 right-0 z-[100] h-11 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-between px-6 shadow-xl border-b border-white/10"
                  >
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <Trophy size={16} className="text-[#FFE24C] animate-pulse" />
                          <span className="text-white font-black text-[13px] tracking-tight uppercase">
                            {tournamentsData.find(t => t.id === activeTournamentId)?.title || "Tournament"}
                          </span>
                       </div>
                       <div className="h-4 w-[1px] bg-white/20"></div>
                       <div className="flex items-center gap-2">
                          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Time left:</span>
                          <span className="text-white font-bold text-[12px] tabular-nums">23:02:15</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col items-end">
                          <span className="text-white/60 text-[9px] font-black uppercase tracking-tighter leading-none mb-0.5">Your Rank</span>
                          <div className="flex items-center gap-1">
                             <span className="text-white font-black text-[15px] leading-none">#4</span>
                             <Icons.TrendingUp size={10} className="text-emerald-400" />
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-white/60 text-[9px] font-black uppercase tracking-tighter leading-none mb-0.5">Prize Fund</span>
                          <span className="text-[#FFE24C] font-black text-[15px] leading-none">$15,000</span>
                       </div>
                       <button 
                         onClick={() => toast.error("Tournaments are currently closed!")}
                         className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg transition-colors border border-white/10 relative group"
                       >
                          <Icons.Settings size={14} />
                          <div className="absolute -top-1 -right-1 bg-[#131417] rounded-full p-0.5 border border-white/10">
                             <Lock size={8} className="text-[#FFE24C]" fill="#FFE24C" />
                          </div>
                       </button>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>

             {/* Desktop Trade Result Notifications */}
             <div className="absolute top-4 right-4 z-[70] hidden md:flex flex-col gap-2 pointer-events-none">
               <AnimatePresence>
                 {tradeNotifications.map((notif, nIdx) => (
                   <motion.div
                     key={notif.id}
                     initial={{ opacity: 0, x: 50, scale: 0.9 }}
                     animate={{ opacity: 1, x: 0, scale: 1 }}
                     exit={{ opacity: 0, x: 20, scale: 0.8 }}
                     className="pointer-events-auto"
                   >
                     <div className={`flex items-center gap-2.5 h-[40px] min-w-[240px] pr-2 rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden transition-all duration-300 ${notif.status === 'won' ? 'bg-[#00C980]' : (notif.status === 'draw' ? 'bg-[#eeeeee]' : 'bg-[#222328] border border-rose-500/30')}`}>
                        <div className={`ml-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] font-black shrink-0 ${notif.status === 'won' ? 'bg-white text-[#00C980]' : (notif.status === 'draw' ? 'bg-[#111111] text-white' : 'bg-rose-500/20 text-rose-400')}`}>
                           {notif.count || 1}
                        </div>
                        
                        <div className="flex-1 flex items-center justify-between gap-4 overflow-hidden">
                           <span className={`text-[13px] font-black truncate ${notif.status === 'won' ? 'text-white' : (notif.status === 'draw' ? 'text-[#111111]' : 'text-white')}`}>
                              {notif.asset}
                           </span>
                           <span className={`text-[14px] font-black shrink-0 ${notif.status === 'won' ? 'text-white font-extrabold' : (notif.status === 'draw' ? 'text-[#111111]' : (notif.status === 'lost' ? 'text-rose-400 font-extrabold' : 'text-white'))}`}>
                              {notif.status === 'won' ? '+' : (notif.status === 'lost' ? '-' : '+')}{formatWithCurrency(notif.amount, userCurrency)}
                           </span>
                        </div>

                        <button 
                          onClick={() => setTradeNotifications(prev => prev.filter(p => p.id !== notif.id))}
                          className={`p-1 hover:opacity-100 opacity-80 transition-all ${notif.status === 'won' ? 'text-white' : (notif.status === 'draw' ? 'text-[#111111]' : 'text-white')}`}
                        >
                           <X size={18} strokeWidth={2.5} />
                        </button>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
          {/* Chart Container */}
            <div className="relative w-full h-full">
              <div ref={containerRef} className="absolute top-0 left-0 right-0 bottom-0 w-full" style={{ touchAction: "none" }} />
              
              {/* Binomo Style Custom Price Line Overlay */}
              <div className="absolute inset-0 pointer-events-none z-[50]">
                <svg className="w-full h-full overflow-visible">
                  {/* Left of current price: subtle dotted line */}
                  <line
                    id={`custom-price-line-left-${idx}`}
                    stroke="#606477"
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                    x1="0"
                    y1="-100"
                    x2="0"
                    y2="-100"
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                  {/* Right of current price: solid slate/blue line leading to axis */}
                  <line
                    id={`custom-price-line-right-${idx}`}
                    stroke="#787c94"
                    strokeWidth="1.2"
                    x1="0"
                    y1="-100"
                    x2="100%"
                    y2="-100"
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                  
                  {/* Custom Price Badge (Chevron pointed tag) */}
                  <g id={`custom-price-badge-group-${idx}`} style={{ display: 'none' }}>
                    <path
                      id={`custom-price-badge-bg-${idx}`}
                      fill="#52586b"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1"
                    />
                    <text
                      id={`custom-price-badge-text-${idx}`}
                      x="40"
                      y="11"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize="11px"
                      fontWeight="700"
                      fontFamily="JetBrains Mono, Menlo, monospace"
                      textAnchor="middle"
                    />
                  </g>
                </svg>
              </div>
              
              {/* Chart Loading Overlay */}
              <AnimatePresence>
                {chartLoading && !isSecond && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[160] bg-[#131417] flex flex-col items-center justify-center gap-4"
                  >
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFE24C]"></div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Scroll to Real-time Button */}
              <AnimatePresence>
                {isScrolledBack && !isSecond && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    onClick={() => alignChartRightByIdx(0, 0, 0)}
                    className="absolute right-4 bottom-32 z-[150] w-11 h-11 bg-[#202126] hover:bg-[#2a2b30] text-[#FFE24C] rounded-xl flex items-center justify-center shadow-2xl border border-white/5 active:scale-95 transition-all group"
                  >
                    <Icons.ChevronsRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                )}
              </AnimatePresence>
              {!isSecond && (
                <DrawingOverlay 
                  chart={chartRef.current} 
                  series={seriesRef.current}
                  drawings={drawings} 
                  setDrawings={setDrawings} 
                  selectedTool={selectedTool} 
                  setSelectedTool={setSelectedTool}
                  containerRef={chartContainerRef}
                  activeAsset={activeAsset}
                  data={baseDataRef.current}
                />
              )}
              
              {/* Indicator Legend Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap max-w-[60%] gap-1.5 pointer-events-none select-none">
                {Object.entries(indicatorSettings || {})
                  .filter(([_, settings]) => (settings as any)?.enabled)
                  .map(([name, settings]) => (
                    <div key={name} className="flex items-center gap-2 bg-[#1a1b1f]/60 backdrop-blur-md pl-3 pr-2 py-1.5 rounded-lg border border-white/5 shadow-2xl pointer-events-auto group">
                      <div 
                        className="w-1.5 h-1.5 rounded-full shrink-0" 
                        style={{ backgroundColor: (settings as any).color || '#fff' }}
                      />
                      <span className="text-[10px] font-bold text-gray-200 tracking-wider uppercase truncate">{name}</span>
                      <div className="flex gap-1.5 text-[10px] text-gray-400 font-mono">
                        {/* Show values if available, otherwise show period */}
                        {(() => {
                           const refName = name.toLowerCase();
                           const val = hoveredIndicatorValues[refName] || hoveredIndicatorValues[refName + "_loop"];
                           if (val !== undefined) return <span className="text-[#FFE24C] font-bold">{val.toFixed(2)}</span>;
                           
                           if (name === "MACD") {
                             const fast = hoveredIndicatorValues["macdFast"];
                             const slow = hoveredIndicatorValues["macdSlow"];
                             const hist = hoveredIndicatorValues["macdHist"];
                             if (fast !== undefined) return <span className="text-[#FFE24C] font-bold">{fast.toFixed(2)} / {slow?.toFixed(2)}</span>;
                           }
                           
                           if (name === "Bollinger Bands") {
                             const upper = hoveredIndicatorValues["bbUpper"];
                             const lower = hoveredIndicatorValues["bbLower"];
                             if (upper !== undefined) return <span className="text-[#FFE24C] font-bold">{upper.toFixed(2)} / {lower?.toFixed(2)}</span>;
                           }

                           if (name === "RSI") {
                             const rsi = hoveredIndicatorValues["rsi"];
                             if (rsi !== undefined) return <span className="text-[#FFE24C] font-bold">{rsi.toFixed(2)}</span>;
                           }

                           return (
                             <>
                               {(settings as any).period && <span>P:{(settings as any).period}</span>}
                               {(settings as any).fastPeriod && <span>F:{(settings as any).fastPeriod}</span>}
                             </>
                           );
                        })()}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleIndicator(name); }}
                        className="ml-1 p-0.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors cursor-pointer shrink-0 opacity-80 hover:opacity-100"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                
                {Object.values(indicatorSettings).some((s: any) => s.enabled) && (
                  <button 
                    onClick={() => {
                      setIndicatorSettings((prev: any) => {
                        const next = { ...prev };
                        Object.keys(next).forEach(key => {
                          if (next[key]) next[key].enabled = false;
                        });
                        return next;
                      });
                      setActiveStrategy(null);
                      toast.success("All indicators cleared");
                    }}
                    className="flex items-center gap-1 bg-[#1a1b1f]/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all pointer-events-auto text-[10px] font-black uppercase tracking-tighter shadow-2xl"
                  >
                     Clear All
                  </button>
                )}
              </div>
              {markets[activeAsset]?.isFrozen && (
                <div className="absolute inset-x-4 top-[80px] md:top-6 z-30 pointer-events-none md:max-w-md md:left-1/2 md:-translate-x-1/2 transition-all">
                  <div className="bg-[#111317]/90 backdrop-blur-md rounded-2xl border border-sky-500/30 p-4 shadow-2xl flex items-start gap-3.5 pointer-events-auto">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0 animate-pulse">
                      <Snowflake size={20} className="drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-black text-sky-200 tracking-wider uppercase leading-none mb-1.5 flex items-center gap-1.5">
                        {markets[activeAsset]?.freezeReason === 'maintenance' ? 'Scheduled Maintenance' : 'Volatility Halt'}
                      </span>
                      <p className="text-gray-300 text-[11.5px] leading-relaxed">
                        {markets[activeAsset]?.freezeReason === 'maintenance' 
                          ? `Trading is frozen for ${activeAsset} due to routine system upgrades. Order entry will resume shortly.`
                          : `Trading is temporarily suspended for ${activeAsset} due to extreme price volatility. Restoring market stability.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {isClosed && (
                <div className="absolute inset-x-4 top-[80px] md:top-6 z-30 pointer-events-none md:max-w-md md:left-1/2 md:-translate-x-1/2 transition-all">
                  <div className="bg-[#111317]/90 backdrop-blur-md rounded-2xl border border-yellow-500/30 p-4 shadow-2xl flex items-start gap-3.5 pointer-events-auto">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                      <Clock size={20} className="drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-black text-yellow-200 tracking-wider uppercase leading-none mb-1.5 flex items-center gap-1.5">
                        Market Closed
                      </span>
                      <p className="text-gray-300 text-[11.5px] leading-relaxed">
                        Trading is closed for {activeAsset} during the weekend. Real-world markets will resume trading on Sunday at 22:00 UTC.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Removed chart loading overlay as requested */}
            </div>


          
          {/* Professional Rotating Loader Overlay */}
          {(!contentReady || isLoading) && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#131417]">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFE24C]"></div>
            </div>
          )}
          
          {/* Mobile Floating Asset Selector (Top Left) */}
          <div className="md:hidden absolute top-4 left-4 z-20">
             <button 
               onClick={() => setActiveTab("assets")}
               className="bg-[#1a1b1f]/80 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-2.5 px-3 py-2 shadow-2xl active:scale-95 transition-all"
             >
               <ChevronLeft size={16} className="text-gray-400" />
               <div className="flex items-center gap-2.5">
                 <AssetLogo name={activeAsset} />
                 <div className="flex items-center gap-1.5">
                   <span className="font-bold text-[13px] tracking-tight text-white uppercase">{activeAsset}</span>
                   <span className="text-gray-400 text-[13px] font-bold">{markets[activeAsset]?.payout || 83}%</span>
                   {is5STActive && (
                     <span className="text-[9px] font-black text-black bg-[#FFE24C] px-1.5 py-0.2 rounded uppercase tracking-wider">
                       5ST
                     </span>
                   )}
                 </div>
               </div>
             </button>
          </div>

          {/* Purchase Line Overlay - Professional Binomo-style White Line */}
          {purchaseLineX !== null && purchaseLineX > -50 && purchaseLineX < (containerRef.current?.clientWidth || 2000) + 50 && (
            <div 
                className="absolute top-0 bottom-[26px] flex flex-col items-center pointer-events-none z-[40]"
                style={{ left: `${purchaseLineX}px` }}
            >
                {/* Timer Circle - Refined to match screenshot */}
                <div className="absolute top-[60px] -translate-x-1/2 left-0 flex flex-col items-center z-50">
                  <div className="w-[36px] h-[36px] rounded-full border border-white/20 bg-[#1e1f26]/80 text-white/90 flex items-center justify-center text-[11px] font-medium shadow-md">
                    {formatTimeToPurchase(timeToPurchase)}
                  </div>
                </div>
            
                {/* Vertical Text - Subdued, non-uppercase style */}
                <div className="absolute top-[105px] left-[15px] whitespace-nowrap rotate-90 text-[11px] font-medium text-white/50 tracking-tight origin-top-left">
                   {t('timeRemaining')}
                </div>

                {/* The Vertical Purchase Line */}
                <div className="absolute top-[96px] bottom-0 w-[0.5px] bg-[#ff5252]/40"></div>
            </div>
          )}

          {/* Expiration Line Overlay - Professional Results-Line */}
          {expirationLineX !== null && expirationLineX > -50 && expirationLineX < (containerRef.current?.clientWidth || 2000) + 50 && (
            <div 
                className="absolute top-0 bottom-[26px] flex flex-col items-center pointer-events-none z-[30]"
                style={{ left: `${expirationLineX}px` }}
            >
                {/* Expiration Head Indicator */}
                <div className="absolute top-[60px] -translate-x-1/2 left-0 z-50">
                   <div className="w-[36px] h-[36px] rounded-full bg-[#ff5252]/10 border-[1.5px] border-[#ff5252]/50 border-dashed backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,82,82,0.15)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                         <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                   </div>
                </div>
            
                {/* The Vertical Expiration Line - Refined dashed red line */}
                <div className="absolute top-[96px] bottom-0 w-0 border-l border-dotted border-[#ff5252]/20"></div>
            </div>
          )}


          {/* Active Trades Overlays */}
          <div id={`active-trades-overlays-${idx}`} className="absolute inset-0 pointer-events-none z-[35]">
               {visibleActiveTrades.filter(t => t.asset === activeAsset).map((trade, tIdx) => {
                  const tColor = trade.type === 'up' ? '#00C980' : '#FF5252';
                  return (
                  <div 
                    key={`active-trade-over-${idx}-${activeAsset}-${trade.id || 'no-id'}`}
                    id={`trade-overlay-${idx}-${trade.id}`}
                    className="absolute left-0 top-0 h-0"
                    style={{ transform: 'translate(-1000px, -1000px)', display: 'none' }}
                  >
                          <div className="absolute left-0 w-full flex items-center" style={{ transform: 'translateY(-50%)' }}>
                              {/* Label Tag, positioned to the left of the dot marker */}
                              <div className="trade-tag absolute left-[-115px] flex items-center drop-shadow-xl scale-[0.85] md:scale-100 origin-left transition-all z-20">
                                  {/* Direction Block */}
                                  <div className={`flex items-center justify-center w-[20px] h-[24px] rounded-[2px] ${trade.type === 'up' ? 'bg-[#00C980]' : 'bg-[#FF5252]'} relative z-10`}>
                                      {trade.type === 'up' ? <TrendingUp size={12} color="white" strokeWidth={3} /> : <TrendingDown size={12} color="white" strokeWidth={3} />}
                                  </div>
                                  {/* Amount Block */}
                                  <div className="flex items-center justify-center pl-2 pr-1 h-[24px] text-[12px] font-black bg-[#FCD535] text-[#111111] whitespace-nowrap relative z-10 ml-[-2px]">
                                    {formatWithCurrency(trade.amount, userCurrency)}
                                 </div>
                                 {/* Pointed Tip */}
                                 <div className="w-[8px] h-[24px] bg-[#FCD535] relative z-10" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
                                 {/* Connecting Line to Dot */}
                                 <div className="absolute right-[-10px] top-[11px] w-[10px] h-[2px] bg-[#FCD535]"></div>
                              </div>
                              
                              {/* Circle Dot Marker (This is the anchor at xBase) */}
                              <div className="trade-dot absolute left-[-5px] w-[10px] h-[10px] rounded-full z-20 shadow-[0_0_8px_rgba(0,0,0,0.5)] bg-[#FCD535] transition-all duration-300"></div>
                          </div>
                          
                          {/* Horizontal line stretching toward deadline */}
                          <div className="trade-line absolute left-[0px] h-0 z-10 transition-all duration-300" style={{ width: '100%', borderBottom: `2px dotted #FCD535` }}></div>

                          {/* Directional Arrow at line end */}
                          <div className="trade-arrow absolute right-[-5px] w-[10px] h-[10px] z-[15] flex items-center justify-center transition-all duration-300">
                              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]" style={{ borderTopColor: '#FCD535', transform: trade.type === 'up' ? 'scaleY(-1)' : 'scaleY(1)' }}></div>
                          </div>
                      </div>
               )})}
          </div>



          {/* Chart Floating Tools - Professional Screenshot-Matched UI */}
          <div className="absolute bottom-[35px] md:bottom-[35px] left-[10px] md:left-5 right-[10px] md:right-5 flex items-center justify-between z-30 pointer-events-none">
              
              {/* Desktop: Support Button & Chart Controls Row */}
              <div className="hidden md:flex items-center gap-4 pointer-events-auto">

                  {/* Row of individual chart tool buttons - Individual Squircles */}
                  <div className="flex items-center gap-[6px]">
                      {/* Timeframe Button */}
                      <button 
                          onClick={() => {
                              if (showTimeframeModal) setShowTimeframeModal(false);
                              else { setShowTimeframeModal(true); setShowChartTypeModal(false); setShowIndicatorsModal(false); setShowSignalsModal(false); }
                          }} 
                          className={`w-[38px] h-[38px] flex items-center justify-center transition-all rounded-[12px] ${showTimeframeModal ? 'bg-[#3b3c43] text-white shadow-lg' : 'bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]'}`}
                      >
                          <span className="text-[11px] font-black uppercase tracking-tighter">{formatTimeframeShort(timeframe)}</span>
                      </button>

                      {/* Chevrons Button */}
                      <button 
                          onClick={() => alignChartRightByIdx(0, 0, 0)}
                          className="w-[38px] h-[38px] flex items-center justify-center transition-all rounded-[12px] bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]"
                      >
                          <Icons.ChevronsRight size={19} strokeWidth={1.8} />
                      </button>

                      {/* Chart Type Button (Candle) */}
                      <button 
                          onClick={() => {
                              if (showChartTypeModal) setShowChartTypeModal(false);
                              else { setShowChartTypeModal(true); setShowTimeframeModal(false); setShowIndicatorsModal(false); setShowSignalsModal(false); }
                          }} 
                          className={`w-[40px] h-[40px] flex items-center justify-center transition-all rounded-[12px] ${showChartTypeModal ? 'bg-[#3b3c43] text-white shadow-lg' : 'bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]'}`}
                      >
                          {React.createElement(chartTypeOptions.find(o => o.id === chartType)?.Icon || Icons.SlidersVertical, { size: 19, strokeWidth: 1.8 })}
                      </button>

                      {/* Indicators Button (Compass) */}
                      <button 
                          onClick={() => {
                              if (showIndicatorsModal) setShowIndicatorsModal(false);
                              else { setShowIndicatorsModal(true); setShowTimeframeModal(false); setShowChartTypeModal(false); setShowSignalsModal(false); }
                          }} 
                          className={`w-[40px] h-[40px] flex items-center justify-center transition-all rounded-[12px] ${showIndicatorsModal ? 'bg-[#3b3c43] text-white shadow-lg' : 'bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]'}`}
                      >
                          <Icons.DraftingCompass size={19} strokeWidth={1.8} />
                      </button>

                      {/* Drawing Tools (Pencil) */}
                      <button 
                          className="w-[38px] h-[38px] flex items-center justify-center transition-all rounded-[12px] bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]"
                      >
                          <Icons.Pencil size={19} strokeWidth={1.8} />
                      </button>

                      {/* Signals Button (Sense/Radio) */}
                      <button 
                          onClick={() => {
                              setShowSignalsModal(!showSignalsModal);
                              setShowTimeframeModal(false); setShowChartTypeModal(false); setShowIndicatorsModal(false);
                          }} 
                          className={`w-[38px] h-[38px] flex items-center justify-center transition-all rounded-[12px] ${showSignalsModal ? 'bg-[#3b3c43] text-white shadow-lg' : 'bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]'}`}
                      >
                          <Icons.Radio size={19} strokeWidth={1.8} />
                      </button>

                      {/* Layers Button */}
                      <button 
                          onClick={() => setIsMultiChart(!isMultiChart)}
                          className={`w-[38px] h-[38px] flex items-center justify-center transition-all rounded-[12px] ${isMultiChart ? 'bg-[#3b3c43] text-white shadow-lg' : 'bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]'}`}
                      >
                          {isSecond ? <Icons.X size={19} strokeWidth={2.5} /> : (isMultiChart ? <Icons.LayoutGrid size={19} strokeWidth={1.8} className="text-[#ffe24c]" /> : <Icons.LayoutGrid size={19} strokeWidth={1.8} />)}
                      </button>
                  </div>
              </div>

              {/* Mobile: Chart Controls matching screenshot */}
              <div className="md:hidden flex items-center gap-2 pointer-events-auto w-full">
                  <div className="flex items-center gap-[4px]">
                      <button 
                          onClick={() => {
                              if (showTimeframeModal) setShowTimeframeModal(false);
                              else { setShowTimeframeModal(true); setShowChartTypeModal(false); setShowIndicatorsModal(false); setShowSignalsModal(false); }
                          }} 
                          className={`w-[40px] h-[40px] flex items-center justify-center transition-all rounded-[10px] ${showTimeframeModal ? 'bg-[#3b3c43] text-white' : 'bg-[#25262b] text-[#9ea0a5] active:bg-[#323339]'}`}
                      >
                          <span className="text-[13px] font-black uppercase tracking-tighter">{formatTimeframeShort(timeframe)}</span>
                      </button>

                      <button 
                          onClick={() => {
                              if (showChartTypeModal) setShowChartTypeModal(false);
                              else { setShowChartTypeModal(true); setShowTimeframeModal(false); setShowIndicatorsModal(false); setShowSignalsModal(false); }
                          }} 
                          className={`w-[40px] h-[40px] flex items-center justify-center transition-all rounded-[10px] ${showChartTypeModal ? 'bg-[#3b3c43] text-white' : 'bg-[#25262b] text-[#9ea0a5] active:bg-[#323339]'}`}
                      >
                          {React.createElement(chartTypeOptions.find(o => o.id === chartType)?.Icon || Icons.SlidersVertical, { size: 20, strokeWidth: 1.8 })}
                      </button>

                      <button 
                          onClick={() => {
                              if (showIndicatorsModal) setShowIndicatorsModal(false);
                              else { setShowIndicatorsModal(true); setShowTimeframeModal(false); setShowChartTypeModal(false); setShowSignalsModal(false); }
                          }} 
                          className={`w-[40px] h-[40px] flex items-center justify-center transition-all rounded-[12px] ${showIndicatorsModal ? 'bg-[#3b3c43] text-white shadow-lg' : 'bg-[#27282e] text-[#8e8f93] hover:text-white hover:bg-[#323339]'}`}
                      >
                          <Icons.DraftingCompass size={20} strokeWidth={1.8} />
                      </button>

                      <button 
                          onClick={() => {
                              setShowSignalsModal(!showSignalsModal);
                              setShowTimeframeModal(false); setShowChartTypeModal(false); setShowIndicatorsModal(false);
                          }} 
                          className={`w-[40px] h-[40px] flex items-center justify-center transition-all rounded-[10px] ${showSignalsModal ? 'bg-[#3b3c43] text-white' : 'bg-[#25262b] text-[#9ea0a5] active:bg-[#323339]'}`}
                      >
                          <Icons.Radio size={20} strokeWidth={1.8} />
                      </button>
                  </div>

                  {/* Zoom Controls (Mobile) */}
                  <div className="flex items-center border border-[#3b3c43] rounded-[8px] bg-transparent ml-2 overflow-hidden">
                      <button 
                          onClick={(e) => { e.stopPropagation(); zoomOut(); }} 
                          className="w-[30px] h-[26px] flex items-center justify-center border-r border-[#3b3c43] text-[#9ea0a5] active:bg-white/5 transition-colors"
                      >
                          <Minus size={14} strokeWidth={1.2} />
                      </button>
                      <button 
                          onClick={(e) => { e.stopPropagation(); zoomIn(); }} 
                          className="w-[30px] h-[26px] flex items-center justify-center text-[#9ea0a5] active:bg-white/5 transition-colors"
                      >
                          <Plus size={14} strokeWidth={1.2} />
                      </button>
                  </div>
              </div>

              {/* Right side: History/Calendar Button - Yellow Circular */}
              {!isSecond && (
                <div className="hidden md:block pointer-events-auto">
                    <button 
                        onClick={() => setShowBottomHistory(!showBottomHistory)}
                        className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_25px_rgba(255,226,76,0.3)] hover:scale-110 active:scale-90 ${showBottomHistory ? 'bg-[#ffe24c] text-black ring-2 ring-white/20' : 'bg-[#ffe24c] text-black'}`}
                    >
                        <Icons.Calendar size={22} strokeWidth={2.5} />
                    </button>
                </div>
              )}
          </div>

          {/* Bottom History Table (Overlay) */}
          <div 
             className={`absolute left-0 right-0 bottom-0 bg-[#1a1b1f] border-t border-white/5 transition-all duration-500 ease-in-out z-[100] ${showBottomHistory ? 'h-[320px]' : 'h-0 overflow-hidden'}`}
          >
             <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex gap-4">
                   <button 
                      onClick={() => setBottomTab('active')}
                      className={`text-[13px] font-black uppercase tracking-widest ${bottomTab === 'active' ? 'text-white border-b-2 border-yellow-500 pb-1' : 'text-gray-500 hover:text-gray-300'}`}
                   >
                      Active Trades
                   </button>
                   <button 
                      onClick={() => setBottomTab('history')}
                      className={`text-[13px] font-black uppercase tracking-widest ${bottomTab === 'history' ? 'text-white border-b-2 border-yellow-500 pb-1' : 'text-gray-500 hover:text-gray-300'}`}
                   >
                      History
                   </button>
                </div>
                <button onClick={() => setShowBottomHistory(false)} className="text-gray-500 hover:text-white transition-colors">
                   <X size={20} />
                </button>
             </div>
             
             {showBottomHistory && (
               <div className="overflow-y-auto h-[calc(320px-60px)] p-0 custom-scrollbar">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                           <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Asset</th>
                           <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                           <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Open</th>
                           <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Close</th>
                           <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Outcome</th>
                           <th className="px-6 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Time</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {(bottomTab === 'active' ? visibleActiveTrades : visibleUserTrades.filter(t => t.status !== 'open')).length === 0 ? (
                           <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic text-[14px]">No trades to display</td>
                           </tr>
                        ) : (
                          (bottomTab === 'active' ? visibleActiveTrades : visibleUserTrades.filter(t => t.status !== 'open')).map((trade, tIdx) => (
                             <tr key={`history-tr-bottom-${idx}-${trade.id || 'no-id'}-${tIdx}`} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                      <AssetLogo name={trade.asset} />
                                      <span className="font-bold text-white text-[14px]">{trade.asset}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">{formatWithCurrency(trade.amount, userCurrency)}</td>
                                <td className="px-6 py-4 font-mono text-[13px] text-gray-300">{trade.entryPrice?.toFixed(5) || '---'}</td>
                                <td className="px-6 py-4 font-mono text-[13px] text-gray-300">{trade.exitPrice?.toFixed(5) || (trade.status === 'open' ? <span className="animate-pulse">Live...</span> : '---')}</td>
                                <td className="px-6 py-4">
                                   {trade.status === 'open' ? (
                                      <div className="flex items-center gap-2 px-2.5 py-1 bg-[#ffe24c]/10 border border-[#ffe24c]/30 rounded-full w-fit">
                                         <Clock size={12} className="text-[#ffe24c] animate-pulse" />
                                         <span className="text-[#ffe24c] font-mono text-[12px] font-black tracking-wider">
                                            {(() => {
                                              const currentMs = nowMs || Date.now();
                                              const expMs = trade.expirationTime || (trade.expiryTime ? (trade.expiryTime < 10000000000 ? trade.expiryTime * 1000 : trade.expiryTime) : null);
                                              let sec = 0;
                                              if (expMs && typeof expMs === 'number') {
                                                sec = Math.max(0, Math.ceil((expMs - currentMs) / 1000));
                                              } else if (typeof trade.timeLeft === 'number') {
                                                sec = Math.max(0, trade.timeLeft);
                                              }
                                              const m = Math.floor(sec / 60);
                                              const s = sec % 60;
                                              return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                                            })()}
                                         </span>
                                      </div>
                                   ) : (
                                      <div className={`text-[12px] font-black uppercase tracking-wider ${trade.status === 'won' ? 'text-[#00C980]' : 'text-red-500'}`}>
                                         {trade.status === 'won' ? (
                                            <span className="flex items-center gap-1.5">
                                               <Check size={14} strokeWidth={3} /> WIN
                                            </span>
                                         ) : (
                                            <span className="flex items-center gap-1.5">
                                               <X size={14} strokeWidth={3} /> LOSS
                                            </span>
                                         )}
                                      </div>
                                   )}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-[12px] font-medium">
                                   {new Date(trade.createdAt).toLocaleTimeString(undefined, { timeZone })}
                                </td>
                             </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
             )}
          </div>
        </main>
      </div>

      {/* DESKTOP TRADING PANEL - Screenshot Matched */}
      <aside className="hidden md:flex w-[260px] bg-[#1a1b1f] border-l border-white/5 flex-col shrink-0 z-30 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col p-3 md:p-4 gap-2.5 md:gap-4 my-auto min-h-max w-full">
          
          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="bg-[#2d2f36] rounded-[14px] p-1 flex flex-col items-center justify-center relative group border border-white/5 hover:border-white/10 transition-all shadow-inner h-[60px]">
              <span className="text-[12px] text-gray-500 font-bold mb-0.5">{t('amount')}</span>
              <div className="flex items-center justify-between w-full px-1">
                <button 
                  onClick={() => setAmount(Math.max(minConvertedAmount, amount - (['USD', 'USDT', 'EUR', 'GBP'].includes(userCurrency) ? 1 : (userCurrency === 'BDT' ? 50 : 10))))} 
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90"
                >
                  <Minus size={20} strokeWidth={3} />
                </button>
                
                <div className="flex items-center gap-0.5">
                  <span className="text-white font-bold text-[22px] tracking-tight">{getCurrencySymbol(userCurrency)}</span>
                  <input 
                    type="number" 
                    value={amount || ''} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') { setAmount(0); return; }
                      const num = Number(val);
                      if (!isNaN(num) && num >= 0) setAmount(num);
                    }}
                    onBlur={() => setAmount(Math.max(minConvertedAmount, amount))}
                    className="bg-transparent border-none outline-none text-center w-20 p-0 text-white font-bold text-[22px] tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <button 
                  onClick={() => setAmount(amount + (['USD', 'USDT', 'EUR', 'GBP'].includes(userCurrency) ? 1 : (userCurrency === 'BDT' ? 50 : 10)))} 
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* Time Input */}
          {is5STActive ? (
            <div className="flex flex-col gap-2">
              <div className="bg-[#2d2f36]/40 rounded-[14px] p-2.5 flex flex-col items-center justify-center relative border border-[#FFE24C]/20 shadow-inner h-[60px]">
                <span className="text-[11px] text-[#FFE24C] font-black uppercase tracking-widest mb-1 select-none animate-pulse">5ST Turbo Mode</span>
                <span className="text-[#a6aeb9] font-medium text-[13px] select-none text-center leading-none">5 sec expiration only</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div onClick={() => setShowTimePicker(true)} className="bg-[#2d2f36] rounded-[14px] p-1 flex flex-col items-center justify-center relative group border border-white/5 hover:border-white/10 transition-all shadow-inner h-[60px] cursor-pointer">
                <span className="text-[12px] text-gray-500 font-bold mb-0.5">{t('time')}</span>
                <div className="flex items-center justify-between w-full px-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); decreaseTime(); }} 
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90"
                  >
                    {isPlacingTrade ? <Icons.Loader size={20} className="animate-spin" /> : <Minus size={20} strokeWidth={3} />}
                  </button>
                  
                  <span className="text-white font-bold text-[22px] tracking-tight">{expirationString}</span>

                  <button 
                    onClick={(e) => { e.stopPropagation(); increaseTime(); }} 
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90"
                  >
                    {isPlacingTrade ? <Icons.Loader size={20} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Info */}
          <div className="flex items-center justify-between py-1 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[#8e9297] text-[15px] font-medium">{t('earnings')}</span>
              <span className="text-[#00c980] text-[15px] font-bold">+{markets[activeAsset]?.payout || 80}%</span>
            </div>
            <div className="text-white font-bold text-[18px] tracking-tight">
              <span>{getCurrencySymbol(userCurrency)}</span>
              <span>{(amount * (1 + (markets[activeAsset]?.payout || 80) / 100)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>

          {/* Majority Opinion Section */}
          <div className="flex flex-col gap-3 py-1 px-1">
            <span className="text-[#8e9297] text-[15px] font-medium">{t('majorityOpinion')}</span>
            <div className="flex flex-col gap-2">
              {(() => {
                const market = markets[activeAsset];
                const totalUp = market?.totalUp || 0;
                const totalDown = market?.totalDown || 0;
                const total = totalUp + totalDown;
                let upPercent = 50;
                if (total > 0) {
                  upPercent = Math.round((totalUp / total) * 100);
                } else {
                  const timeSec = Math.floor(Date.now() / 6000);
                  const assetHash = activeAsset.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const slowWave = Math.sin((timeSec + assetHash) / 5) * 6;
                  
                  upPercent = Math.round(52 + slowWave);
                  if (upPercent > 68) upPercent = 68;
                  if (upPercent < 32) upPercent = 32;
                }
                const downPercent = 100 - upPercent;
                return (
                  <>
                    <div className="h-[6px] w-full bg-[#f45c5c] rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-[#00c980] transition-all duration-1000" 
                        style={{ width: `${upPercent}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center px-0.5">
                      <span className="text-[#00c980] text-[15px] font-bold">{upPercent}%</span>
                      <span className="text-[#f45c5c] text-[15px] font-bold">{downPercent}%</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Action Buttons - Side by Side */}
          <div className="flex gap-4 mt-2">
            <motion.button 
              whileHover={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? {} : { scale: 1.05 }}
              whileTap={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? {} : { scale: 0.95 }}
              onClick={() => !markets[activeAsset]?.isFrozen && !isPlacingTrade && !isClosed && placeTrade("up")}
              disabled={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed}
              className={`flex-1 h-[60px] rounded-[16px] flex items-center justify-center transition-all relative shadow-lg ${
                markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed
                  ? 'bg-gray-700/50 cursor-not-allowed grayscale' 
                  : 'bg-[#00c980] hover:bg-[#00d98a] active:shadow-inner'
              }`}
            >
              {isClosed ? (
                <div className="flex flex-col items-center gap-1 grayscale opacity-50">
                  <Clock size={24} className="text-white" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Closed</span>
                </div>
              ) : isPlacingTrade ? (
                <Icons.Loader className="animate-spin text-white" size={32} />
              ) : (
                <ArrowUp size={32} strokeWidth={3} className="text-white" />
              )}
            </motion.button>
            
            <motion.button 
              whileHover={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? {} : { scale: 1.05 }}
              whileTap={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? {} : { scale: 0.95 }}
              onClick={() => !markets[activeAsset]?.isFrozen && !isPlacingTrade && !isClosed && placeTrade("down")}
              disabled={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed}
              className={`flex-1 h-[60px] rounded-[16px] flex items-center justify-center transition-all relative shadow-lg ${
                markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed
                  ? 'bg-gray-700/50 cursor-not-allowed grayscale' 
                  : 'bg-[#f45c5c] hover:bg-[#ff6d6d] active:shadow-inner'
              }`}
            >
              {isClosed ? (
                <div className="flex flex-col items-center gap-1 grayscale opacity-50">
                  <Clock size={24} className="text-white" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Closed</span>
                </div>
              ) : isPlacingTrade ? (
                <Icons.Loader className="animate-spin text-white" size={32} />
              ) : (
                <ArrowDown size={32} strokeWidth={3} className="text-white" />
              )}
            </motion.button>
          </div>

        </div>
      </aside>
    </div>
    );
  };

  return (
    <>
      <SEO title="Trade Dashboard" description="Trade global markets on Bivaax with professional tools and real-time data." />


      <div className="h-[100dvh] bg-[#131313] text-white flex flex-col md:flex-row font-sans select-none overflow-hidden">
      {/* DESKTOP SIDEBAR (Left) */}
      <aside className="hidden md:flex w-[68px] bg-[#1f2026] flex-col border-r border-[#2C2D33] shrink-0 z-50">
        <div className="flex flex-col items-center py-5 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setShowSidebar(!showSidebar)}>
            <Menu size={24} className="text-[#a6aeb9] hover:text-white transition-colors" strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 flex flex-col py-6 gap-[28px] px-0 overflow-y-auto scrollbar-hide items-center">
          {[
            { icon: Icons.LayoutGrid, label: t('activities'), tab: "activities" },
            { icon: Clock, label: t('history'), tab: "history" },
            { icon: Icons.ShoppingBag, label: t('market'), tab: "market" },
            { icon: Icons.Users, label: t('copy'), tab: "copytrading" },
            { icon: Icons.Trophy, label: t('tournaments'), tab: "tournaments", locked: true },
          ].map((item, idx) => {
            const isActive = activeTab === item.tab || (item.tab === 'history' && activeTab === 'trade');
            return (
            <button
              key={`desktop-sidebar-${idx}`}
              onClick={() => {
                if ('locked' in item && item.locked) {
                  toast.error("Tournaments are currently closed!");
                  return;
                }
                if ('onClick' in item && typeof item.onClick === 'function') {
                  item.onClick();
                } else if ('tab' in item) {
                  setActiveTab(item.tab);
                }
              }}
              className={`w-full flex flex-col items-center justify-center group relative py-1 transition-all duration-300 ${isActive ? "text-[#ffe24c]" : "text-[#7b8390] hover:text-white"}`}
            >
              {isActive && <div className="absolute left-0 w-[3px] h-full bg-[#ffe24c] rounded-r-full shadow-[0_0_10px_rgba(255,226,76,0.3)]" />}
              <div className="relative flex flex-col items-center">
                 <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} className="mb-2" />
                 {('locked' in item && item.locked) && (
                    <div className="absolute -top-1 -right-1 bg-[#1f2026] rounded-full p-0.5 border border-white/5 shadow-lg">
                       <Lock size={10} className="text-[#ffe24c]" fill="#ffe24c" />
                    </div>
                 )}
                 {('tab' in item) && (item.tab === 'history') && visibleActiveTrades.length > 0 && (
                    <div className="absolute -top-1.5 -right-2.5 bg-[#f44336] text-white text-[9px] font-black h-[16px] min-w-[16px] px-1 rounded-full flex items-center justify-center border border-[#1f2026] shadow-lg animate-pulse">
                      {visibleActiveTrades.length}
                    </div>
                 )}
                 <span className="text-[10px] tracking-tight text-center leading-tight font-bold uppercase">{item.label}</span>
              </div>
            </button>
          )})}
        </div>

        <div className="py-6 border-t border-white/5 flex flex-col items-center">
           <button 
             onClick={() => navigate("/support")}
             className="w-11 h-11 rounded-xl bg-[#f45c5c]/10 text-[#f45c5c] flex items-center justify-center hover:bg-[#f45c5c] hover:text-white transition-all shadow-lg group relative"
           >
             <Icons.MessageCircle size={22} />
             <div className="absolute left-full ml-4 px-2 py-1 bg-[#1f2026] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/5">
                {t('support')}
             </div>
           </button>
        </div>


      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* HEADER */}
        <header className="h-[56px] md:h-[64px] bg-[#1f2026] border-b border-white/5 flex items-center justify-between pr-3 md:pr-6 shrink-0 z-[100] relative">
          <div className="flex items-center h-full">
            <div className="md:hidden flex h-full">
              {activeTab !== "trade" ? (
                <button 
                  onClick={() => setActiveTab("trade")} 
                  className="w-[48px] h-full flex items-center justify-center text-gray-400 hover:text-white transition-all z-10"
                >
                  <Icons.ArrowLeft size={22} />
                </button>
              ) : (
                <button 
                  onClick={() => setShowSidebar(!showSidebar)} 
                  className="w-[48px] h-full flex items-center justify-center text-gray-400 hover:text-white transition-all z-10"
                >
                  <Icons.Menu size={22} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-0 md:ml-6">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
                <Logo size={28} />
                <span className="hidden lg:block font-sans font-black text-[22px] tracking-tight text-white">Bivaax</span>
              </div>

              {/* Plus Button */}
              <button 
                onClick={() => setActiveTab("assets")}
                className="hidden md:flex w-10 h-10 bg-[#2a2c31] rounded-[10px] items-center justify-center text-gray-400 hover:text-white hover:bg-[#32343a] transition-all border border-white/5"
              >
                <Icons.Plus size={20} strokeWidth={3} />
              </button>
            </div>
            
            {/* Desktop Asset Selector */}
            <div 
              onClick={() => setActiveTab("assets")}
              className="hidden md:flex items-center gap-3 bg-[#2a2c31] pl-3 pr-4 py-2 rounded-[12px] border border-white/5 cursor-pointer hover:bg-[#32343a] transition-all group ml-3 shadow-lg h-[40px] relative overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <AssetLogo name={activeAsset} size={20} />
                <span className="font-bold text-[14px] text-white tracking-tight">{activeAsset}</span>
                <span className="text-gray-400 text-[14px] font-medium ml-1">
                  {markets[activeAsset]?.payout || 83}%
                </span>
                {is5STActive && (
                  <span className="text-[10px] font-black text-black bg-[#FFE24C] px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                    5ST
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6 h-full">
            {/* Mobile Header Center Content -> Now on Right */}
            <div className="md:hidden flex items-center gap-2 mr-1">
              <button className="bg-transparent border border-white/10 w-9 h-9 rounded-[10px] flex items-center justify-center text-gray-300 active:scale-95 transition-transform">
                <Icons.RefreshCcw size={16} />
              </button>
              <div 
                onClick={() => setShowAccounts(!showAccounts)}
                className="flex flex-col items-start cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 mb-0.5 opacity-90 group-active:opacity-70 transition-opacity">
                    <span className={`text-[13px] font-medium leading-none ${accountType === 'demo' ? 'text-cyan-400' : accountType === 'tournament' ? 'text-indigo-400' : 'text-yellow-400'}`}>
                      {accountType === 'demo' ? t('demoAccount') : accountType === 'tournament' ? t('tournament') : t('liveAccount')}
                    </span>
                  <Icons.ChevronDown size={14} className="text-[#e0e0e0]" />
                </div>
                <div className="font-sans font-bold text-[15px] leading-none text-white opacity-90 group-active:opacity-70 transition-opacity pt-[1px]">
                  <AnimatedBalance value={balance} currency={userCurrency} accountType={accountType} isHidden={isBalanceHidden} />
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4 h-full">
               {/* Refresh Button */}
               <button 
                 onClick={() => window.location.reload()}
                 className="w-10 h-10 bg-[#2a2c31] rounded-[10px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#32343a] transition-all border border-white/5"
               >
                 <Icons.RefreshCcw size={18} />
               </button>

               <div 
                 onClick={() => setShowAccounts(!showAccounts)}
                 className="flex flex-col items-end cursor-pointer group px-2 py-1 hover:bg-white/5 rounded-lg transition-colors"
               >
                 <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[12px] font-medium text-gray-300">
                      {accountType === 'demo' ? t('demoAccount') : accountType === 'tournament' ? t('tournament') : t('liveAccount')}
                    </span>
                    <Icons.ChevronDown size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                 </div>
                 <span className="font-sans font-bold text-[18px] text-white tracking-tight leading-none">
                    <AnimatedBalance value={balance} currency={userCurrency} accountType={accountType} isHidden={isBalanceHidden} />
                 </span>
               </div>
               
               <button 
                 onClick={() => { navigate("/deposit"); bootApp(); }}
                 className="bg-[#ffe24c] hover:bg-[#fff080] text-[#131417] h-[36px] px-4 rounded-[10px] font-black text-[13px] flex items-center gap-2 transition-all active:scale-95 shadow-lg"
               >
                 <Icons.Wallet size={18} fill="currentColor" className="opacity-80" />
                 {t('deposit')}
               </button>

               <button 
                 onClick={() => { navigate("/withdraw"); bootApp(); }}
                 className="bg-[#2a2c31] hover:bg-[#32343a] text-white h-[36px] px-4 rounded-[10px] font-black text-[13px] flex items-center gap-2 transition-all active:scale-95 border border-white/5"
               >
                 <Icons.CreditCard size={18} className="text-gray-400" />
                 {t('withdrawal')}
               </button>
               
               <div 
                 onClick={() => { setActiveTab("profile-menu"); }}
                 className="w-[44px] h-[44px] bg-[#3b3c43] rounded-full flex items-center justify-center text-[16px] font-black text-white/40 relative cursor-pointer active:scale-90 transition-transform uppercase border-[2px] border-white/10 ml-2"
               >
                 {currentUser?.displayName ? String(currentUser.displayName).substring(0, 1) : (currentUser?.email ? String(currentUser.email).substring(0, 1) : "H")}
                 <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2a2c31] rounded-full flex items-center justify-center border-[2px] border-[#1f2026] shadow-lg">
                    <Icons.Diamond size={10} fill="#ffe24c" className="text-[#ffe24c]" />
                 </div>
               </div>
            </div>

            {/* Mobile Header Icons (Right) */}
            <div className="flex md:hidden items-center gap-2">
              <button 
                onClick={() => setShowCashierMenu(true)}
                className="bg-[#FFE24C] w-10 h-10 rounded-[8px] flex items-center justify-center text-black active:scale-90 transition-transform"
              >
                <Icons.Wallet size={20} strokeWidth={2.5} />
              </button>
              
              <div 
                onClick={() => { setActiveTab("profile-menu"); }}
                className="w-10 h-10 bg-[#32343a] rounded-full flex items-center justify-center text-[11px] font-black text-gray-400 relative cursor-pointer active:scale-90 transition-transform uppercase"
              >
                {currentUser?.displayName ? String(currentUser.displayName).substring(0, 2) : (currentUser?.email ? String(currentUser.email).substring(0, 2) : "US")}
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#1a1b1f] rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* CHART & TRADING CONTROLS */}
        <div className={`flex-1 flex ${isMultiChart && !isMobile ? "flex-col md:flex-row" : "flex-col md:flex-row"} overflow-hidden relative min-h-0`}>
          {(isMultiChart && !isMobile ? [0, 1] : [0]).map((idx) => renderTradingEnvironment(idx))}

        {/* MOBILE TRADING PANEL (At Bottom) */}
          <div className="md:hidden flex flex-col shrink-0 gap-0 z-[60] pointer-events-auto bg-[#1a1b1f] border-t border-white/5 relative">
             
             {/* Binomo Style Trade Result Notification */}
             <AnimatePresence>
               {tradeNotifications.length > 0 && (
                 <div className="absolute right-0 bottom-full mb-1 z-[70] pr-4 pointer-events-none">
                    <div className="flex flex-col gap-2 items-end">
                    {tradeNotifications.map((notif, idx) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="pointer-events-auto"
                      >
                         <div className={`flex items-center gap-2.5 h-[38px] min-w-[200px] max-w-[90vw] pr-2 rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden transition-all duration-300 ${notif.status === 'won' ? 'bg-[#00C980]' : (notif.status === 'draw' ? 'bg-[#eeeeee]' : 'bg-[#222328] border border-rose-500/30')}`}>
                            {/* Counter/Index - Binomo Style circle */}
                            <div className={`ml-1.5 w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${notif.status === 'won' ? 'bg-white text-[#00C980]' : (notif.status === 'draw' ? 'bg-[#111111] text-white' : 'bg-rose-500/20 text-rose-400')}`}>
                               {notif.count || 1}
                            </div>
                            
                            {/* Text Content */}
                            <div className="flex-1 flex items-center justify-between gap-4 overflow-hidden">
                               <span className={`text-[12px] font-black truncate max-w-[120px] ${notif.status === 'won' ? 'text-white' : (notif.status === 'draw' ? 'text-[#111111]' : 'text-white')}`}>
                                  {notif.asset}
                               </span>
                               <span className={`text-[13px] font-black shrink-0 ${notif.status === 'won' ? 'text-white font-extrabold' : (notif.status === 'draw' ? 'text-[#111111]' : 'text-rose-400 font-extrabold')}`}>
                                  {notif.status === 'won' ? '+' : (notif.status === 'lost' ? '-' : '+')}{formatWithCurrency(notif.amount, userCurrency)}
                               </span>
                            </div>

                            {/* Close Button */}
                            <button 
                              onClick={() => setTradeNotifications(prev => prev.filter(p => p.id !== notif.id))}
                              className={`p-1 hover:opacity-100 opacity-80 transition-all ${notif.status === 'won' ? 'text-white' : (notif.status === 'draw' ? 'text-[#111111]' : 'text-white')}`}
                            >
                               <X size={16} strokeWidth={2.5} />
                            </button>
                         </div>
                      </motion.div>
                    ))}
                    </div>
                 </div>
               )}
             </AnimatePresence>


             <div className="flex items-center gap-[18px] px-[18px] py-2 border-b border-white/5 mb-2">
               <div className="text-[12px] text-[#8e8e93] font-medium tracking-tight">
                 {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone })} {timeZone !== "UTC" ? timeZone.split('/').pop()?.replace(/_/g, ' ') : "UTC"}
               </div>

             </div>
             
             <div className="px-4 flex flex-col gap-2.5">
               <div className="flex gap-3">
                  {is5STActive ? (
                    <div className="flex-1 bg-[#33353b]/80 h-[44px] rounded-lg flex flex-col items-center justify-center border border-[#FFE24C]/20 select-none">
                      <span className="text-[8px] text-[#FFE24C] font-black uppercase tracking-wider mb-[1px]">5ST Option</span>
                      <span className="font-sans font-black text-[12px] text-white">5 Sec Turbo</span>
                    </div>
                  ) : (
                    <div onClick={() => setShowTimePicker(true)} className="flex-1 bg-[#33353b] h-[44px] rounded-lg flex items-center justify-between px-3 cursor-pointer">
                        <button onClick={(e) => { e.stopPropagation(); decreaseTime(); }} className="text-[#9ea0a5] active:scale-95 transition-transform"><Minus size={18} strokeWidth={1.5} /></button>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-[#9ea0a5] tracking-wide mb-[1px]">{t('time')}</span>
                            <div className="flex flex-col items-center">
                              <span className="font-sans font-bold text-[14px] tracking-tight text-white leading-none">{expirationString}</span>
                              <span className={`text-[8px] font-bold ${timeToPurchase < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                {timeToPurchase > 0 ? formatTimeToPurchase(timeToPurchase) : '---'}
                              </span>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); increaseTime(); }} className="text-[#9ea0a5] active:scale-95 transition-transform"><Plus size={18} strokeWidth={1.5} /></button>
                    </div>
                  )}
                  <div className="flex-1 bg-[#33353b] h-[44px] rounded-lg flex items-center justify-between px-3">
                      <button onClick={() => setAmount(Math.max(minConvertedAmount, amount - (['USD', 'USDT', 'EUR', 'GBP'].includes(userCurrency) ? 1 : (userCurrency === 'BDT' ? 50 : 10))))} className="text-[#9ea0a5] active:scale-95 transition-transform"><Minus size={18} strokeWidth={1.5} /></button>
                      <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-[8px] text-[#9ea0a5] tracking-wide leading-none mb-[2px]">{t('amount')} ({t('balance')}: {formatWithCurrency(balance, userCurrency)})</span>
                          <input 
                            type="number" 
                            value={amount || ''} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                setAmount(0);
                                return;
                              }
                              const num = Number(val);
                              if (!isNaN(num) && num >= 0) {
                                setAmount(num);
                              }
                            }} 
                            onBlur={() => setAmount(Math.max(minConvertedAmount, amount))} 
                            className="font-sans font-bold text-[14px] tracking-tight text-white leading-none w-16 bg-transparent text-center outline-none" 
                          />
                      </div>
                      <button onClick={() => setAmount(amount + (['USD', 'USDT', 'EUR', 'GBP'].includes(userCurrency) ? 1 : (userCurrency === 'BDT' ? 50 : 10)))} className="text-[#9ea0a5] active:scale-95 transition-transform"><Plus size={18} strokeWidth={1.5} /></button>
                  </div>
               </div>

               <div className="flex items-center justify-center gap-2">
                  <span className="text-[12px] text-[#9ea0a5]">{t('payout')} <span className="text-white font-bold ml-1">+{markets[activeAsset]?.payout || 82}%</span></span>
                  <span className="text-white font-bold text-[16px] font-sans tracking-tight leading-none pt-0.5">{getCurrencySymbol(userCurrency)}{(amount * (1 + (markets[activeAsset]?.payout || 82) / 100)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
               </div>

               <div className="flex gap-2.5 pb-2 relative px-1">
                  <motion.button 
                    whileTap={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? {} : { scale: 0.94 }}
                    onClick={() => !markets[activeAsset]?.isFrozen && !isPlacingTrade && !isClosed && placeTrade("up")}
                    disabled={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed}
                    className={`flex-1 ${markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? 'bg-gray-500 grayscale' : 'bg-[#00c980] hover:bg-[#00d98a] active:bg-[#00b372]'} h-[38px] rounded-[8px] flex items-center justify-center transition-all relative overflow-hidden shadow-sm active:scale-[0.98] border border-white/5`}
                  >
                    {markets[activeAsset]?.isFrozen ? (
                       <div className="flex flex-col items-center gap-0.5 grayscale opacity-50">
                          <Snowflake size={12} className="text-white" />
                          <span className="text-white text-[6px] font-black uppercase tracking-widest">Frozen</span>
                       </div>
                    ) : isClosed ? (
                       <div className="flex flex-col items-center gap-0.5 grayscale opacity-50">
                          <Clock size={12} className="text-white" />
                          <span className="text-white text-[6px] font-black uppercase tracking-widest">Closed</span>
                       </div>
                    ) : isPlacingTrade ? (
                       <Icons.Loader className="animate-spin text-white" size={24} />
                    ) : (
                       <ArrowUp size={24} strokeWidth={3} className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]" />
                    )}
                  </motion.button>
                  
                  <motion.button 
                    whileTap={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? {} : { scale: 0.94 }}
                    onClick={() => !markets[activeAsset]?.isFrozen && !isPlacingTrade && !isClosed && placeTrade("down")}
                    disabled={markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed}
                    className={`flex-1 ${markets[activeAsset]?.isFrozen || isPlacingTrade || isClosed ? 'bg-gray-500 grayscale' : 'bg-[#ff4757] hover:bg-[#ff5d6a] active:bg-[#e63242]'} h-[38px] rounded-[8px] flex items-center justify-center transition-all relative overflow-hidden shadow-sm active:scale-[0.98] border border-white/5`}
                  >
                    {markets[activeAsset]?.isFrozen ? (
                       <div className="flex flex-col items-center gap-0.5 grayscale opacity-50">
                          <Snowflake size={12} className="text-white" />
                          <span className="text-white text-[6px] font-black uppercase tracking-widest">Frozen</span>
                       </div>
                    ) : isClosed ? (
                       <div className="flex flex-col items-center gap-0.5 grayscale opacity-50">
                          <Clock size={12} className="text-white" />
                          <span className="text-white text-[6px] font-black uppercase tracking-widest">Closed</span>
                       </div>
                    ) : isPlacingTrade ? (
                       <Icons.Loader className="animate-spin text-white" size={24} />
                    ) : (
                       <ArrowDown size={24} strokeWidth={3} className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]" />
                    )}
                  </motion.button>
               </div>

               {/* New Trades Button for Mobile removed per user request */}
             </div>

             {/* MOBILE BOTTOM NAVIGATION */}
             <nav className="h-[62px] bg-[#1a1b1f] flex justify-around items-center shrink-0 px-1 border-t border-white/5 relative z-[450]">
                {[
                  { 
                    icon: (props: any) => (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="w-[22px] h-[22px]" 
                        stroke="currentColor" 
                        strokeWidth="2.3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        {...props}
                      >
                        {/* Left Candlestick */}
                        <line x1="8" y1="5" x2="8" y2="10" />
                        <rect x="5" y="10" width="6" height="4" rx="2" />
                        <line x1="8" y1="14" x2="8" y2="19" />

                        {/* Right Candlestick */}
                        <line x1="16" y1="5" x2="16" y2="8" />
                        <rect x="13" y="8" width="6" height="8" rx="2" />
                        <line x1="16" y1="16" x2="16" y2="19" />
                      </svg>
                    ), 
                    tab: "trade", 
                    label: t('trade') 
                  },
                  { icon: History, tab: "history", label: t('history') },
                  { icon: Users, label: t('copy'), onClick: () => navigate('/copytrading') },
                  { icon: LayoutGrid, tab: "activities", label: t('activities'), dot: true },
                  { icon: User, label: t('profile'), onClick: () => navigate('/profile') },
                ].map((item, idx) => (
                  <button 
                    key={`mobile-nav-${'tab' in item ? item.tab : item.label}`}
                    onClick={() => {
                        if ('onClick' in item && typeof item.onClick === 'function') {
                          item.onClick();
                        } else if ('tab' in item) {
                          setActiveTab(item.tab as any);
                          if(item.tab === "profile") setActiveProfileTab("account");
                        }
                    }}
                    className="flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 relative"
                  >
                    <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === item.tab ? "text-[#309cf4] -translate-y-0.5" : "text-[#5a5c63]"}`}>
                      <div className="relative">
                        <item.icon size={22} strokeWidth={activeTab === item.tab ? 2.5 : 2} />
                        {item.dot && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#f44336] rounded-full border-[1.5px] border-[#1a1b1f]"></div>
                        )}
                        {'tab' in item && item.tab === 'history' && visibleActiveTrades.length > 0 && (
                          <div className="absolute -top-1.5 -right-2.5 bg-[#f44336] text-white text-[9px] font-black h-[17px] min-w-[17px] px-1 rounded-full flex items-center justify-center border border-[#1a1b1f] shadow-md animate-pulse z-10">
                            {visibleActiveTrades.length}
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold tracking-tight uppercase transition-all duration-300 ${activeTab === item.tab ? "opacity-100 scale-100" : "opacity-70 scale-95"}`}>
                        {item.label}
                      </span>
                    </div>
                  </button>
                ))}
             </nav>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL SIDEBAR DRAWER */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 md:top-[64px] md:bottom-0 md:right-auto md:w-[320px] bg-[#1e1e24] z-[300] flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* MOBILE TOP BAR (Inside Sidebar) */}
            <div className="flex md:hidden h-[64px] items-center justify-between px-6 border-b border-white/5 bg-[#1a1b1f] shrink-0">
               <div className="flex items-center gap-3">
                  <Logo size={28} />
                  <span className="text-[22px] font-black tracking-tighter text-white">Bivaax</span>
               </div>
               <button onClick={() => setShowSidebar(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors active:scale-95">
                  <X size={20} />
               </button>
            </div>

            {/* PROFESSIONAL MENU ITEMS */}
            <div className="flex flex-col">
              <button className="flex items-center gap-4 px-6 h-[64px] hover:bg-white/5 transition-colors border-b border-white/5 group">
                <Diamond size={18} className="text-[#967ce8]" fill="#967ce8" strokeWidth={1} />
                <span className="text-[15px] font-medium text-white group-hover:text-[#967ce8] transition-colors">Prestige</span>
              </button>
              <button className="flex items-center gap-4 px-6 h-[64px] hover:bg-white/5 transition-colors border-b border-white/5 group">
                <Diamond size={18} className="text-gray-500" fill="currentColor" strokeWidth={1} />
                <span className="text-[15px] font-medium text-white/90">VIP</span>
              </button>

              <div className="flex flex-col border-b border-white/5">
                <button 
                  onClick={() => setOpenForTraders(!openForTraders)}
                  className="flex items-center justify-between px-6 h-[64px] text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-[15px] font-medium text-white/90">For traders</span>
                  {openForTraders ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {openForTraders && (
                  <div className="flex flex-col bg-[#1a1b1f]">
                    {[
                      { label: t('tournaments'), tab: "tournaments", locked: true },
                      { label: t('promotions'), tab: "promotions" },
                      { label: t('calculator'), tab: "calculator" },
                      { label: t('strategies'), tab: "strategies" },
                      { label: t('economicCalendar'), tab: "calendar" }
                    ].map(link => (
                      <button 
                        key={`sidebar-drawer-${link.tab}`} 
                        onClick={() => {
                          if ('locked' in link && link.locked) {
                            toast.error("Tournaments are currently closed!");
                            return;
                          }
                          setActiveTab(link.tab as any);
                          setShowSidebar(false);
                        }}
                        className="flex items-center justify-between px-6 h-[50px] text-left text-[14px] text-gray-400 hover:text-white transition-colors border-t border-white/5"
                      >
                        <span>{link.label}</span>
                        {('locked' in link && link.locked) && <Lock size={14} className="text-[#ffe24c]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col border-b border-white/5">
                <button 
                  onClick={() => setOpenInformation(!openInformation)}
                  className="flex items-center justify-between px-6 h-[64px] text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-[15px] font-medium text-white/90">Information</span>
                  {openInformation ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {openInformation && (
                  <div className="flex flex-col bg-[#1a1b1f]">
                    {["Statuses", "Platform Blog", "About us", "Regulations", "Client Agreement", "AML policy"].map(link => (
                      <button 
                        key={`sidebar-info-${link}`} 
                        className="flex items-center px-6 h-[50px] text-left text-[14px] text-gray-400 hover:text-white transition-colors border-t border-white/5"
                        onClick={() => {
                          setShowSidebar(false); // Always close sidebar
                          if (link === "Statuses") {
                            setActiveTab("statuses");
                          } else if (link === "Platform Blog") {
                            navigateToBlog(navigate);
                          } else if (link === "About us") {
                            navigate("/about-us");
                          } else if (link === "Regulations") {
                            setShowRegulations(true); // Since it has db data
                          } else if (link === "Client Agreement") {
                            navigate("/page/legal-agreement");
                          } else if (link === "AML policy") {
                            navigate("/page/aml-policy");
                          }
                        }}
                      >
                        {link}
                      </button>
                    ))}
                  </div>
                )}
              </div>

               <button 
                  onClick={() => {
                    setShowSidebar(false);
                    navigate("/support");
                  }}
                  className="flex items-center gap-4 px-6 h-[64px] hover:bg-white/5 border-b border-white/5 w-full text-left group"
                >
                  <span className="text-[15px] font-medium text-white/90 group-hover:text-[#f45c5c] transition-colors">Support</span>
                </button>
              <button className="flex items-center gap-4 px-6 h-[64px] hover:bg-white/5 border-b border-white/5">
                <span className="text-[15px] font-medium text-white/90">Reviews</span>
              </button>
              <button className="flex items-center gap-4 px-6 h-[64px] hover:bg-white/5 border-b border-white/5">
                <span className="text-[15px] font-medium text-white/90">Bivaax Blog</span>
              </button>
              
              {/* SOCIAL MEDIA LINKS */}
              <div className="flex items-center gap-3 px-6 h-[80px]">
                 <button className="w-10 h-10 rounded-lg border border-white/10 bg-[#2b2d35] flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors">
                    <Icons.Youtube size={18} />
                 </button>
                 <button className="w-10 h-10 rounded-lg border border-white/10 bg-[#2b2d35] flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors">
                    <Icons.Instagram size={18} />
                 </button>
                 <button className="w-10 h-10 rounded-lg border border-white/10 bg-[#2b2d35] flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors">
                    <Icons.Send size={18} />
                 </button>
                 <button className="w-10 h-10 rounded-lg border border-white/10 bg-[#2b2d35] flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors">
                    <Icons.Facebook size={18} />
                 </button>
                 <button className="w-10 h-10 rounded-lg border border-white/10 bg-[#2b2d35] flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors">
                    <Icons.Music size={18} />
                 </button>
              </div>
              
              {isAdmin && (
                <button 
                  onClick={() => { setShowSidebar(false); navigate("/admin"); }}
                  className="flex items-center gap-3 px-6 h-[64px] border-t border-white/5 text-left text-[15px] font-medium text-yellow-500 hover:bg-white/5 transition-colors"
                >
                  <ShieldCheck size={18} />
                  <span>Admin Panel</span>
                </button>
              )}
            </div>

            {/* Support FAB inside sidebar */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openSupport}
              className="absolute bottom-10 right-6 w-14 h-14 rounded-full bg-[#f45c5c] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(244,92,92,0.4)] z-[400] md:hidden"
            >
              <Icons.MessageCircle size={28} />
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVITIES DRAWER */}
      {activeTab === "activities" && (
        <div className="fixed md:absolute inset-y-0 left-0 w-full max-w-full md:max-w-[400px] md:left-[68px] md:right-auto md:w-[400px] z-[150] flex flex-col overflow-hidden bg-[#121214] border-r border-white/5 shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="w-full h-full flex flex-col relative text-white z-50">
            {/* Top Header */}
            <div className="h-[64px] flex items-center justify-between px-6 border-b border-white/5 bg-[#121214] shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("trade")}
                  className="text-[#9ea0a5] hover:text-white transition-colors p-2 -ml-2"
                >
                  <ArrowLeft size={24} strokeWidth={2} />
                </button>
                <h2 className="text-[20px] font-black tracking-tight text-white m-0 uppercase">
                  ACTIVITIES
                </h2>
              </div>
              <button 
                onClick={() => setActiveTab("trade")} 
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#0B0B0C] relative custom-scrollbar">
              {isActivitiesLoading ? (
                <div className="animate-pulse space-y-6">
                  {/* Stories Horizontal Scroll Skeleton */}
                  <div className="flex overflow-x-auto gap-3 pb-6 border-b border-white/5 scrollbar-hide">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={`story-skeleton-${i}`}
                        className="min-w-[100px] w-[100px] h-[130px] rounded-xl bg-[#2a2c31]/60 flex flex-col justify-end p-3 border border-white/5 shrink-0"
                      >
                        <div className="w-12 h-3 bg-white/10 rounded-sm mb-1.5" />
                        <div className="w-16 h-3 bg-white/10 rounded-sm" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {/* Tournaments Skeleton */}
                    <div className="w-full bg-[#2a2c31]/60 rounded-2xl p-5 flex items-center gap-5 border border-white/5 h-[100px]">
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/5 shrink-0" />
                      <div className="w-32 h-6 bg-white/10 rounded-md" />
                    </div>

                    {/* 3 Square Grid Items Skeleton */}
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={`grid-skeleton-${i}`}
                          className="bg-[#2a2c31]/60 rounded-2xl p-3 flex flex-col items-center gap-3 border border-white/5 h-[110px] justify-center"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 shrink-0" />
                          <div className="w-12 h-4 bg-white/10 rounded-md" />
                        </div>
                      ))}
                    </div>

                    {/* Vertical List Items Skeleton */}
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={`list-skeleton-${i}`}
                          className="w-full bg-[#2a2c31]/60 rounded-2xl p-4 flex items-center justify-between border border-white/5 h-[80px]"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 shrink-0" />
                            <div className="w-24 h-5 bg-white/10 rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stories Horizontal Scroll */}
                  <div className="relative group/stories mb-6 border-b border-white/5 pb-6">
                    <div id="stories-scroll" className="flex overflow-x-auto gap-3 scrollbar-hide -mx-2 px-2 shrink-0">
                      {STORIES.map((story, index) => (
                        <button
                          key={story.id}
                          onClick={() => {
                            setSelectedStoryIndex(index);
                            setShowStory(true);
                          }}
                          className="flex flex-col items-center min-w-[100px] w-[100px] h-[130px] rounded-xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-xl hover:border-[#FFE24C]/30 transition-all shrink-0"
                        >
                          <img src={story.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-2 left-2 right-2 text-left">
                            <span className="text-[11px] font-black uppercase text-white leading-[1.1] tracking-tighter line-clamp-2 drop-shadow-md">
                              {story.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Scroll Indicator/Button */}
                    <button 
                      onClick={() => {
                        document.getElementById('stories-scroll')?.scrollBy({ left: 150, behavior: 'smooth' });
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 rounded-full bg-[#2a2c31] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#32343a] shadow-xl z-10 transition-all opacity-0 group-hover/stories:opacity-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Tournaments (Large Card) */}
                    <button 
                      onClick={() => setActiveTab("tournaments")}
                      className="w-full bg-[#2a2c31] hover:bg-[#32343a] rounded-2xl p-5 flex items-center justify-between transition-all border border-white/5 shadow-lg group h-[100px] relative overflow-hidden"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-[#1f2026] flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                          <Trophy size={28} className="text-white" />
                        </div>
                        <span className="text-[18px] font-black text-white tracking-tight">Tournaments</span>
                      </div>
                    </button>

                    {/* 3 Square Grid Items */}
                    <div className="grid grid-cols-3 gap-3">
                      {(() => {
                        const unreadPromosCount = promotionsData.filter(promo => !readPromotionsIds.includes(promo.id)).length;
                        return [
                          { label: "Bonuses", tab: "promotions", icon: Gift, count: unreadPromosCount > 0 ? String(unreadPromosCount) : undefined },
                          { label: "Calendar", tab: "calendar", icon: Calendar },
                          { label: "Top-20", tab: "top-20", icon: Icons.Award, hasDot: true },
                        ].map((item) => (
                          <button 
                            key={`activities-grid-${item.label}`}
                            onClick={() => setActiveTab(item.tab as any)}
                            className="bg-[#2a2c31] hover:bg-[#32343a] rounded-2xl p-3 flex flex-col items-center gap-3 transition-all border border-white/5 shadow-lg h-[110px] justify-center relative group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-[#1f2026] flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                              <item.icon size={24} className="text-white" />
                            </div>
                            <span className="text-[12px] font-bold text-white/90">{item.label}</span>
                            {item.count && <div className="absolute top-3 right-3 w-4 h-4 bg-[#ff4757] rounded-full flex items-center justify-center text-[9px] font-black">{item.count}</div>}
                            {item.hasDot && <div className="absolute top-3 right-3 w-2 h-2 bg-[#ff4757] rounded-full"></div>}
                          </button>
                        ));
                      })()}
                    </div>

                    {/* Vertical List Items */}
                    <div className="space-y-3">
                      {(() => {
                        const unreadNewsCount = newsData.filter(news => !readNewsIds.includes(news.id)).length;
                        return [
                          { label: "What's new?", tab: "news", icon: Megaphone, badge: unreadNewsCount > 0 ? (unreadNewsCount > 9 ? "9+" : String(unreadNewsCount)) : undefined },
                          { label: "Invite Friends", tab: "affiliate", icon: UserPlus },
                          { label: "Education", tab: "education", icon: GraduationCap },
                        ].map((item) => (
                          <button 
                            key={`activities-list-${item.label}`}
                            onClick={() => setActiveTab(item.tab as any)}
                            className="w-full bg-[#2a2c31] hover:bg-[#32343a] rounded-2xl p-4 flex items-center justify-between transition-all border border-white/5 shadow-lg h-[80px] group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-[#1f2026] flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                                <item.icon size={22} className="text-white" />
                              </div>
                              <span className="text-[16px] font-bold text-white/90">{item.label}</span>
                            </div>
                            {item.badge && <div className="bg-[#ff4757] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{item.badge}</div>}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY TOP-20 LEADERBOARD MODAL */}
      {activeTab === "top-20" && (
        <div className="fixed md:absolute inset-0 md:left-[76px] md:right-auto md:w-[380px] z-[150] overflow-hidden bg-[#222329] border-r border-[#2C2D33] shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="w-full h-full flex flex-col relative text-white">
            {/* Top Header */}
            <div className="pt-5 pb-5 px-5 flex items-center justify-between border-b border-[#2C2D33]">
              <h2 className="text-[17px] font-medium tracking-wide text-white mb-0">
                Top-20
              </h2>
              <button
                onClick={() => setActiveTab("trade")}
                className="text-[#a6aeb9] hover:text-white transition-colors p-1 -mr-1"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-20 custom-scrollbar">
              {/* Hall of Fame Banner */}
              <div 
                onClick={() => setShowHallOfFameModal(true)}
                className="mb-6 relative h-[84px] rounded-2xl overflow-hidden bg-gradient-to-r from-[#201d15] via-[#332b1a] to-[#201d15] border border-[#FFE24C]/40 shadow-xl flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_0_15px_rgba(255,226,76,0.2)] transition-all active:scale-[0.98]"
              >
                {/* Animated background particles effect */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={`particle-${i}`}
                      className="absolute w-1 h-1 bg-[#FFE24C] rounded-full animate-pulse"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    ></div>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#f5f5f5] mb-1 z-10">
                  Best traders of the week announced
                </span>
                <h3 className="text-[20px] font-bold tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFE24C] to-[#FFE24C]/80 z-10">
                  HALL OF FAME
                </h3>
              </div>

              <p className="text-[#a6aeb9] text-[13px] font-medium mb-5">
                Traders with the biggest profit
              </p>

              {/* Stats Info */}
              <div className="flex justify-between mb-6 relative">
                <div className="flex flex-col">
                  <span className="text-white text-[15px] font-bold">
                    20,000+
                  </span>
                  <span className="text-[#a6aeb9] text-[12px] font-medium">
                    Participants a day
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-[15px] font-bold">
                      {formatTime(timeLeft)}
                    </span>
                    <Info size={16} className="text-[#a6aeb9] cursor-pointer" />
                  </div>
                  <span className="text-[#a6aeb9] text-[12px] font-medium pr-6">
                    Latest update
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#1a1b1f] border border-[#2C2D33] rounded-2xl p-5 mb-5 relative group">
                <div className="mb-3 group-hover:scale-105 transition-transform origin-left">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 15l-2 5l9 -9z" opacity="0" />
                    <circle cx="12" cy="8" r="5" fill="none" stroke="#fff" strokeWidth="2"/>
                    <path d="M8.5 12.5L5 21l3.5-2l3.5 2V12.5" fill="none" stroke="#fff" strokeWidth="2"/>
                    <path d="M15.5 12.5L19 21l-3.5-2l-3.5 2V12.5" fill="none" stroke="#fff" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="text-[14px] font-bold text-white mb-2 leading-snug">
                  Take your place among Bivaax traders!
                </h4>
                <p className="text-[#a6aeb9] text-[12px] leading-[1.6] font-medium">
                  Your current status is Free. To join the most successful
                  Bivaax traders, upgrade your status, and earn the biggest
                  profit on the platform!
                </p>
                <div className="mt-3">
                  <button className="text-[#FFE24C] font-bold text-[13px] hover:text-[#fff080] transition-colors">
                    Upgrade
                  </button>
                </div>
              </div>

              
              {/* Table Header */}
              <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center gap-12">
                  <span className="text-[#7b8390] text-[11px] font-medium tracking-wide uppercase">
                    Rank
                  </span>
                  <span className="text-[#7b8390] text-[11px] font-medium tracking-wide uppercase">
                    Trader
                  </span>
                </div>
                <span className="text-[#7b8390] text-[11px] font-medium tracking-wide uppercase">
                  Profit
                </span>
              </div>

              {/* Participants List */}
              <div className="flex flex-col gap-1">
                {isLoadingLeaderboard ? (
                   <div className="text-center text-white py-4">Loading...</div>
                ) : (
                  dynamicLeaderboard.map((trader, idx) => {
                    const isGap = idx > 0 && typeof trader.rank === 'number' && typeof dynamicLeaderboard[idx - 1].rank === 'number' && trader.rank > dynamicLeaderboard[idx - 1].rank + 1;
                    const isMockGap = idx > 0 && trader.rank === '-' && dynamicLeaderboard[idx - 1].rank !== '-';
                    return (
                      <React.Fragment key={`trader-frag-${trader.id || idx}`}>
                        {(isGap || isMockGap) && (
                          <div className="flex items-center justify-center py-2 text-gray-500 text-[10px] tracking-[0.3em] font-black uppercase opacity-60">
                            â€¢â€¢â€¢
                          </div>
                        )}
                        <div
                          className={`py-[10px] px-1 flex justify-between items-center border-b border-[#2C2D33]/40 last:border-0 transition-colors ${
                            trader.isCurrentUser ? "bg-[#FFE24C]/10 rounded-lg px-3 -mx-2 hover:bg-[#FFE24C]/20" : "hover:bg-[#1a1b1f]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-[24px] h-[24px] rounded-[6px] flex items-center justify-center text-[12px] font-bold ${
                                trader.rank === 1 ? "bg-[#FFE24C] text-black shadow-[0_0_10px_rgba(255,226,76,0.3)]" : 
                                trader.rank === 2 ? "bg-[#e0e0e0] text-black" : 
                                trader.rank === 3 ? "bg-[#D3885D] text-white" : 
                                trader.isCurrentUser ? "bg-[#FFE24C]/20 text-[#FFE24C]" :
                                "bg-[#2C2D33]/50 text-[#a6aeb9]"
                              }`}
                            >
                              {trader.rank}
                            </div>
                            <div className="w-[18px] h-[13px] rounded-[1px] overflow-hidden flex items-center justify-center text-[13px] bg-white/5">
                              {trader.flagUrl ? (
                                <img 
                                   src={trader.flagUrl} 
                                   alt="" 
                                   className="w-full h-full object-cover"
                                   onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                   }}
                                />
                              ) : (
                                trader.flagEmoji || "ðŸŒ"
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[13px] font-bold uppercase tracking-tight truncate ${trader.isCurrentUser ? 'text-[#FFE24C]' : 'text-white'}`}>
                                 {trader.name}
                              </span>
                              <span className="text-[9px] text-gray-500 font-medium truncate">
                                {trader.country}
                              </span>
                            </div>
                          </div>
                          <span className={`font-bold text-[14px] tracking-tighter ${trader.isCurrentUser ? 'text-[#FFE24C]' : 'text-white'}`}>
                            ${trader.formattedProfit}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY NEWS MODAL */}
      <AnimatePresence>
      {activeTab === "news" && (
        <div className="fixed md:absolute inset-0 md:left-[72px] md:right-auto md:w-[420px] z-[150] overflow-hidden bg-[#1C1C1E] border-r border-[#2C2C2E] shadow-2xl animate-in slide-in-from-left duration-300">
           <div className="w-full h-full flex flex-col relative text-white">
            <div className="pt-6 pb-4 px-6 flex items-center gap-4 bg-[#1C1C1E]">
              <button
                onClick={() => setActiveTab("activities")}
                className="text-gray-400 hover:text-white transition-colors"
                id="news-back-to-activities-btn"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <h2 className="text-[22px] font-bold tracking-tight">What's new?</h2>
            </div>
            
            <div className="flex justify-between items-center px-6 pb-4 border-b border-[#2C2C2E]/60 bg-[#1C1C1E]">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-white">Unread</span>
                <span className="bg-[#ffe24c] text-black text-[12px] font-black px-2 py-0.5 rounded-full">
                  {newsData.filter(n => n.isPlatformNews && !readNewsIds.includes(n.id)).length}
                </span>
              </div>

              <button 
                onClick={markAllNewsAsRead}
                className="text-gray-400 hover:text-gray-300 text-[13px] underline underline-offset-2 transition-colors"
              >
                Mark all read
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide pb-24 bg-[#151517]">
                  {(() => {
                    const platformItems = newsData.filter(n => n.isPlatformNews);
                    const filteredPlatformNews = platformItems.filter((item) => {
                      const matchesSearch = 
                        newsSearchQuery === "" ||
                        (item.title && item.title.toLowerCase().includes(newsSearchQuery.toLowerCase())) ||
                        (item.description && item.description.toLowerCase().includes(newsSearchQuery.toLowerCase()));
                      return matchesSearch;
                    });

                    if (filteredPlatformNews.length === 0) {
                      return (
                        <div className="py-20 text-center text-gray-500 space-y-3" id="news-platform-empty-state">
                          <Icons.Inbox size={32} className="mx-auto text-gray-600 opacity-40 animate-pulse" />
                          <p className="text-sm font-bold text-gray-400">No platform news found</p>
                          <button
                            onClick={() => setNewsSearchQuery("")}
                            className="bg-[#2C2C2E] border border-[#3A3A3C] hover:border-white/20 transition-all text-[11px] text-[#ffe24c] font-black px-4 py-2 rounded-xl"
                            id="news-platform-empty-reset-btn"
                          >
                            Reset search
                          </button>
                        </div>
                      );
                    }

                    return filteredPlatformNews.map((news, idx) => (
                      <div 
                        key={`news-item-${idx}-${news.id}-${news.title}`} 
                        onClick={() => {
                          setSelectedNews({
                            ...news,
                            isRealtime: false
                          });
                          setActiveTab("news-detail");
                          markNewsAsRead(news.id);
                        }}
                        className="bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-2xl p-5 border border-transparent transition-all cursor-pointer flex flex-col gap-3 active:scale-[0.98] group relative"
                        id={`platform-news-card-${news.id || idx}`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-[#8C8F96] text-[13px] font-medium">{news.date}</p>
                          {!readNewsIds.includes(news.id) && <span className="w-2 h-2 rounded-full bg-[#FFE24C]"></span>}
                        </div>
                        <h4 className="text-[17px] font-bold leading-snug text-white group-hover:text-[#ffe24c] transition-colors">
                          {news.title} {news.emoji}
                        </h4>
                        {news.imageUrl && (
                           <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden mt-3 mb-1">
                             <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                           </div>
                        )}
                        <p className="text-[#8C8F96] text-[14px] line-clamp-3 leading-relaxed">
                          {news.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                           <span className="text-[#8C8F96]"><Icons.Smile size={18} /></span>
                           <span className="text-[#8C8F96] text-[14px] font-bold">{news.reactions || 75}</span>
                        </div>

                      </div>
                    ));
                  })()}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY NEWS DETAIL MODAL */}
      {activeTab === "news-detail" && selectedNews && (
        <div className="fixed md:absolute inset-0 md:left-[72px] md:right-auto md:w-[420px] z-[160] overflow-hidden bg-[#1C1C1E] border-r border-[#2C2C2E] shadow-2xl animate-in slide-in-from-left duration-300">
           <div className="w-full h-full flex flex-col relative text-white">
            <div className="pt-6 pb-4 px-6 flex items-center gap-4 border-b border-[#2C2C2E] bg-[#1C1C1E] sticky top-0 z-10" id="news-details-header">
              <button
                onClick={() => setActiveTab("news")}
                className="text-gray-400 hover:text-white transition-colors"
                id="news-details-back-to-list-btn"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <h2 className="text-[16px] font-bold text-white truncate max-w-[280px]">
                {selectedNews.isRealtime ? "Live market update" : `${selectedNews.title} ${selectedNews.emoji || ''}`}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 bg-[#1C1C1E]">
              {!selectedNews.isRealtime && (
                <div className="px-6 py-6 space-y-3">
                  <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
                    {selectedNews.title} {selectedNews.emoji}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">{selectedNews.date}</p>
                </div>
              )}

              {selectedNews.isRealtime ? (
                selectedNews.imageurl ? (
                  <img 
                    src={selectedNews.imageurl} 
                    referrerPolicy="no-referrer"
                    alt={selectedNews.title} 
                    className="w-full h-56 object-cover" 
                   loading="lazy" />
                ) : (
                  <div className="w-full h-48 bg-[#2C2C2E]/60 flex items-center justify-center text-4xl border-b border-white/5 text-gray-500">âš¡</div>
                )
              ) : selectedNews.image || selectedNews.imageUrl ? (
                <img src={selectedNews.image || selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-56 md:h-72 object-cover"  loading="lazy" />
              ) : null}

              <div className="px-6 py-6 space-y-6">
                {selectedNews.isRealtime && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] font-black uppercase text-black bg-[#ffe24c] px-2.5 py-1 rounded-md tracking-wider">
                        {selectedNews.source_info?.name || "Global News"}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                        {getRelativeTimeString(selectedNews.published_on)}
                      </span>
                    </div>
                    
                    <h2 className="text-xl md:text-2xl font-black leading-tight tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                      {selectedNews.title}
                    </h2>
                  </div>
                )}
                
                <div className={`text-gray-300 text-[15px] leading-relaxed space-y-4 font-medium ${selectedNews.isRealtime ? 'border-t border-white/5 pt-4' : ''}`}>
                  {selectedNews.isRealtime ? (
                    <>
                      <p className="bg-white/[0.02] border-l-2 border-[#ffe24c] p-3 text-gray-400 italic rounded-r-xl text-[13.5px]">
                        {selectedNews.body}
                      </p>
                      
                      <div className="pt-4 pb-2 text-center" id="news-realtime-external-link-container">
                        <button
                          onClick={() => window.open(selectedNews.url, "_blank")}
                          className="w-full bg-[#309cf4] hover:bg-[#43a6f5] text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-[13px] shadow-lg shadow-[#309cf4]/10"
                          id="news-read-full-external-articles-btn"
                        >
                          <Icons.ExternalLink size={16} />
                          Read Full Article on {selectedNews.source_info?.name || "Publisher Site"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-300 space-y-4 whitespace-pre-wrap">
                        {selectedNews.content || ""}
                      </div>
                      
                      {selectedNews.actionType && (
                        <div className="pt-6 pb-2 text-center" id="news-platform-external-link-container">
                          <button
                            onClick={() => {
                              if (selectedNews.actionType === 'deposit') {
                                if (selectedNews.actionValue) {
                                  window.location.href = "/crypto-deposit?promoCode=" + selectedNews.actionValue;
                                } else {
                                  window.location.href = "/crypto-deposit";
                                }

                              } else if (selectedNews.actionType === 'url') {
                                window.open(selectedNews.actionValue, "_blank");
                              }
                            }}
                            className="w-full bg-[#ffe24c] hover:bg-[#ebd04f] text-black font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-[13px] shadow-lg shadow-[#ffe24c]/20"
                            id="news-platform-action-btn"
                          >
                            {selectedNews.actionType === 'url' ? <Icons.ExternalLink size={16} /> : <Icons.Wallet size={16} />}
                            {selectedNews.ctaText || "Take Action"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Reaction engine */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <h5 className="text-white font-bold text-[17px]">Like it?</h5>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (!selectedNews.hasVotedUp && !selectedNews.hasVotedDown) {
                          setSelectedNews((p: any) => p ? { ...p, reactions: (p.reactions || 0) + 1, hasVotedUp: true } : null);
                        }
                      }}
                      className={`hover:bg-[#3A3A3C] transition-colors py-2.5 px-4 rounded-[14px] flex items-center justify-center gap-2 border transition-all ${
                        selectedNews.hasVotedUp 
                          ? "bg-[#3A3A3C] text-yellow-500 border-transparent shadow-inner"
                          : "bg-[#2C2C2E] text-gray-400 border-transparent"
                      }`}
                      id="news-feedback-like-btn"
                    >
                       <Icons.Smile size={18} />
                       <span className="font-bold text-[14px]">{selectedNews.reactions || 75}</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (!selectedNews.hasVotedUp && !selectedNews.hasVotedDown) {
                          setSelectedNews((p: any) => p ? { ...p, badReactions: (p.badReactions || 0) + 1, hasVotedDown: true } : null);
                        }
                      }}
                      className={`hover:bg-[#3A3A3C] transition-colors py-2.5 px-4 rounded-[14px] flex items-center justify-center gap-2 border transition-all ${
                        selectedNews.hasVotedDown 
                          ? "bg-[#3A3A3C] text-red-400 border-transparent shadow-inner"
                          : "bg-[#2C2C2E] text-gray-400 border-transparent"
                      }`}
                      id="news-feedback-dislike-btn"
                    >
                       <Icons.Frown size={18} />
                       <span className="font-bold text-[14px]">{selectedNews.badReactions || 14}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </AnimatePresence>

      {/* OVERLAY MARKET STATE MODAL */}
      {activeTab === "market-state" && (
        <div className="fixed md:absolute inset-0 md:left-[72px] md:right-auto md:w-[420px] z-[160] overflow-hidden bg-[#1C1C1E] border-r border-[#2C2C2E] shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="w-full h-full flex flex-col relative text-white">
            <div className="pt-6 pb-4 px-6 flex items-center gap-4 border-b border-[#2C2C2E] bg-[#1C1C1E] sticky top-0 z-10">
              <button
                onClick={() => setActiveTab("trade")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <h2 className="text-[18px] font-black tracking-tight flex items-center gap-2">
                <Activity size={20} className="text-[#FFE24C]" /> MARKET STATE
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto w-full scrollbar-hide py-4 px-4 pb-20">
              <div className="grid gap-3">
                {Object.keys(markets).filter(asset => {
                  if (markets[asset].hidden) return false;
                  if (isRealMarketClosed(asset)) return false;
                  return true;
                }).sort((a, b) => {
                  const isOTC_a = a.includes('(OTC)') || a.includes('Crypto IDX');
                  const isOTC_b = b.includes('(OTC)') || b.includes('Crypto IDX');
                  if (isOTC_a && !isOTC_b) return -1;
                  if (!isOTC_a && isOTC_b) return 1;
                  return a.localeCompare(b);
                }).map(asset => {
                  const data = markets[asset];
                  return (
                    <div key={`mkt-state-${asset}`} className="bg-[#2C2C2E] rounded-xl p-4 border border-[#3A3A3C] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AssetLogo name={asset} />
                        <div>
                          <p className="font-bold text-[15px]">{asset}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${data.state === 'frozen' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                              {data.state === 'frozen' ? 'FROZEN' : 'ACTIVE'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[14px] font-bold tracking-tight">{data.price ? data.price.toFixed(4) : '---'}</p>
                        <p className="text-xs text-yellow-500 font-black mt-0.5 bg-yellow-500/10 inline-block px-1.5 py-0.5 rounded">{data.payout || 83}% PAYOUT</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY EDUCATION MODAL */}
      {activeTab === "education" && (
        <div className="fixed md:absolute inset-0 md:left-[72px] md:right-auto md:w-[420px] z-[150] overflow-hidden bg-[#1C1C1E] border-r border-[#2C2C2E] shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="w-full h-full flex flex-col relative text-white">
            <div className="pt-6 pb-4 px-6 flex items-center gap-4 border-b border-[#2C2C2E]">
              <button
                onClick={() => setActiveTab("activities")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <h2 className="text-[22px] font-bold">Education</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide pb-20">
              {(() => {
                const eduList = educationData;
                const welcomeItem = eduList.find(i => i.id === '1' || i.id === 1 || i.title?.toLowerCase().includes("welcome")) || eduList[0];
                const videoItems = eduList.filter(i => i !== welcomeItem);

                return (
                  <>
                    {welcomeItem && (
                      <div 
                        className="bg-gradient-to-br from-yellow-700/60 to-[#1C1C1E] rounded-xl p-5 border border-yellow-700/30 cursor-pointer group flex justify-between items-center"
                        onClick={() => {
                          setActiveVideoTitle(welcomeItem.title);
                          setActiveVideoUrl(welcomeItem.videoUrl);
                        }}
                      >
                        <div>
                          <h3 className="text-[17px] font-bold text-white mb-1.5 leading-tight w-4/5">{welcomeItem.title}</h3>
                          <p className="text-yellow-500 text-[13px] font-medium">{welcomeItem.description}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors">
                          <Play className="text-yellow-500 group-hover:text-black ml-1 transition-colors" fill="currentColor" strokeWidth={0} size={24} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 pt-2">
                       {videoItems.length > 0 && (
                          <div className="bg-[#2C2C2E] px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer border border-[#3A3A3C]">
                            <span className="font-medium text-gray-300">All videos</span>
                            <Icons.ChevronDown className="text-gray-500" size={20} />
                          </div>
                       )}

                      {videoItems.map((item, idx) => (
                        <div 
                          key={`edu-vid-${idx}-${item.id}`} 
                          className="bg-[#212124] rounded-xl overflow-hidden cursor-pointer group mb-4 border border-white/5"
                          onClick={() => {
                            setActiveVideoTitle(item.title);
                            setActiveVideoUrl(item.videoUrl);
                          }}
                        >
                          <div className="p-4">
                            <h3 className="text-[20px] font-bold text-white mb-1.5 leading-tight">{item.title}</h3>
                            {item.description && (
                              <p className="text-gray-400 text-[13px] leading-relaxed mb-2 line-clamp-3">{item.description}</p>
                            )}
                          </div>
                          <div className="relative shadow-inner">
                            {item.thumbnailUrl ? (
                              <img src={item.thumbnailUrl} alt={item.title} className="w-full aspect-video object-cover opacity-80"  loading="lazy" />
                            ) : (
                              <div className="w-full aspect-video bg-gradient-to-br from-yellow-700/40 to-[#1C1C1E] flex items-center justify-center">
                                <Play size={40} className="text-yellow-500/50" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-14 h-14 rounded-full border border-yellow-500/50 flex items-center justify-center bg-black/40 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                                 <Play fill="currentColor" strokeWidth={0} size={24} className="ml-1" />
                               </div>
                            </div>
                            {item.duration && (
                              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[12px] font-bold text-white/90">
                                {item.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY STRATEGIES MODAL */}
      {activeTab === "strategies" && (
        <div className="fixed md:absolute inset-0 md:left-[72px] md:right-auto md:w-[420px] z-[150] overflow-hidden bg-[#1C1C1E] border-r border-[#2C2C2E] shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="w-full h-full flex flex-col relative text-white">
            <div className="pt-6 pb-4 px-6 flex items-center gap-4 border-b border-[#2C2C2E]">
              <button
                onClick={() => selectedStrategy ? setSelectedStrategy(null) : setActiveTab("activities")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icons.ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <h2 className="text-[22px] font-bold">{selectedStrategy ? selectedStrategy.name : "Trading Strategies"}</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide pb-20">
              {selectedStrategy ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#2C2C2E] border border-white/5">
                    <img 
                      src={selectedStrategy.image} 
                      alt={selectedStrategy.name}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Icons.Zap size={10} fill="currentColor" /> {selectedStrategy.level}
                      </div>
                      <h3 className="text-xl font-bold">{selectedStrategy.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-500">Overview</h4>
                      <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
                        {selectedStrategy.fullDesc}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-500">Execution Steps</h4>
                      <div className="space-y-3">
                        {selectedStrategy.steps.map((step: string, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black text-yellow-500 flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-[13px] text-gray-400 font-medium leading-normal">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-5 space-y-2 mt-8">
                       <div className="flex items-center gap-2 text-yellow-500">
                         <Icons.AlertTriangle size={16} />
                         <span className="text-[12px] font-black uppercase tracking-wider">Trader's Note</span>
                       </div>
                       <p className="text-[12px] text-gray-400 font-medium leading-relaxed italic">
                         "Success in {selectedStrategy.name} requires discipline. Always verify signals across multiple timeframes before commitment."
                       </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    {
                      id: 'bollinger',
                      name: "Bollinger Breakout",
                      level: "Intermediate",
                      desc: "Capitalize on volatility expansions using price-band interactions.",
                      fullDesc: "This strategy focuses on 'The Squeeze'. When Bollinger Bands narrow, it indicates low volatility. A breakout outside these bands often signals the start of a new, aggressive trend.",
                      image: "https://images.unsplash.com/photo-1611974714851-48206138d73e?auto=format&fit=crop&q=80&w=800",
                      steps: [
                        "Identify a period where Bollinger Bands are extremely narrow (The Squeeze).",
                        "Wait for a candle to close outside either the Upper or Lower band.",
                        "Confirm with high relative volume during the breakout candle.",
                        "Enter the trade in the direction of the breakout (CALL for upper, PUT for lower)."
                      ]
                    },
                    {
                      id: 'ma-cross',
                      name: "Dynamic SMA Crossover",
                      level: "Beginner",
                      desc: "Traditional trend-following using 7 and 14 period SMA convergence.",
                      fullDesc: "One of the most reliable beginner strategies. It uses the crossing of a fast-moving average over a slow-moving average to identify trend shifts.",
                      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
                      steps: [
                        "Plot a 7-period (Yellow) and 14-period (White) Simple Moving Average.",
                        "Wait for the 7 SMA to cross completely over the 14 SMA.",
                        "If crossing upwards: Prepare for a CALL trade.",
                        "If crossing downwards: Prepare for a PUT trade."
                      ]
                    },
                    {
                      id: 'rsi-rev',
                      name: "RSI Momentum Reversal",
                      level: "Advanced",
                      desc: "Spotting over-extended markets using RSI oscillator limits.",
                      fullDesc: "This strategy targets market exhaustion. Markets rarely move in one direction forever; RSI helps identify when a trend is likely to reverse.",
                      image: "https://images.unsplash.com/photo-1579546678183-a848499b0028?auto=format&fit=crop&q=80&w=800",
                      steps: [
                        "Set RSI period to 14 with Overbought at 70 and Oversold at 30.",
                        "Wait for RSI to enter the extreme zones (>70 or <30).",
                        "Wait for a 'Bearish Engulfing' or 'Bullish Pinbar' candle pattern.",
                        "Execute a counter-trend trade as RSI begins to exit the extreme zone."
                      ]
                    },
                    {
                      id: 'price-action',
                      name: "Pure Price Action",
                      level: "Expert",
                      desc: "Reading raw market psychology through Support & Resistance.",
                      fullDesc: "Eliminate the noise. This strategy relies purely on horizontal support and resistance levels where big institutional orders are typically placed.",
                      image: "https://images.unsplash.com/photo-1642390237263-1d5138000033?auto=format&fit=crop&q=80&w=800",
                      steps: [
                        "Identify major swing highs and lows on a 15-minute chart.",
                        "Draw clear horizontal zones at these key turning points.",
                        "Wait for price to approach these zones on a 1-minute timeframe.",
                        "Execute trades on 'Rejection' signals (long wicks touching the zone)."
                      ]
                    }
                  ].map((strategy) => (
                    <div 
                      key={strategy.id}
                      onClick={() => setSelectedStrategy(strategy)}
                      className="group bg-[#212124] hover:bg-[#2C2C2E] border border-white/5 hover:border-yellow-500/30 rounded-2xl p-5 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase tracking-wider">
                          <Icons.Trophy size={10} fill="currentColor" /> {strategy.level}
                        </div>
                        <Icons.ArrowUpRight size={18} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
                      </div>
                      <h3 className="text-[17px] font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{strategy.name}</h3>
                      <p className="text-[13px] text-gray-400 font-medium leading-snug">{strategy.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ECONOMIC CALENDAR DRAWER */}
      {activeTab === "calendar" && (
        <div className="fixed md:absolute inset-0 md:left-[72px] md:right-auto md:w-[420px] z-[150] overflow-hidden bg-[#1C1C1E] border-r border-[#2C2C2E] shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="w-full h-full flex flex-col relative text-white">
            <div className="pt-6 pb-4 px-6 flex items-center gap-4 border-b border-[#2C2C2E]">
              <button
                onClick={() => setActiveTab("trade")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icons.ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <h2 className="text-[22px] font-bold">{t('economicCalendar')}</h2>
            </div>
            
            <div className="flex-1 overflow-hidden bg-[#1C1C1E]">
               <iframe 
                 src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_main,central_banks,inflation,employment,economic_activity,confidence_indicators,balance_of_payments,government&importance=1,2,3&features=datepicker,timezone&countries=25,32,6,37,7,5,22,11,10,35,43,56,36,4,12,17,42,15,45,47,48,23,51,52,53,55,59,60,61,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200&calType=day&timeZone=8&lang=1" 
                 width="100%" 
                 height="100%" 
                 frameBorder="0" 
                 marginWidth={0} 
                 marginHeight={0}
                 title="Investing.com Economic Calendar"
               />
            </div>
            
            <div className="p-4 bg-[#1C1C1E] border-t border-[#2C2C2E]">
               <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-black">
                  Real-time market events powered by Investing.com
               </p>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY ASSETS MODAL */}
      {activeTab === "assets" && (
        <div className="fixed md:absolute inset-0 md:left-[76px] md:right-auto md:w-[380px] z-[150] overflow-hidden bg-[#222329] border-r border-[#2C2D33] shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="w-full h-full flex flex-col relative text-white">
            {/* Top Header */}
            <div className="pt-5 px-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[17px] font-medium text-white tracking-wide">{t('assets')}</h2>
                <button
                  onClick={() => {
                    setAssetSearch("");
                    setActiveTab("trade");
                  }}
                  className="text-[#a6aeb9] hover:text-white transition-colors"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Asset Category Tabs */}
              <div className="flex w-full border-b border-[#2C2D33] mb-4">
                {["FTT", "5ST", "DRT", "CFD"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAssetGroup(tab)}
                    className={`flex-1 pb-3 text-center text-[13px] font-bold tracking-wide transition-all relative ${
                     xœì½ëvÛF¶ üž¢Ì¸#ª#R¼J²F²—¬K¢9¶¥‘ä¤s¼<1D‚"Ú Á@IŒZkÍ³ÌKÌÿïQ¾'™½«
@¨(ÚqŸœØ.…Â®]û~!N¹ña0Ÿ‘ýý};×ÿ(ŽW¤»÷qãnìÅnMyÛ.¿íÃwÎ–ã^¿øHÆÁ­îfÏnî´ä?~z”œ)½÷¦*»®”¿‰|ÿ=©+f¼7	b/˜6‡Þ-Q~”ï,‚y|:Ü¯9ƒØ»u¯œë÷Ó¡úÞTŠSyçL\xì:
üyì’ë ŽƒIãC£=»ÿH|w7Z$ônÆøï¸ñ¡ƒ§¯o¤Èïv«¦šÖ¦2ë2°ìm^ÏáÅÓò#ë¥û÷6ùù©Ü¹‡Í¿’Ã`»Ó˜„®Cþº™iA*À`ä»÷6AlùÁ]cÑpæq@f÷>™Å™]7¶È`!€¢AøþµÖŠS–K X“¨1€¹¸!ù;áÉ¯7Î¬ÑnöÉä^Äp³MÁ<‚Ù7®Xz¼%š9Sñ5y¤®½|8»þ»;ˆ›ŸÝETŸ8ág7ŽÖ›#Ï‡WÖ§ðÙIžyÑ…ëøoéåC?ˆÜ!½¶ŽùŒ?õÏ|lŽ½áÐ®7}wz‰7%q;þÞ&N¥òI0s^¼ht[µ—ÿÿÿþ?U‡iµ_ì´„`†ž[þÖ:ÿ™|Ü%"¸gz³AœéâãºJ_íÜ:žï\û®|¾2Dd¨xé:á`L^;a	Ë8º¾ƒû˜áÄÒ
žJ7±7
øÛJ6ðÌotÃÊ¨8<ü·áÞÂïQc ½mÛ=>ýÈûÝÝhï<j–N·1
`§4î¼xìMâJâÐ™F’´Æ ðƒ0ªÉ…dÓÓÞt6%óÝÑ>#¬l¢îHFfâÅŒÏWFg¾3pÇ°ßÜpÿ!®¯Et¨5)Áºuü¹›{¥ì®`z8v¦7pcÝ¥èwdÔÝfì„7nÜ¤ÃI_$ÀùÚŸÉ]c4÷}\Ò6,lHÿ^ É @tØ¸÷‘Hø®í´¯Û# ØA_ÅÿóÃÎQ·‹$Vi—ŸfÜ¯Ó"Âr	0Ç¶¯wº/ZÉcÀrÁP¬×Õéq:ÖKéØÄzó	‰ÆÎh«7ºay$˜ ‚XÅ'÷ó²Xß|†-@­&ºœ7fÛ*aˆ ~ù¾2ˆ’]`-YwýPˆ1üŸ0åÍ~ŠQLüGºßé‹þ–l÷Î£Š™+ö©–¡+ø¹„fžP
‘Ÿ‚ÐûÈñÉ%å»äpìÍ"BZþxä¶¤«[§gDž$T×‚ÔÒqéP°üé8÷LbHeØE$ÙáçÑ$âqx ªœØ½	BXüé2<|¨ø~mƒÔÃÅ,èOó0t§`uô·`2	†€Iì×ËHDTûØœ8³zÞ@‘þAŽâÁ4Š	ÿ‹È>±ä¦C)7•¿ˆoDêÃ„—œãy8%#ÇÜÿ®yBÅšíFà÷Äá\qËãºü<ƒ•ma#Å§ÓQ €ÉŠËò4£pÀÒ`EØ:±S¼°ÖT ³nþútFN|\æTÇ÷¾j&hIþùO²¶¶ÞŒƒ7Á:‘[W@¬0Ž«é$ÒWÀÅµ½¸†£ã×6½éÀŸÓÖ^_®­KÎ_ý$=yöFzþèìÇcé…¿]œKÏ¿Q¼øàè@zþõ»×Š_ÉÇùùàoÒ§Gòó€k–Ð(€äüŽ…ê?o—ƒ×ó®I/y¾Àïç”Y¬€ ük	 NóäßáEÙwÌf¾+}÷•ùŽôÊ[¨xŒäs>˜8À¤ä—üÙØ¹våÏ½ucùëÞý|zt*GÁ_ç9DH†Ù€ýÉ—í|ï^ñÔ@¾@A8³EÐŒaÉ×h„î=]£<Ú¦ÏÑkõÂ6×˜Ž&¥"’ŒŒH.0:"¹À	‰ä
£$’tG+Ábf[ë)g‘^ç#(EAÏîbÿ€,—yñPˆË‡œ)P‘Být&!=|šÝ7ºT3é‰Š	I¥FB¥WPª¨QÜ…ÎL"º&¶’h¬ñ3Hàµƒë9ÏUœGü ŠjðQšû©i15yÑ¹_ƒVô™ˆj“ÚÊ†Ç.€Îuæ Ñ3*%MÝ‘žî½îö»Õ¯•+ñPÉû n"j”,.R€!PÎV«&ØU%‘¯2ê¥µÇ—9ž.X»L6zTÙØ¡V+ðn¼G	¾ªÌ*ƒJ¢ïÅ ßf‡°¥mÁuOÀêÞ„ÎÐƒ¥mÄA´®­¨ßu:nÖ÷Ös„ßà@•ïÙ[bÇîmL/pJ6ö{ûŠZ»B‹ùÉups-£u%*'ðÀ;T- T	ë&ˆ~]ÆøÙu£SÁò)A;¸ ¼Ÿ56î@%«½¤DMir4}Ž|aT*b;Š»Æ‡íN.‰;•xWö©ça0ò”ßJ_C7 G¥¶•ø¥¨¤3”LüÓé°tS©¬¦O/¢ÍÐ‰Æî0C"~ßf¿e%²F€¾îú³ÚË“ $?Ÿž«A¦"Õ6ÅAòÆ%ÌrKQÅ ð™'bL™©€õºR]äJŸï:Óÿ9w‘œÁÀÖsR·Ðù„a¨l›Œ•Ü]j;¬o~ø_Nã÷VãÅÇMÐe×PhTÈawHA£±FHqf%j4>ô•š®ÂZÿò
dhµpƒÏ<ûÀpÂ(Ú„Žß_l¾¿<"õ³«ÃõäÄ¯Ï³ï6
wüó_³ðüæáO'ù;à±ì(Œñ1“‰+@B%±(Nû°}&N<»·ïkT+ITG†8sº`\*ç[™BÄ§éÞàOÓGu»B5\ñ³ÁR‹_…ªRqc>C}j–tV…‡³›ÕêË£\'áh—›fq½M8ž“.ÿ8–d.³¾‚1K÷S³–¸¾I—iÿ4uñÃÂû"â@ëu§ ·mk™$wý¡ý±9£ÁO¤Aœì7¹‰«–1¹µ®BK%˜ŒnQ}¶htZ$/°ëâ+J¯¥tÅ0z­œ–Št p‚Ï®AïO‡›i82%i>›¹á Øf^]Šâœqç%KLÑ4ô­­?îmÎ4†¦‚S_:‚–KÇ	Æa‰ñ^ìøÞ öò
¶ ˆtŽ$ˆÇ W.À¦Â¹¨dK¥òª2'É+vò¸E}°è§¾£	ýñH¢–lo—Lç“k7¤x-G5D4ÅWPÃî§çéËÏ<µ°`æUKÂHâÆN¿	œ!L·ŽZ#«¢½˜º6)êétl¹r®ë5À³¡[3Üžà0ß›Z¯™di’Ü½ô¬D1.h_Ú—âƒìcêtã«XøÏ•7qG!Éã/oƒá¦a„¶ÕzœÜráŽšŒ]psj›ßW+=${F3#¦Éâ¬5ø@¿3o]x¡fd"
Ùç«~ZínÀG þ¸±ø…ÚÙ“ÒýMwâý
ÝÌ°ýæMAætüßP“XÛ ê [zPÙ%Â&×ßŸb·¸ö¦'5£Ð°+þ"|Šiˆyä†§Cxz“gÞÃ¹WÍ¹7ÜÐ?ëE—whx»”§k_¤
¬ ×”W67É‰ƒa3ƒÏ$rFn¼Ðm5ðùzê¦ÊQ)ªu®on«ÕR«³ª¹ˆ^,Ì¨‰¡JÚ‹Ä¡EMÛÜžÈúE/Uâû°EyÚu£­óX9A¥;>Å5î—úð]·ÛíwÝÔGDO9Ýaoë#õË§¹m]å6R1¥;Æ*Üª«“kJ&âm2†ÿéHA)7p!xKó
x	Þ›à& Rþ¾À&µB’Z4P~|"ñéçc¶v³¯Eb$ÌÛB¬!“ŸºÔðžˆq1uù.Ý/ì7ÃË©‚M?-­Oe¡¦„Áï°‡4YÊ/f÷¢`ÛÇ“Ñg©[èšÃ_ô[›[­B ,^ØiµÐK ÛË°[ÍßÄ,²•ïV…7ºå}	©Ðl(ŠõÓànä;Ÿ].Ùï FŠÐ…®û;y'
¦LYœ8HT¦Îtà®	X{‹¿¯ÁF_û9ðxM¿8vË£ññ›÷…î²þâRŽ7ù³
.7ý‚2ŠøÅ‚›AùÉÖŠéž1A¸"aÉ¼eOúFl¿‚ü@:OüÍEå%™Eáq½^!	Hy"÷ëzªÇ¡+î§ã7çäðøÝÕñùùôøÁ!÷fT1q]„	6æ)V	{½{ ,h¼E~Po!åìÅdÊ¤[Nëº5Ì¯q™OÒHš±ãšfËþ{£_4/ÐwÃ€úõQm6%H‰“Cz¹…iQmžUtÈ&±èÖ"]’H–’˜¤’Â(¡W¢I£0Ê‚Bä&tk0‡åsák78¾<ÄMŸtJ%/’Ü%ÙI€Çw”ÄwtvdrŠ2foÜ)“±ÎŽ„G²¯ÎI3›áÄAæ§àŽ€žÜ¹‘ÿÕÞæ¸óõÒïòHw¦µ||}“è«Sãù1ô†{iç¾ôµßjq1~¥hHÚ¢±eö‘nEÄuùs0M¤:¿\ÿxvqz|™Ù7„ø©0f
bdÊ‰Ï1ðªéÕ¶ 
Ö 4²dÂˆs¼bÍ sƒÔ}ëÝÀŠÔk›ôÆÜ`/PÏU©µ³D½ÅrÓîcj]`•2TEiù°Mu¿qòCŽ
°L,·Óí\4Š;i|c^^ed¤Ýâ9v¹˜À,{+¯lç¡CeØ 6Ð… redGÐ…ñ*¥ŠORšäBV§¥¤Nâ§ÒÓ×Gú ûTB¯
§£Ÿ{±ï>-ÌP‘Â,ôÁéÑyL‚äƒ0ö¾+K^¢£	Èa•ARRBŸåÜ±0U–4íIbÔ§À4Ëƒ+³Ãç\¦üÊy—É`Oƒ|çgoÏ®Ž~;¸¸:=|“CþââïµT‘NSF Îð|´ˆï–aÖÞ’ _†g›;9YADÀ”’”Q1ÏŒ¬4/
h(²1çI¦>Ij£Š;&ò›^]Ó!3r„&Úô>Ù…Õ
åWgï/Þ¼©ü’]ü²¹Z,ƒyˆ¶iY‰å“á®:]š×L `?w¹xÐcâœ 7ØÚá¿²a*³ÀoÙ(ø÷íÿö¨Óêl¥ÁaQ–æÉ³{Ÿ8So‚áÇk¤ ø¡AcŽ)2ªi>úeq¼E8í-Ãç½FøÏØ˜øy ‘N»UÖaeäÌ¿É‘²<u,-WÙúË¨Ô•ÉsÅ‰VQ*fvQè)Iþm§÷È½»¿xÃx¼ÿÐnö%<XºÏ%\	Q mF©xn@u]ŒÊOå’|µ»í^{[²Ê…áñZÊ„}M”-Ð“îbƒðNµÜaOW:…1>Nc:w€¾Ïø	”›³ßN÷P%«ßªé:LÄôK$@"ê¥{öƒê =ìtx‘¹äª¤ó¸ð¯aÝÐIÓ‰s3ôâ19rÂÏäæã;•d’ÁR¯0÷¼ÉÁC…ƒýø8Á÷¡OÃøÆq<‹v77éÉ¨9ŸF3˜Æ$ÒÉælÄ«vûÅvo»ÝÛé·½Nk«ÝÝnwÝWˆ°û#dÂñ÷#/ÞL}ÿýÖ÷wû[­ÖšzQÙ¡4¼4>öõ­ÈÑÏËçÉéí~î43)´[}¥ÀÞnµÔÕuøáøq0&Úžð™l¿æ;¿/ôiKXVÃC7<€F.ökÓ ‘œÒ=©QÌ(TÌ¥‰Y.c ˜GCÚÜnÒhj/õª‡Z>§‡h¯à;á)h|¿Àò‹œ“OÒAŠ
AÁŒPKÑ¡OZ7)É¼Êrx‡óó(ÙÑ$_î»:;2ü:‚1™Ñ8“©¬Î}øn4r;½ÁGIQ³¥€û†¯ÙwM\€Ÿ7¥ò¸:°•!dÉ¹”*ëe_\!%I•ÄñRßðŽÑÌÏ&LõØ÷ÓØó	]ÒÝ&îtˆ~rJ?;Ý!iuÆkÍ7…”V‹7î&Â°÷¬9E‹B²¥€Ó³îpóý4to¼ˆFLÏ0üá†1\ÐG¡Œ²¨ÄŒo¯[¸•›óüú<ëOXâ^n-«3ý°!K—`¦JAÉs´¶Ê*,?QÚ×_b±´ëÊ8<¨A‹Ä‘K`} ~Ò ç!LŒœ TáÀÿ‡WË©"d$NÄ(S0zh+·<Þ.é.3XeDP.‰1ï†ƒr 4ÏÔf'« ")ŠC„‰×v3U*!çrÑau3;S]Ø½Ž&Ïýò+»^ÔßÑÊú%­L‰ÁAzLl­­gY8<ûf}ƒG%iÝß ,á/ƒç+¬¤•ì9ØR†‘²X¼+¹³›Üù¢`ñcRŽR0îYBùÍéÏÇäìÝ›_W	#	"6†0Ì¶,Æ+cø	{©¡ÈBþ¨à[)™)"å§CqÂ:Šl¬4d°.˜Ëô~å”¬buKG8QÜŒæƒEõO,¢rR{^åj$ûnrRÜ}öÉúm?Qþ(:¸“]'DÍF£F€Á|ŸrKGÉæÎc®@ùïîp—bA¾3{ƒ1³ #r«Àd˜™ØJå3º;léÀJqQó
çñ"‘CzZOPþÀt	ÌÌŽ˜LÖÉ±ŽÁÑ_|×ŽAªñÝ.®fx™ìF;~AþD6;(] §"“ tWŒ+FõÐNé©~UuÉ¦¸±½ÃäðìüWruqptúîG³ÇdÌ1#«zLþ=&‡°þ	_ýÓe’;YÜ‚U¼#Špô=7‡ö9ÚÝ1t‰¡ÕþfTggØöìj!„|I~:½¼:»øÕ¼ïÇÀÃ‚p±º=O·n¿u{Wmçr>öåvî
™D‹¬¢R™ |Øêé9ož(ˆ€I(ÁæUájhÉK…mXØÏ‰]Jº¥;¤1ñeXÒƒƒ0îÄ¨Èâ——)VËòð™N1|&OAÅh…¿‹Šº‘d""+-dg¯‘½;!Ú…Ø×ªäVU*—„ÜQ”…V¼Bß†“«+²IOŽÈ¹çûe‹p)JŠköHV˜Y½t1”å@W3Í ]ƒ©É+Â‹Ycœ)ŒQ¤)W?ÌK×Ò€|Ú°ø^l‰ïÆŒ–ÊåtÝöG!S_1Í‘WäfÌ5I<¨lÑá•%è)ãŽŸ VXë?¬øî¯Vx¥XU;älLƒ .¡Ùð·;ø|Ü[îZ5@½I¤aå…¼w86™³)JýY$;-Ya3#cl±Óît2I¿(-àm©²Û¦
F>Ó&ò¾¦‡OBÖ[ÛJß1‘¥ƒ´éB>‚$E<n
HpŒbâu—¡”BçTŒˆ(*hÊCRÞVËóOjÎÑ„¶J.È] í¾*š·ö’"nœ"î g¬°W`8ê&+½†Å*í9F'ãj¥LÏdÉ/o˜Ÿ˜ Ž¢ÕZ ó–Ó½<å+µÓHjæÒŠlÅ4	À·qú"FçèËßÒÄ¶Ñhg‡a\&!ôóB"ÀÉ(›Â sv~üNzA1#ÄW•'–÷£jÉZQ5û¼Uú)yŽÀéö‡Öo­ß€$üÞ\;õÖF§ßßhw·6ZÍþ:­’"««”—_ëEÏ¯¶Úüu_a½ßœ]—ø™|Å“Yý«¬ùî,Öc4(§ø¥kl5–@——=:°Tá–r?:íTõÙõ]ÄñËØ‰#rè„Òô)ÅwêÕ\Z©ˆ}í!ü9ÎDR^/eï‰`6÷•iÕªUfOHD²Ž¤•Ž&¬¢<J»£ôªŒ¢3«>K°qL´·ŠÏ¥@[ÍçêshRÄd¾$Z9÷ @Ï‡íÒÙ ÝÒÛ ý²Åûâx¦hañ÷5ø6ã%•JNœJ¨lÞ#6Ènk$¨Vz£+)„0±.bIîª6ë«òæSL¡ƒ(Ù­†’ª¯ÙªŽÝO¥êËïTùç,Å*Wh¹T~ËÂûr®Â|;aM¶l{t‰%³;êp[]ÉìäHj^£ Ã5ï}rëEÞµïb%v.©Bãpq3:X^&ìëxQ0:ÐUpäaŒ;–ÕVIòüíÜVËæ´››¢²ô.˜Ì[x™UAÄì0”F]Œ}íèJ&šõ¯â´ Í-ì\±®Ö&O°¡n™i‹ÓáZ WÇ»êvz’g-B¥”ßòsõ>Þ¢lþ˜hä#‰õ;­n4äyk.¦5DóÊR€ðä.O¤É¡¹ê‰¤MŠüýâMiÁp(Ù¦tsÝÓ5C”Q2Ä› Š¤cÀŒm9
;é ˜d;5«Èa¤âŸÿ$ÏÄkV£²B0çn8`ÕúØ ¼<Œ¸Ó²Æ½Ÿ¹ƒØž³“qœ	í…÷'AÉï%õü{7I»ÕRšÍÏ˜öº(Lõ€ÎÏÄ0¢þêæ&(Fþ`Ž=` Q¿•ýà'¬Î„º¯kHÞƒÌæeó¼2ß[D­ipÿÂÜàEMøMWxžX>ÿßfÈ	g<æ'M2êÂ…=ùJrn¡ŸØµ§xÃ_éXm²p¹ú(«i¾ú«´´|ö9ßÏß3 ˜ÃJÄÙ©ÄlæZ	œÙJ‹™ŒJƒÓ-ÄHËZŸìº<ÙõtÒTä)œ{ÕŒ\åò0üB}½ÉFÖ)pÝ;ŠÅq„»ÌÑ’"¦dðH7eSþ!¦ñ´äœ0ÜL·È%ß! h†E$Èã [-aòÂ:Y¬¿dox¬å¾ÞÚ`?\Ï¯¯mdûr%3Uz$.èpLÎiõd¯vÞùÁŸºX9çSK##¯œ½,OÙh9ÆóÐÐžœügõ-…z—¸Ö´L*½[,ûÄS£ˆòJñ´ñAØ¼×Ìaz_a.Á@$ŸÊió7aQúp†uù€í¿á•Õ]»„"š«Æá",O†àt9»“Îý6ËŸqµÓß°Hõg7}®eœîp‹ ç	/Ö¶|á‡°CØ„‰¡p·Þ¤rå¨t¯\¶+±Ù,…i¨Æ­¼…K%¯XñüØûé•7ìDEaí_Ú(u™†6¾IriiÁŽ)rÀ<¬JŸ•ìû±Ý¾á6ŸQ!5ýýz¾ÈŸ8¾oÕ\e`É bœ¥ àt.ÃànšŸ]äÂìrgfe±ì¦»WiºO¦ù'4­ŠucÄEŒ¬µZcÒîLHo'ªÛZç/ð: §ó@xp§ð«¶ò>_ô‡É+ Çp€È\Eãõ¿ÝÙ£¶
®.®á\[­	ü™´§d>ã„‘Žü é˜›¤»ex’&ùèa#ÀH[Öã GgÏn™„¢T?þôüa[oÔuÐz†—˜\ïlÐl·Ç1yþ0ÑÞ1ÁèíÑ'!2qD-TŠò	ˆ“a-¨ ÁlV‰¢î6oš¤ÓÙíww;]òÿý_Ìo,Ÿ>Cbà¦,&€j*€avh…<l¸KekãÀÆ´ËéJmmMö©™¼oE%Ø1Lõ¹dT5°Ê‹™Yn˜
sà6Ê¨(a¤CYçƒÑ¯‰€¾½H‰2µ&J´Žœ²-û©E=k9¸—t²'ÎfOÇú¦@_	ºéK,_a»å¼èó®>TâŠË¾ê‰=b_šÁHœåD*NÂ8ŽE Æv‡TlÃ,³+v9 ÆGÞÔbŒq0Û]&ÈoÐ_wÉZ§1ôn¼xmƒL¼é<vs§˜õK8¥m
‘›Ù¾³8³#vg¶æN?¾¦9†Î"?`áH!¡Ý3Êáñˆ¬æùŸÃã“™ž­DÓÚG8x±*Üôß‹âú+<¦K²¢>Þpí1­vh¶èÏNB-Å¾è2ig.^ée–D\§^›BR¡ÆäšÖÃH#\X9V©£Ü"¡p™ÔjÚ9È§V`ê c$Ônoç³"’ €¡;ž¶«Pz˜s’-¼.IÊEp·Ë{Óf ßn`ÿÆUbèÔ9›Çƒ`ânríÎ³2òúâü¨P£ƒ»È&òŽÝö£WŠ_0™ Y%g)w,=ËøðHE7žäS*¤€èF5‡ë+Æ‹sä€Q¡ †qÝ´/xê°LCáµ9Ÿ¹/Aùµ Ò½Ú ƒ4ð£ÂB=pgže5ŠäÈ™*>K* †$*]¯ˆŽôøAZÈ%ï©[¦8‹ømÕÑÔº¬€øšªÁðËV¾ìZ ¸¬o®Ø"TÓèhf‚øC=ü¯H¡.m‰•Kˆ«©3,”G:ú§àU’U`¾’âR|ÂÏç.ÿWDò˜è/<Z¬vµå®ºÖ¶£Û’P«*?xeÇ¨às”ÚžiZ(H?HþHjR$‰µ‰š~RˆEŽòˆ€/,YVÑ²ãôÆ^`ê!>Ý5údœ•1Ç:¥UÝ"N[£¡>IYâ‘²”¥““ÞQïD—²$=/a¿ïgIS§œÆÄ’ŠòiL]ÚBk—?~„È°Ä ÖÛ¨šhg{ßrR€´cO{§ý¢]*#–Ö+Ä~…¥ba¼5!'µ<cýwƒi ò2›t¸¬$^U^÷PöÔ‹ÎðJ”¯ÚªUåZ–Bn/rY3ãÊ@‘ºËÍ²´S­Æl+ãY’uEÌ¢RL°œ­Œ/kl•O[Ñ}6wé(ÕíM%]ÓTÊ'.ÛÆ¡XsˆÇ“v½ÓÊåGZY!ÖhGVF¨»“+#$-?ÒéˆéÄ¡ºb÷þŒ>.Q€¤ó„$lR[ðÇ2ÀføÅ…’$âlFL~
Äî×˜øÙÈ o™Æ@/KrIÅš&0%ž:NÓ×8”¢I)y6ƒ¤1åeÉ'2ãÐ—/q’V4±(£QNšô$iø&¯¬Wµ”IËº”IV¹¶Š¥‰<L‘LRöää¸Ó;üH4ŸÝ$7¢eJ@`[DE•¨ka5¦-ãýSêŒWHé,z˜xœÒ³$dLû¨òòðw0G]ö¤iÝ‘¾^†®ù›µËÅt0ä´²^ìÌùLf¶–X©iEÎ}:­ÆOxá8¸€ÝÔËxž«?ÓNdÌDÿRäIr…¾‰IIÜûH=•*Õm
Ó-£à…PÂ²*ùÁ—4i×¹öÝÕ¤
#©Múæ8˜ŠÜ³¬áÒ¶-üŠSed»N§£€¼v¦S	+êl…>´š­Žª8G./²«­‡žèÑtq#X7Ež—EõŽD’l)Ëöe»9€ÞÒ=Êà¤Î`•OBmaÇÖ»Ù¦T¬:-{[¨4&~1]ÆÎtˆyâ¿z®¯Î2'«×“0ŽÚËdÔñUŽ<¢GÀprõ„nÛãÃ«Ó³w»°náóhíao:›ËlDÊÌz#ö>ÝŒ´¤ÅõK°Ld¡êzJ•ëX{)ZÆö6éðU*¾d-2Ã@‚Mµ—¯Û•ï¢BV¡æ±”î$X“ÛBñÒÊŠi8òû•ž*Ö”N n¼›OÜÐ j >¤â´ÔzXÉY‚iªôPM§GÛQ´7;„žÂ(q@3<!+øYØ=" 4»=ŠæRQírû5˜)wËß:þœvM„&¹*`¢éÜ‰Ñ/—=‹QÉ>™9aäžø×Ý&çoÒ÷­Óˆt•ú›—áà…¢¬ðÉ—Õ6fK;€?'å’ü©ªæÑnz:~ËÅEž¸ Lqæ7^Y˜4©úÅ$œíj {´} -å/?ío0†{Ýp¿vLy,“ce·KU¹‡
Ì|þ?ç ü‘óe%y	†â.¸ÁNÌøB!‚/M
Nc—Sy=’ýÖF¢mþÔo±_ÙïìD‹Wu˜Lt­“õÀYh"pÃ™ÄýªÆóTDSÖ)œ£óQ=Yrh%¤›wpÀ²	Ž`ï7†o¥’bJËP¶)™Å¹h¬H¯HÛï9¾¦%ÂH—uq9»|˜ÎAç°Ûþ˜öËIUæâ~Á¦Ib”{Nõ
Õ:(“ús¤-¥54%ÄÍ~5Èd–”ËˆzMI’9
œ€,ð9õcƒ_;þéô=æ Õ„ñ	hp¯1G#{y_ÚU!à=÷&UZœ‘Ô~‰­PØÂœ‹Ð¨ý¢ëU¹5’ý5õ†½a®¸¤ÐÕ…^Sï/¶»B€¶$Ntbü½—m­ärGØXÙ9ùàò}%ßUoþ&ÛjÃÔ’ò7e›±€,˜M-¯!Ù$Œ6ÿ—ÈyLŠú_Ö—Ë¥Š§(R#”:ªJ'\ @G.ÙâØöåª-„Òß.Çê‰7Ý¯µ(?qîñ¢âª ÎrÐØ‰³y›\O§%±ÕX 01áÿœÔ)PAÇ	‘±&Z…@[ eØ>SËµ+J}Ÿ ïõsòžvS¢ä·âÝþßÙ /àßýDÐ;¬DÐ›DA­*è%óù#½¤²
z0£ 'è9!¤–ðz__À£‹ö—•ÈtÕ‘w« x{ãœ¤``M4Üz:æ—ø?0¼éÂæ~L~Ä­dÏòzz–'éêúNu }Û–Ç›GòF«UéE[.£´0Ú&£î’_NßYV®dd¶5ØÙÞþXòJdW:Ym¼¯ògŽŠ/ìea;$Ã*û «–WÝKÒŽÛ"Nu•JvhM½\å,ñS¬Ü{|l…Ä’Y£³Q‚©6EçûžŽx°ß/Þ4Ò¹TªêgˆO‰Ü‰GwÏ$¦ñTÂ6|ç"÷¤ñÙ4-h™¢z•mþÊGË‚!‡¸'~(¨ÕuAÃú+©üˆWnJ³¸„®÷—˜Á"š7™ONB‡†raW´‹%;A>“^yTòÙe€©/7ÊiÉÂõ}Œ8½:»:xC.Ž¯Þ_T *ìiª~¡¬[4
×Ûý%ˆ‹^ˆZŠ‚÷e6g{?‘@m®‚XÃÃÆ|ÒÞKw?ðm÷Çî7évKõ0åvÓï¶6|Ü¹ºÃ]òæìò²
óú~GÆ¼“++fÞÉ°íÖ²	Ó	Ø1Gaÿ¥œñM¹&ÖøÄxèÌ<Üíð</úüî@EÍl¶`¶ÿõöYE-ç);V™ÃNÜØ:±³K—róÂ½C4ŸLœpA<±Šá³O>–Cäñ#I:«ýŸˆyèR¥åDTáÔzHºÁx({Ž©a­ÔØ¸»|§^“ÐRYÁHÙ=ñ¦ä¶†Üä4Z"¦qDóäØ@mÐÇ÷¨ {m" ô¤90õÎzê'!¬]# |tùhÜh“œN	7<ä:tÏÄ½RˆÔæèïa»–QRŸ¶s<ö"ˆ¸…#<¹ãÅºœÁ`(¾0 Iø&@u˜=ð²wÛLxû¨öz=˜JèþcîçhZ#÷Álæ/Ð”Ã„#ür øð€ê<vÐŒÎ3tÏÏ®;²Ñ€,æIÄ7 °Y˜œ2—Žl¸*7Ñ`™h°§­ÞÌbÝ0Âzí60Æî´}‚îeá/Ìm,d«q pùHÏbì-s!eSV_gäŸ7Ÿa…†!fpå#ŸÕ6”_íTÁÖ%ZLá/6fmC>qÅ|¬; K]Š¨‚nëÅ`ÔË\èu­Q¿Ð4ˆ;‹2I‰8$†ÅžH`­š?wrÍÒÒ¾giW•d¦›2»º.B¸ÐJj88?ó+9x{öþÝUQì"K@#W§‡ÿq\jLgê<øß$ç”'4}–Ž¯Nß±Ö«äçÓã_ÌýV“:'‰(l!É¿7>lµªµ[•$äSXFä¿fSUÖ.®J+UÑÕæ
$tõÍìV×UÂ+Ø®Zª!ªr˜2x*y„¡=ä°œWŒ(M¦Íÿ5ú-í,ÛoI‰þ¼)sÇMŠ(h«iy0©ÂjŒ¤mQËLãaLù¼H¹ê‰lù8¢mÉÓStúˆ»º[ö­vÕ•elðŒÍ­œ9¢\’rŒº6‰\ÜPið¬ýÂéQqÞ t½JŠ­¯¬ƒ tÍŠ%b¾»Rð{ÔõY©UÌ¿ÆšMýîöNg«·¦/Ì¢ŸO¤O&ú1,ôL×¶cïÄŒOdƒ^9C;"^Æ™À¾é!­Ÿ–‡lV§=W`ýIuÇ6ÈÂu°@Ú”Åc!2Ã‚´xÅi#qÂØ|¹g©JC•82EJ8ê’]¨#³¢«†ç&Í{AºÛé‚,ý±,%­·i-³E®‡,°
’¶LO…d™S[¾àLì°²n9Íc8•qéó|…u7E†B9”|CèQ¹‡HNNÕ¾]ìg‹öÑ²E–]ê¶Êå,²ƒÔeEÅÌ]Ñ2tK¾Ã‚õú úAª uZe"˜¾+à£™7Åºyà§Ñ È%w @½h¾N™)ÿ\•k¥—h –¦óŸ“³S‡4ê÷)Éj¹˜“ä³èh‹€ÄÖ Uk#r7Æ>lŒïŒáT«µÛjá£½n¸ZÝ¬­üÔN§ ðB*Žà:°ÚtE#«éZ“¶
zËJ`‹¤HÒ»FrCÚÃFy­Ø¬EycÚµEu‡mo¬$å¼­[œÛ›TomÂ^§îf²²N&yØ,ÛÑ¤<]ù¸æf&ÚËÒ*í¬Ì»¹8{åÒìYYY}Ùõ]SÕu}ýYy…ôXž6©¯Éß·ºÒXr9¾ØÂn+g• JÎ³µžLÿ¡<,ÒPÐ$I†9WZGF35hÿh žN1t¯Ób|EMþ¹FšÄþziWrº YGrö«¶|XÞ2¬[é‹4¨Ä+²tùó3!º‚ü@Ú«Ž°ÐÌq·8—R—Ae«Ùj­•øU©—`‰ç9_ÀkIç£qhWÝ¶jO!€´£K-é,IåëL+é1­d§`ÚNËÞ¨¬i’Û’‹†ïZÇˆZæŽ±Ñ‹<x–Žj¦a…\zì·®nz[oÒ.3¯2'k‹fÙ®mõÚÍ­íîVw§Ó_SeÑ©IÇrF6é7©Éž¨Dµ·h@£ågýkU¿WÁ¬r Ô·‰¸÷^÷á-¼[Ž¶Ò™tP^;?~wtúîGÊ‚2,ß,W.Ù7ˆæìæ­XÄ–ò;¾ú—YA«SN5ß×œðZ£±KÿS£ÂR†[ãÉÊ¾iÁ9}öóñÅ›ƒ_ÉáÙù¯ÔAÈMÞž¼Ñø¨ÁlÑà‘²Ê|˜4•»©VßYÔªøªû¶¾j fíž…¯úšþ×tVE{æ¶.ÑKËd‰pQ»³—Nµüòeó>|÷ÂuZNÿ£E.µ/\e²”'\kg—zÃ‹F6¿²!dLIIù!ì¦$xI21«*w*g9¬M9A³º–…Ip¼R!_5|ã›¬„v2gvâ‡§µH* ð($Iô5]›ÉìuŠŽéÐà‹Ë*H±‚Ùn_ït_´l6tÒo°\YOºÒ¬(Âbi±Z¯áÏa•‹§ÅWìÍ4dG”²Š1ÄÊ¸¶KÞSJÒ(Qx8œsBM3¸k’c'Z;gAû‚s±²pßK[%‡ É<“,Ø¬$Ýk-@îT9M7·L½/ÇÁ~Õ#=?w§ñ/Aø9ªÇáÜµ$å¹:1ÜÛƒBXˆU‰ÈÄ)Î‘³[ÓË`4B	¡'Þ×¶#ô0[ ,äçûªê&°vÎe*c”'ŠvÅÐå£3ÜØ Þð^™–Nß&"YB:¶Á†â½»’Î^aÒÚ‹ß´F~ ¬·—•êÜz7(W¯m¢ÇyŽJ¦-j–Ýƒîa¯#j–ÄQ+ÖçNrÅÚïmÓz'y?ú>s³hS”§`³¨{&¬ÂQ¬9Ùa!'|åhI™PWxÍ0œº{Œ _$oÃÈ-Ã«´^dß½u}¦(ÿ|z®sýK`™o( Ö•’Å$—„X€‰¡Â»69JÏ0óÈ"ÍÊ	mhF‡O4-jzíðI†-“=¬¸%¦€þr±SË5äâÁ»w-rU¸/%ÝôAêÜÜLÎNœ{>b‚¾Z3KÈLÂ]–ÿ®‹„T-OŽ7´YP}¡ŠHP¥ï¥Hú£ê/\&@Ü>››6¨VµrYHûNä^wî†¿ÀËL´«Z”ƒ”ö}sVWŠvIãéÃ5)ð+¢>³jE_¨¦îs_ ¢“‰EÀì¿48“÷<˜•‰tÊÚ¶L[eæYÀ"ý6‘óÑE›¾Q¿‚¥•êr‘bwhÙ¥=oYíðÿò‰<>¾4Æ[é^˜äÓj^èQdýº%6BQKÛ7èReu–k’d()‚2-:`ì¯£zS9Á;{SCLã6®'¤O—k'=Õ€­É´:yÿæ9?øñ˜œ_œœ¾9&ß“Ów?Ÿ^““‹ÓãwG—£6]ß5tš)5˜Á¶1[%CuV‡íècŽ	™Ø†_;!kµðI×kY.©¥þÁSVÒ–+²Ö5å†+›%«uj"°²æÊÅHYo…ò’53Ù2cª»Ì›TCNk‹³e/šPË„ž½¨AŠ®šÄhj^%º>Ö«‚e£7j™Œb¶LÒÅä kÊ‹šê“Õ>ajn]Ù( £I.›^°¯–öXY‹ip:3òœoÇl2LŸäbMñF‚ÂÆb=Ùuúº™ƒ‹ê^ô\§ÕZ+‘+áè›9¢™‘&>e¼é-n–ofØ|þÐ%Á„<, sƒç&æEo`IŸó–X®Eú^¢j^ÄAø&`ÙæÒ¶Œ%CHRa&å"Esö5fíåK¦U²X)2ãÆŽ:}P1Þ]£ÓÃ,ÂžØ''—Âˆ]m–dÌ.Ö‹“©¨R9¶Ô¥+Ÿ8úaiPš÷©†ìµV>äÖ2CJ‚
ÒÝ’|©Õn9•WhÅ·NÒHeG–Åšž€·ª¦è‡™Ï¬wNÓiMÒ×˜3–Ãu›LÚnÊâ©©¬Ô¢ Çéj|qQõÜ¾îy“…ƒ}á‘Gâøñ~í<w•ÁõßÝV!‰Õñ-Û¯ùÎïíÆ6µ?¥vH.íõ$ÙKi£míK–¨¤õ}±Ã2›ç?i×‘0˜Ìâ:oq:Á
äï/ÞP=™yƒxº»êÒ(x`ÊŒ¹Ž¢Áyºhô”ú1EÚ#¥Dwa0X˜“öÂlÁ&ÞU§‰îBµ¾j(.ÔÎ*p,|ì‰RÄ–Ùn·òÉ’/úª°Æß:Bà[^©hö5©nºjÀzõXKßKB÷òB&wï’žbƒ;ãUsî_5#ÀC·ÞØ)&oÿóŸ¤ÖÞim¿ØÙên×t-z´Åó.Ytã!Vu²®›wƒÎ@¬Ž¡hk?"Â¹²ÿ•Î³éáF9Z±0y“¤j¥çIor½wÐ{í\í%$Ÿ[¥ð¼t€»FÅøKìLXmS]Ãv†Á6Ö<DÌá ñhÇ=úáÜNjåvý³R´¢ÝåÛ°	±PRüíüBFÃ[I°JWÑl‰öŸÖð+8CÙÐÛXˆÈáÉj©žSF£¤‹ªRDz€>ð³z#t´—(aÓÀÔáâÄJÎLüTªz´SŒS”|D·&Ÿ¢…Ò¢¿¹ì3„âµÉwÜfeòû´XÊÒqÒø¡"¥Ç¢²ÌzÀè-ãYâuÚk%ºÃ˜y1=Q#ì8yZzHÜ"!+m–R`š#i(šÍš[þ.èÎ3ÔúÒA@Ïæ@ÜnÝ	-•hÇçÔu0ðfY-|?ŸŠP¤+ˆÙ,ÔyKF­P«bµªì¼ T¡á¹ F,	ƒÍv†îºÃçW“!±aSö¯wc1¶%ÖŠën©•‰ÍV-/¶µ" qû!°6¸öÿ(¸þ§3û/OÎ®$SÁêQ5Nk­¦Owh´	«?Ü5¶¢ÛyïTET¥Ðée3²÷FÈBR‰˜&ßŒCfª¸h°ÈcE²þ6:¾:(–eSoæ™Ãð|5¢nwçc.H2Ñ°ž›•!Ê‚ÊE—¾Ÿ9?”PÅ/%ÀËU`U«ÊÔ…-äÅ‹*eÛ·Y^½ÜâÊ£FGLwùSûV‰±'ß aêOÒ6} YtNŽ§èÐ0èíÍšmnÖLŒªªA%+óèÎŽ¬\}Í&']KJŠm—4N\%@ÞOÅÒMXd¯^)0”4É¤™›u®LgªN”ll¼«Óy*¡°t6™&¬È¥©½üéôÇŸô“0*´’g¥~óÛã£Ó÷oïV/ÍÒÜL&ž_@JÒ
É-µ—i…ïhºdÌ×@$šÅúKÂ‰0i=KÓZF°;"r½ ´ºôØ%Î­ã1ëÄÞ³+K^IfZØ…YC2˜Ûö­Ü†^Úq0uSÓÌ÷ß“ž0"a‰rð$‡qòC¹ô›`¿1ŠXÊü¹â<re²%2•Š¬v"¥ÑðaÞ.•A$4¢]€þ¦áÊA£³'ér6ò†V“=Q‰¹ŸèÂ*j¡‹jä…¸¥þüÞò¸þ	Û2æîšqvgMk3ØÓêÏŠsûç?É3úæu}Z±pÎÑ£‚‡ŽèGÃ÷²/<Å±u.L’Z3•ó*pÏêK<v»ðíPk÷0ÊÝâ ‚†aªnf*o&/}(µ”3]ÑÝÙqû9Õ¤ýb{kjÈìÃ4‚\hLZŽ7šø,B +)¢›¤aksèwªÎ‡GåXïJ¸Ï·ÁD¾1ZÎ+PÂã	HÄC7Š2:µú„ˆÊâC¹õ›Xí?E†9‘A3êŠ„	ru4FÎ @ªŸƒø>½«¨[_ÇfIE\_ÃJy»ðÏh¤(î•|¹Éÿöð,7´IB°$æºSá5+?*2Ékî6¶ZBÿjzfÎTe‘ZÆhâŒ„Æ;±«‡£™9~ÅTZƒ¦ÿÞ7¬Í ¹‚êBÏ"ùèÚ¼’Ë6Cõ¦ùe¼À=áÅÄ›Ì‚0v¦q¹¶€È01Û(o3ö/meß°Û¨±Ô‚ø´ž›LZ…h óË#/šùÎ‚$%DõÆÅä-¢WààA`ÏxôWkƒt×YÕˆ²VDqÊÚLåƒ“4ÁÐµcB)au°)±TÁ’ƒELÂ$À$ûDøæ‘7Öñwÿ¥£QÊ¹‚¹¨·e}h}4jSù	LÝ;qÖOg}èf¡{‹“ªC³s›â×5±™á:ù«øBvÎ¬ÿ	ï<rg¬Â«­ž~ö­C#U³8”ýL‹Mõ ¯ßÕa¬õõ¤p5ŽSeþ˜<œ›%ì„
ØÖ/Uµç“ ð÷²ÕÙî°žvVÌ‚9-jšG.*ÝOˆsçxIƒÃ£`Pâÿ×¤†;&ªma.Wº®nx¨<ø^[ìŒJÏW ==ò?¥u0Fsû+%=OHÖ§Jcƒ@ïÄƒ1©»Õ…íŸÀw“˜' ²™0¸g xW@á{K#GÎm6nÒuT9^ú^ëÝau£É¨Ä1E'O•zKæEè¼(,ÈdÏsµ»)`*H.,’hÒÒ„êAhøÌ‰˜¥XCúj)QMv˜¸<; …£Å€ðHì°ÔŽG9éº0L5iƒþ"fÅçË¼$¤h:¿1Ê8‡¸iÖ±K†\¶JñüÎÃ¶I asòýî=X…˜¹®ß™²çºŽßÀÎ´{pTlé[øvø¦Õ]ÏØ>}{LþóìÝ1¹<~s|xuv¡Ñù«”F1å	D_ZÐ–Ð2¸ÿL]£Dº¬ÎŒh|¾Ä&¼…å(*Kv^y
T"Æ*gPcif*ëˆRÂr½ž`iN{ÒŠe”%~ûÌ©bÕ cp,Å1ØŽˆ2#•‘Nw¤íþ“a*º”¤¢X®‡˜cD3ta‚’²ùÛæKX`ÓnâžÚBÌŸ’]ß¡ô¨&e%ÝYêÏ³êðÒ²Ò5Ú;J“F»éOIeé¯]Ë*K§’»0pv¬a5øu}káXNÊyÚG®½¿:\ûz_h'®è»Ý¤‡EŽ@…ûÌ¬•¡Ëu) ^ÚoÙÜÛÑ+)âËI —nQîO9öïè‡1oHS%9_G¦ò~G¼ÒÖ4™8ág7&î-\>™ÍW»¦eÄbÎàë¥ôJÖ¶dËYÛT°* ¼}÷læNEÇ4ó¦[…½J•Iý.c¶ƒÆ†IíÇ38ÔËœÌÅ„Bë,AùÇTò(¢êÜÀ¾síú¥å†yçwØ5•>mj/ÅØ½M:@G³X1­$`Àœ@ðJÔÞ%Q"7óÃDžR‡kÉØ+Û4Am]Š·ØÌ#˜‡ÁÌ¹¡¾-àzò'R@,ÉËö‹ÙxùÄ5VÖ´]ð\8¬+scÒÚ|Õ¼ºÝG‰’$ÖMsí1ãòJˆ;$+À!~Øñº½“¨ Y5é|ð;H‘’ZÑÂaŠ3¡V§'rÓ§Å)›!Ž´Òû´[ÜùP²k2šv©õÍ	µˆ/Ü#ÜiH7cè©£ÞÁN'Íý®Ýk÷Û/>¦ªE¶IEç¡´æôd˜ü$$¯¶•;µÙ×Àß)ÂMÌh``äèv}Hgîñ¡ §Æ®Ü	‹šÒ&TVíV½Ï×ÆW¹ZÀÔµŠ˜ÃÞ—àË4PÉ‚!ëj˜æ
—æjB¸4
±q%«Å>%IaOŠ@ÒÊ89ö$Ñp–
:úB¼:fRý2¹½ÙÑ¨%CœFo¨–g¤«_ Jœ¢:©Í÷W[M	 -ÕÌ¡cG*-iø­aó™Ø¹<<®ì› Îß€–‡Œž{È¯Ùg²ôË™,ª™œ³dU*Öµ!žï»7Ž—Ý(j’]¸Ó`nak6ÐÄÇ¶2Ã0U*C Ž>ƒÉß³j’=‡ŒCw´_û®&¥€ÛG'-±-J¡É‹ö£’ÞÐn2“ t÷6%ùS?äg­w·Q5ÄÝÑ{Z+±.C6‰÷l1vB¨,8LÛ,º9Ç-äÎj£Ã²·)Å<ÍîºBk Þ@ñKKXÌ>¹{ÇÎ³£O]>99Únµr2øIëpO)—…•
[fQ¸x÷¡õ\ýoù-¼¹vê~£Óîo´6ZÍÎúÇeÖèÒÅ`ŠeWH*$hEŽsß‰i5ôÌ9VûÃˆq}-™Å6%×—)±´r<{Ã®˜%oÔ²‚Û6zÜHß±‰Ð˜®ò„ƒ‚ÀW%]¤rq2Ù 10J4aœSÔ_¦Ýa“EkŽ|çÆ`ï£ã›ûöfRcémSÇØ•ˆX¤˜p÷ÊQp7MÒ­;K¶¼Y½ªñ¶~ç»Ý§|Û}å›’FÃçmõöé¾É–^¹m=Y5žfòiÞÌ.‡/«iï£nô1¬”î×’ÔÈÐ‰FìF1ŒS?Æ­ãÏÅ“ÕZÓ€DS³fj"¼¶î6c'¼qã&QoŸ-€¥Úß2gÃ`íó˜6øCª#Â€­ÌîIõË—.Dh/(Y‡8cÈgxòlŸïˆÝðø8*Íja£–Qª Ñ5 º¶AŠ¯N¢DIòI»éO6ÁœYüAhüš®\;Æ‚èN§ óÄñ,BÄxÊµB<eFï,b!æïÕß`¸Œâ‘ˆ,)™fÈå*|ø
¿Ø*/ÂPØxõœt–Â4´ÒiµZƒ½ú¢Î–/†‡æ	Úì"c'Y²•º’yþ Þw´]A9‰žÂ:ˆakyÆÁÅÉi£ZÜ¹Ãr+ƒìÐi0ï%uŽ%å¬,íÒfXŽOþã×CîäöŒKÈìÍž_:ùhÃ©¦Y_uËéém=ñ"¤:€Mo5-NýáSš	˜·¶Ë­}*`½v›^xqgÚ½#)†º–n¡ÖSÞþ_eä™;¥­aùÀyY¡¼kÅ¡C÷ïT)HÆl?¢MÇ4ê«Y½È=›œXS>
»Xï~H§«‰ü]²œë²» ­¦Åý"Ffe¯ªÕ\&TVX§'¬­£)<Êªcºé•¶?•¢Í*‹\²0!SíD»\m{xzh!ñ«h÷"‚˜± É-Mr<ý{° c ’€¾7ñâˆYÑißiÚÓl‚üéGM£YäÒÐ:—[‘þÂ„¸Ô
“¢fsÙn=÷®I®ÆpqÍiAì|v#Òé5z;4B•N¦ò\r©<™;'"É-MÂ+h(ÒDÖ:ŠBåvû¥ÚÍc;ñ©7ÁK8H´ÞtÒ×Ð+°Å• •ØÜœŸ£©ÍØzä¤ÂÅóYÏ¾ÿž®¥Ë®o#m“Õ 7Fã¶NgÚ½{ÿŠVoC¨S‘äþ
pö q–’CŽ‘ï‚;.-c+'J•Š2èF(ú*%+¨”,×/åÊâzÛ›èï{J´.(ÑZÎÐ¹ŒÇ´~*õ£yé3?æ¦ñä
IÙÀ.}™½q¥þ…®uüÔf$t²KØ/O¼Ü¿¶“[g|Q`M›#œ
Î[Ÿ$3FžãÔšÍ¦8ðIGÞ%ykåã×2W~ËäuÜ|ã|+¨	³þ2˜™üo‹˜VnX³çIŽÚ4sÔäPÕ;3—Àð]äèfôV¸bKžRÌ¿ñö†ŽoôÄ~E×(:}©ÿV»“dí	’þÙ…žƒÀÈA¿iiÃÚe[œƒjÅû›ZiwëÑ ˜Qõ‘}Aí-hµ—ø÷Þ&»RåéwBŸgÿ.3Âèªaí%ýÇâù½M¶ö+¢+i¥¤J…3y¢ÕòD©Çøã·@”,ÈÒr„éÈYØP¥eéÒÐYØ„‡˜ï(&eª½‘0Ù‘¦•'Ãdô	Af.t\•>Á¨E>ä	D£Q{ÙhX‘Ð6BX¨&FÓÖ|wzwI·ý¸Aê¿m~R2>-Dö	¦ß€5k<ð~h?~zL ‡¿½¤§¯6U81P&&ù'©NgÞ‚Ò?þ’”f‚/ø“Ö¨­a@[=µ¡ã~ãô¦ÝÑÐúRœeŠó«ëX)\ËœŒÿ'½Q2zCa¶zrƒÃ~ëÔ¦ÕÊ‘Ëð·˜~Ù'BíøÄXÄïú:iþoïüw²¹‰­dÃ˜e)µwè£qnó»x•Ÿd‹Å—‘þòò#½+ðdº¸â0
Û>–ÁŸ»ù?.ÏÞ5#Z	ˆj]DÚuêÑ,Ü@£ÔD\_7ÄI&A‚ÚýaÍ”™ÒFóÆM«8SëD]ÆAˆü˜öì¦þéÚ»uîKfùºz~{þ 8}ü´QSŽÆŽ',ê”½zTð£ÛqÃàúìúï¤´:L‰**k©´S–¬ÊT¢4\V?ØÍí&ÿC—þ‰º ÑPaÕjEØWbïQ0¸pGð¥¥Ú°ÒÐ_cÄk1¢8{‡UmYÁ{#÷m˜ÇÈììR»¾Å‰%Ob4´xúÚãñ‘O,~«Ä&Ë~•ãœÅã€ù»ý-î¦A#añKùY‹çžâ]ÊÙšÓà®¾nzÌg.F™ïgº°5OÍïœpZ¯¥{szGžï²q8Nëø†@'nE3ÎÆ¼Ë;Ù.¿tÃ[ôû_^‘ƒóÓ•íõ8ø²ü>ßŸebÅéð
o²¨œÍ¹HT×6™·‰Û|“Ãj“­êšÕ†gÙÑ»díüìòjÍeÆ®Û0Ú%6õ$É–>ƒ¯l\-fî¼Ç™Í|˜µùwÀY›wü´Î@ø
^¼v ðBïw:Œúé5ì.øHozü83|4â2 ‡Íž†°ÇŠ¼ÈfÞ« §« ¨O¥©U	Ó©ð
èð“)±ºZ`Ö·@I†­„†.{q‰T˜U&ÂäÖ×òñUTÖ'ü"Ÿ}¦-â®üPuN:£¦Z[p lO×d¾­¤¥R©N¸Y¾ù;÷ŽÝÂÔÒÀà¯V´_Š°“Ï§BžoÚ‹WOW²Ø	ÆÆˆš)XZBÁÂÈªrKÂsß‰sM{0e~Ù@B3	vÉ3ü­Iy\×Ör”d<ËMâ\EnT5¦@âsŸ?ä Í&WÌw(•},£;¿CZöW¼ÖÃTC:„tJßo.ÉÅì¢i	ö8˜áöÄÂ;²]Ú–±Ët‚LZ×å*à‹U†ÉŒ­™uMä—îÀÅO™Â¶ðÝ7	ß†¢jz#ó×ß
Þt”îüù[Ý8·okÐý{nƒä™…û ANè	]¸Ìö´=±dj*ow•ˆÆ\ˆza"«-ˆsÈ]a=œo!ô²rœ'UŒá04–Ã\U¸ã’ýÆ›	«&G³éþ0¤–L¦‚H˜†èédÂrOÑ“ÝÞÙÞ>éä[‰om÷s‘Í
ÆÄ‰
y;ù²¾ydU'œã±l‘6Ãç³K?¢\;¡ïL%ZÍ—KÛËf5íšRîE·7ùØô>È
ýÁ„¥×Áý~­EZ¤Óƒÿj/÷fN<&#Ï÷÷kÜìxˆ¯­‘á~ím§Óìo‘v§ÙéZæöN£ÙÚÆ@ÝF³ÓÀÓ?µ;·½fgkÜo¾èà,ÜÞìâ=-xÞwµI·ÙmßvšÛÛc€Òö ÓlíÀ-/:p¡³Óè5·{ì§fëÅï¸•Åy}×íìô»lJíéta€Ûðýfo«ê'ÙÆ‡;Í­-—a»¯à8…3èÂ¬Z[pm»Í~ê4w¶H«Ñov^àDº­f{&ÒïþÔi¶w`®;½ÃnóÅÒNÝ…lß^žàÉë×‡­>›`ž$í|‚£ÓÀ4»}xK—ý ÿ"j¶»p¦×MNü¼¥¯>ÄÓd§Ùï˜k†À;ží6{pn"=˜³“Ä§a•vÚðžNybÇ½n·ŸB®ßìîÚp'À®`ÀÕíáúÀ¹žßm¶ûüë°½/Âyá— ¨qðBÀSˆàTpæðìÖA š;þ-\r
O’B–MoÐS#š¬ºl†Öu\Éoœs–†îÈõ—®`O“ßÐÒþÛÜªËÔ0ë|äÝLÏæ1õë*o:·Þ†Ô6U–'…m©œ•‚íÇÌ¤ˆÒ”9¶r¹²=8>æŠwfg;i%
~¦(Ü”‰YQÜ†ÒŠ#r„Ø{Ü (5âAú¥| *ì½+ëQ{y	ËF‚y¬[2ä-^”áízÑýôÀÌjçÌ&{å\Ó¤Ùš7½ÅºâÒœÙRµd¡Ó$3ÝŠO¼iƒÇÍ®°XËG.¸è{;ç^’ sß qf“{Ö]ýÂÀ©Ò†BT‡iHEáV=MÙˆwnøü•Žý„²è{è”;÷çQ¢~¶[2¤KÚ‘kkNØ•VŒHÁ¨Îvm"ÿCø5„GDõðé³ÈÃùiôø4z¹iä¥ËiV-{Ïu {j‚_¢,œP¦Ä"!ô‚@°„ATQ'k ª³1ì	ŸÞU™ª¸×Û4u…öÆòštvò…‡ò:Cjp`¿1[sAM3`ûkïÖqîU2A‰ÚËs'Œ§n½'ŽX¨
0w¢øÐqGõ’ºáß9-ø“èœ±J¦pjƒý)Ù°ùºc¬È½Óú“‰G‹jÑff.°¹wqÐ÷` #4™(Š“ÖàÐÈ&òBEÒY éº\+C \Á¨¡öÒ¸³ÙŒv‚¹yÕtFÀ’<ØX|]¼ˆ–×;s=’’!Ðv‹cä+Áùˆä`?ÎäÁ–s@Øjê»'›Êý©{©„µ¶™~žZtS:ò¤IÀYgTAjJ3¶Z»müSòï	HžkÀÌ5Ê,~»,[IÜrrËŽjK\ ¶ó¢7
×‰ç«B>;î›FïXžÓ!öP©×‹aäá.‹ñpÍh~Í\žõÖécWÌ÷X™íÐ‰Ü:e_{y|±¶N~;ÚÓ°Ã`RÇ6ö å·àüGÌÈq	°uà{³ëÀ	‡Í»èì,gýÓó‡;†¼k¢
+Ö€—yÓÇWØYàùÿTmcô‚¿úéQHËM?Äfž;Ôø¨«¢oÒ×@@_ÞË Ô}îK¡®¥ÆRÃ“žÁl‘(-7§÷!„+ï9£Š@æÐ
‘\°PÃûi’ÉpþUÉÕ2«å‡v7@¨,•@`;î¤UF.½Ãš¼½<cä´››äÄ›:SjâüÙÅ†7J§²ŽŒ’ÙÓ–ôW›,öŸ‚¶¥mcWG¡CQ|V>–)0T
`‰ÆøWb‰Üð¶:+–þKÖÜPjÍ¡Ü<[&Ó•Ý¶Èz©Ø¹^RÕ‰yÊÑŠq€¸íÞ»ƒ9s£®†¥«¢ú•°iâÌêõø~ƒxÃ{ÊÝ4å­ô~'z°<·øÜ†÷ðO|ßô(„°o;“þþi>ý<î¦üÖOšR¶ô°Äd)âä#,:ö†CwZt!ç¼¼ì™vË¢—»ÄÙv|zÌçê¾î¦?ÒÝÊ ñŠLëwÙ¯Úd–Š	fXþ¶ª¿Í¦™»U%Pcñ1é`²z XÉ·J@ª¦ç¼ÒŒ!·[}BQ«÷°RnÜËjW6.ëõNÄ[øc €p(§Ái– ÏcõÐÍ—ðz~é­7-\³êInÕ<]ÛïØ÷rèw¥ 2žVÞ2Þ)d@rÈ<’ã„íYOHC‚å•Ž³æÃŠšÇQÌf…Aç ¦?jÉ±8;ˆÛÞ&Ë ÿ°šÍ,·ÕDy‡e‡›º…µB~‹¥]5»&[çB±Ú®EdŒp¨ßð¸±öøÀ‚D.œ»Cª%À«šÎÝÈHAü42ämÉm¦>¿@¶Ëj]ÜÍ~NÝØHÑêÛÉI†òÇ¹À	µ+ƒÉÌwcI1d»"¹Ša/
³3šXiÔ´óšŠ§Þ ³¹¹ê¢Ìù³èõRœp¶ß­‚: ¡
 ¹¶Q1XÙB”yÍj–¢À ª-†e½òüQaË¶ë#C)óüñ_mmáäxÊwú
±|ør{¡-Tiw0¾®“È®qQˆÍ©Qíévñ¦$òkÁÌÒæŽá<¤6¤ËVä¨8­›¾ÿB<‚‰!eÛÂ9õ0Õ‰Â‹Í˜h5Á’ö¦»I= ’	wü´55•[âÙÏ{+-¹«Ùî>ì÷ÚËÂwÎ‚öðDmÍU“É›õtŽ&‚°l6k	¤ŠÔ§]ž?ä—î?æÀÄ]ò.º_Þ¨£Vùžp@¨:ž`s‰[v:…FÌyÝh©ÒÏz}x±üb]#ó!Ô¬‹‹öÔõÊwEw*°_‡®ó™êìEOZ±í0³<|¡uÄÁ©èmtcEòÓ—¨ ¨jJ"Nè%À‰|×CÆâd®J>6)ÛGqŸ”ú<ˆŸ_ÂÕ`l'Ãs‰‚¹V½‚m ¸B³ú•¯F®{¹Ýjd øc×Ãn@›»´¯3°®ÊS•ªMáôPÞû5óŽ`L6myu|qzrzxpuzöŽ¼=;:x#„e?DB£ˆ<+#L’ÊJ¿7>laˆK¡J7u>€?G¢ï+‡v¶½./î3)µ—l‚kið¿hœ-n…ÄÑjè“‘ôíVò†bæIyË%AøoÜQe·Uh1ß)+Ž
Ï˜,ŒÅ¿)g¸f¨ö2×¼¤GÜž,‚Dƒa†µi´3Kö‚{Â`Qrá“¡"rMí¿SœìK;Å0ÿNíåû™8C’¶*;a~?—>‘jn(T{É›Ø`Ç{€<€mfcº#ŒXO™aòðÂûþ83|Æñ›%Â'SãT"oY¥Éu¯8âuÊ‰UÒXUvVE%ºûH!†åmœyËeV®–	Kz‘Ô ŒSrz´®É¢ÒÕÁ7ÀWxäóùu%’‘‹ƒKj6ûyo=–ä Ñ—ëçZN=“Î1×úÖmÞ4ÉÛ!ùÉ‰œ©ü~^§ìóbÀj\ÀWÑBþÒ›e5æþƒ=IÓ(ù($Æ®ºœÄ¸¥`X<¾%d€`m¢éÊ	~[ˆ„ôH‘ºky`ƒ(ÞðD4aƒ‘„8˜A¹ãŠ"¾)_wðÝéQíå»$÷òôˆ:áP_~¯0Â9,Ð,±¯ÿ©ÒãG¡GÛí¾ñ@Êˆ€WNèSøSí¾ú& ˆ¾›O®µþ½(í1•%.S
Ë-Ä€øäMÄ†Y-­•ãJ'X–†IGòbJl•ÐP%hH"m-…Ó =€ “KÇ@;=Rk–úÈ‚¸?ÂaOÿ/ÜQR3ìF >×5j_íÇ B&xžÚÍ‡N4N«	HÐ?0°Ê5‘ç'wH™k¤9ÅÐ–’Ó’¤_¬‰ÿa´ƒ‘	µ«aÌéþC®9í‰½ºVÞ5ðÛÐwgÙ…º»AÖ¼!]ø5ÐÀœÁÀÅû5oâÜ¸›ÕÆK	;—!Ž.8~‡I±µ_¥Ô`º…êp»%Ô£Bžìeà ßÐÆ‡w
s3å6^IyŠBº]iþÖ…Ki)¡@5äž³AÆm„ zlÂŽñ¯œßZ¬Í„V4s`O>k ©íÎ"ÎˆwâeŠ)Wù{V¾a[Ï¡j±ò­°t|2VN³ljÂXÚyFèž7¹!Q8Øxñ¦‰]c—Yòá÷za¸¼%ÆTØ›Žö‹y;>àûtœ¦¢RÛå~Íw~_hwˆâsõ¦ºoˆw¾Æ»-Xg%ÎyƒþÉ8WÎ8E°>‰oâ¢?mRœù“k®”k"LÿdšÊ}»LÓ~ážÊ3é¶[ËÄÑVÀ1q˜+†yéú#Ï¥åWÆ/Ü4'éràL§nX_‹è[Öþd–ü°àKdò¥Uñ¥p‘0lÿ“1)gÄS£|léÊùì¢wäÒ”{Ç¯´†OãQ|®ˆG±ÑžÊ£Ø×y%=iðÁR2w‘Ñ”cwÒ+…àº„`³^"níIÃg9‚žbiÏ,!WäœãÐ›~nÈsål³Ù#×[DÃhºÌ#>BjbH\âORá‰rGº¿ ·^ä]ûn“œAHþ1w|ôÛS%®œû1` ü„ËùÞ’U)1fÅš¨’ê­kWa-‡gE×+fz<+ú
'™$Ž
yâ)¾éü¹…Ð‡Âêsïÿ  ÿÿì}KwÛH–æ_	³\Eª“¤ ð!JcÉGOÛÓ~¨-9³ªu4i„DT’ ,)ÕšÓg³žÅ,gÕëÙÌ_ª_2qãD  %9]•FVY$7î+îýnH@¦à—D,hÁô°ªµ¡8ÅŽ’þËþÉÕp.—  ÅŸ×ó€ª^áìj
°„°žF´nˆ(	â$L ÂÂ\#Aa+/öËp¤Ž®Âm¾Ác€_°‹&Á¹Ž®¦cÈÍ!Õ††0ŽŠM‚8(HÏÔ±Kºµ­E]€¬ŸÃ¦ö-$a,pNW!Û€Ï“—î¾+oðê¯æ›NyJÕßAˆöSŒß£6Y.ÉÖúú—ÐoƒßE3¬97˜#½ž±ýæàêYkÂè\Íf·dÎ´UPýÄÑõœ®#»Fû¼Q&<´m’Üà"˜GTë®÷šjW†#I‹ÓˆueðŒêÈØ*Æ”WƒÑ×cQa!$ýfœ£ç«pÜäÔ´%.MMm-0ÂUñà´£_ÖÐr<sp	««C b¬…á
áEhÍ£²„O <£±Ö¦…Ó(×oÜÝëÐI´}§-K	P1O€ÒÃúˆüü³šÇ³§¶à™¶Sñ÷óýhÅâîÒtš-Ôl}¡º}Bú×¨]Í¿§aq®ƒCDÁsE]Ïåæø‚Ð>=·"½*-VH¨ì°¯¢ÐÔ¼ŽJ¶¥E_t3ÄK¼0‰dH(ªºh$£4ÍiÈ²c=‡Jm‚þ¥Î52ù]„X›ŸêD¥Bàê_¿øò
 µ}Ê/U[éJ–XIÍ“\‚6Ã¹ÉAÜäðâÍ™ó3þõg¸äçørè7¼^¯é¹½¦ÓtÚÞ1è°zý<ÿ‡Èóž²„
ä÷*ê¨^EÓµì[»Ý®á¦Ø*|­«©ï-öqÝ~<üøv÷/èíîûWŸv_¢“Ã·‡ûúï·þüò
ë>_7Ìzz-ÐžSÿÚþ4Â+c*èrÊ„„W‹—†¨z(8 ó¨a;_üùàE;Ç2FÛY´<ô:« €8#W‚<¡¡•|‹ÙFLÔb4§í
3Åíjbt¾Y‚
÷aEp¬ŒŠ¬€gdÂ ùù+Ò>©¥¾\ºŒtÅPêoÑ¢ú°¦¬Jªªªâtc-Æ|YT»j«æ
ŠSöÊ[(*íÕzH,ñÞ¯ õ‰Ä‡fÀèÓ¾ÐÂn¸!íóìõÕI	#CÉíºº´¡^¯¦ÁŽV1ÇHÏ$GÎ”DA³Íö¥\­F'@Õ}µ³xËuk £³Hœ„®Ù‹©i¨y¡nœgÇpø«”g{àM£Ï!’^ß°Õ¸h]¢E—ö™çðêCŽ¨‰àiN_©k›»÷ôò†wD*úÓUa³çZ£õj}Ü
«òÚµÜ… íøôþôã_Ê ±ÍïEÿ1§ÄépÄ©.¡PcN?ÆÜU5TÓºCêF¹ë¢ØXàäƒ¼òuOÞ‚­qš¨M nŽN—Â¾yOéœe½xGI0»XKˆ_ÇŒ¤ÝÃOûc\$	]—"Õé)ð«`Lø" Úf¬šš<Üò	a·Xáub1êìèû)dŠ*:}_¼§!£×mQ-.c}§¬ùÄô—bOêu|öþaÉ–¿•f]’áX¢ØR–õæð¤0í‹pŠ—zcã9j/£·Øje¼íp>š^ƒ¤!Q|‘"™jÏìžUhv«Q}¶Tœ¤½1êÁ*2Ò]_$­ÇÑÂò(†O¥y¢>Æ^†h¼:\ª‡Ñâd¡‡iU%‚Û“N»…¢¤êp‰T[Ê©Er*Q|9l8MÏq›®7X³@:†±"ž£ô®¦Óv×
RÐÐ+àóò/kLêØÛÚNy•‚â¿¡Îäíb}éôÓ±ZWÂ?ÿ.á RÆ@^§×ÑÑîÉ2X4Ü‡Ë­ß$ ¿MëÂÌhb®C2=u]>R@¡BÃ5[9Ò«Ü-ù Vâ*b¿Ìuu²â<J\î
EyòXÐ:hES"˜ú… ¥J8³³Œ¾Q>]PäÉ$¦cÑðëhJ<ÑJ$¥$§¦åå<‡´7MR=	FiIV˜± Ý@š/«ˆñ]é‚S×69óyUÕþ$SÌg¯àB‹YådÒ5O½<ÿ‰*x@8Z%_^O˜”ù)W»ÝªdÍ8	–W‹Ó žÁæÓîbqzáÛ–E«ô©Ò‡L…[[e8ÌÔ&oU({fg(†oYûbEB¡´ä5Y^5¯[C“ <èô³¢º$«BHÒýÙÚÌW™WlÍãßßbãsä/°ï#žý+VPÓÓùåÄßk01øîqg:5t»]sÝï¶;Èº§ãòÜøþ`Índ5¡hârÝ7üê!x/¨Èˆœ/P8s®1•34iQªÂ(	–z N™Âº·Ð\~¯’T ÆKYtÚ]ÛÙÍøæx™C•XËy,ºác¯¢èr éMòõvýS_|ÙrAm"êVš‚F=™%õ¼Îäé;ŸIùÌeŒÍÉß£I_·&°
(ÔÚooz_:¾‡<Ê.Z¤B*þa³½±Éþ¥?ÚýN«Óv6àlþCéc³x=\
7mì¦£nÛu‘7žjoxP²ªÐ’òÔ¯màÞ5ZâÕußBÑ]´ÙÞt}¬çáÿÑú¨?uÛ”òõ6Ä'à[È½ÅgÀÚbùüúü2U(¾nyòîDŠœx4fù‘)sD_Ã+À'?cm/IÈÞô7Ä/IÄèwŽYÆ1oˆáùý°Ìì}EžÙEÝ‰Û¹m:†Ú›ÀŸ¾¸ÞÈ2×-øÞÂg^wG-rMËÃçð?Þý‘§à\#p˜E4½…ÝDœ™	îº×„"æM·ƒð'r!»äœ‘€î§aH'P¢lcSó®2~ÿ0ždu‹â$¤qÉ^¯²×EƒD½9ïøÞ9(×una{tDv}9€s7Å–fÁ&ËÈÙDËI˜ ùHgŒìÝ·€¬Ýã7Rç˜³Heç7°»ž—‚ìKÜVªgjâv¤’¯NH{‹º·¾[^øÿŠ§æ„Ë,Ó‹_OÓ²À§ŒÇÊ2ÖJ™ÏeÂU’lXÕ~à€´n&Ù8Â1/u@wª>,FYâð"É"œü†LºlLtv¬Æé§»P­à€”R¸@cf ^ìè\ÉÖA)v5¤‘ÒU	¦1*ª˜·ÊüUg’6•Ëí«†›¯¬iàÊ0ù=1AT_J*ï|uk;ïüù•?E‡d‡îŸƒ[d·Þùšâª€„/t‘îÅpÖÄI0ŠƒåË6deu<ÈŽ«·ÛíºAÜ4Ú ÞL—îÈ¼_/ ];Í¼Î¯ÔQŽÕË¤k¢¢¢ü¿ÌcÉß'Àµ‘ÈÛY4\C
ß(:é}ôEÌ01ý@Q\ô¹›tP5†ç™ë­¶T¤´ëñÂ‡J1<•ÝçÒßÈx rW×&‚KJOçlMú¹ˆ!éþ·<OÝ„IÊRlR~°H)ÌeÈhš°<ù¡Šš:•îÏ…Mµc
òÓX?ûoNk³…kçë—MT¯ç7ëó‡¦ÖèõzkÈqœþ¿c.ø©Ò¨Îz´tô¶I0•C.þ¯kÇ*A°r®.ôq‹n"cRÐA´*ÂßŠq/lKÚô†zé¾Š]TâQáµÈÒBs[–Aõ,G`º;~±“ösKÈ†JÏÓ¢ªA´Kwûº0ý'`ÔQVY„ `tÖe1(«(­ÜÔ·«(­ßÐ'é4v®ªŽ—¹ªàó7àªÊ
þá<UR^‚vzäbï¹v<}È\@ÚRí¤=rÕ‘‘aÔ^¤ÕUè2^Yž#Ebî;Q¬'øõ[ÑrYðù|w]Jz CX@÷k†L 8r<]›ÄS•u“Ä·'6ªócê¹|dŽ\zÊ/³’¯Ð¼‚¦—Bõf¾‰—öóÛz¶‚zAÙ†AMÑnQ®uC“ÁÌ/'ê·Æá%&~²Ê¡&¦ÎmXHV=€[lŸ5HÀk…¢çyu·­¬i¯—§º7à /A.Wu\ÉsJcœ”e€TÊb›ì³»3·é5;Ín³×ìŸÓø÷PùÎYb8øÏd`ZÏïBUÜ5?¬•™ó6˜_BÐ«å?9tÖãid}òAÚÔ³ÕõEâ—#õŒú½*—ÅÎ²ú‰ÿ™áe&õ6AÁ*3‰
þ3´«·`û…Æ9‡èê›RF³§Ìa#Yx|?œ €u§Cê'èõé»·Û—ýdêí	´³FZo“1mÅ›ž5»ÆZKm³>¿S@4ÓÆÎ–(&ÍÓÚhÅxd(7"çv	»ãu:ÁyÑ’"ØŽb&²½œÈ6Ô#Ñm@6RŽˆANÛ—•šFIkc„F±ˆƒ¸µÿí*€LpÙFñîtÚ¨îx–1­š[;×aóàc–q›µšö¢ôÑ˜ØãC«Š”—,t²RØ¥ŠU¶Ö¦{9ì+`”3r "Ï$KÊ?y¥¶‘éá¥G¿lÊ¬iœÃäGPÉUÐ¶aÎé'£ªÑnR}É QŠZÒ‰d§§Ç ÷´Oñ‡FÉØ†Ir°eõ½ð‹ïßh°ø›ƒkt«€4ÀmØP€ïeÍøÓË(—“~ðÉë]·ìz¢ $[¨_rÝ«¦`Ütœ’2°[ÙIÇ(Œ^Q:7ã`ºôñäÀ©† á€¬%¶ñç[@ßMtÎ±xÞB=x…Ö8Ï$³ŸŒk3%Fú¨g˜Žæ`8á	!ttåzn¯_—Î9ä¨“îŽÇ€o|»ÀWÿ°ðª\w¬nx˜ÑŒ>¯ö ’¢Î¨àŒz8ãGÎ0{¼zçÔ·‡ “±Y~=,søKÈ4%ORÑËì3ßÈÛ¢³ý "& WÞÑ.{=Ä¤x‡*e«ä)›Ët­k¦b‘/Q­óÚÿg5$Œ²`ÔšT.ôQº§FíyªHO›:j³$Ü²7sÂ €3\„Gl>óc´ÒK€^Ù"7¦¾ˆ=Áÿ¶YT&¬J†ÅÂ¸èÒ%ÒtI§çÕÃ3ï\Pyxˆ  :ÎÐÙpŠ
b!àL¯šÍÄüToM–®Ñ!™äOˆ.–jê¤mf’à3xVÄev¶$3ycTc½„ãy}™nô‚OHàeªþj½ÏlÚ`bâ%ž‘]ÕxÍ0…ÃÊÿµZUî»äýÑ›ïÐñëïY.nãÝîéþë7ï_¡Ã?ïîŸ¢“ý‡‡ïO^8E‡'o^½_Ë§ëÇÏ>]Çy»áN“v7Ò¤]s„Y7ÃÇôHI q- ‡(†âÏ<`*ôÎ1ùË¡+)øŽ8T¼¢³•eñu½ÌÛázŽÊÛátœÎ¦°½ÜÃÖø9ò!q"º‡|’9*áñ“ÖÙ¦÷e’[•™]JýA;YF‹c<þ%y]¹$R.Å•AÂ`a°=ßE1lþà¿¿¶™ åð×zËÉÒA„ª|Iý?ÆO	bó=â#ˆ¦6¦Ú¨ä×S[‹âÅª®T¹ò%ºÚDüÿ|`9ÉÊ˜>=a]g@	Xê"Pðå?¨î‡G²@g!íEãÛR[ÐB %P'¸åEnî¨ZCçO-*ä]—í·Á{uÐ+¾»_ü¥£Ðá,ˆ}|âd!Yˆ¿ø‹I8RÖBÕ‡Ï Ì/ xÿ3»—g		èvaÃVÚ™…b!.€ÉûÊìY„“füJÞÁ½™MçÉ6¹ÞZ_¿¾¾n_wÚQ|¹ŽÙª»œT‹à"Ñ‡Þ(Ú8$•îÕãÆÚñêÇübŽ·k—¸•×?îà»Û5·÷Çº…þpãm×äþ°‰Ï˜Ã”0£CÑÅ^ùxôþÑÑ‚ì\o×°´?ÚÜï–„ÊMtŠmôºG•Úè÷
mìBØN•60äét÷»®±‘ëòh®ÔL0€tZ6-Ÿ–M‡MËàÓrèÊêÕÈMt‹Cº×©8¤ƒ|ƒƒþa¿óÀiézž¹ûiaËLÇ¥V\omŽ¶Ãg×ã³›®9>¹äWŸ]Ç9ìoô«-ºüÌ`ëjÐ«63Å6›{œ]ÇétÍdö°E—IùÎ^cUm
êžüìÐ®=Âôìmõ÷wé¹4æ_ÔÞ|¤Ê5kf¾†ŽÂ¥|êV;j BÐ¢tÌ?p$‚.|I±ºe#v`±zBöÆ ‡khŒíÂ‚/!Q×·k=,o§Q4Î^›dÒ“Â{›éÿÅ:}­0^§ÒXó3p	ŸFðbÆ£)¶‡ñ»tX• ü÷Ùísá*ž6þ	ã5r~	ñ¦é/0Îk†w‘žÓcÏéçôøc@ãƒ~-Ð†áO±™^’DiG™$ŽwQ¿‹öñŸn¿‰:ø×DÝþƒöûù¶á‘ßð¸þàoýþ¹Ú÷è7h¬OÿtÑ¿6ísÃK…êšùÕ¸k®7ZQ~ ŽTRb‚ÌnR~È0²—Ô"ÂAÛµ4Â»ávšX5ÕŠäÍsEg«Û…´ö·xtñˆï÷é¤õº¨Sƒö;ô›P\iš
i2r‚P;Àpð`Hrc‘K[ÜËB&ÝvO­©ê.žË“ž»)V¶/§Q’`ÃÑž˜U Û¡îâ¡v‘·‰‡ÚE]uõ2Ô½¾Õ¨¦K»äJaÕ»ƒ•Gƒ&= 8Qû™#ð„Ï†x`ˆ—êÑ†¦3h÷ùgŸ~ÜÀCâ N¯ÝÃ\8Óƒ»ûˆÏvàcŸ|ìâð··]¸¨ë+ûä>ü#9çÑëàc_×!ÈuÝv‡\Ã¯ì·áÙÐ\—¶9€sp%tŒ]¹I>âÙsØ9ô¶GÚÜ@û½.»&>²pß>ùØsé2#ƒé?û¤1z¶“=0+qzÞ¡»·Â¤¿X×åjâuu!'™È$ÎÞ?¡“«!yÐXü
°²›)Jf,/Ü#n{âÛÇßc?sð³úáXª„ áŒ|ËT9ƒ½^Â°•oh€v“¤=–üé$ˆqÙò˜ÛÔ²¨‚ÝVÚMâÕ­ŠÓæ“¯4pGP¿\çC×ÌqÜ¡#,vÐ.K—÷Þc
 ùKŸN/?„H³½èFË6LÕ|EDØÔ-Dã‡zÞ ãÈµv!Â‰ù£s[>Ïõ;`ÙiZo üšåõöz{øù4/Ä#g×{NÝÔÐ–ÐP§ÓÙèz,v¯éíá<‹ý;èî:îÆy]Ó˜.úQ›YŽçæhÑÝ¼·$oÎ £èër9°iÔN£Ñ/,ËU;ÇkÙK»ÓzÔl J™ƒÌ3KArBŠÇÆ¿DëˆG\é6¤^P7°a¶i*½Ì¤Ô¨ká(ÜùÏåyc¾[é8ØýåŒ­ÉÐ¥Fýâ†²ƒ¯VÈXW&]+2ÓR”í[TJ§¤aÿÀúÅâµ)YÀ²Ú§ä°¥âÁùåƒÇ˜ì UÀæá´Ü,¬=ˆ®çÊŠwŸs)ÀÙH§& \+ix\-aóÐ8)´µÙÖ6€1Ñ#Ó-OA) ÒÁ¸¨ÈFéšZšüz°üSq“„<Ú´N
¡Îª3Ûô¢?—‚÷‡˜hª&±º*^¸h©}´1ØT&'ðCY7A„ÑP&•ò¥Í•²H¡ãbòiFR}sz,ìSA[&uÔH(TïNƒx‰Nãö4@@ú`AÙs5’Ï]^¨—TÍ.ä+r4¨
ûâ¾z	¶Æòé[˜Šmˆw•”{×
l­vŒ-8áÆÀ8ÖS¹ÇÖýÛ01©Ž]¬¦{ç„\Iª»ÃvÑ™Öük‹C†»{áõÔÝ®¬û	$Ð„ô»¹HE`Ä¯Q4Ã[›½,FÂí9¥jn6¨¬ÄI9W3lu’œªrœ4Ú{ ²œÐ
u`º¥Û<!ß¦äJ™3›©H‡
à¸ÐJî‡¡bÂÜd4…µh·ËÞLSÊÆíº=w'åTuËÚL[›°¸‘Õ
ÎÉ5enòVCY_Ëy56¬ªd…p^SÂdHƒ¹’G°g‰$<£Ü…¡2Ù¤¬0ÕÏovßþ¼ÿá@QîE>xñ—Æ¨4Ý‰4ªûßÐ6*Òt®vÌ2gæ|"z"Íÿ¶ÆÊÅ“hâò›ØÅ&a—v™_Ó¶Áþ÷·j…k°«ÜK•¶¥M”Ž¢¦0vv°Š<ÆŒÄì(·õøA«õÐút?ƒTÆ‰à°µùaUù'•€Dþ‰‡¢œÈøýUƒÍ”­(¸wÍøœÚä:ñPTO¶*-ÄØ¯`ÇrN,‚¶úÞ°ÓQ•28œä÷WXi‰Ã‘\÷‘qu€¨`z);“Y™Ä`“,PçHHC-?J0äÈaéië!×ríij%Ü‚­Å^ÚÁ:Í¼W¤í’ª”…–Íúº¡9£,µÙSDr¿¾UpðÞò…ÃŒ—ôt ~Z'òÇ`ÌŒAâ5X@¡QË®bø©=ú9‹[$à[Ü”ëÌÇ©ñ¡U³ó½ÕÛu R½#`uÇq ‘èzÖ·pûšÇNô“Àè=«2¢yXe^ÍüÅZdØî9).÷'š6Æ•ë>Ë|€½¹U¶œÔÍä}+¢¿ïjáÍðÀc˜Âãk%ëÖ°L³Ms”æîŒvŸÅÎ’n®­€¸+ V™LNÑu†PÄ".±=Äx™3lÃTuäMâŽ~hu›btü î/‘¿ o´ŽÞaÀÇ¨E½keû f½ÐFŸËép¼>Ðœj–¦VéXD††&ü¸Ï›î%¦N‡ÕØûÃ~osVAÛÁÚÆÀsÎ‘?—ÅV2ò§AëÌionžs¶IÌÜÍó|Zñ0ŠÞuF^ÜìSE€y¢V áöžn­8¸F„æFËùm„Dì	NAÑ#B—Íóþ07E)7[ß™=/
ó´"¿2ö‘ºcjR! ãÊ.‚{Ô¢Ä€E–ù"@QXj7ËË+ÀÊßºÛ+ø>ùO‹eÁ!ËÙâäKz64Püy‚„å½t«—/àGI5sµ
vTÄú'ðYz`6ƒî–…`ðè>¶rì§ þ…‰*_Æ`Â”«åò	Úa"RŽõP7žÍ\=6’Š;_¬•ðyõzú=¨cn’<¤Ó¥ä³p¯4#	Ž~ë€L˜Í€ækôs—û·0©¾Nî*v%±<Ñ]mpxó[Íˆ¸¥h¸’ó»EÝëéê´³XœÂ>Ú²•ga†ÍIž€Æ	áÌuR=U†Êb*‹T§«òÆ¦ÙQn*Ôi!JÊÝQ|é€ª.FÔÚCX5T¾«,)”Z·u_K¼'­÷·ÿù¿]U¦ $³ß„®_¼úNÃž²äTA³	šQ?O‡`[ù÷‰Iß2éle>ërËƒ è}C+˜Å¹Îp€ìÓ4¨WtÙ€ŽtÒ lžM€lª_£«þJ1#øˆ©‡J5¶ô>ÐõsÿÖžéƒ^ ®m½2K£¯¢]õ-„ö•Ï”£kXÎ»êq¬:jfe}ùÂ&þPjÙéì:#‡0ôC,
S·"öw˜%ûZ±ÓêµW	GÅÚRd¸B–Ö¢¨¦(bnª‘Ãõ¥Éó)ðÊøã?­`üñÚ=õ!_§\*FÞ©\Œ¼’qX¬RÎ¢ü‡ùBœ¨‚ñ³ÇµµÖÄ_
ñøüÀÂ¾m3ìŒ5,“4$û’A<óçx~§·¬æJ `/c”ø_hŠÎQÀ\W1ð?ØH3³N¹ŽIñ6ûíåUØ*ê«uPQ¬ª¡¬¼×N^YD²Ü;"#Õ`¾j"?À¯þ(|Öx="ÓÉî‡èôÃîÉi]	ÜŽ§€WfFU’Â±¶@"ár1p7äÄ¯­³ .I³$¬glpõ)$™\\BŠ‰Ï&B]˜LCò¡ ä-Š”†v´a²QâÎ FcäÎþÒgÉ4èô­ÍÐïî¿~søãá»Ã÷§'‹ãcå¦bw4	ƒ/j5± º*”Ñû ³9ÖUž™îým:â4ÈøVÉÌˆoÕQá[é¨£/ 8¹ù¸K|“:M£0 šíæVÁÈ-h°ù%—â¶ÛîD¶j=V©aÜXà/¨€RÖ—ËÞ™;§š‰¦L–¨ßE$¨—”¨D#g¸o„ÿF$­u:ÅwQÚÁr³‰Tlø)Ú i”NRf˜çà†fWÓe¸˜†A¼¦hGK–œ 	óê¼´×¥•ê)Œf$­aLŠ´W1~#âGÀg6‚W–€¿æPDD’ÓqæöÆÁ¥ÄÇHlõ "7ñ3´ÃqÉíÞÚ9Y6ˆ›„xÕrUµC€âä(WU­	¥2ÕM5B"Ã¥œ„ËÄÃ±Ø.‚ëèí0cI‹WÃ¬…¥‘i×¡¥Ja‹€ÈQ>Š9ª§¡Ã7²üQKžK;@©XXtª#Lm23C-m©k×’mñbýÊ Vtax7•–Ë +¡+ iVÂèÖŸÓŒ§$E[¤¸K6	^µ…@Ö ù§£Y^FýÝõ+ÐuÔß“©_â
˜a«Â»Y™ì9r!!û¬Ü,s³PÚ Õ¥#£èÕ`Ø0¬6×KD÷
t¨âó´g”ìD”§Jø+î’°‚©ˆ¦q®ÓSgÖ¥ŠˆVÕ Ý:àè¨ë3Å˜Â/\VÓ+h^šÅ#è¿ù2¸èùçùåÃˆ¢+`è¹Ð+¬‰þšÅâR­—K˜, …õŽ.FÒ‡ûÝb©ââra`¿Ý|7;kçr¶;Ýž·–Óòð!CxY‡˜æh°¢0Ãbê-—kàˆø'?Ÿt:……ŒO²oýlYw{ÂŠÆÊxË=°Pœ’W >t8³p$\ÐõºiTfç¨{Ô/ŠÎwQ Qý7‘ë^ÙAá)âŠEª–ç‚ä=þ\7^_Í/ã[¢EÆ¶ÑoñØ_]NÐh‚¿óË y‰~
“	ìÿ)œòE“J(T9GŠÚÄÁµ_‚u^Çƒðùí:AûÿXq†J$›?qDÁÍ¨ÿ6ºÊ½þÂ úçBúDá¾yõú¼98DÇ?½y{ˆ>îþtøQ ë»Ô ;Ža·edíÞÑ`±SH‹~0Ð
<‚ó«ZÞÕšsD¿˜EÀHÛ¸g¹ç˜ëúÓí»;®{n!§è›af¢t™[¼,¸	—eM¾]þb€o\tƒ©'=§fnßÉÙ¶gø¯Ç.Tp”ÚË›s6ƒƒß%ÄÖ(©Ûü1P9ü~Mt#ýâ Ì=ýÕ4ˆ·üVÅ ñA|ŒGfrZ„¨|m² ŒZýÄ1o!¯×D N.æA’à¯Ž¢[…9`¼Õ)¤žŽ·@Ï$Òkðgr1Wñ,G:]bOI¹}@‘_˜¶^Á§‘	 Q»Jõ7n€È&}"Òq*|æP
\F/¹”Æ—ðs$üágz_&äGúÀ!$_˜®ô×‡»ø€“¤(™¥(Æ©fÃàŒðhü"†ø”Zpááôû¤è!^×ëyþy–QÜú/H&#Â1îCIÕY»,–.'(©•—+ÜHÙh2\_[È³~—W™ëŠU2Êë;#`cŽÍ¨£PS+Ý‘·›D\É„	{kÂå¨W··rÇdÁ1ÖeQ´/ÂÙ%JâÑ¶pý=ò§K¬1‘ñ¬)¼ïú'þ5-ñ¼ãé÷[¯9fû[4RHß8LSÿö=û­vZ[k'WCZ2r×ÚËè„µÑÔFÍÓ+T|+!nËÀSFNJŠ7Ç¤ug?$ c„E…Ê¿xV¡Šmi]„¼,Iº]ÝnW–Öô†½žX%¤ŸF—¹å¡Ã–ARTýøq„­—jo[EéVÃ«ôW	:Ž#l<aEqOÃdî†½:V3l‚[€Ð8´ Ò>™ÞÑ-Ý#ß;8…z9ƒHo×Qn‘Ñv¬/ÇA“ƒ[{ç/'m¬”7°Ðo²oþ¬“ÆÛ$Ó·˜}þˆ L:ëY7°¹Píkêí8ú,â`Ú–šÌ^£…r­«[2çMkàÐøž¿'óS¸¢1e¼"?«e£çÞ´°µî©<>‘u‰èx”&>™v¼k;w"•Üßå›ävƒ¿ä„rEXpá<7Ñ¦…pv5;ŠÁDˆæ¬ ›×}EùË}YòTI–¢d×ÇÆC¡?‹`Ç†Äô%ä¥<ÕÓ¨@:^YS†ó:p6˜ë=á'3DŒfsT…´BW$µ!¯Yjö`Ô4_‚Ê|¸Ël»uDÜMR÷r{Ü’/­ôñÉòvJì‚Q½…>?ÏOÈý?ŠŒ³Ã8î%™¾ÕÈx*Ô¢x©¶
õ¡Ìb”xÁ×Aúž‰®ÐÄÿ¥~üÑÛcXvÍÇ~LK­á“ØÉó; Ÿ˜ˆcd"Tb`“Ž?\ŸÿnGýoª‚8k›*V*¶f±ç‘Q’QM§C?†µ/¡Ä-®Ô¢RîŽž~xõêíá	:9Ü?}óá½…«œGHôSaÈ£Ö°Ag‘¢KÀB“©?ÃFÀit	 YvæQiÔ¼¥2\4R“¢ãn(×KÊæj;ì-K"!Šxy»Ó/·³üR;šõVÖýk;¡I/ÑÓ5¯Rô˜½IØ4ž…ü£6®\Æí8ë˜)ìõ¦ð‚m7Q8X\ò"
ÉX<¿KŸ¼HC„Ïr±9Äb³VZUpÈéŒàL#î°¬7”ìT8°T#¾W Ok²±jâÈd{…šV«f÷™ñŸ	ä fC À~Å\i1¦`g;BG)ã6ä½$/
-Ò¿6AgOþFhZêP²&ã’£k59+wCAm6éôëánV\Ê“
ñúîðý'ôöØ˜Þ•¬`VÚKRC=ú| .šû_ÂK(6Q[g.µÚÚQOQÑæµOêóð×H°
ö÷Oñ¢ÈŸ¬_EÏ¬^vƒ—Š‡QzÅmãÔ”&}j	y|;°Vg'<NÃzf;¾ðpfiÓ¹Ò3,ýuã—Ûs?'Å·ÃäGJŽ¿qßÞšÖ'k7®dåA2ƒ¬´h 'KßäÚ‰›ÓNtã›â!~Ù§Ur˜Ù¥˜[+š'l‡†LD3Ôz_r…acÑgéÄú\ô:½Ç4‚Hk1\ì‘¥Ãu,¯«U‘ã°¤«p8e? OÑ_,HfÀåË¶WSH6­±±êÏX2›¾Z¶T´{—ßN]þ¯#îŸÞ¦©qhx‹ü1X©$È4ŠÛzl;êƒÔä(Ï
œ<}àåŠ‹Wfït³ë	™:0åã)fM_…1?2S~3ÿZ÷Qó±6G÷QÈ:ìúú(ZÜBÐA8¿¬+-¨ofb¥ÌÅÌ
I+¿ÕîãÁ$q<šášÇ6›R¯-1ñ†³láœÂæ&
^N¢:_8Õî	=
w¸Æ8XDx‚g£h¹»X4¢
>9IýTË¿KN±ïC4`ü Q˜H9
)!
^Peþ©çK9b²÷ûïk~NØð•OPþ¼ÊÜS@!vu;tÕAøŒyz,§‡îu½xI‰ßêí?y®¼Cl(^Vq‹'L¼£ÝÃ9ÕÁˆ‘CR<SKç÷jÜP~ñÝ´±2mÞF×gØ¨§Šý”^º•¢^wyZþÓŸX†º-QËÁ‹ƒAÐ;‡	ÉÇÉðŸ:”Ô´Š°¢×ÖzÆ]|©4Áÿ×*xåÛ%æ"ÆF_½)Ê‚~k¶YYµW[Z—Dóåvµ1_+¸/EµÖ<#ƒ”Íø¡trYÑ“¼ü¸&Él4¥M5çlÛc(ðÕbzŸ@\›Ô+çôPb0}XsË A¦Å Ä¤G³f+YÌ1&	r)¨nšÌÎ¹°›ãÙóœÆrø-,…ßÒ¦	‘iež€Ç~3{¡ÜÍþØ+Âß©ðì§-*ál­õÍ|X‚Ç- FÐ£E¶…Nf~¼¤2Çˆ
Ó;.£ê"ˆ|'öE,Ìz	Š³ž4Ô‘´¦©WíQgz#lSgß43ÿÛÍ{%x+AÆ3À|Ÿ%p‚mê«ùúKš°0ÙG¨_©º¬¶N«Å¼8ª[¿ÝÇöUPž%mê-â,èK£VÛä€Ò6ÚòcL«¶
ä,ˆ5/çèƒ²ƒvÓô“Ûùéƒýk?ïÎå?¡á_-'Jg¹@*oºÂ}U$RÊXcÓ‚,®É–*Ò´‰üfm®3Š	x]Âˆ–xMzzç…ŠpVpž°Cæ=ºZª©HMC
 , @Ì=Ì%¾X/äŠ(5’fwŸÔõ:aYJë°¦ TC
¹%f|9?ONÃ…*ÀIÎÆ[ü+dý.e"JsŒð¥,i„ÊS»êAÈ“K}ÂéÂœP×ÁÖÐáQ ÕÓÅ7Ñ¤*33›èâ?$uŸhoöò«T™«Ùd)‡ì¾Bî¦;B×5ÍÒ£Ñ#iJ$½aâï÷ØØÍb†¨‚Åò¡{ä¹çÆ,º›©6©O“þ9}êÂÇ$C ÍÈÅcç"S²9£ØÏA;YF‹c<Åþ%	Œ–cJ‹ù{4KíG˜®Ðë ²qJóöfPt…!˜ÛY¡+!X›TÙìZƒä–u¨ãu:Íó|È·zÐÔ>çÕ}œz4
E¤¥häKè§ZtŠ:²a–¹ ~®T%·ƒsÛŠ6/)—ê–Ûº`:ª°ü«¿0¸}ÓW¿§ÓôX•Pt§+g·™Ð•æÚÎÞŸÙzPß›¾ál
N	Ž,dpBëÁ»ÙîñŠp0‚l ;ó/På˜TÃaû¹³sR‚0.ÂeòL¯¼ÙÂó¼`uÃ?Tý—hòi•èY^Ë’°nÂÖoŽ!ZÌŸ"&¼4Ñt%ðîs¦õWæaEý/åæÏï|Ú¥ÓÛ-áW ˆšŽ¸~æ´ÎÌé–ð‹&JÓm“Ä·‘^ðøº.¤…ì¦74h_5á)j}ÁæÚ“ëp9šPL<Ã#îQ€[Ô÷ÔòéÅ¡+˜«ìÀés÷‚"nÉ¼S’Ê3Ï"`_–‡F’¢fX/4Ô•ãè°š˜œ4nMË¦
oB@° êq½öENPÛd9æÏ­GÁÈ$Ì©b´/Ö±œŸ\¿òzNÓsºMÏ¥J–vç+¤UçøþÝgõ–¦iEŽ'z‰qÊ;„Ï±û~1µ§NãÊ"áï.Hõ»ŸÂå„g]5 w{þÔÇ†WSJ6¥_>l×A0‹¾[¯ÆÇÇ¸gæãÎcö_éW9±D³ÂTNA+¤f¥ô€—ÖJ¢ü cTél%AŒ2Äô£©ÖQ¸–¾™‘'m”k±•´Ý¯,R¼\t@¸M¯3ø{–éì•ÊÂ ŸPhfY%& Ó1¡ÙºYMvèö
•UÚÌ;¢CTøZÔ|8ç3ðU·,”5c47fCÙè"†ãhZFùcpÁHBµ£Fà`êÌlÔÍi¸[`¹ClM„ž»N7òLÇL—ñ­–“RWýE€Ùr£¾î/Âõk›¹£	T#káÑ4›šËI4ÞBõã'§õ¦öº	ñ[%[èŽl.Ák§Žoõ‹)+¸þ×$š×Ñ½¾¡a4¾ÝBÿõäÃû6EéÁ,¶q‡®BÜ‰ü¶ñYt¯ÁìÁ?èÄîËhB(ëÎR€HÂößaûvà•ÑO)¤·™G-=Ùa>rBÄžsÞ5éYÄhë[‹µ_7›p,Ãå¿ÉGBhT£c,ÐœÝÚi´@ŸÖ;Vz½ò4ÂkÑhHƒvI°>’¢Äv"áå” ÇË@†e˜¶õf¬/cœæLQ…½¦Gð@höžŒí2}GðO<DËÌ:RA×zÿ(ç7©8VÌpüújgž†hÓá|^FÕÕO•*>Á †>"š½ˆ…*êz›M·ë4½n™.j(l‰f£‘ZGæš-W×ksäQªÝf¬µ´~µZ¿ÝdXlâúTF’ß„¹„:šTÈ:í´ú²˜š£¨EË\öåñÓe±€•sÖé|Mùx~—3“´yÈœz0o}:mé`·°N£‹m[)Ú Qè.zA‚´Ü²¼©…Z‡µjÇú:ú¯n±® ÖÇÇW£%›½Â\&!;‚î™›e\ÕÖ¶HQëbhô·¹)s6é2SpÉ¡é­zi	‡”®úfž\]\„#‚ÜJzËRóeSBßVkÐÃdÜÀ¡R5Ùämg‹(^6êíöú¯e¶Lêkíå$˜7Øß¡q4ÂFçbŒÙù|ç£˜@c26O>t@ÝÃ7cEÏn°16QÎ&x¥ä‚g`%Å>ôã%i¼d–Åæ³&)h”øáþU;bü‘šnéà5²q þÀèb+ÒF+#8á£k»0ðˆdÅ |@l~È›`­ìc¶2‹8ø“Oþ¶²eb~nä4ÏˆIÞÖÙäüÈÙÙ§¹5$”ßz–š@Ñ´¤†ØA†tp8L£“Ùšqlæ@–Ñ4à¼€±3?„Ò­µ&‚ûM‰xsO*%of¥áÜø::¦`SZ’é™ÑËÎ¥Y¶bXmV=…åÞ
¶u[Ïz®Nú‹(Ÿ¸Ie ®>hšÜs÷Ÿ5b´R\s…|Ò9DÐÍÑQþw5 <*h	9šÇ‚!^	j2I6[/¯IXDbK'¸Im!Z9`˜Îº mm5s‹ ÑB sXÞ9¼>\\˜õuX²šÇ¯í¼ÈA&:ž$DTøš¯YH¢@ÑÉOoN÷_£“Oûû‡'¼z¡:TØMz”²…‘äViü\ÿ—]„Î³<¬OŠeA1×ýi”ä‘Ó4±`åØÁ@±€»‘ÌÐy¡ÒN	¬”Fç6Æ‘ŠûtsÜÁ"ëÒÆIJ²ŒtñMoÛ“…Rkùh¨Pùª{Ó§{Ñ?W{½¢
d1z	µÙ}dØ¤<—”|Lf”gû i¡D­ÌÎ¡¸„²¶•¢8ÖÐRû”Ö\
…­†ÎFZØÊí¹žXîÌù¹P¢ÃsÜ¦ëh©¨ôÂ*9¥iBm_X{Ð‘~¯ÛÉ#9Õõ¼az*NËºubµ°:ã:¼gá|‹›0‹€Ø-Ðd‹8´IòüMo³×wÎ‹Õ†#Æ3Ò*#CØ³àý,*GžYµe€Û<!/°¥”ë5ûÓk¢ì§Ý]Cîâ†ÿ¿‰Ø”!ö¿voµàÇ»¢VÜ²{^dEñ¦ÓµNa/¤HÍŠBX¦z<sa&PÙlÌBð¨¯“s÷Ü;‘ë6”Ä*ôz—ª„{T‰+ôþi™%^]˜¬G`ý±‰nkd‘÷¼ØüèèÐëîK¹uGGŽãHå´%·ž„ÉK—E5m¶,«¸Kpóm®ò+è.‚òòáøð=:ý¸{p¨ÑX •<µj‹—V"2²&žf2È§™ ÓÆªƒ©Ò²þ}õ¼gÝæ‰%ù4UJ/,ªLR	tÐb„2Iª\Wê“>mbÇ(_Êõ*(ûSd«Š…-,á´°'‰C‡1¢•KÓÙÛPÚ/Þù•DaôkuŸ.ƒ·a²DÑ‰ŠU—•@r€=”dy¡hAûp+í” ? °Xè–©›_”ügX‘yC–º E,Úw	ÚF#
ÿÄáÕòVR‡VØ—“e°`eòüÛtËÛ¾Çôë±¼hš þá¬6ü·Zk¢Úö>ÄÑè—`	Ÿ®pµóvÍ‚ÆúØH‚)Ö	‚ñ;wñ²¾*R¦§¶Fö®y¡¢v8M¯€”æbá•B”fÑÉ4eS¸ôìî˜ÖZ“sa.•LCÂ¦ZDù£•ÜrÅá‹DXúì\VÂ’UK^âœ®š¼éW­[b‡ÄÏwÏòÔTÜ&ÉUNmËBœCu^Gê*¥eÈ4Ö#›ßºŠâÖ¥;‘*ï…)yßÊ•Ä¹#[±æ˜Sp‡³ ºZ6RÖz­ÌF,%µµ&êè¶4åEÄ¨9>›â«2a4‹[…×Qí÷±²‡é¥zçã
ÛÎ¦­Y9Ã(Sv.×k¼`Hq§œ‰QÛù¤K}MšCçÎÈš·øHý¶ë]Î%	Üû?ÿOüìrW‹¯W?Lû’j·æ¬v-Ù¬$ûuô«H¹†ì•ºÀâ¼2”EÒbl5‹E5èEžüž"€uub–^Î	ïU*›…K©Ú¼ëíu\±¸aÚ$ÈƒŠ1ÉSÇü‚J‹s]ím%žâýT¿ }ªÛÔÖ¤òGŸ™sèù^z‰êi)Á˜Kï¸’ª|³~ŸG9º%;AÙ9B@°I¤5í“igÆn8À»;Žýk¼f¬GD¸ç[”Ÿ²n=|\&Xëâ[ë1a×KãñšvI;*® >'ÈA¯`QÃÆkÿ¤?ËQtïjØ:—a­«£iå(¦Ãà¿óT}]\af¯`†e¬	ä)0·¥P8JÁá”7MHí]ü<G³›…9_™çhÃðŠ»n¹ã©š›^R.lÛØeŽüä•`‰d.Mqwæ6¡ôa§‰ºMÔk¢þy{æ/!±Ü´êyê/Á-^6É/Á´…g 5ó±™ñü.¼ÿ|/¿sÚªD7K>à×ÇX5Qóƒ¢3K´'°î
væö¥ªJë"èkÑš8xôô èTÓ&-ÉõÉ0?]Y‘Sž`Ì5xÔQB_—žRqbIK² –3)knOU®’±hü˜=Š­«¿°˜ÝüÔ.ot›ÂÏ’@Yc5TWB®gÁì¯A5T&ÂÑ´åöWj«´ÌgUJÅA íìš*­(G`€`P ‹±XŠú&!ë÷l•	*ƒ”ÕÎaU¾W}'­Åø'N¿
OQó2K†U¼Ln*{ý*©cy‡!¢öiZBLõ5ö£Ùëñ$FöÉáìšº¶¸…—)ÍÛc¢ªÊk]´PYøl@w£/H¬Öcˆ×cŸ'2—€Ûp(£ûkKé
NŸeô@˜Ÿ.<1Û­üµUH²“ÊŸ—Ö3V‘«q\Ø9àÞpG9Tá{²äŠ.½¤6€¿*GLÁƒ¢±ÊÞÞ·Lc+!JÓ¾¢:(…ÞþZ4Ñ´™RªB«Ì+R‚vží¥fûb†ÍJRÕ.ÌÏQM#µu½€˜¶©·†ÑVÝQ¥zUpvY7.Å.\æ¿bYunÑM’³ÅKº–Ùõ™é/wîy­PIâ÷Nˆ”Y(é°p-Ûµ/ÎfA \ž	h¤[}W°`Qh	)M+KárV¯ML)>.}›òçe\Þþ™O³*„é’…q²rFvŸõØDK?œjëã|_CÚ5¤Xf¾âš¨@¤UÅÓhìrl["9¬ŽB¹0›í˜âTâšÆ¡ÒˆØa0®u°ô²¨½ËÕ):ZKöQóßã(êy
‹_¹‹~_++E\Ë9R5+Œ “èDi‚ZdacC±‰¥é8P³ña®ÛtL j"€NªÕ?í˜31ç=æß˜¬ä»³Ú.¦û&ªG‹«©ÃÇýøv_:lQ“¤F*#Yâ0Ó†ÉËñ»àÖôy‘ä(î—°]¨}\Fñ-ôÈP„9˜‰N1åi–VVÊ'r(ùY™‡`,÷‘Ð'Œ\ù¦¼z#§nq'WAùv§°³“Çœ×Ííéë“£ÄCR:­æj&äÐ¹=‘™k3¬™1OYmºdYª—a½æ`×Ñ,ƒñC}±¡»0a4Ê£Ý¢Ä~ÁL6
a}ðmãVÂÎšö´¥^Hó„Ôòˆòöš¦<‘ÁÃÙÂ€ß¸åXæü³‰FîªBøDß)äÜiÍŒy¡a±z/ŠÜ1HÄëí’ð4%9ŽÁÅ°yðø°NhÉE×‡¢rU
É R(µúœÐò¤£HJàºv!)ÁãES$Èö/Ö'{'«ƒ´aàU|.öÙÒj_„S<œ‡Y;L(AÑ!9„Zfí£¥—rX'SÀèpÒïÐžµ5"ñT¯h¢p|³V*û²×.çØlï=¶Æ7÷ø} 	F-aÄìÈGwkÊ}çèƒÝ ÀÀzŽé —#VQþHë•|æw×‡ár…ó—Ô^ÛvÚŽãöþ4b`Û{ôgÔØ;Ý_û½ho¼ÜNê]rêþsI†:?JÐòD{IÁÂìýmG‚¾˜ÏÑ¶:Ð¦‹G!<ªëõ «@P¼‘7î(óvs»™E¾–Ãåb¦	UL:è¥iì,èáºbiÙaÎhYÁ ÔÐMKd¤Ñ3´BE.–¹–y£‡©ÈØ‡aÚb8~íá%ù|¥µðõÑ˜œL£Ë(ÅªcY|Nõ,ÿ»I½ÈÂ½•îÃ£Î.Q¶Åþa-aºÜ®Õôµ¢á_ñâ!ê†â±‹ƒ‹ ¯ìø8Âœë#ó¨ÅOÕšRi»6õ½µÙ’K³¤xU"E®YmGdÉ/ÛgÎ9™Ò—õòŠ¹ÞY]YíLõ¯@¦«JŒp™qE;a;Š¢ñM>[ŽdíAäYù^/}Â¢Jñ¹ …k-Ï;´…eì Æ@ýsŒ8c¹f…:$Ê"¾L¬‘J$Û5CXP…5¤		OuL5g®žZ8O–>6¶°IË>‚O‹ý¸i¦MúS%šÔõ2£/t23æÅùEûÿ¤pUwgõqzÔ›¨-'A\?Ï’~X§uZ$¼V~^¢Ï©ò†eÏ‰Â¿ºÎýç4òý£¾k®¶™WŒŒõR´»Ðê2ƒ¹n×HÉ†æµ?¬be2Ç×“™Æ}{‡îš;Y:æXªd~^y)-Yê’zKbý3’µÚ$Qªµ‚/ ²Å´1…×û6-ó:‚e[Ñ¨U`8”ÁÀjwB±±„·£´þ2gcr­8&\à8¹Ät]ÛÙ·[¬VËJeíçë¤ŠõOw(ý–öJAÌã†ÁKØßÄc¶¾)Hë”â0ç‹²Ò.xyn[œ‡în¨WÓhèOmˆîwá€`’‡ú¨Ž©É>­Ã9dIÕ×¾–w‚öí»sâ»sÂÔß'sN°ÍŒâÆ£9'T™^Új”Üw±á<®ïâ7toÌÆßÝÂ(woüº7¨EC¿Q7‡¬w`]Ëç"7TôfœýáÐÿÎm<OëÃðÈ–½Cõ27LÂ%5Ó<øªŽ·Ì;©Û‘øˆ½%êýûÿ¬èÂ(ŽFÞáhœ,Å±xÎ·HV$Q×¸3á±<¸KE—„-%}÷GÐcD~ó0—„mc¿i]­]Ý¦u§;îlnZoZ§CñMl[?ÈN,×ë‰“Y“ÛÜšäE´è·rc‚b/‘ -¤7B‰ÿ²¼1öhÒ(kŸ¢°¥§gÑ0œôí¦ÿ&Ø°ô®úZñzk½ÔJºÿJÆo@»úÝúýnýšúû}k¾äø¾5ÿÝvýn»~ßšÿ¾5ÿ}kþûÖü£]ø»2…?ÀÌ¯d3 ñoÙÞùÿÂÚ&cñ÷oëöKK¶K)øJ& yØwð»hêïw°äøn ~7 ¿€ßÀïàwð»øh~Û ºpaîVåùë¹¼k=Ã»(Ò|î„•îŒƒÖÆÈÇZQðoWA‚UC’´[lFýrkf”°Jøž_BUOH.A‘Ûz†ÚÚNb´u °ªÕ¨õE~gB¢wI©sÐH…J|KôuˆTADªº0÷ª’DüézØ>˜EíK	NÑúg´[®ÓÙÔÅ1ö
!Xˆ'b”â+·½Eëæ9íM9²2+^§Y†ø-”SÕ’yf«PîO,ÚŸDPã“•f”ù«.êl”Å‘ÎÜN^ü˜×”0¹¤
·y^ žœ ÑHó]Š ¨˜mÛÿFaø°íEñÎbO4³µÐMTŽIå[Ò"•ÞÈwFçèKèãoÝ±wÑé²’•~gc³ãå+¡9 è¢Üf•Ò`kÉ¹Ø»öj½Ÿ¯	7“šp¹Ò¥ØŽfæW.Ó_Lº¶y!d­Ó*1{Á(Âš~|sÔs,·0Së–=L5"<CDU%¯¨×çƒú Ñøœ“\çÓpà«"}è_\Ûìx,ZGoæ	–‹ Í²ŽŽƒ8‰æ>HÙ96Åc|êãÑiòP§ÌJgºP¾KÑŒ*þQ‡Ýq“äÊî({ýy]¹Œ76VŠØÓ{i$¤›d)]Ž›PºŒ†Qzâ+©rJšêI)}šì¹L*D)®Xà€U–íö2Ö¡Ä&÷´È¹¹Þ>ŒW„>²ªÄÐ¡¥!ÌŒÑÐs­¶H¿õbEÖEsÌ­—GxFöÀjëô6‹bÛu'Ë/‡†Ù Á¾dùpæÒ
’4@œsYÅÿQ»Î¾TÄxLA`1rdßúŽ#¡-Cÿ9-þëyýæFŸ–bæ(´ª¦sò“‰Öºa£;¼û¼ ˜j™ì¥R0e’_k`Saòré=0CI*ßÍdŸ,ýx	«Æ&˜_ëúÊó}Ìaòü*Æßi²*råPÙ¹ÈÊÐòý©)lq/°	Áˆ—}nÊY¨šqŠJÙ£°Põ`ç80'xR¨[¯nìEó«ý°áüÑB†VŠê/Kq ÿ¦‚ ä¹VRã+2v¯§\ÂOÁÔ;¼ˆ[Êi™=Ÿ_éMRVÄ­{FòŒ¥÷ìXº·&ð°\K¢‘ÿH\üq8Ýc³9:þ
·‡[½‘5ÜÅ^%ÖÆ¡±8·àråh˜LêßX½•2·Çål'K>öã±é¡¤îòâéÞþy~—[¢¶‹Á-Ô}–m5««]D£«„Ô…
ç[y
ÙŽA»žúÃ`úxŒ*Ú'€ÌˆòCŠÙr*ßpLi_ÍEV²5óbºµ+HãM7;sJw€‹j0òÅ7³ØszÎWe€ÃËÛîÑüj6„}óµ_üé–¾r@OÉ=Xs˜øóË ~*èAK–Ë`Ù&ÍÛã8×dødUP¢«%ñ+‘Xæ8óñÚñ‰ëˆø¢/Â`:>GgÚÚj]Ã_Âeß†×r²ç-êz>ßÊn¢‰—“ú±ÆËK‚i¸×Á$šb²]ƒ +Óõ¦Í¯Í6uld&j`FÕog^MVöë&K,¾®{}hT”c=›6·M»zéûã›c‹-dØê<ýY4£«£èäÇWe0Ä/’/—´*ÒvÍëÖÐ$ E‹~þ×{Ñ&3ä ¯‹àM tŠnfÓy²]›,—‹­õõëëëöu§Å—X¦9Î:n¸<Ðuá/'h¼]{çzÈsßzhó-þÔyë±Ožû¯ü™Wñ´ñ‡…5uçgX¨~¼V+ŠÈ?`ƒ=àGeÃîê»æ–½UZÆcðÚóÞ¦C£h·S¡Ýqp‘XX÷´ÁWL¿E!î‰4êxÞÝíšëÕÐ-þÛÁ_=öÿõÜâªñ§y¸ÄäBéj#~˜RÄUö"[üCÂ_¶kØÝ„ÿÊ_S¼?º¸ÀÒ÷®&5uÐÿlšÂÒ_Ÿ+ßf»'ýþ¤¸w ÿ=Ê Rl‰¯<€žLÝÜ²O:„þ{”!´'çGÂŽr	o~­%Üß„ÿeøìg¢êðaí§ŒO¾ ÙöÔš•e\‡ÙßR˜ùA‚°Ýq4‹Ð(Â¦¢1¤è0ÑÖ‘BbÙ&0YKßR´ie-JÔœXý¤8¼È¢¿s¾½4<>ÝÂËÌn#E‡O<Ñ¼n0™KÏDn,:ZyZ™º7ãUÎ¤€«»Ï=Fðë4Iõuƒ—4-v“È ±pTKÌù9‰»RÌU`§Kv]ÕÊXÞÓ„Ð×-+í_YÕ=RYË‚X#Ã©±tKÉÔCe‘2¶&&üÃŠõô$z5\Pæ¢P™^?…Ë	6‘g¿T©§¥|Â‚úÉ£zÎê uï­Jö¼OCù‹´ÌéþëGzÑß~	éQÚÍ§_GV;+­%îê#/Sã/Õ¬íüÐÇ=Y}^Á²7(å’ä—Bô´µ	ÑC=Äeag…ð¡r'“àw±Óa-AÚ=Y5±Ï!s±gÁK:vÍYÙ„xDåkó¡ºWm'´Ï³ªp¥bvZ.Ë¡ôº}ÇÈVv*‰¦á‚ëIv6	ù±Ž%CF÷^'78ù|$ÉCß47zàÂµüÃÝ*­1çlõÁ 1Û;§Ñ ¼­Iû›RŸjšC×í7½GŸÄÒkJ+>T"Æßo¨DÑçÿÃ«PÂk~»
ëäß³útœú24ÔÝç|fòÖ4ìa9B½o#–+¾ÜeÅ—n¼r­+›šu.¶9Gƒ{ñ,vûvÚ‘ŽS“Uéx®×9„£v/&Âº*j"‹v(:OUÏåùÛ	€Wa–FæÒ“fqËK—”mZ.Ûi§{éÐ^MÞÇÍÈSJÁ×o`³ýi±±´-´¾%‰ˆK„˜ÕKØªÅL6‰#¼ûÈ9èu•µà¯¦ôXNI*Å•îïg‘9©v*å³mZ&pótÃ$Ï<Ë7L–qôKðÙA½óÚ=S¢0š¥Å­ý!-Ï+³\Y9úªi®}2{ŠdÖ_£h¹¬›Bkï12XÀãL•ÑíÒX9ÖË?@+þû¢ã?UÚpÅŒÈE™ûÑl1@žàW¢Ó¾Z’+*Dtaáõâ(Mý;‚â­+ƒO¨
‰¬êÐ»”wxLOPH.Æ ôG›XHähWNÀFxRf˜è,èWó:ª„1{ãh7ÌebÈKÕ<¿;lÔà¤l½Êx;ÎJ¤Ø°Ø»kL ',Ë*.ÇÑ(H­P=ÙbJÝ›X´ùžñKIºò©…Ø,;eUÙíäjÝ®cJ†µˆ¬ê®"ç9Õ%Ivózñ’6ÞÁÞî(ë•Ì¶ ‹É³Þh$¨Ck0˜Âð†ãi c[ßæs(¹N‡”qKßY®Ám‡YÖ,þÚn·Üj0æ^„ñSþ¹z³âšÀí§_Ñ)P²O-ˆaÂ…N(9âEñ¬nAÍ6UáEl9V·(Š|  6ã·Ñ‡eˆÿÎO~iâ7Çìˆ‘AE1Ú£åÏv2™™óðIMG@¬ž¿ 9F$¿‚À‹LÌžh‡)Jüc‘Ôç¿DWó-þV@ÏeÏÔó»÷$h·!…ã®èÐ|y&Ê}±712…7Yfô”…ÏE¾?ù´ãxÒH6÷hâãg±n)Š!:„	ºJ®ðÓoÑÒÿÂ³G¤œ%Âr&	ðMã„ŒîgñÉ^E+šø	‚{4F–bãg6hŽ9t%>:vÜÑñÞc<h ³á|–­ŒrÛŸ<²¨;ûh½KÁ¹h´®a× Ëd û1šGéB—½ßL­"qÎšˆk$°¢ÂúJ®—Ñ'‰·\†/®¦§TÝMì6VîFAÃi¢>^í¶ò×V×ZÍ~Iƒq$öOÅW›{æ<X,­+L¥v’åºGBF ŸÜÎGˆÚU¶hôÀzÝOü­"÷µ„åÇ2¾­ød|€ÔðÙÒÃÖI­Ú#ÅX‡æ@×á¯	ºht/Â9°q˜=ö“!W·kí Ë‚«™=«xÐJ.þhºí_c«}H›É¨ÆƒÔÁzþû3;½ËÚ©£ûŠNlôxÎœóÊUÄy•:@Þ~\#ð¯…IÐˆ™qÎ‚èjÙˆ›ÈÅ|cíïWsn6Üú½ó—“6–œãhÖ²=Ýþã^Öð…5ÌTloèWïä£tÀRY\ƒ½\õG+-¦öŠ-ÝCÕŸÑARPå¹‡uMƒvÇQŒ[xàK^[µÿöW[¡þ²CÁÅ!ÁF4à% àA¯wÀÓÙóö˜ '–K|™Ž&÷œ¦ëôšL°$ØƒÄ‹;ê‹{kÌÍùzì6j{OAZß¶ÜrarØÆG ´°y©˜Y‰¥¼³sÐ¦—›Ò¤¥XJâze‰xŸ¥”_{*Ð¥(S¿zÐs÷r{‘YW:úiZùôÓBìFEˆ\sç:ÞÞ·Ú¹£ÎÞ®wôÛtÎöÚ'R'ãÒR§¬¤>P”Ù±`EV`Ê••@+í¡ëTÖª\»yí'“V1lõ…®·fy¥×­Øwy"¸«óéÞ?œ-¢xÙ¨·Ûëaý$hc…¿Ï$˜71Ý¡q4j¢«Å÷ê >†óQ÷×ý
fUÝý«åäe›a0J‚ø!*9tœGpns¤Óˆà„(½¹,õ•ÔSB¿é¨4Æðÿa[ ¸å¤ÞDð†â¶¯Â1~ð*o	ÇÐŸ’<élôÂkÛ!§ËGu³£’Þ{¿Ö&:f# ÉëŒOGÔËÈO–m¶xŸ3íô–»­‚qÑk•Ëªÿú¢^óÌ¶nyóU•ë)Öô½é­5¾.üpŒÛµ‡ð¡•ŒKR±UÎMŠ9•sÇÙs6¸b.#ÞØU5t§é9nÓõ
ºxm¹~NB…,”t;mçØÇ²X"o[Ÿ¬‚d§¹W×‘Ò½yÝHÌß´µõ¿Ý-‰`ùdåãS‡¯çHp´7ZGoë&tŸB°‚èÖ­`¼hRò~àÍÍð²5QÛvºJµÈymÒUZtpÓ¬3oõ1¶¼šCQÚ›¡ªUì-«2+8js‘/•ÄO¢kÆË´útUF®Æ‹€8¨ê®©àÑsyê\‘“L=¾J¹y™ç%ãÀ%¼8C´ê¸õÒøHkw/#tÄ³pîOíHÎÞWbk½®Þ„ége¶3~ì_oi™¢JAGöQ:¬L65Qob¨Z)˜I®-X½´–UT ;÷Ý¹Ï;ÒEù@uu4äCCk†~yÆ©6¢„á`	ë‰”d¡@Â'6mô
?÷Ú¿m·Ûe¡•b!PÛaÛçÄÞÂ]œâ–„Wµ?-DàÎ	ÁtˆGÁµÇÆñÂ>«Á¨ÖDµ¹éáC~	–ðé
?­vÞN¢YÐ˜“ˆªò ‘V«­ÉÕq²*:s‚ZYa©„7ØáñY¿’¥pž1K5¦”{[¨w¢
³“WŽ¼"“QM§C?†UGø^@DèO¥Q“¦Œ5t†ýQw1„´˜âµ P%cÊb4!©|EÓ
ðÂx â?ï”Ep±" ôÌëçPår¡Œ</ppŠìôòz0o}:©7ÑæyáìjvSí ¼—Éòš°t”¿Ü¯Š¦H¯¥Àëe¥4ÅÀxZFô Bóh‰ D úpµ|1Œ×w¦°—a¶ÅePº¤;6¢ìQÐÄ”-¥«(e—Oè€nâfÛB$¼/¦‰Ò€[ùöÄ¦åöDA·V‡“Œ(¡âØI	GÁ£¦A–_T~E±`©4%ñÞäVòt0òop®fI	ûÌmwH©ÑKYŒÍ$½¹€`.4" ‹D±r5¯¶Þ×š¤–á÷aˆ¥&fü,Ò
â`.Û¥s\ºL«-P@©*µôS{­5@ŠX7f6FEìRZwR#VëDp×3Dèñ…Ûí$Á¬ZCDð1šªÞU„–#·çöVh	¡o³çnºb‚[ €¯ß#‹ìD”ÔM¬´B þ§4v’4ˆŠœÎžmlÚn‚Õš·PuN(GYÌ*=Ìzë//LT¼ÕËÐ)GÐÒâ'à¿t¾îyéªGâ¬¨êº«‘T‰åìƒÛÜà5±XÛaáÀï#ˆ-™ÚÎ?¥©›«FD3í$³$ Ò˜*b^mçÃ|z›j"Ø>…h©`[ þóg|Ân
)Do›3o¡ÿ®æåèŸ	Ž˜ÛÛD­Ž&@VúÅàbóÂ?GE†ª@£ð¬A3Ô† ÿö6i~¨¨äÙNŠEÁc¹°”ÿIŽÂ…R¡ŽÛénxÝÍžÓ«Vö´¢sne×«ÎÅíÑ4\#?·¯c<g§x
–ßÊï^ÁÇ†yåk?Ùa0¦k°±Œ¯ª8å]³m
T†ôŸUñ
ÛøiÊ_¾‡ÔŸÙDPGÀºikobž]³ ö§cRÌGH&ä§±.—¸ª.Âø¨>Á»‰<&ÕôvÛbn“7¸g	Lì·hq+ýdé»~dG¢]˜ýÓ‹¢>E^¾Xµ ˜é~VÇOã›7· _R¹P"¯d´ƒDð†X…^«(Äl áé!¦²Û\/¥»ÓWœAÞÖýÓ8À«×¦†0Ï|gÐÎØŠ¶T(óÇB#Aæé¡(×Ješ—9IùüÈ"E¾—ÆÈCÊÞÏ(H¶ÌÉµ^‹+G…~eÎV¬­9ÏÄI·[b(Ù…´Þ3,k‰“›kmÇâ6D‹W mtVÿtr •ÍñŸSø{øé#üyµwžÃ?ûÿW,y.Åa¶íböì96¯ ƒ­V_°­2úŸßQWqùÿ   ÿÿì}ýrÛ8¶ç« uÓcyÛ’õé8Þ|”c'Óžé¤sc÷df\Þ-Q;”¨!©ØŽË[ûßÖ}­ÝûûÏ>Ë­û${>H€@P–Óéé(Õm[$888Ÿ¿PI·ãÂš¿ueYï²°9§áUXÝ$Œ`ðJ0JÐþ‘K:¹ŒÃqúW>«åÈÞ÷~†!sMlaNÃa4"·Yîˆ)ÏUbð7u´î1ŽõçO&>••˜ ‹<z5¹<”½Âb=@;¢)Š¯¼ùÒ¾þg8‡·_Só
š.a*F©ÐšÝgÃñ66õl-šùò°ð=>M°ubõðÆ{Ú ¿­Z­¼˜yA¨iÈÇï©Ž°áÞ Ç•UN
lº73â‹§–Àq^¤?ièÆ½¦,±7)›Éìª”{/){D>ikŒ$[‚$ÝdµQ€¨þ…Ó:c
Ÿ-öÈ¡—úíytÙ¬±jœÕº?@Ñ®¢±¿‡Y×!h%8©&Ñå ]{ÒïØJÇUÉƒ¿†½üž†ân?¸ÑíÊÛm);y_k·£tŽlª61¬i?®e?ÝuSg„ý¦>a¯{“Õ&uíÖªAnw:ÞVˆX±»â ó÷«Â•“åù,HÑª™HñÎÎQËyÄr\#_WÎbŽéX’c1è•½Æþâ<kŠRñ’0£!Š½b&ßòÙÉÐP4"˜;;»­.÷¬¦·zt^µÌ0­C‹{y¸ÓQ¦5ÕBëLËc[#¦•›ï–ÒX¡pðblAK•&³
k†½ŠbŸütD^„4m#!ˆºuÃì(²šv*mL(¼½c
y“ˆt,iX+i–òì³îP»´ë\Z=Oí¡ÆÓ0‚ÁÐ8+Tå·Y908nöê×§­öÇ¸€Û&@†UÍB¢¹cK5fžÇ¾÷Õ/=ùÓn|øÇ?ñxçÝôÏ¯§—ZD;½þÛytñË‹ã^àVg¼Œ%™A8^bhÕÿ'Œaˆ[–ñ‹Œ $†°r.%µÖŠp‘¹¼«òb¼Ï‰Ymÿ=îOn’øâwŸRÖ¼×xºÓï¶î0û”«>Cƒe1´©²Š]eþ„¯û÷WÚ¿ö«ÚË%WŠQ°WˆcÌÏíÝŠªS&ÐÍ>æÉQé²ƒ_ð‰Ð™èëû!Ðh·"0 f3|þ}t‰;~æ}ð‰'ög•â+	=š3Äm'¶`@,(‚`å¸›=‡Ê€õJeä=+¢KÈ>ÿkŒæ±ov* ,]A¥o«
à×”ÜÍ9g<ó@t9·DÇë¿¾ehñ>ÎÐïD¼¾·X8C^×A£„"R,7¶;tYßbGSV=ƒäˆîb­-*rzÜ¦R<p;‡¯yðN!Ÿe?glÝ{Y>Ø44+b´NTø5ìL:lÜ™ÎÖ°ôdñnŸŸÃo	Ã³ž;£ûØÝ«ŸÕÄF^Â:2ØœQÑ»âìÍoîuV;€«"ó4	c¹`§t_T:“AX©Œ¨/bc*C¨Ù¿ÅÎt•4ž~sG æMÑwØ˜btåWÅ*ÓLé	¼L„!¦•uSXÍ§ŠH`/‘“·=QÖ¶ÐØ;MÜc›í¬iô|“ˆ>!Ìõ,®và2¤è·¸gÃsk&dK`Cà²m½;íšk?Äô2`8.ÛFº{Õ}Ó¿Ë¾Qûÿu6N>†ßáÎÙçÎÜ¤`ŸÃ¨•å<øÇÒ§^ßMe¨ä6á™e‰‡¥v‘î™`°hsÌà[OŒü»mˆ:—ßcþh³¼³´ªßËþ;ãÙÍÉ±w‰9)Z?ÑlÚÁ‹ƒa-ý"¡Ê¡r¯6W‹5ÔËÂ3&ž`I¡ÌUéÝ0ƒz_.Š1‘FøêJcU¾.±3Œ¡Ì›F¨äÉ–´Js_–+«VÌÓy6¨–ˆ,j%ýÁ0À·N2§ÈöÁÌß3Äý£Mºñ´ÓÙë<Úv-Jƒñ¥4_é2ûxÏÿ6»2Aé*’Ù‘r1íÜ5MÒYì+ùï\³VÖ@€ÐTÞôRy)d.Ú¦ƒÕí;[,î©zu[ÍuCÔBºÈCù_ÝNGÞFY>ý˜±ÒR¦¢u8ââÖçk³ÈñÎÙ‚Õ¥mK¤žsŽ®˜B‰“HÁÂhÒƒÖ‘’~³s×¶;l¨iŸªbšGŠ¬¡Àf.WÉ¤½J$’ÛáW Öb"c,QŠ	Å,×*Éâìí ú
:ÎA;1sF¨€»'þÓn°È	Âà‰ÝÝ~¿·3èuzîJåôé»†…àn²žõâ×^ØàŽëì²ÁY2Š´utøkípÇ”)¥òÞB.Šü–¤ùâªý°ÿ—þÎá_ÿ¼YÝ”)¤È2 ™s ŠV«wUÙ±V!ŠI$j’48'ÎsL›*·zµ›kµÝn¸`ÒeÔÈ£â]¨êÌaªìw‘¡Q2Ë0Z	Ö@|E¸AžÓNh¨Œr·\/ñ¥^¢ÀOšÃm‚XÝ½-ÝÇüò~wÒäèK%·<sª·üÒÃòŠ>µNûÝŽ¶¼«¦fcárzª¯6j)ë¤Ì­ïÇk(Ú0­0êIêÅÔoÏÂOìl[‡°áðß™ÑD`>¦Y×¥bÃ<>zÞ9€y*×f]{sfùVëŠ×íí¸°ðR«—­~Í6ý¶µ€èÁÅÜŒ8§»EÌ eü³PÔYÿ«Ëá`”«,\Á‡wS„¯Bó?ê,3OÚ“ „Wi¦˜d–¶ñ€`„ÈÕcJ‰i›E	³+¢Øå¸±ÙýùE:¥¥Ÿ¡ñÒŽÎB!­ô\•W#ÃÓ‚J{*…=$–gáˆ×ã3€¥KÖ;kö¸P6
 \UJ3
c’'þYùò©ñéžqæn†õ"N³J[ÕáÆ¦j±öaðÂ6Ø¡4%Õ½å³Èiÿ‰ Nö7.á|ÜœáÎXŽ.“ÔG›‘Me¯šë<ð¹8V¦Ona•˜c·É¬U'H‰ß~ûƒhYÄm³É¡¦‡	rS‡pm{°³ãÈÔQ1£Ä<F…®rH¶Itg:£ÝØ	»ô @m
Ÿ}ŒÛÛd<C§Šœˆe~ÒwüšÙÄpý§ãC‡ÑÉA|½H#Œø•·áÂ”ÄL\Ï@JÖ¤
fÎ­gäÂO…iŒÝ^àÙ½Ôª^æ>ÀÂÉY.°f\Ò´a"c¹7Lûå–¾—q4£¶¾a§S0ñ¹ Íòµ2Œ€Æ!–GÁshË#©äÏ9áÑ„äjÆdÍCfÙ+zø&š£¬ÐKR.“W'²¸$+Û‰úîOqAê¾;e»Ã»{W¿Î»»Ð§œëëŽoêBúAòêå1æá×YÍG¤€¨ÞQ<ù†åN]sVÿ¸¸ÑÑÊ/¢øš‹nt¯6ªo5ußÀnºÊ(÷—J/V…ë	<ÑÎvÉßÑu ?%ãô$õ:¦þÓxÔêuX÷¦ðzU‡—šgãÉõ~{Dµ%ÂZÇxRÌÈûƒ8¦ž”@vÚÉ.
?Q<½nÿÀZâ¿Ýþ½+ý®Øz0¾}Ç×Åm ¯¾‹l*¦‡©è°Uï:3l6îãí%M"1——äå†Æ9Ô‚Û@ñ±ÇG¡äÛ,Ù æ5tî³Ñ½¤îHÌ}B+lÍÓ°ÍZg—$ˆQbÂÅ>Ì¯ÙÌ^Øa‚ø[l/a~[tV®8iž¼=€=½ùvûó1>!¿Ô½ÄÝ6Ûoý1C­n¾/Z=IaQãw†Gî]°°çh	L½9Ü^„²Ë¤*ï¤ù#Æ¾Ü[	•­šâMý¹f¹®˜{‡Âl\RyžUæmGÞÂ„½ôóyèÍ?¸@ŠPYà’Å¾Âö(ŒŸšÂò²ÃâË'jéa7]ž.i7Mc‚%®0°à§Š^o·Èn%ªžÄëÂÛçg­ÎþK‘d¾L†]Cæ˜M’²À‘½•ÄA¡ç{àŽH!zñ¬s‘ëÓÚ¡®tk‡ÈÈY3Dzá‹"ßhš1²+Ÿi_OþØ×“ÇòYçÉã`ù¿É))œÄ_­Â”u‡Õsf3:¯YBñ:tÎáp0(£ƒ”*O0ôÍkáþÍ² X¬¢R!CNTWRˆO;íG»g¦(‡{%)Z¡ÂåLýÁOËþvÁ°dOÁ[úŒ4Þ`e†[#ó{¤ñÖ_øs.	aEŒÌûçw½’ï_yM0iÉ]Ÿ×&)•w©Ü7e#¾jÒp­GÙîtªc“ÌVfw:<¡3óž4ÿûƒ'hD&ÀÁp^b°H³·yKhbÎû*æç²|fðÛŠø[ É“¿R˜H]·ºá¨_cÿÜ‹³¯k±$ZÏSMmVÈTFL‘`½Oÿe0ÚL&g9PŒØ¿ùo­h2Á¢Y=Ø„£ˆçå	ÞÃNëÀBô0``$Y.ËsmË§¥Í—ê³òïVuG`ºsò#ÌMè]£©n’|á¸½6{Æ9œªX„Lå½"øÅŸkƒŠMzçI.S?k5«­Š )JÑ½S,uÔ(¤JŽÅ·âtxkÌ±A2dGZ*jŠšg;>:`EÉr€«ž|?¤²ÀôÅ·ªJ|ƒ†²Ì7sž¨5¨K¤ñ(§E`Ç 4KJ&F‹ûp6žò¸{>ç)+­”9»YÚñy¾Gkè÷û»…´Ô:ÛÆüW²ß¹%IGüwÁ8Â¶Ê3önË*³
0¢fÄD™iëtØù8=+V÷3¿ÓÍic?Ñ ó&Z,C/Æ_¹
~{ÑbYy	þñ#&6ÎÚ3oÑ-}ÌsE‡n;õ>ø×OnÞ¼d`¬œ—¶è&†óØKoíÇªR>êŠa0È±xWE #RMfr>]Rø^¬rR†P®8˜Ì($q;g(eAôi%Í¡„Ò°ýÝt'ia3àìçg©}§XÏV;*]Ë[ƒÏ7õâG­4Éò—J£¥§Ö¿áTuâ3mëãØbÖ×m3àÅ™ŒÔÎ[§¬,õ8*ðä¬üeáˆƒ@ÃNoÄP2ùkƒ«l`bÕ™á€ÖY=„0ƒ£-…ndÍn/›*î3„Å…fð8ÁèÂoƒ$‡Gó½nt?Ãþ- ê¾ßd]¢ŠŽG&i’Ðj]d}3[$ûôv*Ú¡¶ÝX6aYiÚY©{5u ž{ó9ð”ø(¥htË§8Š¬r)æÅÄRPÚ*ÎÕæªHìbûL¦xû‰ÎöY4FYÚ\Ô6¹¡YD-CðuãŒžÅ»ŒúU¹W§^ß÷ÉÍÐD÷Hg‹\a•…:%Åé‡KZJc]ÚXý¶ü« ÕŒªµÂ°òs
²´Øî×n«$¯zÃžwV %†Í`*h=­‚ È*éÈÜ*#ñO-b´ì$*nƒ¤½Óù¶ÖFáÍÅ\~‚?*Dè
©03íPý¹9­ÿ!—¾OhæDBPk oîø×rCû½ ¤Bi;ºzéQówvú’Þ`ûáŠm3mšxÙàhcõÛ:;Õq£³šÛ—*Ê…GÜ*OÊŸ5ï‹n‡ž0Óì7É¬Çrž\ªx–sVØkZ~Æ¶$ä;Â¡n§Ú“ˆ
(”’ÆÐ‡]bN¦#pÅ @¹ ñô[nó«MPæ±u]¹š‘Ô*íUë½
ƒÎ?c?ªI¿â“Ä£'mk¾&Û‚ƒüŒÈcíÙbàV­üA9þÚ¼V{<Œ¢ÅŠÎ–|µÚ³qr4§&ËÕZP¬¨§ÝnÆØoÑù/Xea„vË`®ÔçÕá·óÿ:íî¦Ñ+Sñ‰æ/0@:«ç^i£ðÙÞ&/=Ô¿`S‚&ÀHn'Å
#o¼jËL?aEê@1ñE¹ú{áËÂ‡W½KÒëÐa:ÁÅ…æ7‡n¬Ü*ìÂÃBk¼ö7G™_¹mT°XKî… ŒCœˆÅU/-q`íQìƒ,Î‡ÙÜ@æY§Ôié#úhgd½­ÀÉ×1ÚVÅ5~°ú¾¸moeƒ¦A8nŠ^VŸ¬Úgl¥ç\js?«ònå$åùìíQ¹€u„QVƒõaÇ RØ§ªu¸ï^’ÕiH}iHßƒ²˜óH>Ï¸ê/ÈãíÜtPÇr±]0]8?ëV†6û Mç8fäh>Æ[4ßÁ¦£¸[$˜4ÕÏÐ5TW+¼9íl¡q¢·EúÌüÞÆW›xÃ@W°Ý@g+›nÞƒ”¡D~Ý.í‘9µPðAí3Æ¸O`äµ¦g„Èe%_k7°‡ô¸ÏÉëŸºu…¤
÷GñS[2çuÑ´®fsãi¥¹¤×+œ¶ío ,›(‚é¹O¦~ìSµÚÁ˜RL£(ñY²ã<@ñGMÝEþŸãAæ1hJõo¿ ˆ(œ¹Ž6.ê©ÀÌ˜~¾0E1ˆ ‹a=¢]¤—s<ú(b¿ƒ[²GT»ò=çbíg¬Œ­ÒÉXkž¹´°s˜¤”Áž–M'ßßmÒúôF½q¿¦q¢ee¸àLäFN
ð’ð):çé‹ ¸jJ17šT}€—ÞIž¡æ{áŸÙÔWžøÃvEÈÚœÚè2Ì¿(-€–‚¦h”2/h'8i{"/þü‚þM³³!þmÐ¡Š
£‹è$sHÁy~7ÀÝß¯?ƒ•—¾£?fÔ ·vK¼0}Òhhö&7g¨êl	“ýøMëqý¤1Zâ«¡:"Ðü“Fè}ºFˆ5†ÎªÇX,¡7Ë”ø¬}Ú9£Sñlƒc8B[¼570håE4ð!ÁÀŠl8hw¥Ð¾Ôt]¹µeR9{)¢Ã`Ýfø9Ê&cuƒ~í¢ÔÁr@BŒý»·x=]Îq´xý“?ò)ñÑ53î2N]®WT(€vê!Ö%§Š
ÝbŒdaŠÈþÿÅlè7§,M+‡Sün¹v8ŸI‘ûLÍ aåV±¦øûëSºÛ÷è[¥qo½ËtÔpwq”¿6§3åÇ¦D€üàG’oõ)¢YmXî	Ú Ü8ÆSº•F­ó˜Î¬Rçyç°Ìùcàá_/ºÃÁÖ,Â?ö{;;Ãzn+*fg¼­Q¦Ê²·hˆÞ¢j÷ÏCÛþ˜Qô®ÂúˆŠœh6£	«{£—p˜š¶«‚j‹>N»íþPü!Š>$$>à	„û
“:rŽA²	¹ˆ¢1ï‹‚aÃ”ûqÒ&ßÃr_ÍÓB´æo±ëÉ7LP²#ÝÕ{ÈbÏ‹==)Pç´KåÃò‘,¯ÝÁÔG3ÍÔgï(É8Œ)éíŸ'8ñ)¹£s©GŠŽ3'óuœ¶˜Ã=€)m÷ˆRQòt TA}&»™Á”ýfAýŠ†Þ#5j$øîùNoÒ$ÞíMusOÌŽj‡ª>Ï‹ô¯uÏh¤˜ÿìÅzÕ/6ïú“	-BG)ÎÑ`¸¢¯H7˜1–ê¡<ô<‡ÒëèÛ×ò1ñÃ.+@ÏZ±ø]¦¹<Ò±_o\­Š”û‘š?â2|_¥ä¯Ròï\JîtívêKÉü¹j)9‹¹9ùU0ß#Zà|öp=ç¼Žl™X@tfÐŸúãhþ–®\7BC³—¥ ór9m“­ß:J¡ÇA§,ñîªhþÊ‘8ö’)E±U0iù	RYÈ­×‘d’ãL&É£m²²ê#5»¥-Øè+2õ`³	hÂ]UÃ:2
¹réPÛòÌˆ‰7ÖdH0qn š’‹b>Ë¢†4š¤¡ò~&iXŒFD1T1á2«¾ÅÄ¨X"ê·V.Cù0F&ÑÂJ²RQ:AÛûq]þàOa÷·Œ*3Úñë>²Ê®üV„ êŽcVòHy¸(Á®p8ÛÎá` ù<.Üh<—M÷áy¬¹V8§5w¬ù¼¾Ëq-—‹,(^ÏnïÂt¬WÌõà*
îºw¹­w’õŠ'ìzDÃ	æ|ºv³WÏ0/ìô-š¾´J“>GÂ’R]TSvi”ÐbDb]12€Ù˜™}ŠœDa^œ9rE’íþ³FæÑÛîÃ¤âÿ?3ë`à=òmû&¦Qå¡,A®B¸ápW!ùPÔ¾—;ÈÎãm=›V?½|pcvB¢R«Kƒ¦•±NûlË|I8Z¤*
k%CªÃ]?‹<èV:ÏP„†W:×;Öm«®È…¸ŒrÙO¡×Ð•”Ü·éÑ’÷k“%/k/Lr÷â€¦ŠÎ¥ÒCnÈ‚–÷ÉI¼†}§ˆ3¡œ/@™Ð³ÁnQÂªp<6ž)ç†5žC÷`åCä³Ê«åSÇŽ˜AëgVÿ®¢î3Ó™ešåjõ°kœ‚X‚ÊvÚÆaŽÿ©xÃŠãT-’h—¾s„èÜ¬ƒSlpÑå1Èb¹±ÍjiÝ’]ã1žÌbàµYÞÒI…¯ñ·¡AGëÍàæ¯¬Yª½Tz$[O³˜0£E”gNôƒ(Ÿéžíiððo©/guA g¯q§qNÐZBesÊEËŸù±Ž)ig±¿"ùÉ„èÔ-ŠºŠ¼YyUõKŸp‰—¹ÖŽi¹¦@,mNŒËÊŽ²þ\Hçhì}î…%mj†Ö-Ú9{Ò` ^¥$­6ÄÓ–ªm–óìÅóXÍ<VÓúÑ—ÀH„|ÌÑMwƒDIËµf™4’ÔÈmúmžB[6ó~¥J«HÈ±¡LO¢2NÉì¼aç¬èþ_„ˆ«sÌPFÜ†”sy®g)# Ëh™RD'êod_É&I©^ÿvFéÖP0Ð‡àêv“ÝY2%[dŒÕ™nµO»’KÆ~ŠITŒjg‚âD	Rû1]X$JííSJ(o†
Ä'¨~oÐÛ/TÿþMh¤EÉY²S¬ÊlPï´®Œ5Ä»;Šb]ÌA­V-fW:„Nyqô¢Õž	È‰‰ÇÓÀÇû¡§6;!“BúÑ:…<Vì÷/~oM~<yC¢±oÏŒ®íÆ²Ôºq•È3häºôóÎ'Sï#Vpšcý¦ÖaëéF0$®‘Æ±ÌyHš•‚¶(—~ÝO‚ GEamP,VFþ/ðqmf®2^Úoê³!œû U¶-«²°$­XÏ£Ò|Ù)Ê¡Ä«kyWèøçòäfÇžUP8×€cü¿±?d;ÞD…®ûôØhnŸþ·NëÑÙöÅFOVä<(‡C·¿¸áìS«„VŸ}×ÌP©™‰ö¥0¯Oœ‹p½«0ççÜbWuJ.Ç‘~ª™Š3ëâŸJÛžkºôÑž3U‰QI?5ê?ÒÙ’HÎ6ZG¨J¨áªÄÊ;Xû¬ä\‘=ôˆË:ùµˆ­+Ssõ¼äz>"µ°˜ßúÿXÒâ¸ˆNxÑÊ"z!‡pÆdÞfãØŸã´˜
œ1í¶CÕBÄ÷¹vK¡–þåÕþTÀ-ë—×;€ãHUh)Pù–u¶U§PžÒ¨5û…ñ–{ukÐ½Ó4úà#¸º‡€Vï0•OjŠU6>Á{ªCH­Æ~’µ9ñÓÑ´¹±í-‚m††˜ÁQlƒ¬1nEé«æ¸fÔ1ÿÙxóãñÉ†3ÎÔ§AÜ{õ2ð7ŠƒÑN¼zVVØÂö/I4w mn&8ŠƒO´hïýsß‹},iGâö½kk·ÎýžGãë=ò§ã_·
‚fó†o=‰ênm–×¼ã:t0öR/# Š6N™#%QX:|&úP6!ÆÑ%e*£‰#`µ©¡ô%ˆ™CœæD‘õ8B%8¥|²Ú…Ér4ò“¤¹ñš17&SóoQÔ¹þÆ±Sçu­º@lÜ×…×Þ"šçhJšþñæNËˆZ½ÑoÏà…±:ÓçþW†»	ã Áè¿ñ“›@}ƒš‚JÑ;AoßE,9Æó”¦À &„JÖ3ò–®ÎÝ¤•
Üusùt‹§(ÿ‚®8BÓÐŽÕ8ñØ¦©›tB«Ç¢ZùsÔýŠ†ÊÑùð÷TY©Â¸U•ºŠ)›4åNŠ–ÍŠÍ€¹ð„ƒÝÖ¦}óÈ*å{yTm-Íg¤ñuL
fÓA™—bÜ¤U$ž{óÄcSCXge‹åöA¥¡NFi|£]x
Ÿ,TÌÉd0LÎ(\rQÞ¸-éÂÊyð¹-À6¸›_n…Ù©‚q»£u9›ò*|ÖæÄ“8€ÝúRü»ŠmÞZ­‰¤fÅ
ëŸaí1›3%ëRõ©bp7Òg·ñTŠ_ø#4y¢q/†s1ˆiÑæ¯Ò¢Æ¼š³aµ í+¹\øVëaäªqiBïÜ«¼í‰²Ï1ŽÛƒ¹žA¨qôñ6mÍÜYÕ±Ä%jyµœJ…3‰ÙeÍ·Ç Uý8¯ÍwhÍ|tïq°59½mÑRðâk³)ToZ‘õc”9îª‚|~Sr3!Ü³Áí¿+9BTÝ>:$ UÒ‚B„¾aZ!è5-˜ˆÏÒß¸u§,ypÇ¶ÝÒ~¢ÐWÑÃ:;_EZO®}†¢G½Y24VaËwwÁ £-TYqx¡LÕï"{jÅw";+Iì¸Ø†dÃÐ†âßõðÆ%—³‹qˆa¨¬^æqUç†Ù¦Ä\ùèÚïáàÛ
dÖsÍàz•ì®öRgo
ý¬Ï¥"5w¯~©Ÿ5:Wè§f÷ëv³HM;úZê¸XègE?ý¬æl¡Ÿ5{\X›ks»Ð»ï…~ô˜Ú/QrØÔŸ±¤Æ8rZ+¨>¬0ËŒàØæÚ#Ú¾~£žl›(µÊ¾®ßª(gº§Ö®Ç)øéøp…wÒÅ^éˆ¬GTNÞ7~k]q?ý¬æŒ£Ÿ
œâ<¡¢:Èåî0¯ÇœÔkÌŽ~WqÐÑ%	m•6xØ±“wJ÷¸bâ¿c+ü¬\µ•tùbSwpü‰&VŒ@Ò½PP$}+x ñ³š3–~ÌYZR;IPV­¿÷Ö³4w–;ºoo·Hu™øJãÖ•nÙUj2]£^{¾V‘ÅDxT :øk.—SpMÞâã'¤ã@™Š&x4gÊkÂ ï®ñ±Y˜É	OGóŸdA SA^ÆÑŒ*!%ÄÏêY“bë©æl½ÌƒÙr&'X‹U“æSÆ(}ÿù&—OŸ?~ë{!OUÒÌjœ_]uzŸjûªO…Ér2	Fÿ<¤^!ÖÐÚò³Ú DpeÄ?‰yâ«=á3ÙVŠÝ¤Ÿ¯†Óg-†…•#;Ùþ™tË<â°f¼!ý¸+—«j¡Š—?K´¢Á¢J¶U]e´¨ï8ëK-|’ýW…G÷¹…Çô¼ÑÇ¾~¨óKiWÅRêÕÅRbyOú×‹Ì5x‹Ïbï¥n‰ôÙ¢™”s€ñœš±,ãS'<ïFþÚà>4Gçê}‘›Eé´|[á–›Q†´ÅPv¦A‚E£tèSà»$èš%ª±‚óÖ)ˆ-¡ÁY+Å–è‹@yC	°jˆ‰bám$âD@™ð¢ñôI	8ú÷lRlø!šryŒXß--­
zêq½âä{”SK(Tæçj*_À*ÒÛ'äx}}8k&£á}hŽ¿Ü¾p@³ÒÃ4¦bo‹ Kò¸\·p`Â7~ë%'¬W 0Ù@…•ê×áû#õ1fL®ýÔ¦`:°a(•&™‚å§W9P¾ñfÒ`2uzè¥¨í§WmÈüã4~Ö¦ß77Èµž nœ÷‡¥Í›ãRsMQ!^+uÝ»±]y®WñœákQÒÅpYª1^µÎóú0UÁ{„_RÐ´“Ô›-ðï÷Ëù‡yt9Ïn~_¬?ÀÂ£ÎK¸ÁfÊ«¬c(o–«ÖìÒ¥*dG½€Ï®—C[†|~qœÈýäªég¿ÒÏ&ì(9pðï±?mqsö˜ªúÇ†*zTW£tÇí3µ|ã8`‘9¾@& y¨@«Åà*¿Gé6¡pFL8ˆf‹ÐOA®FAFÅÆß`Ë$ßþÖÿ…ú¡å»å¸C%C{ß±Fc>,ÎqŠ•vK¯+•¸År;A<Ê£ò´fY©·
²Å¾ó¹Ë»þ«C·"ÈpÅnß0Ëâ†¡¦¯®O±€Î]¶ºc­Vµ0ÁO‹ªª˜üO!<ÝÊ+» 'jGr\|Ýc©œN¼E‡[ÖË;˜å
òa¡…: êÃŒëbÀ½+Ë5öbfêÌòéÌÓªÒÚQAØ:Àžu™µÚ“VÁrÚb¢CáPÇôøŽrýÖÆ­ ”ñÁSÂr¿Ž¤˜ÕËåðž®Œ#=æË„ÛQ«"À³œ‘ðO¿3¼«ÔoÅ;¿Îga•µÃQOr9d(iöráú¡r1Jze9&Y¯ÿg6~.R§Ù:‡Á–pØTôlõï)@l+r½š2<Ð1ûîÅÐs„ÇÛ|ËdœšÃ]†h¨Ææwg¿ûð¹®¾™úNu*¹—6V-•*47ž>pgçÄ•ç—½DôS>Ç ;Îyç¼§¦ýÔÂÕ«1çåîØ/¯ï^ª±vxÐI†Í¦³Â ÃëVÂ(ÑÐNð5H=ÐPk>4í«Þ;Ö+I_çö5Ò¸£ˆâ¨”ˆeuîWšìG¯¦»ïnWÉ;êìvì³ê:/í{ûIBž{±ý´ãï¡§ñ
NóóÊa’Ù¾ñ a©QŽ¤SGB¤Üj»ÏÍãþDÄƒØ‡s\+ß¥[Áñ¸æz§ŽoÞWvG“ý>£edXË2B¬FŒgÊ_öAåìÉO9:ÍkèX®ÜjÕM¡™d7e^¡¾ëÎÀ=þC0÷"6×<û‚­®Ò%M¾GHë)áT»éÞ1÷:WÛ;;ßž‰òÍÃÎ·¦âÍ]^Tª—ÕÇU.?a•¼:GNÍ)è‘&oœ‚·~²ÓMÒ"Ô†LÆþ.&$*N«ÎÍÍûÂäÐÙà3#&Êar`>Üc@ªxƒ<ÓU›°P;//Ê‘FÅLî‹õ™²JuÍ2}J3MAXw9©|Úõ)¨_êŸ¿ke³ÓÎÏø8õÏBë«%ÂÉ†]aÁëèl«B¥d)Ø­ÓÁ™£!us2qÝ|_×öëÚÞumÂ°¸wXÏ«¹^ÖZÁ:kŒËÝq´ºÇ)ºy‘tÀ‡…~8
ú­qæ<¼{Ù#îç›“ÆÊ’\‡¢`åWÔËhá‚ôºµÛq ß®Ffž”‘Î©ÒQÇ’CEîZqKnÆÞuW‡ÒFK¬ú,p¨áÛæ×¡Žºsx¯×ÒÌ@²=aÓãîñäãªi•Z9Èí¬DrÊË¯ÒÒc÷ã¸Ž7£†òó ñ´UwÀNdRŸÓ¹Ýåb²bÎ''íÊ`­­¬¶§»¥É‰+Â„âÉ½‹QI'Gu®Áv¥V1‚=©^AVÇíL&_ÚÜ®àw·÷0(Úy‹eW÷-ëaˆ_¸³)È<J½pm–Ù/xÞkpÁW,}Ä‰Z¥k<ß0%åUráêý3°U¦‰»~¯w¦Àgf‰»¬„×ñÝÌ¨YtÕ­ËMè‚ÌFíä¢"ŽèÊêI—œ3Ìcp#ÍÜ­-èY‘TŸÁuW\Uìð"ËõZÓ¢wÏ{ãÞÎ¼è™áq‹žÏÝÚ—Ýeç?§)k’\£4ÜêøˆOÝjLÙs.YÌt½ŒË¹÷1¸ðÒ(nÂ`qyñ¸}5Ñ,6Ö¢{:)fD6TA‹Œ¢Eà¿©µâ(VW•m÷íÂ¿’Ü&j)>ì(ÛSëª¤õ…´¶ruùJ›Â—¥ ‡—rÝÞÜ(-®¥¨Õí§„~stè´ŠZ‰{?Ýsúõ›íd¹XDqZÆSkyÈb½ìÏ¯Wñá÷=œ‹i„žÔÙÍS`ä˜-Û:ÉoQFIÂú žv4Ùúšæukó6åËù5éBá©ÂŸÙo7›xpâ‡}gäË%¯¢ó ôÉó&|2ó|)›´Ð-¿“^R$!£¿:˜Ã~ku@L8¥±¨)(³ÛLnÐ<Æq´(žÝšÌ'[Ï°ÍhÜ×öüÎ›„o–1–‡W›)ç.«/Í¹…2Ý±ô&lF§¾_J¦,ÎœÖÊ™‡ØóYZµ*}XÏi¿¬,ŒRç­Ý¬ÕsÑjQÈô´E/•¤|«ï)Œ‡F²ªŸˆ%¢zµA„æB¼šÔ]¾X†Ú»¶j¥ÅŸ;T¤i¿«áÀZv#R„*’MLS¯1ÛÅdM öP“FØGšÒúGjÌ¹A0.…áÔ–äƒ1;åòþ8w‡B˜Lü‡sEi˜ššŽk×Ã¹D$9ÚBMZÙ¥ûRI ÒaË.¹ÓÑéÕ¿êZL…u,v§ÿ°?:ÛÞí„µÑ ÷ùÖ›YôVXïBššvÅ`…mÉ¿°N¥¤ößë*s<ŠªÕ•upŽ;Pûœ0£ü™[b¨Ã	ò#Lgè]“ÃÀ£‹¢Ioâ—V“#e©®rúKbŸünzìÿ1KœXì«°\Xj@…4 ù‚EÈ%qìSâHc†¶4¢ÇÓ~I€/$šC
Í[ê³Á?÷ÃPU»ŽAì|#Ÿ­ŽÚùö´_NÙ&˜Ìˆ*ÖÀˆÊ=3S?ïj}óÿíØãwôž°ìy\ùãæ  [•ì…¬ÚR¡WV_‰WÝ)\ãE•<|ë#|¶ÈJÅ“€Êö³»‹ŽŠOË5‰/˜ŸÞOøzØXxÂd>ÀåÂeÃá0K!æ‚u©ÎSUõ>ÐËnuå?$pÎ³‰«oT>µ’¿Lë)1%½.1£^ŽC¦Kç—îS1«§ó«1¡H®ÍB7e¦|€£a‰ƒ8kÕ[W!sräHJelK?!/Nü—aä¥ÍœÒµÇ#EòÌn¡E|°Ôà&~]£4Y˜íèžŒì˜N/¢ÉHJŒ,c÷¼sX'´çƒRºa6Ñq@d|¯7Þ5ÌÃz²›‘5÷Ê ›Ë`lÇoóÓ=S¶Øï—ÞØ~c6MöÛ˜£
‘/é*ð.G,	aFŒˆ8íytÙ4ãHÞ:Íñ[¶(½˜T"‰ÖAÍ‘B?«7H›VR`oSçí©fAã´¡oR˜L1‹+³ˆ~¹AY[8Ü3Õ‡ÆêYfE'4²Yý#9®£Íõ„4…>qlÐ÷#Þ˜¦„Ð9ØklcšoËßiÄ}Ë1 86%èB*diŽ‡NçyçaGsBTŸ
ÇÞG´e:t–&¶diOIGç}.¹
¯˜óÎOÀ…>„õñtP’ø®’B„ìr±ðãÖûRäÒ^!r‰uZÿè>eU\5ÐÁ§Í Šïå]µ¦­~¯„9(ü³°Î±!4MÌ$ÅAó¶H@W½û5P4Ãü¢mµBÐ©Z(·Üxö+¸52¬¤ˆ„H¼‚4‹âa¿ß78oLÎŠUAY¡“]
óXI(§0Gôà¬Òƒä±uW¨D‚+Ý–Äæàbÿùoÿ‡ŠÿùoÿÁI¼¶t4g:ÈÐNb»ÕId’ûÄÇYþË>”½&&»3;;ðoÈ8m‘±ñ0‡Ñ8¿8úƒºðšíöö$ˆ}NoÃñïæJeMdÍ6Çøßù‚YÀy2„þ4Þ zÕ¾4pãmVw¨œV…S	Ž{´ù¢Å\Ž©yùrðpøðLöÄþ˜êÒ`]šÃ7·;öžeG½
æËD‚ö2FXÛ}­FúÞttlê¾,¸6]ŒL÷™}åMì'>¨^âjXÂÈóIÿ*{aÁ¶¤X}fÎj»ìKæ0ß^øäæFdìÁÉ[\lnäQîê–îò¯‚´¢!½¾«¾‡^å•™$ò.2ï™½ŸÃ^/”íþ„á] àÀÿØò?Â…„ZdZÛvš<iî®öH£Õít¾m_Yšº+ÍŒˆ937o
¼í?p+C%ÛÊìlÐr»â%°%¸Š?~\¦¥¦¬sHÓ‰é´±Äâ‡ÔKŠ©Ä¬A]«á¢…›.[§ýK%>íKÎnfXìõú½GYðŸt˜÷z‡¸å%KbÑ![X#ä5R·…ò&7mÉ¯—
¤ntä‘ÜÍguÜK³×Ø”3uŽ\Ù¾^õFR6v¸©KkÌöJ‰Ý”}Àõ¬N.»è¸ýîîî™£ë—´fqÙ¬‘‡ÿj4ùkXz-@˜jMöAé¬$3ô÷Œ!ÒO¯SÂþ.SC¡Ý‹¤hüNNR/µjq…nN5ÇPcË†Â_\ Ñí()×úê5,íÛ~×·Ê.‹v¤¿ ù,ø26´Ò§ù}cïº|ŒŸq”æ‰Q7±ÉT5I'z‰Ä1Ðˆþ`êÅ)Ç»·œàÅ„èîÀA[î3î$Ó3´âu4úà§oý‰m²méæ¶?C j^òg~,ýŒ•EÐ>¥1âIo‘TŒv¤“-Q¾ô„4ÒÊ3&3Ò3”\-6!“¹½MÞùd]b°Ï5ÅÉ o‰ÕY ÂúX]d"äuÈl‹  %øâ‘Ä›øé5}“¨ä2),"V„ÊøžBl¶H¿c,7a‚å|òÅµ’J.krÊ-äQ«ApWñe<0B¶j_pb$—g¤Qƒ²Ó‹yl÷²pL‘ÜÏ||§T¶ú™å¸wW?Çç^³7nõz;[w¶:íþæ™|påPƒ8D÷FÜ’yº±qÆ¿Êdö§ÞØ_btÔ×¬~•ÉìkuŠHD¯£D* t "ÜÑ´Î(†Ãäå”’ÌE™qÍö÷ˆŽzc<×‡ÙÌÈÈÏ=€ÿ”þœ^o1L’ô:Ê)®(¬Üïý PPæÑ…[=¼ôí³ýÝ¾7èm€ö·Gn´Tª×slÔ¬•õ¢Súêñv.DË:¤ðˆ¯J
‹&t4£u¤Œß¸*Tx‘¯ºÐoDv>^þfU¡*Å²¸ÔÏ¢=tÕ‚t
PLOkXœ×®9í?¢Ó‚¼Ï?äªÕP0îUQº,êéNJÐ	Ðº“ò£¥^íÚ3¤‘ŒtyU™ydÓŠLñuåÅÉFÞÜ²eÚ°.ÎÍ{á»fjþÀ,‰É¨Êe™D
P¶}€h‰4 f|—•a RÈñÍd²Q–Ê4‘SgYK´Ç”É)3ôÐ»Ñóhü¤OB+?t£$ÚÐ©eŒsKB×‘ñ÷ØÖÙ`5R„5†¤>‰`´',è—D Ùî‰<yû.Ä‘å÷GÀMA¹ü/‰8¤AÝyg=¸ˆ<žß(‰è?w_|WßÍk ^,1Ô&£6= ’ŽIÆïzÝóîäÌœóÄ {@ûM•ö#½Z„¿F®…l,ÚŽËçVþÉŽEå–[æš¥jbY®*t…»H}¶¼ÓŠ|ÏÇ¼Ï°U„P¨³ƒ+Ï8¤’šâ¸› ]ã©–è«¢ì‰©bMk­Z¡Vb{¨&1IPÂf^VÞ- æç*LV,NØÈÙQ'÷‹P“…à²:6¬ÓFÞ%œ“‰!è:ó‚Ìf0ÍÇ~Še`òÖG~­Íp4ö-ºÚ±G©h9#ž1·ÇG‘jœ8ÓÈœ°ìêãÕ  bŒ¯f“J:°ÂQý=¢ñãmÚ€cg†=0mhØÂÙÉ/Há”.ËY{Aûw2rÅbyn°	,Ý!Æ¤…ÊOO=øé]=i;·&xVDÕkº5VÊ X.°ìáQ¡ñ&m{‹4XãøYÈ­pëNW1$ãnÂn$±4x—cˆ>sŠ]z£µÄÆè2ƒÕ…w(úe·3I/¹ÝÇÈ¡9;É¡†h6’ÊM"oHéGåªœwQÄwjzwß…×J+a{†m*O8R?ÿTmÚ¤#QòOÝ­ÀF½êNàiÅ1Ü!%Ó·Z]GÝÎØe€¤]hqWÞnœöz%Ñ¹!|:7e_}Èm…\'FW4®âÛvà)ËÑþjÿàp=gûÍicâ%)ÒPý\Ì½°Á¢>ø×æ gµ¯±¨eÿ»]Y^ ÷,2Õ¥2ò´âÓ'<Úé[® Fz‡4ûØ2m3k¢$tv
oqV‹K8s&ÚÁRÄÝØR)Ÿ–ŸÌ¥â\E»Ñe«K…÷®Â,8Ì¬/;ð
9Žƒçƒƒ!t)Ç8¯‚+Gt‡œ®I>f1¯Ûq•óÈÚIéóÒÑ ë7Rp„,¬2¦Ü×Áóò«Nùê”¸,¿RyÍ5ë”ØöWR¾ëŸp‡RÝ’:ú½]*E|i[µ+¶êšvªüª÷³]¥àOŠ^p4/m|Ý½_-B_ˆEˆmŒû´ññÕ"d´IkðÏcŠ>bÜÞþG?öŸ;Èè+ù›¬þ–Eƒ_QxW—îì—p ;øÒd!Î÷œmfhóu‹jo_…}ù®;íhÓ¦ëi6BnMÕÄPÜrF£|×¿Ú'˜å¾/ÝrÙÉÍiãøÕ>’Êöãÿ29îG9`-d{úa)yX©ž¡VŽñpßØüÄ®EÉè§§Õ“ò´ò€‚–K•… ¾nÌ‚M=¦óà/¬F§df'²Àš×íTŒÈ¡ÆÌÓd©·×Ñ?ÎN‚ùBuÖ¸N9‹!kr}bNÅ=’Îö!/=¤ÀJ1‰Ò)ÐIt]Q…Å")=Â¾…Öž{˜·{¿¢ÒÝ8ë½ûÂ>«¼´6‰©¸„õMŸuü-õÜ-e‰iX× j™Œ¯îÚ´³¸TìéîòÒ!19ya‰ãŸuoúóü¥lï$Ã˜¾Ìí-M“Ô_<itÚº"ÚO}ÎçàsìsÖÕ×}îvÏÊ6›ã4M=Œñÿ*„¬Æ¨þ¼Z Îšø”´~_¶RÛkãLº·^;S’:ù*w”oû'ÝÎ‡|;“æ1AÜüö5‹†|óØÝ½µïnåÝïyË}}Ýén÷THßœŠðpC'|ƒe›ŸFT(!˜ÂåØOš:ifsé„%0S858šæ(4ÜÎ3ö%âxÆñò9—qZM-cÉti`_ûãHHcÌ§cy_“(~|o›RùðÒ(šáZ$Q4oWW5v!	û£ÆËeä[†)Y1A´08..Âœ]è)®ØšÓXñxUmVÙÒÍ¹ŒRË	Qf¤¤GÒ” Y43<¹½dä…~ë´Ó~´{¦5‹ëfçìYÛŸ{ç!P"3Š#<ð°ÓÙîò'à‚Õ˜qW¯“ÛÉËIž¶ï
ú]å‡A‚¿ç „{Ao À®X6hÃ6¬J[¹ec™.i¿ß$RÈ¼¤Ì*µñ²ù\QT®Jø~Þ”!…uhÉEï›7zý8¢™¡x£hPW&^¸ËYÃ% ˆ$•öÐQ\ùìX™§9ñq‰X¬¶Å7‰ú…šÿlHkÎ¹åºŽâ@ÛíÈ››kÉ„¶7…ñáauƒè®øŽ•‹à¨‘–=Qµ#¬'MiVÀ\Ê©ŠX
‘X8Í!¼Î}>lôV[~ëµ|K©—Zs‹ÝHæpg£8ØVW_(O¨HI¡Ø&(ðÈ‚§­¦Ï7©UL4ë¤rŽ¦2W*E›rùË.|úµö]L´ÜxŠÄXí§´Å6–Ò6hÁVç~™©¢Á¿ÊŸ§¸±ÚÁø¶sTÈÈ%Â’`0ÛBç†îv
2C¥Ø\G=Îã0Å»âÎpT€ÝàG\‚04Ž0µEçÃD`^'ž-‚p"3QááW
ã]aIâkªFšˆ^Y„¼uwÎç´D¾¡ØQþÄ[†©ÈmŠXAÃ$cÍeeW´…%45GOŸÄ^2U
B¸¿xe@BµŽ\u‡9èayÏ n›Áî‚öhÉ›¸(B•”U!;¦À«øõþG/Ua;±íù
ÐYù“QÄ„fÐDjý¸þu¥êÈJÌÌáÝ±^i·Ûø¬­
!?žÿâÒ6ðó¤‰On¶A]á¦"éÙ®«"´8>Fó7Iök¦¹<!ßÒ6[}7Bb?]ÆsÚ²ù6[Xµê‘œìºJûM#/IÛÉr4ò“¤ÙØET
¹¡áþØ\üÍ¨7;JÐ‚ÛP¿£¥Y!.kû41…
s/fØúfæe¶Ÿ¬R	K[w€^ "(Hò,ð0!æî	óˆËúÓ(%£8X00ÞÆq0[Àn-†ëfÍ¿pjþÅÕäÓ9¢¯ÐÇ;§>Þùt!Ç«tàöï”ñ7r<‹¢tŠÔïëïÁÅß½‹¬7a€,öÅ
’¦82	B PèÇ¥ýãÔ›½xL²è‹Ê¾þaVKˆêäÌ÷’eìÏPésèì/ïößdÍ¿!=Ñ´½œù$[>S¬"³K?>ÿKåü8'Ï½µWÂúsiøeP°ñ¯*Ûß‡Mè!ôyÁ)€>LØÓ.‹ô9,rÖVc€›zÉa”îQ0üb×/£0Œ.	ç¥“eˆŒnqéõh4fÑ‡%p«h9Îz¥• pÆ(«9IJ'‹R$‰+1ìþ5ëã¹Ó²½ÒTòõ?bŸÖ‚‡iqžÆWŽe9Ëºù»WÚ¤oá„"Ñ„Õ»&£)óp9´M}J~ìš¼ÄÕpðÁAÞ(¦ŸÑ9)6LQÞÆ¸ûÐô0÷kLÈþ¥ŸÀœ“Q†Ô¦Y\~é=¼‹vÌø\ÖÝòÌdß/ošê120´5:¿ÑK8–Sw$vÀ†¥q4Æódrì7ŒF@Fßûl§ []LöÇ/ö@UFäxÿmÖ!ó—öG-¨‘ø­,Ént[p”UÇ¯ö·Èüœ}ä£‡s:½wÑ©4P&ey<Xléc{û0øØvé¡ìããôí]Snf<[þÀ³„…C_
]Ãù%¶òÈŸÀùÞ,Ù ùc.}œä‹ÿvú±‰g`±’·®EñKóÖ} QÍjðå»ØP„‡—daš_YŠÆrqÒ(¢Só´Ãì1æûŠ@ËeûË€U•Wkc¦¦‚#ªà7k¬½.Sa¤*U†Zÿ•x“’ÏŠ=tÚiwúgÔeu<9šcñÄ0 sT‘˜‡~c´ XÌ¦ìc’L¡ëÚÒsÊóØ9R^e´Ç«uÈ•“é¡\4Á}iìÐÙ”„Z: íêW)Ua°>QáÅ§[„ÉgN†´’Y%Ërn!úr—04høå’f6Méÿ¹ñœÕc¶A†0]ÎUfU*ãlf±*{—›a£WRÝº¬¶Å¹‚+Ög,èâd‚ô|„ràÝè‘Z2Ñj`&G—È¬œÍV¾±ƒYÜ!â§¸²­$>B‡ÏÒVèzà=¡±lméˆº­$—È©.Œ¸{ÂcÎÃ}ÇPBüvÛóM-¼ª37ŠFcL2f_] º’dºÏ0§KE'pÚy”Å#V™`…©”7sjÚÕ8e3×_òÁŠUæ8®Àø,°üÞi«ÓÐg/5‰âY^”±Þó[kð|&D|ÿ«Ö±é›.=š*8²›KÃ•ÌKhê%9©”5«Â—œ¶ªûéÚfëÃîº3«É5Ckçî¬‡â¸…&ª	ÅÊr-õž,ÃeŒ}X’\2G”ä\IC°ú+y6(ÖýÐžë:o™0‰xùr¢©lÆæL>ä'0ÀŽM%,–þ`LÙèÖ[\ûÜ ¶jsÚÚ'hýþ÷Q|‚ðB›Kœf·æ­~/Ç[æËä ˆG¡_Ù$¬#¨ÃrƒÉ¿)5·,þºGu*›Fk"µåm¿•¾â¶ƒ,½¸z˜“à<Ê›y	Í½Ñ(ÈÇèÏ—ŽM™·ÄlúoéWÜ€ÇÑåO‹·4tÓªòc%=»ºo©ÅŒþ ­`´‰«lgêöæ‡0Ëþ·C“·^Ác­Eüìª~Å÷Øû0þÊÃ]ß[š±°w#ÒúÞEJKk¨FãÈ…fy=ctNÁXÂ,(Jìî£¡¨=™ÌLg³%2Š-M•)€›ví:sY#«ÐÛ‘­õ5R'_?¶ËQÈb¿µu2K}¸EUßx³åÀ5E3«‡9(„ :åi×åìG¼õ”Ö\¹'p›¹
›cÜ¼ßŒÛ´ªøBÊÿÀ3[ª3¾¹R<°ˆ’3‡]ÖùýLÑ¾ö‚@t^Hs-3z»i~!—(cË8Ë†JQW°©y>VXáüo
·ÆRÙ,
–‹|I,U›jTâ²-Ÿ=,ƒÎí]â•W	½#%ÑÃ­ýÖÃ?=åÇõJQø”±íÝÎgŒ)]¨ÜŽlcU¬ùQj|slGX ®%o8=Ö>Rz°M”¢c
JuKnòé:…ËºØÝL5x®Þƒ?Eä)R_5J”S•¾<lµªõUkêYífÔÐ×`º©X€µÇ:Ý‹
ûšTòªä*¹.Ys çjÞ[h*&óÀç ©¥Óhl	=ýÜÑxr ÜÛàüœFgƒÉ$-Ãô=ÙþE0Ÿû±6J`Ä8Sã_:GÝÉÄÅýGLL™“ƒ8J’b_G¸
8{ uçöÔ‹¥žã«ðÖ?G>ZìN$¶–B²Î&ô9†¡C8&ãštz±<ZEšÆƒG»q)¢•æ±ôbyÐJÖ•7ú¾çTÇBæŽÁ‡Ò‹•¨C
óÉº=oÒ«ˆ!à¥ƒ¯×H [k4A¯wÑn<%”™J\ÊðK»Ì«Q²¯sý\J ©[0õæãÐ§)§YXµ2Ž5D`Zq·‡Ð=5©Ø(ò?3Ÿ’	XÓq3ïŠ„ÙâˆïúR†°š§Š˜-­ˆYí~}œ©NÄN½ ·¹gS·ÃÞ9Oêtu7tdp¡–ó—!f"î^~M€›¯Bq¿‘Ó6< ]'@ÀejTOY À¬[%cP~§K„@yVÈ¡ÓÁZ¢/Ðóï ÅcÒd:Õõ˜¹Ù¥n‘¿m~®¹âá”FÜ™›Þã»@6ÀÖÕ¯(N3Þãáà[rÌÑCŽ×¡¢ÕÜ,®¼ÇD½ÕáVåSEÏ.ª
¢2„¯˜iN9hDÒeîØ¢Ç
øåEûO™¥ÏAkÖ«P…!óâïÌ‘ÃÕÊÝ¢ãƒÑî+jkUŸ¯ƒæ#².dðÖeiËŒ¹Sl–ì“!)Zç1™ÄÑL•à{B=-fOŠL 6CòthÏ\Öá0¸º5zTÕ‰ä$X ‹Ö3d³äxB<ôiƒ-Œü¹òÇ²žkçÚÑì<˜ãXfÀZLê’RïBP)†ˆ³PvÐ¡FÀü3+ ^ìÍÓðnÅ>¾ìu´ŒzÈ‡WOÂj	oÝ^Á¦m$NcàÎ”¡RqéžÇÛ³9U[ù>aÈž¼½?fÀ’h23èmÙ. x,þŸy%UHélpiDùšOÈ£:3ÉŽêŸÕ´B—1š†ù§Chs2ñÆôç§v üÃ<S–Ûv·´hÊº#°ù÷@#°Tóâ§X½ÔÁþ‹{¼¨F	!ÜnüxÚ+³„Z^äÇgã©Ø!|va—ô
­é“z¤y¸ç¸Èã´iéE)2LgW,Òaf7ìJì\g',*®ÝÌ25ûâqi¸`lË4ä]böSÖ
û<
Ã%=‹áMK¸÷eÓ9¦fÞâ³1ñ’…?J[ïQ<´]RŠFW¹³žÁŸ‡K_`H}¼Öb‹ÊP¥TŽ¯÷:T*¯ÙtMƒñXãV,¾j©nàe67böé…¿|¼øîjþ×sàŒ;ƒ­7ß¿îýýúyß{÷¶ãv‚W¿ìGœ†Þ»q4?MÏÿ8üôæøOÑøû·—?»Çýqÿ‡ùèÓ³G×¿Þ½~u¸ùCÛ:úîÍ_/F³×ÉßŸÿâcÇGëxtôËhëˆýüãßç¼|t4ÿÓüo³Ñ«_~êþpxÔ}}|yýúä§äÕÁàòõñ‡à‡Oƒ]Úî§Á“Í3r:ó’-ú*{<éÅÙò4Óèçó¨v¶E§xKZ‚M]œ¹1-áŠz…C‡.\&9`U”_)G«^|=™	áñfü·…‰õ0º,«Ü	Ñà»¾¯ß3deTR¥Í’mŒú/™=ÚïÇÖiççÎÏ˜Ž/Î½æðÑV·ßÙêv¶:í>=Uºì‡°§Xg(ÃI,Îí\šDP¼ËôHà"†SjÅùÉŸu$ƒŸÊBkcE2Ð|©ûª0ëå¬ØÔ­*³H9e¢ Tjæ¢pJ“ 2÷/YtU:õ@#<ÉeNy¦­“6ù[´ÜÀû>¹œ‚p²&È5@h£)‹Ä_h™=y‰¹{3àÚEÑR#P>ŽDàlN@²MR¸¾ÐÇP>-x˜>€Eo`òBnÈ£nÛâcZÛòàG,ÍñÙ034Z&Ä¿Zü`Oƒ™Ÿì‘îéo‘(&C4¦Áéëò¢}ÑÞ"ÔºF|÷SA¥Ë
oKcä5û\p±X3Z!^#÷?ÞƒÏ½½Ï¾záÏ}4pŒi!4§SŸ¼<9aš\ø¦GÀØÒ69šÀ”2°bØeóž^bZçhE	âQ²RElQp²‚n¡”mÑ/yúŸm€Ó°€GŸL|ä‘%N ˜)>Ëmr‰Aˆ7Ã… 3‹hV	ùénÜmr[bØ_úÍ]æùñvV°}­rð2Šðk‘ÆIúxÚ Ï™nd×,`¾Û#³ñrA¢ ²‹³QÖN‹¦œ*ïþt´¢¾A‡9™ŒÇ¨QK1µ“‰ïáW
P.Èä`Áh‹é/PÜ<°„¦HLHLlê‡[½^w«RSDa«ZÈ–ª®6¨ü™Í·¢Š‹FÂÀ9uÌ@ìW†`=Þý	ì®]jë‚?™ÈOzã=xùþn‡_™¶NwzôO­Ó!N¶ªf*$– šî‰¦Åwü›|zû(‘>ÊÄÒÎý×Þ‰´ ´iu?«£ÙÄÍV‚žGãëÕ´pyŠûDƒR^æ`7À¦âØ8&/.wGo#/o÷®Š|î´nŠ»ylDžÚÀåù]Âß.0l
»j2i›8ýPÄ„
øsÙ¦Úxú:âûÁØjƒ.jÂŽG½‰Q¯\ Ý^žaõ ¯ÍYƒŒñ4Ôá=o¢õàÚ¸…üŒÃPAq}ƒ|‡½Ü»n‰r†}ñ¦‡ªxGSðÖØO½ 4 ®é½»NÐÏâ¸(…FØÃ5¨»I¼g #ì¯ñWãnÈÍù dR·aW>?ÜC"²ØQÅmÆ“ng¨M4µc—”à‡0¼‡¥ÜvºIYîY*8]˜è™j4ñ»Êlœz—*.Ýžãò2êÛàáßxºbÝš5µìtO©ë>tÜ1uÌÝì•-Ûo¨¸j¡ á¶ka%höj0ùÕ‹±²že` g©É’‚kºâºÔø×äˆöÎ,	óè2öÄ°áä+r›•§ï§xˆ/Q¦_n¶ÓèD©òñ¡ã-oÍÓ³-rCf0”éœS`Õ[dì]Ã_sÐõ@ß ·ø¶•“ã k,U¢wLžvÛƒ38¢Ç²¼œ•8‰bš0D8{¿¡çQ>þ™¡‰cÔY+4Ø3kH™Ü%H…Ú4}ó^€:wŠ|R)h!‹¬“k–?¨N£ÏöFê¥Ë„e`G¾Ácî| /T+uˆï¤êÔòm¬TÇJ=/˜ÉTt.ûwûpÉXMû¬ìrC*²XÑ”VËúŠ÷¿ól—ëzÍËqfÃ³ÞâPm_¸‹õÀ˜R¶%È9°¸Ø‹Ð˜eF¨«Òu:¤J§"ñIöƒÃƒçƒR¢ SW|™¡âNA¤Í1Dt%vr•Ã–˜Þ+™v¶¢'¦;Ü<«<MhIß„ËÄkÔ×z'ŽOößž×/Þ‘ƒï÷O
‹SßXA?œˆô¡yÜ§ábÐ“»U†‹IgÒ›UÃÅnÉp±»²áÂÅBÑï--r<B_H)yå¥£)L}_²D1þ£ÁnCl<‹¯×(2Š×`ó+*¬zUtLÒÊàÂ1wNkDÆdC‡¨Œ=?¦ð	? yˆˆŒžCÈ>—K;©“Éø!’Ñ%RÛÿ§œñµuÆ™ÆŽ­é˜1¡–»t&0kxFµÎ¢jt.
½¤ÌSeŠrÈÏëïöìªÐ]úpéBa5ïl!®«"l½"TJÑŠØÉ£VuR·¨ñ&%ÍKbú:£dEÞŒÏr¥em¼£jOsS«¢løóÖOÇnz
ñÒ»t{Ì4ÝNAúÙâ~Høª×AªU‘Êñe¦5,qH´"ÌÜ7Ïelz¥ô,ê@‰ÉØGH°Õ}ôpëÑ ŽlTkö¾mït\ÐOŸÃa‚¾|ó¬•Z÷Ûq@}l5ƒËÖ.ÌânMþª‚–Ž
³¤f›ò0n´J_}/‚(„µ“Çwä˜u#x]’Q…á¹W2Ü£Üð*¢M=›£‡¼ªîŒwìr.YPW5ÆrL˜ÂãÁlû~X
´yN×8Dv1ÞŸ&;"}÷_úEdœL yâaQwàéîðÛ3I\)†÷x4¯ÊÚ£³k”*H—¼Í'Soþ†¸àL±Hhß#F ÙÛ4x€ËXdoRP§]'´_¨§ÌØ:™:ä³öÿþÿãßÿßüûÿ¼Ç	ú-Ðœ&D`ñÿ  ÿÿì}[oãH–æ{ÿŠ(UUÛî¶d‘ºXv¥³àtÚUž¶Ëž´³ª»#“’(‹S’¨!©´]ny™§}[`XôÌÎ.,v_vgyè?Ò3¿`Âž$#Èˆ %_òRvVeÊŒË‰çú;Í·Þðpâ×dáþ@¼KåeÕò.&däL.fhsc‘Yû¤ïc 
/ú8º&89Ö‚èë¢þÖ¶{Ó‹Œ¡›q¸ºÙO‘°9«Qü,ÄïN.àÒîdü¾‹yiîÕä	Œþg¶Åhç#¨–ótŽ%­#?ˆ‡p4e¾Îo°„&HLr)Z²™ñ šé™@]‹ùæ¬ÂçvÿåOÿû/ú—¿üéŸþòÿî/úÇ¿üÃWI|íïØ¼í¤ÀÙÅìÏÿ•VùÞÿóÿðGøùÔû×ÿó/0ïß{ÿúÏÑ²àÎÐ	,›,ôz×ŸÿoðãŸÿ³[áùè¸Žú4t3t	uÌbƒìÌ¤ú1‡ÝfœS±¹’EeÐÕ9\ORÄfÒ„O§eãO2¦%3Î›nƒèÇ¯/ÉYÕ$QÁè³åƒ3_Òµ‡©‡=gÑfEÖ¼4•Á€l¸»ºÈjN¯§.3+ssÂRÎcÍ‹™éÜöÌE-r÷üÛ[É\Ow|Ãßý5Y’Žš)œÄúü]E*¦ÐháÙŸ7êSE QÖññ±žãK·Ò¹–9Ç¶ï…¸´è2N\eN³\HláÖäƒ¡w9Qäô†Xö"DÊ\*H§Z†
èm6Q±À×N¶SŒŒáÍ…‡‘¯g¿µI@íºA!í›7¾`ôˆÞ’0èÁÇ(5ymUÒ·U2êdõÉ&ñ©ë³ÚCî!zýU‘Q%RLf/…þÉÜ6H@‘s.íÉ­˜I©m®(u^ãëÝ(›˜Ž0÷ig@?¦]ÀÈõÎæâ—Óœ·Ô‚ä¥ðææÆŽØ²¡1vtð¾jÐ“l¼PÎÎB—$±­›1çÿ»“þ+ww>dN/„nâ™z‡/¤¨|=@Cò–)Ä¦ Š%$)$ö. ¾ˆ®gìw”úÀš¯7«õZ#4Y“ôÕVëQÞm|Å\$.´Ú5ºMù4œy{ÞÈÉqà¾ó`[g"I™ßKo5žb
*MªD7Ñv¯ç¢‰éJ½¦ì=Ï"Ré$SùÉ“Ls‰sˆ!1kÑ3tø.~ÒMÙ”eŽ¹,.ìBéÄSËäšcÎ~÷.Ÿæ'ˆ	¦7à‡ßpùM*ÇÂ¿ßÐÓ¤ª”ÒlÕŸ4›Q%ÖQZ¿¬¢ `*û,Z?.†JSPo?ÿ¥cD§!¨wMQ*¾\á:GÐÌª^iAGÍ™Pžy“é,Êõá3Ñ±<róSC,¶Ipí÷±<´r7åÐò‘[7¬ë4yæõKÇçŸpz=w
$Ïr†µZ›öùˆéù,EY¾%KâZå7CÚù1Õ¸-çëZo\VPn™<yz­]¯+”P¶ÎÏ¾ =¶ÃÈK¿7C9ÓkR“Fæ)U|ƒƒ²ÛÈ›ÎãÝÕÑ²Æ37•A‘R–ÊâðÎÍÜ˜„^¹ÓÑµŠ!¤ÔÃ+¤$œ‡>²ìÖ@Š¹p£mNÉSüÉoÜktF$m¸5ZTUä]ÜKx´ ò|*ªáªu&d
±;D8È`«BUm‡p¹­¢f>ºF+K‰^Ìé5†ÄQ3Ks™K%†„mÊ´'Fæ»–_r…±­pÏäf-?g}/¤€¶n>»ûv\büPû4“Ã´ÝnÞâižCÖ[V¼é0½	Œç‰Aƒ‚ÌÊ"Ò­z¾ YsNAþ'´Vçw^aû
ð5'ðJ;	ö1×jh&aÚs‚Þœ~ tw4(ÈE>vG›UDž¥p3*ó&¼"þ]„MR¯m¬Æø´ðÛ*¿íz.õ‚¿_xÐ³ècù§tYtqd”2_ë¬aË!N- ÞlŒSGã”	«R¦jIü=K^J%Ír­mÑ¦r‘õ¸5šŒ•púL¯2Dg0 ÒâèÊÔXpüw "Ä%µE+#Øë‰Rô·«Ð¢[4âîø;O¦”Ö«¯ŠÄä™œa~¡ð(y¨wwß³¡àyø¨…]5 Z^xíÕx6rº®jÀêÚ)èÀNžÃY½f»ãs2!ž°
,ˆ¾?ùÛ™\?[£/œÃxb;v·Q?Wîs’M>Ä‚‚Uô¬y“MEÄy3[! æDÝXo=Ð
eü‡	þ8]J™†ÿHŸ#ƒyT/ÊñgËsüG’Â\ŠÈðÒú0ÈÂ°áœ°í•r™ˆ›¤	/+!{µ3²—®º”O³íåCß,/i°2H\ üÈ·
N„cØnÝ4ä*í­ œüèwJ¬š,¸Sv¯àWÇ¨÷æbÆb›zXðåZíƒØ0Ò‡}âá7Á'žäNx=éc’±7 ËŸI¬PÐ;>“Vž±¢/ÇJ´¹AàË•ã… ˜îÀsGýP“‡Œ?Ì»«ùZçÜ§îdÖM¬ CœK˜)s·p‘(Î"¹*»®uÂÙ‰7Œ[/*i›;D*†™Éí#ýÍÊyRgyçÜ’P”2Î·K¿·–œrCÁèsù6íEómFÉˆ6Ój é5ž‡>ñ#lÓ¿tâ´rva‚Æ@]‘O¥ì¹¥KéŠ¯T£!¯ýŠ}¿ûê`ûwäøÕÑáÑéþÑw'äûýÝ_D6gøì%á\)8’F-§ÏÔ»õ^Ý•‚r!­Ýjèd“Ú]ñJ©[amP7,Â)%!Òì5AÛ{]ê¶Rë‡ÑÚV=‹áQÚêª|VÔ”›TAæ°‹T à‹¨Ø´šKœQèJ:CªBY–wñcÍ2*²P}ïƒ”9Ü «vÂâÑ?fª!Q£¿êñV Üú+ñøÎ,»N­*—BX˜VE5Yg­6O7c¿vrèÓÙâx³"n8ÉÞ Ììq²ÛÕÆ†BCðÏ¸[ñ’ª@Z¨DôÝ«Þh¢k°ëOf¡rœ²K'è‡4Ü…µ†«çÇ³	°d¥i"wá&å]/È)£Œª—ÇÈÕ5“†ä(Š«—³tÀ„)ü…ßxÉNDüLå"­kŸæˆE|—hÏ’ƒ›ÔÇ¦0<é!ÁÎ;P‘ð4ÕÆx™¨Œí¡PpâÁõ*†é.E×›$p@î;.æ0·±.¥á"foèÂÎ¡áù#‡‚ S ÈAÛjÜ4¹ÎXâ«+Ü­ÉµÖ(¨ómáþË~.„_”}w(hˆNÎnêØ§×VÙ‚í—©æÄÂ$éýÕìÖê¬],ÞÏ†OVL†ä¬‰85,£úM+gWFZÀs²aÅ"“LiÃFn{í¢DãàfÎÄŠßÒÅì+W/	}"–Y]5N6'¶Õ°Ú¹D±p5êF¹Zøõu0*,‹A#+Œwxa|Mai#UF=sÜ‰±åÒ™Glü¤Dß†\BY¨Žd²ÚÑ)áƒ¤næ¢!¡£ŽŸ­ÊÈùéº J²¸Ô‡&}XòÐ–½ˆw\,GN´3â¹aÀi+Œ-„‡1bÐhñÔQþnúÂ…úRÁ¸ŸÝO…™ý~Xó& j€Z¶³©•‚È`eÏâd;kvÆëž+@zã¡ª,N±ïp:¡,ö{Y¦¶LA¹'sÿS–'êÖ tEœ; š¨†”«bÀx&‚Šb¯6òY¢æåèóò4ý¶ò\â. I7ŒÐH;Íž­)šž–S ~x)â)U;æ½„=Ñ<š7dÜ£fT¤r•Ëa¦?Bîo²›ÙÖÛ¹âŸ±ü˜<´¾‚)K÷~ÁÓõêÔ†*!&MNØ±åíe2]…ã¬à¡/ŒÆ7ÞÕHeÐ2U6.8¾ÇèTæÉQTÑøAÊMånV' i/¨ñr³æ‚„pøD#XÐ‘“zÍÕ»rfiWuäè£@ˆ’¨ÈSüHÃ=T7ºW^TÜœÉ°×â%ŠXL;k+…‰å<2ïTù-L3“™1LF“Ÿ¨4BF7â„•~ƒNß¹Œ£sé?‰ö£Ö
Ê…Õ$êªÅ blÔßsF×âàí
BÆ®@îÎ1lŠ× ã¨Åb_é-XO2¡‹EŽhp‚€ÈmÕiç¨DÌf)£Q©éªu!n‹é¦@Õôçf9Ç³RMPóh…+÷§}.ôþûÑJËiŽù^|¬Z¤€@|• #¶›QŸX!4´¸Ž8_BPŠk^BúW˜×í"{z:ðfïlK&õ"Á[GBFiKü§™ƒ ‘èßÔ(OÍ¦ÔÜ¯=˜IA3Œw°(7kiE£€Læ˜“4}¨”êrG]ò£kËUD¡WáØ£õì-¹ÜWÖpfÀHi¢o\ï´6÷½ˆYo'*ŸM#ýk…;~‘ì=•³¼è»LzŸ¶ì'dü¡1Ow¼K^nˆNu¬
º3tÌXuUuAz„ gÇUV?(«”ÒÔÕZäñiêµä‹qSU>‘)-
Ñ™‰µÂ2©Í:õòz UæÙQMe·´3)LäÕ&©àÉøe%?va¯”“O ©‘twâo
7ÓhôÊjbîFMÃ^%è›‚oñŸ£Y¤hÌ8¡ø´žB ®³ÀÕÀPPë±BÂ‹¸´cøS«¥Žß°m»ao$Ø½Býd^Ä9Ö]QeÕšÌ‚QÁVP.vÖ©?U‡~Ð%Í|QÃ;E§7’œ?  "µRlÈ›édŸ·ÀáAbP^tQ’È¿Sí‘×æ­Þe—’|VßÙçNç¼Ê*¡éªã jåÏ¥ô·Úrçš‰w‰¾×ƒèµ0iº…Tª}7˜¸nzñ¤rø%æSÅU4–‰1&3k©~qƒÿp×ª¾"LYó*%ƒ¦’0hlE4¾‡·Ì»aºYKd†gÅÂŸEË	¥JÝc¯»U×4Rhˆ¹y+šiéb§˜Ýiq^¯@Ám±Å|DcÆ	Çr(0sIsËŒ±?!+³ÂçÞ 3}M*™£RQÚ>±,ÑÃöMþ±”èâè`sÌcc“3€¡orY¿z¶´tÎ/%çû5>ÎÙoq_ètË—’3…]–—Æ$‘n5ß³ûÈ¬[	ª.8ûìs·‰$,wþœúº]F×# )åêÀÜð.ì 7Ü$KŸ·Z­¥Uj$½ #K¾htNÓ^"·0Ž%—/Òát›@¹…Öh×±~mlÂ’ˆ´ã²Ü*¸²çJtÎ7jcD‰“?=°Tå9ã‡4·ÂˆecÒ²ÀCÂ^çÒ¯<°OµS!…l¦¿·a»9JtX²B± GCÄ÷c[#6CM¨kž[þÄÍkÕ<,SÄY]!­|¶”A]àËàZbY\,W‹†nuý+	„ã"°¸.ŒOGì¯g~är×Ö­2Õä$sWšmÂZ1°‚ª.«M#7¬¶DRº%#;Zî¾ÈƒÂÅeø¼T¼‚gIojnÃŸ½ól‹H…É½íöÎzë¼L‹ë¸R¿@Ãåe±whl—ò&Ä¤«E
½5¥(P@±•œÚ#_à:j6¦*-@½¦‹ã'¬dEhfL¦Ä°l× xè·ýúÃÜ'´kÒaúîŒˆ|6‰¼™Àíl«,´E”ƒSbÏ«Óc4¶¶ôä“2e¶ON~8zõRmÓ;†¼JP™ôŠòc0cä®ˆ™8h5(ÂüÙÍ†ÊRÇŽ½›¸¥ÑC0îKVf2ÃàA³ÑèF¸½X=’FªiW…c%q2r¹¿ÊsÆH¼
ªH+Š­¶ŽHë©5Ž”<b=Ì<ª åß
BwŽ_j
Í(º4è¼`¦±(N‹n`I° ÿæ/,‰n«Q·âôû)^¥™ñ„âø–0†¨*¡÷-\¾©ÕjI3«qŽÂ&‘3ŒÕõ5ØFö¶ý¢aåw[£ç"X]‹Ù}?½Y¸)Ø¥\ºjj¤„çûãRþ—PAx*û ”ƒx'J5µÚ4Å@OÔò>¨eÇŸ¼`LjzìÅwç5¬'ê)WbR#_¤9>TBÃDþÀ+’ Š (ºAî´¡™í7É\á+¬Ëø¿Ìã@E<Ø}¹ŸˆAºX?q»%O’¾O&~’cÔ>P_ã¤Íg¤]n"ùÃd’'éº˜ì‡s‘65§;=<šXû®5}¢$Ã	åu{ICø½æŽo´bD«`¨½ÀÑ]Ód‹ìâSÛ³hxøï°Úo-ýz9×ü*É­fÜï"ph[ÃÒp?xÑpGÙúªÐ)cƒ¬ u¼$rÒ*C+ÊfÖÖÈo\wJNþú€@SN7‰ŠlX5-hW$Aù zS9Bøô“È’Øï>h&ËK]ïsõ†Þ³¤uX±Á\ úå¥5gê­á¼­õ(ó¯ÆÃÒsZ|ìFC¿¿I–ŽNN—Vµ÷©×;Ü$7¦è¤%ž×^EÓô´êL§#Žµö7¡?1¼žF‚òï'z?<þö…ëÔ„B'âö­öá[}»]¿½Iþêäè»« jàòM²ì›2ÛMK·:—é!Û!ËH»A VÁu÷GnÌ!–âwSB"
Ù´YY%q[šWª‰”ñŸpÖë¹a(p ^ÎðoðØ¾þLÇyú§öA¶HU—J…K¥ø!2*ÍD&Óèngr­›ÅÌfÆHèeœ@]oEíÖÆB¡ö=†—ùq[‰4¦îoîš9y!uû6âŒ½½½—´¨àÜ«ïtð’¤“Šž‚¥FÑÂÔ½âœ¼Xúš8žÌRºÿƒ4r–w'K@ÛíX\‘aó ‹Ú	,ž¢gÒsGóXE´r°8ì³Ê"äÊ·^ÇÁubÊ{–¿Šsì‡nfŽs÷%—©‰V4)~¿ÿr÷ˆÃÇÝWyäïá\÷1ŸûññkïÑš˜Ir)°&
¨¹¼Ò5±¦À¹¹(õùtäª /ìu‘Re}LðNâZºVÝ¬<—ñT› ZrEQcºˆ«ŸÊ_Ð7¥…Q7Y*|-L×äë+eÙ°R·y5²„Ý“¹?·~š¨!qÛs*t°ªiTE‰ÙOÈ¿p³(Š»zƒ ^?–Xa&i™Ò|ó¥K<a¿~·µ„Y2™»—ªÑÂM«dÉwÝþÚÒJ-1.Z^úåÒÊìîÍìÃé+®aögµ®»f|Gz¼„þÒuAý¯e_øµú…
áôçhžíôW4\Ãd*žUe~ÅMÎgáûUe† (lÐ ÈX#7ðA°vƒ¯Æôá‹¿"ˆþßõ ä2€ÅþŠ¸“^p=ÁŒi:_‘‹ëÀ{þ¾›z=ÐÇUùGÝ÷ [¬Aö†çÏÖ™ÜÏñ„åû»ß’ío^íîâ'uxù1!¶±h4-•0ßñçt¦>“&eHF3ç")È
˜y{M>týQ,H§0DOÁëó±¼95[…ÔuÓ“'±t¾NSþs¡ºóÉm™Õ,#¹%{ˆåM6É½2zû^Ø¼*9ra6Ïršp©ÆW<Š¡ú›SÌ5@lg’å×LeBmoAøN`Ø¬u›¦ÐZÔ´Â(•çuQí÷8Ý?Ü%Çû;¿aSÉ80$á:ƒExF)‘Sõ/P “ËÁ:…ê-“Ž#Þ-Š"_jÌåm{íèrí»C3!ä¢˜i½Q~U£PQ~¤(QNÄÍ÷5ƒ¦Êk£µ€”q¦o<Ù$V«Ê
 ºï`b9EÖõlªG<Â©gûfÙ‚ÎŒq>¯V¼EÎÎuÖ¶‘z'Úý¶HRqâ_†ZûÞ]£Ùyð–~¸¬‹Oï<ôF#/,¼]symìy“>kaNÁGbk‚§]¸À.Ð+ËÚ—ãcø«O:Ñ°Ös½ÑòrÜÔ¯‰µBÖàý+äWðwñÙûX“óyàËØ!o«þñž5á¯_ÿÚ€mÌ×»/.b<rÜ·@,¿&í8üºl]¿
$&›Út—õÉºð(^ Ør5úær¬%2DYº†ÕW¿¸é§ÃBü;ÃS*uï”ºw¯¦ã8B-S*{éÖ°Ã¾6\§î´TY=úŒ¦ŒÐ 5÷Œ.ô‘ûF‚þ]ª›®Ò{,{“Ð	ÊW~ŠòPWÔ¤u»¢‚¯Ö„Ü!G~E1£–|ù}qÞ¾;pf#:SR×îÃ³hÝ³øˆùÄ›xb¦‹¥@«(oÙýæõÁ6ƒrWŠ÷¯Ü‹ÙÈa»}a›@ÿØH’,‰^·Œ‰ –¥:Ä$K4×ª2Í²h—Ø%ü‰Á.Yï2ìP‹_ÊàÀšT‚½ë°ã§_žZ"ZY"Êåu©ò‘só›­§u5’ñ×Œ¶’&FÒk„‡mMñ^¦îŸ1|……¶gÕl!¦ÈŒ˜¤9Ou5Ø4 ò±rn‹1Ä•çé¦Ðáª¨P¯i¡\S ªZxßŽ?žŽ<tf‘_ÐKfÅ¼lpû¼%Ü=®9ë-Ë5­ÚJZ…~d?B	kSS´6!þ?b©¦Æ&Å¾@>´?‰¿?ëQ@X~úo1”AÜjG´<&$­Á6*	NïV„Û7„}ÓÊ`TªËrØSåùx¤”'ØH©‡àtè¢êûã›`“Œ½0ÄÒejüG5Žª¢þØ%fñË·!Æ‹…umAxÍåÂi§ÆšT;roØŒã†‘¨çL·‚:üÿü{HoÇNà„_sx÷MÂ¢pV‰·I&³q×ÌïS.©Ò¦u ƒä®Ä©¥è"Y[©XN/ÐÝLu˜xv.˜P;»Ü¢rkjûËÂÂòÏÉú	&Ãò…#ðÏ’òZêÞrÚÆZ·±‡¡´„x /P\BCëzÐ.ýÁl.ÔÇAs¥#ºòüh0ð(ó9Dh½©èøÙ°iLN‚ƒ”Õ?¸&•í
oøVsþyáš¤L¯3KÎY~­)csC^dhæRBï>«¿ÁId¥D£¹j­o¬vVA¸Y1TÓRV°´«GswÜ be*¾tbV¸æaÓjDêRyÌ„¬àL
yÅ';HëÅs¢ŸènËø3Ð4‰w3U.ÎdS²8L@CÐ’
Uð«úÃL7Ž9x!Ç«]m™ÈžR‡Zþ|<£e‘ÞXƒàœ”ö"¥vJ³h=ƒÑG“4‘+¡\y;#•dJ A!¼Ì–µwéMÙP¾¸GS¹£ì±bÄá]d§È‹™7B©ÀŽO%(ï«€]'ªLbVªólÑû»ÿf×kõzÝ”ulný¬S|Ðd0Bã‰íÀLÃå‘ã{°(túG­»C}ÜÙ‚r GI0-Wâªú£OyŽ+ËÄ/Cïú¢²eN@î	=ÅŽž¢ë.ÖHò‡ƒéà×Ã½E£®úî’q"7ÐêIï<Z©>E\Í›M1¸™ÒÞ*°z!H05¥’ÃÖP/€h¹ÝeàLyÔ42H¹9«ì#€1byåR¦j×*Æcƒtø²#ÁKîHÇÉ*çT©ˆœ³5œÄ»ˆjp»´åA"iPíY°ËÌ±¥eRVB"YÁ/ÃHµ9i‡
÷¡ZÇ`«4ÿ&¼áåûÃSƒ!OìïÆQ|»²âŽ1hx»ùÄ…íJ?c-$Ç¶|€ð¥¥Ñ¸‚L;)Ò÷øKv
=+â!xCE~Ò„93A3kMeuP•@7¦~Nï¤ï÷“šnÐ¤BßL|jùBA_6¡Ð”äü‹1{“)ÁÌ[ï© ‰òrV‹«!ÜâEN"wªrk7§ŠÅ+Û2V0Ô‹vÀfæ¨ççdÜ{~`èÎ{SAGiU¿®§e€GHÜ}/œÒàw0piˆñh«ùBVº¸‚¢±ZBžÇ:pÐ`>!,"ß‚!|žo
{VlÂEôµØv•Z¡Äzˆ%J–V”Ò:¢!g¸ÊXL¶©bÃVöè72žú‡aRœè¥˜VóÖO\ð¹åAm‡UüJ-Oèiù;D2ÓTÈ+@)¯}öäÐÛ3óèBÉ›™:¹?øK$GâbÞ“sˆ7›_]¡wÁ—'acy‘3òz¥ë&äNït¦uòÅ\esg‡V„¤)k½Ü…ääƒó>¨dX)ØjÖo§àÐš&»cãLÒ5,åzY—Õ'LY¶®¦*…‡Š¾kÏE(N7fèö+Í“›¡ãÃ
†n0µˆg7òïB,SNWÃïÇìâl¾l¾­q¯•rH¦ê4‹6µ)‹¦NÐ;Ñ$ÖVµ0ñT¾`5¡m°u)¤	KäkU¤c
:N6áXŠv1
)ÛÅå[äOíy#—Z"Ä;­†-#>}¦h7(Œ™X8™]”™UcÅØ¦­û;³”\mÏ÷‘¶èÉU¢P Ž[é¨SFØdí˜bh ÷%§ºž†·4Õ§ŽNžhÀ‰1'w¬Î7yá½sœ+"D¼ôÞy(©+¦8wÄÜoþÉÎÑñïÈé«í—ûß}C¾=úìŸ’Ž^ýF®¶ãO¯‘ÕÃAØ~ðƒç\kç’Ù$>kŒL[,ù¬Y^a,×-	þDTˆpJŸr‰ó‘ZRirËTS¬	
÷KìOPfˆÍ„˜#¸Â •G0O“
©TUêAÀ­îHK\”—hÄTTkBÌìbE
SX-W:q 74'Ù©8©Â¨Ç°@~Vì}¬$æ±F‹—Éaùœö"),SbìEà_"ŸÂT]‰?ÈÈÃˆõq¯€F¼aøþðâ¡KoB8=\E­ýð~v&}´¹£°@9á5 ™a€Y;([Ò²hC‡CY¹!¹Æ×^ø°%j¹‰œ*YãCPNw4s³êÑ„?n¢›(‚Õ€rìÖÙDvgý7z8’yéö‘XÏ` ©°÷:#ºäð¹t°„O³·)Zž×@œšjäwpSÏ™À¡œ’Rü•7fÑìÐ¼3†%ˆ(=±#oŒ8P Ÿ@O‡„ÎÀ®ß'ÁH’(&y^O2¯Ü¨DÃË ™Fl‡†MJ5b1˜p\ª‡£ž£˜DhDéÁéHMv.œ×|©‘IHü~ûøÄ%ö!Ê\Üm ¯klÂc˜F”^Rò'P÷«…M…S?À¡9£ôVN}¾gÞ'1MgÁttþ“6 '§`Änô ´Ô¬¡ÈjîWP'/Ž€HáHa+'ñ„²TXm¤šÊ!Ðƒô+$rº)—3h“aÎäš0ºÀþÒ–ñ›ÐïªÀ"„d:š…H?Ô>“ ËVÈŸ¶‡ó{/d”VýÐX}°t–Âg8'ðÁÂ©&q©)I]E ^Å1æ¬¤åg¹9¼O*P”¶_½>%¯5zÑv×ŸE¯ïÂóëQ
ÖƒÎ3™)T¬y)™¯Øt)•YQ„ã¡à,Ô’M“	~I0Ú&l:œÇ‰ª²ß8lÝÄ\D]«@™s”?G/RB…)ëbËOÓÁCW5_-¤`3e³ ¨(%]$jÏ½Ò’7êí‚Ûýw ý; ° *©š‘æÌIïÏNgúUŒLüœÔç«iÑÒY:2u»3r„"dÜÃÍ²	3…ù%º ô¿ß!ØžÖ¹E„4mÞ£nH’ÿaÁõéªÇ/ÿ…x„ÌV.•“‡…L‰R1³Rm lmÔ†±¼R{ øk`Üˆw9ÛYO7zk-äkýw·XœMàöAUÇèþl÷z.â¿•«%²­#¬Lè)éçÌ¤ˆˆqxgÊù5éÌàä„i8d,Mr õU¸ðÖðÝ¨Hf•f§B†.J%[•†]!Xlð…µU©Ûk´‰Ý¬PÔú­
•*ÈÕx4	·*Ã(šn®­]^^Ö.5?¸X³ë GBÃ:¿~àö¢ø¥vúR|A ïKÞÃ¥ÆŠÎ“ßó‚Ù=xÆ‚÷®Ù¿ÁVe¨3nd÷E½n½(Óv@ÓÈÞúÆ®¡‘©ÇC«rhuˆÏíXí|jÓÿš5‹þkÃU²QÛ ôKøºCÚxëFÍ†ßì:ýþñoú~‡Ï²fŸög¯µÌEÙŸg8ù:ÂøÞ²Ñn(¢‰ã»'ŠH§oÝªµlL®×ZˆûakÃàì&ýê[¼é÷‡V­A,k‡þ»NšÌT»Æ?4kë;üƒEšu¸Ü¨5Icþ±wÒ ðX‹ îE£	75h¦^ëàû Qh ‹²ÓßHcZ=°mÔwšô;?<€¤àuÚ|§÷Á§6ÿÔ¨µwØ'xi6è	4ÓÁñX;Í6þÏ­cxÚbts ×6pé;p^ë@3ðd?­cû-úi§AŸÅkl^ZÐ
Ÿ¡ßZ6\§S×¡C²à:²&LG«ÆGI§«C?ÛØ	~Ý®5vl~ÝÂ†Xø/LC½¶A—è ^³ðC;]´6ýÊÚá/M¾ :[hÀçKûÀÂ¬Öì[X}xÕA2ˆßÚœ¬Zë !ÝÜ°zâ;Òc5ÍÍ6î˜¿ÚyaÜ0YÆ-;ÝcË<I$9I”M"©<‡ÝWÊHm½H¥É^/¾±”TkŒ”7<EÕQÍºôÌœÅ
z<t;ÀËãÄSÍsž$³òò©Q:Cª•Ì³ºÄö9BoÌ21B¿õÇq ‹mgdP`4æ"Ÿ&1-Êÿ¶PÆRS4Ëûq&×øÜ­)9Élfú„îN¿¸a¸ ¬ÓŒge1|ýó:Þè=ÐáÂ”F+ðhlÞ¡RŒM‚Á—"qMkkt›ƒ”FÅr‹ËŒ•rà¡hÌdVØLcEYÝâ0Êø2/ä[>7òc›ƒý	œCÀŸÆ?ÓYôN”ÇzF?m!ÕXyÍœl»ò\Ð7lbï´k ËÀÂ?XvØÄO ÉÄÿUùnNP³émÄþiÜ¬µ›ð`§W­PoÕZ*ÈÎ­ZÓ®Z5ƒšµ_ÎÐªÂEbUkmh©VoTáÞZ½·Õíj­Ñ©²‡ñ¾N¿„pµ¶Ñ¬Ú5»_Ã/ÐXþmÐç@.Æ×´@!jÑ÷ƒŒlÁÝ8ŒÚz>µ7à®*¼þc5áãz•v©M×[ü3tÀ¥~£=³Pz®ÙUPÚ¨$Á£-ßYÛ€Áã÷ µà¡f»ŠÃïÐ²/„K8¶—ñ{:M´J^ÝÀ©XÇæ7°uÔ…mèñúÌY§Y}4¶Ú:8¨KØZ†¹¥oìØÐYXgh‡×ÜÀIÆîÓ >‚øßÀ¡[tÈ8WìïÖO h%þOt×ð¨c†»Iµ8ë˜ÓBg¼§4òáÉéöéë“Ýòýþîù::§N—gW€3F³Ð+WÔIq°qAþÁÞ@£ÍGv«$M¾’PaÕ.QJ‹z¢Ÿì
3NÔ$°;1ƒg°LIÛP@òêäYÊ)”?U¤fÄDÍ{N·ãÅ[®ÐH›ÊŠ5™Zào9µ0·U26RÕ®–bÆQx²ø¤šý±þ%Å_7Bê nTûeÎÐi e`RÜIŸðÚL<‹[­¯+‘1®Búa
›&ß§Áì•ç/Ý±ÇGésñÕo¤ÐÄÙô!ö1vMPäóûÑ‚–ôÈï]/÷áÅ/Xxà*îÄß¬è0Ô<.¦îr„œEôú­FK*Eçvûõæ@ŠZ‰qm)A°Žd€™xÜ’ú€Ð}‚¨w#µÎÇƒoòÃ/G²yý•y¼	áU*xÚ6dFM©åØKDK™`Îó¡Ž48³šuŠÁâ?”Nœ|ìO«JüÚM;=!c#bjMðOøi¥Æ%5%RÇ·—î¾ÑGlxó¡PZ¡i‚Òºq6Å<q6§ÅøpôRÂòö¨C«ëŽ0ÖNaú(çÝJ–üj”IÄ¦¶ k®rÓû(¾:ÃÛ“#S]º#Mê6æ	½ÚÝ%;Û¯^–´Þò8!xÈvk­äìÌ§¼%½çIm°Šš‰x*'©ÜeÀ³ò]J"†ªxœ7I5ŽJ€ÁôF•g/=gìObP?«ŸB#ÒÚ¿îçoZmÅ`ÉÉL¤^É4u;4nV#ÅEÀi¸¸®Î^¬êÞÍÛ/¸‰ÅŠÙ–d™~Øæù-Qf]¯÷6:qÝPJKd“~GçÊ’jcÂ]ºUàÖ`70œZ’Ç	[ŠFkåxgp°m8zFf•~{k°«©blé„Â•: ESó;Œ>eìNÇëÉÈïýèö—´°&£§‚xbû}ƒŽx4¶dçâž¡±ó›Ô¢¢s¼‹e²Ì(kCî¯±yØ‚"s/¡rÃoèã	RŒrF¤„zNmMˆWÃ°õãÖ
 ëò3¡Ç ƒa,	HV}ID47?/^ÞÝÈÁ¨›ÓD“CÓåR”ÃÔ–Â¶¡õë@ÒôM 7®˜€_v¶pùUC2“ Üæ¢·¯°å2·ÌEì+5Ó½ùÍ3·X Ójö40‰påi¾°Tnå¹ZßŠÓ“+ÏQ“êÎ¥3Š™Lî	U–9ŠÏÿíÿ>~fÎÍzçŽ«'²‘~ÑwÂ!¼Ü 6tGÓ,|Øþä²‹½Àeù£<êÚSôDì„)Ôù»Ñ;GV‘®%‘¿J¹é/>û­z÷‹£õ¸úxôå-±¸èž4Ì¸‡‘Î5Vy‰Çû|ê#š4ù>ù d¡™0ÎZœ*o€¯¼ðÇê Ä<.að ,$§7yç†;Vja†©}Ø£Cù•Æc†t`ßïÃ?³`âÐñ|c8vuaBáØ™€ò|½ÞŸ„³€fêâ4:¾cÒ-çòh| Ò«C;œ"Ô³I‘í˜qåãèy8zá ÿ°;½ƒ¥½}‚ýIßùHÈ9ÍØïz#`?ÓéÇÑçC8‘‡£k²"ºÈ1æ¤úÒú’nâliÊJ³‘¬~àû=8Ô<+4‘p6Å$í£ë±€çÅìtqm®¯ô"wÌ~÷­«ïÇÄŠ¶y!Ó_;Ý'`„MóñYaO"™rÿ~,±qkEÖØeŒù¹‘Ûçû#|ÑÈó-4hÔù³k­Þ–JÉÒÊ§lÌ•f7cÐ-œÑÄà‹xÀ>êëkþìŒ¿Š¤Ù«GS§¥ñU7]×w?y=×V.žÁh+{Z(ÖšAF8 iÐêƒóšjÂhÍlÖ¬FB§õe)›õãš¬ŸlÊhS¶ŸlÊ½ùÉ¦œ†ÞUž7Hß¹¾“~ñÑš•éøûü¢u'›È{3.C †øå'ac–¡`YÛ¡;öXÎˆJ\+¡	
¢¿âpg'é“úÉýdƒ~²A?Ù ŸlÐO6è'ôÏÕýÍÑÁ#ÙŸÇ}uY›Æ#Ø—Mæ€EÌi=éÏÂü|4Z—Ë*Ôø#Š^Í‰Æu[¶
Ó| •¦UdÑÑk^TsRe·€zú/œÐ]nÚ­ú*YzñòtiE“ìbzþY#eÞS¯½È4E¶E–\­ED½”cy™85n=ÃKø›ThsHê_Ê9ÅÕšÊ¦ódÿ´ìàõOÁN§„$ž*Ž:	O-3–v4©¬œâ ZÊ†ò¶ÂPŽvòF¡¼”™ü¬äJR”÷f"Ê $csœc[Þ«qò)a]t Þ²ÁÏˆ¶äj½K…54£Ã¥ýÖ—Ox=®Ð}¼¤÷ä½)oú·›dèÏ‚'ÿÍ'à¿i}þ›¹%â''Î“çÉ‰óäÄù€‡öäÄyrâ<9qžœ8¥‡Ìay8~š°”=g‚ã?P¦³&)a6-¡ê¹ÁÒÊWæ§"ß	£§Ñå¥W €b)Ie¼•TnóÉlzAK
²xêÏ
^p«›ÆŸ¼kX)!`è"UGÓCSŠBÎêošÓ«7ïþ&¸è:ËvË^µ­Æj«±Z¯5VÎeDµ³zm£s®@O‹Œ*ök6O&[‰H%Þpß^Ed°ws*¢øßnçÜoÑ1ªF~µPAW¸.â/Í~Ï>/vCâ:w#[Nôß`_ªô7¸“Ö„Ä+l¹¬z‹ü„¦,Ùvöy³¾aC‡Ö:û¾ÂÌvö¹eYçŠ‰ÔÂÅ-qWÕ7ÔäB„‘Òo&›Æâ	¢pú Xäc‡G'§äøèøõÁö+³¥=¿¢¸Q†ôï¸@o“:ž"œÏf+j£?hªd¾²ìØ	ÜYÈ	Ü(éf°Üíÿèb>Wð™ÝÎPÚÀÊxepG+,ˆ¼U”¡e6éñùóð1ó…xH3¯QÒÁÜi½'3¥©5ûÌŒ!Â1ÛÊ¸–…ó·ÎN_zëùc»œuÜ<Ã¬¥•˜:Ý“Yc+»Õ‰öÔŸ’=$£À-ð<Ík;l²Œ:ø«uh*eZê×ˆM†èa0yü4;‘2žbÈR€Ãî™…)´•ç{ ÜRÌG4îß!‡­òºàågŠIÆŽþM\1žÕ9ö&„ûh‚#jÞ,1þ»í	ÕäÜ×ÊŸ€20êgMÆðúgµOÇ46ƒ}sš?Å"…câè‹k‹ÆÚ#ÐÆc†è°3£ÉW°OÃû‚uØÛÚ÷¬“ŠVŸj°Î\3']Íô#Â÷Q>Â¦ù6Éöyì›xƒ=J„ÍÏŠÀîf“êÄª?|MŽö/Èæ¡¨ï‘ƒlDMåƒlØk;Ùpþ=ØÄ=×Ìdã¡løèytMçñÃkÒ¥[,¼F€ýø¹ÑI˜û­y€ø™1|æÁÆø¡DÐ<Ø 7ˆæÁ†ñÐq4Öñ"”æÁF÷Ñ4Öù¨y°~@15¢3GÒ2Em‹† Æ\?¤ ›ð‘EÛ,8Ê.ôfÁq|(q8å&qTÎý¦4K…¥t¦Woì$,¥¾Jÿè"RbA·EMÜ[Êñ«Ý“ÓýoîZÀêìóv×¶œN>%ŽCYwm»çò8”VÇêuÖKÄ¡˜ÂP²%FÃuÎ©ÿw¾X-à*è”h:³Œk»hXÄÙçN§Õ¬?>øê{8@ð.Ü’ñÓY0…-ÆŸ"$î)B‚O+hÿkí’avý=ÅIðÎn´êèùÐ`‰”Ü0bÂ.Œ˜ø¼ßé6vÌ„0¦‚¨	~g§þsŠ› ²êöõÇvšKÂõ<æéÖ/ð™o÷ûT(rF(Ç#:³;	¼¢ê‰ûðtPžb*—<RýÃ“Èkà$ÔfKî^³2®c,øÚƒsÃñ&ÑuìOz,§ŸØI“.‚Ò>!h˜ÿ4ƒ,ZOAOAdQ–®>nø'dq—`‡ŸÇBÿ‚>° YÐ
;x
;xä°ƒÆSØÁSØÁSØÁSØÁSØÁSØÁSØÁ#öûaƒŽÆßˆÁƒíQ¬÷OáOáä®e.H¿®ÜÆ>;õÆîïý‰{è÷AèHn÷Â£©;Ùº	‡þ¥tK´€-~èÆ-¡do^Àqã
$Cw§ÛïÚº‰ø'±Ýz×Ö^Ozdyâ^žþ”Ã÷Å­ð;D88–yD È\É@ÈDÁuTôdØb³iß‰Ü—~o¹ÿwWI½°ae•íÕf^eUKg“Ð>e¾¿ÍAÆÈ 4oqDä'xž÷£O5ÑÚV-p§°-Üåµ7k«d‰,­Ü¾Í4ÜÆ‰zC²ì¹1‚ìÉ¹5øÒ–+{œP}†lƒ/£Ç—oÂ`±LÛ¿P}N`nÖB}¶=ñÆÐ†!¸À¬R"¤ätÊ…¿Ýg÷Ë_â¹ãOÞÅ×µ‘áMø÷oÜ‰ÓÅþÁ-Ë"]}Ü÷5dSRÿ¼	0g´us•l’z†Ça]“n²²7¹W^dnF<¼+Z%èûOÕ³ø97XÑù¯‰	r]á@›dÖá.t@ÞûÚ‘æ„2>Jm£µJ`Lv}Õ0@i¦ø£}N|,7séÜÍû:aF“C†Ÿcçª
Ì½Ù¤®øø8kÐ ‘l¤’b'fF×#:8œûÚ(ÚÔÒc÷‚Þ@þð²ôy¯ßØ¥ì8²\Ã¾(—$/Øy˜úÒÂae0°8wOŽ½*&SJïj’8ìŠ†+]V;dÿKñ	]6ë"ÚO!='G9{½`é!ÝÃ™3t>îg%r™ê·Fq.¢+=ë±?½šlƒªXÝê{øÔë`”eGü…ê°='œÂA¤»Ö8g‚åXŽÝ<7£?óÆjù,z[iÕ=¼U?êŒ¢­
½·¢¾!ß}³ãwÿGÑÃVb‚|ª_nUFÎO×Ê ;¥ˆ“J!ñÝ. ôEé(‹×AÑ´Ùø¢xnÀÓ.xäE ¿)W»1´{9dM²Is€nõèënŸ­í|;\ÛmPÊz7¥!$ÚÎOqN-ÊMy4æF=é<R*žpÐýŽ¾ûÂkaÓRc(?(¶›O¡£ú1™Qç DÑQ3JöØcyÙ*ûÃLE5¤èÂÖ@˜{\sò£RÐ(¨?t-jñ	JecdFcZÕêÛè¢4
¡FÍÒQgJ?ÊAë•·Õ*Ù³µTþ’0Õõ¤Ågk91¹œüü-LÙÑ`(¡?Bù86²âï¸Ÿ
u×Ôö`}³Æ
oRV¡Ç-‘#UG—Z€J-C”›43ï¡S<Ë,ÎÜZ›KhíXBƒ¿†øWŒ2¶Ö’ÅµòrYÊ“Ëò[L)•È¢˜Ý4Ä
”•Ç4r“ø+7F$E£E«	Žü®Ã‚—GÎ5Ñ“ØÐíU.CZ<QÕZ³‰ ÆyE/€ŠÒ¨Se˜|¢lroo×nîœÓ04–âÀ¾œúŽ¤ê¾CUu‚j¿².Y‰^‚ŽÓÄX”¦toïånó%Ï
ÙÛÙ®[{™Ðë)ˆ0Ø11»)@Æ¶VmÛ^]_ç5]ŒdªíT/o®L_i4ì®åðŽZ¶Õ°:çs}œ¨BO›$kÅêY}¾Í1ÐŒÊ_8ý÷Ø°=NðÍzžàÓY¥ü+»žŸ¸ÎŠ>¥Ø¨øB%ˆ6ÒÜ	ø=pÒJ´SíX8ÿ½‘7­âÙÅàT#TÄ„‹ü7¬¼B³1(‹ŽÓðxˆqÂL[™#FÅ«%\¥L*˜ã¢ƒY@¯Çì ‹aÔ¸ãŽÜnà0(ç¡K0Ä}`.†´LKî§Tò±\Ëµç¨ÒÊ'fLÉÖÔFD"håLÑ­•óWCïA‡Í¥:öLK¯7gZB¾ö‹MRùÿñïÿ	þÿ_•UtŽCo#¸hµÛzãW¿ú\}çŒàÊFýK´p2HE\ûfví+ävµÔ{ÿ;üÿ_ä÷®¯[[|o§{oRÄÞ˜ºË;;vÛÞÞÙÈ½Ó‡mqáRÊ†·òßh!-”|^;ÓåedB«Ä£"€R/á?”¾~t¯·n¼[/IlKÐ657Ò^,X"T0ÓÐÍÛTó‡Ì7øºÕ[Ép”h…\[Üç‰Nðööù÷kë¶d¬½2®Škæ"«÷A™¥]Fâ)‘[eh>)â%Š‡³Î5ž4k(ˆ_Í©´ÜÛKðëÃÊr(Þgv,¢Ä‚%ƒ¯JCXgaóÜ5mE!	›âÏ>)„Më“•uNa[¯?>)GÌ•C ©4OF	Jé·3œ»9„‘³Ï¶ãv7$§±Iépr9¤ë]\Ð\AˆÍ‚	ª$‹H#ö†½Ý¨ŸÓ0Ù¬ÞœH#v“I#m±È@^ìhëÅýYQRêøgøÿJ'qÔ?ú“‹º]o$§ñëVsµ½¾^›ã”ÿøÿ¥¶g!4|í†;á6m¼]·W;v£šýâ"Ä+gì¤M6íÎj³½Áš|ÏÒÁýÈÆ¸tuC—1ã1íŠZoÞ8È>–”lšq@ÜÐýœøÂ‰*î~Î¤Ãþ=žõ‚Ò†ÿt¢9-‚DãÛ~GùëIùÓ)F‰=?èÍc[¸—ã|2wá[DC~ºÇyþTüÁs£¿ñLÆV}ÝnÝÿÞlµìÆõÿ¦dshtZmëéì~:»ŸÎî‚G”ÞÎ»»9Ëù9O"?¸Îy7éÕï=÷èLêœç†[7'§G¯öwOäArçç>ùÕÖM†J£×ä»Õ¡­ôn…Go­ä°ùØ¼p{:=`!3òðr;^ë:± a5­õ¬-yÜß¤Ÿÿ² °c'@â]' '?Â| “sù¥þgêJÎ7–ƒóaÑvü}èûZ§²Øèb?³ã<„Åú=°ëv;‘o²ÇÆò€€Ælâ‰cçU1<gÖ*±WIc•4WI‹1pOÏ¸S–ý6„)¨†0þêÀ¿ßÞÊ|R]$ñ1Ízì)¯Ng@\,¤åÆM%0e÷JZVñ|2‹ìMª—Õ:ŸVÕ|ÀÚ~ë¢¿#]Z•³3ÑtÖ¢+Ë
ŸÛÍÄ…™YµnvÕŠÍØÔ¶ˆ iWTŠÑ®¥næ;ùòG^n)ç^?}ÛT—i‹§hº=(^þ}¾¬aËæxÇ#˜Û{yå xw_•sßô®‘9LÈ[~Mp4âYZ|4­#9µîÞz¬ $5˜%Ü#e]>L~@Ófº”â‡úC°€ £¡ñ¦CŒ¥Ñ¦FfièNŠû!žÌÙ®LiðZ{^=áÐûbvÿ†9·@Ž‹E…ÚH‚0:ÿDJ†vâEñ‡‘|¿¹@ü©2„~ªÍ üçæ¬V«m0mËö
×BßÄ*¨ ³ÐfóâJV¢êf;ˆË ”ýçX«ëG‘?†)¡áS<X»u‹¢ ×	³ù¾ZxË2±,Ò0;Åù{ZóŠ;wTFÔÖMf^ä¶Ûi™åX]kp®¡ÎVÊ-1„žÔER˜ª	´äÜç1ßJgm)‰Ç¾Ë¹õh/š“êA‹”äihôbMó¡*Ot] ÉÛ0›„'/LaÜÂCÿÝ±8£>Æ!«–Æw"S¾+ðCwþÝÁ¼ Ü5Ça)AyƒZŸ*‰.å*N•54dœ"$QÜ5ÄØíû€ã‹ìŒ»ÍkwÏ{@ÿš{'íôÄ‚žC; sZºnÀJ
Åg½ñH2Æ~·:qÞ)åŒvVùŸÃHt'£Äå€Ìµgt}V¾úÅíW¿øÿ   ÿÿ 	>gÁ