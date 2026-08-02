'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, Sparkles, Flame, Brain, ArrowRight, BookOpen, Users, Trophy } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');

  const handleStartOnboarding = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    localStorage.setItem('yasse_draft_role', role);
    router.push(`/onboarding?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-cyan-500/20">
            <GraduationCap size={26} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            YASSE <span className="text-cyan-400">Learn</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 font-bold text-xs transition-all border border-slate-700 shadow-md flex items-center gap-1.5"
          >
            <BookOpen size={14} />
            <span>Explore Live Dashboard →</span>
          </Link>
        </div>
      </header>

      {/* Hero Section & Immediate Solid Role Selection */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center justify-center text-center space-y-8">
        
        {/* Splash Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs shadow-lg">
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
          <span>Premier Free Educational Platform for Class 3 to Class 12</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Learn Concepts. Ask Doubts. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Build Unstoppable Streaks! 🔥🧠
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            An engaging, highly professional learning ecosystem with AI-verified teacher lectures, direct doubt dispatch, GitHub-style contribution streaks, and free-form ChatGPT AI study assistance.
          </p>
        </div>

        {/* Role Selection Card Grid */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          
          {/* Card 1: Student */}
          <div
            onClick={() => handleStartOnboarding('student')}
            className={`group relative p-6 rounded-2xl border text-left cursor-pointer transition-all ${
              selectedRole === 'student'
                ? 'bg-slate-950 border-purple-500 shadow-xl shadow-purple-500/20'
                : 'bg-slate-950/80 border-slate-800 hover:border-purple-500/60'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform">
                <GraduationCap size={32} />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-extrabold">
                Class 3–12 Student
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              I am a Student 🎓
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Explore adaptive lectures, track GitHub-style video streaks 🔥, unlock brain synapses 🧠, and ask teacher doubts directly.
            </p>
            <button className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md">
              <span>Setup Student Profile</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Teacher / Graduate */}
          <div
            onClick={() => handleStartOnboarding('teacher')}
            className={`group relative p-6 rounded-2xl border text-left cursor-pointer transition-all ${
              selectedRole === 'teacher'
                ? 'bg-slate-950 border-amber-500 shadow-xl shadow-amber-500/20'
                : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/60'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold">
                AI Verified Educator
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
              I am a Teacher / Graduate 👩‍🏫
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Upload video lectures, get automated AI compliance verification, and resolve student doubts via email.
            </p>
            <button className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md">
              <span>Teacher Upload Studio</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left w-full max-w-4xl pt-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <Flame className="w-6 h-6 text-orange-500 shrink-0 mt-0.5 animate-flame-pulse" />
            <div>
              <div className="text-xs font-bold text-white">GitHub Streak Heatmap 🔥</div>
              <div className="text-[11px] text-slate-400">35-tile contribution grid tracking daily watch logs.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <Brain className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Brain Synapse 🧠</div>
              <div className="text-[11px] text-slate-400">Interactive quiz & problem solving XP points.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Developer Token Approval</div>
              <div className="text-[11px] text-slate-400">Direct email token links targeting yatishsathish3012@gmail.com.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">ChatGPT AI Assistant</div>
              <div className="text-[11px] text-slate-400">Male (Prof. Aryan) & Female (Dr. Ananya) tutor personas.</div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-slate-400 border-t border-slate-800/80 bg-slate-900/60">
        YASSE Learn • Free Educational Access for Class 3–12. Developer Approvals target: <span className="text-cyan-400 font-mono">yatishsathish3012@gmail.com</span>
      </footer>
    </div>
  );
}
