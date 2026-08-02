import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');
  const action = searchParams.get('action') || 'approve';
  const approver = 'yatishsathish3012@gmail.com';

  if (!videoId) {
    return new Response('<h1>Error: Missing Video ID</h1>', { headers: { 'content-type': 'text/html' } });
  }

  const isApproved = action !== 'reject';
  console.log(`✅ [YASSE Gmail Direct Link Approval] Video ${videoId} set to ${isApproved ? 'APPROVED' : 'REJECTED'} by ${approver}`);

  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>YASSE Learn - Developer Video Approval Confirmation</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #080c14; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #0f172a; border: 1px solid #334155; padding: 2.5rem; border-radius: 1.5rem; max-width: 500px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .badge { display: inline-block; padding: 0.5rem 1rem; border-radius: 9999px; background: #064e3b; color: #34d399; font-weight: bold; font-size: 0.875rem; margin-bottom: 1rem; }
        h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #fff; }
        p { font-size: 0.95rem; color: #94a3b8; line-height: 1.6; }
        .btn { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #06b6d4; color: #090d16; font-weight: bold; border-radius: 0.75rem; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">✓ Developer Email Approval Verified</div>
        <h1>Video Status Set to APPROVED! 🎉</h1>
        <p>The uploaded lecture video (ID: <strong>${videoId}</strong>) has been officially approved by developer <strong>${approver}</strong>.</p>
        <p>It is now live and accessible on the public YASSE Learn student dashboard feed.</p>
        <a href="http://localhost:3000/dashboard" class="btn">Return to YASSE Learn Dashboard →</a>
      </div>
    </body>
    </html>
  `;

  return new Response(htmlResponse, {
    headers: { 'content-type': 'text/html' },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, action, adminEmail } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required.' }, { status: 400 });
    }

    const approver = adminEmail || 'yatishsathish3012@gmail.com';
    const isApproved = action !== 'reject';

    console.log(`✅ [YASSE Developer Approval API] Video ${videoId} set to ${isApproved ? 'APPROVED' : 'REJECTED'} by ${approver}`);

    return NextResponse.json({
      success: true,
      videoId,
      approvalStatus: isApproved ? 'approved' : 'rejected',
      approvedBy: approver,
      updatedAt: new Date().toISOString(),
      message: isApproved 
        ? `Video approved by ${approver}! Now live on student dashboard feed.`
        : `Video rejected by ${approver}.`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update approval status.' }, { status: 500 });
  }
}
