
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

  const CandleIcon = ({ size = 20, className = "", strokeWidth = 1.8 }: { size?: number | string; className?: string; strokeWidth?: number | string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="8" y1="4" x2="8" y2="20" />
    <rect x="5.5" y="11" width="5" height="6" rx="1.2" />
    <line x1="16" y1="4" x2="16" y2="20" />
    <rect x="13.5" y="7" width="5" height="7" rx="1.2" />
  </svg>
);

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
      Icon: CandleIcon,
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
                          {React.createElement(chartTypeOptions.find(o => o.id === chartType)?.Icon || CandleIcon, { size: 19, strokeWidth: 1.8 })}
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
                          {React.createElement(chartTypeOptions.find(o => o.id === chartType)?.Icon || CandleIcon, { size: 20, strokeWidth: 1.8 })}
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
                  className="text-[#a6aeb9] hover:text-wxœì}ëZÛÈ¶àÿóÕîìÆìÆÆwä#\º™C¤{÷É—é[ÆÚ±-IÜl¾ože^bþÏ£Ì“ÌZU%©$ÕMÆ¹ì³[éN@—RiÕº×ºŒ¼È%QàLC/òüi­ïý ¬üÉû…3„ìþ„ÞîÞc«ñDÂ(ð?¹¿zƒh´÷Ø¬wŸÈfñ™ÝÍ›yùÓü•ÝÍw·ÿo¹³›%aèFäÐ‰Ü[?Xkç&$Ý|Ê?“þØ	Ã·ÎÄÝ«Çî¹¯çã1¹ñƒÔnâÞß:lµÛÈä¦Ö©'ùø¾rr}]Ù •îýçè’þsxrTùPŸ8³j5rnÖÉÞ>©Ê Â>Qr…OîbïÎÏŸþôpìõ?í=Véàðáôë
üùŒ¾RþXúÝñÃkM2»©µIä>Dµ¾;Ü€ýü¾Ùž=| CÕnüñ ×½ÿÉ›ÞÖî½A€[àŽÈ»sÉ‹Gék	q’Ù‘½½=3TÜHÈ+R¡S¸¾±+>vømï¿wzŽ{óòùwn°“>»¹Ý?þôQÚÂ
+—à±øMä‡¤ëŒÇîÄGxÕý”5vþ<:ìUœ>pøÝ0qìM5 °pÞÏNo|À¬Ií}­‰ë8v‡Q­Aïv„ÿŽjï[xúæ–AŠüQk6*ªiIˆ)Š©¨n/ÜÏ)Yr*sIûð°“®S iEb#6Çþ}mQsæ‘Ofµ.™Eµ¢|ôç!(ìþx|ãê–2
 Ö$Œ)åï0„7\Ä¿Þ:³p3äÝ˜ŠZ*’pÝpæLÅ×d‘º²ÿx~ów·Õ„Õ‰|r£p½>ôÆðÊêAúÿÎ/]gü†^>û¡; ×Ö#¿ãO½Ç3ê#o0p§ëõ±;½FOÄ›’Èœñî&N¥ô‰?sú^´¨µ•ýÿ÷¿þwÙaÃ—ÛáC˜ç¿µJç¿A&vÈ{!ÀŒ6ˆ3]|X·€@á«;Ç;7cW>_µ”¹r ?"¯ÀB¸$Œ‘âÄ-ò
