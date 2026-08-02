'use client';

import React from 'react';
import { Flame, Brain, Trophy, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface GitHubStreakHeatmapProps {
  calendarLogs: string[]; // YYYY-MM-DD dates of real activity
  videoStreakDays: number;
  brainStreakDays: number;
  totalXP: number;
}

export const GitHubStreakHeatmap: React.FC<GitHubStreakHeatmapProps> = ({
  calendarLogs = [],
  videoStreakDays = 0,
  brainStreakDays = 0,
  totalXP = 0,
}) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Generate last 35 days (5 weeks x 7 days) for GitHub contribution grid
  const daysGrid = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (34 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayNum = d.getDate();
    const isToday = dateStr === todayStr;
    const isLogged = calendarLogs.includes(dateStr);

    // Count occurrences of dateStr in calendarLogs for activity intensity
    const activityCount = calendarLogs.filter(log => log === dateStr).length;

    let intensityClass = 'bg-slate-950 border-slate-800/80 text-slate-600';
    if (isLogged) {
      if (activityCount >= 3) {
        intensityClass = 'bg-orange-500 border-orange-400 text-slate-950 font-bold shadow-md shadow-orange-500/30 animate-pulse';
      } else if (activityCount === 2) {
        intensityClass = 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-sm';
      } else {
        intensityClass = 'bg-emerald-800/80 border-emerald-600/80 text-emerald-200';
      }
    } else if (isToday) {
      intensityClass = 'bg-slate-900 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/40';
    }

    return {
      dateStr,
      dayNum,
      isLogged,
      isToday,
      activityCount,
      intensityClass,
    };
  });

  const weekHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 font-bold shadow-md">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <span>GitHub-Style Activity Streak Heatmap</span>
            </h3>
            <div className="text-xs text-slate-400">Daily Learning Contribution Grid</div>
          </div>
        </div>

        {/* Real Streak Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 font-extrabold text-xs flex items-center gap-1">
            <Flame size={14} className="fill-orange-400" />
            <span>{videoStreakDays} Days Streak</span>
          </span>
        </div>
      </div>

      {/* GitHub Heatmap Tiles Grid */}
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-500 pb-1">
          {weekHeaders.map((w, idx) => (
            <div key={idx}>{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-xs">
          {daysGrid.map((day) => (
            <motion.div
              key={day.dateStr}
              whileHover={{ scale: 1.15 }}
              className={`h-9 rounded-lg flex items-center justify-center relative font-mono text-[11px] transition-all border ${day.intensityClass}`}
              title={`${day.dateStr}: ${day.activityCount} learning activity completed`}
            >
              <span>{day.dayNum}</span>
              {day.isLogged && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-300 absolute top-1 right-1" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend & Stats Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px]">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
            <span className="w-3 h-3 rounded bg-emerald-800" />
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span className="w-3 h-3 rounded bg-orange-500" />
            <span>More</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1 text-cyan-300">
            <Trophy size={14} className="text-amber-400" /> {totalXP} XP Total
          </span>
          <span className="flex items-center gap-1 text-purple-300">
            <Brain size={14} className="text-cyan-400" /> {brainStreakDays} Synapses
          </span>
        </div>
      </div>
    </div>
  );
};
