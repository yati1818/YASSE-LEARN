'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TeacherUploadModal } from '@/components/teacher/TeacherUploadModal';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useYasseStore } from '@/lib/store';
import { ShieldCheck, Upload, Sparkles, BookOpen, Award, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TeacherStudioPage() {
  const { user, videos, addVideo, streak, vibeCategory, isLoaded } = useYasseStore();
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (!isLoaded) return null;

  const teacherVideos = videos.filter(v => v.isVerified || v.teacherName === user?.name);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between">
      <Navbar user={user} streak={streak} vibeCategory={vibeCategory} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Studio Hero Header */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/60 border border-amber-500/40 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-400/40">
                <ShieldCheck size={14} className="text-amber-400" />
                <span>Verified Educator Studio</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Teacher Lecture Upload & AI Verification Pipeline
              </h1>
              <p className="text-slate-300 text-sm max-w-xl">
                Upload video lectures for Class 3–12. Our automated AI Compliance Scanner evaluates transcripts against NCERT educational standards before issuing Golden Verification Badges.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer shrink-0"
            >
              <Upload size={18} />
              <span>Upload New Lecture & Verify</span>
            </button>
          </div>
        </div>

        {/* Verification Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
              <Award size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Verification Status</div>
              <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
                <span>Verified Educator</span>
                <VerifiedBadge score={99} showText={false} size="sm" />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Verified Lectures</div>
              <div className="text-lg font-extrabold text-cyan-300">{teacherVideos.length} Uploads</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">AI Audit Rating</div>
              <div className="text-lg font-extrabold text-emerald-300">98.5% Average Score</div>
            </div>
          </div>
        </div>

        {/* Teacher Uploaded Videos Table/Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-amber-400" />
            <span>Uploaded Educational Lectures</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherVideos.map((video) => (
              <div key={video.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-slate-900/90 text-[10px] font-bold text-cyan-300 border border-slate-700">
                    {video.grade} • {video.subject}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-100 line-clamp-1">{video.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{video.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <VerifiedBadge score={video.aiVerificationScore} showText={true} size="sm" />
                  <Link
                    href={`/learn/${video.id}`}
                    className="text-xs text-cyan-400 font-bold hover:underline"
                  >
                    View Lecture →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Upload Modal */}
      <TeacherUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        teacherName={user?.name}
        teacherId={user?.id}
        onVideoUploaded={addVideo}
      />

      <Footer />
    </div>
  );
}
