import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, MessageSquare, Ticket, BookOpen, Shield, 
  CreditCard, Wallet, TrendingUp, UserCheck, HelpCircle, 
  ChevronRight, ArrowRight, Plus, Send, Paperclip, 
  Smile, Mic, Image as ImageIcon, X, MessageCircle, 
  ChevronDown, Mail, Phone, Zap, Star, Layout, 
  User, History, AlertCircle, CheckCircle2, Clock, 
  Smartphone, Globe, Info, Headphones, Sparkles, Loader2,
  Trash2, ShieldCheck, CheckCheck, Menu, Filter,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { auth, db, collection, addDoc, query, where, orderBy, onSnapshot, doc, updateDoc, getDoc } from '../firebase';
import { useI18n } from '../context/I18nContext';
import { useTranslation } from '../lib/translations';
import { toast } from 'react-hot-toast';
import { TwoFaTutorial } from '../components/TwoFaTutorial';

interface SupportTicket {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  subject?: string;
  category?: string;
  status?: 'open' | 'pending' | 'resolved' | 'closed' | string;
  lastMessage?: string;
  createdAt?: number;
  updatedAt?: number;
}

interface TicketMessage {
  id?: string;
  ticketId?: string;
  senderId?: string;
  senderName?: string;
  senderType?: 'user' | 'support' | 'agent';
  isAdmin?: boolean;
  text?: string;
  message?: string;
  attachments?: string[];
  createdAt?: number;
}

interface Category {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}

const FAQS = [
  { q: "How long do deposits take?", a: "Crypto deposits typically reflect after 1-3 network confirmations (approx. 5-10 mins). MFS deposits like bKash are processed within 15-30 minutes." },
  { q: "What is the minimum withdrawal?", a: "The minimum withdrawal amount is $10 for most methods. Fees vary depending on the network used." },
  { q: "How to enable 2FA?", a: "Go to Profile > Security > Google Authenticator. Scan the QR code and enter the 6-digit verification code." },
  { q: "My verification was rejected, why?", a: "Common reasons include blurry images, expired documents, or a mismatch between the ID and your profile information." }
];

