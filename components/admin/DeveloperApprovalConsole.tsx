'use client';

import React from 'react';
import { VideoLecture } from '@/lib/types';
import { ShieldCheck, CheckCircle2, XCircle, Mail, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface DeveloperApprovalConsoleProps {
  pendingVideos: VideoLecture[];
  onApprove: (videoId: string) => void;
  onReject: (videoId: string) => void;
}

export const DeveloperApprovalConsole: React.FC<DeveloperApprovalConsoleProps> = ({
  pendingVideos,
  onApprove,
  onReject,
}) => {
  if (!pendingVideos || pendingVideos.length === 0) return null;

  const handleApproveClick = (videoId: string) => {
    onApprove(videoId);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
  };

  return (
    <div className="w-full bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-bold">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Developer Final Email Approval Console</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                {pendingVideos.length} Pending
              </span>
            </h3>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Mail size={12} className="text-cyan-400" />
              <span>Approver Email Target: <strong className="text-cyan-300">yatishsathish3012@gmail.com</strong></span>
            </div>
          </div>
        </div>

        <div className="text-xs text-amber-300 font-semibold bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/40">
          ⚠️ Action Required: Developer Review & Approval Needed
        </div>
      </div>

      {/* Pending Videos List */}
      <div className="space-y-3">
        {pendingVideos.map((v) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-24 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-cyan-300">{v.grade} • {v.subject}</span>
                  <span className="text-slate-400">by {v.teacherName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px]">
                    AI Score: {v.aiVerificationScore}%
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-white line-clamp-1">{v.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{v.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => onReject(v.id)}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-950/80 hover:text-red-300 border border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle size={14} />
                <span>Reject</span>
              </button>

              <button
                onClick={() => handleApproveClick(v.id)}
                className="flex-1 md:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Approve & Publish Live</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
