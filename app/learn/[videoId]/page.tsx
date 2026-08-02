'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AskDoubtModal } from '@/components/doubts/AskDoubtModal';
import { YasseAiWidget } from '@/components/ai-assistant/YasseAiWidget';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { InteractiveQuiz } from '@/components/quiz/InteractiveQuiz';
import { useYasseStore } from '@/lib/store';
import { VideoLecture } from '@/lib/types';
import { parseYouTubeUrl } from '@/lib/videoUtils';
import { Play, HelpCircle, FileText, Sparkles, ShieldCheck, Clock, Flame, ArrowLeft, Brain, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VideoLearnPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;
  const { user, videos, streak, incrementVideoStreak, incrementBrainStreak, addDoubt, vibeCategory, isLoaded } = useYasseStore();

  const [video, setVideo] = useState<VideoLecture | null>(null);
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'transcript'>('notes');
  const [hasIncrementedStreak, setHasIncrementedStreak] = useState(false);

  useEffect(() => {
    if (videoId && videos.length > 0) {
      const found = videos.find(v => v.id === videoId) || videos[0];
      setVideo(found);
    }
  }, [videoId, videos]);

  const handlePlayVideo = () => {
    if (!hasIncrementedStreak) {
      incrementVideoStreak();
      setHasIncrementedStreak(true);
    }
  };

  const handleCompleteQuiz = (xpGained: number) => {
    incrementBrainStreak(xpGained, 'AI Quiz Practice Badge');
  };

  if (!isLoaded || !video) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <Sparkles size={32} className="animate-spin" />
      </div>
    );
  }

  // Parse embed URL cleanly
  const parsed = parseYouTubeUrl(video.videoUrl || video.embedUrl);
  const isUploadedFile = video.videoType === 'uploaded_file' || parsed.videoType === 'uploaded_file';
  const embedSource = video.embedUrl || parsed.embedUrl || video.videoUrl;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between">
      <Navbar user={user} streak={streak} vibeCategory={vibeCategory} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
        
        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Video Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-3xl backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-extrabold text-xs">
                {video.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                {video.grade}
              </span>
              {video.creatorOtpVerified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  ✓ Creator OTP Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {video.title}
            </h1>
          </div>

          <button
            onClick={() => setShowDoubtModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-xl shadow-purple-500/20 cursor-pointer transition-all shrink-0"
          >
            <HelpCircle size={18} />
            <span>Ask a Doubt to Teacher</span>
          </button>
        </div>

        {/* Video & Interactive Tabs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Video Column */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Video Player */}
            <div 
              className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl"
              onClick={handlePlayVideo}
            >
              {isUploadedFile ? (
                <video
                  src={embedSource}
                  controls
                  className="w-full h-full object-contain"
                  onPlay={handlePlayVideo}
                />
              ) : (
                <iframe
                  src={embedSource}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* AI Verification Banner */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3 text-amber-200 text-xs">
              <ShieldCheck size={22} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300">Verified Educator Standard Passed</span>
                  <VerifiedBadge score={video.aiVerificationScore} showText={true} size="sm" />
                </div>
                <p className="text-slate-300 leading-relaxed">{video.aiComplianceSummary}</p>
              </div>
            </div>

            {/* Video Streak Logged Alert */}
            {hasIncrementedStreak && (
              <div className="p-3.5 rounded-2xl bg-orange-950/40 border border-orange-500/40 text-xs text-orange-300 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 animate-flame-pulse shrink-0" />
                <span><strong>Video Streak 🔥 +1 Day Logged!</strong> Real calendar watch date updated.</span>
              </div>
            )}

            {/* Description Card */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-slate-200">About this Lecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{video.description}</p>
              
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                <img
                  src={video.teacherAvatar}
                  alt={video.teacherName}
                  className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                />
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{video.teacherName}</span>
                    <VerifiedBadge score={video.aiVerificationScore} showText={false} size="sm" />
                  </div>
                  <div className="text-[10px] text-slate-400">Verified Educator • 100% Student Satisfaction</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Notes, Quiz & Transcript Tabs */}
          <div className="space-y-4">
            
            {/* Tab Headers */}
            <div className="flex rounded-2xl bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'notes'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles size={14} />
                <span>AI Notes</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'quiz'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain size={14} />
                <span>AI Quiz</span>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'transcript'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={14} />
                <span>Transcript</span>
              </button>
            </div>

            {/* Tab Content 1: AI Notes */}
            {activeTab === 'notes' && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>AI Executive Study Notes</span>
                </h4>
                
                <div className="space-y-2.5 text-slate-300 leading-relaxed">
                  {(video.aiNotes && video.aiNotes.length > 0) ? (
                    video.aiNotes.map((note, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="font-bold text-cyan-300">{note.title}</div>
                        <p className="text-slate-400">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="font-bold text-cyan-300">1. Core Fundamentals</div>
                      <p className="text-slate-400">Always identify your given variables before selecting the appropriate equation.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab Content 2: Interactive Quiz */}
            {activeTab === 'quiz' && (
              <InteractiveQuiz
                questions={video.aiQuizQuestions || []}
                onCompleteQuiz={handleCompleteQuiz}
              />
            )}

            {/* Tab Content 3: Transcript */}
            {activeTab === 'transcript' && (
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText size={16} className="text-cyan-400" />
                  <span>Full Audio Transcript</span>
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto">
                  {video.transcript || 'Full audio transcript inspected by YASSE AI Compliance Scanner.'}
                </div>
              </div>
            )}

            {/* Doubt Trigger Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-purple-950/60 to-slate-900 border border-purple-500/30 space-y-3 text-xs">
              <h4 className="font-bold text-purple-200">Have a question on this video?</h4>
              <p className="text-slate-400">
                Submit a doubt directly to {video.teacherName}. The doubt engine formats and emails it to the teacher & copy sent to <strong>yatishsathish3012@gmail.com</strong>.
              </p>
              <button
                onClick={() => setShowDoubtModal(true)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <HelpCircle size={16} />
                <span>Submit Structured Doubt</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Ask Doubt Modal */}
      <AskDoubtModal
        isOpen={showDoubtModal}
        onClose={() => setShowDoubtModal(false)}
        video={video}
        studentName={user?.name}
        studentGrade={user?.grade}
        onDoubtCreated={addDoubt}
      />

      {/* Built-in YASSE AI Helper Widget */}
      <YasseAiWidget grade={video.grade} currentSubject={video.subject} currentVideoTitle={video.title} />

      <Footer />
    </div>
  );
}
