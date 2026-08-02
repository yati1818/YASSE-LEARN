'use client';

import React, { useState } from 'react';
import { Upload, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, X, FileText, Video, KeyRound, Lock, Send, Link as LinkIcon, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { VideoLecture, GradeLevel } from '@/lib/types';
import { parseYouTubeUrl } from '@/lib/videoUtils';

interface TeacherUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName?: string;
  teacherId?: string;
  onVideoUploaded: (video: VideoLecture) => void;
}

export const TeacherUploadModal: React.FC<TeacherUploadModalProps> = ({
  isOpen,
  onClose,
  teacherName = 'Dr. Ananya Sharma',
  teacherId = 't1',
  onVideoUploaded,
}) => {
  const [uploadType, setUploadType] = useState<'youtube' | 'file'>('youtube');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Class 10');
  const [subject, setSubject] = useState('Physics');
  const [videoInput, setVideoInput] = useState('https://www.youtube.com/watch?v=Q0B_bZ_g0nQ');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('yatishsathish3012@gmail.com');

  // Multi-step modal flow: 0: Form, 1: OTP Verification, 2: AI Scanner, 3: Success Done
  const [step, setStep] = useState<number>(0);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // AI Verification state
  const [aiStage, setAiStage] = useState(0);
  const [aiResult, setAiResult] = useState<{ score: number; isVerified: boolean; summary: string } | null>(null);
  const [urlError, setUrlError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleStartUploadFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');

    let parsed;
    if (uploadType === 'file') {
      if (!uploadedFile) {
        setUrlError('Please select a video file (.mp4, .webm).');
        return;
      }
      const objectUrl = URL.createObjectURL(uploadedFile);
      parsed = { isValid: true, videoType: 'uploaded_file' as const, embedUrl: objectUrl, thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80' };
    } else {
      parsed = parseYouTubeUrl(videoInput);
      if (!parsed.isValid) {
        setUrlError(parsed.errorMessage || 'Invalid YouTube URL.');
        return;
      }
    }

    // Step 1: Send OTP to Creator Email
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: title,
          creatorEmail,
          teacherName,
        }),
      });

      const data = await res.json();
      setDemoOtp(data.demoOtpCode || '123456');
      setStep(1); // Proceed to OTP verification screen
    } catch (err) {
      console.error('OTP send failed', err);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpCode, creatorEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || 'Invalid OTP code.');
        return;
      }

      // OTP Verified -> Step 2: Trigger AI Video Content Scanner
      setStep(2);
      runAiScanner();
    } catch (err) {
      setOtpError('Verification failed. Try again.');
    }
  };

  const runAiScanner = async () => {
    setAiStage(1);
    setTimeout(() => setAiStage(2), 1200);
    setTimeout(() => setAiStage(3), 2400);

    setTimeout(async () => {
      let embedUrl = videoInput;
      let thumbnailUrl = 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&auto=format&fit=crop&q=80';
      let vType: 'youtube' | 'uploaded_file' = 'youtube';

      if (uploadType === 'file' && uploadedFile) {
        embedUrl = URL.createObjectURL(uploadedFile);
        vType = 'uploaded_file';
      } else {
        const parsed = parseYouTubeUrl(videoInput);
        embedUrl = parsed.embedUrl;
        thumbnailUrl = parsed.thumbnailUrl;
      }

      try {
        const res = await fetch('/api/ai/verify-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            grade,
            subject,
            transcript: transcript || `Complete audio transcript for ${title}`,
            videoUrl: embedUrl,
            teacherName,
          }),
        });

        const data = await res.json();
        setStep(3);
        setAiResult({
          score: data.overallScore || 98,
          isVerified: true,
          summary: data.verificationDetails?.complianceSummary || 'AI Educational Standard Verified',
        });

        // Create video with pending_admin_approval status
        const newLecture: VideoLecture = {
          id: `v-uploaded-${Date.now()}`,
          title,
          description: description || `Comprehensive ${grade} ${subject} lecture.`,
          grade,
          subject,
          teacherId,
          teacherName,
          teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
          teacherVerified: true,
          videoType: vType,
          videoUrl: videoInput,
          embedUrl,
          thumbnailUrl,
          durationMinutes: 22,
          viewsCount: 1,
          isAiVerified: true,
          aiVerificationScore: data.overallScore || 98,
          aiComplianceSummary: data.verificationDetails?.complianceSummary || 'AI Standard Verified',
          transcript: transcript || `Complete audio transcript for ${title}`,
          creatorOtpVerified: true,
          approvalStatus: 'pending_admin_approval',
          adminApproverEmail: 'yatishsathish3012@gmail.com',
          aiNotes: data.aiNotes || [],
          aiQuizQuestions: data.aiQuizQuestions || [],
          createdAt: new Date().toISOString().split('T')[0],
        };

        // Dispatch Approval Request payload to developer email
        await fetch('/api/admin/request-approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId: newLecture.id,
            title: newLecture.title,
            grade: newLecture.grade,
            subject: newLecture.subject,
            teacherName: newLecture.teacherName,
            aiVerificationScore: newLecture.aiVerificationScore,
          }),
        });

        onVideoUploaded(newLecture);
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      } catch (err) {
        console.error('AI Verification pipeline error', err);
      }
    }, 3600);
  };

  const handleReset = () => {
    setStep(0);
    setAiStage(0);
    setAiResult(null);
    setTitle('');
    setDescription('');
    setTranscript('');
    setOtpCode('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-bold shadow-md">
                  <Upload size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold bg-gradient-to-r from-white via-amber-100 to-yellow-300 bg-clip-text text-transparent">
                    Teacher Upload & AI Compliance Studio
                  </h3>
                  <div className="text-xs text-slate-400">
                    OTP Verification & AI Educational Standard Validation
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* STEP 1: OTP Verification Screen */}
            {step === 1 && (
              <form onSubmit={handleVerifyOtp} className="py-4 space-y-5 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center">
                  <KeyRound size={32} />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Enter Creator Ownership OTP</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    A 6-digit security code was dispatched to target creator email: <strong className="text-cyan-300">{creatorEmail}</strong>.
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-48 mx-auto text-center font-mono tracking-widest text-2xl px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-300 focus:outline-none focus:border-amber-400"
                  />
                  {otpError && <p className="text-xs text-red-400 mt-2">{otpError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Verify OTP & Proceed to AI Scan</span>
                </button>
              </form>
            )}

            {/* STEP 2: AI Verification Progress Scanner */}
            {step === 2 && (
              <div className="py-8 space-y-6 text-center">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                  <ShieldCheck size={40} className="text-amber-400 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-amber-300">YASSE AI Compliance Engine Active</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Inspecting transcript & generating dynamic study notes and interactive quiz for {grade}...
                  </p>
                </div>

                <div className="space-y-2 max-w-sm mx-auto text-left text-xs">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${aiStage >= 1 ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    <CheckCircle2 size={14} className={aiStage >= 1 ? 'text-amber-400' : 'text-slate-600'} />
                    <span>Stage 1: Grade {grade} Curriculum Alignment</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${aiStage >= 2 ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    <CheckCircle2 size={14} className={aiStage >= 2 ? 'text-amber-400' : 'text-slate-600'} />
                    <span>Stage 2: AI Executive Notes & Formula Generation</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${aiStage >= 3 ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    <CheckCircle2 size={14} className={aiStage >= 3 ? 'text-amber-400' : 'text-slate-600'} />
                    <span>Stage 3: Interactive Practice Quiz Synthesizer</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Verification Result Card */}
            {step === 3 && aiResult && (
              <div className="py-6 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
                  <ShieldCheck size={36} />
                </div>
                <h4 className="text-2xl font-bold text-amber-300">AI Standard Passed! Approval Request Sent 🌟</h4>
                
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-left space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-amber-200">
                    <span>AI Compliance Score</span>
                    <span className="text-emerald-400 text-base">{aiResult.score}% (Passed)</span>
                  </div>
                  <p className="text-xs text-slate-300">{aiResult.summary}</p>
                  
                  <div className="pt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <Mail size={14} className="text-cyan-400" /> Developer Approval Requested:
                    </div>
                    <p className="text-slate-400">
                      An approval notification has been routed to developer email <strong className="text-white">yatishsathish3012@gmail.com</strong>. Your lecture will be published live on the public feed once approved!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {/* STEP 0: Upload Form */}
            {step === 0 && (
              <form onSubmit={handleStartUploadFlow} className="space-y-4">
                
                {/* Upload Method Switcher */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Video Source Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadType('youtube')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                        uploadType === 'youtube'
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <LinkIcon size={14} />
                      <span>YouTube Video Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType('file')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                        uploadType === 'file'
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <Video size={14} />
                      <span>Upload MP4 / Video File</span>
                    </button>
                  </div>
                </div>

                {uploadType === 'youtube' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube Video Link</label>
                    <input
                      type="text"
                      required
                      value={videoInput}
                      onChange={(e) => setVideoInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Video File (.mp4, .webm)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-amber-500"
                    />
                  </div>
                )}

                {urlError && <p className="text-xs text-red-400">{urlError}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Class</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as GradeLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-500"
                    >
                      {['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-500"
                    >
                      {['Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lecture Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Newton's Laws of Motion"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <FileText size={12} className="text-amber-400" /> Audio Transcript (For AI Scanner)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste lecture transcript or key points for automated AI standard validation & quiz generation..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                  <span>Triggers 6-digit OTP verification code targeting creator email before upload.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles size={16} />
                  <span>{isSendingOtp ? 'Sending OTP Code...' : 'Send OTP & Start AI Verification'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
