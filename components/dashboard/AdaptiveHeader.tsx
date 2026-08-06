'use client';

import React from 'react';
import { UserProfile } from '@/lib/types';
import { Trophy, Flame, Zap, Shield, Sparkles, UserCheck } from 'lucide-react';

interface AdaptiveHeaderProps {
  user: UserProfile;
  onOpenLeaderboard?: () => void;
  onOpenGames?: () => void;
}

export const AdaptiveHeader: React.FC<AdaptiveHeaderProps> = ({
  user,
  onOpenLeaderboard,
  onOpenGames,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        {/* Left Profile Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-xl">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-cyan-300 uppercase">
                {user.name ? user.name[0] : 'U'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-900" title="Verified Mobile Account">
              <UserCheck size={12} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{user.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold">
                {user.playerId || '#YASSE-9344'}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>@{user.username}</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">{user.grade} ({user.board})</span>
            </div>
          </div>
        </div>

        {/* Right Stats & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Daily Streak Flame */}
          <div className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame size={18} className="animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Streak</div>
              <div className="text-sm font-black text-amber-300 font-mono">{user.streakDays} Days 🔥</div>
            </div>
          </div>

          {/* Brain XP */}
          <div className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Brain Synapse XP</div>
              <div className="text-sm font-black text-purple-300 font-mono">{user.xp} XP</div>
            </div>
          </div>

          {/* Leaderboard Button */}
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Trophy size={16} />
              <span>Leaderboard</span>
            </button>
          )}

          {/* Mini-Games Button */}
          {onOpenGames && (
            <button
              onClick={onOpenGames}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles size={16} className="text-cyan-400" />
              <span>Math Sprint</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
