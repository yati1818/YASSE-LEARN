export type UserRole = 'student' | 'teacher';
export type BoardType = 'CBSE' | 'ICSE' | 'State Board' | 'International';
export type GradeLevel = 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
export type VibeCategory = 'junior' | 'middle' | 'senior';

export interface UserProfile {
  id: string;
  username: string; // unique handle e.g. "yashwardhan"
  playerId: string; // unique gamer tag e.g. "#YASSE-9344"
  name: string;
  email?: string;
  bio?: string;
  role: UserRole;
  grade: string;
  board: BoardType;
  mobileNumber: string;
  privateMobileNumber?: string;
  avatarUrl?: string;
  googleSynced?: boolean;
  privacy?: {
    isProfilePublic: boolean;
    showStreaks: boolean;
    showBadges: boolean;
    showDoubtsCount: boolean;
  };
  streakDays: number;
  xp: number;
  streakCalendarLogs: string[];
  lastWatchDate: string;
  completedLectures: string[];
  quizScores: Record<string, number>;
  bookmarkedVideoIds: string[];
  studySecondsToday: number;
  friends: string[]; // array of usernames/playerIds
  friendRequests: string[]; // array of requester handles
}

export interface VideoLecture {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  chapter: string;
  youtubeUrl: string;
  teacherName: string;
  teacherId: string;
  teacherAvatarUrl?: string;
  durationMinutes: number;
  isVerified: boolean;
  status: 'pending_ai_review' | 'pending_admin_approval' | 'published' | 'rejected';
  approvalToken?: string;
  createdAt: string;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  username: string;
  playerId: string;
  qualification: string;
  subjectSpecialization: string;
  avatarUrl: string;
  verifiedBadge: boolean;
  publishedCount: number;
}

export interface DoubtItem {
  id: string;
  studentName: string;
  studentGrade: string;
  questionText: string;
  subject: string;
  createdAt: string;
  isAnswered: boolean;
  teacherAnswer?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWatchDate: string;
  calendarLogs: string[];
  xp: number;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTopics?: string[];
  persona?: 'male' | 'female';
}
