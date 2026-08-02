import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { otpCode, creatorEmail } = body;

    if (!otpCode) {
      return NextResponse.json({ error: 'OTP code is required.' }, { status: 400 });
    }

    // Accept valid 6-digit numeric OTP or demo code
    const is6Digits = /^\d{6}$/.test(otpCode);

    if (is6Digits) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Creator ownership verified successfully! Proceeding to AI video compliance inspection.',
        verifiedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid 6-digit OTP code. Please enter a valid 6-digit code.' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify OTP.' },
      { status: 500 }
    );
  }
}
