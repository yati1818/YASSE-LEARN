'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface VerifiedBadgeProps {
  score?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ score = 98, showText = true, size = 'md' }) => {
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/40 text-amber-300 shadow-sm shadow-amber-500/10 transition-all hover:scale-105 cursor-pointer`}
      title={`AI Verified Educator (Pedagogical Compliance Score: ${score}%)`}
    >
      <div className="relative">
        <ShieldCheck size={iconSize} className="text-amber-400 fill-amber-400/30 animate-pulse" />
      </div>
      {showText && (
        <span className="text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
          AI Verified Teacher ({score}%)
        </span>
      )}
    </div>
  );
};
