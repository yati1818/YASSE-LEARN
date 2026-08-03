'use client';

import React, { useState, useEffect } from 'react';
import { Gamepad2, X, Zap, Trophy, Timer, CheckCircle2, RotateCcw, Sparkles, Brain, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface EducationalGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xpGained: number, badgeName: string) => void;
}

export const EducationalGamesModal: React.FC<EducationalGamesModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
}) => {
  const [activeTab, setActiveTab] = useState<'math' | 'science' | 'memory'>('math');

  // Math Sprint State
  const [mathScore, setMathScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isGameActive, setIsGameActive] = useState(false);
  const [mathProblem, setMathProblem] = useState({ num1: 7, num2: 8, answer: 56, options: [48, 56, 64, 42] });

  // Science Match State
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [scienceSelected, setScienceSelected] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false);
      const reward = mathScore * 20;
      if (reward > 0) {
        onRewardXP(reward, 'Math Sprint Champion Badge 🧮');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft, mathScore, onRewardXP]);

  if (!isOpen) return null;

  const generateMathProblem = () => {
    const a = Math.floor(Math.random() * 12) + 2;
    const b = Math.floor(Math.random() * 12) + 2;
    const ans = a * b;
    const fake1 = ans + 4;
    const fake2 = Math.max(1, ans - 6);
    const fake3 = ans + 10;
    const opts = [ans, fake1, fake2, fake3].sort(() => Math.random() - 0.5);
    setMathProblem({ num1: a, num2: b, answer: ans, options: opts });
  };

  const startMathSprint = () => {
    setMathScore(0);
    setTimeLeft(20);
    setIsGameActive(true);
    generateMathProblem();
  };

  const handleMathAnswer = (chosen: number) => {
    if (chosen === mathProblem.answer) {
      setMathScore((s) => s + 1);
      generateMathProblem();
    }
  };

  const scienceElements = [
    { symbol: 'H', name: 'Hydrogen' },
    { symbol: 'O', name: 'Oxygen' },
    { symbol: 'Na', name: 'Sodium' },
    { symbol: 'Au', name: 'Gold' },
  ];

  const handleScienceCardClick = (item: string) => {
    if (!scienceSelected) {
      setScienceSelected(item);
    } else {
      const match = scienceElements.find(
        (e) => (e.symbol === scienceSelected && e.name === item) || (e.name === scienceSelected && e.symbol === item)
      );

      if (match) {
        const newMatched = [...matchedPairs, scienceSelected, item];
        setMatchedPairs(newMatched);
        if (newMatched.length === scienceElements.length * 2) {
          onRewardXP(100, 'Science Element Master Badge 🧪');
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        }
      }
      setScienceSelected(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-5 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">YASSE Educational Mini-Games Hub</h3>
              <div className="text-xs text-slate-400">Reinforce curriculum concepts & earn Brain Synapse XP!</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex rounded-2xl bg-slate-950 border border-slate-800 p-1">
          <button
            onClick={() => setActiveTab('math')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'math' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🧮 Math Sprint</span>
          </button>

          <button
            onClick={() => setActiveTab('science')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'science' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🧪 Science Match</span>
          </button>
        </div>

        {/* Game 1: Math Sprint */}
        {activeTab === 'math' && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            {!isGameActive && timeLeft === 20 ? (
              <div className="space-y-3 py-4">
                <Timer size={40} className="mx-auto text-amber-400 animate-pulse" />
                <h4 className="font-extrabold text-base text-white">Math Multiplication Speed Sprint</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Solve as many multiplication problems as possible in 20 seconds to earn Brain XP!
                </p>
                <button
                  onClick={startMathSprint}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95"
                >
                  Start 20s Sprint 🚀
                </button>
              </div>
            ) : isGameActive ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold px-2">
                  <span className="text-amber-400">⏱ Time: {timeLeft}s</span>
                  <span className="text-cyan-300">🎯 Score: {mathScore}</span>
                </div>

                <div className="py-4 text-3xl font-black text-white font-mono bg-slate-900 border border-slate-800 rounded-2xl">
                  {mathProblem.num1} × {mathProblem.num2} = ?
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mathProblem.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleMathAnswer(opt)}
                      className="py-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 text-white font-extrabold text-base transition-all active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-3">
                <Trophy size={44} className="mx-auto text-amber-400" />
                <h4 className="font-extrabold text-lg text-white">Sprint Completed! 🎉</h4>
                <p className="text-xs text-slate-300">
                  You scored <strong>{mathScore} points</strong> and unlocked <strong>+{mathScore * 20} Brain XP</strong>!
                </p>
                <button
                  onClick={startMathSprint}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs"
                >
                  Play Again 🔄
                </button>
              </div>
            )}
          </div>
        )}

        {/* Game 2: Science Match */}
        {activeTab === 'science' && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            <div className="text-xs text-slate-300">Match the Chemical Symbol to its Element Name:</div>

            <div className="grid grid-cols-2 gap-3">
              {['H', 'Hydrogen', 'O', 'Oxygen', 'Na', 'Sodium', 'Au', 'Gold'].map((item, idx) => {
                const isMatched = matchedPairs.includes(item);
                const isSelected = scienceSelected === item;

                return (
                  <button
                    key={idx}
                    disabled={isMatched}
                    onClick={() => handleScienceCardClick(item)}
                    className={`py-3.5 px-3 rounded-xl text-sm font-extrabold transition-all border ${
                      isMatched
                        ? 'bg-emerald-950 border-emerald-500/40 text-emerald-400 opacity-60'
                        : isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                          : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-cyan-500'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {matchedPairs.length === 8 && (
              <div className="pt-2 text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 size={16} /> All Elements Matched! +100 Brain XP Earned!
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
