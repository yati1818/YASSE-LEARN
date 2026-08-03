export type UserRole = 'student' | 'teacher' | 'admin';

export type GradeLevel = 
  | 'Class 3' | 'Class 4' | 'Class 5'
  | 'Class 6' | 'Class 7' | 'Class 8'
  | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export type VibeCategory = 'junior' | 'middle' | 'senior';

export type GenderType = 'male' | 'female' | 'other';

export type CurriculumBoard = 'CBSE' | 'ICSE' | 'State Board' | 'International';

export interface UserPrivacySettings {
  isProfilePublic: boolean;
  showStreaks: boolean;
  showBadges: boolean;
  showDoubtsCount: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  gender?: GenderType;
  board?: CurriculumBoard;
  googleSynced?: boolean;
  grade?: GradeLevel;
  subjects: string[];
  bio?: string;
  privacy: UserPrivacySettings;
  teacherVerified?: boolean;
  teacherRating?: number;
  teacherQualification?: string;
  privateMobileNumber?: string;
  teacherMobileVerified?: boolean;
  aiPersonaPreference?: 'male' | 'female';
  studySecondsToday?: number;
  friends?: string[];
  friendRequests?: string[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AiNoteItem {
  title: string;
  text: string;
}

export type ApprovalStatus = 'pending_admin_approval' | 'approved' | 'rejected';

export interface VideoLecture {
  id: string;
  title: string;
  description: string;
  grade: GradeLevel;
  subject: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  teacherVerified: boolean;
  videoType: 'youtube' | 'uploaded_file';
  videoUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  durationMinutes: number;
  viewsCount: number;
  isAiVerified: boolean;
  aiVerificationScore: number;
  aiComplianceSummary: string;
  transcript: string;
  creatorOtpVerified: boolean;
  approvalStatus: ApprovalStatus;
  adminApproverEmail: string;
  aiNotes: AiNoteItem[];
  aiQuizQuestions: QuizQuestion[];
  createdAt: string;
}

export interface DoubtItem {
  id: string;
  videoId: string;
  videoTitle: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  teacherId: string;
  teacherEmail: string;
  timestampInVideo?: string;
  subject: string;
  questionTitle: string;
  questionDetails: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'answered';
  answerText?: string;
  createdAt: string;
}

export interface StreakData {
  videoStreakDays: number;
  lastVideoWatchDate: string;
  brainStreakDays: number;
  lastBrainActivityDate: string;
  totalXP: number;
  calendarLogs: string[];
  badgesUnlocked: {
    id: string;
    title: string;
    icon: string;
    unlockedAt: string;
    description: string;
  }[];
}

export interface FeedbackSubmission {
  id: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  grade?: string;
  type: 'suggestion' | 'bug' | 'feature_request' | 'general';
  rating: number;
  message: string;
  submittedAt: string;
  destinationEmail: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTopics?: string[];
  persona?: 'male' | 'female';
}
