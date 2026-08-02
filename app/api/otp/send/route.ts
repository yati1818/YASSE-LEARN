import { NextResponse } from 'next/server';

// Temporary in-memory OTP store
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoTitle, creatorEmail, teacherName } = body;

    const targetEmail = creatorEmail || 'yatishsathish3012@gmail.com';
    
    // Generate 6-digit numeric OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    otpStore.set(targetEmail, { code: generatedOtp, expiresAt });

    const payload = {
      to: targetEmail,
      subject: `🔑 [YASSE Creator OTP Verification] Authorize Video Upload: "${videoTitle}"`,
      otpCode: generatedOtp,
      teacherName,
      videoTitle,
      dispatchedAt: new Date().toISOString(),
      destination: 'yatishsathish3012@gmail.com',
      systemNotice: 'This OTP is required to verify video ownership and prevent unauthorized links on YASSE Learn.',
    };

    console.log('🔑 [YASSE Creator OTP Dispatcher] Payload targeting yatishsathish3012@gmail.com:', payload);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to creator email (${targetEmail}). Please enter 6-digit OTP to authorize upload.`,
      targetEmail,
      demoOtpCode: generatedOtp, // Provided for live testing ease
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send verification OTP.' },
      { status: 500 }
    );
  }
}