äžJˆØ›‡ümÄ<×Ú€aETœùþ[sïà÷°6õ_Hå0Ÿ>ÆÍí'ÍÂÒéÖ†>P
pýhäMæ*QäR¼@ãô´7Í#Éüw¸Ç+›è¥;”±™h1ãó•qÅÙØé»# 77 Z]éPkR†uçŒçnæ•²»@ÜŽœé-ÜXu3—=Ruë‘ÜºQ'}‘ ç›±ßÿë°¤MXØ€þ½ –A6€øþ ö0F&ýþû¦Ó¼i?pÅ¤¨ŸÐUÚá§™ôk5ˆ°\Là±­›íöËFüˆ0kò¢ó±NÂÇ&îÀ›OH8rÀ[½éÔŠk ÁÄ*9©Ó‡_€JÅ¨ñÈÈ*ˆ ~9]TuX¥Yä©þ8Äþ…òf7ÁŠ(&ù#¥wú¢X÷n¶¤š6½GN§Z®çžyB9xH~öï@"gL®¨Ü%‡#of­¥g>¥mùj/•ôŒÉ'ê¨«¥ãÒ¡`ù“q˜Æè8°‹H²ÍÏÕÂ‰ïG£
ñ@Uës‹£ÖÇ‘.Ø	ã1µ‚Å,òéOó p§}uô72ñ€Iì×«XDÛðŠôríºïOÃˆ0…‘É¿ìKi:JS•ïIuËR€s4¦dèŒC÷¿ižP‰f»ø=Q0WÜò´.?ÏàBu›C ¤èt:ô0@q}@>€fÔ>X,['rJƒÖššaÖÍ_ŸÌÈ‰®A*ÂœªøÞWõ-É?þAÖÖÖë‘æß»Á¡ºUÄr3à¸šL"y\\ëÓ‹k8:~mÝ›öÇó`ÚÚëëÃµuÉùãëŸ¥ç¯ÎÏ¤çÎ:–^øÛå…ôü™âÅGÒó¯ß¾V¼øZ>Î/“^8=’Ÿg \³„¶À çw,dPÿ	d»¼ÞøšôÒ¹7–øàâüOr@#‹€-ÀyžüÛC¼(ûîƒÙlìJß}í†cGzå\<ô‡ò9LRòKãÙÈ¹qåÏ½q#ùëÞþrzt*GÁßæ9D}X†Ù@üÉ—í­ÇÞƒâ©¾|ü`f‹ ©À’¯ÑÐÜºFY´Mž£×ª¹l®1MÊE$‘\`|Dr3ÉÆI$(E+Áb[Oë‰d‘^ç#(EEê Ëu^<êrì¥*…úiÑO8{¨µ©eÒª’J„j¯`T÷Ñ¢¸œ™Du}%áDã'ÐÀsf·s”þD<ñƒ(ªÁGiî§®ÅÄåEç~VÑ'"šMj/;t :×™ƒLÏh ,5vGrºóºsØmP¿Vî¬ÄC¥ïƒº‰¨Qð¸<J†@‰]8½FEð«ÆF"_e´K+OûžÎ)X;L7zRùØ¡6+ðÞ“_Uî•C%¶÷"Ðo³EØR‚µà‚9ˆ'`uogàÁÒÖ"¿VW€^Ôï[­V»ë{ç9Âop‡ˆ`Êwì=1‡#÷.ð§—8%Œ½Emˆ]£Ç‹üì:H\ËX]±É	2ðÞS˜5ÂÚš½“ÙM­UÂó)A;Õ>DeŸ25¥ËÑô9ò…Q™ˆÍ,(îkï·8¹&îTæà]Ù§^þÐS~+}%@ŽJM*ñJQIç(¸*ø§Óa)Q©¼¦OÏ£ÍÀ	Gî E"~ßf·a%ºFèƒ½îŽg•ý? ¿œ^¨A¦båˆŠí;žy`„Y’Ý¡èûc¶1¢ÂT¶»X­*ÍEnô]gú?æ.²s"8Øê`qNª6Ÿ0Õmã±ÒëK}‡ÕÍ÷ÿÓ©ýÑ¨½ü°	¶ì*Ê™!ì(h4Þ)Î¬ÄŒÆ‡¾°£B3pn«î¯+çÏžùî=7À	(£è:~w¹ùîêˆTÏ¯×ã?½¾HO¼;Ú<<ÈÝñß/~KOÀó›‡?Ÿdï€ÇÒ0 0Æ‡T'.	•Æ¢8=ò™8Qä†Ü?¼§uxP«$AP6âÌ)À¸TÏ·r…ˆOSÚàOÓGuT¡.ÿ‰é`	ŒÅ¯BS)O˜ß¡=µ†K2«ÜÃéÍjóåIn“p´ËL3¿Þ&Ïh—_Ï…%™ËŸÎ¬/àÌ’Áý_Ô­%ÅŸ®oÒÁ%CÚ?]]ü°Ø}‘+q †GÕª“ÓÛ6ÈL“»yßüPŸÑà'R#Nú›\ÉÄUËª˜ÜÛFW¡¡ÒLN·œª>[ÔZ’UØuñ?±¥ÓPnÅæ0:Œ•†Q†<:Ò`÷'ÃÍ4©‘4ŸÍÜ b3k.…QÆ¹³ÁSŸAô}këO»›3£)·©/NÎÊ¥†ãã°Äx/rÆ^¿²$ê#ñ£À•k@T8•n©4^Uî$bÅÊN·èì{ú©o©EB<’˜%ÄÛ!ÓùäÆ”AŸÑ_A»_<&/{ª½xôÔ>Àœ›W­	#‹9Atæ;˜n	Z£«¢¿˜nmRT“éØ<ríÜT+€g·b¸=Àa¾7ñ^3ÍÒ¤¹{!ØY±aœ³¾´/;ÅÙÇTé ÆW±ðŸkoâ“Ç_þ
Þ#ÂMƒ}«Õ(¾åÒÖ™¸àîÔ&¿¯RxHöŒfFÌ’ÅYkð~g2ßªðBÍÈD:²'ÎWý´z»g‚úãFâjgO
÷×Ý‰ü+pÿsŒíwo
:§3þ-‰µò¨º¥Å‘"¹þþ;ùµ7=éô©ƒ•†ñáSLCÌC78ÀÓóh?óÎ½ªÏ½Á†þY/¼º÷ÀÂÛ¡2]û"U`½¦¼²¹IN›é"¡3t£…ŽÔl ç«É6U†KQ«s}ƒ´†ÚœUÍEÜÅ¢ÁŒšªÄ¡½ˆ7´¨k›û¹S¿÷Î7ÃÞ÷¨L»©5u;VNÊP)Å'¸Æ÷¥Þßn·»m7Ù#¢§œö Óû@÷e„ÓÜ·®Ú6R	åvŒU¸U[§×\Ä[dÿÓ‘rŠRfà\ð–æð
¼3ÿÖ§Zþž &µJ’Z5P~|¬ñéçc¶f½«Eâ$ÜÛB¬¡˜‘¨qÝ>»”^Øo†—ÅZ›~ZÚ-<q,Ô…ê^xø i² ”_Ì>îeÎ·'ÃO¨R7pk|Ùmlö¹@X¼°Ýhà.-n,7ê-`(c·±ÈVN­ŠÝè<”ÝKH”f#@Q­Ÿú÷Ã±óÉåšý6b¤aàº “wBÊŒÅ‰ƒLeêLûî°€µ7øûúÚ/þØ‰Öô‹c·<š=~3]è.ë/.µñ&VLMŠ÷ôbÈ4Èãnã']+f{>ýÅá’Œ%Ý-{Ö—0n`ûäGÒzæ—h.*/É<
OëÕI@Ê™_×;·â~>>» ‡Ço¯/É/§Ç¿
rIFS·q‹0ÆÆ,Ç*`¯÷ \ƒ7È êbQÆ/A¦Bºá4nƒìå$¤	1ÞÉ Iöˆ°ìÔºy÷ýp7ðé¾>šÍ¦)qrÈ/{˜ÕäyQùÙ8ÝZ%à±KÍR“T0%üJtÉ`´FYPˆÜæ°|®|í„}gì‚1FÓgÍ‹C£ wIH ð8s‡q|Gk[¦§(cavG­"kmKd$ûêŒ
³©LPd~öïIøÉ½Kù_ínŽZ_.ý.‹t7èZËÆ×1‰¾:qþŸo Ùa/L`â<Ô€¿v®Æ÷P ]€†¤-j=û°„×åÏÁ4‘ëü~xp}üÓùåéñU6fßâ§6À˜+ˆ±)'ª½ÀÀ«º7Pû‚Jxƒ’ÈN)#ÎÈŠ5ƒÍZ÷w+R­lÒjsƒ¿@=W¥ÕFÌuå¦1ÜÇÔ8ºÀ*c¨ŒÑò~‹Ú~£ø‡`™Xn«Ýºù`f w’øÆ¬¾ÊØH³Ásì21iöVÖØÌ‡þÆ°Am ÛäJÙŽ`ãUÊŸe4É•¬VCÉÄO¥§îùÐ©„_+NG?!ò¢±û¼0CE
³,ÐäG?ñ#Ð‚Èë]Yò%¿™€V$%eôiÎS`IÓž$N}
,@³,¸’9;|ÎEÎ¯œw‘Êê $º¸<s~}|ôûÁåõéáYÌù‹7ˆ7xÐrE:Î8Ã/¨ñQÐ#>x >X„Y³'A¿Ï6·3º‚ˆ€	')¢b&žEi^TÐP7dcÎãL}’üTó‡CT·M&ä#ÿ6½¹¦Cf<äM´é}²«UÊ¯Ïß]¾=xZù9º<øtsµZùó };Ó(´RË'ƒuº4W®™BÀ~ìpõ ÃÔ8Ao~ßÛæ¿²aª³Àoé¨øwíÿæ°Õhõ’àÆ ¯KóäÙÖÃ˜8So‚áÇ0ë1hAðCÆSdTó|¦ôËâxópÕš=ÇçƒFùOÅ˜øy ‘V³Q´aeìl|›aeYî.xZ®Óõ—q©g’çò-cTÌjÍ¼Ò!3’Ú7«Ú7R:—H%Dô%ê¹Ôu1:¨?KbðÕn7;Í-É*ç†Õk©|xèš:'Xm<é.6ÿáT+vu¥S˜°àãÔsèûâ‘Ÿ@½9ýí”IÕP²ú‰™þ¾ÅT!A¿À$ª^Bó@ªýæ ÕâEäš«’ÏãÂ¿º¥“ §çfèE#räŸÈ9Ìgì,TšI
Kun¼^ÁÜõ&·†ª0èï¥ÀÇ	¾Æ4ŒoE³pgs“žëói8ƒiŒ@#lÎF~ä»j6_nu¶šín³ÖÙn5zÍöö`«í¾B„Ý¢Ž~zÑ`êì‡ÿÜÛnüp¿×k4ÖÔ‹Ê¥ãÅ§ñÉ@×wB G7«ŸÇ§·º™ÓÌ¥Ðlt•
{³ÑPW×á‡3ŽR€1ÕÖðÄ˜í‘íUÆÎ}Ú–ÕpƒÀ.|à‘‹½ÊÔ¯Å§tOjÌ3
åsi"–KÃ æÑÐŸ6·¹4šÊ¾ÞôPëçôýœžCÀã»9‘Ÿ—œ´x’RT	òg„z‚0ˆ÷¤u“’Ì«¨‡·¸<#ÐMúåî¨­ó#Ã¯#8“Óm2Í¹÷ß‡n«Óÿ )ŠaÞ@Éá¾ák6GmÓçàçM©>®ÎDleYØ\JŒõâ^\.%N•Äñ’½ám£›ŸM˜Ú±ï¦‘7&tIwR˜¸Óî“SþÙjH£5Z3X¾	¤´V¼‘šÃÞ3,XsŠ…˜¤€	Ó³î`óÝ4po½FLAÎ0üñ;c¸¤2F¦Q‰©Ü^·ØNT1æùuyÖŸ°ÄÌZ*V;ãúaB–.Á"L•‚’çhõŠ&,U?QÛ×3_b±´ëÊ8<¨A‹Ä‘+} ~R#LŒœ VáÀÿ‡×Ë°©<ƒd$ŽÕ(S0zh«myþ¼]Ò]ê°J™ :\c<,Þå@iž©%« ")ŠC„‰×v3U*fçr	ÑbuS?SN\Ø½ŽG¦Ïý
ú+»^TßÒÊê­L˜ÁAzáûL‘l¬­§Y8<ûf}ƒGÅi·¿S XÂ_+.WXI/ªÙs°%#d¾xW|g;¾óeÎã'Æ2$%çÜ³„òÙé/ÇäüíÙo«ˆ‘Cf[è–ã•1ü„½ÔPd!{”Ø[É©+"‘§qÂºÙXIÈ`Up—é÷a”S²ŠÕ-‘ï„Q=œ÷ûnV?²ˆB*ýIåEN•«ô»Éu@q÷»ÖoÓìeüwLuBÔÜp8l`H~3˜Ó)÷t|î<æ
Œÿö6ßRÌéwæÝ XÍÌÙˆÜ+0¤.¶BùƒmÇ[>°‹Z\X¿Ãy´ˆõŽv'({à
ºffÇHL.ëøXÇàèÏNµ#ÐjÆî%WWS¼Œ©ÑN^?‘ÍJ— ©ÈÄÜãŠÑ<´3zÊ_U]²)nl¿arx~ñ¹¾<8:}û“yÇ¤ïÏc«î˜üî˜ÂúÇrõÏ-“ÌÉ<	–ÙQ„£ï"¸9´/ÐïŽ¡K­ö1£"?;Ù³¨‡þøŠü|zu}~ù›™îG Ãü`±:š§¤ÛmÜÝ—£\.Ç>å~¦IôÈ**!Âû^G/y³LALÌ	–(0¯
·Pë@K†X*|Ã=Ç~))I·Hm2–`IC‚À¿£"ó4./S¬Öäá3­|øL–ƒŠÑ4Šý.ªê†’‰H˜¬´d¿Föî˜içb_Ë²[U=ªLrKQÚÐErª@c'××d“ž‘o<.z„QR<X³CÒÂÌjÒÅP	®f’AºS“W„—ôH¡JS¬~˜Õ®¥ù¬añ½,Øß,•ËiõÛÍ"B&{Å4D^q»1×$ñ ²E‡W §Œ;~Xa­¿XñÝ_¬ðJ;°ª(ä|Bƒ1 .¡Ùð·Ûÿtã?XÒ­ &iØDq!¯Fþ=Î†Mæ|J§Rý.”–¬°Y1±Øj¶Z©¦Ÿ×ð¶ÄØmR#›‚iyŸÓãG!Žë­õ’wLdé`9k:‡/¥ I»b£˜xÓf(¥°9#bAŠ
šòT¶U²ò“ºs4¡­’ò-€fWÍ[Ù§ˆ%ˆÛÇ+üÆ%ŽºÉJ¯Éx©$F+•j£LÏdÉ/ÌÏLGÕjÍ‡yËù^–óÚiÄ5¥í´0Mðm”¼ˆñ9ú2Ä·$±m8ÜÞf—jÝ¬†+p2Î¦pèœ_¿•^PÌñUµËûQ5d­¨ê]ÞŒ*ù”¬Dà|û}ã÷ÆïÀ~noœjc£Õín4Û½F½»N«¤ÈêÃ*uÆå×ºOÑó‹­6ÝXïÃ³ó«ã‚<“¯x<«–5ÿÌÅ:Œe¿da­Æbèò²Ò,U¸¥|vªúäŽ]Äñ«È‰BrèÒô)ÅwêÍ\Z©ˆ}í!ü9ÎDRY/ï±`6+ÓªUªÌž8Zˆd-I+MXEq”fFé”Eç:V}–aâ ™hgŸK¶šÏÕçÐ$ˆÉö’håÜS‚=ß77Hkƒ´7Hgƒt7H÷ÅñLÑÂ,*8äï«q2ã%•
›8¥PÙL#6Ènë$(Wz£‰+)„0±.bqîª6ë«4ñ)¦ÐB”l—CIÕ×ôÊc·a§Tõ‚å)Uþ9ËAF±Ê%Z.•ß²ð¾|Wá¾°&[¶=ºÄ’Ù-u¸­®dv|Ä5¯Qá–÷¹óBïfìb%v.®BápQ=:Y^¦ìëxQ0:ÐµäaŒ;–ÕViòüíÜWËæ´“™¢²ô.˜Ì›{™UAÄô0”F]Œ}méJ&šõ¯â¼ É=ìÜ°.×&Oð¡öL‰´ùép+€›ãmu;=É³¡RÊïÎ*ù™zo}Q7Š-ò!‚ÄúV7ò¼5“¢Ye)@xr‹'ÒäÐLõDÒÆEþ~õ¦´`8“)%®{ºfˆ2Š‡8óÃP:P`d;ÈQàÜKÁl$ÛA¨[E6cÿøùN¼f5*+sá}V­ÀËÃÀˆÛ«aÜ‡™ÛÜÁ{0Ç™Ð^x?rÿþWRÍ¾w“4u¡ÙìŒi¯‹ÜTØÀ0áìL#ê¯nn‚a4îÏ± ª3®ae?ø	«3¡-ÆëÒ€w?õyÙ|¯Ì÷QkêßÃ¿0÷#xQ~Óž§VÅ‡ÅÀÿ7)rÂí“ÆUáÂ‚ž|%9·‹ÐìÚ“¿á¯ô¬6™»‚R}
œÕ4_ýUZZ>ýœ~àïéÌa%¢ôT¼l–Z1œÙJ‹™ëƒSb¬e-…Oz]žôz:ÉªòäÎ½ªG>®rq~¡º^ç#«¸î=ÅŠü8Â]æhISRx$DÃ”ˆi<-;'7¹âŠ†aXD‚,°Õ&/¬“ÅúKæðÆ‰F ZªösßõÆUáµµ”.×S2s¥'â‚Çô,ÁWÐìÕÎ;;øs+ÃâÆÔÓÈØ+/Ës6ZŽñ"ðú´ggÿi}K¡Þ%®5-“Jï‹ÇîƒzjTQ^)ž6>ÔÉ{Í¼¦÷áæôEö©œ6¥fX—ÄNþ^YÝµC(¢Y‰Úi,bÀòdÎ—Ó+0yáÜï³ìÉ W;ù‹Tr“çÆy …ƒ^¸ˆe±¶å?
a&NˆÊÝzêiT¢RZ¹ñ}lWbC,¹i¨Æ-MÂ…âW¬x~ìŠýôŠÄ4‚¨(¬ý¾QÇ‘iàaã›8—†±ìX ÜÀ3ÀÊôYI¿Û-á;nóUR“ßoæ‹ì‰¾3Û@µ WXRˆg) 8™ËÀ¿Ÿfgº0»Ì™™EY,»éî–šî³yþ	M«bÝñC#+Æˆ4[ÒÙ+ v×x7 §ó@yp§ð«·ò>_ô‡ñ+ Ç @e.cÇñúßnŸìR_7×p®ÆþMÖS<ŸQ,H‡cßè˜›¤Ý3+<ñ “ì t„¿°`¤žõ8(ÑÙ³=“R”ØÇ_<Ž€ô8¡®ƒÕ3¸ÂDàjkƒf»=È‹Ç‰öŽ	F'hï?š‘I2 jÑ RÔO@…˜Ìk@	æ³ŠÝU·~[ß ­ÖN·½Ój“ÿûü}0¿5ˆ|Dø‰Aš²˜ j© †Ù¡Ê°ÁÕ­k „i—Ó•øÚêìSS}ßŠK°cØsñ ‰i`•%
³Ì0%æÀ}”a^ÃH†²Î£_{™ ¥fM[c'\öSóvÖrp/ØdÏœÍ* ŸŒõM¾t“—X¾Â–ä¼ð­ó¶:Lâ’Ë¾ê‰=a_šþXœåDJNÂ8ŽE &vTmÃ,³kv% :Æ‡ÞÔ`Œ‘?š­¦ÈoÐ_wÈZ«6ðn½hmƒL¼é<r3§˜÷K8¥m
‘™Ù ¾3?³#vg¶æNk?½¦9Î";àh!ÝS	Êáñ„¢æÅ#ŸÃÓ³…žíþˆ¦µpðbUHôµ±F5Ü¯¨ñ˜V,ÉŠzøÔ¯yƒµ§¤Ú¡yØü~vj)öÀ-“fºeÂ+½Ìâˆëd×&¤”ëƒ1¹¡õ0’VŽUºQn‘P¸Lj5í4¦^`ºAÆX¨mg³"â €9ž¶«Pr˜s’-v]â”Kÿ~‡÷¦Í@~ ÜÁþŒ«ÄÐ©r>úþÄÝäÖœgeäõÅ9øQ¢Fß"›È;vÛ^*~Á8dŒf¥6ëH±[ˆàéyZf”ÜÆ“|J‰Ý¨æpÝ|ÅØ|qŽ0JÀ0Î¡ôO6,“ÐGxmfOÈÜ— øÚPê^mÐAøQb¡ùfže5ŠøÈ¸J>KJ †$*‰]/‰ŽôøQZÈ%»S·LqñÛÊ£©uYñ5eƒá—­|#2Ø5¾¸¬o.Ø<T“èhf‚úCwø_‘\]"Ú+“WQgX(dô?Â«$«ÀöJòKñ?Ÿoù¿"’ÇÄ½ðÜÃð¨Åj—[î²km;º-µªòƒ‡PvŒ*>G‰ï™¦…‚öƒì$.E{›¨ë'QˆXä(øÌêe-;Ioì¦òñã}­KFi9s¬SR… ¶-¢¤U1:êã”%Þ)MY:9éuNt)KÒCñ–ñûn§1µŠiL,©(›ÆÔ¦-´vøãGˆK`MFåT;Ûû–Ó¤{šÛÍ—ÍB±¤^!ö+,ã­	9«me%ë¿ëO}Q–Ù¤Ã¥%ñÊÊºÇâŽA5¿^Šó•[µ²RËRÉíÄJ.kf\(rGw±Y–vªå$€me<K¶®ˆYTCŠ™–³•Ée€-ói+ºÏæ.} ¥º½©¤kšªà@ñdîÑeÛ8äkñxß®wZ±üH#-#ÄíÈÊµ·3e„¤åGZ-1¸&TWlßÀŸá‡%
´žQ€„Mª!l†_œ+I"ÎfèÐÉd§@¼Á^…©Ÿµàð–iü² —”¬iSâ©ã4}C)œ’gSHS^–,q"s}þ'IE‹2…á¤IO’†oòÊzeK™4¬K™¤•kËxšxQÀÃÉ$Õ`ONŽ[Ã$ÖA³ÙMr'Z: ¶ETT‰º^cÚ2~ÜgfB•É
)ŸÅ&'†ü,BÁ>¨vyø;˜ƒ£*{RŒ´nI_/C×l‰ÍÊÕbÚrZX¯ö
¶ùÌm-ñRÓŠœ{t0ZŸðÂqp»©ñ<S¦ë˜±ý!¤É“är}ã’¸¡ {æ<*eªÛä¦[DÁK €eeòƒ¯hÒ®s3vW“*Œ¬6îC˜‘`*vÏ²†d›û§ÊØ ßJ8}òÚ™N%¢@j_°zß¨7Zªâ™¼È¶¶zlGÓÅaÝy^Õ;bM²¡p,Û—íæ zCi”ÁIÁ*Ÿ„ÚÃŽ­wS¢R¬:-{[ t&~6]EÎt€yâ¿yîX?dNZ¯'•ýeÜñU†=âŽ€=àäæ	%ÛãÃëÓó·;@wðy´ö°7Íe>"ef½{ŸïFÚÖâŽ°Œd®êzÂ•ëXÙ=c»›tø2_ÒŽ©c Æ¦ÊþkgŒíÊwÐ HªPóXJwâ¯É}¡x‰?iå
Å4ùýÊ*ÖN n¼OÜÀëj >$ê´Ô{Xj+² ÓÄè¡–N‡¶£hn¶+<…Qâ€fxBVð3G=" 4;v»Í¥ª
úåö*,0S¾-çŒç´Ch¬4ÉMiMoáNŒ~ÑlÙ³H•ì‘™„îÉØw¢ª[gáüuú¾u‘®2³:< 0”{òE³ùÒàÏI±$bêøýy¸“œŽ•ßbñCQ&.¨Pœk/É,ˆ›TýbâN©øm@KùKçOûŒà^7Ø«SËôXÙíRSCîÁ¡
sŸÿ9(ä"@]I^‚!O·Ø‰ÿB(„ð¥qÁiìr*¯Gò¾ÛØÀH´ÒÂŸºö+ûhðª³ƒ‰®u²¾ 8­A®9“¨6£_U{ñˆƒªƒhŠ6¥€st>ª'Z1ëæ°l@Œ#Øûá[¡¤˜Ò3”’"e³8é©pÿ=Ç×¤DÉã²..g‡Ó:h¶›’~9‰Éœ§lš$F±çT¯P­ƒ2©?ÃúØRÊQCSB\ÑìWƒL–aI™Œ¨×”Õ)…£ 	È‚œSq?6ø3>¾ã@ÀÜ´š :î5æh¤/ÏÉK;¦*¼gÞ¤J‹3²ÚÏA
9Bæœ‡Fyèç·^•¤Ó×pØt™â’BWzMM_Œº€¶$Žmbü½“’V|¹%VzN>¸œ®äTõæào2rP;¦–Ô¿y,ÛŒü`ÁlêyÈ&a¼ù¿¼B~ÌC`bPTÿ²¾„^.5<Eõ°Ÿ8¡ÔQU:eà:rÅÇF	°/Wm¡”øv9VO¼é^¥©@ù‰ó€Wu–ƒÆNÍúô¨âz:-¨­Æ€±hÿg´N:€8N€Lˆ5ÑÊÚ/Ãö™Z©]Rëãhø}¯›Ñ÷´D‰šß¨wÛøkƒ¼„_vcEï¢¿EoÖ=´¬¢/4Îçk*zqeTô`.FEO°-2JsH-«àu¾¼‚Gí/+ÑéJ
ª#ïNÁñvG™mœ/t‚5ÑôtÂ/ÞÿÀð¦K7œ#ò’’½ÈëèEž¤«ë3$Õ…þmTXoÊ­–åMM¸ŒcÐ:Àh·˜ŒºC~=}kY¹’±ÙF{këCaW"½ÒJkãµx•?sT|Ž–rˆ‡UöV-¯º—¤´Eœ8ëJ•lÑšz™ÊYâ§Xmïñ±KêNG¦Úíox:äÁ~¿zÓPäRªªŸ!>%t'¥žIDã©2|ë¢ô¤ñÙ—4-h™¢z¥}þÊG‹Š!‡¸'~Ì™ÕUÁÂú+©
òˆWnJ²¸„®wW˜Á*š7™ON‡†raW¸ƒ%;A?“^yRÊÙe€©/7ÊyÉÂ1âôúüúàŒ\_¿»,ÁUØÓÔüÂ=²vÞu(\ov—`.z%j)b¤ËtÎöûD·¹ö#G„ù,ÚK6î~äd÷uéMJn‰¦$7=µ5áãþËQ\àvÈÙùÕUá=v[Ý–LxÇWV,¼ãa›¯B„Éì„£@‰d<óC×$ŸI‡ÎÌCjw@æyá§o95XË‘`Jÿ|tVÒÊ9FÎŽUfç°†7rNäìÐ¥Ü¼tïqÇ?œO&N° ŽXEŒð‚Ù'Š!òø‘8
ÕþÕ<ÜR¥åDTáÔzHJ`<”=#Ô°VjäõÝN)ä€Æ$´T–?T6BwS2¤!w¹Ï£žˆiÇ<96PìñGa{TÐ½6Q zÒ˜jk=Ù'¬]-ò|tùhÜhœN	w<øä&pOÄ½VˆÜæèïa»–a\ŸÈ9y!ÄÜÂžÜób]N¿?_€$|“  *ÌdYNºmÆ²}Ts=…L%pÿsîä¨[#÷Ál6^ +'‚	‡øåÀðá; Õyì g¸=?»©mÈF²ØN"¾ÍÂä”!¸tdÛÀU¹+ˆ KUƒ]mõf#èT+@P 0˜¸sÐ÷	F¸—†¿°mci¤ ;XÅ–ô,ÆÞ²-¤tÊŠásáŒüóæ3¬Ð0À®l$âw•åW{ U°u	Sø‹YÙO\1ëèÒÍ.ETA»ñ²?ìd
.tÚNoØÍuâåö‡¼NR`±c±#2X«æÏ­L³´¤ïYÒU%žé¦Ì¯®‹Îu£’º..Î~#oÎß½½Î«½Bd	bäúôðßéLÿMrNyBÓgùèøúàôìøˆµ^%¿œÿjî·×‰À8áP¬@a“¡H~ø£ö¾×(×nU’<Mi`‘ÿœMUY»¸2­TLW›+7ÐÕ7³[];T‰¬`TµTCT%˜2x*yD =f°œWŒ(L&Íÿ%ú-m/ÛoI‰þ¼)sG"E´ŠÀÕ´<˜€Va5FÜ¶¨aæñ0¦|^¤XõD¶|Ñzòô="Ã®vÏ¾Õ®º²Œž±¹3G”KRL€Q×&‘«*žµ_8=ÊÏ”®Wq±Õü•uP€nX±DÌ÷o6Q~‡¶>+µŠù×X³©ÛÞÚnõ:kúÂ,ú™Áð¤Fºd¢ÃhÀÏtm;vA­ÁÈñX7è3´“(âe6Ø7=&õÓ²Më´g
ì¯?«îØY¸H›²xa,DfXƒ¯8mdN›/ßY*ÓÅP¥N'B‘2Žª„
uadvJtÙðÜ¸y¯ H·[mÐ¥?µd¡5ð­e¶Èô¥
VNÓ–)ã‰’,ÛÔ–/8Sû|¬¬[L3ÂÃNe\ú¬\aÝMQ P	%'È?*öÉè©Ú·‹ýlÑ?ZôÈ²KíF± œEvš¡¬ ¨˜¹+ZŠnñwXˆ^C´Ã±ŸH­F‘	&ïJøpæM±nÅb<òÓèPäš;0 N¼G_§Ì”®ÊµR‚KtËÓÙÏÉø©õÆû”¤µ\ÌIòŠY´´E@c«Ñªµ!¹a6ÆwöGpªÑØi4ŒðÑ^7\-ïÖV~j«•x.GpXmº¢‘Õt­IZ½a%°EV$é]#¹!éa£¼–oÖ¢¼1éÚ¢ºÃ¶·V’ÆrÞÖ-NòíMÊ·6a¯Sw3YY'“,l–íhRœ®|\s3íei•vVæÝ\œ½tiö´¬¬¾ìúŽ©êº¾þ¬¼ÂGr,Ï›Ô×äï[]i,¹Ÿoa×Ëx%€“ó¬EíN¦fÿ¡8,òP°$I†9=WZGF35h¿6O§ºWˆI1¾¼%ÿB£Mb½¤+9]€´#9ûU[>,ëÖ©­ôE*ÈŠ´]öüLˆ® ?’æª#,4sÜÉÏ¥ÐeAÙ¨7kyUè%XyÎgØÆÆµ¤óÑlh—%[³'@ÚÒ¥Èl–¸òuj•t˜U²sm'eoTÞ4I„ma‹†ÓÎ6­cD=sÇØèE<KG5ó°\.=ö[W7½Í©7I—™Wé&kƒfÙ®õ:Íúvo«Ýko·ºkª,:5ëXÎÉ&ý&5Û¨fV4z~Ö¿Tõ{ÌJJ}›ˆû€áu_	oáÝr´Õ°Î¸ƒòÚÅñÛ£Ó·?Q”by°\¹dß šç°›·b[zÈïøbè_d9«N9Õì}_rÂkµÚýO
K9n'KïM›Óç¿_žüFÏ/~£Ô€ÜäÍùÑÁ™fºïÏ5I!«Ì‡IS™›jè`;‹J™½ê®í^5p³fÇb¯ú†þçÜ¬Î«ölÛ:WD/)“%ÂE½½tªåç/›÷þû—®Ópº,
t©÷ÂQ&Kí„kýìÒÝð¼“M³_Y2¦¤¬ü¨)^’LÌªÊj³Ö¦˜ Y]KÃ$8^©¯¾q"+ l3;Þ‡§µˆ+ ð($Iôu]æ›ñìuòÒ Á;—Web³ÝºÙn¿lØtÒo€±\YOºÒ¬(Â¢‡i±¯áÏa™‹çÅWìÎ4lGÔ²ò1ÄÊ¸F¥Àï)§h”(<LA8¡¥éß×É±.È½³ }A‰¹ÁXY¸ïÖ¥­’Ðd¾“,Ø¬ Ýk=@îT9MÍnn‘{_ü{üªkÆz~öïO£_ýàSX‚¹kÉÊ3ubøn*aV%"P§¸DNoM.×üá5„Žx_ÓŽÑÃl±{œï«²D`íÌ–©LP>Nœ8Ú5C–ÎpcƒxƒeZ:}›T‰d	élØŠ÷îŠ;{qk/~Óù‘°Þ^VøSçÎ»E½zmU8.sT:mÞ²l´;-Ñ²lÅµòh}¾IÎ¢X»-Zï$»¾Äž¹YµÉëS@,êž	«Ø(V„œl³¾r´¤L +¼fNÝ=FÐ/â·aä–áUÚ]xœ±{çŽ™¡üËé…në_ËlC±®”, ¾$ÄLÞµÉQ‚z†™G^ŸäyVFiC7:|¢iy´PÓ[‡Ïrh‘˜ìbÅ¥0vt—‹Z®!ˆÞ½c‘«Â÷R‚ ÒÍý§ÍøìÄyà#Æè«u³”€lÎ%ÜfùïºHHÕòddCÓÐEÕ—ªˆUú^‚¤?9`þÂeÌí“¹iƒjU!—¹´ïxAnáunð+¼ÌÄ»ÊE9HAiß7gåp¥h7ž^1\ã¿"ê3¯Vøå€jê>÷ :™xaÂþsƒ3~Ï3€YšIg ¬mË$ñQaž,Òo%½÷‰áõ+XxQ¡.‡)v‘Úó–Á‘Õ¿ñé/ÉÓÓ¾1ÞJ÷Â8ŸVóÂ±†Ö¯[‚òš X¢Ø¾A—*«³X“$EI”IÑcÕ›Š	Þé›Rb·‰q=#…8ºX;é¹lM¦ÕÉ»³3rqðÓ1¹¸<?9=;&?Ó·¿œ^““ËÓã·GW§6]Œ±kè4Sh0ƒmczGuZ‡íèC†	û†_;kµðY×kY.©¥ýÁSV’–+²Ö5Å†+›¯uâ"°òæÊÕHYo…"Éš™ôÌÎX…é.sÃÆÕ“Z¹ÆblÙó.Ô"£§N/ê¢«&qššW‰®õª`YÁiÆZ&§˜m'“d19èšò¢¦údµÇXƒš{×@6
èp’É¦ü«E‡=ÅVÖbêßÎŒ¼àä˜N†Ù“|B¬‰`"ÞHP ,ÖS]§¯›9±¨îõAÏµµB¹Ž°)#š‘ÚaâsÁ›Þ!±|3kÀæóU—`ò°4 Ìž›˜ANÀ’>+f–x®Eþ^àj^ÈAxæ³lsi[Æ‚#$®0“H‘¼;û³ö²%ÓJy¬™ƒQm[>¨ï¾Öê`aGìÎ“ÑKaÄ¶6	K2fëÅÉ†ÔTª[²¥+Ÿ8úaiPš÷©†ì4V>do™!¥ Á )u',_êµ[GåZ±†Æ¶ZÙ‘e±¦gà­ª©îÃÌgÖ”“ÁtZ“ô5æŒepÝ&“¶ˆxê*+ô‚ÈÙqº_\U½ðú††¯»Þä–„AOxä‰8ãh¯r«»Ê€ÿæïn«ÀÄ*„Œ/Û«Œ?ZÂ6µ?¥~H®íu$ÙKI£míK–¨¤Ýûb‡e6#,ÎÐ®#?™EUÞ:ãt‚Èß]žÑ=>z2óúÑ<pwÔ¥QðÀ”	sUƒ‹dÑè)õcŠ´G:K‰íÂa°0'í…Ù "Þ†U§‰îBµ¾r(.ÔN+p,öØc£ˆ),7²Ùld“%_vs{@ªÀü!|sàoY£¢ÞÕ¤ºéªëÍcu,}'ÝË*i˜Ü½CyŠRÆ«úÜ¼ª‡€‡nµ¶OÞþÇ?H¥¹ÝØz¹ÝkoUt-z´Åó®Xtã!Vu²®›w‹›X)+BÑÖ~G„sÅý?V:Ï¦‡•hùÂäyL’šI”ŸÇI¼ñõÎAç5¶sµ”|n™ÂóÒîkMTgà/±3a9¢ºrþk æp€x´ãýðZ†’Ê¡?bVŠVµ»a6!JŠ¿mÃ¾ÑñVB,ÓU4Dbý'5ür›¡€l¸Û˜‹ÈáÉj‰SD£¸‹ªRDr€=ð‹xCÜ806h/pÃ¦©Ãù‰63ñS©]˜ëÑN1NQò·5ù-<ýÍeŸ!¯¿C6+ûwØ§ÅúS–Îˆ“Æå9=•eÞÆoiÏ¯Ó^+ð&Ìó	è±a'É“ÒC"QˆŒ¬@,…À4GÒP45÷ü]RÊ3ÔúÒA@/æúÀÜîÜ	-•h'çÔu0ðfY-üq6!ÏW	ÒY¨ó–ŒZ¡^ÅrUÙy ©AÃsAŒXøº!ÞoÜ[u‡;.¯&b#¦râ_¿ÅÄ–X+®ÝS›ÛJVljU@#ù&°Öb¸v¿\ÿÃ™ý‚'gÛ’‰ƒ`õ¨%5‹VSÍOw¨5	«?Ü×¶ ¢[ÙÝ©’
©Ê Óëfd÷LÈBR©˜&›ßŒCfª¸hðÈcE¶þÆ8cuP,=Š®ÞÌ3ƒáÙjDíöö‡Ldla	27-C”•‹û]ú~æüPB¿”€,WUm*,PHÈ‹eÊ¶ÇÛfYó²ÇG˜Pùs{¯ ØãoÐõgY›†ˆ>°,Z'ÇSÜÐ0ØëÝšMîÖŒŒ²ªÁ$+ÊèÖ¶¬\}Å&']ËFŠ>m7N\%@ÞMÅÒMX¤¯^)0”<Éd™›mnL§¦N6ÞÑÙ<¥PX:›ÔVäÒTö>ýégý$Œ­äÅéB©ßüæøèôÝÃ»ÕK³´4“€‰E†g²´\rKe?©ðÎ—,üù¨D3Ð£XI8Ä­giZË¨#$7B«K\âÜ9Ûc¸ {vdÉ+ñLsT˜6$ƒ¹m}ÖÊm¸K;ò§nâšùá2ÃF$,pžä0Š(–~ü7FK™?—ŸG¦L¶D§R±Õ¶A¥4:>ÌäRDB#ÚÕèoàð®4:’.g#ëh5ù•˜û‘^!¬¢nQ½`·T_<Ò[žÖ?b[ÆÌ]S?Jï¬hbÚcõ»üÜþñò}óº>-„XlÎÑ£Ä=pßÈ¾ð[ÄV¸0IjÍTÎ«0Ây4«.ñØUäÂs´C­ÝÃ¨w‹†©º™©¼™¼ô¡ÔSÎlEw{ÛífL“æË­Þ ÌÙ†!-h¹Ð˜´o4³´¤ˆn’Òæ ÑSªnË‰Þ•HŸoCˆ|.bôœ—à„ÇÐ&ˆ3n¦|jõ	¥Õ‡zë7±Úªÿt*ƒfÔ)äúÞ¯~äƒV?õ}y}VQ·
¾ŽÍ’ò¸¾†•òvàŸáPQÜ+þrÓþÛãw™¡M‚¥Š q×
¯1xéøQRHÞŒçn­×úWÓ3[p¦¬ˆÔ
F“d$4žØ‰\=ÍÂñ³¦Ò’4ý÷¡fíÍTzÉ) •kó–K.WøÕDóëh4áEÄ›Ìü r¦Q±¶€È01ß(o3öOíeß°ß¨±Ô‚ø´ž›\Z…h óþ‘ÎÆÎ‚Ä%DõÎÅä-¢WààA`}ÏyôWcƒ´×YÕˆ¾²VD~ÊÚLÅƒ“è×ûþÀµB	cu°)±4ÁâƒELÂÄÀ${Døæ¡7Tñwÿ¥£QÊ™‚¹h·¥½o|0ZSÙ	LÝ{qÖO§}èf{‡“ªC³s›â×Õ±™á:ù«øBvÎlÿ	ï<rg>0¬Ü«­ž|öC#UÓ8”ýL‹Mõ ¯ßVa¬õõ¸p5ŽSfþ˜<œ›%ì„
ØÖ/Uµç“ ðw²UuØ?O;+¦Áœ5Í…#
¥î'Ä¹w¼¸Áá‘ß¯ðÿ›RAŠ	+D˜Æ•®«*Nk‹Â€Qêù §G¶ƒãÇ„Pû#t·°RÒ‹˜e},56(ôNÔ‘ª[nQýøc7ny)›	ƒ{
 €w	T¾·0rèÜ¥ãÆ]Gõ‘ã…ïµ¦«MN%~ˆ)j<yªÐ[2«BgUaA'{‘©ÝMå [x0A2a‘D“–&TBÇgFÅ,Ä‚ÒW‰j²Ã$åÙ(.& „'b/€m´v<ŠI×¹aÊ©H“ì1+>[æ%Þ@
§ó[£ŽsˆdL°Ž\2àºU‚ç÷¶M›Ó€–?^ íÁ*DlÛéÆ;Ó~úà<Ä¡××°óíæ[úæ¾]£¾imÂ3¶Oß“ÿ8{L®ŽÏŽ¯Ï/::r•Ú(¦<êKÚZ÷?ü©kÔH—µ™ÑoÁ—Ø„·ð£åBu`	å	PàI4V1ƒKc0ßPÑFÌ±–ëõOsÒ“V,£,Ù·O7U¬dŽå±8ßQf¤2ÖéµÝâ!LE—âTÖõqŒ¨.Ð )›¿oÞ‚ÂA°€Å 6í&¨/Äl1ñ)ÙõJŽrZVÜ¥ú"­/-+]¡}°£4‰a´“üW–®ðšÑ•´²´p*¾h‡À
Vƒ_×·vŽå´œç}äÚ»ëÃµ/÷…vêŠ¾ÛMrXä”¸Ï,Z	º\àUÁ¡Ý†MÀ½O±Ò">ŸpåF!•þTbÿû° æhª$—ë(ÔAß¢pƒWÚÚ ‘&'øäFÄ½Ã€Ëg‹ùr×ô±ŒXLÀé¹ƒNÁÛÏ`9o›
V9¥ ”·ÁØ=Ÿ¹Sqcší¦[…½J•qý.c¶ƒÆ‡IýÇ38ÔI7™ó	…ÖY‚ò)µ£ˆ¦O`Ø;7î¸°Ü0ï,…ÝPíÑ¦²/ÆnìnÒJl4‹Ó
j 6 Ì(I Dåm%r;0Lä9u¸–Œ½²MÐÖ¥x‹Í<üÙEàÏœ[º·²AÏþ¤J
¨%Ù`Ùn>/›¸ÆÊš6s;—9$ŽkË¶1im¾r»ºí'Éþ$‰!­gšæÚc6Îå•0vHV€Cü°ûòus;6ÒjÒÙàwÐ"%µ¢…ÃgB½NÏ”¦Ï‹S6C;,k¥÷i?6OýPB5M»Ôúæ„ZDÈ–î¾iH‰1‹ôÔQç`»•äÆ~ßì4»Í—Ó"%RqóPZsz2ˆ’W›JJ­w5ð7DÊƒr1˜F 9J®1ã¬P_
zêìÊœ°¨)mBeµê÷|mö*W«˜ºVsØûr™*Yd]ÓLáÒLM—†A¡ 6®d¹Ø§8)ìYHZ'#ž$ÎRAGŸA‰WGÂ¬B«_&·W£;­„¼`ˆóÑØåòŒtõDS4'µùþ*f«) åštlIµ¥s¼5ŸIœKÀÃãÊ¾	àüÍ ˜ápyÈè¥‡üš}&K·˜É¢šÉKfQ¥²`]âÇî­3ÆËnÖÉO.Ü‚i0w@š9š¸ÑÈÇVf¦JuÜÂ££Ï`ò÷ ¬êd×!£ÀîU¾¯H9àÖÑICl‹’+Cò²9Ä¨¤3ÚMfâîî¦£d*ç‡ü¬5uuQCÜí±§õë2dãxÏ¦c'Ä€Ê‚ÃÄ°Íü¶#—¸¹ÜYmtXú6¥š§¡®kô°új2¨_ZÆbÞã‘oïÀâØíìèS—ONŽ¶Œ~Ò8ÜÆSÊea¥Â–Y®Þ½oüWÇ[~noœj«ÛÝh5»F½µþa™5ºr1˜bÙ’*	Z•ãbìD´šÀìÌ9VûjÄÇ¨ºÏb›’ëË”Xz9žñKfÉm…´à¶] ÷Òwôà#ñÓUž‘cSøÊ¤‹”.N&„"F‰Æ‚sŠvâ~Ò6^´úpìÜü}t|sßÞ´QCâa,¼mê»‹¾½räßOãtëÖ’-oVoj¼Áïüºä>å³° ÷•%†ÏúêíÓ}c’^¹o=^3žfòi7¼™__VÑÞG·ÑG°Rn°W‰gP!'rj‘F00LýwÎx(¯¨Ö›,šº5? 0éøµU·9Á­ÕéˆzÿlQ) Ü(Ôþ–m6ôçáŽ?hƒ?ä:"ØÊô&Õ/_º¡½¢dâŒ!Ÿ1àÉw{{4xoCÔ¸£AQ/6jÅ 
]£¢k$ÿê8J”ÄŸ´“üdÌ™ÆvÁ¯ÙàÊµcü!ˆ›ÀÉ`ž8žEˆ€O¹–‹§LùÅ@,$Âü½ú—Q=‘%Á#Ó¹^…_ã[åÃCÊ„WÍhgé(ÌBÛ ­F£apØ«/ê|ùbxhÖ Í.Rq’&[©+‘jº£í
Æ‰`ˆHìÖÑ@[Ë
®NNýÍÿÞ[¤‡Îê€y/is,©`ei—6ÃrÆäß;äûƒÜŸq
™½Ûós'-ã8Õ4ë+ï9= ¯'ZdT°é½¦ù©?~L2³Þv¹·OåÁ¬×’ù§EŸw¦Ý;âb¨k	Aµž²þw@ø2#ÏÜ)mËÎîåÊ»–:pÿN‚xlÁ÷#útL£®±šÕ‹Ì³ñ‰5å£@Åú}áÇdºšÈß%Ë¹.KI½0-îç12-{U®àêp0æ²Â:=cexlMáQV{ÔM¯@üT‚6«,rÉÂ„Lµíjp5íàÉ¡…Äo¢{Ü	bÆ‚Ä·ÔÉñôïþ‚Œ€IBŒ½‰…Ì‹NûNÓžfƒ ôÏqXG0šU.¡s¹ù/Lˆk­0)ê6•íÎsïëäzçáœ&DÎ'7$­N­³M#TédJÏ%ÃŠ“¹wBßR'¼‚VŸ" Mt`­£(tPow°_ªÝ<Öø&>ÝMðbI­7íô5ôJ
lq%h%67³ÏQ×fì??rR±Å‚ó»,žýðÉ]K–]ßFÚ&«AîŒÁmÎ õ{wþ½Þ†P§<'È ü5àìâ,e‡#ßú÷\ZÆWN”;T*Î /¡è«¯ R3°\¼”)‹›ëmoâ¿ï(Óº¤Lk9Gç2;`õS­ÝK_Ïý˜™Æ³+ÄeÛôeö~Ä•î/´…¨ãç6#¡“]Âyâ˜àþ¥=˜Üû8ã‹zkZâTpÞú¬ ™3òB§úX¯×Å7H2òÉz+Ÿ¾”»ò³x&ÿ«ãæ™ó­ &Ìúó`f<ð¿,bZmÃš=8ÏÚ¨M2GMªúÍÌ%0ü'%º½[±…RÌ¿ñö–ŽoÜ‰ý‚[£¸éK÷oµ”$kO÷ÏÎõAöM-ßLÖ.#qªÓ7µuëÑÀŸQó‘}AåX•}ü{w“])óô‰;¡Ï³—álÕ ²Oÿ±x~w“­ýŠøJR)©TáLžhµ<Sê0ùø-0%¶´c:r6\iY¾4p6á!æ;ŠŒI™jodLv¬i%ÌÉðB™—åO0jIÕÃ„YQ«Uök5+ÖÖæA UÇhÚêãØÞF£Òn>mêïÄ£ŸO‘}„é×`Íj/½›OŸbÈáoûôïäÕ¦
'Îd!$ÿä3åùÌ0úGŸ“ÓLðòõ!ã5h«ç6tÜoœß4[~C?àOŽóÏÌq~s+ƒkY†³€ñÿä7êCÆo(ÌVÏnpØoÛ4vcþÑo#{D¨½Ÿxƒø]]'5âÁÿÍíÿF67±•l±,¥æ6}4$Î­o~¯ò“a‚l±ø2Ò_ö9Ò[ÁÁ°Ïæ‹+£°íógü‰±›ÿýêüm=¤å‘€©VE¤]§;š¹h”šˆëë†8É8HPK†ÐLY)m4oŒÑ´Š3c¨«È0€Ó¾@ÜT?ÞxwÎÃïñ,Ç­žß_<ÊNŸ>näÁ”£±ã	‹:¥E¯žÔüèÁ(nàßœßüVç‘Qyc-ÑvŠšUÌ™
<†ËêçÔÜ¬Óø?ÜÒ?ñ7 *¬Z­ûJò=òû—î¾´PVúkŒxÍG§ï°ª-+ìÞÈ÷‹6Ìc¤~v©_ßb„Ø“'qZ<}ãÑèHŠ'–¿Qb“å ¿ÉqÎâqÀüŽþwÓ ‘ ÿ¥ü¬ÅóOÑ•lõ©_]7=fŒ3£Ìwˆ3]X„šÇæ÷N0­VZÃœÞ¡7vYˆ8§u|à7£gc¦òVJåWnp‡ûþÇW×äàâte´ùŸ@—ßãôYdö Qœ®ñ&‹ÊÙl¡‹LumÓ™y›Hæ›V›lU×¬žeGïµ‹ó«ë5”¹a¸CmêI’5,}_Y»^ÌÜ5x3›y`ÖæßgmÞIÈÓ*á+xñÚÀÏ¼?è00êÇ×@]4ð‘ÞôôpfødÄe@šö@cyYd3ïUðÓUpÔçòÔ²Œé™\x|øÙœØÀ]-0ë[à¤ÀÃVÂC—½¸D*Ì*a²ë+Ùø*ªë~‘ÆÏ~§-â®üPuN:£¦\[pàlÏ·d¾­¤¥Q©N¸Y¾ù[÷žÝÂÔ’Àà/V´[ˆ°“Ï§DžoÒ‹WOWðØ	ÎÆº)XZBÎÃÈªrKÂsßŠsMz0c~Ù@F3ñwÈwø[þò´®­å(ÉxÈ7–›D™Š:Ü©jLÈÅç¾xÌ šM.ŸïP(ûXDw~‡´ì¯x­ƒ©†té”~øÁ\’‹ùE“ì‘?CòÄÂ;²]Ú–±Ët‚Œ[×e*à‹U†ÉŒ­™uMäýK·ïâ§L,Æn„ˆÄAAÂ)ÃPTMïdþò¤àM‡	%àÏß*!àÜ¾-: 3ú×$ƒ”™9…t€ 	&ôè.\g{M,™šÊÛ]Åªñ×QÏMdµqÙ +¬‡ó-„^–®‘ó¬Š1†Ær˜«
w\¡Ï¼)ð¿ï±jr4›î«!µd2%TÂ$DO§{|Š;ÙÍí­­“V¶•x¯wrÜÍD6+,“$ÊåídËúf‘UpŽÇ²EÚŸÏ>.ùtŠrÍ˜¿3“h5_.m/›Ö4¶kJ¹ÞÝfcÓ» +t+–^û{•iVþ«ìïÎœhD†Þx¼WánÇC|m…ö*oZ­z·Gš­z«ÛoÔê[ÛµzcK µkõVOÿÜlÝuê­Þ¨[ÙêÃY¸½ÞÆ{ð¼îj’v½Ý¼kÕ·¶F ¥­~«ÞØ†[^¶àBk»Ö©ouØOÛõÆË?”Åy}ßîlwÛlJÍiµa€—[ðÝz§Wó“láÃ­z¯7ÆeØªá«úxNáÚ0«F®m5ÙO­úv4jÝzë%N¤]ëÕ›=˜H·ýs«ÞÜ†¹nwÛõ—/I$u^°Ep|{q‚'¯_6ºl‚]x’4;ð!ŽVgPowá-mö|üË°ÞlÃ™N;>ñË@–¾úO“íz·K`®ÿm…x¶]ïÀY¸‰t`Îc˜$>«´Ý„÷´Š;>è´ÛÝrÝz{»ß„;vm ®n×ÎuÆíz³[Ã¿›[ø"œ~	€g !p1,0€NgÏözÖ¯o#ø{¸äž$,›Þ& §F5YuÙíÖq©}ãÌfiàN€ÐýÒµ>Ð´?ù=í¿Ï½ºLóÎ‡Þíô|Ñ}]å­SçÎ»Å‚Ê¦Êó¤ð-³R°ý˜™Q¾‚:G/“+ÛãC¦xgz¶•T¢àgòÊM‘™åÕa(­:"GˆÝ3ÿ@©Q’7(õUaï­LYÊþ,ñç‘ZmI‘7Q†·ëùí§GæV»`>Ùkç†&ÍV¼éÖ—æÌ
¬Å$™éV|âMk<ŽhvSƒÀZ>rÅEßÛ9ó’éœ‡3›<°îè
èçNŒ6T¢ZÌBÊ+·êiÊF¼¯µ[ ÿà¯dìg”EßÅM¹‹ñ<ŒÍÏfC†tq;rmÍ	›¡’ŠI XÍÙ¡MäàßA ¿¦*‚@qôG4Ÿ?‹Ô1œF‡O£“™FV‹±œFnÕÒ÷Üø@Süâ uá˜3Å	¡‚%ð#àšˆ:iQaWøô¶Ê•P¦À½Þg ¹¨+Ä°;j×¤µ-<”µ‡ûùšsfšÛ_{wŽó b1JTö/œ šºA8òfœ9b¡*ÀÜ‰âCG-ÕwJê†ï4àOlgpÁ’+™Â¹ö¤lÃæëŽ±"÷vã/¤ïO&-ªE›™¹ æ|‹ƒ¾ëp ï¢ËÌç@Q|˜´‡F7‘:È³ÎK×åZårNõŽ!;›Íh'˜ÛWug"ÉÂâëzä…´4¸~Ó1Ó#ù }·8F¶Ì€Hn öLœÊV]ß=ÙTîOíÜK4¬µÍäóÔª›r#OšœvF´¦$c›¡µÛÄ?…ý=É3˜¹E™Æou+É¶œÜ³£"‰KÄv^ôFá:õ|UÈÇâb€â±iôå9`•j5I^Þá2Wç7lË³ÚØ ]ìŠù+³:¡[Å¢ìkï®Ž/×ÖÉbG{ú# vàOªØÆ¬üÜÿè‚9.¶öÇÞìÆw‚Aý> >{ËYýøâñÞƒ!ïëhBàŠÕ}eÞôévxñÈ?UÛ=·_}‰ü( eƒ¦Ÿ b3Ïhö¨Ë¢oÜ×@@_ÞË Ð}îs¡®¥ÅRÃãžþl4§÷!„KSƒ\Ð?Ç @sh…ÇPnX˜±„á‚…©ý´?Éd°ÿªôj™×ò}³* Ô	–h °‚-w’H+#‚”ÞfMÞö‚þ%íæ&9ñ¦Î”º8q±áÒÃ©¬#£ö´%ýµ Á:‹ý§ mh[ãØÕQhQŸå”e
•X¢þ{"7¼Ö‡’¥ÿâ57”ds(6Ï–)Çte·,²^Jv®—Tub»Åh	Õ‰ÈGÜvÜþœm£[KWE3ô*`ÓÄ™U«ÑÃñTºiÊ[é÷èÁòÜ¢Lp<<Á?ÑCÝ£2~À¼aäLføûÇùôÓÔ¿Ÿò[?jJÙÒÃ“¥ˆKP±4èÈÜi~9³ËËži6,z¹K6ÛŽÀŽ€ù\?TÝäGJ­¯È±~‡ýªMf)™`†åoËî·Ù4s·ªj,>&LV+ù–	HÌôÌ®4ÈÍF—PÄê=¬”ßeµ«N›—uŽ:'â-üŒ1@8”Óà<K°ç±zèæ>¼ž_zãMs×¬z’[5O–Åö;vG:d7‚’@ ™EO+ïoå2 9džÈqÌ	A‚v¬'¤aÁòJÇióaEÍã0b³Â sPÓŸ´ìXœŠÄmo“eL~XÍf–!5Qßa`Ùæ®na­PÞbiWÕ¤ëœ+VÛ¶ˆŒõ~¤×ÖžYÈ¥sH­¤þdUÝ™à6òrÐ>?e[|›©Ï/í²Z—w§ó>§nläˆèõme•$CùãÌ`	…Ú•‡þd6v#I1d»"¹Ša/s³SžXjÔ¤s]ÅSo‚NÐÙ|ºê¢ÌÙ³èõZœpäH‚ÓA#gH¸h®M4V¶EY³š¥È	¨r‹aY¯<{” yÂ¨>4”2Ï_ùjkÇÇ£T¿ÓWˆåÃÛõÐ¤ÝÆøºV¬»Fy%6cF5?$äâMI8©?Ô0K›ïpæõÙ _¶bGùiÝð=øZà!L9[çh´ÃTCÆ/6c¢ÕkXHÚ›îÄõ htJªÜñÓÖÜTî‰gž"w/)¹«!÷Vè½²ÿ@øÞYÐžh­Ùb£j2™`³Žn#„© ,›ÍZ)£õi—ç+‚üÊýÏ9q—¼õî—†7Ú¨eT¾çª†O@\"i ¥S8atÁ¬–µ–*ý¬‡Ñû—Ë/Öù
BÝº¸hÏ]¯l§Qu§
ûMà:Ÿ¨ÍžßIË·fž‡Ï´Ž88ÝzÞZ±üä%jÈ›š’ˆz	p"ÛõÆÐ†1?ÙV%›ý£H'…>âç—€p9Ûéð\£`Û«^Á7_¡YýÊW#Ó½Ün5R |Ýõ°Ðæ.íë¬«òTåƒ*FSlz(oÈüšîŽ`L6myu|yzrzxp}zþ–¼9?:8Â²C¡QD‡•&qe¥?jï{â’«ÒMCàÏ‘¸÷•ÁN;ß^›÷Š˜–Ú‰‰àFü/:gó¤o´údÄ}»•²!ŸyR$¹8ÿÌ&Qv½\‹ùVÑpTìŒÉÂXÆ·Å×T Uö3Í»@{Dòd$3¬M­™z²|'%~1("×$ÑþÛÀÉ¾´•óoUößÍÆ¾3 I«²#Pæ'ðsáé æ†B•}ÞÄ;Þüà¬h3ÖÈzÊâ·Ð€Þ÷Ç™á3Î¸^`|23N¥òMšL÷Š#ÞQ§˜HQ&UågUT¢{jXÖÇ™õ\¦åê`™°¤ÁIõ À8%§Gëš,*]|c|ÅŽ|6¿®À22qpqÁz7»[eç=ˆEôeú¹SÏ¤sÌ´¾uë·uòf@~vBg*¿Ÿ×)û´è³ðU´¿ôfY¹gOÒ4J>Ê‰‡±«.'qn)Ö×Ç·˜¬¢C4]9Áo‘¿ +rÀ¶a-lÅ  ž‰&l<’3(r\QÄ7eë¾==ªì¿s/OÈ¡ôå÷r#\ÀÍü ûêðŸJ=~x´Ýî™ZF²2wB7˜ºÀŸÊi÷Å‰  úv>¹Ñvfø×â´ÇT—¸L)\,IˆñÙDÄ†Y-¯•ãj'X–†iGòbJl•ÒP&hH¢m-…Ó =€‘+TÇ@;=R[–úÈœº?ÄaOÿ/Ýa\3ìF ö?U5f_íG BÆxžøÍN8Jª	HÐ?	0°Ê5‘ç'ç)¤(5’œ|è	ËÉXIÒ/ÖÄÿ0ÞÁØ†ÚU0ætï1×ŒõÄ^])Rü6»ˆ³ìBÕÝ kÞ€.üX`N¿ïÎ¢½Š7qnÝÍ¿jã¥Êeˆ£N£ßa2líW)q˜öÐn6„úÂbTÈ³wx@À7pÃÑá½ÂÝLå€Í®¤<E!!Wš¿uéR^J(P¹çlPƒsD!F(›p„#ü+³o-ÖfB/š9°'›µ€ÔvggÄ;ñ2Ã”›ü«½aÛCÕbe-ZaéødJ¬œfÙÔŒ±@yFè®7¹%aÐß{|wyVÇÆ®‘Ë<ùð{57\Öc*ìMG‚½ÃbÞÎ˜È}:NSQ©ïr¯2vþXh)Dñ¹zWÝ7$;_ãÝ¢³”ä¼Aÿœ+œ"XŸ%7qÑŸ!6)Îü)5W*5¦
MåŒ¾]¡i¿pÏ•™”ìV&2q´HLæ_J`^¹ã¡çÒÆò+“— îš“tÕw¦S7¨®…ô-k
K~XÈ%²?åÒªäR¸H¶ÿ)˜”3â‚)„Q¾±tí|rqwèÒ”{g\jŸ'£8	®HF±Ñž+£Ø×~%=iØƒ¥dî¢ )Æî$WXpÝÿ  ÿÿì½ÝvÛH².ø*i¶»I") ü¥±å%KrÙ³í²Ž¥ªêÞZš2HBv‘ ,©t4k_ës1—suÞ`^©Ÿd"òH ™‰%¹ªwÕm‘ HdFÆ_F|!»Å³’°".í+Ãg9¾ChÏ,!W–œ—q¸øµ£Î1T‹ÍRdb¸> &WqÀvÄÏQÇE@M‰Ûã"žø1ßHŸÝ’/aŽgA—EQLþ~åÏpßžZ(	H]¸˜àÕl Ÿpº1ß[1+%Á¬™]R½5vb9<+n½b¦Ç³âAá$s‚äÏQ%O>ÅW&?QMðéXýý*Œƒ)ø¥Zð=ìƒjm(Na±£äßþ¶|5ž‡«ÂhñçõÅ<°ªW8¿š!¬%ÐÓ¨Ö%Aœ„	V¸ À5Ò’¶r`±_„ut´ùÆ ^±—Ë6Å¹Ž®fSÌÍ¡Õ†Æ8ŽŠŒ\qP&0<ÌÔ‘K»õR‹º€Y?‡s ö’ÃXðœ®&B¶_$/Ýb/6¿Á«¿Zl:)U%ÚcxÆåjµLv67¿„~Wüî$šƒJäÜ Gz…<ãå»ƒï˜g­£p5ŸßÒ9Ó>WAýgP[D×s¶ŽìŠF¹ðÐ¶ID Áe°@Ž¨Ö]ï5Õ®G’§‘ëÊÀŒêÈØ‘*ÆTWƒÑ×cQa¡$ýnZ ç«pÚÔ´#/MMm-0ÊUapºÑ¯du#<spM)«kb b‚¬…ã
Á"
´À€æÑGY"& Ÿ‡ƒÑÚè²ÂiŒë·îîuè$Ú¾³–s	P±H€ÒÃúÈüüs.4OdOíÄ3¡m§âïðýhÅâîÒtš2@l}¡¶}Lû×j\-¾Ð§8×Á!’`\Q×ó|sbAhŸ^€[É½*
-VH˜ì°¯¢ÐÔ¼ŽJ¶¥E_t3$J¼p‰‹dH)«ºh”GiZ°20$šÐe3=‡Im‚þ….42ùžœ‡ ÍÏt¢R!põ¯_~y€€Œzyæ._ª.¶ÒÏYb5O
	Úç¦ qSÀCàˆ7§Î/ðë/xÉ/ñÅØoyƒAÛsm§ít½jÐzý¼ø˜‡(Œó²„
æ÷*ê¨”^EÓì[·Ûm@Sü
•	¾QŠÕT†÷–û¸î?~z¿÷7ò~ï‡ïÜûþ¾?Ü×Gx¿÷W û|Ý0oìéI´$¯ý˜ù×ög¬Œ×LAÏ©<AHx½(ðÜÕGt5lç‹¿>0¼lçXÆhÛ!‹V‡^`‡aäæ`Yh¥Çr@¶µ-hû˜ÅÌ ]RŒÎ7KQað>P§Ê¨ÈxÆH&_¼"ë“ZJÀå¹Ëhx¥þ!ªo@kÊª¤ªª*®Ag1Öb,–Eµ«¶j® 8ã¯¼CÒ¡Ò^­W€äo‘áýJRŸJ|¬a†Œ>í+ìiŸg¯‡¨Næ02”Ü®/¡KêUˆúaìhsì¡ôL
äÌH5ÛŒ`_å«Õè¨Ú¡¯vv"o¹îŒòè,9NÂÖìùÌ¿0Ô¼P7.²cüUÊ³=ô¦±†I¯oØj\´.Ñ²KûÔsDõ!GVdðÀ4§¯Òµ-Ü{zy#:’+úÓWaóçZ£õj}Ü
«òÚÂ… íüñ‡“O«R€ä:4ÿ*ú9%N‡#Ît	…sø1pWÕPQLë­ånz„ac¡“óÊ7½ülCÐäHEhÚ ustz.ì[ô”Í9UÖËwT³Ëu±¤øu`$Ý<íeŒp‘4t=©ÎN¡_t2é‹„h›±jfòË'ÄÝb…×‰Ç¨ó7bï§)ªèô}ùžV>½¼nËúhykôè;eÍ'®¿”{ÒlÂÙû‡%[þ^šuE†c…bËXÖ»ÃãÒvÏÃ,õÖÇsÒ]EïÁjå¼Ýp1™]Mƒ¤•£‚üEŠd¦=ó{ÖQ ù­FõÙRqæöÆ¨«ÈHw}™´G+¢>•>æÉúªqˆêp©ÆŠ“=†¦U•(nO:íŠ’ªÃ5$Zm© åS‰â‹qËi{ŽÛv½Ñ†Ò1Žõ¥wµ®»Q’‚†^!Ÿ¿¤ÿòÆr={ÛØ­®RPþáwÔ™¼7{ /üx¤Ö•àçI8€T€‰…×Éuôfïx,[îÃåÖï oÓ9÷3ššë˜LÏ\—O„PªÐpÍWNîUîVb)+q±_æº:Yq%.w¢<E,h´"‚iˆLÃRÐR-œÙyFß¤ŽÂBy|³©løõ4%žX%’J’SÓ€‰ò
žC	Ú›%©“4ˆ$+ÌX‚n Í—ƒUäø®tÁ©k›œz#‡Â¼*‡jÿ2BSÌç¯èB‹yådÚ5O½<ÿ‰*x@8Z'_^O˜Œù)W¿ÝªdË8VWË“ žãæÓÞryrîÛ–E«ô©Ò‡L…[;U8ÌÌ–ß.ªQöÌ:ÎPß²öÅŠ„biÉkº¼^¿A.ô ³ÏŠê’¼
!M÷çk³XeR^±O|ÆçÄ_‚ï#ŸýPPÓÓÅå$Þ4˜}÷Ð™^ƒÜ¾l¸nCtÛeÝÆÓñ}n|‹@óÁyE,š¸E\÷§-@ß+2çÎÜÄkLåMZ”jpJÂ%Â„ŠS.„ÀB7`á–š+îUÒ
ÔÀ°”E§ÑÝ½Œ_ ÷€fUb-±èz”}E³€äÐ¦_o×Ñ?õÅ÷ˆ-G‘Ô&ªÒ´šÉ<iu&êLßøLÊg.b0'ÿuMúº‰U`¡ÖawÛûÒó=â1vÑ¡Rá‡íîÖ6ÿ—ý0ê{^×ÙÂ³öûe
fùz¼oÚÚK'ý®ëïRz>ª»åaÉ^¬BKÿuèX¿¶;ÂD×X‰W×}EwÉvwÛõAÏƒÿ±†d8s»–òõ¶ä'À-ôÞò3ð]¹ƒbH~{
~™*nyüá89ñhÌòWæ¨¾+À§?ƒ¶—$toúÄ/iÄè7ŽYÅ1oŒáù×a™ÙûÊ<³Oú—îpâv]ìén#úâzË\wð{Î¼íO:ôšŽçàï§áÄÁSø¯‘8Ì2šÝâî¡ÎÌºîµ±ˆyÛíøD/ä—ügG4 ûiÒ1–h [Ç`jÞ•CÆïÆ“¬nQœÄ4®¼×Å«íuÑà1oÎ±wŽÊM[Ø‘__àÜO±¥9G°ÉrÁs6Éê2LÈÿÄfŒîÝR·@^»‡7Rç˜³HóÎodw/ÙÏqÛ\=S·£•|uB ··¨{ë»Õ¹ÿßãã™9á2Ëô×ß³´,ô)ÃxaYÆ†BB)ó¹¬S¸*’Ë£:‚Ž„@ëg’M ‹Rl§zéãbÌKQä Y†£ƒßI—©1ƒÎ.ƒÕ8ýlª|ARhÌÔ‹Ý¢+Ù:(Å®†4Qº*±Â”!FåAóÖ™¿ò,§Mrûêáæ+k¸y˜üœ ª/%Ut¾ºÝþâÊŸ‘CºC÷oÁ­²[ï|Í@ñËUBÂ—ºÈö	©b¸‹kâ8˜ÄÁêU³²zfÇ5»ÝnS nš
mPo¦K÷ò¼_/ ];Í˜¼.®ÔQŽõË¤–k¢’²üE¿ÌcÉß'Àµ‘ÊÛy4F\Cß(;é}òEÎ0A1ý@Q\ö¹›tP5†ç©ë­·T—´´ëÑ%†Ubx*»/¤¿‘ñ–ò\}›®\zº`k
ÔÏeŒI÷ß¹Õyê&LRqTb“ŠƒGJ—¡£iÂò‡*jê$w!lª3ŸÖæéÿåt¶;¤µq¶yÑ&Ífq³¾xäÂÔZƒÁ`ƒ8ŽÓÿ;æ‚Ÿ*êtÀJGÏp»‘£19äÂ}+8Ö«àêRwØ&2‚¢UþVŽ{á[Ò¦7ÔK÷uì¢
‡Œ
¯%/-4·eTÏ
¦»ãw;i?w¤l¨ô\9-ªDµdÑq·¯Ó"ÆeµE˜ Fg]–ƒ²ŠÒÊM}»ŠÒú}šNcçªêy™«
?ÿ\UY@Á9OU./A;=ùbï…‹v<}È\@ÚRí´=rÕË#Ã¨½Hë«ÐU¼²:GŠåÜw¢ØLàõ;Ñj‰YðÅ|w]Jz CX ÷†L <
<]›ÄS—uÓÄ·'6êócæ¹|dŽ\yÊ/³–¯Ð¼‚fRõf±©—öøm3A[A½ lCˆ°&l·(×ºÎ¡ÉaæW—v¦á?]åXSç6,¥« ,¶Ïš$èµ£èyQÝí*kÚëå©îÄèKÐËUWòœÊ'e Õ…”€ŠØ&ûìîÔm{í^»ß´‡g,þ=ÔD¾óGVX 4þ3˜Îó»Pw-+Ceîß¼tçjùODÙ~ÈmêÙêú2ñç#õŒú½*—ÅÎ²ú©ÿY|e&õ6AÉ*3‰þÆyY¨·`˜û…Å9‡äšRF³§,p#Yz~?œ€uŽg˜Cê'äíÉ‡÷Û—ÿdêë	¶³A[ïÒ1mÅ›ž5»ÆZKm³>¿SB4ÓÆÎV(&ÍÓÚhåxd,7’Ïí’vÏëõz£³²%,%EðÅLd{‘m¨G¢Úˆl¤ƒœ¶.+5‘2hc”F±H€¸uÿ~`&ºl£xo6k5)w<Í˜VÃmœé°yà˜´eh³ÑÐ^”>ˆ=>ôAUd<¸b¡Ó•Â/U¬².ÛËá_£œ“y&YRµøé+}÷’˜^ÉqôËÖ ÌšÆ9L~òg!•Ñ\mæœ~:ªí&õ×W£¨›xDvúxr„zO÷>´*Æ6L’+„-k¾¿øþ K¼9ºFwJHÂ6Àü^ÕŒ?»ˆâpu9‡¿Ýs«®§
@²C†×-A5Eã¦çT\˜ÐÝÉÆØH:Fy`ôŠ²¹™³•“ƒs„¤"„Y+°ñ;Hßmr.@<ï>ŽAë!œgLùOÆµ™#{Ô3 £N0!”.®\¯×›¹s=šô{Ó)âß.aáêV^UèŽÕÃS#š±‡ÀÊáªX :àŒ&Îh–3ž	ä³Ç©çpÁ|{1ÛÕ×ã2çø±‚LSò”(•¼Ê>‹¼6Û b
zå½Ùãï£‡˜”ïP¥lUÜ’Ëæ2]›‡5S±ÈW¤QŠù&ëÿ³‘FY2êMªú˜»§ÁìyªHO›:j³r¸eï” g8Ž(Ú|æÇh¥—½²C!nL}‘{ÿvyT&®JŽÅÂ¹êÒÒtI§ÕÃSïLRExˆ¤ :ÎØÙrÊ
b)àL¯šÍäüToC–®Ñ!¹ä/„-–zê¤mf’ä3xVÄev¶$óüÆ¨Æz?§‹æ*ÝèEŸ’À«TýÕzŸù´á4ÄÔK<§»ªŸô<š=`
†•ÿk½ªÜvÉoÞ}ú@ŽÞ~üáçâ¶>ìì¿}÷Ã÷äð¯{û'äxÿÓááÇo?žƒÃãwßÿ°QL×¥ŽŸ}¶Ž-òvÏÃ
œ&ín¥I»æ³~†?Ð’@Ó8ZbQŒÅŸEÀTˆèSúW@W2ðy¨Jxeg+Ïâë{™·Ã=ô•·Ã;è9½mi	z#¼‡¯9ôsCâdtø$sTâã/;§ÛÞ—ËÂªÌìRæ—ºÉ*ZÁXøôuó%‘
)®Æ€cÃíù>‰qóþþÖQd‚VÃ_ë-C.KKeªù[hêÿ<%ˆÍ÷È b˜Ù˜j£R\Ïl-†«ºRåÊÏÑÕ6¹„ÿËyHVÆôÙ	ë:zHÀJ‚/ÿUBu/9lŒ8’%:ãÁäu4½­¤±%+ºUu-/sÇÔ6jÑP#ïºj¿ß«w@¾Gé»÷Å_ù1ùŽÎƒØ‡ßc–a‘…ðÅ_^†e-T}ø~Á£ðÏü]ž$ ÛAÆÛÜÎ,qü(¿¯ÌŸE9iÆ¯ò;¸7óÙ"yIA®w67¯¯¯»×½n_l[up—Ó€jœ'úÐÅ`Â¨MCZé^=n¼]¯~,.&áôeãZyøÓÞôØ}Ùpn[üàÀ‡ïecDÏÀ‡m8cSFG¢ósXù0zÆèhIw®_6@Ú¿ÙÞïW„æ›è•Û8ôßÔjc8(µ±‡a;uÚ (42<èï÷]c#/6ó£m¸R3-È Òiqø´xbZ¶>-£NË¡3ªªW“o¢_Ò×½šC:*¶1:{œ–Þ¡·å™±Ÿ¾Ìt\jÍõ°æX;bv=1»éš“KßqýÙuœÃáÖ°Þ¢+ÎXW£A½™Ù*·1ÚÞzýÀÙuœþAßLf[t	”Oáü-¨j3T×Øôg‡uí¦çõö›áþ;÷‘Å|ÁEÝíG¨B³fæ[cèÜYÊ§¾µ£ FÇâƒ@"èã—‹ _5bçÁˆÕc°7E9Ü Sh´/4=¾„T]Ù€¼EÑ4{mÉNJïm¦ÿ›ìu´Âx“IcÍÏÈ%P~Á‹IOf`Ã»ôG J ü…>»C¡3\Å³ÖŸ2a¼AÏ¯0Þ4ýÇyÃð.¹çøszô9ñÃp°¯%Ú0¼ã	èÁ‘é%i™v”iâxŸûdþô‡mÒƒ?^›ôGð‡ì=úmË£¿Á¼ÿÀ·áþG¯„Oûû†ÙŸ>ùwÃ¦}ax™PÝ0ß wÍõæQ+ËÄÑÁJJ\ ÙMËFö‚Y$X8èe#ðn¹½6¨¦zB1¼y®Ølõû˜ÖþFF|È&mÐ'œ
|²ßcßø„zôJÓTä&£ µŒ‡†¤7–¹´Å½<dÒíô×šªîÂ\/aîf l_Ì¢$Ãœ°ž˜U Û¡îÃP»ÄÛ†¡vIß¡C‡z0´ÕtiW\)­zw´öh°¤'Jp?s‚žðù†z©mhz£î€ÐöÙÇ-‡ôÝ|pñÌ ì{ü#œíáÇ!ýØ‡àÛû>^Ôwè•CzüHÏyì:üØƒëzô½®ßíÑkÄ•Ã.>›ë³6Gx¯ÄŽñ+·éG˜=‡Ÿ#ï´Í-²?èó{qrñã(ûˆ÷íÓ—-3Ú1ü—ý³Ocg{Ù³ñ±"gàº¯×˜ô›Ú \M¼®.ä$™ÔÙûr|5¦ ‹_Vv3#Éœç…{ÔmO}ûð=ö3?¯ï@Žs•4œQl™æ@Îp¯—2låZ Ý$isþtÄ¸êxÜmjYÔàn+ë&õêH‰V	ÃióéÆW¸Œ#¬_®ó¡kæˆ:îÈ;dFÆÒ%#üÀˆ÷˜BèBþÒ§ ÓË1Òìut£e¦j¾2"lêbñCoÔsòµv1Â‰û£[>Ïõ;`Ë¼;Ó´Þø5Ê¼¼†ç³p¼4žÝ8MSC;RC½^o«ïñØ½¦·‡‹,öï ¿ç¸[gMMcºèGmf9ÌÍ›YÄvóÞÓ¼9ƒŽ¢K¬+äÀ¦Yh<Pk<‹&¿ò,Wí I4®eO<íNëQ³*5drÏ,É=ýŒA6‰ˆ¸Òm
äzÁÜÀ†Ùfa¨ì2“R£®…£pç?K”çùn•ã„bWö—s¶–‡.5ºè—7}µRÆº2éZ‘™–¢Ähß¢V:%ûGÖ/·hì¦HÉò V¸Ð>¥€+\LQ>x
d‡©6gåf9`íAt½PV”¸û\HÎF:59áZICÈãâh…›‡îÈI¡­Í¶¶Œ‰™ny‚J“ÆEE·0*×Ô*Ðäg°ƒçŸÊ›$ôÑ¦uR
ufPÙ¦û¹¼_:äDS5ÈÕU1ðÂõPK’­Ñ¶29AÊº	2Œ†2©T,m¡¼ÐE¢—“O3’šÓcqŸê¶eRG„ÂÄðÞ,ˆWä$a´gAÒGëCèž«‘|îŠB½¢jv)_Q`h¤ALØ—÷Õ+°5^Ð×HßÂTlC¾«¢Ü»V`kµs<plÑ	7EÆ±™Ê=¾îß‡‰iLuìb=0Ü;§äJSÝ¾‹Îµæß:2ÜÜso Î¨è÷óºŸ`@ÝiÈÀ°_ˆ$PFüEsøÛÙd1îÀ©Ts³Aå%Nª¹ša«“æTUã¤±Fø•å„Ö¨Ó¯Üæ±`ÈxHù6Wæ9³¹JîPá•Z©Ãñ0T¬!À=PF3X‹n·êÍ4¥lÜ¾;pGERNU'¹¬Í¬³Mh›¼Z!8¹¦ÌMÑj¨êk5¯ÆÃ†UU¬Ák*˜m°°BŠö<‘Dd”»8T&;ƒv¦úåàÝÞû_ö?(Ê½äQü¥5©Lwb‹êþ;yIÊ4]¨³ŠÃ¹9Ÿˆ´Hóß7x¹xM\}¿Ø$ìÒ.ÓâkºÂ6ðàÿñ?¬Zì:÷ÒE¥íAe•£¨)Œ¼"1#1;ªm=q°j=¬>ÝwÒ Uq"<líEqXUþ)R% ™ÂPT™¸¿n°™²÷nŸÓC›\'ŠêÉV¥…8û•ìXÁ‰eÐVß÷zªòB‡SþýÖ@Zâp’¯ûÈ¹:BTp½”ŸÉ¬Lj°å,Pç(7†ZqT`ÈÑÃÒ!ÓÕC®ÚÓÔJB¸[‹½²5Šušy¯hÛU)K-›õuC
FYj³§HÎýBûVÃa zgÈc”3^ÒÓúiÈŸ‚)7©×`€@B£–]ÇðS{ôX$è[ÞÐ”ëÌÇ©ñ¡Õ³‹½ÕÛu R½7ÈêŽâ #Éõ%Zß.Ñík;ÙO‚£÷¬ÎˆaVE6ók}i`»ç¤|¸ÚŸhÚW®û,ó÷BüÕNÕrR7Sô­Èþ¾¬…7‡¦8”Ç·6*Ö­a!™f›å(-"èŒvŸÅÎ’m®­¸'VH™LOŽÈuˆ†PÄ".ÀbXæ[Æ0U½ü&ƒqG?´ºM16~wKäoè›l’ øñ”4°¨w£jÀ¬ÚèsNÔZ0ÍàãjÉÕ*‹ÈÐÐÂDÜ‚·Ã¼énQbêôx½?í¶_£Á*i; mŒ<çŒøtYì$tNîöö™`›ÔÌÝ>+¦eQ£ì­QgdÁâæŸjÌSµ	wð´pkåÁ5"4¿0ZÎï#±'9e7Žy\8ˆ4/úÃÝ•ÜlM|gþ0Xæ'hE~mì#u!Æ+Ô¤B Æ•]"„ð(¨E‰‹,óE ¢°Òn8V—WÀ•!/¾MwPò}ŠŸzËB@–óÅ)–ô|Œh :ùó	Ï{é×/?^ÂÊÕ@,r4vØQëŸÂgéÙº[‚!¢/Ä0ØÊ±Ÿƒæ.ªü<4R­TË'l‡‹È|¬‡ºñlæêè¸‘TÞùâ=¨…Ï«×Ó_è‰@;p“é . oœ…x•Ix;tÂøk4_£Ÿ»Ú¿-IurW±+	òDwµÁá-n5#âV¢áæœßzè^OW§Çâ”öiäÐ–"3lNŠ4A§®“ê©y¨,®²äÊâT‚`ÕÞØ4;ÊM…:-DIµ;J,´BuÂÅ¨Z{ë¦ƒæïªJ
e‡Ömg]Å×ïI«Æýãþ/ÂV•) Éì7aëVßI8‡)Û%ŽA4› õ‹y¶Í?à>1é[&­Êg]myPà½ohÓ£<×Eƒ#È{À4ê]> 4¨šg ›êÃhª¿2Ì1bê¡R-»uý‚„‡ßº3*}ÈÒ·­WfiôÕ´«þ¡}å3åè–³Á®z«Ž™YY_þBÀä‚•–Î®3rC?ä¢0q+rŸ¡Ãœ(YÜ×šV¯½Z8*Ö–"Ç²´e5…B#P®/M^D@HoTÆŸøiãOÔîÑ¨Å:å¹bä½ÚÅÈk‡å*å<Ê\,Ä!ˆ*˜>{\ÛPkMü­_Ã,íÛ°&€a¯a¬LNÈ˜îKñÜ_ÀüÎnyÍ• Á^¦$ñ¿°7a s]ÇÀSü`#ÍÌ:å8&åÛì·—×Q`ë¨¯Öe@e±ª†²ò¶\8ymÉsï¨ŒTƒùª‰ü ^ýQø¬ñ{D¦ã½ŸÉÉÇ½ã“"ººO¯ÌŒª”3mFÂbànè‰ß:§=D\ÊÍ’´žÁà2H²|q‰\L|6ŠèÂdÒ ï0Ì 4Ì°§ÝËûsÜÁhŒÜùÀ_ùœ!p™†¾µú½ý·ï:üpøÃÉ1ÇÀøX…©Ø›\†Á
µšX ]•Êèý†ÐÙë*ÏL÷þ¶yòøVÉÜˆoÕSá[é¨c(8¹Å¸K|“:M£4 šíæVÉÈ-i°Å%—â•¶Û”D¶j=—V©aÜxà/¨„R6Ì—½£2w>M5M™,Ð°OhP/-PˆE"Î—xßþF4­u6ƒ»íÀÂÆÁl"~Š6@š¥Ó”Ùðhh~5[…ËYÄŠv´d)’2¯!b áK{}V©žÁ8 #éŒcZÔ ³¼Šá¨Î.1lV–„¿æ0DDšÓqê¦Á…ÄœÀHì"šøÛ8‰ô¿î`ãŒ."LBXµBUíQ ¸|”«ªÖ„R™ê§!ŒáÊ‡—ÃeáX|Áut†v˜AÒÂj˜w@*PùàÁH»+UŠ[TŽŠQ,P=õ°¾™”åO:ù9°´”Š‡E`§zÒÔ&sC1ÔÊ–úv-Ù/Ö¯aÅ†wSk)ðì ºú˜f%LnýËxŠPR…u@‹»d“àÕ[tÐzš…àeÔß/Q¿PGýƒ<õKA^s°*¼›µÉ^ R²ÏÊÍr7£6P}Æ12Š^†Maãjsé±Tt¯A‡*>ÏzÆÈNFyªE€¿A—¤ÌD4‹{p:³.UDÔ°ªéÖC—@O]Ÿ*Æ~á¢˜^IóÒ,Iÿè—ÑùÀ?+.N}	C—Ê…AiM7,—j½\àd!)löt‰09}xØ/—*./öÛ/v³·q–/Àv§ÛóÖrZ>D0b–Õx4Ç‚€kTo¹\#G¼ÄŠóÉ¦SZÈp’fËº?V4(ã÷ìÁ"@q*ÿ»õ¡'˜„óÃu@]¯ŸFeöÞôßË¢óCDÖÀQ¿ƒ&
Ý+";(<EB±HÕòBÐ@~¿Ð·W‹‹ø–j‘q 6ú-ŒýÕÅ%™\Â—`q$¯ÈÏar‰ûÿc§|Æ´R‰Æ•@ÏÑ¢6qpíÇÓWh7aB~ ¿]'äÿùÿ^œ!A‡Íæ‡'Nñ$¸™ õßFW…×_Tÿ¢QÈ>Ð(Üwß¿=!ÇïÉÑ§oÞ½?$Ÿö~>ü$‘õ‹=fÅ¸Û2	²vïX°Ø‰?fE?8hŒàâªQtµÑ/æ2Ò.ô¬0Ðá¸®?{yw'tÏâ”}3ÜLÌ]æ–/nÂUUSe£oO¼Xá›Ý`êåžS3wèlÛS
|ë±síÍ9›Áw	Á¥u›_*ï×&7¹_„¹g¿šñVÜª 1ˆñÈL®b‹u×&KÄØh´ÉÔŸcóñm‚âä|$	|uÝ*Íç­N)õtºƒz&ý^ŸéeÔ\…/ Gz}jOårû7À"¿8mƒ’O#@ª>ö•ê#4n€È¦}¢Òq&}P
BF¯„”†KÄ9þÀñ³Gƒ/—ôGöÂ!4_˜­ô·‡{ðÁIR”ÌJãT³ápÆ#|4üE¤ˆ1œR.ÎÑpHË@¡âõ½çŸe	å­ÿ’d2"C*ªÎÚe±ô	`I­¸\áFÊF“ãúÚBîœû¢Ê\_®jQ^oÜ›Ð +plN¥šZé®H~»IÆ(”L(‘°·!MQzu{+w\.kˆ¢}Î/HO^J×ß¶‰ŽgCá}¿d¢ñ“Ì;ôH¿ßjŒxm-€íc>nÑäBú¦a²œù·?ðß'nr5f%Sadˆ»Ñ]E?bXKmÔ<½FÅ·
â¶<åÄà¤Ä ØxsIZwöC‚‚1Ö@XÔ¨ü³ŠUl+ë"ÜÀ²¤é"lulõû}EXZ4r•a]vêö”k„_IYõÇ°^ê½m¥[UCPé¯rG`<¢øZÃdîZ†½:^3ìZÀÐ8ò’`-¤}:½“[¶GþúàëåŒ(½]G¹EÆÚYò¾1N´öÁ_]vA)oÐoóoþ®“Ö
l’Ù{`Ÿ?¤³™uÌu„jßPoÇ±gQÓË\“ÙktH¡uuKæ¼išØó÷òüß®hLY¯ÄÏkÙè¹7+l­{ªˆÏÀ t]6•‰O¦ïÆîL%÷w…Á¦¹Ýè/9f\Üy¸¦mr´Î¯æob4¢Å/èæµQ_Qþr_•<U‘¥h'Ùõ±ñØÄAèÏ#Üqg!1ÃòR‘êYT ¯,‚)Ãù@8ÌÍô“"F³9ƒªBZ¡E(9µ¡¨Yjö`Ô4_Bª|¸ŽË|»uBÝM¹îö¸s¾´ÊÇ'«ÛµS(Fõùü¼8!÷þl(2Îã¸WdúÖ#ä©X‹â	H¤ÞB(Õ‡2‹ATâMS^é{þ-º"—þ,õãO.ÁÙµ˜ú1+µ3–c'Ïï|Ö`"Ž‘‰0‰&x¸>ÿÝ4ŽúßTq6Z6U¬TmÍb/"£$“8šÍÆ~Œk»XBIX\©E¥Ü=ùøý÷ïÉñáþÉ»?X¸ÊE„Ä0†"j:‹]
šÌü9'Ñ‚dÙ™G•Qó–Êp]ÐHMŠŽ»¥\/)›kìò·¬ˆ„,)èåí—L¿,tÜÎòKíhÞÛ¼îßØMÊx…ž®y•²Çì]ÂÇ õ,µqåyÜŽÓþˆ›ÂÞ°d
/ùvs…ƒÇ%/£ŽÅó»ô¹È‹d1Dù¬›c›ºÐª’CN/`$gu‡e½ñ°d§Â¥ôx¢}Z“—P“G&Û+Ô´Z7»ÏŒÿL!€¡ûus­Å˜‚íJ5¦ŒÛ÷Š¾(¶ÈüÚ=ùBÓ¹Õ!k:.ºV“³pG1ÌFáÃN¿îfÍå <©¯ø‘¼—lLï*
V4+í%©¡}1P—,ü/á›hlr—ZcãÿPOQÙæµOŠð×H°
ö÷¦xYæOÖÎ¯²gV/»ÑK%Â(½ò¶qjJÓ>u¤ˆ<±Ø¨Ž³“§áN³_z8·´Ø\é–~‡ºõëí„;‰¨GÄŽÓâÛaò“%‡oÂ··¡õÉÚÍ‚›³ò0™!¯Q´h$'KßÚ‰[ÐNtã›â!O~ÝgUr¸Ù¥˜[‰+š'lWŒ†LD3Ôz_raãÑg˜éÄûœzƒÇ4ŠHk1\ü‘•Ãu¬®–ëU™ã°¤ëp8e?OÑ_.ifÀÅ«®«)¤›Ö`¬úóžÌ¦¯–+Ú½'ng®NëH8Ãg·ijßŠV*2â®ÛŽù 5yÊ³'O_y¹ââµÙ;ÛìzB¦ŽLùh¬é«0æGfÊï_Pë~‡ÁbªÍÑ}²N'»¹9‰–·t..šJê3±¹ÌÅÌJI+¿×îÃ`R8Œ¦A¸±ÍfÌë£%'Þ–-SØÜ4°SÁËiTçÛ'Ú=¡GáŽ×˜Ë&yÆ8ŠV{Ëeë!ªà““ÔÏHµú§äû>FÆ`¥‰ÌG!%TÁ¦Ì?õ|)G,ïýþçšŸc>|ÕT<¯2÷Pˆ}Ý]}@1cžËé¡{]/ÞG¹Äoõö_~®¼C%l(QVq‹'L¼7{‡¦ƒQ#‡¦x¦–Î¿ªqÃøÅ7ÓÆÊ´y]?ža£vœ*öSéVŠzuÞiù/áê¶D^‚ÁNH1NFüÔs°¤†¤¥ˆP„5½¶Ö›0F èòKm‘Kø¿PÁ«Þ.11ÎaÕË¡,Øá'ðf+•U{µ•uIÔ1_n_ó%a1°‚ûJTkÍ32HÙŒZ@'W=)ÊkšÌÆRÚTsÎ·Ý†‚X-¦÷y ÄµùG½rÎ%ÓÇe°±ZtZ@Lz4k¾’åcš —‚ê¦Éì‚»î±Èi¬†ß2Á21ø-í`š™ÖPæ	xŒá7³WúÁÝÞN½2ü
ÏŽsÚ²Î×ÚÐÌ‡sð¸%ÀJz´Ã¶ÐñÜWLæX@1az'dT“CÑï´`Á¾Œ…Ù¬@qÖ“†:’Ö4õª=êLoÄmêì›fæ¿y¯o%iÃ0Ü×Ià,€c°©¯–ôë#@.i6ÀÂd¡|¥ún°Æ&u¬–ónð¨oýöÛWÁxž´©·ˆ³ />Zo“[JÛv»lÈüE0«kØ*³0Ö8¼XÊÚ9LgÐOn¢Bö¯ý½;xBË¿Z]*å	¨¼é
÷U™h)cQÌ
>ð¸&[ªHÓ&Š›µ…Î(&à}t#Zá5è*ÂYÃ=bxÂ.÷èj¥¦"5)@€²€9÷°xøb³”O(£ÔHš½}Z×ë˜g)m2ÀšP-ä–˜ñiòùyjp!TNr>Ý_1ëw•'¢4Ç.-aÑäF¨:E°¯NÄ,°|©O<“»° Ôu°5lxh5åt`ùM4é‡ÊÌÌ6fºð‡¦ÎÃ‰îö ¸J•¹šmžrÈï+ånæcGØºfYz,z$MIÂ¤7 þá€Ý<æˆ* –Ý7ž{fÌ¢»™i“ú4éï˜Ó§.|L3Ò|B<v!2%›3†ýt“U´<‚)ö/h`t>¦´œ¿Ç²„É~tEÞ˜S™·7Ç¢+´ÅÜÎ
]IÁÚ´Êfß"¤°$©C=¯×ëmŸC¾Õƒ¦ö9¯ïãÔ£Q("-õ@#_B?Õ¢SÔ‘-›°Ì%õs¥*¹%ŒœÛV¶yi¹T·ÚÐÓ1…åßý¥Áí›¾úy8›¥ßÐ‚¨…š ;];»Í„Æ¨ô07v_ÿ•¯õ½éÎgè”ÈB'´Ü¹ŸíþQ¯ˆ  È¸ó¸ø‚UŽi5¾Ÿ+0Û€“R”€Ep®’gzåÍžç¯þ‰¢*èg¸BÈŸ–P)žók¹D¶ÁíRØú­Â1Äjƒù3Â…—&šÎ Þ}Î´þÚ<¬¬ÿ¥ÜüùÏºtr»d%üÑÃ7O®ÓcÁ™ÝÑDiZ mÒøéñÏ0ÒßÔ…´ÐýÃô†ë«&<E­/Ø\{|®&—Ïðˆ{@‹úžZ>½<t%s`8}`aá^TDÐ-YtJ2yæYìçå¡‘¤X£Öu8:¼¦“Æ- iÙTáM
–T=¡×á¾³¤ÈIj[^ŽyÔsë10²æT9Út,ç—‘Ð¯¼Óöœ~Ûs™’¥ÝÃù
iÕ¾÷Y½¥išAÙ†‰^rœò.åsü~£_Lcí©Ó¸²Hø»sZýîçpu)²®ZØ»×þÌÃ«K6¥_>l×A0¾[¯ÇÇ§Ð³óqç1û¯tŽ«‚XbYa*§ R³RzàKk¥GY~Ð1ª‚t¶’ FbzŒQŠÔëƒŠ(\K™‘'kTh±•¬Ý¯,R¼ZôP¸m¯7úg–éìUÊÊ ŸPhfY%&°Ó1¡ÙºYOvèö
UUÚ,:¢CTøZÔ|9ç3ôUw%,”c47°¡ƒlôÃq4­K£ü)8 4¡ÚQ#pð@unH¶”fÆ¬èZî[‘ç®Ó†Fžé˜é*¾ÕrRæª?€-·š›þ2Ü¼¦±™›q0¹Äjd*<Ú†bSó`uMwHóèãñI³­½î’ú­’rG·
WèÁµÓ„[ýårÆKnþG-šä^ßÐ8šÞîÿóøã]†Ò,¶uG®BèDq»p–Ük0{àø¾L.)eÝY
œ°ÇýwÜ~ÀxeôSÊÙÆmæQKOö¸Ïžñ‚çÓ‚w-wK^Ähë[Ëµ_·K›x¬ÂÕÞä%4¦Ñq–hÎní$Z’—Ö;Vz½ò$‚µè#4¤A»¤ØŸhQb;‘ˆrJˆã2c¦m½›ê‹Å§9STq¯é<š½'£F»JßãüÑ2³ŽÔÐ5¥Þ?ŠÆù‡Tkf8~}µ³HC¬ép1/¢úê§J•Ÿ`PCŸFÍ^ÄBu½í¶ÛwÚ^¿J5”G¶†D³ÑH­#sÍ–ëëµò¨Ôn3ÖZY¿Z­ßns,>qC&#éoÒ\bM&dnZ}YNÍQÔ¢å.ûêøéªXÀZŠ9ït±¦Iþx~—3—´EÈœf°èüxŒÚÑÁnN£‹m[+Ú Qê.yÁ ‚´Ü²¼©…Z‡µjÇæ&ùŒ¯nA×HôñéÕdEÁf¯€Ë$tGÂ=³L¨ÚÚj]Œ¾6_bcÊœMv Ì”\räEz«^Zâ‘KW}·H®ÎÏÃ	En¥½­yB²)ao«µ	Øa2nðÐ©šl
ú¶óe¯ZÍnwó\Ô2[%Íîê2X´øß‘i4£s9v~€ÃÅ$¦Ðß@ÆæÉÇƒÍ ª{p3(ª0Ð`k:n“&žM`¥‚gh%Å>ôãŒ4,™U¹ùl éCJ%\"Ý¿nGŒ?2Ó-¼V6È8]ìdCÚêd§3|tm—Æ‘L¢…¯ƒˆÍyÐÊ>e+£µŒƒ/8ùôo'[&æ'@#'E†DMò®Î&GÁÎ>)¬!©üÖ³ÔÂˆ¦3„Ð2¤ƒãaÌÖŒc3'@²Œfàœù!–nm´	ÞoêDŽ‘È7wÉÑ,`Rò– +Æ×Ñ1›‚Ð9™ž½ü\še+‡ÕfÕSxî­d[wuñì¨çê¤¿Œò	M*põAÓlàž»ÿ¦£µâšk”àË£1AÝœ¼‰"ÔÿŽªTG­0'@âX2Ä+#AMF"Ãæëå-‹ÂHìÜ‰nR[EˆÖf†³.h[[ÍÜ"@´ÄV…woƒççæ@}V£¬qÄ»or‹Ž'	•¾kÒ(Prüó»“ý·äøÇýýÃcQ½P*í&=JÙÂ‘VYüÜþ+€.bçyHÖ§Å²°˜ëþ,JŠÈišX°jì`¤XÄÝÇHfì¼Ti§VJ£sãHå}ºt°Ìº´qR¥@£Š,#]|Ó{Äöä¡ÔåZ>*T¾êÃÞôé^ô¯õ^¯,¤YÜŸ^AmöE96©Æ¥%“9ã™È>GˆDZ*‘À*3†,.¡¬m¥(Ž GŠãŸ
Áš+©°ÕØÙJ[¹·7PË:¿”JtxŽÛv½+•^X'§4M¨Jk;2ô{Ùb¤§úž7NOÅÒ©rA×cN¬¨3®#z.¸èÁ„YÔ¶è &[ÐÈ¡M2PäozÛƒ¡sVÖ¨¶9ž‘Uãž…ègY9ðÌª-hó˜¾ÀŽR®7xìÏ M²œnƒ¸Ëñÿ6áSFøÿºƒÒÁ;üŠFykÈ"8ìyI•Å›N×:Á½25+
a™ê1HðÌ¥™D@e?À˜ÅàQ_'çî…w¢Ðm,‰UêõS	_3%®Ôû§e–°º€¬'hý¹ƒ‰nt‘¼ØüÍ›C¯¿ŸË­{óæÀqœ\9íœ[/‡ÉË—e5m¾ªª¸Kqóm®ò+ê.’òòñèðròiïàP£±`*}jÝ/­DddM"ÍdTL3A¦ªƒ©Ò²‡þ}õ¼gÝ‰%Å4UJ–(,«L¹è¨ÅHe’T¹n®Oú´‰]£|©Ö«°ìO™­*¶´„ÓÂž4ÇˆQTR.MgoCiG¼|çCT…q`ÐC¬Õ}¶Þ‡ÉŠDç4>(W]Väì±$Ë‰–,°Zé> ýƒÅ"aXfþmqQŠŸqEYæ”±h?œ'ä%™0ø'Q¯É‘·’&¶Â¿¯‚%/“çß¦[^`û±¯GþEð>biðÃicü+´Úh“Æ{Šâhòk°ÂOWÐFã¬›Dó µÀ>¶’`:A0ý@ã.^uÑWEËô46è~Áµ(TÔ“Ù’ÒB.¼Rª‘òÀ,º<MÙ.=ý“;eµÖò¹0—Jf!eSªü±Jn…âðe"¬|v!+aÅª•(qÎVMÑô«×-¹Còç»gEj*o“*'Ê¶e)Î¡>¯£u•Ò2dë‘ÏïŽÝsEqëÊH•÷Â”¼oåJÜ‘¯XsÌ):‚Ãy]­Z)k=ÈVf«Á–’ÆF›ôt[šò"rˆÖŸÏàßºL˜ÌãNOáuTû}¬ìav©Þù¸Æ¶³ik6Ÿa”)»
—ë5,ZÜ©`b4vÿ†éRF_“æÐ¹³FyÍ[~¤~Ûõ®à’Äîü¿ÿŸü?Üå®_¯~˜ö%Õn;ÍYíZ²YIöëèV‘rÙ+/lÅEež(JN‹±AÔ,Õ —yò¹ ­«£Xz5w¦¼W©l–.ejóž÷ºçÊÅí(Ó¦ALŒå<EÌ/¬Ð;?ÓÕÞÖ@QÂï§úè3Ý¦±‘+ô™;‡žßé•¡W¤™–²Œ¹´ð…+©Ë7›÷E”£[º”‘# DëFZ³>™vfì†½»ÓØ¿†5c="Ò=¤Aù9ëÖÃÇå´þ(¾µ~ýi<Þ².iÇBÅÔçr'
Ð+ jø¸	í¿„ôgY#Ší];§#ú2Ðú@M+Gqn‚ÿ¥êëò
˜½‚–±&§ÄÜVRá(‡SÞtIkïÂüùŒÌoRæb5dQœw¤Ã+7ì:ÐrÏS57»`\Ø¶±‹8œüÉ+‰d.Mqwê¶±ôa¯Múm2h“áYwî/[!µÜ´ê}ê¯Á-,›ä×`ÖèÌ}03žß…÷ŸïóoÇ¶j„ÙÍRø5Ä1ÖdÔü hÆÌí	¬¿ºÃ\U¥M™µƒhM¢GzzPtj´É@K
}2ÌOFWVäT¢'sAu”È×¥§TœXÒRÞ€Ë™–5·§*WÉX4~ÌC‹ÖU_XÌnqjW7º‰Mági ¬±ª…+¡
×³äöÐ× *áhÚr‡kµUYæ³®¥æ Ðö(vMV”#0‚•Àb,–¢¾IÌ:‚ž­3AU²Ú9¬Ë÷êÏáegy#?$Ã‰Ó¯BãSÔ¼Ì’a•/S ›æ½~µÔ±¢Ã0û4-!Ž¦zBZûÑ|z<Æ}r<»¡®-ná¥$JóvDÇ˜ªj†rÄZ-V>±ÝèsëzaŒñzüó%‡L%à¶ËèþÖQº‚Óg=æ§KOÌv+ë”’ìråËÏKë«È‹×8.íï
º£œ?£ªt‰?Ç=YzEŸ]Òá_•#¦äAQXmoo‰[¦±•¥i_Ñ@”Â o+šhÚÂL)U¡Uî©@;ÏöR³ý	9Cˆå¥?©jç¨É§‘Ùº’^@MÛÔ[Ãi«iÈ¨R½ª8»ªr.
_³€¬:·è&)Øâ]ËìúÌôÏwíy­QIâ_³PÒaéZ¾k)_œÍ‚D¸"ÐH·ú®€`Qh	)M+Ká
V¯ML)?.}›êçe\Þþ™O³*¤éÊ/
ãdLÞ}6àu¬üp¦­ómi×b]”˜ùšk¢‘Ö]OC %²+°íÉ:Š	4æÂl¶{`ŠSEˆk‡Ê"bÇÁ,º&Ì5JÁÒ«¢Rô.W§ìh­ØG-~/£¬ç),~å.ú}y¬l.â
]~Ü‘ªYaø›F&HÒ¡XŒÅ&–¦è@ÍÆ‡»nÓ1Á¨‰ ;©Vÿ´cÎÄ<\`ô˜c²’ïN{@÷mÒ8Š–W3?Æûñí^>vˆIÒ`•‰¿ªp˜iÃäóõ»@kú¼Hz”÷Kø.Ô¾¿
.¢ø{d¨ BÌD¯œò4O++9”ü¬ÊC0Í÷‘Ò'Ž\õ¦¼z#§iq§PAÅv§´³SÄ5ÍíéëÓ£ÂCR9­æj&ôÐ¹=‰™k3¬¹1ÏXmºdyª—a½`×É<š¢ñC}±¡»0á4Ê£Ý¢’$~¦‚…¸>Ä¶q'ágMûÚR/´y	
"×ò„ñö†¦¼ ‘ÁãÙÂÀß„åŽXæ=øÙD#w-Õ¡|£ï”?
î´aÆ¼Ð°X½%ß1L„õvAù™ÑÇàüÙ<z|x'´ä¢ëCY¹Â*…„fJ)”Z}Njù²§HJºv))ÁESrü5^l^öì¬?¹¯æû±Ï—V÷<œÁp¶æ(æÝ0ahE‡FäPj™w'œ–^åÃ:¹Æ†ƒ–~Ç6øðllP‰×bzE›„Ó›JÙ—½v5Çæ{üñ¸í0½¹‡?ì4µ‚ó£Ý­)÷]<T vw" ïe8eƒ8^MXEÅ#­WòYÜÝ‡«I.^1{í¥Óuwð—	{ùšýLZ¯Oö7þÂ.z=]½Lê=zêþsE†º8*ÐŠF{å‚…ùûÛŽ)}qŸ£m6t M—RxTß`V¤$xoÚSæív3Ë|­€ËÅM9ª˜.tÔKÓØYÔÃuÅÒ²Ã&œÑ²‚A¥¡›–ÈH£gX…ŠB,s#óFS‘±Ã´ÃqüºãúùJkÀÍ
Ñ˜‚Ì¢‹(Åj‚,¾(§zVüÝ¤^éÞZ÷Á(‡ó’Ä“—rÿ@K˜­^6úÚÑø?`ñPuÃaìâà<€•EÀ¹@YDqªAÈŒiL/3ÿ·[›-¹ô0«AŠ×Q%RJ‘5ve–üª{êœÑ)}Õ¬®YèÕ•õÞÁTïAñ
tºêÄWW¬¶ã (ßÓäCðåH×FžUïõ²',ë¿È ÈÇZççmiÙ;ˆ1Tÿ#ÎX¡Y©‰²ˆ/×´ÉËÈ¡,¨ÆÒ„„§:¦ƒ3WÏ-\$+Œ-0iùGôiñW!Ë´IªE“º^¦qô¥NfÆ¼<¿äÿù¿\ÕÝisBÍ6iF«Ë nžeI?¼Ó:-ß”ŸWäsª¼Œ9Qð«ëÜN#ß?ù×ià»æj{yÅÈX/E»­.3˜ëvT\`h^ûÃ:V&w|=©‘iÜ·wØ®¹“¥sÇR%ó‹ÊKiÉR—Ö[’ëŸÑ¬Õ&‰2m¬|A-®)¼Þ´i¹×-ÛšF­Ë`$ FV»Š"m¸½Ië/6–¯gÁ„K§˜Î¢¡»ûv‹ÕjY©¬ýbT¹þé.£ßjÃ^)ˆEÜ0z	‡Û0f›Û9)t2æbQVÖ¯ÈmËóÐß€€Úý~ý™ÑýK8 ¸äaþ¦cj²O›ãpYRÍ¯å`}ûæœøæœ0õ÷Éœ|3£¼ƒñhÎ	U¦—¶¥ð]l9ë»øÝóé7÷†4ÊßÜÿ„î¦`ÑÐ?¨›#¯w€®eÈsÉ7TöfœþéÐÁÿÎl<OëÃðè–½Cõ27,‡Kjgyðuî ™wÒ´#ñQ{KÖûÿñŸÿ»¦£<Eÿ…£q²”ÇâC¸Ø¡Y‘T]Î„ÇòH@—Ê.	[Júæ`Ç:þˆ,üæa.	ÛÆ~Óº^»ºMë^ÚÛÞ¶Þ´N‡â±mý ;±Z¯§6LfM¾Ö¤(¢Å¾U{‰m½Jý—ÕñGÓÖPYÄŒP…-==Æá¡o8}â7É†ew57Ê¿°[›•VÒýW2~ÖÕoÖï7ë×Ôßo[óÇ·­ùo¶ë7ÛõÛÖü·­ùo[óß¶æíÂ)Sø#ÎüZf0ÿ#ÛÂÛ¿çŸ[ÛÂt,þùí`Ý~iÅv)ã_É¤ûf ~3 Mýýf VßÀoà7ð›øÍ üf ~3 íÂ?¶¨.\X¸UyþÅf!ïZÂð!Šƒ4Ÿ;á¥;ã`Á”ø ¿
PiÒn¹õËm˜QÂjáKxF|	U=¡|i†Ü60ÔÆÐvÂ£­é$Ä€U­F­/ó;½KK=˜ƒFjTj³X( ¯C¤
"RÕ…¹W•$O×ÃˆÁ,k_JpzŒÖç8£ýju˜Í¦.Žqà0ÁR¬8³¨/y¹íV7ïÔénç#+³âuú‘åˆßR9U-9ÐgvJå^abÉþe„5>QiFYÌ±úç²nÁGIQéÔíÅyMÀx —Kªp›ç%â)´1ß¥ÀÁŠÙ¶=ðor"Û^”ï,÷D3[KÝD˜T!±%-RéMÜiorF¾„>|ëO½ó^Ÿ—¬ô{[Û=¯X	ÍA@màî8«”†k\KÎåÞ¥°W›ÃbM¸ù”Ö„+”–¨Äv43¿j™þâ²o›B×:«ó:˜D Ùùä§wGH=Áj˜Z¿êaª"ª*ye½¾Ô‡ˆ–Èçœ"àb¸˜…‹ ®Šô¡qc±ÿñ±d“¼[$ še“q-|”²0Åc8õéÍIòP§ÊÊfºT¾KÑŒ*þQ‡Ýq“Êî({óyS¹Œ·¶ÖŠØÓ{irH%6ÉRº7©t£ô"VRí”4Õ“R÷qh²ç2©¥P¸r^Y¶?ÈX‡›ÜÓ"çzû0R\úÈªC•†03FCÏµÚ"sþ¶ÔŠ¬ƒ<‰À­Wo`F^£ÕÖl—ÅØuÇ«–CËlÐÈ`_yùpê²
9/h€¸à²¦Šÿ£v#|©ˆñ6˜¡ÀâäÈ¿'‡¶ˆý—´ø¯çÛ[CVŠY Ðªš.ÈO.Z›†-Œìðîó’bªeRpJÁ”I~­M…uÊ+¤÷È%©|7}²òã®›`~­ë«È÷Ã#øUŒ¿×æUæþÊ¡²s‘U¡å#ûSSØò*^‚	Á‰—Qn*X¨šqÊJÙ£°Põ`0'xZ¨[¯n¼ŽW	ùnËù³…­Õ_•â€þ ‚ â¹VRã+2vo \ÂOÁÔ{¢ˆ[Êi8™=Ÿ_ëMRV$¬{Nòœ¥ìXº·!ñ°BK²‘ÿH\üq8Ýc³96þ
·‡[Ÿ½Ñ5Ü“ÅA-Ö& Aœ[p¹ê4L&õo¬ÁÞ*™Ûãr¶ã•¿˜úñÔôÐGRwEñô-oÿ¬¸K–(ƒíEpsŸe[ÍêªDçÑä*¡u¡ÂÅN‘òlÇ ]Ïüq0{¼&µíS@fÂø¡‰Ål•o9¦Œ´¯æ"«Øšy±IÝÚ¤ñ¦›9•;À’Å?3ùò›Yì9½Ë«*ÀáÕíz´¸šqgß|ívÒ7ÐSqh—þâ"HƒŸJºCÐÉr¬º´y{çF¾…FÕ„èjEýJ4Ö…;N}X;>uQ_ôyÌ¦gäô/;;ë`ük¸êÀm°–“e¸è0×óÙNvkL¾œÖ5^^L³„^—Ñ8ÈËY™®7m†|m¶i¬c“g¢hTÄ&qæÕäe¯A7YøºFìõ±QQ~ŒõlÚÜ6í.è¥ïOïŽ,¶q«ó ôçÑbJBPGÉñOßWÁ¿H¾\°ªH/^¿A.T´Øç/apý:º2#ñúÏ±ÐJ§äf>[$/—«Õrgsóúúº{ÝëFñÈ4ÇÙ„†«]—þê’L_6>¸ñÜ÷Ù~Ÿzï=þÉsÿ]<ó*žµþ´ôASw~Á…êÇÊ ˆâ¶ø~R6ì®ß°knÙ[§eƒ·ž÷>E»½íNƒóÄÂºg~Ïõ[BOr£óî¾l¸^ƒÜÂß|õøWøë¹"Tãá
È…Ò1ÖFü¸øQYWÙŒl%øyÙøÓÞ6þWýšòýÑù9Hè]#×ÔAÿ³i
¤n40|nnø¶»ƒÜø±ïO:€¯ð¿G@†-ñ•ÐËÓ_¿0‚üÄ“áÈÁÿeíÉù‡°§\ÂÛ_k	·ñ¿G>û™¨;| ýTñÉ(ÛžZ³²Œë0û[jcR3?HØÝdGóˆL"0i$e‡‰¶Ž‘Ë6¡ÉZù–²M›×¢dÍ‰×OŠÃó,ú»àÛKÃãÓ-¼Ìì6RtøÄ-êÓ¹ôÉAôÆ²£U¤5Ð©{7m1å,pu÷Y£§³~=€&­¾nð’¦Ån’|'X,Ó~Nê®”søéŠ]Eµ2ž÷t)>èë–Uö¯ªê­¬eA¬¥‘ÔX¹¥dê¡²H_—âÃšõôrôj¸ ÊE¡2½~W—`f^ªÒÓR½aAýôQgýº÷Ö%{Ñƒ§¡|EZåtŠõ“{Ñß	éQÚÍ§_GV;k­%áê£/SãŸ«'ØØýn€Ž{ºú,¼‚UoP=ÊÉ/¥0èYg£‡DÈÂÞáCÕN&Éïb§ÃZ&‚tyÕÄ>#„ÎÅkæXÑ±kÁÊ.Å‡GT¾¶ª{5vCû<«W*f§ãŠ·ç^wè8ÙÊO%Ñ,œbp=ÍÎ¦!?Ö±dÄèÞë§˜”óÐ÷Fí­ºpm'Íp·Z+CÎ9[0XÌöîI´BokÒþƒM)O5Í¡ëÛÞ£Obå5••ªFQãïwT¢ØóÿË«PÒkþq(ÞÉfõé(õeh4¨»ÏÅÌô­YØÃ.q¤zß<F¬P|¹Ï‹/'ÝxÿäZW65kê\|sŽ÷Â,ö‡vÚ‘ŽSÓUéx®79„£v/Ð&Âº*j"‹v(ºHU/äùÛ	€ïÃ,Ì1¤'ÍãŽ—.)Û´\¾ÓÎöÒ±½F~7#Ï\
¾~›ïOËõˆsû×Rë;ù y‰°³z	[Õ£œÉ–ãï~ãúÊZð×œSz¬¦$•âÊö÷³ÈœT;Íå³m[&p‹tÃO4Ï<Ë7LVqôkð3ÝA½óºS¢4š•Å­ý!-Ï+³\y9úºi®C:{ŠdÖß¢hŽ¹¬ÛRëà12XGÈãL•ÑíÒXÖË,Vøû²ã?UÚ ¿rFä2ÆLýh¾œ¨_Â+±i_/É•”"º@x}ÁøFS?ãž† DëÊà¦b"«:ô.å×SG’‹3ýÑ&–ù$ÚÍ'`#˜”9ýj^G•0f`oí†»Ly©šçÁ»ãFü“ËÖ«·Sà¼!©DŠ‹½»8Æ`Y^q9Ž&A’Pxh…êYÊSêÞÔ¢-öLœXå¤«˜ZŒÍ²SV•ÝN®&Øí&P2®m”@tU÷9Ï©.I³›wÈ‹Ÿ)”´ñþxGUï¬d¶ÑXLžõF#E5[ƒÁ”†7œÎÛæ~´X`Éu6d¨Œ[úÎ
NX;”Ì²fák·Û}p«ÁT4zÆsrÄøçúÍÊkÚ=J¿’¤dŸ"[PÃ„?Š3r„Eñ¬iAÍ6UáˆEl9¨[Å?0‹G›ñ[Œèâð“_ÛðæÀŽ8´I“×¬üAÂÏc&3Wb>©éèÏŒÕó—(Ç˜€WPxŠ)ì‰u˜¡Ä?I}þ[tE€o‰·Bxž÷L=¿ûí¶rá¸ú5_‘‰rß%üM&œLñMV=_áóc‘ïÏ>ëø9LÍæž\úð,Þ*Ea’“Ë0!WÉ<ý–¬ü_1<2{BËY3I 7M:ºŸiÄ'i¯=.äÒOÈÝ£q0	@ŠMŸÙ 9ZäÐUøèøqÇÆ{o:aÐPfÃù,[Õ¶?}dYw¢öÑfŸs±h]Ã®A–É€öc´ˆÒ…ž÷~sµŠÆ9k"
¬‘ÀÊ
ê+…^bDL5n…_^Í0N©º[~°» ÜM‚–Ó&CXÝ®ò×NßZÍ~Iƒq$÷OÅ×›{î<X®¬+L¥v’åº'RF ŸÜ.&„ÙU¶hì ½îgñÖ-™ûZB„ŠcßÖ|2(5|¾ôÀ:iÔ{$a«èðt.`M°E‹¤{.ãìñŸ|¹ºÝèˆ\\Íí‘XåƒUrñ'ähØmÿX¬ö!].£ZwRôøû?½ÇÛi’ûšÎŽlôDN³ÚÕÄyÍu€¾ý"¸&è_“ sãþ$œÑÕª·‰|cãï×pn¶ÜùŽ|ðW—]œÓhÞ’²=Ýáç^›Œ6àÂ0Û†õ{gù˜;p©É,®Å_®þ£•‹¨½fK÷XõgrI0)¨öÜã:ˆfA7ˆã(†ø”×Öí¿ýÕV¨¿üPpqL°‘øðh08éìE{L‚+$>Ë‰ÇˆLÇNÛumÌ?¦XüAòÅ=õÅƒîæÅ|=~³½g(­o;n5‚0=lã#ÙCØ¼ÔFÌ,ÄRÞÙ9hÓËMiÒ¹XJêzBe‰zŸs)¿öT KQf~õáhà¾.ìEfu\Ùè§=èÓOK±5!rÍëõ¶¯ÿ¨{Ó{½ç½ù}:g{í©“’qi©SÖR¨æÙ±dEÖ`Êµ•@+í¡ïÔÖê\‹»yë'—-P1lõ…¾·ay¥×¯Ù÷üDWçÓ½8_FñªÕìv7ÏÃ8ûIÐ…Þç2X´81Ý‘i4i“«åzu€ÃÅ$¨ûë~³ƒ©îþÕêòU—c0ÿ˜ñCTrì¸ˆà|)BN"Š¢ôF²Ô×RO)ý¦£ÒšâÿÇm°@ å¤Ù&ø†òv¯Â)<x·ÄcìÏhžt6ú-éµíÓóG}³£–Þ{¿Ñ¥:f+@)êŒOGÔ«ÈOV]¾xZŸ3íìV¸­‚iÙkUÈªÿú²^óÌ¶n}óu•ë)Öì½Ù­±ÎýpL»‡ð¡µŒKR±UÎMŠ¹ •’sÇyíl	Å<x#aÔÕÐ¶ç¸m×Y(èòµÕú9²PÒí´#dqŽ¼m}²6
’æ^_GJwöäu£1WbÓÖÖÿv·¢Z€å“•O¾ž“ƒ£½Ñ:zKX7i ûƒd·nãE“ºPÌðCon†‡­‰Æ®´ÓEpPêEÎk;®Ò²ƒ›ídz£¬i°åÕ‹
4vùÕ­‚`o!X•ñXÃQ[ˆ|©%0pø2ºæ¼¼ÅªO×eäj¼øˆƒºîšþ=—gÎ•|’©'vC7¯ò¼d¸‚g`ˆV·^ŸXíîUDN‚x.ü™ÉÙûJl­×õ›0ýŒ¡laÂwÆü‹à=+ST+èÈ>J‡—ÉQõ&‡
‘µ‚™òµ+£—–ãªêƒ
tç!¢;EGú¤¨®Ž¦ÉùPäÐŽ¡_qª(á8XÒzb%Yè’ðq ¦M@¾‡ç^û·Ýn·*´¡VLƒ$»|ûœÚ[ÐÅ|Ä°$XÕþ,ü­ “‚éˆˆ‚ë7Žã…„}Úÿ
¨Ñ&…áOñCM~Vøé
žÖ8ë&Ñ<h-h	DUù
„Hk46òÕq²*:ŠZYc©„7`Èˆø¬ßèR8Ë˜¥ÄSÊ½-Õ;Q…ÙåWN~E&“8šÍÆ~Œ« ˆð½ÄˆÐ%L¥^“¦Œ5tÆÃIŒ1„=²œÁZ¨’3e9šV¾bi°0ˆø/:e\¬ =õ†TÀ|¹ÐŒ¼(ppBìôòf°èüxÜl“;àyáüjþ&f
ÚAx®’âµqé(¹ß0MÉ½–¯——RÐSàiqÑƒˆ,¢ÁäãÕêÅ8ÞÜá^^l;Š« tiwlDÙ£ ‰)[JWQÊ.-žÐCÝÄÍ ·¥Hø<¼˜&JoÛÛ–Û%ÝZrL3¢¤ŠcÇAü%œšY}QõuÄ’§ÒTÄ{Ó[UÈÓÁÄs¼Ñ™˜%%ìS·Û£¥:dK,e16“ôîƒ¹È„‚.RAÄËÕ´¾ÚzßhÓ.P4>\†cèÃ¤&0~iE&q0WÝÊ9®\¦õ(¢ÔK•Z†©½Ç×š E®3Ÿ’2v)«;©«M*¸›"ôôÜíš`V¯!*ø¥†8MÕoˆ)RK£‰;pk´„Š‡ÔŽ·=p·]¹Á-À7ï‰Ev¢æÔMPZ1Pþ©Œ]Ç$ª"§³g›¶—€Zóë¯.(å(ËY¥‡Yoý…‰Š·zú/ãZZüù/›¯{Qºê‘8+©»îtÕâcû Ä6·DM#I,6vy8ð‘ÎÄ—Lc÷¿¥©›ëFDsí$³$°Òš*r^c÷ãbv›j"`Ÿb´T°Ä- üNØM!ƒèírpæò«y9ùoÄÅGàövQë£	Ð•~>:ß>÷ÏH™¡*Ð(<kÐµ†!é?´½m–*+9R¶“bQˆX.0€Š?å£p±T¨ãöú[^{àê•=­éœ[Û5Ç«³Gqw2—ãÈ§Ýëæì¡dù­ýî5|lÀ+ßúÉ~´ƒ)[ƒ­U|UÇY˜ß5k°¦PeH_ñY¯¡´Ÿ¦ü{Èü™m‚u¬›¶ö&ÙE0b6¥Å|¤dBqë
‰«ê"Œê¼»Ì	f5½Ã]À®œÛäîyÿ-ZÞæ~²ô]?²#Ñ.ÌþéEÑ‹"¯X¬ZL‡l?Ôñ“øæÝæ-à—T.TÈ«<ÚA#xCP¡7j
1@xvÈ©ì6×çÒÝÙ+Î1otÄ4`õÚ4Ãæ¹ïÛ™ZÑ–
eþHj¤&È<;åZ™Ló2'©˜Ÿ¼¡(öÒ8yä²÷3
’†-óF
­×bÄªQ¡ Ìýÿ   ÿÿì}ûrÛFÖç«tø9#jG¤x•e­/%KöD3±ã•äñÌ¨´1D‚"bà  %Y¥­­ýï{­Ýÿö©æIöœ¾ Ý@w£AÑŽ31]‰$ìëéÓçú;Y®×ÚÊa`ó¼é®qJÌ#»€Õ{Æãá|cÄÔ3âò¬á8<ÂÂ†Xñ
ò„œm¼=9ÄÊæðã¾x{Œ?þôüþx€ÿû×ÿúrÉs%~ØvØs¯ã2\l½èø˜h•ÕÿŠ™
²Ì¬ )Ç¸°æï\cYÖ»-lÍéÁExA7	#¼L‡t‡¿ä’N.ãp\þ•ƒÏêD9²ùÞÂÏ0d®‰-Ìi8ŒFä.Ë1Eà¹ŠC¬>QGë3FÀ±þüÉÄ§²d‘GC¯&—‡rVX¬hG4Eñ•7_zÀ×ÿ÷ðökj^AÓÅ!,Å(Z³ûj8>Æ–žíE3ß¾Ç—	ö N¬Nñh¼§úÛªÕÊ‹™„š†||Ÿêîz\Yå$ ÐÉ¦{3#¾yj	÷ï‹ô'Ý¸7Â”%6“²™Ì®J¹÷’âõ·GäË¶ÆH²%HÒ½AVˆzáÏQ8­3Ð àë³Å9ôR¿=®š5v³Z÷/P´«ƒhìïaÖuZ	NªIt9@×žô;¶ÒqUòàÄ¯á,¿§¡¸Ûnu§òn[ÊÁNÞ×:í(#›ªMk:k9O÷=Ôa¿©OØë>dµI]{´jP§Û“Ž"–Eì®€8Àüýªpådy1R´j&R¼³sÔr±×ÄWÃ•³˜c:–$ÁXúÉ^cq^5E©xI˜ÑÅ¦˜É·|u2tÍ@€æÎÁÎ.B«Ë3+‡é­Wm³LëÐâ^îtÔ€iMµÐºÓÅòØÖˆiåáû¥4V(Ü¼[ÐR¥É¬BÁÇša¯¢Ø'oÈ‹¦m$Q7°n˜EVSÃÂB¥©…·wL!o²Ñƒ.á… k%ÍRBž}Õj—vKk¢ç©=ÔxF0g…ª|ã.Ë"×Í^ýú´Õþp[ÃÈ°ªYH4wl©ÆÌ‹Ø÷>°ú¥§ÞÿùñämwÞMÿòzzõçE´ÓëÏ£Ë_^œô·:ãe,ÉÂñ
C«¦ø?aCÜ²Œ_d!1„s)©µV„‹Ìmà]3à}I¬Èjkøïñ|r“ÄWú”°¶à½ÆÓ~·ýp‡Ù§lXõ,‹¡¥H•Uì*ó'|;¿¿Òùµªý¸äáJ1
öqŒù½½[QuÊºÙÇ\"9*½Svð>Q:}c?íVÔ,pÆƒÏˆ®ðÄÏ¼>ñ„Àþ¬2@|%¡GóÅqÛ‰-Š X9îfÏ¡²G`½RYùÌŠèÒ²Çÿ-FóŒ87; –® ÒŽUðkJîæœ3žy ºœŒ€[¢ãõ¿3´xgèw"^ß[,®	‡!¯ë¢QB)–›Ûºìo±£)«žArDw±×Îˆ—N¹N=S)8ŠC×<x§/rž³¶î³,_lšš1Z'*üN&6žLg
kXz²x·…ßŸÃo	Ã³ž;£ÏqºW¿«‰¼„ud°?<8§¢wÅÝ›?Üë¬vWEæiÆrÁNé¾¨t&)‚°RQ_ÄÆ0T†P³‹é:i<ýîž$@Ì‡¢ïp(0ÅèÚ¯ŠU¦™Ò˜L„!¦•uSXÍ§SŠHà,‘Óãƒž(kGèœ&ž±ÍvÖ4z¾ID¿!Ìõ,®Nà2¤è·xfÃsk&d[`Cà²½{š?Äô2`8.ÇFzzÕsÓ¿Ï¹QûÿuN>†ßáÉÙçÎÜ¤`ŸÃ¨•å<øçÒ§^ßMe¨ä6á™e‰—¥v‘î™`°hsÌà]OŒüûˆ:ÞÇüÑfùdiU¿—üwÎ³›“bïsR´~¡Ø´ƒÃ>ZúEB•Cå:^m®k¨—…gL<Á’B™«ÒÜ0ƒz'ÅƒH#|u¥±ª_—Ø™ÆPæM#TòdKZ¥¹/Ë'»VÌÓy6¨–ˆ,j%ýÁ0Àc'™Sdû`æïâþÑ&ÝxÚéìuí»¥Á8)Í[ºÌ>ÞÂó¿Ã®LPºdv¤\L{wM“tûJþ;×¬•= 4•÷½T^Š™…‹¶©Æ`u{ÃÎ‹{*†^ÝU3dÝµ.òÐDþW·Ó‘Q–O?f¬´”©hŽøðûs½Yäø†lÁêÒ¶%RÏ9GW,¡ÄI¤`a4éÁIëHI¿Ù½k;¶ÎT†´OU1ŽÍ#EÖPàN³–«dÒ^'ÉíðŒ+k1‘Š±G–(Å„b–k•dqövý@ç ‚˜€9#TÀýÿi·FXäá%ðÄîn¿ßÛô:=÷¥rú†Îô]ÃBp?YÏúá·^8àŽûìrÀY2Š´utøkpÇ”)¥òÙB.Š<KÒ|qÝ~ØÿkçðoÙ¬nÊ”Rd€ÌÐGE«Õ§ªìX«Å$5Iœç9¡M•G½ÚÍµÚi7|`ÒeÔÈ£âS¨êÌa©ìO‘¡Q2Ë0Z	Ö@|Ex@žÓ	'4TFyZ®—øR/Qà§GÍá¶…A„¬n†ŽÞƒîc~y¿;érô¥’[ž9Õ[þGéayEŸZgýnG[ÞUS³±‡p9=UŒWµ”uRÖ€Ö÷ã5m†Võ$õbê·gá'v¶­CØðøïÜh"0_Ó¬k
ŠRq`ž=ïšÀ:•k³Œn¼9³|«uÅÿØíí¸°ðR«W­~Í6ý¶µ€èÁÅÜŒ8g»EÌ eü³PÔYÿ›Ëå`”«,\Á‡w[„¯Bó?ê,3OÚ“ „©4SL2KÛxA0Bäê1¥Ä´Í¢„Ù'¢Øå¸±Ùýùe:¥¥Ÿ¡ñÒ‰ÎB!­ô\•W#ÃÓ‚Jg*…=$–gáˆéñÀÒ%ë]5{\(®ˆ*¥™@…1Éÿ¬üñ™ñ-Ò=çÌÝ>ë‡¸Ì*mU‡›ªÅÚ‡ÁÛ`‡Ò’T÷–¯"§ý'‚:Ùß¸…óqs†8c9N¸MRmF6•Q¼bh®ëÀ×âDY>¹…UbŽÝ³V %~ûMì" e·Í‡š&ÈMÂµíÁÎŽ#SGÅL Œó>¸Ê!Ù$ÑéŽvc'ìaÐÿµ)|ö1no“ýñ*>p"–ùIçø4³‰?àó·'‡£	’ƒøf‘F0ñ+oÃ…)‰•¸™”¬IÌœ[ÏÈ¥Ÿ
Ó{¼À/²g©U½0Ì)|€)„5’³\`Í¸¤eÃDÆro˜öË-}/ãhFm}ÃN§`âs6šä{eC,‚çÐ–GRÉŸsÂ£	ÉÕŒÉš‡Ì²WôðM4GY¡–¤\&¯NdqIV¶3uîOqCêÎ²ÝcîÞõ¯3wú”s}ÝñM]H?H^½<Á<üz «ùˆÕ{Š'ß±Ñ Ü©ë qÁêß× ú ZùeßpÑžÕFõƒ¢¦î˜á¦«ŒòùRéÅ®ðaa='ÚÕ®³ò]ð6§§ñ¨×1õŸÆ£V¯Ãº7=€ŸWuXñ1Bó,c¼¹Þoè¦¶DX+ãOŠy×Ô“2Èn;™£ãÕEá'Š·×ÝøFCKü·»?°¹Ò÷Š­ã»÷÷œ.y÷]dS±<LE‡£zß•a«ñ9f/‰h‰¹L’—çPFl=ÄÇ/…’o³xe€˜×ÐAºÏF÷’º#1ô	­°u4OÃ6k}$AŒÆ(ða~Íf6a‡A:à³Ø^Âú¶è)¬&ÜqÒ<=>€3½ùöøó1~CžÔg!‰û¶ý1C­n¾/Z=IáQãw†Gî]²°çh	L½9Ü^„²Ë¤*ï¤ù#Æ¾Ü[	•­šâMý¹f¹®˜{Âì\QyžUæmGÞÂ„³ôóEèÍ?¸@ŠPYàŠÅ¾Âö(ŒŸšÂò²ÃâÍ'jéa7]ž.i7Mc‚%®0°à«Š^ï¶Èn%ªžÄëÂÛçw­Îþk‘d¾N†]Cæ˜M’²À‘ÍJâ ÐógàŽH!zñìs‘ëÓ´C]ÿè2"Ö‘‘³fˆôƒ¯bˆü iÆÈ>ùBƒüvóð¯}»y,¯uÞ<–ÿ{‘œ²‘ÂIüõÑ*,YwX½f6£³ñ3Rˆ!¾A‡Ò9etRå	†¾y#Ü¿Y ‹UT*dÈ‰êJ
ñY§ýh÷ÜÅaAâp¯$¥@+T¸œ©?øiÙß.ø–ì)xKŸ‘Æ,¢Ìpk„c~4Žý…ï1ç’°6PÄÈ¼Np×+ùþ•éh‚IKîú¼6I©¼Kåq¸-ñU“†k=Êv§S›d¶"0»Óá)]™÷¤ù?Ü:A#2†óƒEš½Í;BsÞW1?—í3ƒßVÄïØ€Lžü•ÂDêºÕW­xû$û^œ½]‹%Ñzžjj³B¦2bŠë}öƒÑî`29'ÈbÄþÍkE“	ÍêÁ!E<·(OðvÊX¢?€Ñ #ÉrXžkÛ>-5hÞT¿+ÿŽaU‡q´ ¦;'?ÁÚ„ÞM1šê6É7î€Ûk³ï8‡S‹©¼W¿øsmbP±Iï"‰Âeêg­fµU$E)ºw†¥ŽE‚TÉ±8+N‡wÆ|$Cv¥¥¢F ¨y¶ƒá£V”,¸jáÍ÷ó@*LÿQ|«ªÄ7h(Ë|3ç‰ZƒºDrûQv@³¤ôhRa´¸×aã)‹°çÃpž²ÒN™³›¥Ÿçq´†~¿¿[HK­s¬aÌ û;’¤qôÁŒÓ)¼a«<c?é¶¬2« #j†ÑÈAL”™¶Î†Óóbu?óœnÏûaˆ7Ñbz1þÊ}TðÛ‹ËÊKðŸ0é´qÞžy‹&h	Ôèc^+:tÛ­÷Á¿yrû~ä%Ó cå¼´E1ÜÇ^zg¿V•òQ×ƒAŽÅ».ij2“óì’Ây±ÊI@¹â`2£Äìœ¡”Ñ§–4—JÃö¹énÒÂaÀÕÏïRûI±Þ­vT<º–¶ŸoêÅZi’å7•FKN­-~Ë©êÔ»`Ú0×Ç±Ä¬-&®;fÀ5Š52©]´ÎXYêpTàÉYùËÂ€†ÞŠ¡dò×WØÀÄ®3Ã­²zaG[
!ÜÈšÝ(^6%TÜg‹ÍáI
‚Ñ¥ßIþ.æ{Ýè~†ó[@Õ}¿ÉºDŽ LÓ$¡Õ&ºÈ::3[$ûôq*Ú¡¶ÝX6aYiÚY©{5u ž{ó9ð”ø(¥htË«8Š¬r)æÅÄRPÚ*ÎÕæªHìbûL¦xû‰ÎöY4FYÚ\Ô6¹¡YD-C0ƒ:_ãŒžÅ»ŒúU¹W§/^ß÷Éí­ÐD÷Hg‹\c•…:%Åé‹KZJc]ÚXý¶üë ÕŒªµÂ°ò{
²´Øî×n«$¯zÃžw^ %†Í`*h=­‚ È*éÈÜ*#ñW-b´œ$*nƒ¤½Óù¾ÖAáÍÅ\~ƒ?*Dè
©03íPýº=«ÿB/}ŸÐÌ‰„ Ö@:ß7Üñ¯å†ö?zAH+„Òvt;+6ôÒ£æïìö%½ÁöÃÛ:aÚ4ñ²ÁÑÆê·u~¦ãFç5
 .U”_q«<)¿Ö|.ºzÃL³ß$³Ëyr©âYÎuZá¬9hùÛ’ï‡ºjo"* tPJ2Cvt‰9™ŽÀƒ å‚ÆÓï¹Í¯6A™ÇÖu1äj^FjP«´Wí÷*<:ÿŒý¨&ýŠWž4¶=¬ùšlò3"µg‹[	´òåø7hóZíëa-Vüêl‰ÁW«}w#NŽæÔd¹ZŠõ¬ÛÍX û-ºø«,ŒÐnÌ•ú¼:üvþ_§ÝÝ4ze*^ÑüHgÕáÜ+m^ÛÛä¥‡úJÐÉMà† 8@aäWm™é'¬H(&¾(rJßq/|YxñªwIzú L'¸¹ÐüòÐ•[eƒ]x8@hwÂþæ(ó+·
kÉ½„qˆ±Y êE£%¬=Š}Åù0›È<ë”:-½DíŒì¡·8ù:†@[Â*°¸ÇVß`Â7·í-°lÐÁ4ÇMÑËê‹UûŽâ_[é{.µ¹‹¯Õny·r’òË|÷ö¨\À:Â(«Áú°c ©FìSÕ:Üw/Éê4¤¾4¤@YLy$_f\õ7äñvn:¨c¹Ø.˜.œ¿ëV†6{¡Mç$fäh>Æ[4ßÃ¦£¸[$˜4ÕÏÐ5TW+¼=ël¡q¢·EúÌüÞÆ×›xÃ@W°Ý@g+›nßƒ”¡D~Ý.í‘9µPðAí;ÆxN`äµ¦g„Èe%_k7°‡ô¸ÏÉë_ºu…¤
÷GñU[2çu/Ñ´®fsãi¥¹¤×+Ü¶íï ,›(‚é…O¦~ìSµÚÁ˜RL£(ñY²ã<@ñGMÝE>‹Ïñ ó4¥zw_QD®\GõTàæŽFL?ß˜¢DÐÅ°Ñ.HÒË9^}±ßÁ-Ù#ªÝùŒóV±ö3VÆvi‹d,5ÏÜƒ‚FZØ9,ÒÊŒàOË¦‰“ïïŒ¶Niz£Þ¸ß?×¸Ñ²2\p&r#'xÉøól‡E \·¥„[Mª¾ÀÀÞIž¡æ›ðÏìêÇ+/|Ža»"dmNmt›
æ_”@KAS4J™—´“\´=‘qIÿ¦ÙYˆÿ6èPÅ…Ñetš9¤à>¿„àéïŠŸ?ƒ—Þ£?f—Ô ·vG¼0}ÒhhÎ&7g¨êl6	“ýøMûqó¤1Zâ­¡:"Ðü“Fè}ºAˆ5†ÎªÇX,¡7Ë”ø¬}Ö9§Kñlƒc8B[¼570he¢	ø``E6
´»Rhßjº¯ŠÜÚ2©œ½Ña°n3üåŠ±ºA¿vQê`9 !ÆþÃ[¼ž®ˆç¸Z¼þIƒ_ù”øèžw§.×+*”@@;õë’ÏÃ©¢B·#YX"ò¯ÿù¿™ýölƒ¥‰båpŠß-×ç+)ÒcŸ©4¬Ü*Öÿ c}*A·s÷}«4#îØ»Ê@GO—Gù´9)?6%äï ?’|«O™ÍjÃr÷(HÐàÆ1ÞÒ­4j]Ätm`—:Ï;‡=`ÎÿzÑ†°gþ±ßÛÙÖs[Q1;ãm2U–½ECôU»ÚÎÇŒ¢wîÐw@Tä"¸¼D³yMXÝ½„ÃÔ´]T[ôqÖm÷Ï9€âQô!!aðo <W˜Ô™’MÈey_–Ü“6ù¶ûhžj µx0‹}ž|Ç%;Ò]¹'ñg,ö¹ØÓ“uÎºT>,_ÉòÞL}4ÓL}6GIÆa´HIoÿ"Á…OÉe]ÐH¸Rt$˜9˜¯ã¬ÅîiLi»G”Š’g 
ê3ÙÍ¦ì7êPìx0ôÑ¨Q#Áw/vz“® ñnoò¨›{bvT;Tõ}^¤­{F#=ÀúgëUOl0Þõ'Z„*ŽR\£ÁpE_‘n0;b,;ÕCyèy¥×Ñ·¯åcâ‡]6V€žµbñ»Ls!y¤c¿$Þ*¸Z(ŸGjþýˆËxñ}“’¿IÉ¿s)¹Ó9x´Û©/%óïUKÉYdÈg“_ó=¢ÎgÓ€ÏsÎë(À–)Dgý©ÿ1ŽæÇtç*¸š¸,™—ÃÈéj›¤hýÑQ
=:e‰wWEóW®Ä±—L)Š­‚IËoÊB®(h½Ž$“g2Im“•U©Ù-mÙÀF§ÈÔƒÍ&ü¡	wUèÈ(äÊa¤CYlË3#&ÞX“!ÁÄ¹jJ.Šù,ˆÒh’†Êø4¤a1ÅPÅ„7È¬ú£za‰¨ßZ¹åË™D+ÉJEémïÇqtõ£?„ÝÜ1ªÌhÇ	*2\Ö}d•];ø­Ô]Ç¬ä‘òå¢»Âål»‡€æû¸ð ñ^6=‡÷±æ³Â=­ybÍ÷õ}®k¹\d©@ñz®p{¦k½úb¨WQp×Íå®ÞMÖ+Þdpè7˜óíþÅÍ^=Ãº°Û·húÒ*Mú	KJuQLÙU¤QB‹‰uÅtÊ fcfö)r…yqæ4ÈIvúÏÿ™Go»‹ŠÿÿÂ¬c€9€Ÿ‘ohÛ71*e	r½Â—»
É_€
 ö½ÜAvoëÙŒ°úéåƒ[³•Z]4­ŒuÖgGækÂiÐú#UQX+RÞèúEäA·Òy†"4¼Ò¹Þ±nÛuE.”Àe”ÏhAýz] ]IÉ}ë‘-y¿6YÒ0Y{a’û4Ut.•r»@´¼ONâ5ì;Eœ	ånxq ÊÜ€Þ–p‹V…ãµñL¹7¬ñº/V~‰|Qyµ|ëØ3hýÌŠáßWÔ}fº³ìC³|Z=ì· – ²]‚¶q˜ã*fXqªEíÒwŽ½‘›up‰m 2º<Y,7¶Y-­[² KbüÀ"Æ“Y¼Ö Ë[:©ò5þ64è¨b½œÀ¼á•5KµU„ÉÖÓ,&Ìècå™}Eã Êgºïö4xøwÔ—³º Ð³×¸Ó8'h-¡²9å²åÏüØÇ”´…À³X†‰_‘üdBtêE]E^È¬¼ªzˆ¥O¸ÄË\k'4\S –6'ÆŒå
eGÙO.¤s4ö>÷B„’65Ãë6í‚}Ó` ^¥$­6ÄÓ–ªm–óìÅóXÍ<VÓúÑ—ÀH„|ÌÑMOƒDIËµf™4’ÔÈ¾ÚôÛ<„¶læýJ•>V‘cC™¾aˆÈ8%ÿ±7ð†ó¢û"®BÌ]0CqCRÎå5¸œ¥Œ€.£eJ¨¿‘½%›$5¦zýìŒÒ­= ` %À7Ôã&»³dJ¶È«3ÝjŸv!$—Œý“¨3Ô®Å‰¤öSº°H”ÚÛ§”6PÞˆ#NPýÞ ·_&¨þü›ÐH‹’³d§X•Ù Þi\kˆwwÅº˜ƒZ­ZÌ®t]òâèE«=1N¦Ž÷C?NmvB&…ô;6<¢u
y¬Øï_ýfM~:}C¢±oÏŒ®íÆ²ÔºqÈ+häºôõÎ'Sï#Vpšcý¦ÖaëéF0$nÆ±ÌyHš•‚¶(—~ÝO‚ GEamP,VFþ/ðqmf®2^Úoê³!\ø U¶-»²°$­Xï£ÒzÙ)Ê¡Ä«kyWèøGçòävÇžUP¸×€cüß±Év½‰
\;öéµÑÜ>ûïÖ£óíË-Œž¬ÈyP.?†*nŸ¸áîS«„Vß}7ÌP©™‰ö¥0¯Oœ‹p½ë0ççÜbWuJ.Ç‘¾ª™Š3ëâŸJÇžkºôÑž3U‰QI_5ê?ÒÙ’HÎ6ZG¨J¨áªÄÊ{Xû¬ä\‘=ôˆËºøµˆ­;Ss÷¼äf>"µ°˜ý.iñKÜD'¼he½C8c2o³qâÏñZLî˜vÛ¡j!âûÜ¸¥PËÿòjªNà–õËëÀu¤ª´¨Œ|Ë:ÛªS(OéÔšýÂxË½º5èÞi}ð\ÝC@+„w˜Ê75Å*Ÿâ3Õ…!¤Vc?ÉÚœøéhÚÜØöÁ6CCÌà(¶AÖ·¢tUs\3ê˜l¼ùéätÃ
gêÓ î½zøE‹ÁÇh'Þ€N½++laû—$š»€6·ÅÁ'Ú ´÷þ¹ïÅ>–´£q÷Þµµ;ç~/¢ñÍùóÉO¯Û	A³yËÆžDuw6ËkÞq:{©—E—Ì‘’(,~'úP6!ÆÑe*£‰#`µ©¡ô%ˆ™CœæD‘õ8B%8¥|²Ú…Ér4ò“¤¹ñš17&SówQÔ¹ùÎ±Sçu­º@lÜ×…×Þ!šçhJšþñæNËˆZ½ÑoÏ`ÂXéžkÿ«.ÃýŽq`ôßøÉm Î ¦ RôNgÐÛ÷Kƒñ|#¥)0¨	¡’õŒÓÝ¹Ÿ´R»n.Ÿnñïå_ÐGhÚ±'Û4u“NhõXT+Žº_ÑP9!þ*+U·ªRWq2e“¦ÜIÑ²Yq#¾áàc·µi?<²Jyë^U[Kói¼D“‚Ù4APæ¥7i‰çÞüñØÒÖcÃAÙb¹}Gi¨‹ƒQßi7žÂ's2Œ“s
—\Ô„7îJº0‡r|i°nÁæ—[auª`Üîi]Î–¼
_D„u 9ñ4à4†¾ÿ®b›·‡Vk"©…Y±ÂÅúWXc{ÌÖLÉºT}ªÜôÙm<…âþMžhÜ‹á^bZô€ù«€´¨1¯æjX-(FûßJ.~Ôz¹jÜšÐ»ðÃ*o{¢œÆ‚ãö`®gj}¼M[3wVu-±K‰Z^-·RáNbvYóã1hU?ÍÃóZ3={lMNo[´¼øÚl
Õ›VGdý˜eŽ»ª Ÿß”ÁLŸYŽàvŠß•!ªnÐ*é	A!Bß0­ôšLÄïÒß¸u§,ypÇ¶ÝÒþ9D6 o¢‡uu¾‰µ¾¹öþ-ˆõVÉÐX…-ßÝƒŒ¶dPeÅá…2U¿‹ì©ï‰ì|¬$±ãb’CŠ×Ã,—\Î.Æ!†¡²z™ÇUf›så£kCÌÃÁ·!È¬çšÁý*9Ø]í¥ÎÞúZŸKEjî³úU¤~Öè\¡¯šÝ¯ÛÍ"5íèk©ãb¡¯ý,ôµš³…¾Öìqam®ÍíB_î¾úÒ;`jO¢ä°©¿bKqä´V(P}Xa•Á±ÃµG´7|ýF=Ù6Qj•½]¿UQÎtO­]Kðöäp…¹Géb¯tEÖ#*'ï´.¸Ž¾VsÆÑW…GN
qžPQärw˜×‚cNê5fW?ˆ€«8èèË’„¶J<ìØÉ;¥ûºbâ¿g+ü®\µ•tùbS÷pü‰&VŒ@ÒM¨F(’¾<øZÍK_f,-©$(«Ö?{ëÙšû.Ë=Ý·w[¤ºL|¥ŽqgJ·†*5™®ÑF¯½_«Èb"<* ü5—Ë)¸&oññÒq LE<š3å5á@€÷×øØ*Ìä„§£ù[YÈT—q4£JH	ñ³z•Ä¢Øzª¹Zï_ó`¶œÉ‰ÖbÕ¤ù”1Jß¹ÅåËç}/ä©JšUóOW]Þ§Ú¾êSa²œL‚Å?©Wˆ5´6‚ü¢6\YÃñobžøfOøBö„•b7éë›aÁôZ‹aaåÈN6„'Ý28¬oH_îÊåªZ¨âåÏ­h°¨’mUW-ê;ŽÁúR_dÿMáÑ½>¿Âcú¾ÑÇ¾~¨óKiWÅRêÕÅRbyOú×‹Ì5x‹ßÅ$Þ+Ýè$²D3)ç ã=5	bYÆ§NxÞü¶Á}hŽÎÕû"7‹Òiù±Â#·£i‹¡ìLƒ‹FéÐ§ÀwHÐKTc­3?ZBƒ³V2Š#,Ñ€ò†`ÕÅÂÛH 6Ä‰€2áeãé)’$"pôØ¢ØðC4åò±¾[ZZôÔ	âzÅÉ(§ –P( ¨Ì9ÎÕ$Tþ «H³OÈ0}}8k&£a>4Ç_n_8 YéaS±·EÎ%y\®[80á?„ý’Ö+P˜l ÂJõëˆðó…‘ú3&7~jS°Ø0”J‹LÁòÓë(ßx3i0™:=ôRÔöÓë6dþI?kÓ÷›dƒÚ‹ÎÎ7ÎÀüakóæ8†TÃ\STH£7Ê×ºn_»±]ù^¯â{†·EIÃÇRôºu‘×€¥
ÆØ#ü’‚¦¤Þl¿_Î?Ì£«yöðûbýuQÂ6S^eCù°\·vX`—.Ý¸P© »ê|v½Ú2äó‹kàœ@î§×M?û•žx¶`Ï@É‹ýi‹›³ÇTÕ¿6TÑ£º¥8nŸÁ¨åÇ‹ÌqU˜€æ¡­ƒ«xü¥Û„Â11à š-B?¹ƒm“üø±ÿõCËOËq‡J†ö¾cÆ|X.:œã+í–¦+•¸År;A<Ê£ò´fY©·
²Å¾óµË»þ›C·"ÈpÅnß0Ëâ†¡¦¯®O±Î]Žºc­Vµ0ÁÛEUULþ§žnå•]µ#9.¾î±T.§Þ¢Ã#ëåÌrù°ÐBõaÆu1àÞ•å{13ufùtæéNUií¨ làÌº¬ZíE+`9±ÐŒ¡p¨czü‘rýÖÆ ”ñÁ·„å~I1;ª—Ëaž®Œ#½ˆæË„ÛQ«"À³œ‘ðOÿh˜«ÔoÅ„§óEØEeípÔ…\GJš½\¸þB¨ÜŒ’ÞÇEYŽIÖëÂ¿Á¹Ÿ‹ÔiA¶Îa°%6=Cý{
ÛŠ\¯€‡¦tÌ¾{1ôœáµÄß2§&Äp—!*ƒ±õÝÙï>|®«o¦Î©N%÷ÒÁ*°¥R…æÆÓîìœ¸ò\âr–ˆ~Éç˜tÏ5ïáš÷Ô´ŸZ¸z5Ö¼Ü=ûåõÝKõ"VÀ¯CÚ!É°ÙtUtxÝJ%Ú) ¾©jÍáÂ‹¦}Õ›c½’ôu_#;Š(nPJ‰XVç~¡É~õjºðîv%¼£ÎnÇ>«>ç¥}/c?IÈs/¶ßv|z¯€á4_¹L2Û7^ ,5Ê‘têHˆta[m÷¹yÜŸ€ˆxûpcŽëqåût+8×\ïÕñíûÊîh²ß´ŒkYFˆÕˆñLùË>¨ü=ù[ŽNó:–+·ZõP(B&ÙM™W¨ïz2ðŒÿÌý„ˆÃ5Æ~…`«k€tI“ŸÒzJ8Õnº7dLCÅó‡ÎÕöÎÎ÷ç¢|ó°ó½©xs—•êeõqD•ËOX%¯Î•Ss	z¤ÉçKpì'Ë0Ý$-BmÈdì/àÃ„€DÅ©sÕµ¹}_Xº|eÄB9,¬‡{HoWºêÊcçåàE9Ò¨˜É}™£>S¶Q©®Y–O©a¦)ë.'•o»>õïk@ýóÙ¹V6;ëüŒÿ€Sÿ,´¾Z"œlØ¼ŽÎ¶*TJ–‚Ý:œ;òX7ŸC†#®‡ïÛÞ~ÛÛûî-R6÷ûYc7×ËZ+Xgq¹;ŽV A÷8E7/’XBã°ÐGAŸ 5Îœ‡÷YÎˆûýæ¤1²$×¡(Xùõ2Zx£ ½iívÀ·+†‘™'e¤sªtÔ±äP‘û–†VÜ‘Û±wSÃÕ¡4Ñ«~—8Ôðmó¯×¡ŽºkøY¯¥™d{Ê–ÇÝãÉÇUÓ*µrÛY‰&ä”É¯ÒÒc÷ë¸Ž7£†òû ñ´UwÀNdRŸÓ¹=åb²bÎ''íÊ`­­¬¶§»¥É‰+Â„âÉ½QI'Gu®Áv¥V1‚3©^AVÇíL&_ÛÚ®àw·÷0(Úy‹eW÷-ûaˆ_¸·)È<J½pm–Ù¯xÝkpÁW,}Ä‰Z¥k¼ß0%åUréêý3°U¦‰»~¯w®Àgf‰»¬„×ñÝÌ¨YtÕ­ËMè‚ÌFíä¢"ŽèÚêI—œ3Ìcp+­Ü-èY‘TßÁuw\UìðC–ëµ¦Mï^ôÆ½¯xÓ3Ãã:6=_»µo»ËÉNS Ö$ÿ¸Fi¸Õñ¯ºÕ˜²æ\²˜éz—sïcpé¥QÜ…Áâ"òâqû*j¢Yl¬E÷t8RÌˆl¨‚E‹ÀWjÅQ¬®*Û ^&îÛ…%¹MÔR|ØQŽ§ÖUIêimåêò•63„/K“r=ÞÜ(-n¤¨Õí§„¾stètŠZ‰g¿Ýsúõ›íd¹XDqZÆSkyÈb½ìÏoWñâ÷Ü‹i„žÔÙÍS`ä„mÛ:ÉoQFIÂúE=íh²õ5ÍëÖæmÊçŸI¾Uø3ãÝf/N|±7ðŽ<`y äUt„>yÁ‚Ï@fž/¥k“ºåOÒIÈè¯æpÞZÎ@i,j
Ê,Å6Ó«4q-Šw·&óÉÖ33÷µ½¿ó&áeŒåáÕfÊ¹K'ê¤9·P†£±;–fÂVôdêû¥dÊâÊ)a­œyˆ3Ÿ¥U«Ò—1€õ‚öËÚÈÂX1!uqÑÚÍZ½­…LAÏZô£’Ôƒ³úÂxh$«ú‰X"ªWDh.Ä«IÝå›e¨½k» VÚ|ñºGEJö»¬e7"E¨"ù×Ä4õ³]LÖ`5i„}¤)­¤ÆšD ãVnmI>³[Þ è¯sw(„ÉÄø0W”†y ©éºv½œKD’£-Ô¤•}Pº¯”*¶<áâ;-^ý«îµÀTXÇf÷wúû£óíÝNAXz_n¿™Eo…ý.¤©iw\ VØ¶ü+ÛáTJjÿ½î2Ç£¨Ú]Yç¸µï	ó;ÊŸ¹%†:œ0ð !?Ár†Þ9¼0º,Ê‘ô!þÑjr¤,ÕU.Iì“ç¦Àñ³Ä‰Í¾Ë…¥THúá‘/X„\Ç>E ~4öhhK#z<í—ˆðR¢9Ä¡ÐÌRŸþø¹†ªÚubç›8ùlwÔÎ·§ýÂpÊ6ÁdFT±FTî™™úyW{ìC˜ÿïn9ÀG¸£ÏüˆÅ°°`ÏËàÚ7Ùªd/dÕ–
½²úJ¼êNá3^TÉÃYáw‹Ü¡T<	¨l?{ºXà¨øm¹&Qãó³ÑçÉ§‡€…o˜LÂø¯\¸l8fé/dÁ\°.ÕyªªÞgzyÁ­®ü‡dÎy#quFéS+ùÈ”±žSÒ‹áÃ0ŠáåØ8dºt}é9ë(±zº¾ŠäÚ,tSfÊˆ0–8¨³VÍº
™“#GR*cGú	Yxqâ¿#/mæ”®½)’gö-âÃ`€¥7ñí"¥ÉÂlG÷Ì`dÇtyMFøSbd	»ç]À>± =”Ò³‰Ž"ã¼Þx7°cèÉnNDÖt4Þ+ƒn.ƒ±¿hÌO÷8LÙ>þa^š±ýÁl™ì1G"_ÒTà]ŽXÂ>ŒqÚóèªiÆ‘¼sZãc¶(ý0©D­ƒš#…: V!o6­¤ÀfKçí©fAã´¡oR˜L±Š+³ˆ~¹AYÛ8<3Õ‡ÆÔ»ÌŠNhd³ú¯ä¸Ž6×ÒLúÄ±AçG¼1M	¡k°×Ø"Æ.4ï–ßÓˆû–k@qlJÐ…TÈÒ\ÎóÎÃŽæ†¨¾N¼:iËt3è,3LlÉ Òž’ŽÎû\¼r)^1çß€}ëãé $ñ]'…ÙåbáÇ#¬÷¥È¥½<Bä
ê´þÑ}Êª¸j 1‚OšAçå]·¦­~¯„9(ü³°Ï±!4M¬$ÅAó¶H@¯W½û5P4Ãü¢mµBÐ©Z(·Üzö+¸32¬¤ˆ„H¼‚4‹âa¿ß78oLÎŠUAY¡“]
óXI(§°Fôâ¬Òƒä±u×¨D‚;Ý–ÄæàbÿúÏÿKÅ‰ýçÿAp¯-]Í™2´„“ØÇnu™ä>ñr–ÿ²— e¯‰ÉîÇÎ.ü[2ŽF[dìc<Ìa4Î/®þ`†.¼æF»½=	bÓÛpý»¹RYY³Í1þw±…`pßƒ¡¿7¨^µ/<x›Õ*·UáV‚ëÇm`þÐâ.ÇÔ¼|9x8|x.ûbLué°.Íåƒ‡Û{Ïr¢^óe"A{#¬í¾V#}o::6uo\›.F¦ÇûÌ¾ò&öT/ñ5,aäù$†…½°`[R¬>³Wµ]ö%sXo/|r{+²?öàæ-n67ò(OuKOù×AZÑ^ßUç¡Wye&‰¼‹ÌÆ{fïç°ƒŸÊvÂð.pàÿØò?Â	µÈ´¶í´xÒÚ]ï‘F«Ûé|ß(NYZºkÍŠˆ537
|í?ð(C%ÛÊìlÐr»â%°%øü´LKMY×¦Óec‰Å©—S‰1XƒºV;ÂE]µÎú;–J|Ö–œÝÌ°Øëõ{²à?é2ïôñÈK–Ä¢C¶°G(þÈ{¤-
å-LnÚ’_/HÝèÈ#¹›Ïê¸-—fÓØ”3uŽ\Ù¾^õFR6v¸©KkÌÎJ‰Ý”}Àõ¬N.§è¸ýîîî¹£ë—´fqÙ¬‘‡ÿf4ùkXz-@˜jMöAé¬$3ô÷Œ!ÒO¯SÂþ.SC¡ÝË¤hü.NR/µjq…nÏ4×PcÛ†Â_\ Ñí()ŸõÕÏ°´wø]ß*ûX´#ýíÈŸÁ†/cC+}ú!nìÝ”¯ñsŽÒ<1ê&6’ª&éD/‘8ÚÑL½8åx÷ö‚¼˜=8hËsÆ“dú­x>øé±?B M¶-=ÜögTÍ«BþÌ¯¥Ÿ±²Ú§4F<éË[$£Ý#édK”/=¥ô‡ò“éJ®›IˆÜÞ&ï|2®0Øç†âdÐYbu–ˆ°>V…y²Û"@ @	þ‚x$ñ&~zCg•\&…MÄŠPßSH€íÓéwŒå&R°œO¾¸QRÉe­QN¹e<j5®ñ*¾ŒBÈváNŒäòŒ4
rPv{ñ í^Ž)2€û™ïŒÊV?³÷îâúçøòÂkö†Ã­^ogëáÎV§Ýß<—/®jp—èÞˆ[2Ï66Îù[™ÌÁþÒûKŒŽúšÕ·2y‚½­.q‰èu”‚H”D„'šÒÅpyƒ¼œR’¹Œ"3®ÙáÑQoŒ÷ú0[yù½çðŸ#Ã¿§×[L“$½	rŠ;
;wË{?À”ytáÀ‘Fï%}öA·ïz ýí‘[-•êõ5+GeýG£è”Þz¼Ñ²Î#)<â­’Âã¢	ÍÇh)ã7®
&òMúèBÃÎÇ«ß¬*´C¥X—úE´ ‡®ZNŠém»‚óÚ• §óGtZ·ãù\¡*Æ½**P—E=ÝK	:ZwR~´Ô«Ý{†4’‘.¯*3lZ‘)¾®¼9ÙÆÀÈ›A¶MÖÍ¹}/¼b7LÍ˜%1™ U¹,“h@jÁ±-1ÄŒïÒ 2DJ9þ¡™L6ÊÒA™&rê,k‰öñ˜29e†z7 zŸ4à›ÐÊ[®b”DÚ µŒrnÉ@è:2þ;Ã:¬FŠ°ÆÔ'Œö„ýš$Òg"CÞ¾qäcùý‘pSC.ÿk"iPŸ‰<N²\DÏo”Dt—Ÿ»¯ƒ¾Ž«ïv„5/—j“Q›ÉÇ$c‚w½îEwrnÎybÐ½ ý¦Êû•^-Â_£7B6–mÇås+ÿdÇ¢rËÀ-sƒÍV5±,WºÂ}¤>[ÞiE¾çc^çG8*B(ÔÙÁ•ï8¤’šâ¸› ]ã©–è«¢ì‰©bOkíZ¡Vb{¨&1IPÂf^
VÞ- æç*LV,NØÈÙQ'÷‹P“…à²;6¬ÓAÞ%œ“‰!è:ó‚Ìf°Ì'~Še`rì#¿Öf8û]íØ£T´œï˜ÆñÉQÃd¤'Î42',»úxF5 è‡ã«9dƒ’¬pDƒhüx›6àØ™á@LŽpvóR8£ÛrÞ^ÐþÝŒ\ñ£X^ƒlKwˆ1i¡òÓ“F~z×OÃNÃ­	žQ5M·ÆJË–=<*4Þ¤mo‘k?¹nÝé*†dÜMØ$–æïòbÑgÎƒB±Ko4¢–xÁ]V°¡ðE¿ìv&i’Û}Œ˜³“jˆf#©<$ò¤‘~T®ÊyE|§¦w÷ÃQ˜¾P
\¹;3ì8PyÂ‘úù«êÐ&‰’¿ê6êUOI+(®á)™¾Õê:ê!p†À.$íB‹»òqã´×+‰ÎáÓ¹-ûjì{@î*ä:1º: qÏØ°OY®öWû‡ë¹ÛoÏ/I‘†ÐÐèÏàrî…EðÁ¿18«}E-cøßÝÊòùÌ"Y]j #oA+>}Â«Îr1‚Ô»¤ÙË–™h{™Y%¡ó3˜Åy-.áÌ™h[H÷cK¥|Z~3—ŠsíFW­.Þ»
³à0³b¼ìÀ+ä8ž†Ð¥;à¼®Ñrº&ù˜Å¼nÇUÎ#k'¥/KG_¬GÜHÁ²°Ê˜ò¹.ž—ßtÊ¯P§Ämùè”Ê4×¬SbÛßtJù©ÃJuKêèÿõN©mðµÕ®8ªk:©òT?Ïq•z€?)zÁÑ¼¶ñíô~³}%!v0>§EˆŸŒo!£EHÚƒ‹Pôãöö?ú±‡üÜAF_ÉßdýêoY4ø…wuëÎŸq	q ºƒ¯MFâ|ÏÙv`a†ö™¯[dP{û&ìËOÝëD›]Osrkª&€â~‹0}à§þÕ>Áü(÷sé–èÈNnÏ'¯ö‘T^°ïøü“Èñ„8ZÈù k!ÛÓKÉÃšHõµrŒ‡û©ÀŽà'þp-JF_…<­ž”§•„l´\ª,õ=pclé1a5:%ƒ0‹8‘Ö¼n§bDÎ 5–`ž~$K½½Ž& Ðørv
Ìª³ÇuÊ)8XY“ës*ž©t¶ÿyéa0 VŠI”NNò ëŠ*,Iéy†ð.´öÜÃ¼ÝÏ+*Ý³~v_Ø•—Ö&1·°¾é³Ž¿¥ž»¥,1ë@m"“qê®M;‹KÅžî//}““Æ‘8þ]Ïö¡ÿ1 1Ï_ËñNÒ1Œéë<Þ’Ñ4IýÅ“F§­+Â }Õ9ç|¾Ä9g]};çnÏ¬l³9I£ÑÔÃÿoBÈjŒê/«à¬‰OIû÷uK µ]°6Î¤›õÚ™’ÔÉ7¹£üØ¿éq>äÇ™4OhâæWp®Y4ä›ßÀéî­ýt+sÿÌg\îëÛIw{¦BòøîL„‡ó:á,Ûü4B B	Á|.Ç~ÒÔI3›+H/h ì(™ÂÁ¨Á¹Ð4Gq áqž±7è(Ç3Ž×¸È¹ŒÓîhjK¦KûÚDBc>ËûšDñã‹xÛ”Ê‡¢îEEóvuUc’°Õøq¹Ä–aJVL­N£ËË0gzŠ«F¶æ4V|½ª6«léæ\F©å„(3RÒ£ŒNiJ€,šÀžÜ^2òB¿uÖi?Ú=×šÅu«sþ¬íÏ½‹(‘ÅxØélwù‰pÁjL‡xª×Éíäå$Ï
Ûwý®2ƒÆaàï9@G¡Ä^Ð°+–Ú°«ÒVn9X¦´ïo)äÀ ^Rf•ÚxÙ|­(*W%|?oÊÂ:´ä¢÷Í½~ÑÌP¼Q4¨+/\‚å¬á D’Jgh†(®|u¬ÌÓœøŒ¸D¬VÛâ»D}CÍ6¤5gÈÜr]Gq¡íväÃÍßµdBÛ¯¿ÛÂøð€°ºAôTü‘•‹à¨‘–3Qu"¬7MiVÀ\Ê©ŠX
‘X¸Ì!¼Î}>lôN[~ëµüH©—Zs‹=Hæðd£8ØVW_(O¨HI¡Ø&(ðÈ‚§­¦Ï7©UL4û¤rŽ¦²V*E›rùË.|ú¶v.&Zn<Eb¬öSÚ‹bKi´`«s¿ÌTÑ‰¿`›_åÆÏSÜØÚÁø®sTÈÈ%Â’`0ÛBç†îv
2C¥Ø\G=Îã0Å\ñd8*Ànð#.AG˜Ú"óa"0¯ÏÁ¸È¨ðð+…ñ®±$ñU#MD¯lBÞº;çsZ"ßQì(â-ÃÔŒä¶D¬ †a‘‚±f‰²²+ÚÂšš£§Oc/™*!Ü'^P­#W=azXAÞ3¨ÛfðŸû =E2Ã!.ŠP%eUH#ÃŽ)ð*~½ÿÑBUØNlg¾BtVþd1¡4‘Z?î„S©:²3s˜;Öë#ív¿k«BGÈO¿ø£´ü<iâ77Û ®¿ðFS‘ôl×UZ¿Fó7Iök¦¹<!ßÒ6[}7Bb?]ÆsÚ²ù1[Xµê‘œì¦JûM#/IÛÉr4ò“¤ÙØET
¹¡áþØ\üÍ¨7;JÐ‚ÛP¿£¥Y!.kû41…
s3}3ó2ÛOV©„¥­;@? "(Hò,ð0!æî)óˆËúv”’Q,oã$˜-à´Ã¿õ³æ_85ÿâzòéÑ‡WèãSï|º‘ãU:p›Å» eü„œÌ¢(b'õûúGpùï2ëM ‹}±‚¤)Ž…L‚úqiÿ$õæc/“,ú¢²¯¿F˜Õ¢:9ó½dû3Tú:ûë»ý7Yóï@HO4m/g>É6‡¯«ÈìÒÅOÏÿZ9Ÿæä¹¢öJX.¿Œâ
6þueûûp=„Þ"/8Ð/öm—M‰FHú9ë«1ÀŠM½ä0J÷(~±ë—QFW„óÒÉ2DÆ¸ôz4š³èÃ¸U´g½Ò¿J 8cƒŽÕ‚$¥‹‰E)’Ä•öÿ–õñÜ‹iÙ†^i)ùþ±OkÁÃ²8/ã«Ç²œeÝüÃ+Òc¸¡H4aõ®ÉhÊ<\mSŸ†…’_»!/q7œ|p7ŠégtMŠS”·1ž>4=Ìý²å'°&ä§d„!µiw _š‡cÑŽ_ËºGž¹‚ìçåX ©ž C[£óŒ^Âµœ‚¼#±ã ¶0,Œ£1Þ'“d¿a42ZøÞ‡d;Ýêrêt>Þx±ªj0"'ûÇY‡Ìg\:i´ Fâc(X’Üè¶à(«¼Ž_ío‘ø?¸ûÈG× ušwÑ©4P&ey<Xléc{û0øØvé¡ìããôíÝPnf¼[þÀ¯³„…C_—
]ŸÀ„ü[yäOà~o–lük.}œæ›¼ýØÄ³N±XÉ±+CQüÒ¼uhT³ü$Fù)6áá%™@˜†&Ç×–¢±\œ4ŠèÔüí0{Œù¹"ÐrÙþ2 BUåÕÚ˜©©àˆ*8ÄÍk¯C ËT©JF•¡Ö%fRòY±/uÚþ9õGYOŽ€¦ÆX<1èU$æÄ¡ï-³ƒ)û˜$Sèúƒ¶ôœò}ì)¯2Ú€ãÕ:äÊÉôP.šà¾5vèlJB-€võTJU¬ß¨ðâÓ#Âä3'CZÉ¬’e9·}¹K4ürE3›¦ôÿÜxÎê±
Û C˜.ç*³*•ñ6³X•½Ë€¿Í°Ñ+©n]VÛâZÁë3tq2Az>B9ð~ôH-™h50“£KdVÎf+gì`wˆø)î€l+É‡Ðá³´Õú£$øÂ‹žÐX¶¶tEÝU’Ë
äTFÜ=á1çá¾c¨!~;ãù&ŽÞ%Õ™›NE£‹1&³¯. ]I2ÝgŒ?˜Ó­¢8m‰<Ê.ƒâ«,°ÂTÊ†95íjÜ²™ë/ù`ÅÎÎ+sW`|X~ï´Õ‡eè³IM¢xV` —e¬÷üÑü¿"¾ÿukÈX„ôN—^MÙÍ¥áJæ%4õ’œTÊšÕáKN[Õýô³uŠa÷=™Õäš¡µswÖŽCqÜBÕ„be¹–õž,ÃÊ#ú°$¹dŽ&(É¹’†(`%ô	VòlP¬û¡½'ÖtÑ2añò=äTSÙŒ­™6|È	N`€›JX,ýÁ˜²#Ð­7¶¸ö¹AmÔæ´!´OÐúý¢8ø+à…6–68ÍÍ[ýA~·Ì—ÉAB¿²IØGP‡åÿš¿Sjn8X
üu<êT6ÖDj'ÊÛ>–Þâ¶ƒ.½¸z˜“à"Ê›y	Í½Ñ(ÈÇèÏ—ŽM™·ÄlúÇô-n@‹ãèêíâ˜†nZU~¬¤gW÷-µ˜ñÅÀ Œ6qU€íLÃÞüVÙãqhòÖ+x¬µˆŸý«ª_ñý6fÁÀ_y¸ë{K3önäQZß»HiiÕh¹Ðl!O gŒÎ)K˜E‰Ý}4µ'“™én¶DF±­©2p3À®]g.kdz;²µ¾FêäûÇN9
Yì·Ö£Nf©±·¨ê¶\¸¦h¦bõ0…T§œ íºœýŠ·ÞÒšOnÅÜf®Âæïwã6­*~Dò?ðÎ–êŒo®,¢äÌa—µC~¿P´¯½ ]Ò\ËŠÞmš'äelgÙP)ê
6µ#ÏÇ
;œÿñ]aàÖX*›EÁr‘o‰¥jSJ\¶í³‡eÐµ½O¼ò*¡¢÷¤$zù£µßzùgƒ£·ü¸~@)
Ÿò5¶½Ûù‚1¥ë1•Û‘m¬ŠU ¿J-cŽí´Áµä' ÇÚWJŽ‰RbLA©îÈm@þHºNá².vA7ÓBÞ‚{„ÏàOyŠÔWåT¥/EG­j}ÕšzV»5ô5˜n*6`í1¤NÏ¢Â¾&•¼ƒ*y§†J®KÖÈ¹šŸ-4“y`„sÐÔÒi4¶„ž~éh<9î8¸¸ ÑYã`2	FË0½AO¶Ìç~¬1ÎÔøNçQw2qqCÿ	Sæä Ž’¤Ø×î®HÝ¹ƒ=õb©'ÆøêûÈG‹Ý‰ÄÖRÈ@ÖÙd‚>0Ç0r×d|éC“NË£U¤e<x´Û©—‚!:QiKËƒV²®¼áÐ÷=§ :2w²>”&V¢)Ì'ëj0ô¼I¯"†€—¾YK hl­Ñ½Þgˆ&xpë)¡ÌTâR†_
Øe^’}ëçRHØ‚©7‡>M9ÍÂª•q¬!b ÓŠ»=„.è©IÅFyÿ™ù”LÀšŽ‹˜yP$Ì6G¼×—2„Õœ8UÄliEÌj÷ëãlHu‚ vêA¸­…¸›º6ç<©ÓÔÝÐ‘}µœ'¸1q÷òÏ¸ùÊ!Ÿ7Ò`:Ð†´ë¸,ê)Ë˜u«dÊŸt‰(0Ï
9t:XKôzþ xLšL§º37»Á-òÙæ÷š+Ni4ÀÝ¹é=¾Ûdã l]=E	tš	0‡ƒïÉ	3D9^‡ŠVó°¸òõV‡[•ON=»¨*ˆÊ¾b¦9å¢I—¹cŠ+à—ík<e–>­Y¯B†Ì‹¿3GW+w‹Ž_Fû\Q[«ú|4!ui¼Ð ƒ·.K[fÌb›°e—˜¨HiÔºˆÉ$Žfª¼ ïËÚèi1{Rd°’§C{æ²‡ÁÀÝÐ­Ñ£ª¦Hì §ÁXô°ž!›%Ç«â¡OlaäÏµ?–õ\;×>ˆfÁÇ2Ö`R—”z‚JA0Dœ…²ƒ5æ‡˜Yðbož†7ðø(öq²7Ñ2Fè!¦ž"„ÕfÓ^Á¦m$NcàÎ”¡Rqé™ÇÛ³9U[y?aÈ¾ÿx{Ì€%ÑdfÐÛ²S@ñ(Xü?óJªþÒÝàÖˆò5ŸGu:ç’Õ?'ªi…nc4ëO‡Ð
ædâéÏOœ ø9†u¦,·7ìniÑ.”}G`ó€Fà ¨æÅ1N±z©ƒýÏxQB¸!Üøñ´W"f	µ"¼Ì¯ÏÆSqBøêÂ)éZÓ'õH+òqÏq‘ÇiÓÒ.ŠRd˜Î®X¤ÃÌnØ”Ø¹ÎNX"TÜ»XdjöÍãÒpÁØ–iÈ»Äì§.ìöy†KzÃLK¸÷eÓ9¦fÞ5â³1ñ’…?J[ïQ<´]RŠFW¹³žÁ_„K_`H}¼Öb‹ÊP¥TŽ¯÷:T*¯ÙrMƒñXãV,NµTˆ
ð2›±çôÒßN>^þñzþ×àŒ;ƒ­7?¼îýãæyß{wÜñ;Á«_öƒ£?MCïÝ8‹¿˜¦~zsòçhüÃñÕOÁîÇqÜÿq>úôãìÑÍ?nvo^î_ýØÇ¶ŽþøæO¯£Ùëä'Ïñ±“£Ë¿÷?<:úå´uÄ~þé‹‹?]=:šÿyþ÷Ù‹èÕ/o»?u_Ÿ\Ý¼>}›¼:\½>ùüøi°KÛý4x²±yNÎf^ò¡E§²‡Á“^œmO3~¾ˆ€jg[t‰·¤-ØÔÅ™Ó>¡ˆ W8tèÂe’VEùUrD±êÍ×c‘™`aÆ[˜X£«²*À~êûúø=ÓMVöHuÐ!U:,ÙÁ¨?Éì«ýŽplu~îü< ‰ùçøòÂkmuû­Þ`g«Óî9Ð[¥Ë~{Šu…2œÄâêÐÎ¥åAÅû,.c¸¥V\Ÿü»Ždð¶,¤±6V$Í›º·
k‘±^ÎŠÍ@Ý¡2‹T‘S&
B¥f-
·4	@P!sÿŠEW¥SÄð8ÂK Añ\é”gÚ
A1i“¿GË°ï“«)(k‚\„6š’±Hü…–Ù7¯0wo\»(ZjÊÇ‘‚œ­	H¶IÊ×úÊÇa Ó°è­L^È¹`Ôm[|LkÛ|‰­™">f†FË„ø×‹€_ìi0ó“=ÒÝ"ý-ÅdˆÆ4¸Ý`_^´/Û[„Z×ÈáOï^cê/ˆ¢t[a¶4AÞ“±Ï5 7‹5£â5rÿãí0øÒ›Ðûâ›€! —þÜGÇ˜Bóx:õÉËÓS¶ 	ÁMw`)1@qŒ-m“£	,)+†S6ßHáÛKLëM£(A<JVªˆm
ž PVÐ-”²#ú5ïCÿ‹ípvðêó‰œ#²Ä+ÅW¹MN`!q#(€ñf¸teÍ*!oßàqÁsÑ&§p$6€ý¥ßÝgoGaÛ×*/£o±iœÆ §òœéFvmaÁæ»=2ï!$
"»¸eí´hÊ©Òø>ŸŽVÔ7è0'“ñ5j)¦v2ñ=|KÊA‚,m1ýÅŠ›Ö‚Ð4 ‰	é‰M½áp«×ënu@jê(lUÙVÕÕ•?³õáVT‘`ÑH8G£Ž9h€ýÊ¬Ç{¡?ÓµKm]ð'ù©Qo¼“ïïvø'ÓÖÙNþñ©u6ÄÅVÕL…‚Ä@Ó=Ñ´x¿“/o%ÒG™XÚÙ¢ÿÚ; ‘”6­îcu4›¸ÙJðƒçÑøf5-\^†â9Ñ ”—9Ø-°©øŽ„É‹ÛÝÑÛÈËÇ½«"Ÿ;­›ân^‘§6py~×€ð·›Â®šLÚ&N?1¡þ\¶©6ž¾ŽøùD06„Ú ›š°ëQobÔ+h·—W˜E=À¡9kÐƒ1Þ†:¼çM´ÜBwðƒ¿ño*(>ß Ä^î]·D9Ã‚NCLÀ”áAµïh
¾Ñû©„À5½w×	úY\¥Ð{¸u7i‚÷td‚ýµ þjÜ¹9”Lê6ìÊ÷‡{HD;ª¸ÍØeÒíµ‰¦vlâ’ü†÷°”ûÏn7)«Ó=K—½3SÍ‚&~W9€KïRÅE£ÛÓ`\^FC^þ§+Ö­YSËNÏ”ºîCÇSÇÜÍ^Ù²ýŠO­! ÜV`-¬Í^M &¿z16C¶Ã³ à,5YRpMW¼`C—ÿš|ÑÞ™%a]ÅÞÂ¸6œÂ`Cn³ò4ãý/ñ&êÏôÍÍvýˆ(U>~é$EË[óì|‹Ü’eº÷ÆXõÆ{7ð×t=ÐÄ7È¾måâ8@àK•è“gÝöà\Žè±,/gG%.¢X&ÑãÂ®^ãïèy”¯fhâuÖ
öÌR&w	R¡6Mß¾ Îb†ŸT
ZÈ"ëäšåªÓè³³‘zé2aØÑÂŸoð˜;ÇÕJâ=©:µü+Õ±RÏf2ËþÅ>\2VÓ>+»Ü…
E„,FV4å†Õr«NñóŸ<ÛÇu½æå8³áYoq¨¶/ÜÇz`Ì?)ÛŽ’äœ@X\ìEhÌ2#ÔUé:R¥S‘ø$ûÁ‹áÁóÁ@)Q©«¾ÌPq§ Òæ"º;¹Ê‹aKLï•L
;[ÑÓnžWž&´¤ÇoÂebŠ5êk½'§ûÇ§äõ‹wäà‡ýÓÂæÔ7VÐ'"½ÅBhŸÓp1èÉ†‹Ý*ÃÅ¤3éM†ªáb·d¸Ø]Ùpáb¡èwŒŠ9¡¯	¤”¼òÒÑ–Æ~.Y¢ÎÿÑ`·¡	6žÅ×kÅƒk°ùV½ª	:¦Fiepá˜;§5"c²¡CTF‰žSø„<DDFÏ!äNŸË¥]ÔÉdüÉè
©mŠÿSîøÚ:ãLcÇÖtÌ˜PË]º˜5<£ZgQ	5:…^RÖ©Œ2E9d‹çõw{vUè>}¸t¡ÿ`5ïl!®«"l½"TJÑŠØÍ£VuR·¨ñ&%Í$1}Q²†"Æg¹R‚²6>Ñµ§¹©UQ6üyëíÉ†›žB¼ô>Ýž3M·SÐ¤~¶¸ÞêµÆÁejU¤r|™iK­3÷ÃsÕÂ›^)=‹:Pb2vÅÒlu=Üz4€kÄ Õš½oÛ;ôƒÆÓçp™ /ŸÇ<k¥VÇsàvP[Ëàªµ«¸[“¿ª`†¥+¤Â,©9¦<Œ›Æ­äWß‹ 
aíäñ9fÝ¦¢C2Š£0¼ðJ†{”^Et£©gcô0WÕ1ðŽ}œKÔU±¦ðx°Ú¾–ÂíEžä5‘]Œ÷'ƒÉŽHßý~'ÈBÇxXÔx¶;üþ\WŠá=Í«2„öèì¥
Ò%oóéÔ› !.¸R,Ú÷Çˆ@ö6‹6†ÿ  ÿÿì}[sãH–ÞûüŠlv÷Hš)¼ˆR—ªC¥’ºµ£jiKªî™Q(ª@1M ,I­QÄÄ¾Ì“ßáGG8fÇk‡Ãûe½ÏÃü‘Þýþ	>'3d™	ºÔ¥¥ê®¢@ ‘—“'Ïõ;ºÍ¢²7N)¨Óe'´‘©§œÌÀ8™*ä³öã_þùÇ¿üßÿò§{œ æ40!z ‹ç[ox8vk²p Þ¥€ò‡2
‡†jyç2r&ç3´¹±È¬}Ò÷1…}]œœ kAôuQÿkÛi‡EÆÐÍ8ÜÝì§ƒHØ†‚Õ¨?~â€w'çpiHw2~ßÅ¼4÷r
òFÿ3Ûb4„óTËy:Gƒ’Ö‘…ÄC8œ2_çWˆXB$&¹-ÙÌx Ít„ÇL ®Å|}Zás„»üó?ÿøç¿þøçúñÿÝþËÿøÇU_ûvo;)pv>ûÛ¥U¾wÆÿö?ü~>ñþõÿæý[ï_ÿåO-îÐÁ"°ÉBÏ¡wýíÿßÿí?»žŽë¨OC7C—PÇ,6 1ØÉÎLªsØmÆ9›!YT]m‘Ãõ$µ@l&M8`ñ´pZ6þ$cZ2ã¼é6ˆ~üzð’œÅPM¢Ü¸>[>8ó%]ËqxžzØsmVdÍASÈ»k¡‹¬æäjê2³27',å<Ö¼˜™ÎmÏ\ôÐ"wÏ¿¹‘ÌõtwÀ7üÝ_’%éX¡¹‘ÂI¬ÏßU¤b
ž=ñy£>UeÍëÉ1¾t#k™sÌ`û^ˆK‹.3àÄUæ4»Æ…ÄnL>z—ENoˆe/B¤¡Ì¥R€tªe¨€Þf,píd;ÅÈ.Ð\xù*qöû—›ÔÐ®bqÑ¾yãsFøè	ƒ|Œ"P“GÑV%}[%£N6QŸlŸº>«=ä¢×_U"ÕÙÉdöRèŸÌmƒt9çÒ‘ÜŠ™”zÐæŠRç5¾Þ²‰ésŸvôcÚŒ\/ál.~9ÍyKm!H^
_°`ñ`¾`nìˆ-cGAïª=ÉÆåì,tùAÛºsþ¿;é¿tyçCæDñB˜qàö(ž©wøB:€êÁÑ4$o™Bl
¢XñA’Bbïâ+èzÊ~GÉ¡¬ùj³Z¯5B“5é^_mµäÝÆWÌEâA«]£Û”OÃ™·çÜî[¶u&’”IAñ½ôVã)¦ Ò¤Jtm÷z.šX.ÕÐkÊ¾Ðólà!"•I2•Ÿ<É4—8‡“±ö=óèA‡ïâ'Ý”MYæ˜ËâÁ.”N<µL®9æLà×yïòI~‚X‘`z~ˆñ—_§r,üKñ=ÝIªJ)ÍVýI³Ub¥õ‹*
 ¦²Ï¢õ“áb¨4õöøÛP:Ft‚z×¥âË®óqÍ¬ê•ÆpÔœ	å‰7™Î¢\¿>Ë#7?5ôÀb›×~ÀC+w#P-¹uÍÀºN’g^M±t|þ	§×s§@ò,gø«µiï€˜žÏR”å[²$®U~3¤SÛr¾¬õðÆeå–É“§×ÚõºI	eëüì{ÑÚc;Œ<÷{3”s1½&5idžRÅ78(»¼é<Þ]-kÌñ1sS)e©,oÑÌIè¥;]©BJ=¼BJÂyè#Ën¤˜s7ªÑæ”<ÅŸüÊ½BgDÒ†[£EÅQEÞÅM±„G*Ï'¢®ZgB¦ »C„ƒ¶*TÕv—Û*ªaæ£k´²”èÅœ^aH5³9—¹TbHèÐ¦L{ba¾kù%WÛ
÷LnÖòsÖ÷BZ hëúa±k ±aÇ%Æå±O39LÛíúžæ9d½eÅ›þðÓ›@ÀXpž4(È¬,"Ýªçšå1çäLkuÞrçF± È_s¯´“`s­†f¦1'èÍép@wG³€‚\äcw´YEäI
7“¡2oâ!À+âïÑEØ$õÚÆjŒO¿­øÛ®çR/øû…-á1‹>–J—EGF)óµN¶âDÑààÍÆ8u1N™°*eª–Äß³ä¥TÒ,×Øaê Y/[£ÉHQ	§Oô*CAt"-ŽÎ LÇ*B\R›Q´2"½Þ(E»Í ú±E#~áŽ¸ódJi½úªHLžÉ™æ
’‡z{÷=Šž‡ÏZØU¢å…×Ž‰Añ@Q€'#§ëJ ¬®‚Láä	1œÖk¶;>#ãÒá1K À‚èû“ßÏ¼àêÉ}áÆÛ±»ú™rŸËlBð!¬¢gÍ›l*"Î›Ù
1'bèÆzëV(ã?LðÇéRÊ4üG’àøÌ£zQŽ?[F˜ã?’æRD†çîÔ‡™ @î†çÄ€m¯”ËDÜ$MxY	Ù«‘½tÐ¥|šm/ïûfyNƒ•A²àá¾Up€ Ã>ü‹pëºi Wi§håäG¿SbÕdÁ²{	¿‚<F½ÿ03ÛÔÃ‚/ (×jïÅ†A8|è÷¿y>ñä wÂ«I“Œ½YþDb…‚Þñ‰´òü‹}a8V¢Í?X®(|Ì Ádpž;ê‡š<düaÞ]Í×:ç>u'³nbâ\8ÀL™»…‹Dq‰8ÈUÙu­ëÎNÜ¸aÜzQI;ØÜ!R1ÌLnéoVÎ“:Ë;§à–$€¢”q¾ÍXÒø¹¸µä”
FŸË·i/šo3:OF´™VI¯ñ<ô‰a›þ…k§•³4êŠ|*eÏ-]JWÔx¥yíäðÛÝ—Û¿!G/_žì~sL¾ÝßýNðEdÓp¦Ï^Î•‚#iÔrúL½[ïÕ])(!ÒÚ­†Î@6©Ý¯”ºEÖuÃ"œR"Í^´½×¥n+µ~­mÕ³¥­®ÊÀgEI‰°Id»H* ®Ñ¸ˆŠM«¹Ä…®¤3¤*”ey1Ö,£"Õ÷Ž1HÙ‘ÃÁÀr@°j'Ü<úçÂL5$Ê`ôW#Þ
´‘[%ß©e×©UåBÓÂª¨&ë´Õæéfì×N}:[aVÄ'Ù„™=Jv»ÚØPhh þw+^RHµq€ˆ¾{ÙÍBtvýÉ,tCŽSváý†[¢°Ãpõüñx6–¬4Mä.\§¼ë¹9% r”Ñ@õò¹ºfÒEqõr–˜0¥±€¿ð+/Ù‰ˆŸ©\¤u­óÓñ¡ˆïíYrc“úØ†'] !$Øy*ž¦Ú/•±=ê¡Žý ¸ZÅ0ÝÀ¥èz“È}KÃÅâ6öÑ¥T#\Äì]Ø94<äP`
 9hû@›Æ"×«C|u…»5¹Öš¢ u¾-Ü_bÙïÑ¹ðkƒ²ïÑiÀÙmAûôÚ*[°ý2ÕœX˜$½¿ÚƒÝZýŒµ‹…#ãÏûÙðÉŠÉœ5§†e4B¿nåìÊCk xN6¬Xd’)m¸Àh#Ãm¯\”èbÜÌÁ™Xñ[º˜}åê%¡CÄ2««ÆÉæÄ¶V;w‚(®F=Ã(W¿¾
F…e1hd…ñÂ/Œ¯),m¤Ê¨gŽ;16£<ðQ:óˆŸ”èÛK(Õ‘LV;úƒ!%|ÔÍ\4$tÔÃñ³U9?\DI—úÐÀ¤KžÚ²ñ®‚‹åÈ‰vF<78m…±¡…ð0F-ž:ÊßmÂB_¸P_*÷P£û©0³ßkÞDPË–c6µR¬ìYœlÇcÍNy½Á3…Ho<T’Á)öNg#”Å¾q/ÊÔ–)(÷dîÊòDÝzÁ”®ˆsDÕrU¸ ÏRPQÌàUÃ†B¾1KÔ¼}^ž¦ßVžJÜ$é†±i§™Á³5EÓÓr
À/D<¥¢jÇ¼—°'zGó†Œ{ÔŒŠT®2p9ÌÂôGÈýMv3ÛÀz;Wü3v‚ï“‡¶Ã—0eéÞ/xº ^ÚP%Ä¤É	;¶¼½L¦«pœ<ô…ÑøÆ»©Z¦ÊÆ§Â·Ê<¡‘ Š*ßK¹©ÜÍê$í5^nÖ\Ÿr:rr@¯¹:@bW®Ã,íªŽ}‘AÒày
i¸‡êF÷Ò‹Š›3öZ¼D‹‚igíae 0±œGæ*¿…if2³#†É¨Ccò•FÈè¦Aœ°ÒoÐé;qt.ý'Ñ~ÔZA¹°šD½@µTŒúÛaÎèZ\£]RÈØÈÝ9†MñtµXìK#½ëI&´c±ÈN¹­š í•ˆ!"Ã,e4*U ]õ ÐA£.Äm1]À¨šþ\/çxVª	j¾­påî´Ï…Þ7Zi9Í1ß‹U‹4 ˆ¯tÄvS£#ê+„†×çKJqÍKHÿ
óz£]dOO¾ÁìmÉ¤^$xëHÈ(mé‚ÿ4s Òý›å©Ù”šûõ¡s )h†Ñãåf-­hÉ³`²ƒ¦•R]îà¨K~T`m¹Š(ô*{´ž½%—ûÊÎx ©!MôëÖæ¾1òâDå³i¤ŸbÍ¡pÇ/’½§r–}—IïÓ–ýÄ‚Œ_#4æÉoŽvÉ‹ÃçÛ¢S«‚î 3V]U]P£!ÈÁÙq•ÕÊª¥´uµy|šz-yÅbÜßT•OdÊE‹Btfb­°Lj³NýŸ¼@•yvASYà-íL
y¹I*x2~^É]˜ÇKåäÄhj$Ýx'Æ›ÂÍ4½²š˜»QÓ°W	ú¦à[üçp)3N(>­§¨ë,0†E50Ôz¬ð".íþÔj©ã7lÛnØ	v¯P?™qŽudTYµ&³`T°•”ËE…uâOÕ¡tI³_ÃðNÑéM£$çÏ(¨H­òf:Ùç-pxÔ‚ÝD”$òïT{äµy«·Ù¥$ŸÕwúi§Ó9+²Jhºê8¨Zù³Déýµ¶Ü¹¦@âm¢ïõ z-Lšn!Õ€jŸÅÍ#&®ë^<©~‰ùTqebŒIÇÌÁÚÃFªŸ]ã?Üµª¯SÖ¼
¤@Éà€©$[goÆá-ón˜nÖ™áD±ðgÑrB©R÷Øã«ÄnÕ5b®ßˆfZºØ)fwZÜ×+@0E[l1Ñ˜qÂ±
Ì\ÒÜ2£EìOÈŠÆ¬ð¹7ÈL_’Jæ¨T”¶O,Kô°}]§,%º8:ØÅóØØä`è›\Ö¯ž.-ñKÉ¹Ã~sö[Ü:Ýò¥äLa—å¥1I¤›„GÍ÷ì>2ëV‚êŸÎ>ýÔmâ	Ë?§~…n—…ÑÕHJ¹:°×¼;È7ÉÒ§­Vki•IÏéÈ’/†Ó´—ÈŒãZIÃåÂ‹t8Ý&Pn¡5Úu¬_›°¤ "í8…,·
.„ì¹óÂZãQ@âäOO,UyÊø!Í­0bÙ˜ô„,ð°×¹ô+O ìSíTHá›éïmØnN„–¬ÐE,ÈÑñýØ–ÂˆMGÆPªÆÚ„ç–?qóZuËqVWH+Ÿm£ePø2¸–XËÕ¢¡[]ÿRÂá¸,®ãÓQûû™¹Üµu£L59ÎÜ•f›ð†V$¬ ª‹*BÓÇ«-‘”nÉÈN…–»Ïrã pq>/¯àÅYÒ›šÛðgï,›Ã"Raro{§½³Þ:+Óâ:®Ô/ÐpyYì[Ç¥<…	1éjEQƒBoM)
Pcl%ç€öÈ¸Žš©JP¯éïqü„•¬ÍŒÉ”öžíÏýv¡_¿Ÿû„ví}Ú ¬C?ÁÑÏ&‘7"¸m•…¶ˆrpJìyuzŒÆÖ–ž|R¦Ìöññw‡/Ÿ«mzG0ƒ@	*“^Q~fŒÜq"­EØ?»ÙPYjàØ±w·4zÆ}ÉÊ¬Qf<h6Ý·«GÒH•!íªp¬$NF.÷WyÊø‰WAi¥S±ÕÖi=µÆ‘2€G¬‡™G´ükAèÎñKM¡…¡C—ÌÔ ÅiÑÍ,	ô¿ÃÂü…%Ñmb5êVœ~?åÏ«43žPßÆUe!”â¾…Ë×µZ-if5ÎQØ$r†±º~¢ÛÈÞ¶Ÿ5¬ünktáÏàL«‹c1²ï§77%c»”RWM”ðüoüOÊÿò*OÅbï•rïäA©f¢V›æ¢hã‘ZÞµìø“ŒÉƒSM½øö¼†µóH=åJLjä‹4Ç‡ªCh˜ÈxE@ÀE7È64³]â&™+|…uÿ·€9Ðc¨ˆ»/÷1Hë'n·äIÒ÷ÉÄ@rŒzÃ{êkœ´ù„´ËM$˜ŒAò$]“ýpn#Ò¦æt§’çB«bÁ•¦O”d8¡¼
ao"i¿×Ü±ãVŒh•¢¸ z£kšl‘]|j{ÿ-Vû­¥_/çš_%9¢ÕŒ›á]®MckXî;/î([_:el´Ž—DnBZehEÙÌÚù•ëNÉñßhÊéâ&ñ@«¦íŠ$( CO`*GŸ~ùBR ûÝÍdy©ë½u._Ó{–´+6¸T¿¼´æL½5œ·µeþÕx`XzN«€Ýhè÷7ÉÒÑáñÉÒªö¾!õz‡›äÚ´ÄóÚ«hš^‚VétÄQ Ö~úÃài$(?ð~ ÷Ããož¹N@M(t"nÞh¾Ñ·ÛõûW›äïŽ¿©±ú ._'Ë¾) ¹YÑ´t£sù‘²²Œ´°z`\wäÆi)~7%$2 M›•U·¥y¥šHÿ	g½ž†âåÜ	ÿí«OtœÇ jd‹Tu©T¸TŠ!£RÑLd2î&q&WºYÌÌafŒ„^Æ	ÔõVäÑnm,jßcxY‘·•Hcêþæ®™“R·o#ÎØÛÛ{NË€
nÀ½úN/	I:©è)HQj-LÝ+NÀÉ‹¥¯Ø€ãÉ,¥ûß»A#7ayw²´ÝŽÅõ6º¨Àâ)Úq&=w4UD{!‹Ã>1«,B®|í…p\%¦¼'ù«8Ç~èfæ8w_‚p™šhE“â·ûÏwÉ|Ü}™GÞùÎuó¹¿ö­‰™$—k¢€šË+]ck
œ›‹RŸßØHG®
òÂ^Y!UÖÇï$®¥‹`ÕÍÊSqO´	 %w±P5¦‹¸ú©ü}SZuq“¥Â×ÂtM¾¾R–+u›W#KØ=™ûcqë§‰·=§B«šFU”˜ý„ü7‹¢¸«7àùc‰f’–)Í7_ºÀöË·[K˜%“¹+p©-Ü´J–Üq×í¯-­ÔBã¢å¥Ÿ/­œÂîÞÌ>œ¾â
fVëºkÆw¤wÁKè/]Ô¿ñZö…_ª_¨ÐØNŽæéÑNE3ÁL¦âYUæWÌÑä|¾_UfŠÂ€Œ5rk7ø‚`L¾ø‚èÿ]J.Xì/ˆ;éWSÌh¦ó9¿
ü°çOá»©×}ùP•Ô½qºÅ*doxúd‘ÉÝOX~°¿ûÍ	Ùþêåîîü¤/!&Ä6¦¥æ;>âœÎ”ÁgÒ¤Éhæ\$E Y3Ïc¯É‡Ž‚£?Šé†è)x}>–·!§f«º®{ò„#–Î—iÊ.Tw>¹-³še$·d±¼É&¹SFoß	›W%G.ÌæYN.Õø’Gñ"ôQsŠ¹¢ˆílC²üš©Lˆ£Íá-ˆß	›µNcÓZ‹šVx ¥¢ò¼Î ª½`à'û/vÉÑþÎ¯@ØT2I8B„Î`žQJäTEýKÔÀä2B°N¡zË¤ãˆw‹¢È—syÛÞA;º\ûÀîÐL¹(fZïE”_Õ(T”)
B”qó}Í ©òÚh-`eÜéO6‰Õª²€„®À[˜EE‘u=›êpªÅÙ¾^6‡ 3cœÏ«o‘Ó3µmä‚Þ‰v¿-’Cœø/B­}ï®Ñì<xK?\ÖE§w¾ðF#/,¼]symìy“>kaNÁGbk‚§]8Ç.Ð+ËÚ—ãcø«O½p¢a­çz£åå¸©_k…¬ÁûWÈ/àïâ!³÷±&çòÀ–±CÞVýâ=iÂ_¿ü¥Û˜¯w_\Äxä¸oX~I<ÚqøtÙº~HL6µé,.ë“táQ¼ °/äjôÍåXKdˆ²t«5®~vÝO‡…øw†§TêÞ	uî^N=Æp„Z§TöÒ­a‡|m¸NÝi©²zôM¡Akîë#÷ýÛT7]¥÷Xö&¡”¯8*üå¡®¨IëfE_­	¹CŽü’bF%,ù.8ò»â¼}wàÌFu¦¤®Ý‡fÑº3fñó‰G6ñÈ&LKVQÞ²ûÕ«ƒmå®ï_ºç³‘ÃvûÂ6þ)°	$Y-¼n,KuˆI–h®UešeÑ.°Køƒ]²ÞeØ¡/¾”Á5©{×aÇO9¾<µD´²D”ËëRå#çæ7[Oër$ã=®m%1LŒ¤×Ûšâ½LÝ?bø
mÏªÙBL‘1Isžêj°i@åcåÜcˆ+OÓM¡ÃUQ¡^ÓB¹¦"@2Tµð¾<yèÌ"?' —ÌŠyÙàöyJ¸}\sÖZ—kZµ•µ
ýÀ~„Ö¦¦hmBüÄRMMŠ}|h~Ö£€°üôßb(ƒ¸ÕŽhyLHZƒmT>œÞ­·oû¦•Á¨T—-ä°§Êóñ:H)O°‘RÁÉÐEÕöÆ7Á&{aˆ¥ËÔøjUEý ±Ìâ—n%BŒ
ëÚ‚ðšË…ÓN5¨väÞ°!Ç#'PÏ™nuøÿùöÞŽœÀ	¿äðî›„Eá¬o“Lfã®˜1Þ§\R¥M!ê@É]‰SKÑE²¶R±œ^ »žê0-ðì\0¡:wvþ¸EåÖÔö—….„äŸ“õL†åGà9ž%åµÔä´/Œµnc-Ci	ñ@_ ¸„†Öõ ]úƒÙ\¨ƒæJGtåéá`àQæó} A8ô¦ ã'Ã¦19	zPVÏýàŠT¶+¼Mà[Íùç…k’2½
Ì,9gùµ¦Œ1,ÌEy‘¡™	½û´þ'‘•Z`Hæªµ¾±ÚYáfÅPMKQXÁÒ®ÍÜqƒˆ•©TøÒ‰Yáš‡M«a¨Kä1w²
€{0)älŸì ­Ì‰~¢K¸-ãÏ@gÐ$ÞÍT¹8•=LÉâ05z@K*TÁ¯ê3Ý8æà…¯Vtµe"{Jjùóñ”–Ezm‚3vRÚ‹”Ú)Í¢õFMÒDf¬„ZpåíŒT’)P…Xð2[ÖÞ¥7eCùâ5LåŽ²ÇŠW„w‘"ÏfÞ¥;>I”@¢¼¬v!œ¨2‰YªÎ³Eÿíþ›]¯ÕëuSÖ±¹õÓNñA“Á'¶3u—wFŽ7.ìÁ¢Ðéµ:ìõqgÊ%Á´\‰«ê>å9®,{¿½ë‹Ê–9¹'ô;z‚®»X#É^HP¤ƒ·^÷ºê,¸KÆ‰Ü@«'½õh¥2øq5o6ÅàfJ{«XÀè… ÁÔ”J[C½ ¢åv3åYPÓÈ\ åú´²Œ ÆˆIä¥K™ª]«BÒQàcÈ:Œ/¸ç  %CªœQ¥"rÎÍÖpï"ªIÀíÒ–‰¤AµgÁ,3Ç––IY	‰d¿#1Ôæ¤*Ü‡jƒ­Òü›ðn„—o_œŒyb;ŽâÛ•otŒAÃÛÍ'.lWúk‘ 9¶å„/å(ÆdÚéH‘¾Ç_ª°SèYáÀÊ˜(ò“&Ì™	šYk’(«ƒê¬ºi0õsz+}¿ŸÔtƒ&ú¾`âSË‡(
ú²	…¦$ç_ŒÙ›L	fÞzGI”—ó°Z\á/r¹S•#X»9U,^Ø–±Bèì€ù£^´63G=?'ãÞóCwÞ›
:J«ú5p8-<’@âî{á”·¸ƒKCŒGsXÍ²ÒÅÕò<Öƒó	aùáó|»PØƒø°b.¢¯Å¶«Ô
%ÖC,Qú°´¢”Öéí9ÃUÆjd²M¶²G¿‘ñÔ¯=“ZàD/Å´š·°~â‚Ï-j;¬âWjyBOËß ’™¦B^Y Jyí³'‡Þž™GJÞÌÔÉýÉÀ7X"™8ó®˜œC¼Ùüê
½ë¾<	Ë‹œ‘×+]7!wz§3­“/æª(›;;´"$MYÐèå¼($_!œçðA%ÃJÁV³~;‡Ö0Ùg’®ah,×Ëº¬>aÊ²u5U)<Tô]{.Bqº1C°_ižìÜV0tƒ©E<»‘
`™rº~/8fgómdóm{­”CB0U§Y´©MY4u‚Þ‰&±¶²¨…‰§ò«ym‹€­K!LX"_ª"“hPÐq²iÇR´‹QH¡Ø.^(ß"jÏ¹Ô!>¸Øi5lñé3E»±@aÌÄÂÉì¼Ì¬+ÖÀ6mÝÝ™¥¼¨àj{¾´EO®…pÜJG2Â&kÇC¸/9Ðõ4¼¥©>utòD» þHŒ9i¸cu¾É3ï­ã\!êä¹÷ÖCI]1Å¹#ænóOv~CN^n?ßÿæ+òõáwdÿ„|wøòWšpµz…¬†ÊÀ~ô|?oàZ;—Ì&ñYcdÚbÉgÍÐð
c¹&hIð'¢B„SBøœœ|Ð’:H“[¦šbMP¸_b‚2Cl ÄÁñ¨<‚yšTH¥ªRnuGZâ¢¼D#¦¢Z’`f+R˜BÀj¹Ò±ë½¡9ÉNÅIF58†ò³jdgèc%1‡Œ0bX¼LËç´©Ha™cÏÿùÜ¦ê|HüY@FF¬ˆ{	\0â=käÀ÷¿G€'½€\x‚Àéá*jÝè‡÷ð³3é£Í…Ê	‡¨ÍÌÚAÙ’–E:ÊÊÉ¾öÜ‡-QËMäTÉïƒrº£™›Uæ œøqÝD¬Fx”c×´Î&²;ëŸ»Ñý‘Ìs·‡ˆÄÀÚÈxû H…½×Ñ%‡_È…ƒ… |š½MÑð¼ZàÔT#¿›zÎn}ä””â/½1‹f‡æ1,ADé‰]ycÄýz8$tntõ.	Fò,@1Éóz’yé@%î\ÜÍ4jd84lBPª‹	xÀ„ãRÝõÆ$B#òHNGj²sáÜ¸âKLBâðÛ÷À'.°Qæâny]aÃ4¢dèôz”r?º_E(lê,œúÍ¥·rêìó=ó.‰i:¦£ÛðŸ´=9}#v£{ ¥fE&Pëp¿‚:yqôˆŽ¶‚pO(K…ÕFª©¼ zp‚~…DN7å2pMcRÃ#Ì™\FØ_ÚR€ ~ú}BX„LG³é‡ÚGbdÙJÙáÓÀöp~ï„ŒÒª«–ÎRøç>˜C8Õ$.5%©«Ô«8Æœ•´ü$7‡w‰BŠÒö³ÃW'ä•F/Úîú³èÕ-Rxa=JÁzÐy&3…Š5/%ó{„î ¥2+Šp<œ…Z²i2ÁÏ	F»Ã„M‡ó8QUöàk‡­›˜« sƒ¨k(sŽòçˆâEJ¨0e]lùái:xèªæ«EB’4 l¦l€¥¤‹Dí¹WzAòæB½]p»ÿ¤ç¶T%A3Òœ9éýÙéL¿Š‘‰Ÿ’ú|a5mã!Z:KG¦®qcFQ„Œ{¸Y6a¦0¿D7”žà÷[›ÀÓ:·ˆ&£Í{ÔIòÿ!,¸>"]õøðŸ¡Ï"‚ÙŠÀ¥rò°)Q*fVª”­Ú0–W*p­Œñ.a;ëéF`­…|­ÿöæ=‹³	Ü>¨êÝ’í^ÏEü·rµ„Aö u„•	=%ýœ™±3ïL9¿f!œœ0/˜K“h½Gî¼5|{j’Y¥Ù©¡‹RÉV¥aW|æ_nUêÀömb7+µ~«B¥
r9MÂ­Ê0Š¦›kkµ‹FÍÎ×ì:è‘Ð°Î¯¸½(~i£¾_Àû’÷p©±¢óä÷¼ Gvž± Ã½+öo°UYêŒÙ}V¯[ÏÊ4‚Ð4²·¾±khdêÀñÐßª¼°:Ä‚çv¬v>µéÍšEÿµá*Ù¨mú%|Ý!m¼u£fÃov~ÿÀø7}¿ÃgY³¿Mû³×Úæ¢ìÏœ|a|ë…NYŠh7ÑÄñÝE¤Ó·ƒnÕÚ6&×k-Äý°¿¶aðv“~õ5ÞôÛV­A,k‡þ»NšÌT»Æ?4kë;üƒEšu¸Ü¨5Icþ±wÒ ðX‹ îE£	75h¦^ëàû Qh ‹²ÓßHcZ=°mÔwšô;?<€¤àuÚ|§÷Á§6ÿÔ¨µwØ'xi6è	4ÓÁñX;Í6þÏ­cxÚbts ×6pé;p^ë@3ðd?­cû-úi§AŸÅkl^ZÐ
Ÿ¡ß¾°l¸N§®C‡dÀ7tdM˜ŽV’NW‡~¶±üº]kìØüº…±6ð_˜†zmƒ.ÑA½fá‡vºhmú•µÃ_š|t·Ð€Ï-þ–ö…,X­Ø!¶°úðªƒd¿}awpRp<°j­ƒ†tsÃBê‰ïHwŒÕl4w4;Ø¸cþnç™qÃd·ìt-ó$‘äx$Q6‰¤ò^tW)o µõ"•z$x½øÆRR­1HPÞðUG5ëRÐ3s+èñ8tÒí</O5Ïy’ÌÊË§Fét©V2ÏêÛç½1ËÄLýÚÇ,¶‘AÑ˜‹|.˜ÄD´(üÛBKMÑ,ïÇ™\ás7¦ä$³i˜éºw8ý~à†á‚"°.L3ž•ÅðaôÏ(tøÂñFï€¦4ZÇ@cóæ•bl¾‰lZ[£Û¼ 4*–[\f¬”Ec&³Âfj+
Èê‡QÆoy‰ ßò¹‘ÚìOàþ4þ‰Î‚ Ÿ @p¢<Ö3ú	h©ÆÊkæì`Û•§‚¾a{§]]>þÁ²Ã&~I&þ¯Ê/€tsŒŠ˜Mo#öãf­Ý„;½j„z«ÖêTAvnÕšvÕªY Ô¬ø
t†V.«ZkCKµz£
÷Öê-¸­nWkN•=Œ÷u:ø%\€«µfÕ®Ùü~ÆÚðoƒ>r1¾¦
Q‹¾ddîÆaÔÖÛð©½wUámô«	×«´KuhºÞâŸ¡6(5ðí™…ÒsÍ®‚šÐF%	mYøÎÚ¿]¨5ÛUl~‡–mx!\Â	°°=¸ŒßÓ™hâ è mP‚ðêNÅ:6¿¬£.lC×7`Î:Í*èc ±ÕÖéÀA]Â^XÐ2Ì-}cÇ†ÎÂ:Ck8¼æN2vŸ~ õÄÿÝ¢CÆ¹b·~ %@+ñ¤»†Gƒ0ÜÅHªÅYÇœ:ã=¥‘O¶O^ï“o÷w¿Ë×Ñ9qº48»œ1š…nXY¸¢NŠƒ:pðöm>Ê°[Åx iòµ„
«v‰ˆRZÔýd—È˜q¢&Ý‰<ë€eJÚ†âW'ÏRN¡ü©"5#&jÞsº/Þr…FÚTV4È¨™ÈÔêxË©…¹­’Á°‘ªvm´3ŽÂ“­À'Õìí ð/(þºÚPp£Ú/s®€N(“âNú„×fâYÜj}]‰ŒqªÐS8Ø4ù>f¯<}îŽý8>JŸ‹¯~#…&Î¦±±k‚Z Ÿ^ÓØÏˆ´¤G~ïj¹/~ÆÂW	p‡ þfE‡	 æq1u—#ä,úØ ×o5ZR):·Û¯7RÔJŒ3h‹H	‚u$ÌÄã–4Ð„îD½©u>|“~9’Íë¯ÌóàM¯RYÀûxÔ¶!3jJ-7ÀöX"ZÊsžu¤Á©Õ¬SÜÿ¡tâäcGxZUâ×nÚYè	ëTëhÒ€çxÌO+5.©)‘:^ø¸½tð]ˆ>bÃ›_ø¥šf ¸À1 ­gãQÌ×Á`sÚQŒG/%,o:´ºîcí¦rÞ­dÉ/G)Dlj°æ*×h1½âKÐ¨3¼=9‚1Õ¥;Ò¤ncžÐËÝ]²³ýòyIë-‚W€l·ÖJÎÎ|Ê[Ò{žÔË¡¨™ˆ§r’Ê]<+ß¥$b¨ŠÇy“TãÈ¡LoTyòÜsÆþ$õ³ê ñ)4"­ýë.pþ¦ÕV–œÌDè•LãP·CãfÕ8R\œ†{ëêìÅªî]¿ùŒK‘X¬˜mI–é‡-ažßeÖõzo£×¥$±D6éwt®,©6&ìÑ¥nv3Ã©%yœ°¥h´Vþˆ×pö Û†£g4`Vé77»š*ÆÀ–N¨q€ \ù R45¿ÁèSÆèt¼šŒüÞ÷nIËa2z*ˆ'¶ß7èˆçAcKv.î;¿I-*:Ç»X&ËŒ²6Táþû‘‡-X Â1÷*·0ü†>ž Å(gDJ¨çdÐÖ„x5[?n­ °.?jáq:Æ’€dÕ—DDsóóâåÝŽŒºY1M894].E9Lm)lZ?p°$Mÿ×qã:	øeag—_5$3	Àm.zû
[.sË\Ä.°R3Ý›ß¼0s‹:­fO“Ø	WžæKåVžªõ­8=¹ò5©~à\8£˜ÉäžPe™£èðôßþøïãgæÜ¬·î¸z"é}'ÂÁËjCw4ÍÂ‡íOÞ"»Ø<P–?¨Á£®=õAO„ÁN˜‚qO¿½sdÙáZù«”›øâ“_«w¿0Z«ßˆG_Þ‹ÛˆîIÃŒ{	é\a•Çx<±Ï§>¢Ic‘ï“‘Jš	cà¬Å©âáøÒ¿¯@Ìã ÂB²qz“·n±±c¥f(Úû=:”_i<fHöíþü3&Ï‡1†#X&Ž	(ïÁ‡ÑëýI8h¦î N£ã;&ÝBq.o€Æ ½ú‡1´³Qäz6é#²3®|='Bï|"ôïw§w°´·OÐ ?é;ù#§û]oìg:ý0úüNäáèŠì€È„î#r„9©þ€´>§›x[š²ÒÁl$ë£ïùÀ¾A5ÏÇ
M$œM1IûÃèz,ày1;G\›ë+½ˆÇ³ß<Gëê»1±¢mEÈô×ÄN÷a“Á|xVØãÈA¦Ü¿KlÜZ‘5vc>GnäöùþŸõ#òtuþ¬ÆZ«·å‚R²´ò1s¥ÙÍtg41øâ°úúš?9ã¯"iö2ÄÑÔii<AÕM×õmàO^Mãµ•‹g0ÚÊžŠµfH´úà¼¦Úû0Z3›5«‘Ði}^Êfý°&ëG›ò=Ú”íG›òBo~´)§¡w•§Òw®n¥_|°fe:~Æ>?kÝÊ&òÎŒËÂ€!~þQØ˜e(XÖvèŽ=–3¢×Jh‚‚è¯8ÜÙIúhƒ~´A?Ú mÐ6èGô£úÑýSµAuxð@öçq_]Ö¦ñ öe“9`QsZOúÃ³0Öå²
5¾Æˆ¢—s¢‡qÃ–­Â4@¥iYtôšÕœTÙ- ^ ÁE'þ3't—›v«¾J–ž=?YZÑ$»˜ÞBƒÖH™÷ÔëE/2Mc‘­E‘%WkÑ@/åX^d N[Ïðþ&ZÇ’úçrNgqµæû²é<ÚÁ?.;øFýc°ƒÓ)¡‰ç£Šû£NÂSËŒ¥C*k'§8ˆ…–r…¡¼­0”£¼Qh'/e&¿'+¹’å½™ˆ2(ÉØçØ–÷jœ|
BXˆwŸlð¢-¹ZCïBGaÇèpi¿õùÃ^+t.é=zoÊ›þí&ú³àÑóøoZï…ÿfn‰øÑ‰óèÄytâ<:qÞã¡=:q8NœG'ÎéÄ!sXÞ#ŽŸ¦,eÏ™`ÅøO”éÚ¬IJ˜MK¨ƒzn°´ò…ù©ÈwÂ¨Æityé% XÊÀcRo%•Û|2›žÓ’‚,žú“‚ÜhÃ¦ñ'ïÀšVJXºHcÕÑôÁ”â†Óúëæôò5Æ»¿Î»Î²Ý²Wm«±Új¬Ök•3Qí´^Ûèœ)ÐÓâ£ŠýŠÍ“IÇV"R‰7ÜµWìíœŠ(þ·ÛƒÁ÷[ôAcŒª‘_íTÐn€‹øK³ß³ÏŠÝø…ÎÝÈ–ý7Ø—*ýî¤5!ñ
[.«Þ"? )K¶†~Ú¬oØÐ¡µ†Î¾¯0³~jYÖ™"A"µpqKÜeµEÁÍ€ 5¹a¤ô›É¦±x‚(œ¾(ùØ‹Ããrtxôê`û¥ÙÒž_QÜ(Cúw\ ·IOÎg³•NµÑ4‡U2_Yvìî,än”t3Xî‡öÿ
t1Ÿ+øÔng(m`e¼2¸£ÄNÞ*ÊÐ2›ôøüiø˜ùBÜ§ƒ™×‰(é`î´Þ‘ƒ™ÒÔš}ÏfÆá˜me\ËÂù[g§/½õì¡]Î:nžaÖÒÊ
LîÉ¬±•ÝÇêƒ€D{âOÉž’Qàxžæµ6YFÀ…
üÕ‹:4•2-õkÄ&Cô0˜<~šHO±Gä)@‰a÷ÔÂÚÊÓ=n)æ#÷o‘‰ÃVy]ðò3Å$cGÿ*®Ïê{Â}4Á5o–ÿíö„jrîjåAõ³&ã÷xý³†Úû'#›ÁŒ¾9ÍŸb‘Â1qt‚ÅµEã@íhã!CtØ™ƒŒÑä«NØ§Œá}OÁ:ìmí»ÖIE«5Xç=
®™“®æ	zÈá;‚(aÓ|€›dû<t„M¼Á$Âæ'E`·³IubÕï?È&G{ds_Ô÷ÀA6¢¦ò€A6ìµ…‚l¸ÿŽlâžkf²qß6|ô<º¦óðá5éÒ-^#À~øÜè¤@ÌÝÇÖÜCüÌû>soc|_"hîm€DsoÃ¸ï8š{ëø{Jso£{ˆhš{ëü=ÔÜ[¿ß£˜Ñ™£… i™¢¶ECPcÎ‡ïS€Í‚øÀ¢må{z³à8Þ—8œòN“8*çîSš¥ÂR:ÓË×v–R_¥t)± Û¢&î-åèåîñÉþW·-`uúi»k[N'ˆÇ¡¬»¶ÝsyJ«cõ:ë%âPLa(ÙÀ’F£á:gÔÿ;_,„ptJ´ZÆµ]4,âôS§ÓjÖ|õ„F @xçnÉøˆé,˜Âã†w!Á§´ÿµvÉ0‰F»þŽâ$xg7Zuôüßk°DJn1aFL|Úït›ƒ÷;fBSAÔ¿³Sÿ)ÅMPYuûúC;Í%áúótëøÌ·û}*9#”ãÙ„^Ñ	õÄ…}xº¨1K
©þþIäpj³%w¯X×1|íÁ¹áx“èªFö'½À–ÓOì¤IAiŸ4ÌœA­Ç ‹Ç ‹{²(KW¶ü#	²¸M°ÃOc¡
ÁïYÐ,è?†<†<pØAã1ìà1ìà1ìà1ìà1ìà1ìà1ìàû}¿Á÷Gãï>ÄàÞÆö ÷ÖûÇp‚Çp‚‚r×2¤_WnâFŸœxc÷·þÄ}á÷AèHn÷ÂÃ©;Ùº‡þ…tK´€-~èÆ-¡go^Àqã
$Cw§ÛïÚºŽø'±Ýcz×Öµ^Mzdyâ^œüÃ÷Å­ð;D88–yD È\É@ÈDÁUTôdØb³iß‰Üç~o¹ÿwWI½°ae•íÕf^eUKg“Ð>e¾¿ÉAÆÈ 4opDäxž÷£O5ÑkÚV-p§°-Üåµ×kç«d‰,­Ü¼É4ÜÆ‰zC²ì¹1‚ìÉ¹5øÒ–+{œP}†lƒ/£Ç—oÂ`±LÛ?S}N`nÖB}²=ñÆÐ†!¸À¬R"¤ätÊ…¿Ýg÷óŸã¹ãOÞù—µ‘îMø÷¯Ý‰ÓÅþÁ-Ë"]}Ü÷5dSRÿ¼	0g´u}•l’z†Ça]“n²²7¹—^dnF<¼KZ%èûÕÓø93XÑù¯‰	r]á@›dÖá.t@ÞûÚ‘æ„2>Jm£µJ`Lv}Õ0@i¦ø£}N|,7séÜÍû:aF“C†Ÿcç²
Ì½Ù¤®øø8mÐ ‘l¤’b'fFW#:8œûsÚ(ÚÔÒc÷œÞ@þð²ôi¯ßØ¥ì8²\Ã¾(—$ÏØy˜úÒÂae0°8wOŽ½*&SJïj’8ìŠ†+]T;dÿKñ	]6ë"ÚO!='G9{½`é!ÝÃ™3t>îg%r™ê×Fq.¢+=ë±?½šlƒªXkÝê{øÔ«`”eGü…ê°='œÂA¤»Ö8c‚åXŽÝ<3£?ñÆçjù,z[iÕ=¼Q?êŒ¢­
½·¢¾!ß}³ãw‡£èá+1ÁF>Õ/·*#ç‡+e€RÄI¥ø‡nú€¢t”Åë hÚÎl|Q<7ài<ò"Ðß”«ÝÚŠ€½Ž²&Ù¤¹@·zôu7OÖ†v¾Š®í6(e½À›Òmç§Š8§å¦<s£žt)O8è~Gß}áµ0ˆi©1”ÛÍ'ÐQý˜Ì¨‚s 
¢è¨%{ì±¼l•ýa¦¢šRtak Ì½®9ùÞ)hÔŸºµø„÷¥²12£1­jõmt^…P£fé¨3¥å õÊ[ŽjŒìÉZ*É
˜êzÒâ“µœ˜\N~þ¦ìp°”ˆÐ |œ
YñwÜO…º+j{0ˆ¾Yc…7©«ÀŠÐã–È‘ª£K-@¥–!ÊMŽ™÷ÐÎ)žegn	­Í%´v,¡Á_Cü+F[kÉâZy¹,	eÈÉeù-¦”JdQÌnbÊÊc¹‰Iü@†•#’¢QŒ¢ÕG~×aÁË#çŠŒèIìèö*—!-‹ƒ¨j­ÙD ã¼¤@EiÔ©Š2L>Q6¹··k7wÎhKq`_N}GRuß¢‡ª:Aµ_Y—¬D/AÇib,JSNº·÷|·ùœg…ìíl×­½LèõDì˜‚Ý c[«¶m¯®¯s‹.F2Õƒvª—7W¦¯4v×rxG-ÛjX³9‰>NT¡§M’µbõ¬>ßæhFåÏœþ¹{äØ'øf=Oðé¬Rþ•‹]ÏO\gEŸ‚Rl
T|¡Diîü8i„ %Ú©ƒv,œÿÞÈ›Vñ‹ìbpª*bÂEþV^¡Ù”E‰Çix<Ä8f¦-‚Ì£âÕ®R&•ÌqÑAŒ, ×cvÐÅÎ0jÜqGn7p”óÐ%b>0CZ¦%÷S*ùX®åÚ3Tiå“
3¦dkj#"´r¦èÖÊY†«¡÷ ÃæR{¦¥×ëS-!_CûÎù&©ü¿ÿø§‚ÿÿWeãÐÛ.Zív§ÞøÅ/~Wß:#¸²Qÿ-œÌR×¾™]û
¹Y-õÞÿÿÿù½ëëVÃßÛiçÞ›ñ·Æ¦nóÎŽÝ¶7¤w6rïôa[œ»”²á­ü7ZHK'%ŸÕÆÎty™Ð*ñ¨ ÔKø¥¯ïÝ«­kïFãKRÛ´MMç´W–Ì4tý&•@ÄÂü!óÙ5¾®FgõF2%A!×÷y¢¼¹yzíýÒº)k¯Œ«âš¹ÈªÆ}Pfi—‘xJäVšOŠxI…†âá¬s'Í
âWs*-÷öRüú°²Š÷©‹(±`ÉÄà+D’ÄÖYØ<·MA[QHÂ¦ø³÷FÊaÓúheØÃ«OÊócåH*äÅ“Ñy‚RúõçnaäôS§í¸ÝÉil’F:œ\N@ ézçç4WâD³`‚*É"Òˆ½ao7êg4L6«7'ÒˆÝdÒH[,2;Úz±CV””:þþÿŸÒIõO‡þä¼n×ÉiüÙºÕ\m¯¯×æ8åÿ
ÿÿEjûÅ,„†¯Üð÷3nÓÆÛu{µc7j Ù/.B¼tÆNÚdÓî¬6Û¬Éw,Ü\`ŒKW7tÓØ0þÓ¡¨õæƒìcIYÀ¦¡w  ÄÝÍ‰/œ¨âîç\A:ìßáY/!aøùGzÓ"H4¾í'q”¿š„‘?b”ÙóƒÞ<¶…;9Î'³q¾õI4äÇ{œçOÅï<7úÿ}r0¶êëvëîðf«e7n©ÿ7%›C£Ój[g÷ãÙýxv<¢ôvÞÞÍYÎÏyùÁUÎ»I¯~ë¹@gRÇà,<7Üº>>9|¹¿{,’;?÷Ì/·®ã0TÚ½&ß­m¥w+<zk%‡ÍÇæ…ÛÓé™‘‡—ÛñZ×)ˆ«i­gmÉãþ&ýø€=è;ï:9þæœËÏÝð{8SWr¾±œ‹¶ãïCß×:•ÅFç›ø™ç ,Öï]·Û‰|“=¦0–4f—xL;¯Šá9µV‰½J«¤¹JZŒ{zÆ²ì7!LA5„ñW?þýæFæ“rxÜè<‰iÖcOyu:zàb!-7Ž h*)»ïTÒ²Šçƒø“YdoR½¨Öù´ªæÖökýéÒªœyŒ¦Ó]9XVøÜn&.ÌÌªu³«VlÆ¦¶EM»¤RŒv-u³0ßÉ—?òrK9÷úéÛ¦ºL[<EÓíAñòïòe[6Çƒ$8ÁÜÞÉ+ç Á»ý¢¨œûî¤ÏpˆÌaŠ@Þòk‚û£ÏÒâ iÉ©uûÖd%©ÁŒ(©ài,ëòa
ð=˜6Ó¥?Ôz„é7bŒ(652KCwRÜñdÎvejLƒ×BØØóê	x€Þ³»ÿ7Ì¹’pœX,*ÔF„Ñù'R2ü°/Š?Œä3øÍ9âèà_H•!ô3Peh@à?×§µZm;€i[n´W¸ú:VA™…6›W²U7ÛA\¥ì?Çj,¸X]?Šü1L	ŸâÁÚe¨[í¹N˜È÷ÕÂ[–‰•`‘†Ù)ÎßÓr˜—4èìÈ™¸£2¢¶n2ó"·ÝNƒÌ,ÇêZƒ3u¶Rn‰Y ô¤.’ÂT}H %ç>ùV:mKI<ömÎ­{ÑœToZ¤$OC£hš÷%ÐPy¢óàMÞ†Ù$<áxa
ëäúïŽÝÀõ1–Yµ4¾[™ò]ºó¿èæå®9ó‚B”g0¨õ©’èRŽ¡â4QYC³AÆ)BÕÈ]CŒÝ¾	ø!Þ±ÈÎ¸ÝÜÈ°vw¼ô¯¹sò×NO,è9´2§¥ë¬¤P|Ö!cìw«ç­RÎhg•ÿ9ŒD·8J\. È\{B×gå‹ŸÝ|ñ³ÿ  ÿÿ TŽøç