export default function ClientSupportCenter() {
  const navigate = useNavigate();
  const [view, setView] = useState<'home' | 'tickets' | 'chat' | 'new_ticket' | '2fa_tutorial'>('home');
  const [chatMessage, setChatMessage] = useState('');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useI18n();
  const { t } = useTranslation(language);

  const currentUser = auth.currentUser;
  const currentUid = currentUser?.uid || '';

  // Fetch User Tickets
  useEffect(() => {
    if (!currentUid) return;

    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', currentUid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SupportTicket[];
      setTickets(ticketsData);
      
      if (activeTicket) {
        const updated = ticketsData.find(t => t.id === activeTicket.id);
        if (updated) setActiveTicket(updated);
      }
    }, (err) => {
      console.warn("Tickets subscription error:", err);
    });

    return () => unsubscribe();
  }, [currentUid, activeTicket?.id]);

  // Fetch Messages for Active Ticket
  useEffect(() => {
    if (!activeTicket?.id || view !== 'chat') {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'tickets', activeTicket.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as TicketMessage[];
      setMessages(msgList);
    });

    return () => unsubscribe();
  }, [activeTicket?.id, view]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, view]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() && attachedFiles.length === 0) return;
    if (!activeTicket?.id) return;

    setIsSending(true);
    const now = Date.now();
    const text = chatMessage;
    const files = [...attachedFiles];

    setChatMessage('');
    setAttachedFiles([]);

    try {
      const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const messagePayload = {
        ticketId: activeTicket.id,
        senderId: currentUid,
        senderName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
        senderType: 'user',
        isAdmin: false,
        text: text,
        attachments: files,
        createdAt: now
      };

      try {
        await fetch('/api/tickets/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: activeTicket.id,
            messageId: msgId,
            messageData: messagePayload
          })
        });
      } catch (sqlErr) {
        console.warn('PostgreSQL message persist warning:', sqlErr);
      }

      try {
        await addDoc(collection(db, 'tickets', activeTicket.id, 'messages'), messagePayload);

        await updateDoc(doc(db, 'tickets', activeTicket.id), {
          lastMessage: text || (files.length > 0 ? 'Sent an attachment' : ''),
          updatedAt: now,
          status: 'Open'
        });
      } catch (fsErr) {
        console.warn('Firestore ticket sync warning:', fsErr);
      }

      toast.success('Message sent');
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!chatMessage.trim()) {
      toast.error('Please describe your issue or question.');
      return;
    }

    setIsSending(true);
    const now = Date.now();
    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const ticketPayload = {
        userId: currentUid,
        userName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
        userEmail: currentUser?.email || '',
        subject: newSubject.trim() || newCategory + ' Support Inquiry',
        category: newCategory,
        status: 'open',
        lastMessage: chatMessage,
        createdAt: now,
        updatedAt: now
      };

      try {
        await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId, ticketData: ticketPayload })
        });
      } catch (sqlErr) {
        console.warn('PostgreSQL ticket create warning:', sqlErr);
      }

      const docRef = await addDoc(collection(db, 'tickets'), ticketPayload);
      const actualId = docRef.id || ticketId;

      const firstMsg = {
        ticketId: actualId,
        senderId: currentUid,
        senderName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
        senderType: 'user',
        isAdmin: false,
        text: chatMessage,
        attachments: attachedFiles,
        createdAt: now
      };

      await addDoc(collection(db, 'tickets', actualId, 'messages'), firstMsg);

      setActiveTicket({ id: actualId, ...ticketPayload });
      setView('chat');
      setChatMessage('');
      setAttachedFiles([]);
      setNewSubject('');
      toast.success('Support ticket created successfully!');
    } catch (err) {
      console.error("Error creating ticket:", err);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setAttachedFiles(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 font-sans pb-16 overflow-x-hidden">
      
      {/* Enterprise Professional Header */}
      <header className="sticky top-0 z-[100] bg-[#0b0e14]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 md:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={() => {
              if (view === 'home') navigate('/trade');
              else setView('home');
            }} 
            className="group flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-all"
          >
            <div className="p-2 bg-white/5 group-hover:bg-[#f0b90b]/10 rounded-xl border border-white/5 group-hover:border-[#f0b90b]/30 transition-all">
              <ChevronRight className="rotate-180" size={16} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Terminal</span>
          </button>
          
          <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f0b90b] to-amber-600 flex items-center justify-center font-black text-black shadow-lg shadow-[#f0b90b]/20">
              <Headphones size={20} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">Bivaax <span className="text-[#f0b90b]">Support</span></h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">24/7 VIP Desk Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setView('tickets')}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${view === 'tickets' ? 'bg-[#f0b90b] text-black border-[#f0b90b] shadow-[0_0_15px_rgba(240,185,11,0.3)]' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}
          >
            <Ticket size={16} /> <span className="hidden xs:inline">My Tickets</span> ({tickets.length})
          </button>
          
          <button 
            onClick={() => setView('new_ticket')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#00c980] hover:bg-[#00b372] text-black font-black rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-lg shadow-[#00c980]/20"
          >
            <Plus size={16} /> New Ticket
          </button>

          <div className="w-9 h-9 rounded-xl bg-[#1e2329] border border-white/10 flex items-center justify-center font-bold text-white text-xs">
            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {view === 'home' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 sm:space-y-16">
            
            {/* Hero Banner - Professional International Trading Desk Style */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#12161c] to-[#0e1217] border border-white/10 rounded-3xl sm:rounded-[40px] p-6 sm:p-10 md:p-16 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#f0b90b]/5 blur-[120px] pointer-events-none rounded-full"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0b90b]/10 border border-[#f0b90b]/30 text-[#f0b90b] text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                    <Sparkles size={14} /> Professional Client Assistance
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                    Dedicated Support for <br className="hidden sm:inline"/>
                    <span className="text-[#f0b90b]">Global Traders.</span>
                  </h2>
                  
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg font-normal max-w-xl leading-relaxed">
                    Access expert assistance for deposits, withdrawals, verification, and order execution with industry-leading resolution times.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button 
                      onClick={() => setView('new_ticket')}
                      className="w-full sm:w-auto h-14 px-8 bg-[#f0b90b] hover:bg-[#d9a508] text-black font-black rounded-xl sm:rounded-2xl shadow-xl shadow-[#f0b90b]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-wider text-xs"
                    >
                      <Plus size={18} strokeWidth={3} /> Start Support Ticket
                    </button>
                    <button 
                      onClick={() => setView('tickets')}
                      className="w-full sm:w-auto h-14 px-8 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl sm:rounded-2xl border border-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-wider text-xs"
                    >
                      <History size={18} /> Track Active Tickets ({tickets.length})
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div className="p-6 bg-[#0b0e14] border border-white/5 rounded-2xl sm:rounded-3xl flex items-center gap-4 shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck size={26} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Verified Security</h4>
                      <p className="text-xs text-gray-400 mt-0.5">End-to-end encrypted desk</p>
                    </div>
                  </div>

                  <div className="p-6 bg-[#0b0e14] border border-white/5 rounded-2xl sm:rounded-3xl flex items-center gap-4 shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0b90b]/10 text-[#f0b90b] flex items-center justify-center shrink-0">
                      <Zap size={26} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Instant Response</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Average reply under 3 mins</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Categories */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Support Topics</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Select an area for immediate assistance</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">All Systems Operational</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { title: 'Deposit & Funding', desc: 'bKash, Nagad, Crypto & Bank transfers', icon: Wallet, color: 'emerald', msg: "I need help with my deposit transaction." },
                  { title: 'Withdrawal Status', desc: 'Processing times and payout inquiries', icon: CreditCard, color: 'amber', msg: "I would like to check my withdrawal status." },
                  { title: 'Trading & Orders', desc: 'Execution, charts & platform tools', icon: TrendingUp, color: 'blue', msg: "I have a question regarding trade execution." },
                  { title: 'Identity KYC', desc: 'Account verification & document review', icon: UserCheck, color: 'purple', msg: "I need assistance with my KYC verification." },
                  { title: 'Security & 2FA', desc: 'Google Auth, passwords & safety', icon: Shield, color: 'red', msg: "I need help securing my account or resetting 2FA." },
                  { title: 'Bonuses & VIP', desc: 'Promotions, tiers & cashback rewards', icon: Star, color: 'yellow', msg: "I have a question about VIP status and rewards." },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      setView('new_ticket');
                      setNewCategory(item.title.split(' ')[0]);
                      setChatMessage(item.msg);
                      setNewSubject(item.title);
                    }}
                    className="p-6 sm:p-8 bg-[#12161c] border border-white/5 hover:border-[#f0b90b]/40 rounded-2xl sm:rounded-3xl transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 text-${item.color}-400 flex items-center justify-center mb-5 shadow-md`}>
                        <item.icon size={24} />
                      </div>
                      <h4 className="text-base font-black text-white group-hover:text-[#f0b90b] transition-colors">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase text-[#f0b90b] mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Get Support</span> <ArrowRight size={14} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Featured Interactive 2FA Tutorial Banner */}
            <section className="space-y-6">
              <div className="p-8 sm:p-10 bg-gradient-to-r from-[#12161c] via-[#1a212b] to-[#12161c] border border-[#f0b90b]/30 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0b90b]/10 blur-[100px] pointer-events-none rounded-full"></div>
                <div className="space-y-4 max-w-xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0b90b]/10 border border-[#f0b90b]/30 text-[#f0b90b] text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} /> Recommended Security Guide
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Step-by-Step 2FA Activation Tutorial</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Learn how to secure your trading account with Google Authenticator in 4 simple steps with visual diagrams and instant linking to profile security settings.
                  </p>
                </div>
                <button
                  onClick={() => setView('2fa_tutorial')}
                  className="px-8 py-4 bg-[#f0b90b] hover:bg-[#d9a508] text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-[#f0b90b]/20 transition-all flex items-center gap-2 shrink-0 active:scale-95 relative z-10"
                >
                  <span>Launch 2FA Tutorial</span> <ArrowRight size={16} />
                </button>
              </div>
            </section>

            {/* FAQs */}
            <section className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Frequently Asked Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {FAQS.map((faq, i) => (
                  <div key={i} className="p-6 sm:p-8 bg-[#12161c] border border-white/5 rounded-2xl sm:rounded-3xl space-y-3 shadow-lg">
                    <h4 className="text-sm font-black text-white">{faq.q}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </motion.div>
        )}

        {view === '2fa_tutorial' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <TwoFaTutorial onClose={() => setView('home')} />
          </motion.div>
        )}

        {view === 'tickets' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">My Support Tickets</h3>
                <p className="text-xs text-gray-400">Track and manage your active inquiries</p>
              </div>
              <button 
                onClick={() => setView('new_ticket')}
                className="px-6 py-3 bg-[#f0b90b] hover:bg-[#d9a508] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#f0b90b]/20"
              >
                + New Ticket
              </button>
            </div>
            
            <div className="space-y-4">
              {tickets.length > 0 ? tickets.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => { setActiveTicket(t); setView('chat'); }}
                  className="bg-[#12161c] border border-white/5 p-6 rounded-2xl sm:rounded-3xl hover:border-white/20 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="flex items-start sm:items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                       t.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                     }`}>
                        <MessageCircle size={24} />
                     </div>
                     <div>
                        <h4 className="font-black text-white text-sm sm:text-base group-hover:text-[#f0b90b] transition-colors">{t.subject}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">"{t.lastMessage}"</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 font-mono">
                           <span>ID: {t.id}</span>
                           <span>•</span>
                           <span className="uppercase">{t.category}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        t.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'
                     }`}>{t.status}</span>
                     <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {new Date(t.updatedAt || t.createdAt || Date.now()).toLocaleDateString()}
                     </span>
                  </div>
                </div>
              )) : (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 bg-[#12161c] border border-white/5 rounded-3xl">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
                      <Ticket size={32} />
                   </div>
                   <div>
                      <h4 className="text-base font-black text-white">No tickets found</h4>
                      <p className="text-xs text-gray-400 mt-1">You haven't submitted any support tickets yet.</p>
                   </div>
                   <button 
                     onClick={() => setView('new_ticket')}
                     className="mt-4 px-6 py-2.5 bg-[#f0b90b] text-black font-black text-xs uppercase tracking-wider rounded-xl"
                   >
                     Create First Ticket
                   </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {view === 'new_ticket' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
             <div className="bg-[#12161c] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
                <div>
                   <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Create Support Ticket</h3>
                   <p className="text-xs sm:text-sm text-gray-400 mt-1">Provide details of your inquiry for priority assistance</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full h-12 bg-[#0b0e14] border border-white/10 rounded-xl px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#f0b90b] transition-all"
                      >
                         <option value="General">General Inquiry</option>
                         <option value="Deposit">Deposit Issue</option>
                         <option value="Withdrawal">Withdrawal Status</option>
                         <option value="KYC">Identity Verification</option>
                         <option value="Security">Security & 2FA</option>
                         <option value="Trading">Trading Platform</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Subject (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Deposit not reflecting"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="w-full h-12 bg-[#0b0e14] border border-white/10 rounded-xl px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#f0b90b] transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Description / Message</label>
                   <textarea 
                     rows={5}
                     placeholder="Please provide transaction IDs, email address, or specific details..."
                     value={chatMessage}
                     onChange={(e) => setChatMessage(e.target.value)}
                     className="w-full bg-[#0b0e14] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#f0b90b] transition-all resize-none leading-relaxed"
                   />
                </div>

                {/* Attachments */}
                <div className="space-y-3">
                   <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, i) => (
                        <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                           <img src={file} alt="preview" className="w-full h-full object-cover" />
                           <button 
                             onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                             className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-xl border border-dashed border-white/20 hover:border-[#f0b90b] flex flex-col items-center justify-center text-gray-400 hover:text-[#f0b90b] transition-all"
                      >
                         <Plus size={20} />
                         <span className="text-[9px] font-bold mt-1">Image</span>
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
                   </div>
                </div>

                <div className="flex gap-3 pt-2">
                   <button 
                     onClick={() => setView('home')}
                     className="w-1/3 h-14 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleCreateTicket}
                     disabled={isSending}
                     className="w-2/3 h-14 bg-[#f0b90b] hover:bg-[#d9a508] text-black font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#f0b90b]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                   >
                      {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                      {isSending ? 'Submitting...' : 'Submit Ticket'}
                   </button>
                </div>
             </div>
          </motion.div>
        )}

        {view === 'chat' && activeTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] flex flex-col bg-[#12161c] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
             
             {/* Chat Top Bar */}
             <div className="px-4 sm:px-6 py-4 border-b border-white/10 bg-[#0b0e14]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-[#f0b90b] text-black flex items-center justify-center font-black shadow-md">
                      <Headphones size={20} />
                   </div>
                   <div>
                      <h4 className="font-black text-white text-xs sm:text-sm uppercase tracking-wide truncate max-w-[200px] sm:max-w-md">{activeTicket.subject}</h4>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                         <span className="text-[10px] text-gray-400 uppercase tracking-widest">VIP Desk Assigned</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => setView('tickets')}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 transition-all"
                >
                   <X size={18} />
                </button>
             </div>

             {/* Message History */}
             <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#0b0e14]/30">
                {messages.map((m, i) => {
                  const isUser = m.senderType === 'user';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[85%] sm:max-w-[70%] space-y-1`}>
                          <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                            isUser 
                              ? 'bg-[#f0b90b] text-black rounded-br-none font-medium' 
                              : 'bg-[#1b222c] text-gray-100 border border-white/10 rounded-bl-none'
                          }`}>
                             {m.text}
                             
                             {m.attachments && m.attachments.length > 0 && (
                               <div className="mt-3 flex flex-wrap gap-2">
                                  {m.attachments.map((img, idx) => (
                                    <a key={idx} href={img} target="_blank" rel="noreferrer" className="block w-28 h-28 rounded-xl overflow-hidden border border-black/20 hover:opacity-90">
                                       <img src={img} alt="attachment" className="w-full h-full object-cover" />
                                    </a>
                                  ))}
                               </div>
                             )}
                          </div>
                          <div className={`flex items-center gap-2 px-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider ${isUser ? 'justify-end' : 'justify-start'}`}>
                             <span>{!isUser ? 'Support Agent' : 'You'}</span>
                             <span>•</span>
                             <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                       </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 sm:p-5 bg-[#0b0e14] border-t border-white/10 space-y-3">
                {attachedFiles.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((f, i) => (
                        <div key={i} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-white/10">
                           <img src={f} alt="preview" className="w-full h-full object-cover" />
                           <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Trash2 size={12} />
                           </button>
                        </div>
                      ))}
                   </div>
                )}
                
                <div className="flex items-center gap-2 sm:gap-3">
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 transition-all shrink-0"
                   >
                      <Paperclip size={20} />
                   </button>
                   
                   <input 
                     type="text" 
                     placeholder="Type your reply..."
                     value={chatMessage}
                     onChange={(e) => setChatMessage(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                     className="flex-1 h-12 sm:h-14 bg-[#12161c] border border-white/10 rounded-xl px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#f0b90b] transition-all"
                   />
                   
                   <button 
                     onClick={handleSendMessage}
                     disabled={isSending || (!chatMessage.trim() && attachedFiles.length === 0)}
                     className="w-12 h-12 sm:w-14 sm:h-14 bg-[#f0b90b] hover:bg-[#d9a508] text-black rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 shrink-0 disabled:opacity-50"
                   >
                      <Send size={20} />
                   </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
             </div>

          </motion.div>
        )}

      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(240, 185, 11, 0.4);
        }
      `}</style>
    </div>
  );
}
