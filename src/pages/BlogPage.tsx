import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, ExternalLink, Image as ImageIcon, Zap, Award, 
  Gift, Info, BookOpen, ShieldCheck, ChevronDown, CheckCircle, 
  HelpCircle, Users, TrendingUp, DollarSign, Smartphone, Laptop, 
  ChevronRight, Star, Lock, Activity, ArrowRight, Play, Search,
  Globe, Coins, Shield, FileText, Check, Cpu, Layers, RefreshCw
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

  const fetchBlogs = async () => {
    try {
      const q = query(
        collection(db, 'stories'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogItem[];
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
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
        keywords="Bivaax blog, Bivaax official hub, binary options trading guide, bivaax vip statuses, crypto deposits, withdraw profit, trading tutorial, bivaax platform specs"
      />

      {/* Floating Header */}
      <div className="sticky top-0 z-50 bg-[#07080b]/80 backdrop-blur-xl border-b border-white/5">
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
