'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Flame, CheckCircle2, Award, Zap, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StudySessionTrackerProps {
  onUnlockStreak: (xpGained: number, badgeName: string) => void;
}

export const StudySessionTracker: React.FC<StudySessionTrackerProps> = ({ onUnlockStreak }) => {
  const [secondsActive, setSecondsActive] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [hasUnlockedToday, setHasUnlockedToday] = useState(false);

  const REQUIRED_SECONDS = 30 * 60; // 30 Minutes = 1800 Seconds

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && secondsActive < REQUIRED_SECONDS) {
      interval = setInterval(() => {
        setSecondsActive((s) => {
          const next = s + 1;
          if (next >= REQUIRED_SECONDS && !hasUnlockedToday) {
            setHasUnlockedToday(true);
            onUnlockStreak(100, '30-Min Daily Study Champion Badge 🔥');
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsActive, REQUIRED_SECONDS, hasUnlockedToday, onUnlockStreak]);

  const minutes = Math.floor(secondsActive / 60);
  const seconds = secondsActive % 60;
  const progressPercent = Math.min(100, Math.round((secondsActive / REQUIRED_SECONDS) * 100));

  return (
    <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl text-slate-950 font-bold ${hasUnlockedToday ? 'bg-amber-400' : 'bg-cyan-500'}`}>
            {hasUnlockedToday ? <Flame size={18} className="animate-bounce" /> : <Timer size={18} />}
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white">Daily 30-Min Active Study Tracker</h4>
            <p className="text-[11px] text-slate-400">Study 30 mins to unlock daily streak & +100 Brain XP</p>
          </div>
        </div>

        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
        >
          {isTimerRunning ? <Pause size={14} className="text-amber-400" /> : <Play size={14} className="text-emerald-400" />}
          <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold font-mono">
          <span className="text-cyan-300">
            ⏱ {minutes}:{seconds < 10 ? `0${seconds}` : seconds} / 30:00
          </span>
          <span className={hasUnlockedToday ? 'text-amber-400 font-black' : 'text-slate-400'}>
            {progressPercent}% Complete
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-300 ${
              hasUnlockedToday
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600'
            }`}
          />
        </div>
      </div>

      {hasUnlockedToday && (
        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5">
          <CheckCircle2 size={16} className="text-amber-400" />
          <span>30-Min Active Study Complete! Daily Streak +1 & +100 XP Unlocked!</span>
        </div>
      )}
    </div>
  );
};
