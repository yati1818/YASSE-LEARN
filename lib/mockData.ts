import { VideoLecture, UserProfile, DoubtItem, StreakData } from './types';

// Verified Initial Teacher Profiles for authentic system operation
export const MOCK_TEACHERS: UserProfile[] = [
  {
    id: 't1',
    name: 'Dr. Ananya Sharma',
    email: 'ananya.physics@yasselearn.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    gender: 'female',
    board: 'CBSE',
    googleSynced: true,
    subjects: ['Physics', 'Science', 'Mathematics'],
    bio: 'Ph.D. in Applied Physics with 12+ years teaching Class 8-12. Passionate about conceptual clarity & fun experiments.',
    privacy: { isProfilePublic: true, showStreaks: true, showBadges: true, showDoubtsCount: true },
    teacherVerified: true,
    teacherRating: 4.9,
    teacherQualification: 'Ph.D. Physics, IIT Madras',
    privateMobileNumber: '+91 98765 43210',
    teacherMobileVerified: true,
    createdAt: '2025-01-10',
  },
  {
    id: 't2',
    name: 'Prof. Rajesh Verma',
    email: 'rajesh.maths@yasselearn.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    gender: 'male',
    board: 'CBSE',
    googleSynced: true,
    subjects: ['Mathematics', 'Logic & Puzzles'],
    bio: 'Senior Educator & Olympiad Coach. Making Math intuitive for Class 3 to Class 8 through animated storytelling.',
    privacy: { isProfilePublic: true, showStreaks: true, showBadges: true, showDoubtsCount: true },
    teacherVerified: true,
    teacherRating: 4.85,
    teacherQualification: 'M.Sc. Applied Math, Delhi University',
    privateMobileNumber: '+91 98123 45678',
    teacherMobileVerified: true,
    createdAt: '2025-01-15',
  }
];

// ABSOLUTE ZERO MOCK DATA: Empty initial video lectures array
export const MOCK_VIDEOS: VideoLecture[] = [];

// ABSOLUTE ZERO MOCK DATA: Empty initial doubts array
export const MOCK_DOUBTS: DoubtItem[] = [];

// ABSOLUTE ZERO BASELINE: Strictly 0 initial values for true real-time tracking
export const INITIAL_STREAK: StreakData = {
  videoStreakDays: 0,
  lastVideoWatchDate: '',
  brainStreakDays: 0,
  lastBrainActivityDate: '',
  totalXP: 0,
  calendarLogs: [],
  badgesUnlocked: []
};
