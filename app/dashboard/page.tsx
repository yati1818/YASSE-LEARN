'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdaptiveHeader } from '@/components/dashboard/AdaptiveHeader';
import { VideoCard } from '@/components/dashboard/VideoCard';
import { GitHubStreakHeatmap } from '@/components/streaks/GitHubStreakHeatmap';
import { StudySessionTracker } from '@/components/streaks/StudySessionTracker';
import { StreakLeaderboardModal } from '@/components/social/StreakLeaderboardModal';
import { YasseAiWidget } from '@/components/ai-assistant/YasseAiWidget';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { PwaInstallPrompt } from '@/components/ui/PwaInstallPrompt';
import { PwaUpdateNotification } from '@/components/ui/PwaUpdateNotification';
import { EducationalGamesModal } from '@/components/games/EducationalGamesModal';
import { useYasseStore } from '@/lib/store';
import { GradeLevel } from '@/lib/types';
import { Search, BookOpen, ShieldCheck, Flame, HelpCircle, CheckCircle2, Compass, Sparkles, Award, Gamepad2, Info, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, saveUser, videos, addVideo, streak, doubts, incrementBrainStreak, vibeCategory, isLoaded } = useYasseStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  if (!isLoaded) return null;

  const userGrade = user?.grade || 'Class 10';

  // Approved live public videos
  const publicApprovedVideos = videos.filter(v => v.status === 'published' || v.isVerified);

  const filteredVideos = publicApprovedVideos.filter(v => {
    const matchesSubject = selectedSubject === 'All' || v.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleGradeChange = (newGrade: GradeLevel) => {
    if (user) {
      saveUser({ ...user, grade: newGrade });
    }
  };

  const handleRewardGameXP = (xpGained: number, badgeName: string) => {
    incrementBrainStreak(xpGained, badgeName);
  };

  const isJunior = vibeCategory === 'junior';
  const isSenior = vibeCategory === 'senior';

  const courseHubs = [
    { title: 'Science & Nature 🧪', count: `${filteredVideos.filter(v => v.subject === 'Science').length} Verified`, color: 'from-pink-500 to-purple-600' },
    { title: 'Mathematics & Puzzles 🧮', count: `${filteredVideos.filter(v => v.subject === 'Mathematics').length} Verified`, color: 'from-cyan-500 to-blue-600' },
    { title: 'Physics & Energy ⚡', count: `${filteredVideos.filter(v => v.subject === 'Physics').length} Verified`, color: 'from-amber-500 to-orange-600' },
    { title: 'Chemistry & Reactions 🧪', count: `${filteredVideos.filter(v => v.subject === 'Chemistry').length} Verified`, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between pb-16 md:pb-0 transition-colors ${
      isJunior 
        ? 'bg-[#0f071d] text-purple-100' 
        : isSenior 
          ? 'bg-[#080c14] text-slate-100' 
          : 'bg-[#0b1120] text-slate-100'
    }`}>
      {/* Top Navbar */}
      <Navbar
        user={user}
        streak={streak}
        vibeCategory={vibeCategory}
        onGradeChange={handleGradeChange}
        onVideoUploaded={addVideo}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Adaptive Dynamic Header */}
        <AdaptiveHeader user={user} vibeCategory={vibeCategory} />

        {/* 30-Minute Time-Gated Active Study Session Tracker */}
        <StudySessionTracker onUnlockStreak={handleRewardGameXP} />

        {/* Educational Mini-Games Banner & Leaderboard Trigger Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-slate-950 flex items-center justify-between gap-3 shadow-xl border border-amber-300/30">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 text-amber-400 shrink-0">
                <Gamepad2 size={24} />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-950">Educational Mini-Games 🎮</h3>
                <p className="text-xs font-bold text-slate-900 opacity-90">
                  Math Sprint & Science Match (+100 XP)
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGamesModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs shadow-md shrink-0"
            >
              Play Games →
            </button>
          </div>

          {/* Leaderboard & Peer Network Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-between gap-3 shadow-xl border border-purple-400/30">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 text-cyan-400 shrink-0">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="font-black text-base text-white">Global Leaderboard & Friends 🏆</h3>
                <p className="text-xs text-purple-100 opacity-90">
                  Rank peer daily streaks & connect with friends
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLeaderboardModal(true)}
              className="px-4 py-2 rounded-xl bg-white text-purple-950 hover:bg-slate-100 font-black text-xs shadow-md shrink-0 flex items-center gap-1"
            >
              <Users size={14} />
              <span>Leaderboard →</span>
            </button>
          </div>
        </div>

        {/* Course Subject Hubs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {courseHubs.map((hub, i) => (
            <div
              key={i}
              onClick={() => setSelectedSubject(hub.title.split(' ')[0])}
              className={`p-4 rounded-2xl bg-gradient-to-r ${hub.color} text-white font-bold cursor-pointer shadow-lg hover:scale-105 transition-transform flex flex-col justify-between h-24 border border-white/20`}
            >
              <div className="text-xs opacity-90">{hub.count}</div>
              <div className="text-sm font-black line-clamp-1">{hub.title}</div>
            </div>
          ))}
        </div>

        {/* Search & Subject Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search verified lectures by topic, physics, math or ${userGrade}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  selectedSubject === sub
                    ? isJunior
                      ? 'bg-pink-500 text-white border-pink-400 shadow-md'
                      : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Video Lectures Grid Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="text-cyan-400" size={22} />
              <span>Verified Educator Live Lectures</span>
              <span className="text-xs font-normal text-slate-400">({filteredVideos.length} Available)</span>
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 size={14} />
              <span>Approvals: yatishsathish3012@gmail.com</span>
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 max-w-2xl mx-auto shadow-2xl">
              <Info size={44} className="mx-auto text-cyan-400 animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">No Verified Lectures Uploaded Yet</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  No verified lectures or courses are available for this grade yet. Trusted educator content will appear here once verified by AI and published.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/teacher/studio"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-transform"
                >
                  Upload Educator Lecture 👩‍🏫
                </Link>
                <button
                  onClick={() => { setSelectedSubject('All'); setSearchQuery(''); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} vibeCategory={vibeCategory} />
              ))}
            </div>
          )}
        </section>

        {/* GitHub Activity Streak Heatmap & Doubts Feed Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Col 1 & 2: Doubts Feed */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                <HelpCircle className="text-purple-400" size={20} />
                <span>Doubt Clarification Feed</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Target: yatishsathish3012@gmail.com</span>
            </div>

            {doubts.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                No active student doubts submitted yet. Click on any video lecture to ask a doubt!
              </div>
            ) : (
              <div className="space-y-3">
                {doubts.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300">{d.studentName} ({d.studentGrade})</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'answered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {d.status === 'answered' ? '✓ Answered by Teacher' : '⏱ Pending Response'}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200">{d.questionTitle}</div>
                    <p className="text-xs text-slate-400 line-clamp-2">{d.questionDetails}</p>
                    
                    {d.answerText && (
                      <div className="mt-2 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
                        <strong>Teacher Reply:</strong> {d.answerText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Col 3: GitHub-Style Activity Streak Heatmap */}
          <div>
            <GitHubStreakHeatmap
              calendarLogs={streak.calendarLogs || []}
              videoStreakDays={streak.videoStreakDays}
              brainStreakDays={streak.brainStreakDays}
              totalXP={streak.totalXP}
            />
          </div>

        </section>
      </main>

      {/* YASSE ChatGPT AI Companion Widget */}
      <YasseAiWidget grade={userGrade} currentSubject={selectedSubject === 'All' ? 'Science' : selectedSubject} />

      {/* Educational Games Modal */}
      <EducationalGamesModal
        isOpen={showGamesModal}
        onClose={() => setShowGamesModal(false)}
        onRewardXP={handleRewardGameXP}
      />

      {/* Global Streak Leaderboard & Friends Modal */}
      <StreakLeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        currentUsername={user?.username || 'learner'}
      />

      {/* Enterprise PWA App Components */}
      <PwaUpdateNotification />
      <PwaInstallPrompt />
      <MobileBottomNav />

      <Footer />
    </div>
  );
}
