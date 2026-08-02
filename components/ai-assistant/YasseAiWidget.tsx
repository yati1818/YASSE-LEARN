'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, BookOpen, HelpCircle, Lightbulb, UserCheck, ChevronRight } from 'lucide-react';
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
      content: `Hello! 👋 I am **Dr. Ananya**, your ChatGPT AI Study Tutor. Ask me ANY question about **${grade} ${currentSubject}** or any other subject!\n\nYou can also switch to **Prof. Aryan (Male Mentor)** at any time. What would you like to explore today?`,
      timestamp: 'Just now',
      suggestedTopics: [
        'How does photosynthesis work?',
        'Explain Ohm’s Law V = I * R with real examples',
        'Give me a step-by-step hint for my homework problem',
        'Summarize key formulas for Class 10 Board Exams'
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
      content: `Switched AI Tutor Persona to **${mentorName}**! How can I help you with your ${grade} studies right now?`,
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

    // Free-form conversational ChatGPT AI response logic
    setTimeout(() => {
      const tutorTitle = aiGender === 'male' ? 'Prof. Aryan 👨‍🏫' : 'Dr. Ananya 👩‍🏫';
      const promptLower = text.toLowerCase();
      let responseBody = '';

      if (promptLower.includes('photosynthesis')) {
        responseBody = `**${tutorTitle}**: Photosynthesis is the biological process by which green plants convert light energy into chemical energy.\n\n**Chemical Equation**:\n$$6CO_2 + 6H_2O \\xrightarrow{\\text{Sunlight, Chlorophyll}} C_6H_12O_6 + 6O_2$$\n\n- **Stomata**: Tiny pores on leaves that absorb Carbon Dioxide.\n- **Chlorophyll**: Green pigment inside chloroplasts capturing sunlight photons.`;
      } else if (promptLower.includes('ohm') || promptLower.includes('resistance') || promptLower.includes('voltage')) {
        responseBody = `**${tutorTitle}**: **Ohm's Law** states that the current ($I$) passing through a conductor is directly proportional to potential difference ($V$) across its ends, provided temperature remains constant.\n\n$$\\text{Formula: } V = I \\times R$$\n\n- **$V$**: Voltage in Volts (V)\n- **$I$**: Current in Amperes (A)\n- **$R$**: Resistance in Ohms ($\\Omega$)\n\n*Intuition*: Think of Voltage as water pressure pushing through a pipe, and Resistance as pipe narrowness!`;
      } else if (promptLower.includes('formula') || promptLower.includes('exam') || promptLower.includes('summary')) {
        responseBody = `**${tutorTitle}**: Here are the top formula checkpoints for **${grade} ${currentSubject}**:\n\n1. **Ohm's Law**: $V = I R$\n2. **Series Resistance**: $R_{\\text{total}} = R_1 + R_2 + R_3$\n3. **Parallel Resistance**: $\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2}$\n4. **Joule's Law of Heating**: $H = I^2 R t$\n\n*Pro Tip for Exams*: Always write down Given data and check SI units first!`;
      } else if (promptLower.includes('hint') || promptLower.includes('doubt')) {
        responseBody = `**${tutorTitle}**: 💡 **Step-by-Step ChatGPT Hint**:\n1. Identify what parameters you are given in the problem statement.\n2. Write down the target variable you need to calculate.\n3. Match the given variables to the correct standard formula and substitute values carefully.\n\nWould you like me to work through a specific numerical step-by-step with you?`;
      } else {
        responseBody = `**${tutorTitle}**: That's a great question regarding **${text}** for **${grade} ${currentSubject}**!\n\nIn science and mathematics, breaking down complex queries into fundamental principles helps build deep conceptual clarity. \n\n- **Key Observation**: Analyze how this relates to real-world applications.\n- **Step 1**: Define your core variables.\n- **Step 2**: Apply standard laws or formulas.\n\nLet me know if you would like a deeper explanation, practice question, or formula derivation!`;
      }

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        persona: aiGender,
        content: responseBody,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTopics: ['Explain with real-world example', 'Give me a practice problem']
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
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
        <span className="hidden sm:inline text-sm font-extrabold tracking-wide">YASSE ChatGPT AI</span>
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
                        YASSE ChatGPT AI Tutor
                      </h3>
                      <div className="text-xs text-cyan-400 font-medium">
                        Tailored for {grade} • {currentSubject}
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

                {/* Male / Female AI Tutor Selector */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-400">Select AI Mentor:</span>
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
                  <span className="truncate">Active Video: <strong>{currentVideoTitle}</strong></span>
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
                  onClick={() => handleSendMessage('Summarize key formulas')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500 shrink-0 flex items-center gap-1"
                >
                  <Lightbulb size={12} className="text-amber-400" /> Key Formulas
                </button>
                <button 
                  onClick={() => handleSendMessage('Give me a step-by-step hint')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500 shrink-0 flex items-center gap-1"
                >
                  <HelpCircle size={12} className="text-cyan-400" /> Step-by-Step Hint
                </button>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Ask ${aiGender === 'male' ? 'Prof. Aryan' : 'Dr. Ananya'} any question...`}
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
