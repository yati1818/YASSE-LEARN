import { NextResponse } from 'next/server';
import { checkMobileExists } from '@/lib/db';
import { mobileNumberRegex } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cleanMobile = (body.mobileNumber || '').replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');

    if (!mobileNumberRegex.test(cleanMobile)) {
      return NextResponse.json({ error: 'Invalid 10-digit Indian mobile number format. Must start with 6-9.' }, { status: 400 });
    }

    const isRegistered = checkMobileExists(cleanMobile);

    return NextResponse.json({
      success: true,
      mobileNumber: cleanMobile,
      isRegistered,
      recommendedAction: isRegistered ? 'login' : 'register',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check mobile number.' }, { status: 500 });
  }
}
