'use client';

import React, { useState } from 'react';
import { HelpCircle, Send, X, Clock, AlertTriangle, CheckCircle2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { VideoLecture, DoubtItem } from '@/lib/types';

interface AskDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoLecture;
  studentName?: string;
  studentGrade?: string;
  onDoubtCreated: (doubt: DoubtItem) => void;
}

export const AskDoubtModal: React.FC<AskDoubtModalProps> = ({
  isOpen,
  onClose,
  video,
  studentName = 'Student',
  studentGrade = 'Class 10',
  onDoubtCreated,
}) => {
  const [timestamp, setTimestamp] = useState('05:30');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDetails, setQuestionDetails] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle || !questionDetails) return;

    setIsSending(true);

    try {
      // Trigger API endpoint dispatch
      const res = await fetch('/api/doubts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: video.id,
          videoTitle: video.title,
          studentName,
          studentGrade: video.grade || studentGrade,
          teacherId: video.teacherId,
          teacherEmail: 'yatishsathish3012@gmail.com', // Primary target & teacher email
          timestampInVideo: timestamp,
          questionTitle,
          questionDetails,
          urgency,
        }),
      });

      const data = await res.json();

      const newDoubt: DoubtItem = {
        id: `doubt-${Date.now()}`,
        videoId: video.id,
        videoTitle: video.title,
        studentId: 'current-user',
        studentName,
        studentGrade: video.grade || studentGrade,
        teacherId: video.teacherId,
        teacherEmail: 'yatishsathish3012@gmail.com',
        timestampInVideo: timestamp,
        subject: video.subject,
        questionTitle,
        questionDetails,
        urgency,
        status: 'pending',
        createdAt: new Date().toLocaleDateString(),
      };

      onDoubtCreated(newDoubt);
      setIsSuccess(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Doubt submission error', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setQuestionTitle('');
    setQuestionDetails('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white shadow-md">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-amber-300 bg-clip-text text-transparent">
                    Ask a Doubt to {video.teacherName}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Video: <span className="text-cyan-300 font-medium">{video.title}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-2xl font-bold text-emerald-300">Doubt Sent Successfully! 🚀</h4>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Your question has been formatted and dispatched directly to teacher's profile & copy sent to <strong className="text-cyan-300">yatishsathish3012@gmail.com</strong>.
                </p>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300">
                  ⚡ <strong>+50 Brain XP</strong> awarded for active curiosity!
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-all border border-slate-700"
                >
                  Close & Continue Watching
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Timestamp & Urgency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Clock size={12} className="text-amber-400" /> Timestamp in Video
                    </label>
                    <input
                      type="text"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      placeholder="e.g. 04:12"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <AlertTriangle size={12} className="text-purple-400" /> Urgency Level
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="low">🟢 Low (General Query)</option>
                      <option value="medium">🟡 Medium (Homework Help)</option>
                      <option value="high">🔴 High (Exam Tomorrow!)</option>
                    </select>
                  </div>
                </div>

                {/* Question Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Doubt Title / Core Question</label>
                  <input
                    type="text"
                    required
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="e.g. Why is potential difference constant in parallel circuits?"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Explain what confused you</label>
                  <textarea
                    required
                    rows={4}
                    value={questionDetails}
                    onChange={(e) => setQuestionDetails(e.target.value)}
                    placeholder="Describe where you got stuck or what formula steps need clarification..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Email Dispatch Info */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Mail size={16} className="text-cyan-400 shrink-0" />
                  <span>Triggers automated dispatch to teacher & copy sent to <strong>yatishsathish3012@gmail.com</strong>.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isSending ? (
                    <span>Dispatching Doubt Email...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Doubt & Notify Teacher</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
