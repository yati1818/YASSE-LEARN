'use client';

import React, { useState } from 'react';
import { Flame, Brain, Award, Sparkles, Zap, Trophy, X } from 'lucide-react';
import { StreakData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface StreakWidgetProps {
  streak: StreakData;
  vibeCategory: 'junior' | 'middle' | 'senior';
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ streak, vibeCategory }) => {
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const isJunior = vibeCategory === 'junior';

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Video Streak Flame */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
            isJunior 
              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/40 text-orange-600 font-bold shadow-md shadow-orange-200' 
              : 'bg-gradient-to-r from-orange-900/40 via-red-900/40 to-amber-900/40 border-orange-500/40 text-orange-400 shadow-lg shadow-orange-500/10'
          }`}
          title="Video Streak: Consecutive days watching video lessons!"
        >
          <div className="relative">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-flame-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            {streak.videoStreakDays} <span className="text-xs font-semibold">Days</span>
          </span>
        </motion.div>

        {/* Brain Power Streak */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
            isJunior 
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-purple-700 font-bold shadow-md shadow-purple-200' 
              : 'bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
          }`}
          title="Brain Power Streak: Solved quizzes & submitted active doubts!"
        >
          <div className="relative">
            <Brain className="w-5 h-5 text-cyan-400 fill-cyan-400/30 animate-synapse-glow" />
            <Zap className="w-3 h-3 text-amber-400 absolute -bottom-1 -right-1 animate-bounce" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            {streak.brainStreakDays} <span className="text-xs font-semibold">Brain ⚡</span>
          </span>
        </motion.div>

        {/* Total XP & Badges button */}
        <button
          onClick={() => setShowBadgesModal(true)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
            isJunior
              ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
              : 'bg-slate-800/80 text-amber-300 border-amber-500/30 hover:bg-slate-700/80'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{streak.totalXP} XP</span>
        </button>
      </div>

      {/* Badges Modal */}
      <AnimatePresence>
        {showBadgesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white shadow-2xl overflow-hidden"
            >
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />

              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Your Gamified Badges & Streaks
                  </h3>
                </div>
                <button 
                  onClick={() => setShowBadgesModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 flex items-center gap-3">
                  <Flame className="w-8 h-8 text-orange-500 animate-flame-pulse" />
                  <div>
                    <div className="text-xs text-orange-300 font-medium">Video Streak</div>
                    <div className="text-lg font-black text-orange-400">{streak.videoStreakDays} Days</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3">
                  <Brain className="w-8 h-8 text-cyan-400 animate-synapse-glow" />
                  <div>
                    <div className="text-xs text-cyan-300 font-medium">Brain Power</div>
                    <div className="text-lg font-black text-cyan-300">{streak.brainStreakDays} Synapses</div>
                  </div>
                </div>
              </div>

              {/* Unlocked Badges List */}
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-400" /> Unlocked Achievements ({streak.badgesUnlocked.length})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {streak.badgesUnlocked.map((badge) => (
                  <div 
                    key={badge.id}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 rounded-lg bg-slate-700/50 border border-slate-600">
                        {badge.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-100">{badge.title}</div>
                        <div className="text-xs text-slate-400">{badge.description}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{badge.unlockedAt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
