'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, Upload, User, Search, GraduationCap, Flame, ShieldCheck, ChevronDown } from 'lucide-react';
import { UserProfile, StreakData, GradeLevel } from '@/lib/types';
import { StreakWidget } from '../streaks/StreakWidget';
import { FeedbackModal } from '../feedback/FeedbackModal';
import { TeacherUploadModal } from '../teacher/TeacherUploadModal';

interface NavbarProps {
  user: UserProfile | null;
  streak: StreakData;
  vibeCategory: 'junior' | 'middle' | 'senior';
  onGradeChange?: (newGrade: GradeLevel) => void;
  onVideoUploaded?: (video: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  streak,
  vibeCategory,
  onGradeChange,
  onVideoUploaded,
}) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showTeacherUploadModal, setShowTeacherUploadModal] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);

  const isJunior = vibeCategory === 'junior';
  const isSenior = vibeCategory === 'senior';

  const gradesList: GradeLevel[] = [
    'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8',
    'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors ${
        isJunior 
          ? 'bg-purple-950/80 border-purple-800/40 text-purple-100'
          : isSenior 
            ? 'bg-slate-950/90 border-slate-800/80 text-slate-100' 
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Vibe Badge */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className={`p-2 rounded-2xl transition-transform group-hover:scale-110 shadow-lg ${
                isJunior
                  ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 text-white'
                  : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white'
              }`}>
                <GraduationCap size={22} className="group-hover:rotate-6 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight flex items-center gap-1.5">
                  <span className={isJunior ? 'text-white' : 'bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent'}>
                    YASSE
                  </span>
                  <span className={isJunior ? 'text-yellow-300 font-black' : 'text-cyan-400 font-extrabold'}>
                    Learn
                  </span>
                </span>
                <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider -mt-1 hidden sm:inline">
                  Free Class 3–12 Platform
                </span>
              </div>
            </Link>

            {/* Active Grade Switcher Badge */}
            <div className="relative">
              <button
                onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  isJunior 
                    ? 'bg-pink-500/20 border-pink-400/50 text-pink-200 hover:bg-pink-500/30' 
                    : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'
                }`}
              >
                <span>{user?.grade || 'Class 10'}</span>
                <ChevronDown size={14} />
              </button>

              {/* Grade Dropdown */}
              {showGradeDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 grid grid-cols-2 gap-1 text-xs">
                  {gradesList.map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        onGradeChange?.(g);
                        setShowGradeDropdown(false);
                      }}
                      className={`p-2 rounded-xl text-left font-semibold transition-colors ${
                        user?.grade === g
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions: Dual Streaks, Feedback, Teacher Studio & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Dual Gamified Streaks */}
            <div className="hidden sm:block">
              <StreakWidget streak={streak} vibeCategory={vibeCategory} />
            </div>

            {/* Teacher Video Upload trigger */}
            {user?.role === 'teacher' && (
              <button
                onClick={() => setShowTeacherUploadModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <Upload size={14} />
                <span className="hidden md:inline">Upload Lecture</span>
              </button>
            )}

            {/* Feedback Button */}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Submit platform feedback to yatishsathish3012@gmail.com"
            >
              <MessageSquare size={14} className="text-cyan-400" />
              <span className="hidden md:inline">Feedback</span>
            </button>

            {/* Profile Avatar / Onboarding Link */}
            <Link
              href="/onboarding"
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-cyan-400/50 transition-all"
              title="Manage Profile & Privacy Visibility"
            >
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=User'}
                alt={user?.name || 'User Profile'}
                className="w-8 h-8 rounded-full border border-slate-600 bg-slate-800 object-cover"
              />
            </Link>

          </div>
        </div>
      </header>

      {/* Modals */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        userEmail={user?.email}
        userName={user?.name}
        role={user?.role}
        grade={user?.grade}
      />

      {showTeacherUploadModal && (
        <TeacherUploadModal
          isOpen={showTeacherUploadModal}
          onClose={() => setShowTeacherUploadModal(false)}
          teacherName={user?.name}
          teacherId={user?.id}
          onVideoUploaded={(video) => {
            onVideoUploaded?.(video);
            setShowTeacherUploadModal(false);
          }}
        />
      )}
    </>
  );
};
