'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiChatMessage } from '@/lib/types';

interface YasseAiWidgetProps {
  grade?: string;
  currentSubject?: string;
}

export const YasseAiWidget: React.FC<YasseAiWidgetProps> = ({
  grade = 'Class 10',
  currentSubject = 'Science',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<'male' | 'female'>('male');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      content: `Hello! 👋 I am **Prof. Aryan Verma**, your 24/7 YASSE AI Tutor for ${grade} (${currentSubject}). Ask me any academic question, math formula, or study hint!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedTopics: ['Explain Ohm\'s Law V = I × R ⚡', 'Give me a science joke! 😄', 'How do I earn daily streak XP? 🔥'],
      persona: 'male',
    },
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          grade,
          subject: currentSubject,
          persona,
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        const assistantMsg: AiChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: data.message.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          persona,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('AI response error');
      }
    } catch (err) {
      const fallbackMsg: AiChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        content: `I am here to help! For **${grade} ${currentSubject}**, remember that breaking down complex formulas step-by-step is key. Feel free to rephrase your question! 💡`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const togglePersona = () => {
    const nextPersona = persona === 'male' ? 'female' : 'male';
    setPersona(nextPersona);
    const mentorName = nextPersona === 'female' ? 'Dr. Ananya Sharma' : 'Prof. Aryan Verma';

    setMessages((prev) => [
      ...prev,
      {
        id: `persona-switch-${Date.now()}`,
        sender: 'assistant',
        content: `Switched mentor persona to **${mentorName}**! How can I assist your ${grade} studies? ✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: nextPersona,
      },
    ]);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-2xl flex items-center gap-2 font-black text-xs cursor-pointer border border-cyan-400/40"
        >
          <Sparkles size={18} className="animate-spin text-amber-300" />
          <span>YASSE AI Tutor 24/7</span>
        </motion.button>
      )}

      {/* Slide-out Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[90vw] sm:w-[380px] h-[520px] bg-slate-900/95 border border-slate-700 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Window Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600 text-white font-bold">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">
                    {persona === 'female' ? '👩‍🏫 Dr. Ananya Sharma' : '👨‍🏫 Prof. Aryan Verma'}
                  </h4>
                  <div className="text-[10px] text-cyan-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time YASSE AI Tutor ({grade})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePersona}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700"
                  title="Switch Mentor Persona"
                >
                  {persona === 'male' ? '👩‍🏫 Female' : '👨‍🏫 Male'}
                </button>

                <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                      m.sender === 'user'
                        ? 'bg-cyan-500 text-slate-950 font-semibold rounded-br-none'
                        : 'bg-slate-950 text-slate-100 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    <div className="text-[9px] opacity-70 text-right">{m.timestamp}</div>
                  </div>

                  {/* Suggested Topic Pills */}
                  {m.suggestedTopics && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestedTopics.map((top, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(top)}
                          className="px-2.5 py-1 rounded-full bg-slate-950 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold hover:border-cyan-400 transition-colors"
                        >
                          {top}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                  <Sparkles size={14} className="animate-spin" />
                  <span>AI Tutor is formulating response...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about physics, math formulas or study tips..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-transform active:scale-95 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
