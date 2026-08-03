import { NextResponse } from 'next/server';
import { OtpVerifySchema } from '@/lib/validations';
import { verifyServerOtp } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = OtpVerifySchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || 'Invalid OTP code format.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { mobileNumber, otp } = validationResult.data;

    const result = verifyServerOtp(mobileNumber, otp);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Invalid 6-digit OTP entered.' }, { status: 400 });
    }

    console.log(`✅ [YASSE OTP Verification] Mobile ${mobileNumber} successfully verified!`);

    return NextResponse.json({
      success: true,
      mobileNumber,
      isVerified: true,
      message: 'Mobile number verified successfully.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify OTP code.' }, { status: 500 });
  }
}
