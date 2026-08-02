'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Heart, Mail, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { FeedbackModal } from '../feedback/FeedbackModal';

export const Footer: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white">
              <GraduationCap size={20} />
            </div>
            <span className="font-extrabold text-xl text-white">
              YASSE <span className="text-cyan-400">Learn</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Free, gamified, high-quality educational web platform for Class 3 to 12. Empowered by AI compliance standard verification & teacher doubt clarification.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>100% Free Educational Access</span>
          </div>
        </div>

        {/* Col 2: Grades */}
        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">Grade Categories</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Class 3–5 (Junior Explorers)</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Class 6–8 (Middle Achievers)</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Class 9–10 (High School Foundations)</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Class 11–12 (Senior Board & Entrance)</Link></li>
          </ul>
        </div>

        {/* Col 3: Key Features */}
        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">Platform Highlights</h4>
          <ul className="space-y-1.5 text-xs">
            <li className="flex items-center gap-1"><Sparkles size={12} className="text-yellow-400" /> Dual Streaks (Video 🔥 & Brain 🧠)</li>
            <li className="flex items-center gap-1"><ShieldCheck size={12} className="text-amber-400" /> Teacher AI Verification Studio</li>
            <li className="flex items-center gap-1"><Mail size={12} className="text-cyan-400" /> Direct Doubt Clarification Dispatch</li>
            <li className="flex items-center gap-1"><MessageSquare size={12} className="text-purple-400" /> Built-in YASSE AI Helper</li>
          </ul>
        </div>

        {/* Col 4: Direct Feedback Routing */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-200 text-sm">Direct Developer Feedback</h4>
          <p className="text-xs text-slate-400">
            Send bug reports, feature requests, or suggestions. All forms dispatch to:
          </p>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono break-all flex items-center gap-2">
            <Mail size={14} className="shrink-0 text-cyan-400" />
            <span>yatishsathish3012@gmail.com</span>
          </div>
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white font-bold text-xs transition-all border border-slate-700"
          >
            Open Feedback Modal
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>© 2026 YASSE Learn. Built for students Class 3 to 12.</div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart size={12} className="text-red-500 fill-red-500" />
          <span>for curious minds worldwide.</span>
        </div>
      </div>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </footer>
  );
};
