import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, ExternalLink, Image as ImageIcon, Zap, Award, 
  Gift, Info, BookOpen, ShieldCheck, ChevronDown, CheckCircle, 
  HelpCircle, Users, TrendingUp, DollarSign, Smartphone, Laptop, 
  ChevronRight, Star, Lock, Activity, ArrowRight, Play, Search,
  Globe, Coins, Shield, FileText, Check, Cpu, Layers, RefreshCw,
  AlertTriangle, ArrowUpRight, Mail
} from 'lucide-react';
import { db, collection, getDocs, query, where, orderBy } from '../firebase';
import SEO from '../components/SEO';

interface BlogItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  createdAt?: number;
  order?: number;
  isActive: boolean;
}

export default function BlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'showcase' | 'bonuses'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [activeAssetCat, setActiveAssetCat] = useState<'forex' | 'crypto' | 'commodities' | 'stocks'>('forex');

  // Live Ticker Prices State
  const [tickerPrices, setTickerPrices] = useState({
    BTC: 64250.40,
    ETH: 3450.25,
    EURUSD: 1.0854,
    GBPUSD: 1.2982,
    GOLD: 2514.80,
    TSLA: 189.42
  });

  // Simulator States
  const [simPrice, setSimPrice] = useState(64250.40);
  const [simHistory, setSimHistory] = useState<number[]>([
    64240, 64245, 64238, 64242, 64248, 64245, 64241, 64246, 64252, 64250, 64249, 64251, 64247, 64248, 64250.40
  ]);
  const [simDirection, setSimDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [simAmount, setSimAmount] = useState<number>(100);
  const [simTime, setSimTime] = useState<number>(10); // 10s default for quick engagement
  const [simTradeType, setSimTradeType] = useState<'HIGH' | 'LOW' | null>(null);
  const [simIsActive, setSimIsActive] = useState(false);
  const [simStrikePrice, setSimStrikePrice] = useState<number | null>(null);
  const [simCountdown, setSimCountdown] = useState<number>(0);
  const [simResult, setSimResult] = useState<'WIN' | 'LOSS' | null>(null);

  // VIP Calculator States
  const [calcDeposit, setCalcDeposit] = useState<number>(250);
  const [calcTradeAmount, setCalcTradeAmount] = useState<number>(100);

  // Subscription States
  const [subEmail, setSubEmail] = useState('');
  const [subSubmitted, setSubSubmitted] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  // Core background ticker interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Tick general tickers slightly
      setTickerPrices(prev => ({
        BTC: Number((prev.BTC + (Math.random() - 0.5) * 15).toFixed(2)),
        ETH: Number((prev.ETH + (Math.random() - 0.5) * 2).toFixed(2)),
        EURUSD: Number((prev.EURUSD + (Math.random() - 0.5) * 0.0002).toFixed(4)),
        GBPUSD: Number((prev.GBPUSD + (Math.random() - 0.5) * 0.0003).toFixed(4)),
        GOLD: Number((prev.GOLD + (Math.random() - 0.5) * 0.8).toFixed(2)),
        TSLA: Number((prev.TSLA + (Math.random() - 0.5) * 0.15).toFixed(2)),
      }));

      // Tick simulator price
      setSimPrice(prev => {
        const change = (Math.random() - 0.5) * 6;
        const nextPrice = Number((prev + change).toFixed(2));
        setSimDirection(change >= 0 ? 'up' : 'down');
        
        setSimHistory(hist => {
          const updated = [...hist.slice(1), nextPrice];
          return updated;
        });

        return nextPrice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulator trade active countdown loop
  useEffect(() => {
    let timer: any;
    if (simIsActive && simCountdown > 0) {
      timer = setTimeout(() => {
        setSimCountdown(c => c - 1);
      }, 1000);
    } else if (simIsActive && simCountdown === 0) {
      // Evaluate result
      if (simStrikePrice !== null && simTradeType !== null) {
        const current = simPrice;
        const strike = simStrikePrice;
        let isWin = false;
        
        if (simTradeType === 'HIGH') {
          isWin = current > strike;
        } else if (simTradeType === 'LOW') {
          isWin = current < strike;
        }

        setSimResult(isWin ? 'WIN' : 'LOSS');
      }
      setSimIsActive(false);
    }

    return () => clearTimeout(timer);
  }, [simIsActive, simCountdown, simPrice, simStrikePrice, simTradeType]);

  const handlePlaceSimTrade = (type: 'HIGH' | 'LOW') => {
    if (simIsActive) return;
    
    setSimTradeType(type);
    setSimStrikePrice(simPrice);
    setSimCountdown(simTime);
    setSimResult(null);
    setSimIsActive(true);
  };

  const handleResetSimTrade = () => {
    setSimTradeType(null);
    setSimStrikePrice(null);
    setSimCountdown(0);
    setSimResult(null);
    setSimIsActive(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim() || !subEmail.includes('@')) return;
    
    setSubLoading(true);
    setTimeout(() => {
      setSubLoading(false);
      setSubSubmitted(true);
      setSubEmail('');
    }, 800);
  };

  const getVIPTierDetails = (amount: number) => {
    if (amount >= 2500) return { name: "VIP", payout: 95, perk: "Personal VIP Manager & Express Priority Cashout" };
    if (amount >= 1000) return { name: "Platinum", payout: 92, perk: "Priority Support & VIP Exclusive Promos" };
    if (amount >= 500) return { name: "Gold", payout: 90, perk: "Weekly Cashback Refunds & Express Cashout" };
    if (amount >= 250) return { name: "Silver", payout: 88, perk: "Higher Max Trade Limit & Exclusive Market Signals" };
    if (amount >= 100) return { name: "Pro", payout: 85, perk: "Faster Cashout Speeds & 50% Welcome Deposit Bonus" };
    if (amount >= 50) return { name: "Basic", payout: 82, perk: "24/7 Live Dedicated Customer Support & Basic Welcome Bonus" };
    return { name: "Starter", payout: 80, perk: "Standard Execution & Free $10,000 Reloadable Demo" };
  };

  const handleNavigation = (path: string) => {
    const hostname = window.location.hostname;
    if (
      hostname.includes('localhost') || 
      hostname.includes('127.0.0.1') || 
      hostname.includes('run.app') || 
      hostname.includes('web.app') || 
      hostname.includes('firebaseapp.com') ||
      hostname.includes('aistudio')
    ) {
      navigate(path);
      return;
    }
    
    const mainHost = hostname
      .replace(/^bloge\./, '')
      .replace(/^blog\./, '')
      .replace(/^news\./, '')
      .replace(/^partner\./, '')
      .replace(/^affiliate\./, '');
      
    window.location.href = `${window.location.protocol}//${mainHost}${path}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogs();
  }, []);

  const defaultShowcasePosts: BlogItem[] = [
    {
      id: 'copy-trading-masterclass',
      title: 'Bivaax Copy Trading: Follow Top Professionals & Grow Your Portfolio',
      description: 'New to trading? No problem. With Bivaax Copy Trading, you can automatically replicate the trades of top-performing professionals like ALEX FOREX and TRADEMINATOR. Set your budget, choose a master trader with a high win rate (80%+), and let our system handle the execution. It is the easiest way for beginners to start earning while they learn the markets.',
      imageUrl: 'https://i.postimg.cc/Tw9xf0K9/Screenshot-20260826-141703.png',
      link: '/copytrading',
      createdAt: Date.now(),
      order: 0,
      isActive: true
    },
    {
      id: 'referral-affiliate-program',
      title: 'Bivaax Referral Program: Earn $10-$20 per Friend & Up to 80% RevShare',
      description: 'Unlock a new stream of income by inviting your network to Bivaax. Whether you are a casual trader or a professional affiliate, our system offers industry-leading payouts. Share your unique link, invite active traders, and watch your balance grow as your community trades. Learn the rules of the road and the fastest way to scale your commissions.',
      imageUrl: 'https://i.postimg.cc/GhDMD2QL/Screenshot-20260826-141630.png',
      link: '/affiliate',
      createdAt: Date.now(),
      order: 0,
      isActive: true
    },
    {
      id: 'landscape-mobile-terminal',
      title: 'Pro Mobile Landscape Trading Terminal - Fully Responsive Layout',
      description: 'Experience true desktop-grade trading on mobile devices. When rotating your phone horizontally into landscape mode, Bivaax Trade dynamically switches into a full-screen trading view featuring real-time candlestick charts, live asset selection (e.g., AUD/USD OTC @ 90% Payout), remaining countdown timer, live community sentiment gauge (51% Call / 49% Put), and a vertical scrollable order entry panel for seamless Call/Put execution.',
      imageUrl: 'https://i.postimg.cc/XqSnstSs/Screenshot-20260826-140147.png',
      link: '/trade',
      createdAt: Date.now(),
      order: 1,
      isActive: true
    }
  ];

  const fetchBlogs = async () => {
    try {
      const q = query(
        collection(db, 'stories'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogItem[];
      const hasSpotlight = data.some(b => b.id === 'landscape-mobile-terminal' || b.id === 'referral-affiliate-program' || b.id === 'copy-trading-masterclass');
      if (!hasSpotlight) {
        setBlogs([...defaultShowcasePosts, ...data]);
      } else {
        setBlogs(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs(defaultShowcasePosts);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'bonuses' ? (blog.title.toLowerCase().includes('bonus') || blog.description.toLowerCase().includes('bonus')) :
      (!blog.title.toLowerCase().includes('bonus') && !blog.description.toLowerCase().includes('bonus'));
    
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const features = [
    {
      title: "Real-Time Advanced Charting & Indicators",
      desc: "Experience zero-lag live market feeds with responsive candles, tick charts, custom drawing tools, and built-in technical indicators (RSI, MACD, Bollinger Bands, Moving Averages, Stochastic) to help you predict market movements with surgical precision.",
      icon: <Activity className="text-[#FFE24C]" size={24} />,
      metric: "0.01s Price Sync Rate"
    },
    {
      title: "1-Click Lightning Execution Engine",
      desc: "Never miss a fast-moving trend. Execute High/Low digital option contracts instantly at exact real-time prices with zero slippage. Optimized edge servers ensure super low latency order routing worldwide.",
      icon: <Zap className="text-[#FFE24C]" size={24} />,
      metric: "<50ms Routing Speed"
    },
    {
      title: "24/7 Secure Deposits & Express Cashout",
      desc: "Fund your account and withdraw your profits hassle-free via secure gateways like BinancePay, USDT (TRC20/BEP20), BTC, ETH, and local payment methods with instant automated verification.",
      icon: <DollarSign className="text-[#FFE24C]" size={24} />,
      metric: "Instant & 24/7 Processing"
    },
    {
      title: "7-Tier VIP Loyalty & Payout Matrix",
      desc: "Advance through account tiers (Starter to VIP) to unlock up to 95%+ trade payout yields, weekly cashback refunds, dedicated personal account managers, and express priority withdrawals.",
      icon: <Award className="text-[#FFE24C]" size={24} />,
      metric: "Up to 95%+ Payout"
    }
  ];

  const vipTiers = [
    { name: "Starter", minDeposit: "$10", payout: "Up to 80%", perk: "Standard Execution & Free Demo" },
    { name: "Basic", minDeposit: "$50", payout: "Up to 82%", perk: "24/7 Live Support & Basic Bonus" },
    { name: "Pro", minDeposit: "$100", payout: "Up to 85%", perk: "Faster Cashouts & 50% Deposit Bonus" },
    { name: "Silver", minDeposit: "$250", payout: "Up to 88%", perk: "Higher Max Trade Limit & Signals" },
    { name: "Gold", minDeposit: "$500", payout: "Up to 90%", perk: "Weekly Cashback & Express Payouts" },
    { name: "Platinum", minDeposit: "$1,000", payout: "Up to 92%", perk: "Priority Support & VIP Promos" },
    { name: "VIP", minDeposit: "$2,500+", payout: "Up to 95%+", perk: "Personal VIP Manager & Unlimited Express" }
  ];

  const assetsList = {
    forex: [
      { pair: "EUR/USD", payout: "92%", status: "Open 24/5", otc: "95% OTC Weekend" },
      { pair: "GBP/USD", payout: "90%", status: "Open 24/5", otc: "93% OTC Weekend" },
      { pair: "USD/JPY", payout: "88%", status: "Open 24/5", otc: "92% OTC Weekend" },
      { pair: "AUD/CAD", payout: "87%", status: "Open 24/5", otc: "90% OTC Weekend" }
    ],
    crypto: [
      { pair: "BTC/USDT", payout: "95%", status: "Open 24/7", otc: "High Volatility" },
      { pair: "ETH/USDT", payout: "93%", status: "Open 24/7", otc: "High Volatility" },
      { pair: "SOL/USDT", payout: "91%", status: "Open 24/7", otc: "High Volatility" },
      { pair: "DOGE/USDT", payout: "89%", status: "Open 24/7", otc: "High Volatility" }
    ],
    commodities: [
      { pair: "Gold (XAU/USD)", payout: "91%", status: "Open Market", otc: "94% OTC" },
      { pair: "Silver (XAG/USD)", payout: "88%", status: "Open Market", otc: "90% OTC" },
      { pair: "US Crude Oil (WTI)", payout: "86%", status: "Open Market", otc: "89% OTC" },
      { pair: "Brent Oil", payout: "85%", status: "Open Market", otc: "88% OTC" }
    ],
    stocks: [
      { pair: "Apple Inc (AAPL)", payout: "89%", status: "US Market Hours", otc: "92% OTC" },
      { pair: "Tesla Motors (TSLA)", payout: "90%", status: "US Market Hours", otc: "93% OTC" },
      { pair: "Amazon.com (AMZN)", payout: "88%", status: "US Market Hours", otc: "91% OTC" },
      { pair: "Alphabet (GOOGL)", payout: "87%", status: "US Market Hours", otc: "90% OTC" }
    ]
  };

  const tradingSteps = [
    {
      step: "01",
      title: "Create Free Account",
      desc: "Register your trading profile in under 30 seconds. Choose your preferred currency and immediately receive a free $10,000 demo practice account."
    },
    {
      step: "02",
      title: "Analyze & Predict Market",
      desc: "Select your trading asset (Forex, Crypto, Commodities, Stocks), pick an expiration time (from 30 seconds up to hours), set your trade amount, and click High or Low."
    },
    {
      step: "03",
      title: "Instant Secure Funding",
      desc: "Deposit funds seamlessly using BinancePay, Crypto, or local bank channels. Claim available deposit bonuses up to 100% to boost your initial trading balance."
    },
    {
      step: "04",
      title: "Harvest Profits & Cashout",
      desc: "Earn high payout rates up to 95%+ on winning predictions. Submit a fast cashout request and receive your profits directly into your personal wallet."
    }
  ];

  const faqs = [
    {
      question: "What is Bivaax Trade and how does binary option trading work?",
      answer: "Bivaax Trade is a premier digital and binary options trading platform. Users predict whether the price of a global asset (Forex, Crypto, Commodities, Stocks) will rise or fall within a specified time window (e.g. 30s, 1m, 5m). If your prediction is correct at contract expiration, you earn a high fixed profit yield of up to 95%+ of your trade value."
    },
    {
      question: "How do I make a deposit and claim a deposit bonus?",
      answer: "Navigate to the Cashier/Deposit section in your account drawer, choose your payment method (such as BinancePay, USDT, Bitcoin, or local channels), enter your deposit amount, and apply any promo code (e.g., BIVAAXFAST50 or 100% deposit bonus codes). Your balance will update instantly upon confirmation."
    },
    {
      question: "Are there any hidden fees, trade commissions, or maintenance charges?",
      answer: "No! Bivaax Trade provides 100% zero-fee trading. There are no commissions on opening or closing contracts, no hidden spreads, and no monthly account maintenance fees. Your full trade amount is invested directly into the contract."
    },
    {
      question: "How does the 7-Tier VIP Status program work?",
      answer: "Your account automatically upgrades through our VIP tiers (Starter, Basic, Pro, Silver, Gold, Platinum, VIP) based on your total deposit volume or balance. Higher tiers grant higher payout percentages (up to 95%+), express priority withdrawals, weekly cashback refunds, and a dedicated personal account manager."
    },
    {
      question: "Is my personal data, trading capital, and wallet safe?",
      answer: "Yes! Bivaax Trade utilizes enterprise-grade 256-bit SSL encryption, mandatory Two-Factor Authentication (2FA via Google Authenticator or Email OTP), and fully segregated client fund accounts to guarantee maximum security for your transactions and identity."
    },
    {
      question: "Can I practice with a risk-free Demo account first?",
      answer: "Absolutely! Every registered user gets a free $10,000 Demo Account loaded with virtual funds. You can test your trading strategies, learn technical indicators, and practice market timing without risking real funds. The demo balance can be refilled for free anytime."
    },
    {
      question: "What expiration times are available for binary options?",
      answer: "We support flexible contract expiration times ranging from ultra-fast 30-second scalping options, 1-minute, 5-minute, 15-minute intervals up to several hours, allowing traders to execute short-term momentum or long-term trend strategies."
    },
    {
      question: "How fast are withdrawal requests processed?",
      answer: "Withdrawal requests are processed 24/7. VIP and higher-tier account holders receive express priority processing within minutes, while standard accounts are typically processed within 1 to 24 hours depending on the chosen payment gateway."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-white selection:bg-[#FFE24C] selection:text-black pb-24 font-sans">
      <SEO 
        title="Official Blog & Platform Intelligence Hub | Bivaax Trade"
        description="The ultimate comprehensive guide to Bivaax Trade: platform specifications, asset yields, 7-tier VIP statuses, 1-click execution engine, security policies, and official updates."
        keywords="Bivaax blog, Bivaax official hub, Bivaax referral program, invite friends bivaax, bivaax affiliate rewards, binary options trading guide, bivaax vip statuses, crypto deposits, withdraw profit, trading tutorial, bivaax platform specs"
      />

      {/* Floating Header */}
      <div className="sticky top-0 z-50 bg-[#07080b]/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2 group text-gray-400 hover:text-[#FFE24C] transition-all"
            id="back_to_home_btn"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-[11px]">Back to Terminal</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFE24C] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              Official Platform Hub
            </span>
          </div>
        </div>

        {/* Live Asset Pricing Ticker Ribbon */}
        <div className="bg-black/40 border-t border-white/5 py-2.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-gray-500 font-bold uppercase">BTC/USDT</span>
              <span className={`font-black ${simDirection === 'up' ? 'text-green-400 animate-pulse' : 'text-red-400 animate-pulse'} transition-all duration-300`}>
                ${tickerPrices.BTC.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-gray-500 font-bold uppercase">ETH/USDT</span>
              <span className="font-black text-green-400">
                ${tickerPrices.ETH.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-gray-500 font-bold uppercase">EUR/USD</span>
              <span className="font-black text-red-400">
                {tickerPrices.EURUSD.toFixed(4)}
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-gray-500 font-bold uppercase">GBP/USD</span>
              <span className="font-black text-green-400">
                {tickerPrices.GBPUSD.toFixed(4)}
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-gray-500 font-bold uppercase">GOLD/USD</span>
              <span className="font-black text-green-400">
                ${tickerPrices.GOLD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-gray-500 font-bold uppercase">TSLA/USD</span>
              <span className="font-black text-green-400">
                ${tickerPrices.TSLA.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFE24C]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#FFE24C] mb-6"
          >
            <BookOpen size={12} />
            <span>Official Platform Intelligence & Documentation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none mb-6"
          >
            The Intelligence Hub <br />
            <span className="text-[#FFE24C] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE24C] via-[#fff19a] to-[#FFE24C]">Of Bivaax Trade</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-10"
          >
            Explore our complete platform architecture, asset payout rates, VIP loyalty matrix, step-by-step trading tutorials, and official admin updates. Built for transparent, high-yield options trading.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => handleNavigation('/trade')}
              className="w-full sm:w-auto px-8 py-4 bg-[#FFE24C] hover:bg-[#e6cb44] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/10 flex items-center justify-center gap-2"
              id="cta_start_trading"
            >
              <span>Launch Terminal</span>
              <ArrowRight size={16} />
            </button>
            <a 
              href="#mechanics"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Specs</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats Grid */}
      <section className="py-12 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-4">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-[#FFE24C]">95%+</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Maximum Payout Yield</p>
          </div>
          <div className="text-center border-l border-white/5 p-4">
            <p className="text-3xl sm:text-4xl font-black tracking-tight">&lt;50ms</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Order Execution Latency</p>
          </div>
          <div className="text-center border-l border-white/5 p-4">
            <p className="text-3xl sm:text-4xl font-black tracking-tight">100%</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Segregated Fund Protection</p>
          </div>
          <div className="text-center border-l border-white/5 p-4">
            <p className="text-3xl sm:text-4xl font-black tracking-tight">24/7</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Support & Cashier Processing</p>
          </div>
        </div>
      </section>

      {/* Real-time Interactive Experience Suite */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-white/5" id="interactive-suite">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
            <Activity size={12} className="text-[#FFE24C]" />
            <span>Interactive Platform Demonstration Room</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Test Your Trading <span className="text-[#FFE24C]">Instincts</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-xs sm:text-sm mt-3">
            Interact with our simulated high-frequency options contract simulator or compute your optimized payout yields based on planned deposit sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Simulator Card - Col Span 7 */}
          <div className="lg:col-span-7 bg-[#0b0c10] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE24C]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/10 text-[#FFE24C] flex items-center justify-center font-bold text-sm">
                  ₿
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">BTC/USDT Option</h3>
                  <p className="text-[10px] text-gray-500 font-mono">Simulated 1s Tick Feed</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg sm:text-2xl font-mono font-black ${simDirection === 'up' ? 'text-green-400' : 'text-red-400'} transition-all`}>
                  ${simPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#FFE24C] bg-yellow-500/10 px-2.5 py-0.5 rounded-full mt-0.5 inline-block">
                  Payout: 95% Yield
                </div>
              </div>
            </div>

            {/* Simulated Live Sparkline Chart */}
            <div className="h-44 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden flex items-end p-2 mb-6">
              <svg className="w-full h-full text-blue-500/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Horizontal reference lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3" />
                
                {/* Sparkline path */}
                <polyline
                  fill="none"
                  stroke={simDirection === 'up' ? '#4ade80' : '#f87171'}
                  strokeWidth="1.5"
                  points={(() => {
                    const minVal = Math.min(...simHistory);
                    const maxVal = Math.max(...simHistory);
                    const range = maxVal - minVal || 1;
                    return simHistory.map((val, i) => {
                      const x = (i / (simHistory.length - 1)) * 100;
                      const y = 90 - ((val - minVal) / range) * 80;
                      return `${x},${y}`;
                    }).join(' ');
                  })()}
                  className="transition-all duration-300"
                />
              </svg>

              {/* Strike Price horizontal indicator */}
              {simStrikePrice !== null && (
                <div 
                  className="absolute left-0 right-0 border-t border-dashed border-[#FFE24C]/60 flex items-center justify-end pr-3"
                  style={{
                    bottom: `${(() => {
                      const minVal = Math.min(...simHistory);
                      const maxVal = Math.max(...simHistory);
                      const range = maxVal - minVal || 1;
                      return Math.min(Math.max(((simStrikePrice - minVal) / range) * 80 + 10, 5), 95);
                    })()}%`
                  }}
                >
                  <span className="bg-[#07080b]/90 border border-[#FFE24C]/30 text-[#FFE24C] text-[8px] font-mono px-1.5 py-0.5 rounded -mt-2">
                    STRIKE: ${simStrikePrice.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Real-time floating tick dot */}
              <div 
                className={`absolute w-2.5 h-2.5 rounded-full ring-4 ${simDirection === 'up' ? 'bg-green-400 ring-green-400/20 animate-pulse' : 'bg-red-400 ring-red-400/20 animate-pulse'} right-2`}
                style={{
                  bottom: `${(() => {
                    const minVal = Math.min(...simHistory);
                    const maxVal = Math.max(...simHistory);
                    const range = maxVal - minVal || 1;
                    return Math.min(Math.max(((simPrice - minVal) / range) * 80 + 10, 5), 95);
                  })()}%`
                }}
              />
            </div>

            {/* Trade Active Overlays or Action Terminals */}
            {simIsActive ? (
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-yellow-500/10 space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Active Contract</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${simTradeType === 'HIGH' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {simTradeType}
                      </span>
                      <span className="text-xs font-black font-mono">${simStrikePrice?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#FFE24C]/40 flex items-center justify-center font-mono font-black text-[#FFE24C] text-sm animate-pulse">
                    {simCountdown}s
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Current Market</p>
                    <p className={`text-xs font-black font-mono ${simPrice >= (simStrikePrice || 0) ? 'text-green-400' : 'text-red-400'}`}>
                      ${simPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-300 font-semibold">
                  {simTradeType === 'HIGH' 
                    ? simPrice > (simStrikePrice || 0) 
                      ? '📈 Prediction state is IN-THE-MONEY (Winning)' 
                      : '📉 Prediction state is OUT-OF-THE-MONEY (Losing)'
                    : simPrice < (simStrikePrice || 0)
                      ? '📈 Prediction state is IN-THE-MONEY (Winning)'
                      : '📉 Prediction state is OUT-OF-THE-MONEY (Losing)'
                  }
                </p>
              </div>
            ) : simResult ? (
              <div className={`rounded-2xl p-6 text-center border relative overflow-hidden ${
                simResult === 'WIN' 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                {simResult === 'WIN' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
                )}
                <h4 className={`text-lg sm:text-xl font-black uppercase tracking-wider ${simResult === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                  {simResult === 'WIN' ? '🏆 Prediction Correct!' : '❌ Contract Out-of-the-Money'}
                </h4>
                <p className="text-xs text-gray-300 mt-2 max-w-md mx-auto leading-relaxed">
                  {simResult === 'WIN' 
                    ? `Excellent timing! Your simulated trade of $${simAmount} returned $${(simAmount * 1.95).toFixed(2)} (+$${(simAmount * 0.95).toFixed(2)} pure profit in ${simTime} seconds).`
                    : `The asset finished opposite of your prediction. Master the charts using Bivaax's free $10,000 reloadable Demo terminal to hone your timing!`
                  }
                </p>
                <div className="mt-5 flex gap-3 justify-center">
                  <button
                    onClick={handleResetSimTrade}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all"
                  >
                    Reset & Practice Again
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className={`px-5 py-2.5 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${
                      simResult === 'WIN' ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-[#FFE24C] text-black hover:bg-[#e6cb44]'
                    }`}
                  >
                    Open $10K Demo Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Expiration and investment amount selects */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2">Investment Size</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[50, 100, 250].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setSimAmount(amt)}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                            simAmount === amt 
                              ? 'bg-[#FFE24C] text-black border-[#FFE24C]' 
                              : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2">Contract Duration</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[5, 10, 15].map(time => (
                        <button
                          key={time}
                          onClick={() => setSimTime(time)}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${
                            simTime === time 
                              ? 'bg-[#FFE24C] text-black border-[#FFE24C]' 
                              : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          {time}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Call & Put trigger buttons */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => handlePlaceSimTrade('HIGH')}
                    className="py-4 bg-green-500 hover:bg-green-400 active:scale-[0.98] text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/10"
                  >
                    <TrendingUp size={16} />
                    <span>Predict HIGH</span>
                  </button>
                  <button
                    onClick={() => handlePlaceSimTrade('LOW')}
                    className="py-4 bg-red-500 hover:bg-red-400 active:scale-[0.98] text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
                  >
                    <TrendingUp size={16} className="rotate-180" />
                    <span>Predict LOW</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Calculator Card - Col Span 5 */}
          <div className="lg:col-span-5 bg-[#0b0c10] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full min-h-[440px]">
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">VIP Loyalty Calculator</h3>
                <p className="text-[10px] text-gray-500 mt-1">See how your deposit size unlocks enhanced payout ratios.</p>
              </div>

              {/* Deposit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-400">Estimated Initial Deposit:</span>
                  <span className="text-[#FFE24C] font-mono">${calcDeposit.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="5000" 
                  step="50"
                  value={calcDeposit} 
                  onChange={(e) => setCalcDeposit(Number(e.target.value))}
                  className="w-full accent-[#FFE24C] bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>Starter ($50)</span>
                  <span>Gold ($500)</span>
                  <span>VIP ($2,500+)</span>
                </div>
              </div>

              {/* Trade Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-400">Example Contract Size:</span>
                  <span className="text-white font-mono">${calcTradeAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={calcTradeAmount} 
                  onChange={(e) => setCalcTradeAmount(Number(e.target.value))}
                  className="w-full accent-white bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Calculated Tier Display */}
              {(() => {
                const tier = getVIPTierDetails(calcDeposit);
                const potentialProfit = (calcTradeAmount * tier.payout) / 100;
                
                // Progress to next tier
                let nextTierName = "";
                let amountToNext = 0;
                if (calcDeposit < 100) { nextTierName = "Pro"; amountToNext = 100 - calcDeposit; }
                else if (calcDeposit < 250) { nextTierName = "Silver"; amountToNext = 250 - calcDeposit; }
                else if (calcDeposit < 500) { nextTierName = "Gold"; amountToNext = 500 - calcDeposit; }
                else if (calcDeposit < 1000) { nextTierName = "Platinum"; amountToNext = 1000 - calcDeposit; }
                else if (calcDeposit < 2500) { nextTierName = "VIP"; amountToNext = 2500 - calcDeposit; }

                return (
                  <div className="space-y-4 pt-2">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unlocked Status:</span>
                        <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-[#FFE24C]/10 text-[#FFE24C] border border-[#FFE24C]/20 rounded-full">
                          {tier.name} TIER
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-2 text-xs">
                        <span className="text-gray-400">Contract Yield:</span>
                        <span className="font-mono font-black text-green-400">{tier.payout}% Payout</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-2 text-xs">
                        <span className="text-gray-400">Potential Return:</span>
                        <span className="font-mono font-black text-white">
                          ${(calcTradeAmount + potentialProfit).toFixed(2)} (${potentialProfit.toFixed(2)} Profit)
                        </span>
                      </div>
                    </div>

                    {amountToNext > 0 && (
                      <p className="text-[10px] text-gray-500 font-medium italic text-center">
                        💡 Deposit another <strong className="text-white">${amountToNext}</strong> to unlock the <strong className="text-[#FFE24C]">{nextTierName}</strong> tier for higher payout rates!
                      </p>
                    )}

                    <div className="pt-2">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">VIP Status Reward:</h4>
                      <p className="text-[12px] text-gray-300 leading-relaxed font-semibold">
                        ★ {tier.perk}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                onClick={() => handleNavigation('/register')}
                className="w-full py-4 bg-[#FFE24C] hover:bg-[#e6cb44] text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:scale-105 active:scale-95 transition-all text-center"
              >
                Claim Deposit Bonus (VIP Activated)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Specs & Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="mechanics">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
              <Cpu size={10} fill="currentColor" />
              <span>Core Trading Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-6">
              Engineered For High-Precision Digital Options
            </h2>
            <p className="text-gray-400 mb-8 text-base leading-relaxed">
              Our trading core combines low-latency price feeds, instant order routing algorithms, and customized charting tools to give you the ultimate edge in financial market predictions.
            </p>

            <div className="space-y-4">
              {features.map((feat, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex gap-4 ${
                    activeFeature === index 
                      ? 'bg-white/5 border-[#FFE24C]/30 shadow-lg' 
                      : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${activeFeature === index ? 'bg-[#FFE24C]/10 text-[#FFE24C]' : 'bg-white/5 text-gray-400'}`}>
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide text-white flex items-center gap-2">
                      {feat.title}
                      {activeFeature === index && <span className="text-[9px] bg-[#FFE24C]/10 text-[#FFE24C] px-2 py-0.5 rounded font-bold uppercase tracking-widest">{feat.metric}</span>}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{feat.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0c0d12] border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE24C]/5 rounded-full blur-3xl" />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-[#FFE24C]/10 rounded-2xl text-[#FFE24C]">
                    {features[activeFeature].icon}
                  </div>
                  <div>
                    <span className="text-[10px] text-[#FFE24C] font-black uppercase tracking-widest block mb-1">Specification Detail</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{features[activeFeature].title}</h3>
                  </div>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-2xl p-6 mb-8">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{features[activeFeature].desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Security Grade</span>
                    <span className="text-lg font-black text-white uppercase">Grade A+ SSL</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Performance Spec</span>
                    <span className="text-lg font-black text-[#FFE24C] uppercase">{features[activeFeature].metric}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Asset Explorer & Payout Rates */}
      <section className="py-24 px-6 bg-[#090a0e] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
              <Globe size={10} fill="currentColor" />
              <span>Global Assets & Payout Yields</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Tradable Asset Specification</h2>
            <p className="text-gray-400 mt-3 text-sm">Trade over 100+ global instruments across Forex, Crypto, Commodities, and Stocks with competitive payouts.</p>

            {/* Category Selectors */}
            <div className="flex flex-wrap gap-2 justify-center mt-8">
              {(['forex', 'crypto', 'commodities', 'stocks'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveAssetCat(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                    activeAssetCat === cat 
                      ? 'bg-[#FFE24C] text-black border-[#FFE24C]' 
                      : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {assetsList[activeAssetCat].map((asset, idx) => (
              <div 
                key={idx}
                className="bg-[#0c0d12] border border-white/5 hover:border-[#FFE24C]/30 p-6 rounded-2xl transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-white">{asset.pair}</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">{asset.status}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-3 flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Standard Payout</span>
                  <span className="text-xl font-black text-[#FFE24C]">{asset.payout}</span>
                </div>
                <div className="text-[10px] text-gray-400 flex justify-between">
                  <span>Weekend OTC Mode:</span>
                  <span className="text-white font-bold">{asset.otc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Status Tier Matrix */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
            <Award size={10} fill="currentColor" />
            <span>7-Tier Account Levels</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">VIP Loyalty Program</h2>
          <p className="text-gray-400 mt-3 text-sm">Unlock higher payout yields, faster cashout priority, and dedicated account manager support as your volume grows.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#FFE24C]">
                <th className="p-4 rounded-tl-2xl">Tier Level</th>
                <th className="p-4">Min Deposit</th>
                <th className="p-4">Max Profit Payout</th>
                <th className="p-4 rounded-tr-2xl">Key Benefits & Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {vipTiers.map((tier, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-black uppercase text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FFE24C]" />
                    <span>{tier.name}</span>
                  </td>
                  <td className="p-4 font-bold text-gray-300">{tier.minDeposit}</td>
                  <td className="p-4 font-black text-[#FFE24C]">{tier.payout}</td>
                  <td className="p-4 text-gray-400">{tier.perk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Getting Started Interactive Steps */}
      <section className="bg-white/[0.01] border-y border-white/5 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
              <CheckCircle size={10} fill="currentColor" />
              <span>Step-By-Step Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">How To Start Earning</h2>
            <p className="text-gray-400 mt-3 text-sm">Become a master options trader in 4 seamless, secure steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingSteps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#0b0c10] border border-white/5 hover:border-[#FFE24C]/20 p-8 rounded-[24px] relative group hover:-translate-y-1 transition-all duration-300"
              >
                <span className="absolute top-6 right-6 text-4xl font-black text-white/5 group-hover:text-[#FFE24C]/10 transition-colors">{step.step}</span>
                <div className="w-10 h-10 bg-white/5 text-[#FFE24C] rounded-xl flex items-center justify-center font-bold text-sm mb-6 border border-white/10">
                  {step.step}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Copy Trading Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-white/5" id="copy-trading-showcase">
        <div className="bg-[#0c0d12] border border-emerald-500/30 rounded-[32px] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Image Preview Container */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-[#1a1b22]">
                <img 
                  src="https://i.postimg.cc/Tw9xf0K9/Screenshot-20260826-141703.png" 
                  alt="Bivaax Copy Trading Terminal - Top Traders List"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  <span>80%+ Weekly Gain Possible</span>
                </div>
              </div>
            </div>

            {/* Showcase Details */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <Activity size={12} fill="currentColor" />
                <span>Passive Income Mechanic</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Copy Top Traders & Learn <span className="text-emerald-400">Profitably</span>
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed">
                Bivaax Copy Trading allows you to synchronize your account with professional "Master Traders". When they place a trade, your account automatically replicates the same trade in real-time, adjusted to your balance.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm">Real-time Performance</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Monitor win/loss ratios, weekly gains, and the number of active copiers for each master trader before committing.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-sm">Automatic Execution</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">No need to stay online. Our servers mirror the master's trades instantly, even while you sleep.</p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                   <h3 className="text-emerald-400 font-black uppercase text-xs tracking-wider">How to Start Copying:</h3>
                   <div className="space-y-2 text-[13px] text-gray-300">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                        <span>Browse the <strong>Top Traders</strong> list and check their stats (e.g. ALEX FOREX @ 92% Profit).</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                        <span>Click on a Trader to see their <strong>Commission Rate</strong> (typically 10% on profit).</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                        <span>Set your <strong>Allocation Limit</strong> and click 'Start Copying'.</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-start gap-2 text-[12px] text-gray-400 italic bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                   <Shield size={14} className="text-red-500 shrink-0 mt-0.5" />
                   <span><strong>Risk Warning:</strong> Trading involves risk. Copying a trader does not guarantee profits. Always manage your capital wisely.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleNavigation('/copytrading')}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[13px] rounded-2xl transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Go to Copy Trading</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => handleNavigation('/trade')}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl transition-all"
                >
                  Become a Master
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Referral & Affiliate Program Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-white/5" id="referral-program-showcase">
        <div className="bg-[#0c0d12] border border-blue-500/30 rounded-[32px] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row-reverse gap-10 items-center">
            {/* Image Preview Container */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-[#1a1b22]">
                <img 
                  src="https://i.postimg.cc/GhDMD2QL/Screenshot-20260826-141630.png" 
                  alt="Bivaax Referral & Invite Friends Program"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase text-blue-400 tracking-widest flex items-center gap-1.5">
                  <Gift size={12} />
                  <span>Referral Rewards Enabled</span>
                </div>
              </div>
            </div>

            {/* Showcase Details */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                <Users size={12} fill="currentColor" />
                <span>Partner with Bivaax</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Invite Friends & Earn <span className="text-blue-400">$10-$20*</span> per Trader
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed">
                Our Referral and Affiliate programs are designed to reward your influence. From simple social sharing to professional partnership models, we offer the most competitive payout structures in the market.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                   <h3 className="text-[#FFE24C] font-black uppercase text-xs tracking-wider">How it Works:</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">1</div>
                        <span>Copy your unique Link from Profile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">2</div>
                        <span>Share on Social Media or Blogs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">3</div>
                        <span>Friends sign up and start trading</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">4</div>
                        <span>Earn $10-20* or up to 80% RevShare</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                   <h3 className="text-red-400 font-black uppercase text-xs tracking-wider">Strict Program Rules:</h3>
                   <div className="grid grid-cols-1 gap-2 text-[12px] text-gray-400 italic">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <span><strong>No Self-Referrals:</strong> Referring your own accounts or family on the same IP is prohibited.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <span><strong>No Brand Bidding:</strong> Search ads using "Bivaax" keywords are strictly forbidden.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <span><strong>Authentic Traffic:</strong> No spamming or misleading claims about trading profits.</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleNavigation('/affiliate')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[13px] rounded-2xl transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Access Affiliate Hub</span>
                  <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={() => handleNavigation('/trade')}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl transition-all"
                >
                  Invite Friends (Profile)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mobile Landscape Terminal Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-white/5" id="mobile-landscape-showcase">
        <div className="bg-[#0c0d12] border border-[#FFE24C]/30 rounded-[32px] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE24C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Image Preview Container */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-black">
                <img 
                  src="https://i.postimg.cc/XqSnstSs/Screenshot-20260826-140147.png" 
                  alt="Pro Mobile Landscape Trading Terminal View"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase text-[#FFE24C] tracking-widest flex items-center gap-1.5">
                  <Smartphone size={12} />
                  <span>Landscape Auto-Rotate Mode</span>
                </div>
              </div>
            </div>

            {/* Showcase Details */}
            <div className="w-full lg:w-1/2 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest">
                <Zap size={12} fill="currentColor" />
                <span>Featured Interface Release</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Pro Mobile Landscape Trading Terminal
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed">
                Experience full desktop-grade trading capabilities on mobile devices. Rotating your phone horizontally instantly activates the full-screen landscape interface with optimized chart scaling and touch controls:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 font-medium">
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <CheckCircle size={16} className="text-[#FFE24C] shrink-0 mt-0.5" />
                  <span><strong>AUD/USD (OTC) 90% Payout</strong> real-time price feeds</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <CheckCircle size={16} className="text-[#FFE24C] shrink-0 mt-0.5" />
                  <span><strong>Live Remaining Time</strong> countdown indicator</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <CheckCircle size={16} className="text-[#FFE24C] shrink-0 mt-0.5" />
                  <span><strong>Majority Opinion Meter</strong> (51% Call / 49% Put)</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <CheckCircle size={16} className="text-[#FFE24C] shrink-0 mt-0.5" />
                  <span><strong>Scrollable Order Panel</strong> for smooth Call/Put access</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => handleNavigation('/trade')}
                  className="px-6 py-3 bg-[#FFE24C] hover:bg-[#e6cb44] text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Test Landscape Terminal</span>
                  <ArrowRight size={14} />
                </button>
                <a
                  href="https://i.postimg.cc/XqSnstSs/Screenshot-20260826-140147.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <span>View High-Res Image</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Updates & Stories Section with Search */}
      <section className="py-24 px-6 max-w-5xl mx-auto" id="showcase">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap size={10} fill="currentColor" />
            <span>Official Admin Posts & Stories</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">
            App Spotlights & <span className="text-[#FFE24C]">Promotions</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Explore direct visual insights, app feature releases, and promotional offers published directly by our administration panel.
          </p>

          {/* Search & Tab Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-10 max-w-2xl mx-auto">
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFE24C]"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'showcase', 'bonuses'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                    activeTab === tab 
                      ? 'bg-[#FFE24C] text-black border-[#FFE24C]' 
                      : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {tab === 'all' ? 'All Updates' : tab === 'showcase' ? 'App Showcase' : 'Promo & Bonuses'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-white/5 rounded-[32px] h-[350px]" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-[32px] border border-dashed border-white/10">
            <Info className="mx-auto text-gray-600 mb-4" size={40} />
            <h3 className="text-lg font-bold">No posts found</h3>
            <p className="text-gray-500 text-xs mt-1">There are currently no updates matching your search query.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredBlogs.map((blog, idx) => (
              <motion.article 
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-[#0b0c10] border border-white/5 hover:border-white/10 rounded-[32px] p-6 sm:p-8 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6 group-hover:border-[#FFE24C]/20 transition-all duration-500">
                  {blog.imageUrl ? (
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-750" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                       {blog.title.toLowerCase().includes('bonus') ? (
                         <Gift size={12} className="text-[#FFE24C]" />
                       ) : (
                         <Smartphone size={12} className="text-[#FFE24C]" />
                       )}
                       <span className="text-[9px] font-black uppercase tracking-widest text-white">
                         {blog.title.toLowerCase().includes('bonus') ? 'Bonus Offer' : 'Interface View'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Official Update'}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                    <span className="text-[#FFE24C]">Verified Spotlight</span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-[#FFE24C] transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    {blog.description}
                  </p>

                  {blog.link && (
                    <a 
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-[#FFE24C] border border-white/5 hover:border-[#FFE24C] text-white hover:text-black text-xs font-black uppercase tracking-widest transition-all"
                    >
                      <span>Explore Screenshot Link</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Platform Announcements & VIP Newsletter Subscription */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-[#0b0c10] border border-white/5 rounded-[32px] p-8 sm:p-12 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFE24C]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Mail size={12} />
              <span>Bivaax Intelligence Dispatch</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Stay Ahead of the <span className="text-[#FFE24C]">Markets</span>
            </h3>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Subscribe to the official administration newsletter to receive instant feature spotlights, VIP discount codes, deposit match promo events, and premium market analysis direct to your inbox.
            </p>

            {subSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center space-y-2 mt-6"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                  <Check size={20} />
                </div>
                <h4 className="text-sm font-black uppercase text-green-400">Subscription Confirmed!</h4>
                <p className="text-[11px] text-gray-300">You have successfully joined the Bivaax premium newsletter. Welcome to the elite tier.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-4">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFE24C] transition-colors"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="px-8 py-4 bg-[#FFE24C] hover:bg-[#e6cb44] disabled:bg-gray-700 text-black font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
                >
                  {subLoading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
            
            <p className="text-[10px] text-gray-500 font-medium">
              We respect your privacy. No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Regulatory Compliance & AML Policies Banner */}
      <section className="py-16 px-6 max-w-5xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-yellow-500/5 via-white/[0.02] to-transparent border border-white/10 rounded-[32px] p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="p-5 bg-[#FFE24C]/10 rounded-2xl text-[#FFE24C] shrink-0">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2">AML Compliance & Segregated Custody</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Bivaax Trade enforces strict Anti-Money Laundering (AML) standards and Know Your Customer (KYC) verification protocols. All client funds are deposited into segregated financial accounts separate from company operations budgets, guaranteeing maximum financial security.
            </p>
          </div>
        </div>
      </section>

      {/* Extended FAQ Section for Ultimate SEO */}
      <section className="py-20 px-6 bg-[#090a0e] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
              <HelpCircle size={10} fill="currentColor" />
              <span>Comprehensive Knowledge Base</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Platform Mechanics FAQ</h2>
            <p className="text-gray-400 text-xs mt-3">Detailed technical answers about Bivaax Trade accounts, contract rules, deposits, and VIP statuses.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#0b0c10] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-[#FFE24C]"
                >
                  <span className="uppercase tracking-tight leading-tight">{faq.question}</span>
                  <ChevronDown 
                    size={18} 
                    className={`shrink-0 transition-transform text-gray-500 ${openFaq === idx ? 'rotate-180 text-[#FFE24C]' : ''}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-6">
            Ready to Open Your <br />
            <span className="text-[#FFE24C]">First Contract?</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Create an account today to claim your free $10,000 demo funds, test our real-time trading engine, and master binary options trading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleNavigation('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-[#FFE24C] hover:bg-[#e6cb44] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => handleNavigation('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all"
            >
              Log In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
