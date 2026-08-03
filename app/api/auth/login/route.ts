import { NextResponse } from 'next/server';
import { loginUserAccount } from '@/lib/db';
import { mobileNumberRegex } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobileNumber, pin } = body;

    const cleanMobile = (mobileNumber || '').replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');

    if (!mobileNumberRegex.test(cleanMobile)) {
      return NextResponse.json({ error: 'Invalid 10-digit Indian mobile number format.' }, { status: 400 });
    }

    const result = loginUserAccount(cleanMobile, pin);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    console.log(`✅ [YASSE Bank Login] Authenticated mobile ${cleanMobile}`);

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Login successful.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate user.' }, { status: 500 });
  }
}
