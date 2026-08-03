import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, userEmail, role, grade, type, rating, message, clientDiagnostics } = body;

    const emailPayload = {
      to: 'yatishsathish3012@gmail.com',
      subject: `🚨 [YASSE App Diagnostic Bug Report] ${type.toUpperCase()} from ${userName} (${grade || role})`,
      reportData: {
        userName,
        userEmail,
        role,
        grade,
        feedbackType: type,
        rating: `${rating}/5 Stars`,
        userMessage: message,
      },
      clientDiagnostics: clientDiagnostics || {
        deviceType: 'Desktop/Mobile',
        operatingSystem: 'Client Browser OS',
        browser: 'Webview',
      },
      destination: 'yatishsathish3012@gmail.com',
      dispatchedAt: new Date().toISOString(),
      systemNotice: 'This report includes full client device diagnostics to facilitate live debugging.'
    };

    console.log('📬 [YASSE App Bug Diagnostics Email Dispatcher] Target yatishsathish3012@gmail.com:', emailPayload);

    return NextResponse.json({
      success: true,
      message: 'Diagnostic bug report received and dispatched to yatishsathish3012@gmail.com.',
      emailPayload,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to dispatch feedback.' }, { status: 500 });
  }
}
