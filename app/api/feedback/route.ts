import { NextResponse } from 'next/server';
import { FeedbackSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = FeedbackSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || 'Invalid feedback parameters.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { userName, userEmail, role, grade, type, rating, message, clientDiagnostics } = validationResult.data;

    const htmlEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #080c14; color: #f1f5f9; padding: 20px; }
          .card { background: #0f172a; border: 1px solid #334155; padding: 24px; border-radius: 16px; }
          .badge { background: #7c3aed; color: #fff; padding: 4px 12px; border-radius: 99px; font-weight: bold; font-size: 12px; }
          .diag { background: #020617; border: 1px solid #1e293b; padding: 12px; border-radius: 12px; margin-top: 12px; font-family: monospace; font-size: 11px; color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">${type.toUpperCase()} REPORT</span>
          <h2>Feedback Submission from ${userName} (${grade || role})</h2>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Rating:</strong> ${rating}/5 Stars</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 3px solid #06b6d4; padding-left: 12px; color: #e2e8f0;">${message}</blockquote>
          
          <h3>📱 Client Device Diagnostics:</h3>
          <div class="diag">
            <p>• Device Type: ${clientDiagnostics.deviceType}</p>
            <p>• Operating System: ${clientDiagnostics.operatingSystem}</p>
            <p>• Browser: ${clientDiagnostics.browser}</p>
            <p>• Screen Resolution: ${clientDiagnostics.screenResolution}</p>
            <p>• Active Grade View: ${clientDiagnostics.activeGradeView || 'General'}</p>
            <p>• Timestamp: ${clientDiagnostics.submittedAt}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailPayload = {
      to: 'yatishsathish3012@gmail.com',
      subject: `🚨 [YASSE Diagnostic Bug Report] ${type.toUpperCase()} from ${userName}`,
      html: htmlEmailContent,
      dispatchedAt: new Date().toISOString(),
      destination: 'yatishsathish3012@gmail.com',
    };

    console.log('📬 [YASSE HTML Email Telemetry Dispatcher] Sent to yatishsathish3012@gmail.com:', emailPayload);

    return NextResponse.json({
      success: true,
      message: 'Feedback and client diagnostic report dispatched to yatishsathish3012@gmail.com.',
      emailPayload,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to dispatch feedback.' }, { status: 500 });
  }
}
