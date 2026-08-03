import { NextResponse } from 'next/server';
import { registerUserAccount, checkUsernameExists } from '@/lib/db';
import { mobileNumberRegex } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobileNumber, username, pin, name, email, role, grade, board } = body;

    const cleanMobile = (mobileNumber || '').replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');

    if (!mobileNumberRegex.test(cleanMobile)) {
      return NextResponse.json({ error: 'Invalid 10-digit Indian mobile number format.' }, { status: 400 });
    }

    const cleanUsername = (username || name || `user_${Date.now()}`).toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!cleanUsername || cleanUsername.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 alphanumeric characters.' }, { status: 400 });
    }

    if (checkUsernameExists(cleanUsername)) {
      return NextResponse.json({ error: `Username @${cleanUsername} is already taken. Please choose another.` }, { status: 400 });
    }

    if (!pin || pin.length !== 6) {
      return NextResponse.json({ error: 'Security PIN must be exactly 6 digits.' }, { status: 400 });
    }

    const newUserProfile = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      name: name || 'Learner',
      email: email || 'yatishsathish3012@gmail.com',
      role: role || 'student',
      grade: grade || 'Class 10',
      board: board || 'CBSE',
      privateMobileNumber: cleanMobile,
      teacherMobileVerified: true,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      subjects: ['Science', 'Mathematics'],
      studySecondsToday: 0,
      friends: [],
      friendRequests: [],
      privacy: { isProfilePublic: true, showStreaks: true, showBadges: true, showDoubtsCount: true },
      createdAt: new Date().toISOString(),
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
      user: newUserProfile,
      message: 'Account registered successfully.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register account.' }, { status: 500 });
  }
}
