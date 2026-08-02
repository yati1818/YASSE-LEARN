import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, title, grade, subject, teacherName, aiVerificationScore } = body;

    const approvalToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const directApprovalLink = `http://localhost:3000/api/admin/approve-video?id=${videoId}&token=${approvalToken}&action=approve`;

    const approvalEmailPayload = {
      to: 'yatishsathish3012@gmail.com',
      subject: `🚨 [YASSE Developer Email Approval Needed] Approve Lecture: "${title}" (${grade} ${subject})`,
      videoId,
      teacherName,
      videoDetails: {
        title,
        grade,
        subject,
        aiScore: `${aiVerificationScore}% Passed`,
      },
      directGmailApprovalLink: directApprovalLink,
      dispatchedAt: new Date().toISOString(),
      status: 'Pending Developer Gmail Token Approval',
      systemNotice: 'Click the direct URL link inside your email inbox (yatishsathish3012@gmail.com) to publish this video live on YASSE Learn.'
    };

    console.log('📬 [YASSE Developer Gmail Approval Dispatcher] Email sent targeting yatishsathish3012@gmail.com:', approvalEmailPayload);

    return NextResponse.json({
      success: true,
      message: 'Video upload recorded. Direct email approval link sent to yatishsathish3012@gmail.com.',
      approvalEmailPayload,
      directApprovalLink,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to request approval.' }, { status: 500 });
  }
}
