'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Phone, ArrowRight, Sparkles, CheckCircle2, AlertCircle, KeyRound, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { SecurityCaptcha } from '@/components/ui/SecurityCaptcha';
import { useYasseStore } from '@/lib/store';

export default function LandingPage() {
  const router = useRouter();
  const { saveUser } = useYasseStore();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('yatishsathish3012@gmail.com');
  const [grade, setGrade] = useState('Class 10');
  const [board, setBoard] = useState('CBSE');

  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isCaptchaSolved) {
      setError('Please solve the Security CAPTCHA challenge before proceeding.');
      return;
    }

    const cleanMobile = mobileNumber.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError('Invalid 10-digit Indian mobile number format. Must start with 6-9.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber: cleanMobile, pin }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Authentication failed.');
        } else {
          saveUser(data.user);
          router.push('/dashboard');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber: cleanMobile, pin, name, email, grade, board }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Registration failed.');
        } else {
          saveUser(data.user);
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Corporate SBI-Style Top Security Banner */}
      <div className="w-full max-w-lg mb-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <ShieldCheck size={18} />
          <span>YASSE SBI-Grade Institutional Security</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono">256-bit TLS Encrypted</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6"
      >
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs border border-cyan-400/40">
            <Lock size={14} className="text-amber-400" />
            <span>Strict Authentication Barrier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            YASSE Learn Official Portal
          </h1>
          <p className="text-xs text-slate-400">
            One Mobile Number = One Unique Account Standard
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-950 border border-slate-800 p-1">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'login' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔒 Sign In (Registered Users)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'signup' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✨ Sign Up (New Mobile)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleMobileSubmit} className="space-y-4">
          
          {activeTab === 'signup' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Student / Educator Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yatish Sathish"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Grade Class</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  >
                    {['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Board</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  >
                    <option value="CBSE">🏫 CBSE</option>
                    <option value="ICSE">📘 ICSE</option>
                    <option value="State Board">🏛 State Board</option>
                    <option value="International">🌐 International</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 10-Digit Mobile Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <Phone size={12} className="text-cyan-400" />
              <span>10-Digit Mobile Number (Indian Format)</span>
            </label>
            <input
              type="text"
              required
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono tracking-wider focus:border-cyan-500"
            />
          </div>

          {/* 6-Digit Security PIN */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <KeyRound size={12} className="text-amber-400" />
              <span>6-Digit Security PIN</span>
            </label>
            <input
              type="password"
              required
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit PIN"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-sm font-mono tracking-widest focus:border-cyan-500"
            />
          </div>

          {/* Security Math CAPTCHA Component */}
          <SecurityCaptcha onVerify={(isValid) => setIsCaptchaSolved(isValid)} />

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isCaptchaSolved}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
              isCaptchaSolved
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{loading ? 'Authenticating...' : activeTab === 'login' ? 'Authenticate & Access Dashboard' : 'Create Bank-Verified Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
