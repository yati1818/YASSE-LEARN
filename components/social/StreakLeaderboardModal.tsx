'use client';

import React, { useState } from 'react';
import { Trophy, X, Flame, UserPlus, Check, Sparkles, Users, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
}

interface LeaderboardUser {
  id: string;
  username: string;
  name: string;
  grade: string;
  streakDays: number;
  xp: number;
  avatarUrl: string;
  isFriend: boolean;
  requestSent: boolean;
}

export const StreakLeaderboardModal: React.FC<StreakLeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUsername = 'learner',
}) => {
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([
    {
      id: 'l1',
      username: 'ananya_physics',
      name: 'Dr. Ananya Sharma',
      grade: 'Class 12',
      streakDays: 14,
      xp: 2800,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isFriend: true,
      requestSent: false,
    },
    {
      id: 'l2',
      username: 'rajesh_maths',
      name: 'Prof. Rajesh Verma',
      grade: 'Class 10',
      streakDays: 11,
      xp: 2150,
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      isFriend: false,
      requestSent: false,
    },
    {
      id: 'l3',
      username: 'yatish_sathish',
      name: 'Yatish Sathish',
      grade: 'Class 10',
      streakDays: 8,
      xp: 1600,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isFriend: true,
      requestSent: false,
    },
    {
      id: 'l4',
      username: 'priya_science',
      name: 'Priya Sundaram',
      grade: 'Class 8',
      streakDays: 5,
      xp: 950,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
      isFriend: false,
      requestSent: false,
    },
  ]);

  if (!isOpen) return null;

  const handleSendFriendRequest = (id: string) => {
    setLeaderboardUsers((users) =>
      users.map((u) => (u.id === id ? { ...u, requestSent: true } : u))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-5 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Global Streak Leaderboard</h3>
              <div className="text-xs text-slate-400">Track top daily streaks & connect with peer learners</div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Leaderboard Table List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {leaderboardUsers.map((u, idx) => (
            <div
              key={u.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                u.username === currentUsername
                  ? 'bg-purple-950/60 border-purple-500/50 shadow-md'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    idx === 0
                      ? 'bg-amber-400 text-slate-950'
                      : idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{idx + 1}
                </div>

                <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />

                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span>{u.name}</span>
                    <span className="text-[10px] text-cyan-300 font-mono">@{u.username}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{u.grade} • {u.xp} Brain XP</div>
                </div>
              </div>

              {/* Streak Badge & Friend Button */}
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black flex items-center gap-1">
                  <Flame size={14} className="text-amber-400" />
                  <span>{u.streakDays}d</span>
                </div>

                {u.isFriend ? (
                  <span className="text-[11px] text-emerald-400 font-bold px-2 py-1 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
                    Friends
                  </span>
                ) : u.requestSent ? (
                  <span className="text-[11px] text-slate-400 font-medium px-2 py-1 bg-slate-900 rounded-lg">
                    Sent
                  </span>
                ) : (
                  <button
                    onClick={() => handleSendFriendRequest(u.id)}
                    className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-transform active:scale-95"
                    title="Send Friend Request"
                  >
                    <UserPlus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
