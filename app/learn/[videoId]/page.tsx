'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useYasseStore } from '@/lib/store';
import { ArrowLeft, Award, HelpCircle, CheckCircle2, Send, Sparkles, AlertCircle, FileText, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import confetti from 'canvas-confetti';

export default function LearnPage() {
  const params = useParams();
  const videoId = params?.videoId as string;
  const router = useRouter();

  const { videos, isLoaded, incrementBrainStreak, addDoubt } = useYasseStore();

  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'ask_doubt'>('notes');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [doubtText, setDoubtText] = useState('');
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);
  const [loadingDoubt, setLoadingDoubt] = useState(false);

  if (!isLoaded) return null;

  const video = videos.find((v) => v.id === videoId);

  if (!video) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-amber-400" />
          <h2 className="text-xl font-black text-white">Lecture Not Found</h2>
          <p className="text-xs text-slate-400">
            This lecture may have been moved or is pending teacher approval.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs"
          >
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const quizQuestions = video.quiz || [];

  const handleQuizOptionSelect = (qIdx: number, oIdx: number) => {
    if (!quizSubmitted) {
      setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx });
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) score += 1;
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    const xp = score * 50;
    incrementBrainStreak(xp, `${video.subject} Quiz Mastery Badge`);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const handleDoubtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim() || loadingDoubt) return;

    setLoadingDoubt(true);

    try {
      const res = await fetch('/api/doubts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: 'Learner',
          studentGrade: video.grade,
          questionText: doubtText,
          subject: video.subject,
        }),
      });

      if (res.ok) {
        addDoubt({
          id: `d-${Date.now()}`,
          studentName: 'Learner',
          studentGrade: video.grade,
          questionText: doubtText,
          subject: video.subject,
          createdAt: new Date().toISOString(),
          isAnswered: false,
        });

        setDoubtSubmitted(true);
        setDoubtText('');
      }
    } catch (err) {
      console.error('Failed to submit doubt:', err);
    } finally {
      setLoadingDoubt(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
            {video.grade} • {video.subject}
          </div>
        </div>

        {/* Video & Interactive Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <iframe
                src={video.youtubeUrl.replace('watch?v=', 'embed/')}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-black text-white">{video.title}</h1>
              <p className="text-xs text-slate-400 leading-relaxed">{video.description}</p>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Educator: {video.teacherName}</span>
                <span>•</span>
                <span>{video.chapter}</span>
              </div>
            </div>
          </div>

          {/* Interactive Side Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col h-[520px]">
            {/* Tab Header */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-2xl mb-4 border border-slate-800">
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'notes'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quiz
              </button>
              <button
                onClick={() => setActiveTab('ask_doubt')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'ask_doubt'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ask Doubt
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {activeTab === 'notes' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <FileText size={16} className="text-cyan-400" />
                    <span>Curriculum Lecture Summary</span>
                  </h3>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-cyan-300">Core Takeaways</div>
                    <p className="leading-relaxed text-slate-300">{video.description}</p>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  {quizQuestions.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800 p-4">
                      No practice quiz questions attached to this lecture yet.
                    </div>
                  ) : (
                    quizQuestions.map((q, qIdx) => (
                      <div key={q.id || qIdx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="font-bold text-xs text-slate-200">
                          Q{qIdx + 1}: {q.question}
                        </div>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all border ${
                                selectedAnswers[qIdx] === oIdx
                                  ? 'bg-purple-600 text-white border-purple-400'
                                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-purple-500/50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}

                  {quizQuestions.length > 0 && !quizSubmitted && (
                    <button
                      onClick={handleQuizSubmit}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black text-xs shadow-md"
                    >
                      Submit Practice Quiz & Earn Brain XP
                    </button>
                  )}

                  {quizSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 text-center font-bold">
                      Quiz Completed! You scored {quizScore}/{quizQuestions.length} (+{quizScore * 50} Brain XP)
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ask_doubt' && (
                <form onSubmit={handleDoubtSubmit} className="space-y-3">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <HelpCircle size={16} className="text-amber-400" />
                    <span>Submit Academic Doubt to Teacher</span>
                  </h3>

                  <textarea
                    rows={4}
                    value={doubtText}
                    onChange={(e) => setDoubtText(e.target.value)}
                    placeholder="Describe your academic doubt or request clarification on this topic..."
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={loadingDoubt || !doubtText.trim()}
                    className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {loadingDoubt ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <>
                        <span>Dispatch Doubt Ticket</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>

                  {doubtSubmitted && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>Doubt ticket dispatched to educator!</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
