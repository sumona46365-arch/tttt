import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  ArrowRight, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Zap, 
  ChevronDown, 
  ShieldCheck, 
  MessageSquare,
  Globe,
  PieChart,
  Bot,
  Laptop,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserCheck
} from 'lucide-react';
import { Logo } from '../components/Logo';
import SEO from '../components/SEO';
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, setDoc, doc, updateDoc, increment } from '../firebase';
import { toast } from 'react-hot-toast';
import { getNextAffiliateId, getUserByAffiliateId } from '../lib/affiliate';

export default function AffiliateLandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');

  // Auth widget states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password' | 'verify_reset_otp' | 'reset_password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login flow
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Forgot Password / Reset flow
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);

  // Register flow
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [regOtpCode, setRegOtpCode] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);

  // Interactive Calculator State
  const [tradersCount, setTradersCount] = useState(50);
  const [avgTradeVolume, setAvgTradeVolume] = useState(5000);

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Dynamic RevShare Rate based on referrals count
  const getRevShareRate = (count: number) => {
    if (count <= 10) return 50;
    if (count <= 50) return 60;
    if (count <= 100) return 70;
    return 80;
  };

  const revShareRate = getRevShareRate(tradersCount);
  // Estimate platform fee/revenue rate as 2.5% of total traded volume
  const estimatedPlatformRevenue = tradersCount * avgTradeVolume * 0.025;
  const estimatedMonthlyCommission = (estimatedPlatformRevenue * (revShareRate / 100)).toFixed(2);

  const faqs = [
    {
      q: "What is Bivaax Partners and how does it work?",
      a: "Bivaax Partners is our official affiliate marketing program. It enables content creators, community leaders, digital marketers, and trading experts to monetize their traffic. By promoting Bivaax with your unique tracking link, you earn a substantial lifetime commission of up to 80% of platform revenue generated from every trade your referrals make."
    },
    {
      q: "How high is the commission rate?",
      a: "We offer an escalating hybrid Revenue Share structure. You start at 50% flat commission rate of platform revenue, which scales automatically up to 80% based on active referral count. We also support sub-affiliate tiers, allowing you to earn an extra 10% from partners you refer."
    },
    {
      q: "When and how are payouts processed?",
      a: "Affiliate commissions are synchronized instantly in your partner vault. Payout requests are processed every hour with a low minimum threshold of only $10. We support fast withdrawals to verified USDT (TRC-20) addresses as well as other global fiat integrations inside your portal with zero platform charges."
    },
    {
      q: "Do I get dedicated marketing support?",
      a: "Standard, Silver, and VIP affiliates all gain access to our custom promotional hub. This includes landing page builders, interactive analytics dashboards, custom campaign tracking (Sub-IDs), localized brand kits, high-converting banner ads, and a highly responsive 24/7 dedicated partner support team."
    },
    {
      q: "Is there any cost to join?",
      a: "None whatsoever. Bivaax Partners is a completely free program. Registration takes less than 2 minutes, and your partner tracking credentials are generated instantly so you can start converting your audience immediately."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Handle Partner Login OTP request
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/partner/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code.");
      }
      setOtpSent(true);
      setCountdown(300); // 5 minutes
      toast.success("Security OTP sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Partner Login verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/partner/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Incorrect security code.");
      }

      // OTP is valid! Log in the user client side
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back, Partner!");
      navigate('/affiliate');
    } catch (err: any) {
      toast.error(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Partner Registration OTP request
  const handleRequestRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !regEmail || !regPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!agreed) {
      toast.error("You must agree to the Partnership Agreement.");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/partner/send-register-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, fullName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send verification code.");
      
      setRegOtpSent(true);
      setCountdown(300);
      toast.success("Registration OTP sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Partner Registration completion
  const handlePartnerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regOtpCode) {
      toast.error("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify Registration OTP
      const verifyResponse = await fetch('/api/auth/partner/verify-register-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, otp: regOtpCode })
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.error || "Invalid registration code.");

      const ref = localStorage.getItem('referralCode') || localStorage.getItem('referral_code');
      let finalReferrerUid = null;
      if (ref) {
        try {
          const referrerUser = await getUserByAffiliateId(ref);
          if (referrerUser && referrerUser.uid) {
            finalReferrerUid = referrerUser.uid;
          }
        } catch (err) {
          console.error("Referrer resolution failed:", err);
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;
      const affiliateId = await getNextAffiliateId();

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: fullName,
        balance: 0.0,
        demoBalance: 10000.0,
        currency: 'USD',
        affiliateId: affiliateId,
        referralCode: affiliateId.toString(),
        country: 'Global',
        countryCode: 'US',
        createdAt: Date.now(),
        isVerified: false,
        isPartner: true,
        referredBy: finalReferrerUid || null,
        referredByUid: finalReferrerUid || null,
        referredByCode: ref || null
      });

      if (finalReferrerUid) {
        try {
          await updateDoc(doc(db, 'users', finalReferrerUid), {
            referralCount: increment(1)
          });
        } catch (e) {
          console.error("Failed to increment referral count in Firestore", e);
        }
      }

      // Sync user profile to SQL backend
      try {
        await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: fullName,
            nickname: fullName.split(' ')[0],
            country: 'Global',
            countryCode: 'US',
            referralCode: affiliateId.toString(),
            referredByUid: finalReferrerUid || null
          })
        });
      } catch (err) {
        console.warn("Backend sync warning:", err);
      }

      toast.success("Partner account created successfully!");
      navigate('/affiliate');
    } catch (err: any) {
      toast.error(err.message || "Failed to apply for partnership.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password - Request OTP
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send reset code.");
      
      setAuthMode('verify_reset_otp');
      toast.success("Security OTP sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify Reset OTP
  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp) {
      toast.error("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid reset code.");
      
      setAuthMode('reset_password');
      toast.success("Verification successful!");
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: resetEmail, 
          token: resetOtp, 
          password: newPassword 
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to reset password.");
      
      toast.success("Password reset successful! You can now sign in.");
      setAuthMode('login');
      setEmail(resetEmail);
      setPassword('');
      setOtpSent(false);
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white font-sans selection:bg-[#ffcf00]/30 selection:text-black overflow-x-hidden">
      <SEO 
        title="Bivaax Partners | Official Affiliate & IB Program"
        description="Join the Bivaax Partner Network and earn industry-leading commissions. Earn up to 80% revenue share, lifetime recurring income, and high conversion rates. The best trading affiliate program for binary options."
        keywords="Bivaax affiliate, Bivaax partner, trading affiliate program, binary options affiliate, earn money trading, introducing broker program, trading commissions, IB program"
      />

      {/* FIXED FLOATING NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#07080a]/80 backdrop-blur-2xl border-b border-white/5 z-50 px-6 md:px-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-[#ffcf00] to-[#e69d00] rounded-xl shadow-lg shadow-[#ffcf00]/10 group-hover:scale-105 transition-transform duration-300">
              <Logo size={22} color="black" />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-black tracking-tighter leading-none mb-0.5">Bivaax</span>
              <span className="text-[9px] text-[#ffcf00] font-black uppercase tracking-[0.25em] leading-none">PARTNERS</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setAuthMode('login');
                setOtpSent(false);
                const el = document.getElementById('auth-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="px-5 py-2.5 rounded-xl text-[13px] font-black text-gray-300 hover:text-white transition-colors uppercase tracking-widest border border-white/5 hover:border-white/10 bg-white/5"
            >
              Sign In
            </button>
            <button 
              onClick={() => {
                setAuthMode('register');
                const el = document.getElementById('auth-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="bg-[#ffcf00] hover:bg-[#e6b800] text-black px-6 py-2.5 rounded-xl text-[13px] font-black transition-all shadow-xl shadow-[#ffcf00]/5 hover:shadow-[#ffcf00]/20 flex items-center gap-2 uppercase tracking-widest"
            >
              Apply Now <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO & SPLIT WORKSPACE SECTION */}
      <section className="pt-32 pb-24 px-6 md:px-12 relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[90vh]">
        {/* Abstract vector backgrounds */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[#ffcf00]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Left Side: Elegant copy & stats */}
        <div className="lg:col-span-7 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 bg-[#ffcf00]/10 border border-[#ffcf00]/20 px-4 py-1.5 rounded-full">
            <Award size={16} className="text-[#ffcf00]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ffcf00]">Elite Affiliate Network</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white">
            Monetize Traffic With Up To <span className="text-[#ffcf00]">80% Shares</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-xl font-medium leading-relaxed">
            Partner with the world's most transparent and high-payout trading system. Access localized brand banners, smart sub-tracking links, and instant payout processing.
          </p>

          {/* Mini benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mt-0.5">
                <Zap size={16} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-white">Hourly Fast Payouts</h4>
                <p className="text-[12px] text-gray-500 mt-0.5">Withdraw instantly via USDT with zero extra fee.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 mt-0.5">
                <Users size={16} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-white">Sub-Partner System</h4>
                <p className="text-[12px] text-gray-500 mt-0.5">Earn an additional 10% from the partners you introduce.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: High Fidelity Auth Card */}
        <div id="auth-section" className="lg:col-span-5 z-10">
          <div className="bg-[#121318]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient gold card glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ffcf00]/10 blur-xl rounded-full" />

            {/* Form Tabs */}
            {['login', 'register'].includes(authMode) && (
              <div className="flex border-b border-white/5 mb-6">
                <button 
                  onClick={() => {
                    setAuthMode('login');
                    setOtpSent(false);
                  }} 
                  className={`flex-1 pb-4 text-center text-sm font-bold uppercase tracking-wider transition-colors relative ${authMode === 'login' ? 'text-[#ffcf00]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Sign In
                  {authMode === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffcf00]" />}
                </button>
                <button 
                  onClick={() => setAuthMode('register')} 
                  className={`flex-1 pb-4 text-center text-sm font-bold uppercase tracking-wider transition-colors relative ${authMode === 'register' ? 'text-[#ffcf00]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Apply Now
                  {authMode === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffcf00]" />}
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {authMode === 'login' ? (
                <motion.div
                  key="login-form-pane"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  {!otpSent ? (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Partner Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            type="email" 
                            required
                            placeholder="partner@yourdomain.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#181920] border border-white/5 hover:border-white/10 focus:border-[#ffcf00] rounded-xl pl-12 pr-4 py-3.5 text-sm placeholder-gray-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required
                            placeholder="••••••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#181920] border border-white/5 hover:border-white/10 focus:border-[#ffcf00] rounded-xl pl-12 pr-12 py-3.5 text-sm placeholder-gray-600 focus:outline-none transition-colors"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <button 
                          type="button" 
                          onClick={() => {
                            setAuthMode('forgot_password');
                            setResetEmail(email);
                          }}
                          className="text-[10px] font-black text-[#ffcf00] hover:underline uppercase tracking-widest"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-13 font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 mt-4"
                      >
                        {loading ? "Checking Credentials..." : "Proceed & Send Code"}
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="inline-flex p-3 bg-[#ffcf00]/10 border border-[#ffcf00]/20 rounded-full text-[#ffcf00]">
                          <ShieldCheck size={28} />
                        </div>
                        <h4 className="text-lg font-black">Email OTP Verification</h4>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">
                          We have sent a secure 6-digit confirmation code to <strong className="text-gray-200">{email}</strong>.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Security Code</label>
                        <input 
                          type="text" 
                          maxLength={6}
                          required
                          placeholder="000000" 
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full bg-[#181920] border border-white/5 focus:border-[#ffcf00] rounded-xl px-4 py-4 text-center text-2xl font-black tracking-[0.4em] focus:outline-none placeholder-gray-700"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-13 font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                      >
                        {loading ? "Verifying..." : "Confirm & Access Portal"}
                      </button>

                      <div className="text-center">
                        {countdown > 0 ? (
                          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Resend Code in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                        ) : (
                          <button 
                            type="button" 
                            onClick={handleRequestOtp}
                            className="text-[11px] text-[#ffcf00] hover:underline font-black uppercase tracking-widest"
                          >
                            Resend Verification Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : authMode === 'register' ? (
                <motion.div
                  key="register-form-pane"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {!regOtpSent ? (
                    <form onSubmit={handleRequestRegisterOtp} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-[#181920] border border-white/5 hover:border-white/10 focus:border-[#ffcf00] rounded-xl px-4 py-3.5 text-sm placeholder-gray-600 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Partnership Email</label>
                        <input 
                          type="email" 
                          required
                          placeholder="partner@yourdomain.com" 
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-[#181920] border border-white/5 hover:border-white/10 focus:border-[#ffcf00] rounded-xl px-4 py-3.5 text-sm placeholder-gray-600 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Secure Password</label>
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••••••" 
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-[#181920] border border-white/5 hover:border-white/10 focus:border-[#ffcf00] rounded-xl px-4 py-3.5 text-sm placeholder-gray-600 focus:outline-none transition-colors"
                        />
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer select-none py-1">
                        <input 
                          type="checkbox" 
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-700 bg-black text-[#ffcf00] focus:ring-0 mt-0.5 accent-[#ffcf00]"
                        />
                        <span className="text-[11px] text-gray-400 font-medium leading-normal">
                          I hereby agree to the <span className="text-white hover:underline">Bivaax Partners Agreement</span> and standard terms of service.
                        </span>
                      </label>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-13 font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Send Verification Code"}
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePartnerRegister} className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="inline-flex p-3 bg-[#ffcf00]/10 border border-[#ffcf00]/20 rounded-full text-[#ffcf00]">
                          <ShieldCheck size={28} />
                        </div>
                        <h4 className="text-lg font-black">Verify Your Email</h4>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">
                          Enter the 6-digit verification code we sent to <strong className="text-gray-200">{regEmail}</strong>.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Registration Code</label>
                        <input 
                          type="text" 
                          maxLength={6}
                          required
                          placeholder="000000" 
                          value={regOtpCode}
                          onChange={(e) => setRegOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full bg-[#181920] border border-white/5 focus:border-[#ffcf00] rounded-xl px-4 py-4 text-center text-2xl font-black tracking-[0.4em] focus:outline-none placeholder-gray-700"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-13 font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                      >
                        {loading ? "Verifying..." : "Complete Registration"}
                      </button>

                      <div className="text-center">
                        <button 
                          type="button" 
                          onClick={() => setRegOtpSent(false)}
                          className="text-[11px] text-gray-500 hover:text-white font-black uppercase tracking-widest transition-colors"
                        >
                          Change Email Address
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : authMode === 'forgot_password' ? (
                <motion.div
                  key="forgot-password-pane"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-black">Reset Password</h4>
                    <p className="text-xs text-gray-400">Enter your partner email to receive a reset code.</p>
                  </div>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Partner Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                          type="email" 
                          required
                          placeholder="partner@yourdomain.com" 
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full bg-[#181920] border border-white/5 hover:border-white/10 focus:border-[#ffcf00] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-13 font-black uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('login')}
                      className="w-full text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-widest text-center transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </form>
                </motion.div>
              ) : authMode === 'verify_reset_otp' ? (
                <motion.div
                  key="verify-reset-otp-pane"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 bg-[#ffcf00]/10 border border-[#ffcf00]/20 rounded-full text-[#ffcf00]">
                      <ShieldCheck size={28} />
                    </div>
                    <h4 className="text-lg font-black">Reset Code Sent</h4>
                    <p className="text-xs text-gray-400">Please enter the 6-digit code sent to your email.</p>
                  </div>
                  <form onSubmit={handleVerifyResetOtp} className="space-y-6">
                    <input 
                      type="text" 
                      maxLength={6}
                      required
                      placeholder="000000" 
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-[#181920] border border-white/5 focus:border-[#ffcf00] rounded-xl px-4 py-4 text-center text-2xl font-black tracking-[0.4em] focus:outline-none"
                    />
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-13 font-black uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify Reset Code"}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="reset-password-pane"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-black">Create New Password</h4>
                    <p className="text-xs text-gray-400">Set a strong password for your partner account.</p>
                  </div>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          minLength={6}
                          placeholder="••••••••••••" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#181920] border border-white/5 hover:border-white/10 focus:border-[#ffcf00] rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none transition-colors"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-13 font-black uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CORE PARTNERSHIP PILLARS */}
      <section className="py-24 bg-[#0a0b0e] border-y border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Why Professionals Choose Us</h2>
            <p className="text-gray-400 text-sm md:text-base font-medium">We deliver unmatched technological solutions, robust conversion frameworks, and prompt commission settlements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#121318]/50 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-[#ffcf00]/10 rounded-xl flex items-center justify-center text-[#ffcf00] mb-6">
                <Percent size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold">Up to 80% RevShare</h3>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">Earn a significant portion of the platform fee from every single transaction executed by your referred traders for their lifetime.</p>
            </div>

            <div className="bg-[#121318]/50 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-[#ffcf00]/10 rounded-xl flex items-center justify-center text-[#ffcf00] mb-6">
                <Laptop size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold">Affiliate Marketing Suite</h3>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">Instantly access responsive tracking links, sub-id analytics tools, high-converting pre-made banners, and localized brand kits.</p>
            </div>

            <div className="bg-[#121318]/50 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-[#ffcf00]/10 rounded-xl flex items-center justify-center text-[#ffcf00] mb-6">
                <DollarSign size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold">Instant USDT Withdraw</h3>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">No holding periods or hidden fees. Initiate withdrawals anytime with a low $10 minimum threshold, processed on an hourly basis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE EARNINGS ESTIMATOR */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#121318] to-[#07080a] border border-white/5 rounded-[32px] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Estimate Your Partner Commissions</h2>
            <p className="text-gray-400 text-sm md:text-base font-medium">Use our interactive dynamic slider model to see how much commission you will generate monthly based on your referrals.</p>
            
            <div className="space-y-8 pt-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400">Referred Active Traders</span>
                  <span className="text-[#ffcf00]">{tradersCount} Traders</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="1000" 
                  value={tradersCount} 
                  onChange={(e) => setTradersCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#181920] rounded-full appearance-none cursor-pointer accent-[#ffcf00]" 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400">Average Volume per Trader</span>
                  <span className="text-indigo-400">${avgTradeVolume.toLocaleString()} USD</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={avgTradeVolume} 
                  onChange={(e) => setAvgTradeVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#181920] rounded-full appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#07080a]/60 border border-white/10 rounded-[24px] p-8 md:p-12 flex flex-col justify-between min-h-[380px]">
            <div className="text-center">
              <div className="text-6xl font-black text-[#ffcf00]">{revShareRate}%</div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">Your RevShare Tier</span>
            </div>
            <div className="py-8 border-y border-white/5 text-center">
              <div className="text-4xl md:text-5xl font-black text-white">${Number(estimatedMonthlyCommission).toLocaleString()}</div>
              <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mt-1.5 block">Estimated Monthly Payout</span>
            </div>
            <button 
              onClick={() => {
                setAuthMode('register');
                const el = document.getElementById('auth-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-[#ffcf00] hover:bg-[#e6b800] text-black h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
            >
              Start Earning Now
            </button>
          </div>
        </div>
      </section>

      {/* DETAILED FAQ ACCORDION */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Common Questions</h2>
          <input 
            type="text" 
            placeholder="Search queries..." 
            value={faqSearch} 
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full max-w-md bg-[#121318] border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffcf00] transition-colors mx-auto block" 
          />
        </div>
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="bg-[#121318]/40 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)} 
                className="w-full flex justify-between items-center p-6 text-left font-bold text-sm md:text-base hover:text-[#ffcf00] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`text-gray-500 transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#ffcf00]' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050608] border-t border-white/5 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="space-y-4 max-w-xs">
              <Link to="/" className="flex items-center gap-3">
                <div className="p-2 bg-[#ffcf00] rounded-xl text-black">
                  <Logo size={20} color="black" />
                </div>
                <span className="font-black text-white text-lg tracking-tighter">Bivaax PARTNERS</span>
              </Link>
              <p className="text-gray-600 font-medium text-xs leading-relaxed">
                The leading fintech partnership network for traders and influencers. We provide the most advanced tools to monetize your audience.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Platform</h4>
                <ul className="space-y-3 text-gray-500 font-bold text-xs uppercase tracking-widest">
                  <li><Link to="/trade" className="hover:text-[#ffcf00] transition-colors">Trade App</Link></li>
                  <li><Link to="/about-us" className="hover:text-[#ffcf00] transition-colors">About Us</Link></li>
                  <li><Link to="/help-center" className="hover:text-[#ffcf00] transition-colors">Help Center</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Resources</h4>
                <ul className="space-y-3 text-gray-500 font-bold text-xs uppercase tracking-widest">
                  <li><button onClick={() => { setAuthMode('login'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#ffcf00] transition-colors">Sign In</button></li>
                  <li><button onClick={() => { setAuthMode('register'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#ffcf00] transition-colors">Apply Now</button></li>
                  <li><button className="hover:text-[#ffcf00] transition-colors text-left">Media Kit</button></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 space-y-6 text-center md:text-left">
            <p className="text-[10px] text-gray-700 leading-relaxed font-bold uppercase tracking-widest max-w-4xl">
              Risk Disclaimer: Trading involves high financial risk. Bivaax Partners is a marketing program and does not provide financial advice. Ensure your users understand the risks before trading.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-gray-700 font-black tracking-[0.2em] uppercase">
                © {new Date().getFullYear()} Bivaax PARTNERS INC. ALL RIGHTS RESERVED.
              </p>
              <div className="flex gap-6 text-[10px] text-gray-700 font-black tracking-[0.2em] uppercase">
                <button className="hover:text-white transition-colors">Terms of Service</button>
                <button className="hover:text-white transition-colors">Privacy Policy</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
