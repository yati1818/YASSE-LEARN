'use client';

import { useState, useEffect } from 'react';
import { UserProfile, VideoLecture, DoubtItem, StreakData, GradeLevel, VibeCategory } from './types';
import { MOCK_TEACHERS, MOCK_VIDEOS, MOCK_DOUBTS, INITIAL_STREAK } from './mockData';

export function getVibeCategory(grade?: GradeLevel): VibeCategory {
  if (!grade) return 'middle';
  if (['Class 3', 'Class 4', 'Class 5'].includes(grade)) return 'junior';
  if (['Class 6', 'Class 7', 'Class 8'].includes(grade)) return 'middle';
  return 'senior';
}

const STORAGE_KEYS = {
  USER: 'yasse_user_profile_v3',
  STREAK: 'yasse_streak_data_v3',
  VIDEOS: 'yasse_videos_list_v3',
  DOUBTS: 'yasse_doubts_list_v3',
};

export function useYasseStore() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<VideoLecture[]>([]);
  const [doubts, setDoubts] = useState<DoubtItem[]>([]);
  const [streak, setStreak] = useState<StreakData>(INITIAL_STREAK);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const defaultUser: UserProfile = {
          id: 'user-default-1',
          name: 'Yashwardhan Sharma',
          email: 'yatishsathish3012@gmail.com',
          role: 'student',
          gender: 'male',
          board: 'CBSE',
          googleSynced: true,
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Yash',
          grade: 'Class 5',
          subjects: ['Science', 'Mathematics', 'English'],
          bio: 'Enthusiastic Grade 5 student loving science experiments and math puzzles!',
          privacy: { isProfilePublic: true, showStreaks: true, showBadges: true, showDoubtsCount: true },
          createdAt: new Date().toISOString(),
        };
        setUser(defaultUser);
      }

      // Read streak data; force zero baseline
      const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (savedStreak) {
        setStreak(JSON.parse(savedStreak));
      } else {
        setStreak(INITIAL_STREAK);
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(INITIAL_STREAK));
      }

      // Read videos list; default to empty array
      const savedVideos = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos));
      } else {
        setVideos([]);
        localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify([]));
      }

      // Read doubts list; default to empty array
      const savedDoubts = localStorage.getItem(STORAGE_KEYS.DOUBTS);
      if (savedDoubts) {
        setDoubts(JSON.parse(savedDoubts));
      } else {
        setDoubts([]);
        localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify([]));
      }
    } catch (e) {
      console.error('Error loading YASSE local storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const addVideo = (newVideo: VideoLecture) => {
    const updated = [newVideo, ...videos];
    setVideos(updated);
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
  };

  const approveVideo = (videoId: string) => {
    const updated = videos.map(v => v.id === videoId ? { ...v, approvalStatus: 'approved' as const } : v);
    setVideos(updated);
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    fetch('/api/admin/approve-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, action: 'approve', adminEmail: 'yatishsathish3012@gmail.com' }),
    }).catch(err => console.error('Approve API error', err));
  };

  const rejectVideo = (videoId: string) => {
    const updated = videos.map(v => v.id === videoId ? { ...v, approvalStatus: 'rejected' as const } : v);
    setVideos(updated);
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    fetch('/api/admin/approve-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, action: 'reject', adminEmail: 'yatishsathish3012@gmail.com' }),
    }).catch(err => console.error('Reject API error', err));
  };

  const addDoubt = (newDoubt: DoubtItem) => {
    const updated = [newDoubt, ...doubts];
    setDoubts(updated);
    localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(updated));
    incrementBrainStreak(50, 'Curious Learner Doubt Badge');
  };

  const incrementVideoStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const logs = streak.calendarLogs || [];
    const updatedLogs = Array.from(new Set([...logs, today]));

    const updated: StreakData = {
      ...streak,
      videoStreakDays: streak.lastVideoWatchDate !== today ? streak.videoStreakDays + 1 : streak.videoStreakDays,
      lastVideoWatchDate: today,
      totalXP: streak.totalXP + 100,
      calendarLogs: updatedLogs,
    };
    setStreak(updated);
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
  };

  const incrementBrainStreak = (xpGained = 50, badgeName?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const logs = streak.calendarLogs || [];
    const updatedLogs = Array.from(new Set([...logs, today]));

    const newXP = streak.totalXP + xpGained;
    let newBadges = [...streak.badgesUnlocked];

    if (badgeName && !newBadges.some(b => b.title === badgeName)) {
      newBadges.push({
        id: `badge-${Date.now()}`,
        title: badgeName,
        icon: '🧠⚡',
        unlockedAt: today,
        description: 'Unlocked by actively engaging in brain-power problem solving!',
      });
    }

    const updated: StreakData = {
      ...streak,
      brainStreakDays: streak.lastBrainActivityDate !== today ? streak.brainStreakDays + 1 : streak.brainStreakDays,
      lastBrainActivityDate: today,
      totalXP: newXP,
      calendarLogs: updatedLogs,
      badgesUnlocked: newBadges,
    };
    setStreak(updated);
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
  };

  return {
    user,
    saveUser,
    videos,
    addVideo,
    approveVideo,
    rejectVideo,
    doubts,
    addDoubt,
    streak,
    incrementVideoStreak,
    incrementBrainStreak,
    isLoaded,
    vibeCategory: getVibeCategory(user?.grade),
  };
}
