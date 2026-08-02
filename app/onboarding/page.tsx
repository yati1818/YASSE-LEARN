'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, ShieldCheck, User, CheckCircle2, Lock, Eye, ArrowRight, Sparkles, Upload, Phone, KeyRound, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useYasseStore } from '@/lib/store';
import { UserRole, GradeLevel, UserPrivacySettings, GenderType } from '@/lib/types';
import confetti from 'canvas-confetti';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, saveUser } = useYasseStore();

  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState<GenderType>(user?.gender || 'male');
  const [googleSynced, setGoogleSynced] = useState(user?.googleSynced || false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student');
  const [grade, setGrade] = useState<GradeLevel>(user?.grade || 'Class 5');
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(user?.subjects || ['Science', 'Mathematics']);

  // Teacher Private Mobile Verification
  const [mobileNumber, setMobileNumber] = useState(user?.privateMobileNumber || '');
  const [isMobileVerified, setIsMobileVerified] = useState(user?.teacherMobileVerified || false);
  const [showMobileOtpModal, setShowMobileOtpModal] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [demoMobileOtp, setDemoMobileOtp] = useState('4321');

  // Privacy Visibility Toggles
  const [privacy, setPrivacy] = useState<UserPrivacySettings>({
    isProfilePublic: true,
    showStreaks: true,
    showBadges: true,
    showDoubtsCount: true,
  });

  const [teacherQualification, setTeacherQualification] = useState('M.Sc. Mathematics & Pedagogy');

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam) setRole(roleParam);
  }, [searchParams]);

  // Google / Gmail Account Sync Simulation
  const handleGoogleSync = () => {
    setName('Yatish Sathish');
    setEmail('yatishsathish3012@gmail.com');
    setGoogleSynced(true);
    setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  };

  // Custom Profile Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Send Mobile Verification OTP for Teachers
  const handleSendMobileOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) return;
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setDemoMobileOtp(generated);
    setShowMobileOtpModal(true);
  };

  const handleVerifyMobileOtp = () => {
    if (mobileOtp === demoMobileOtp || mobileOtp.length === 4) {
      setIsMobileVerified(true);
      setShowMobileOtpModal(false);
    }
  };

  const allGrades: GradeLevel[] = [
    'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8',
    'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const availableSubjects = [
    'Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'Environmental Science', 'Computer Science', 'Logic & Puzzles'
  ];

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleCompleteSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const updatedUser = {
      id: user?.id || `user-${Date.now()}`,
      name,
      email: email || 'yatishsathish3012@gmail.com',
      role,
      gender,
      googleSynced,
      avatarUrl,
      grade: role === 'student' ? grade : undefined,
      subjects: selectedSubjects,
      bio: bio || (role === 'student' ? `Enthusiastic ${grade} student on YASSE Learn!` : `Verified educator teaching ${selectedSubjects.join(', ')}`),
      privacy,
      teacherVerified: role === 'teacher',
      teacherRating: role === 'teacher' ? 4.9 : undefined,
      teacherQualification: role === 'teacher' ? teacherQualification : undefined,
      privateMobileNumber: mobileNumber,
      teacherMobileVerified: isMobileVerified,
      createdAt: new Date().toISOString(),
    };

    saveUser(updatedUser);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs border border-cyan-400/40">
            <Sparkles size={14} className="text-amber-400" />
            <span>Official Profile Setup Wizard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tailor Your YASSE Learn Account
          </h2>
          <p className="text-xs text-slate-400">
            Sync Gmail account, upload profile photo, and configure privacy.
          </p>
        </div>

        {/* Gmail Sync Button */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black text-lg">
              G
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Google / Gmail Account Sync</span>
                {googleSynced && <span className="text-emerald-400 text-[10px]">✓ Synced</span>}
              </div>
              <div className="text-[11px] text-slate-400">Pre-fill account details and sync Google Avatar</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSync}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              googleSynced
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            {googleSynced ? '✓ Gmail Synced' : 'Sync Gmail'}
          </button>
        </div>

        <form onSubmit={handleCompleteSetup} className="space-y-6">
          
          {/* Step 1: Role Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Main Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3.5 rounded-2xl border text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  role === 'student'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <GraduationCap size={18} />
                <span>Student (Class 3–12)</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-3.5 rounded-2xl border text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  role === 'teacher'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <ShieldCheck size={18} />
                <span>Teacher / Graduate</span>
              </button>
            </div>
          </div>

          {/* Profile Photo Upload & Gender */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 shrink-0">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label className="block text-xs font-bold text-slate-200">Profile Photo</label>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <label className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                  <Upload size={14} className="text-cyan-400" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Gender Selector */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderType)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500"
              >
                <option value="male">👨 Male</option>
                <option value="female">👩 Female</option>
                <option value="other">✨ Other</option>
              </select>
            </div>
          </div>

          {/* Name & Email Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Yatish Sathish"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gmail Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yatishsathish3012@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Grade Selector for Students */}
          {role === 'student' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Class / Grade Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {allGrades.map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      grade === g
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-cyan-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Private Mobile Verification for Teachers */}
          {role === 'teacher' && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Phone size={14} /> Teacher Private Mobile Verification
                </label>
                {isMobileVerified && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check size={14} /> Verified (Private)
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98765 43210 (Kept 100% Private)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-500"
                />
                {!isMobileVerified && (
                  <button
                    type="button"
                    onClick={handleSendMobileOtp}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                  >
                    Verify SMS OTP
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                🔒 Your mobile number is kept 100% private to your teacher account and is never shown publicly.
              </p>
            </div>
          )}

          {/* Privacy Visibility Toggles */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Lock size={14} className="text-purple-400" /> Public Profile Privacy Visibility Toggles
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <span className="text-slate-300 font-medium">Show Public Profile</span>
                <input
                  type="checkbox"
                  checked={privacy.isProfilePublic}
                  onChange={(e) => setPrivacy({ ...privacy, isProfilePublic: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <span className="text-slate-300 font-medium">Show Video/Brain Streaks</span>
                <input
                  type="checkbox"
                  checked={privacy.showStreaks}
                  onChange={(e) => setPrivacy({ ...privacy, showStreaks: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Launch My YASSE Learn Workspace</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>

      {/* Mobile OTP Verification Modal */}
      {showMobileOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">Enter Mobile Verification OTP</h3>
            <p className="text-xs text-slate-300">
              Enter 4-digit code sent to <strong className="text-cyan-300">{mobileNumber}</strong>.
            </p>
            <div className="text-[11px] text-amber-400 font-mono">[Test Code: {demoMobileOtp}]</div>
            <input
              type="text"
              maxLength={4}
              value={mobileOtp}
              onChange={(e) => setMobileOtp(e.target.value)}
              placeholder="4-digit OTP"
              className="w-32 mx-auto text-center tracking-widest font-mono text-xl py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300"
            />
            <button
              onClick={handleVerifyMobileOtp}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Verify & Secure Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <Sparkles size={32} className="animate-spin" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
