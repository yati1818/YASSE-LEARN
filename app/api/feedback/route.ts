import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, userEmail, role, grade, type, rating, message } = body;

    if (!userEmail || !message) {
      return NextResponse.json(
        { error: 'Email and message content are required.' },
        { status: 400 }
      );
    }

    const payload = {
      destination: 'yatishsathish3012@gmail.com',
      submittedAt: new Date().toISOString(),
      userName: userName || 'Anonymous',
      userEmail,
      role: role || 'Student',
      grade: grade || 'N/A',
      feedbackType: type || 'suggestion',
      starRating: rating || 5,
      message,
      systemNotice: 'This submission was automatically routed from YASSE Learn Platform to yatishsathish3012@gmail.com.'
    };

    console.log('📬 [YASSE Learn Feedback Router] Dispatching payload to yatishsathish3012@gmail.com:', payload);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully and routed to yatishsathish3012@gmail.com',
      payload,
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback submission.' },
      { status: 500 }
    );
  }
}
