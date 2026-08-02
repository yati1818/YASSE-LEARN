import { VideoLecture, UserProfile, DoubtItem, StreakData } from './types';

export const MOCK_TEACHERS: UserProfile[] = [
  {
    id: 't1',
    name: 'Dr. Ananya Sharma',
    email: 'ananya.physics@yasselearn.edu',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    gender: 'female',
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

export const MOCK_VIDEOS: VideoLecture[] = [
  {
    id: 'v-c3-sci',
    title: 'The Magical Solar System & Planet Adventures 🚀🪐',
    description: 'Explore the 8 planets, sun, moon, and gravity with colorful 3D animations made specially for Class 3-5 kids!',
    grade: 'Class 4',
    subject: 'Science',
    teacherId: 't1',
    teacherName: 'Dr. Ananya Sharma',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    teacherVerified: true,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=libKVRa074s',
    embedUrl: 'https://www.youtube.com/embed/libKVRa074s?rel=0&modestbranding=1',
    thumbnailUrl: 'https://img.youtube.com/vi/libKVRa074s/hqdefault.jpg',
    durationMinutes: 14,
    viewsCount: 14200,
    isAiVerified: true,
    aiVerificationScore: 99,
    aiComplianceSummary: 'AI Standard Passed: Meets Class 3-5 Elementary Science Framework, zero inappropriate content, 100% transcript accuracy.',
    transcript: 'Welcome young space explorers! Today we take a rocket ship trip through the Solar System. Sun is our glowing star...',
    creatorOtpVerified: true,
    approvalStatus: 'approved',
    adminApproverEmail: 'yatishsathish3012@gmail.com',
    aiNotes: [
      { title: '1. The Sun is our Solar System Star', text: 'The Sun is at the center of our solar system and holds all 8 planets in orbit using its gravitational pull.' },
      { title: '2. Inner vs Outer Planets', text: 'Mercury, Venus, Earth, and Mars are rocky inner planets; Jupiter, Saturn, Uranus, and Neptune are gas giants.' }
    ],
    aiQuizQuestions: [
      {
        id: 'q-solar-1',
        question: 'Which planet is known as the Blue Planet because of its vast oceans?',
        options: ['Mars', 'Jupiter', 'Earth', 'Saturn'],
        correctAnswerIndex: 2,
        explanation: 'Earth is called the Blue Planet because water covers over 70% of its surface!',
      },
      {
        id: 'q-solar-2',
        question: 'What is at the very center of our Solar System keeping all planets in orbit?',
        options: ['The Moon', 'The Sun', 'Black Hole', 'Comet'],
        correctAnswerIndex: 1,
        explanation: 'The Sun is the giant star at the center whose gravity holds the solar system together.',
      }
    ],
    createdAt: '2026-07-01',
  },
  {
    id: 'v-c10-phy',
    title: 'Electricity & Ohm’s Law: Resistance & Voltage Decoded ⚡💡',
    description: 'Master V = I * R, series & parallel resistors, heating effects of electric current, and board exam numericals.',
    grade: 'Class 10',
    subject: 'Physics',
    teacherId: 't1',
    teacherName: 'Dr. Ananya Sharma',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    teacherVerified: true,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=Q0B_bZ_g0nQ',
    embedUrl: 'https://www.youtube.com/embed/Q0B_bZ_g0nQ?rel=0&modestbranding=1',
    thumbnailUrl: 'https://img.youtube.com/vi/Q0B_bZ_g0nQ/hqdefault.jpg',
    durationMinutes: 35,
    viewsCount: 48900,
    isAiVerified: true,
    aiVerificationScore: 100,
    aiComplianceSummary: 'AI Standard Passed 100%: Complete coverage of Class 10 Board exam numericals and SI unit derivations.',
    transcript: 'Ohm’s law states that current flowing through a conductor is directly proportional to potential difference across its ends...',
    creatorOtpVerified: true,
    approvalStatus: 'approved',
    adminApproverEmail: 'yatishsathish3012@gmail.com',
    aiNotes: [
      { title: '1. Ohm’s Law Formula: V = I * R', text: 'Voltage (V) in Volts equals Current (I) in Amperes multiplied by Resistance (R) in Ohms.' },
      { title: '2. Series vs Parallel Resistors', text: 'In series, total R = R1 + R2. In parallel, 1/R_eq = 1/R1 + 1/R2, which reduces total equivalent resistance.' }
    ],
    aiQuizQuestions: [
      {
        id: 'q-phy-1',
        question: 'What happens to the current in a circuit if resistance is doubled while potential difference (V) remains constant?',
        options: ['Current doubles', 'Current is halved', 'Current stays same', 'Current becomes zero'],
        correctAnswerIndex: 1,
        explanation: 'From I = V/R, current is inversely proportional to resistance. Doubling resistance halves current!',
      },
      {
        id: 'q-phy-2',
        question: 'What is the SI unit of electrical resistance?',
        options: ['Ampere (A)', 'Volt (V)', 'Ohm (Ω)', 'Watt (W)'],
        correctAnswerIndex: 2,
        explanation: 'The SI unit of electrical resistance is the Ohm, symbolized by Ω.',
      }
    ],
    createdAt: '2026-07-15',
  }
];

export const MOCK_DOUBTS: DoubtItem[] = [
  {
    id: 'd1',
    videoId: 'v-c10-phy',
    videoTitle: 'Electricity & Ohm’s Law: Resistance & Voltage Decoded',
    studentId: 's1',
    studentName: 'Aarav Gupta',
    studentGrade: 'Class 10',
    teacherId: 't1',
    teacherEmail: 'ananya.physics@yasselearn.edu',
    timestampInVideo: '12:45',
    subject: 'Physics',
    questionTitle: 'Why does equivalent resistance decrease in parallel combination?',
    questionDetails: 'At timestamp 12:45, you mentioned 1/R_eq = 1/R1 + 1/R2. Mathematically I get it, but intuitively why does adding a resistor reduce total resistance?',
    urgency: 'high',
    status: 'answered',
    answerText: 'Great question Aarav! Parallel resistors provide extra paths for electron flow, reducing overall circuit friction!',
    createdAt: '2026-07-25',
  }
];

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
