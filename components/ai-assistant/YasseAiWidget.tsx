'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, BookOpen, HelpCircle, Lightbulb, UserCheck, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiChatMessage } from '@/lib/types';

interface YasseAiWidgetProps {
  grade?: string;
  currentSubject?: string;
  currentVideoTitle?: string;
}

export const YasseAiWidget: React.FC<YasseAiWidgetProps> = ({
  grade = 'Class 10',
  currentSubject = 'Science',
  currentVideoTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiGender, setAiGender] = useState<'male' | 'female'>('female');

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      persona: 'female',
      content: `Hey there! 😊 I'm **Dr. Ananya**, your AI study buddy!\n\nWhether you want to chat casually, get quick study tips, or ask questions about **${grade} ${currentSubject}**, I'm here to hang out and help you learn. How's your day going?`,
      timestamp: 'Just now',
      suggestedTopics: [
        '👋 Hey Dr. Ananya! How are you?',
        '💡 Give me a fun study tip for today',
        '⚡ Explain Ohm’s Law simply',
        '😂 Tell me a funny science joke!'
      ]
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleGenderChange = (newGender: 'male' | 'female') => {
    setAiGender(newGender);
    const mentorName = newGender === 'male' ? 'Prof. Aryan 👨‍🏫' : 'Dr. Ananya 👩‍🏫';
    
    const switchMsg: AiChatMessage = {
      id: `system-${Date.now()}`,
      sender: 'assistant',
      persona: newGender,
      content: `Hey! I'm **${mentorName}** now! Glad to be hanging out with you. What's on your mind today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, switchMsg]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Warm, casual, friendly conversational response generator
    setTimeout(() => {
      const tutorName = aiGender === 'male' ? 'Prof. Aryan' : 'Dr. Ananya';
      const promptLower = text.toLowerCase().trim();
      let responseBody = '';

      // Casual Greetings & Small Talk
      if (promptLower.match(/^(hi|hello|hey|heyy|heyyy|hlo|hola|sup|wassup|yo|good morning|good afternoon|good evening)/)) {
        responseBody = `Hey! 👋 Awesome to hear from you! How are you doing today? Ready to learn something cool or just taking a quick study break?`;
      } else if (promptLower.includes('how are you') || promptLower.includes('how u doing') || promptLower.includes('how do you do')) {
        responseBody = `I'm doing great, thank you for asking! 😊 Powered up and ready to help you crush your **${grade}** goals. How is your study session going so far?`;
      } else if (promptLower.includes('who are you') || promptLower.includes('your name') || promptLower.includes('what are you')) {
        responseBody = `I'm **${tutorName}** (${aiGender === 'male' ? 'Male AI Mentor' : 'Female AI Mentor'})—your friendly AI study companion on YASSE Learn! I'm here to chat, explain concepts, give hints, or just keep you motivated while you learn. ✨`;
      } else if (promptLower.includes('joke') || promptLower.includes('funny')) {
        const jokes = [
          `Why can't you trust atoms? ...Because they make up everything! 21 😂`,
          `Why did the spider object to the fly? ...Because it was a bug in the web! 🕸️`,
          `Why was the math book sad? ...Because it had too many problems! 📘😄`
        ];
        responseBody = jokes[Math.floor(Math.random() * jokes.length)];
      } else if (promptLower.includes('tired') || promptLower.includes('bored') || promptLower.includes('stressed') || promptLower.includes('hard')) {
        responseBody = `I completely understand! Learning can be tough sometimes, but you're doing amazing just by showing up! 🌟 Take a deep breath, drink some water, and remember: small steps every day build big success. You've got this! 💪`;
      } else if (promptLower.includes('thank') || promptLower.includes('thanks') || promptLower.includes('thx')) {
        responseBody = `You're super welcome! 😄 Always happy to help. Let me know whenever you want to chat or explore another topic!`;
      } else if (promptLower.includes('bye') || promptLower.includes('see ya') || promptLower.includes('goodnight')) {
        responseBody = `Catch you later! 👋 Keep up the great work and have an awesome rest of your day!`;
      } 
      // Academic Explanations (Casual & Crystal Clear)
      else if (promptLower.includes('photosynthesis')) {
        responseBody = `**Photosynthesis** is basically how plants make their own food! 🌿\n\nThey take in **Sunlight + Carbon Dioxide ($CO_2$) + Water ($H_2O$)**, and use green chlorophyll in their leaves to transform it into **Glucose (Sugar) + Oxygen ($O_2$)** that we breathe!\n\n$$6CO_2 + 6H_2O \\xrightarrow{\\text{Sunlight}} C_6H_{12}O_6 + 6O_2$$`;
      } else if (promptLower.includes('ohm') || promptLower.includes('resistance') || promptLower.includes('voltage')) {
        responseBody = `**Ohm's Law ($V = I \\times R$)** is like water flowing through a pipe! ⚡\n\n- **Voltage ($V$)**: The pressure pushing the water.\n- **Current ($I$)**: The amount of water flowing.\n- **Resistance ($R$)**: How narrow the pipe is!\n\nSo higher resistance slows down the current if voltage stays the same. Simple right?`;
      } else if (promptLower.includes('tip') || promptLower.includes('study') || promptLower.includes('advice')) {
        responseBody = `💡 **Quick Study Hack**: Try the **Pomodoro Technique**! Study focused for 25 minutes, then take a 5-minute stretch break. It keeps your brain fresh and boosts your Brain Synapse XP! 🧠⚡`;
      } else {
        responseBody = `That's really interesting! Regarding **${text}**:\n\n1. **Core Idea**: Think of it in simple terms—every big concept is made of smaller, logical pieces.\n2. **Pro Tip**: Relate it to something you see around you every day!\n\nWould you like me to explain this with a fun real-world example or try a quick practice question together? 😊`;
      }

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        persona: aiGender,
        content: responseBody,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTopics: ['Tell me more!', 'Give me a study tip']
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold shadow-2xl shadow-purple-500/40 border border-cyan-300/40 backdrop-blur-md cursor-pointer group"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
          </span>
        </div>
        <span className="hidden sm:inline text-sm font-extrabold tracking-wide">YASSE AI Companion</span>
        <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent flex items-center gap-1.5">
                        YASSE AI Study Companion
                      </h3>
                      <div className="text-xs text-cyan-400 font-medium">
                        {grade} • {currentSubject} Buddy
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Male / Female AI Mentor Selector */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400">AI Tutor Persona:</span>
                  <div className="flex-1 grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleGenderChange('female')}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                        aiGender === 'female'
                          ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>👩‍🏫 Dr. Ananya</span>
                    </button>
                    <button
                      onClick={() => handleGenderChange('male')}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                        aiGender === 'male'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>👨‍🏫 Prof. Aryan</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Video Title context */}
              {currentVideoTitle && (
                <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
                  <BookOpen size={14} className="text-purple-400 shrink-0" />
                  <span className="truncate">Watching: <strong>{currentVideoTitle}</strong></span>
                </div>
              )}

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">{msg.content}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>

                    {/* Suggested preset pills */}
                    {msg.suggestedTopics && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.suggestedTopics.map((topic, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(topic)}
                            className="text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-purple-900/40 border border-slate-700/80 hover:border-purple-500/50 text-cyan-300 hover:text-cyan-200 transition-all flex items-center gap-1"
                          >
                            <span>{topic}</span>
                            <ChevronRight size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium bg-slate-900 px-3 py-2 rounded-xl w-fit border border-slate-800">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>{aiGender === 'male' ? 'Prof. Aryan' : 'Dr. Ananya'} is typing...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Bar */}
              <div className="p-2 border-t border-slate-900 bg-slate-950 flex gap-2 overflow-x-auto">
                <button 
                  onClick={() => handleSendMessage('Hey! How are you doing today?')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500 shrink-0 flex items-center gap-1"
                >
                  <MessageCircle size={12} className="text-cyan-400" /> Say Hi 👋
                </button>
                <button 
                  onClick={() => handleSendMessage('Give me a fun study tip')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500 shrink-0 flex items-center gap-1"
                >
                  <Lightbulb size={12} className="text-amber-400" /> Study Hack
                </button>
                <button 
                  onClick={() => handleSendMessage('Tell me a funny science joke')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500 shrink-0 flex items-center gap-1"
                >
                  <Sparkles size={12} className="text-pink-400" /> Tell a Joke 😂
                </button>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Chat casually with ${aiGender === 'male' ? 'Prof. Aryan' : 'Dr. Ananya'}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-md"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
