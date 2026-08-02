'use client';

import React, { useState } from 'react';
import { MessageSquarePlus, Star, Send, X, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

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
  userEmail = '',
  userName = '',
  role = 'Student',
  grade = 'Class 10',
}) => {
  const [email, setEmail] = useState(userEmail || '');
  const [name, setName] = useState(userName || '');
  const [type, setType] = useState<'suggestion' | 'bug' | 'feature_request' | 'general'>('suggestion');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name,
          userEmail: email,
          role,
          grade,
          type,
          rating,
          message,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Feedback submit error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl overflow-hidden"
          >
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-md">
                  <MessageSquarePlus size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                    Send Us Your Feedback
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail size={12} className="text-cyan-400" />
                    <span>Direct dispatch target: <strong>yatishsathish3012@gmail.com</strong></span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-2xl font-bold text-emerald-300">Thank You for Your Feedback! 🎉</h4>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Your response has been routed directly to <strong className="text-cyan-300">yatishsathish3012@gmail.com</strong>. We appreciate your suggestion to make YASSE Learn better!
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-all border border-slate-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Pills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'suggestion', label: '💡 Suggestion' },
                      { id: 'bug', label: '🐛 Bug Report' },
                      { id: 'feature_request', label: '🚀 Feature' },
                      { id: 'general', label: '💬 General' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setType(item.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                          type === item.id
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/20'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">How would you rate YASSE Learn?</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-amber-300 font-bold ml-2">{rating}/5 Stars</span>
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Yatish Sathish"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback / Suggestion</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you love or what features we should add next..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Routing Notice */}
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
                  <Sparkles size={16} className="text-cyan-400 shrink-0" />
                  <span>Submissions automatically format & route to <strong>yatishsathish3012@gmail.com</strong>.</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending to yatishsathish3012@gmail.com...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Feedback</span>
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
