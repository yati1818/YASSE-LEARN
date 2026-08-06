'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Eye, Clock, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoLecture, VibeCategory } from '@/lib/types';
import { VerifiedBadge } from '../ui/VerifiedBadge';

interface VideoCardProps {
  video: VideoLecture;
  vibeCategory: VibeCategory;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, vibeCategory }) => {
  const isJunior = vibeCategory === 'junior';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-3xl overflow-hidden border transition-all flex flex-col ${
        isJunior
          ? 'bg-purple-950/60 border-purple-800/50 hover:border-pink-400 shadow-xl shadow-purple-950/40'
          : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 shadow-xl shadow-slate-950/50'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-200 flex items-center gap-1">
          <Clock size={12} className="text-amber-400" />
          <span>{video.durationMinutes}m</span>
        </div>

        {/* Subject & Grade Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
            isJunior
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 backdrop-blur-md'
          }`}>
            {video.subject}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-[11px] font-semibold">
            {video.grade}
          </span>
        </div>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-xs">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-2xl scale-90 group-hover:scale-100 transition-transform">
            <Play size={24} className="fill-white ml-1" />
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-extrabold text-base line-clamp-2 text-slate-100 group-hover:text-cyan-300 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {video.description}
          </p>
        </div>

        {/* Teacher & AI Verified Badge */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src={video.teacherAvatar || video.teacherAvatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Teacher'}
              alt={video.teacherName}
              className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
            />
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">
              {video.teacherName}
            </span>
          </div>

          <VerifiedBadge score={video.aiVerificationScore} showText={false} size="sm" />
        </div>

        {/* Action button link */}
        <Link
          href={`/learn/${video.id}`}
          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Play size={14} className="fill-current" />
          <span>Start Learning</span>
        </Link>
      </div>
    </motion.div>
  );
};
