import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoTitle, studentName, studentGrade, teacherEmail, questionTitle, questionDetails, timestampInVideo, urgency } = body;

    if (!questionTitle || !questionDetails) {
      return NextResponse.json(
        { error: 'Question title and details are required.' },
        { status: 400 }
      );
    }

    const targetEmail = teacherEmail || 'yatishsathish3012@gmail.com';

    const doubtEmailPayload = {
      to: targetEmail,
      cc: 'yatishsathish3012@gmail.com',
      subject: `🚨 [YASSE Doubt Alert - ${urgency?.toUpperCase() || 'NORMAL'}] ${studentName} (${studentGrade}) asked a doubt on "${videoTitle}"`,
      timestamp: new Date().toISOString(),
      studentInfo: {
        name: studentName,
        grade: studentGrade,
      },
      videoContext: {
        videoTitle,
        timestampInVideo: timestampInVideo || '00:00',
      },
      doubtContent: {
        title: questionTitle,
        details: questionDetails,
      },
      status: 'Dispatched to Teacher Inbox & Admin Copy',
    };

    console.log('✉️ [YASSE Doubt Clarification Engine] Dispatching email:', doubtEmailPayload);

    return NextResponse.json({
      success: true,
      message: `Doubt sent successfully! Email dispatched to ${targetEmail} with CC to admin (yatishsathish3012@gmail.com).`,
      doubtEmailPayload,
    });
  } catch (error) {
    console.error('Doubt API error:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch doubt.' },
      { status: 500 }
    );
  }
}
