'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/lib/types';
import { CheckCircle2, XCircle, Brain, Sparkles, Trophy, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  onCompleteQuiz?: (scoreXp: number) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ questions, onCompleteQuiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
        <Brain size={32} className="mx-auto text-purple-400 animate-pulse" />
        <p>AI Quiz questions generated during video inspection.</p>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return; // Locked after submitting
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let totalCorrect = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        totalCorrect += 1;
      }
    });

    const xpGained = totalCorrect * 50;
    setEarnedXP(xpGained);
    setShowResults(true);

    if (onCompleteQuiz) {
      onCompleteQuiz(xpGained);
    }

    if (totalCorrect === questions.length) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
            <Brain size={20} className="animate-synapse-glow" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <span>Interactive AI Practice Quiz</span>
            </h3>
            <div className="text-xs text-slate-400">{questions.length} Questions • +50 Brain XP per answer</div>
          </div>
        </div>

        {showResults && (
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1">
            <Trophy size={14} /> +{earnedXP} XP Awarded
          </span>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isSelected = selectedOption !== undefined;
          const isCorrect = selectedOption === q.correctAnswerIndex;

          return (
            <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-sm font-bold text-slate-200 flex items-start gap-2">
                <span className="text-cyan-400 font-mono">Q{qIndex + 1}.</span>
                <span>{q.question}</span>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((optionText, optIndex) => {
                  let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50';

                  if (selectedOption === optIndex) {
                    if (showResults) {
                      optionStyle = isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-red-950/80 border-red-500 text-red-200 font-bold';
                    } else {
                      optionStyle = 'bg-purple-950/80 border-purple-500 text-purple-200 font-bold';
                    }
                  } else if (showResults && optIndex === q.correctAnswerIndex) {
                    optionStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-semibold';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={showResults}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{optionText}</span>
                      </span>

                      {showResults && selectedOption === optIndex && (
                        isCorrect ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showResults && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-purple-300">
                    <Sparkles size={12} /> AI Explanation:
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showResults ? (
        <button
          onClick={handleSubmitQuiz}
          disabled={Object.keys(selectedAnswers).length < questions.length}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 disabled:opacity-40 text-white font-extrabold text-xs shadow-lg cursor-pointer transition-all"
        >
          Check Answers & Claim Brain XP 🧠⚡
        </button>
      ) : (
        <div className="p-3 text-center text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
          ✓ Quiz Complete! XP awarded to your Brain Synapse streak.
        </div>
      )}
    </div>
  );
};
