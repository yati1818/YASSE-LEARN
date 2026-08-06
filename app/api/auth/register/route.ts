import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkMobileExists, checkUsernameExists, registerUserAccount } from '@/lib/db';
import { UserProfile } from '@/lib/types';

const RegisterSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian mobile number.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  role: z.enum(['student', 'teacher']).optional().default('student'),
  grade: z.string().optional().default('Class 10'),
  board: z.enum(['CBSE', 'ICSE', 'State Board', 'International']).optional().default('CBSE'),
  pin: z.string().length(6, { message: 'PIN must be exactly 6 digits.' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = RegisterSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || 'Invalid registration details.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { mobileNumber, username, name, role, grade, board, pin } = validationResult.data;
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    const cleanUsername = username.trim().toLowerCase();

    if (checkMobileExists(cleanMobile)) {
      return NextResponse.json({ error: 'Mobile number is already registered. Please log in.' }, { status: 400 });
    }

    if (checkUsernameExists(cleanUsername)) {
      return NextResponse.json({ error: `Username @${cleanUsername} is already taken. Please choose another.` }, { status: 400 });
    }

    const newUserProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      playerId: `#YASSE-${cleanMobile.slice(-4)}`,
      name: name || 'Learner',
      role: role || 'student',
      grade: grade || 'Class 10',
      board: board || 'CBSE',
      mobileNumber: cleanMobile,
      streakDays: 1,
      xp: 100,
      streakCalendarLogs: [new Date().toISOString().split('T')[0]],
      lastWatchDate: new Date().toISOString().split('T')[0],
      completedLectures: [],
      quizScores: {},
      bookmarkedVideoIds: [],
      studySecondsToday: 0,
      friends: [],
      friendRequests: [],
    };

    const result = registerUserAccount(cleanMobile, pin, newUserProfile);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    console.log(`✅ [YASSE Registration] Created account @${cleanUsername} for mobile ${cleanMobile}`);

    return NextResponse.json({
      success: true,
      mobileNumber: cleanMobile,
      username: cleanUsername,
      user: result.user || newUserProfile,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error during user registration.' }, { status: 500 });
  }
}
