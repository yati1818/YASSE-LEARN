'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Star, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  role?: string;
  grade?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'yatishsathish3012@gmail.com',
  userName = 'Student Explorer',
  role = 'student',
  grade = 'Class 10',
}) => {
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'feature_request' | 'general'>('bug');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Client-side diagnostics collection
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/mobile/i.test(ua)) deviceType = 'Mobile Smartphone';
    else if (/ipad|tablet/i.test(ua)) deviceType = 'Tablet';

    let os = 'Unknown OS';
    if (/win/i.test(ua)) os = 'Windows';
    else if (/mac/i.test(ua)) os = 'macOS / iOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/linux/i.test(ua)) os = 'Linux';

    let browser = 'Chrome/Webview';
    if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edg/i.test(ua)) browser = 'Edge';

    const clientDiagnostics = {
      deviceType,
      operatingSystem: os,
      browser,
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      activeGradeView: grade,
      userAgentString: ua,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          role,
          grade,
          type: feedbackType,
          rating,
          message,
          clientDiagnostics,
          destinationEmail: 'yatishsathish3012@gmail.com',
        }),
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Feedback submit error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full text-slate-100 shadow-2xl space-y-4 relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">App Feedback & Bug Diagnostic</h3>
              <div className="text-xs text-slate-400">Target: yatishsathish3012@gmail.com</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 size={44} className="mx-auto text-emerald-400 animate-bounce" />
            <h4 className="font-bold text-lg text-white">Report Dispatched!</h4>
            <p className="text-xs text-slate-300">
              Diagnostic report & client metadata sent to <strong>yatishsathish3012@gmail.com</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback Category</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bug', label: '🐛 Bug Report' },
                  { id: 'feature_request', label: '💡 New Feature' },
                  { id: 'suggestion', label: '✨ Suggestion' },
                  { id: 'general', label: '💬 General' },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setFeedbackType(t.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      feedbackType === t.id
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">App Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      size={22}
                      className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Details</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what happened or suggest an enhancement..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldAlert size={16} className="text-cyan-400 shrink-0" />
              <span>📱 Client metadata (OS, Browser, Device, Grade) is automatically attached.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg disabled:opacity-40"
            >
              {isSubmitting ? 'Dispatching Diagnostics...' : 'Send Report to yatishsathish3012@gmail.com'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
