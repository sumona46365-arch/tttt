import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  ArrowRight, 
  Users, 
  DollarSign, 
  Target, 
  Zap, 
  ChevronDown, 
  ShieldCheck, 
  Globe,
  PieChart,
  Rocket,
  ArrowUpRight,
  Star,
  BarChart3
} from 'lucide-react';
import { Logo } from '../components/Logo';
import SEO from '../components/SEO';

export default function AffiliateLandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Capture referral from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    const sub = params.get('sub');
    const type = params.get('type');
    
    if (ref) {
      localStorage.setItem('referralCode', ref);
      localStorage.setItem('referral_code', ref);
    }
    if (sub) {
      localStorage.setItem('referralSub', sub);
      localStorage.setItem('referral_sub_id', sub);
    }
    if (type) {
      localStorage.setItem('referralType', type);
      localStorage.setItem('referral_type', type);
    }
  }, [location.search]);

  // Interactive Calculator State
  const [tradersCount, setTradersCount] = useState(50);
  const [avgTradeVolume, setAvgTradeVolume] = useState(5000);

  const getRevShareRate = (count: number) => {
    if (count <= 10) return 50;
    if (count <= 50) return 60;
    if (count <= 100) return 70;
    return 80;
  };

  const revShareRate = getRevShareRate(tradersCount);
  const estimatedPlatformRevenue = tradersCount * avgTradeVolume * 0.025;
  const estimatedMonthlyCommission = (estimatedPlatformRevenue * (revShareRate / 100)).toFixed(2);

  const steps = [
    { icon: Rocket, title: "Register", desc: "Open your free partner account in 2 minutes. Instant approval for everyone." },
    { icon: Target, title: "Promote", desc: "Use your unique link on social media, blogs, or YouTube channels." },
    { icon: Users, title: "Refer", desc: "Invite traders from 150+ countries. Our platform converts traffic at 15% rate." },
    { icon: DollarSign, title: "Earn", desc: "Get paid instantly for every trade. Lifetime commission with no expiry." }
  ];

  const tiers = [
    { label: "Starter", range: "0-10", rate: "50%", color: "bg-gray-500/10 text-gray-400", perk: "Basic Tracking" },
    { label: "Silver", range: "11-50", rate: "60%", color: "bg-blue-500/10 text-blue-400", perk: "Sub-ID Tracking" },
    { label: "Gold", range: "51-100", rate: "70%", color: "bg-orange-500/10 text-orange-400", perk: "Personal Manager" },
    { label: "Elite", range: "100+", rate: "80%", color: "bg-[#ffcf00]/10 text-[#ffcf00]", perk: "Custom CPA Available" }
  ];

  const benefits = [
    { icon: Zap, title: "Instant Payouts", desc: "Request your earnings anytime. We process withdrawals within 60 minutes via Crypto, Bank, or MFS." },
    { icon: BarChart3, title: "Precision Tracking", desc: "Real-time analytics and Sub-ID tracking for advanced marketers. Monitor clicks, registrations, and FTDs live." },
    { icon: ShieldCheck, title: "No Negative Carryover", desc: "Your monthly balance starts fresh. We never charge for user wins. Pure profit-sharing only." },
    { icon: Globe, title: "Global Conversion", desc: "Localized landing pages in 20+ languages. Our funnel is optimized for high-conversion in Asia and Africa." },
    { icon: ShieldCheck, title: "Marketing Assets", desc: "Access 500+ high-quality banners, videos, and educational content to help you promote effectively." },
    { icon: Award, title: "Partner Contests", desc: "Participate in monthly partner tournaments with up to $50,000 in additional cash prizes." }
  ];

  const partnerTypes = [
    { title: "Social Influencers", desc: "Perfect for Telegram signal providers, YouTube creators, and Facebook group owners." },
    { title: "Professional IBs", desc: "Ideal for financial consultants and institutional brokers looking for high retention." },
    { title: "Webmasters", desc: "Great for review sites, comparison blogs, and high-traffic fintech portals." }
  ];

  return (
    <div className="min-h-screen bg-[#060709] text-white font-sans selection:bg-[#ffcf00]/30 overflow-x-hidden">
      <SEO 
        title="Partnership | Bivaax Global Network"
        description="Join the elite Bivaax Partner Network. Up to 80% RevShare, instant payouts, and premium marketing tools."
      />
      
      {/* GLOW BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ffcf00]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-[#060709]/80 backdrop-blur-2xl border-b border-white/5 z-[100] px-4 md:px-12">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <Logo size={20} color="#ffcf00" />
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-black tracking-tighter leading-none mb-0.5">Bivaax</span>
              <span className="text-[8px] md:text-[9px] text-[#ffcf00] font-black uppercase tracking-[0.2em] leading-none">PARTNERS</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/login" className="hidden sm:block text-[11px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest px-4 py-2">Sign In</Link>
            <Link to="/register" className="bg-[#ffcf00] text-black px-5 md:px-8 py-2 md:py-3 rounded-2xl text-[10px] md:text-[12px] font-black transition-all active:scale-95 uppercase tracking-widest shadow-lg shadow-[#ffcf00]/10 flex items-center gap-2">Join Elite <ArrowRight size={14} strokeWidth={3} /></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-36 md:pt-56 pb-20 md:pb-32 px-4 md:px-12 relative text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-5xl mx-auto space-y-8 md:space-y-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-[#ffcf00] animate-ping" />
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Elite Partnership Ecosystem</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9] text-white">
            Monetize <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcf00] via-[#ffcf00] to-white/40">Your Vision.</span>
          </h1>

          <p className="text-gray-500 text-base md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
            The world's most rewarding fintech partner network. Scale your audience into wealth with up to <span className="text-white font-black underline decoration-[#ffcf00] decoration-4 underline-offset-8">80% RevShare.</span>
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/register" className="w-full sm:w-auto px-12 py-6 bg-white text-black rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl">
              Start Earning Now <ArrowUpRight size={22} />
            </Link>
            <div className="flex items-center gap-4 px-8 py-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#060709] flex items-center justify-center text-xs text-gray-500">U</div>)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="#ffcf00" className="text-[#ffcf00]" />)}
                </div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">15,000+ Active Partners</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter">Your Path to <span className="text-[#ffcf00]">Elite.</span></h2>
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Zero Friction Onboarding</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#ffcf00]/20 transition-all space-y-8 group">
              <div className="w-16 h-16 rounded-2xl bg-[#ffcf00]/10 flex items-center justify-center text-[#ffcf00] group-hover:scale-110 transition-transform">
                <step.icon size={32} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="py-20 md:py-32 px-4 md:px-12">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#111318] to-[#060709] border border-white/5 rounded-[3rem] md:rounded-[5rem] overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 p-10 md:p-20 space-y-16">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-7xl font-black tracking-tight">Earnings <br /><span className="text-[#ffcf00]">Simulator.</span></h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Calculate your passive income</p>
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Monthly Referrals</span>
                    <span className="text-2xl font-black text-[#ffcf00]">{tradersCount} Traders</span>
                  </div>
                  <input type="range" min="1" max="1000" value={tradersCount} onChange={(e) => setTradersCount(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#ffcf00]" />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Average Volume (USD)</span>
                    <span className="text-2xl font-black text-[#ffcf00]">${avgTradeVolume.toLocaleString()}</span>
                  </div>
                  <input type="range" min="1000" max="100000" step="1000" value={avgTradeVolume} onChange={(e) => setAvgTradeVolume(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#ffcf00]" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-white/5 p-10 md:p-20 flex flex-col justify-between space-y-16">
              <div className="space-y-12">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Dynamic RevShare Rate</span>
                  <div className="text-7xl md:text-8xl font-black text-[#ffcf00]">{revShareRate}%</div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Est. Monthly Payout</span>
                  <div className="text-5xl md:text-7xl font-black text-white">
                    <span className="text-white/20">$</span>{Number(estimatedMonthlyCommission).toLocaleString()}
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/register')} className="w-full py-8 bg-[#ffcf00] text-black font-black text-xl rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,207,0,0.15)] flex items-center justify-center gap-4">
                Start Scaling Now <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section id="tiers" className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center md:text-left space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Commission <br /><span className="text-[#ffcf00]">Levels.</span></h2>
          <p className="text-gray-500 font-bold max-w-xl">Scale your volume and unlock industry-leading percentages automatically. Reach the top 1% of partners.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {tiers.map((tier, i) => (
            <div key={i} className={`p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-6 hover:border-white/20 transition-all ${i === 3 ? 'border-[#ffcf00]/40 bg-[#ffcf00]/5 ring-1 ring-[#ffcf00]/20' : ''}`}>
              <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tier.color}`}>{tier.label}</div>
              <div className="text-6xl font-black tracking-tight">{tier.rate}</div>
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{tier.range} Active Traders</div>
                <div className="text-[10px] font-black text-[#ffcf00] uppercase tracking-[0.1em]">{tier.perk}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNER TYPES */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Who Can <span className="text-[#ffcf00]">Join?</span></h2>
          <p className="text-gray-500 font-bold">Multiple entry points for every type of traffic provider.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {partnerTypes.map((type, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 space-y-6 hover:bg-white/[0.03] transition-all">
              <div className="text-2xl font-black text-white">{type.title}</div>
              <p className="text-gray-500 font-medium leading-relaxed">{type.desc}</p>
              <div className="h-px w-full bg-white/5" />
              <Link to="/register" className="text-[10px] font-black uppercase tracking-widest text-[#ffcf00] flex items-center gap-2 group">
                Become a Partner <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS BENTO */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="p-10 md:p-14 rounded-[3rem] bg-white/[0.01] border border-white/5 flex flex-col items-start gap-8 group hover:bg-white/[0.03] transition-all">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#ffcf00]/10 flex items-center justify-center text-[#ffcf00] group-hover:scale-110 transition-transform">
                <benefit.icon size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">{benefit.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Need Help?</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Partner Support Desk</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "How are RevShares calculated?", a: "We calculate your commission based on the net platform revenue generated from each trade made by your referred users." },
            { q: "When can I withdraw my earnings?", a: "You can request a withdrawal anytime. Payouts are processed 24/7 with a minimum of just $10." },
            { q: "Is there a limit on referrals?", a: "Absolutely not. You can refer an unlimited number of traders and earn from them for the lifetime of their account." }
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden group">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between p-8 text-left font-black text-sm md:text-lg items-center">
                {item.q} <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 pb-8 text-gray-500 font-medium leading-relaxed overflow-hidden">
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 md:py-44 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="bg-[#ffcf00] rounded-[4rem] md:rounded-[6rem] p-12 md:p-32 text-center space-y-10 text-black relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(255,207,0,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:scale-110 transition-transform duration-1000" />
          <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] relative z-10">
            JOIN THE <br />ELITE 1%.
          </h2>
          <div className="flex justify-center relative z-10 pt-6">
            <button onClick={() => navigate('/register')} className="px-16 py-8 bg-black text-[#ffcf00] rounded-3xl font-black text-2xl hover:scale-110 transition-transform shadow-2xl flex items-center gap-4">
              Get Your Elite Account <ArrowRight size={32} />
            </button>
          </div>
          <div className="pt-12 flex flex-wrap justify-center gap-10 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-40 relative z-10">
            <span>Instant Payouts</span>
            <span>80% Max Commission</span>
            <span>Lifetime Revenue</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-4 md:px-12 border-t border-white/5 bg-[#060709] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <Logo size={24} color="#ffcf00" />
            <span className="font-black text-xl tracking-tighter uppercase">Bivaax PARTNERS</span>
          </div>
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] text-center md:text-left">
            © {new Date().getFullYear()} Bivaax Global Network • Elite Tier Partnership Program
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Privacy</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
