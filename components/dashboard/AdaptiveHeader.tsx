'use client';

import React from 'react';
import { Sparkles, Rocket, Compass, BookOpen, ShieldCheck, Trophy, Flame } from 'lucide-react';
import { UserProfile, VibeCategory } from '@/lib/types';
import { VerifiedBadge } from '../ui/VerifiedBadge';

interface AdaptiveHeaderProps {
  user: UserProfile | null;
  vibeCategory: VibeCategory;
}

export const AdaptiveHeader: React.FC<AdaptiveHeaderProps> = ({ user, vibeCategory }) => {
  const grade = user?.grade || 'Class 10';
  const name = user?.name || 'Explorer';

  if (vibeCategory === 'junior') {
    return (
      <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-2xl overflow-hidden border border-pink-400/30">
        {/* Floating background decorative bubbles */}
        <div className="absolute top-2 right-12 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-bounce" />
        <div className="absolute -bottom-6 right-24 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-yellow-300 font-black text-xs backdrop-blur-md border border-white/30">
              <Rocket size={14} className="animate-bounce" />
              <span>Junior Explorer Hub ({grade})</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-playful">
              Welcome back, {name}! 🌟
            </h1>
            <p className="text-pink-100 text-sm max-w-xl font-medium">
              Ready for exciting space science adventures and math pizza puzzles today? Pick a fun topic below!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 p-3.5 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="text-3xl">🚀</div>
            <div>
              <div className="text-xs font-bold text-pink-200">Daily Quest</div>
              <div className="text-sm font-extrabold text-white">Watch 1 Science Video</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (vibeCategory === 'middle') {
    return (
      <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 text-slate-100 shadow-2xl overflow-hidden border border-cyan-500/30">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/40">
              <Compass size={14} className="animate-spin text-cyan-400" />
              <span>Middle Achiever Track ({grade})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Keep pushing forward, {name}! ⚡
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Master core concepts with step-by-step videos, interactive doubt clarifications, and gamified streak boosts.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-cyan-500/30">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Trophy size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Weekly Goal</div>
              <div className="text-sm font-bold text-cyan-300">3/5 Quizzes Completed</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Senior (Class 9-12)
  return (
    <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden border border-slate-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/40">
            <BookOpen size={14} className="text-emerald-400" />
            <span>Senior Scholar Exam Prep ({grade})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Academic Focus Workspace • {name}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            In-depth Physics, Chemistry, and Math lecture tracks with AI-verified teachers and instant doubt routing.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <VerifiedBadge score={100} showText={false} size="lg" />
          <div>
            <div className="text-xs text-emerald-400 font-bold">100% AI Compliance</div>
            <div className="text-xs text-slate-400">Verified Educator Metadata</div>
          </div>
        </div>
      </div>
    </div>
  );
};
