'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { YasseAiWidget } from '@/components/ai-assistant/YasseAiWidget';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { PwaInstallPrompt } from '@/components/ui/PwaInstallPrompt';
import { PwaUpdateNotification } from '@/components/ui/PwaUpdateNotification';
import { useYasseStore } from '@/lib/store';
import { VideoLecture, DoubtItem } from '@/lib/types';
import { Play, CheckCircle2, ShieldCheck, HelpCircle, FileText, Award, ArrowLeft, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LearnVideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.videoId as string;
  const { user, videos, streak, incrementVideoStreak, incrementBrainStreak, addDoubt, vibeCategory, isLoaded } = useYasseStore();

  const [video, setVideo] = useState<VideoLecture | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'ask_doubt'>('notes');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Doubt form state
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDetails, setQuestionDetails] = useState('');
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);

  useEffect(() => {
    if (isLoaded && videoId) {
      const found = videos.find((v) => v.id === videoId);
      if (found) {
        setVideo(found);
        incrementVideoStreak();
      }
    }
  }, [isLoaded, videoId, videos, incrementVideoStreak]);

  if (!isLoaded) return null;

  if (!video) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar user={user} streak={streak} vibeCategory={vibeCategory} onGradeChange={() => {}} onVideoUploaded={() => {}} />
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-slate-300">Lecture Not Found</h2>
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">
            Return to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuizOptionSelect = (qIdx: number, oIdx: number) => {
    if (!quizSubmitted) {
      setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx });
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    video.aiQuizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) score += 1;
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    const xp = score * 50;
    incrementBrainStreak(xp, `${video.subject} Quiz Mastery Badge`);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle || !questionDetails || !user) return;

    const newDoubt: DoubtItem = {
      id: `doubt-${Date.now()}`,
      videoId: video.id,
      videoTitle: video.title,
      studentId: user.id,
      studentName: user.name,
      studentGrade: user.grade || 'Class 10',
      teacherId: video.teacherId,
      teacherEmail: 'yatishsathish3012@gmail.com',
      subject: video.subject,
      questionTitle,
      questionDetails,
      urgency: 'high',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addDoubt(newDoubt);
    setDoubtSubmitted(true);
    setQuestionTitle('');
    setQuestionDetails('');

    fetch('/api/doubts/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoubt),
    }).catch((err) => console.error('Doubt email error', err));
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-between pb-16 md:pb-0">
      <Navbar user={user} streak={streak} vibeCategory={vibeCategory} onGradeChange={() => {}} onVideoUploaded={() => {}} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard Feed</span>
        </button>

        {/* Video Player & Info Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs border border-cyan-500/30">
                  {video.grade} • {video.subject}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/30 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>AI Compliance Verified ({video.aiVerificationScore}%)</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{video.title}</h1>
              <p className="text-xs text-slate-400 leading-relaxed">{video.description}</p>
            </div>
          </div>

          {/* Right Column: AI Notes, Quiz & Doubt Feed */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col h-[520px]">
            <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'notes' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📝 AI Notes
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'quiz' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧠 Practice Quiz
              </button>
              <button
                onClick={() => setActiveTab('ask_doubt')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'ask_doubt' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ❓ Ask Doubt
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <FileText size={16} className="text-cyan-400" />
                    <span>Automated AI Lecture Summary</span>
                  </h3>
                  {video.aiNotes.map((n, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="font-bold text-xs text-cyan-300">{n.title}</div>
                      <div className="text-xs text-slate-300 leading-relaxed">{n.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  {video.aiQuizQuestions.map((q, qIdx) => (
                    <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="font-bold text-xs text-slate-200">
                        Q{qIdx + 1}: {q.question}
                      </div>
                      <div className="space-y-1.5">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                            className={`w-full text-left p-2 rounded-lg text-xs font-semibold transition-all border ${
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
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-extrabold text-xs shadow-md"
                    >
                      Submit Practice Quiz & Earn Brain XP
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 text-center font-bold">
                      Quiz Completed! You scored {quizScore}/{video.aiQuizQuestions.length} (+{quizScore * 50} Brain XP)
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
                  <div className="text-[11px] text-slate-400">
                    Dispatched directly to {video.teacherName} and yatishsathish3012@gmail.com
                  </div>

                  <input
                    type="text"
                    required
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="Brief question summary..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-amber-500"
                  />

                  <textarea
                    rows={4}
                    required
                    value={questionDetails}
                    onChange={(e) => setQuestionDetails(e.target.value)}
                    placeholder="Describe your doubt in detail..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-amber-500"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1"
                  >
                    <Send size={14} />
                    <span>Send Doubt Ticket</span>
                  </button>

                  {doubtSubmitted && (
                    <div className="text-xs text-emerald-400 font-bold text-center">
                      ✓ Doubt ticket sent to educator inbox!
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <YasseAiWidget grade={video.grade} currentSubject={video.subject} />
      <PwaUpdateNotification />
      <PwaInstallPrompt />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
