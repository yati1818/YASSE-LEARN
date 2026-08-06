'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useYasseStore } from '@/lib/store';
import { User, Lock, Flame, Brain, ShieldCheck, Trophy, Sparkles, CheckCircle2, Eye, EyeOff, Upload, Phone, Check, Mail } from 'lucide-react';

export default function ProfilePage() {
  const { user, saveUser, streak, vibeCategory, isLoaded } = useYasseStore();
  const [isSaved, setIsSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  if (!isLoaded || !user) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newUrl = event.target.result as string;
          setAvatarUrl(newUrl);
          saveUser({ ...user, avatarUrl: newUrl });
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPrivacy = user.privacy || { isProfilePublic: true, showStreaks: true, showBadges: true, showDoubtsCount: true };

  const handlePrivacyToggle = (key: keyof typeof currentPrivacy) => {
    const updatedPrivacy = {
      ...currentPrivacy,
      [key]: !currentPrivacy[key],
    };

    saveUser({ ...user, privacy: updatedPrivacy });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between">
      <Navbar user={user} streak={streak} vibeCategory={vibeCategory} />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        
        {/* Profile Card Header */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group">
              <img
                src={avatarUrl || user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full border-2 border-cyan-400 object-cover shadow-xl"
              />
              <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-bold text-cyan-300">
                <Upload size={16} />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
                {user.role === 'teacher' ? (
                  <VerifiedBadge score={99} showText={true} size="sm" />
                ) : (
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-extrabold text-xs">
                    {user.grade} Student
                  </span>
                )}
                {user.googleSynced && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                    <Mail size={12} /> Gmail Synced
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
              <p className="text-xs text-slate-300">{user.bio}</p>

              {/* Private Teacher Mobile Number Badge */}
              {user.role === 'teacher' && user.privateMobileNumber && (
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-amber-300">
                  <Lock size={12} className="text-amber-400" />
                  <span>Private Mobile: {user.privateMobileNumber} (100% Private)</span>
                  {user.teacherMobileVerified && <span className="text-emerald-400 text-[10px] font-bold">✓ Verified</span>}
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {user.subjects.map((sub) => (
                  <span key={sub} className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Visibility Toggles Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <Lock size={18} className="text-purple-400" />
              <span>Public Profile Privacy Visibility Toggles</span>
            </h3>
            {isSaved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> Saved!
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Control what information is visible to other students and teachers on your public profile.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => handlePrivacyToggle('isProfilePublic')}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                currentPrivacy.isProfilePublic
                  ? 'bg-slate-950 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {currentPrivacy.isProfilePublic ? <Eye size={16} /> : <EyeOff size={16} />}
                <span className="font-semibold">Public Profile Visible</span>
              </div>
              <span className="font-bold">{currentPrivacy.isProfilePublic ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => handlePrivacyToggle('showStreaks')}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                currentPrivacy.showStreaks
                  ? 'bg-slate-950 border-orange-500/40 text-orange-400'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame size={16} />
                <span className="font-semibold">Show Video/Brain Streaks</span>
              </div>
              <span className="font-bold">{currentPrivacy.showStreaks ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
