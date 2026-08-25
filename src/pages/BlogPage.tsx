import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, ExternalLink, Image as ImageIcon, Zap, Award, 
  Gift, Info, BookOpen, ShieldCheck, ChevronDown, CheckCircle, 
  HelpCircle, Users, TrendingUp, DollarSign, Smartphone, Laptop, 
  ChevronRight, Star, Lock, Activity, ArrowRight, Play
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
  const [activeTab, setActiveTab] = useState<'all' | 'showcase' | 'bonuses'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const handleNavigation = (path: string) => {
    const hostname = window.location.hostname;
    // Keep local, sandbox and dev-server previews running inside the preview iframe
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
    
    // For production subdomains, redirect to the corresponding page on the main domain
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
    if (activeTab === 'all') return true;
    if (activeTab === 'bonuses') return blog.title.toLowerCase().includes('bonus') || blog.description.toLowerCase().includes('bonus');
    if (activeTab === 'showcase') return !blog.title.toLowerCase().includes('bonus') && !blog.description.toLowerCase().includes('bonus');
    return true;
  });

  const features = [
    {
      title: "Real-Time Advanced Charting",
      desc: "Experience zero-lag live market feeds with responsive charts, interactive drawing tools, and standard indicators (RSI, MACD, Bollinger Bands) to help you predict movements accurately.",
      icon: <Activity className="text-[#FFE24C]" size={24} />,
      metric: "0.01s Refresh Rate"
    },
    {
      title: "1-Click Lightning Execution",
      desc: "Never miss a market entry. Execute Binary and Digital Option contracts instantly at exact prices. Super low-latency servers guarantee fast order routing.",
      icon: <Zap className="text-[#FFE24C]" size={24} />,
      metric: "50ms Execution Time"
    },
    {
      title: "Secure Fast Deposits & Withdrawals",
      desc: "Fund your account and withdraw your profits via secure channels like BinancePay, local bank transfers, and popular crypto wallets with round-the-clock manual and automated processing.",
      icon: <DollarSign className="text-[#FFE24C]" size={24} />,
      metric: "Instant & 24/7 Processing"
    },
    {
      title: "Multi-Tier VIP Loyalty Statuses",
      desc: "Grow your trading volume to unlock high-yield profitability (up to 95%+ payout rates), weekly cashbacks, private account managers, and express withdrawals.",
      icon: <Award className="text-[#FFE24C]" size={24} />,
      metric: "Up to 95% Yield"
    }
  ];

  const tradingSteps = [
    {
      step: "01",
      title: "Create Free Account",
      desc: "Fill in the simple sign-up form in under 30 seconds. Choose your currency and instantly get access to a free $10,000 demo trading account."
    },
    {
      step: "02",
      title: "Learn & Practice",
      desc: "Analyze global assets. Choose your expiration time (from 30 seconds up to several hours), select trade amount, and predict if the price will go High or Low."
    },
    {
      step: "03",
      title: "Fast Funding",
      desc: "Deposit using BinancePay, Crypto, or local payment methods. All transactions are fully secured. Unlock custom deposit bonuses up to 100%."
    },
    {
      step: "04",
      title: "Withdraw Profits",
      desc: "Earn high payout rates up to 95%+ on winning trades. Submit a fast withdrawal request and receive your profits instantly in your wallet."
    }
  ];

  const faqs = [
    {
      question: "What is Bivaax Trade and how does it work?",
      answer: "Bivaax Trade is a next-generation binary and digital options trading platform. Users can predict the price movements of various assets (currencies, crypto, stocks, commodities) within a custom time-frame (e.g., 30s, 1m, 5m). If your prediction is correct at the expiration time, you earn a high payout of up to 95% of your trade size."
    },
    {
      question: "How do I make a deposit and get a bonus?",
      answer: "To make a deposit, go to the Cashier/Deposit section, choose your preferred method (such as BinancePay, USDT, or local payments), enter the amount, and proceed. You can also apply available promo codes or deposit bonuses (e.g., 50% or 100% bonuses) that increase your trading balance immediately."
    },
    {
      question: "Are there any hidden fees or commission charges?",
      answer: "No! Bivaax is proud to offer fully transparent trading with absolutely zero fees on trades, commissions, or maintenance. What you invest is exactly what is placed on the market."
    },
    {
      question: "How does the VIP status system work?",
      answer: "We offer multiple account statuses (Starter, Basic, Pro, Silver, Gold, Platinum, VIP) based on your total deposit volume or account balance. Higher tiers unlock major perks: higher payout percentages, faster processing, higher maximum trade limits, and cashback rewards."
    },
    {
      question: "Is my personal data and funds secure with Bivaax?",
      answer: "Yes, Bivaax implements state-of-the-art security, including 256-bit SSL encryption, 2-Factor Authentication (2FA via Google Authenticator or Email OTP), and fully segregated customer fund wallets to ensure complete protection for your transactions and identity."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-white selection:bg-[#FFE24C] selection:text-black pb-24 font-sans">
      <SEO 
        title="Official Blog & Platform Hub | Bivaax Trade"
        description="The ultimate guide to Bivaax Trade platform mechanics, VIP statuses, step-by-step guides, live updates, and secure options trading."
        keywords="Bivaax blog, Bivaax official hub, binary options guide, how to trade, bivaax bonuses, vip statuses, crypto deposits, withdraw profit, trading tutorial"
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
            <span className="font-bold uppercase tracking-widest text-[11px]">Back to Trading</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFE24C] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              Official Hub
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
            <span>Complete Platform Intelligence Center</span>
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
            className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10"
          >
            Everything you need to master our trading engine, unlock high-yield loyalty bonuses, study step-by-step guides, and view official app announcements. Fully indexed for real-time clarity.
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
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Maximum Payout</p>
          </div>
          <div className="text-center border-l border-white/5 p-4">
            <p className="text-3xl sm:text-4xl font-black tracking-tight">50ms</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Execution Speed</p>
          </div>
          <div className="text-center border-l border-white/5 p-4">
            <p className="text-3xl sm:text-4xl font-black tracking-tight">100%</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">SSL & Fund Safety</p>
          </div>
          <div className="text-center border-l border-white/5 p-4">
            <p className="text-3xl sm:text-4xl font-black tracking-tight">24/7</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Support & Cashier</p>
          </div>
        </div>
      </section>

      {/* Main Content: Specs & Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="mechanics">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
              <Star size={10} fill="currentColor" />
              <span>Core Trading Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-6">
              Designed For High-Performance Option Execution
            </h2>
            <p className="text-gray-400 mb-8 text-base leading-relaxed">
              Our trading engine is optimized to deliver seamless transaction security, exact pricing feeds, and instantaneous response rates. Choose from multiple assets and execute predictions flawlessly.
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
                    <span className="text-[10px] text-[#FFE24C] font-black uppercase tracking-widest block mb-1">Feature Highlight</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{features[activeFeature].title}</h3>
                  </div>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-2xl p-6 mb-8">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{features[activeFeature].desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Standard Rating</span>
                    <span className="text-lg font-black text-white uppercase">Grade A Elite</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Network Spec</span>
                    <span className="text-lg font-black text-[#FFE24C] uppercase">{features[activeFeature].metric}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Getting Started Interactive Steps */}
      <section className="bg-white/[0.01] border-y border-white/5 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
              <CheckCircle size={10} fill="currentColor" />
              <span>Easy Guide</span>
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

      {/* Blog & Showcase Posts */}
      <section className="py-24 px-6 max-w-5xl mx-auto" id="showcase">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap size={10} fill="currentColor" />
            <span>Updates & Spotlights</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">
            App Screenshots & <span className="text-[#FFE24C]">Bonuses</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Read direct visual insights, promotion highlights, and screen updates posted by our admin panel.
          </p>

          {/* Tab Filters */}
          <div className="flex gap-2 justify-center mt-8">
            {(['all', 'showcase', 'bonuses'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
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
            <p className="text-gray-500 text-xs mt-1">There are currently no updates listed under this category.</p>
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
                    <span className="text-[#FFE24C]">Verified Showcase</span>
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

      {/* Security Banner */}
      <section className="py-16 px-6 max-w-5xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-yellow-500/5 to-transparent border border-white/10 rounded-[32px] p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="p-5 bg-[#FFE24C]/10 rounded-2xl text-[#FFE24C] shrink-0">
            <Lock size={36} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2">Segregated Funds & 2FA Secured</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              We separate customer funds from operation budgets, protecting your deposits. Activate Two-Factor Authentication (2FA) inside your personal settings panel for secure logins, deposits, and withdrawal orders.
            </p>
          </div>
        </div>
      </section>

      {/* Deep FAQ Section for Ultimate Google Crawl/SEO */}
      <section className="py-20 px-6 bg-[#090a0e] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-[#FFE24C] text-[10px] font-black uppercase tracking-widest mb-4">
              <HelpCircle size={10} fill="currentColor" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Platform Mechanics FAQ</h2>
            <p className="text-gray-400 text-xs mt-3">Detailed answers about Bivaax Trade accounts, binary rules, and secure options.</p>
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
            Create an account today to claim your free $10,000 demo funds, try our charting engine, and master binary trading.
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
