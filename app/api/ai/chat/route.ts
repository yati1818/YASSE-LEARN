import { NextResponse } from 'next/server';
import { z } from 'zod';

const AiChatSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
  grade: z.string().optional().default('Class 10'),
  subject: z.string().optional().default('Science'),
  persona: z.enum(['male', 'female']).optional().default('male'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = AiChatSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || 'Invalid chat parameters.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { message, grade, subject, persona } = validationResult.data;

    // Mentor Persona Identity
    const mentorName = persona === 'female' ? 'Dr. Ananya Sharma' : 'Prof. Aryan Verma';
    const mentorTitle = persona === 'female' ? 'Senior Educator & Ph.D. Mentor' : 'Principal EdTech Specialist & IIT Mentor';

    let aiResponseText = '';

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      aiResponseText = `Hello! 👋 I am **${mentorName}**, your personal 24/7 YASSE AI Tutor for ${grade} (${subject}). How can I help you excel in your studies today? 😊`;
    } else if (lowerMessage.includes('math') || lowerMessage.includes('formula') || lowerMessage.includes('equation')) {
      aiResponseText = `Here is a step-by-step mathematical explanation:\n\n1. **Ohm's Law**: \\( V = I \\times R \\) where \\( V \\) is voltage, \\( I \\) is current, and \\( R \\) is resistance.\n2. **Einstein's Mass-Energy Equivalence**: \\( E = mc^2 \\)\n3. **Equivalent Resistance in Parallel**: \\( \\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\)\n\nDo you want me to break down a specific numerical problem for ${grade}? 🧮`;
    } else if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
      aiResponseText = `Here is a quick science joke for you! 🔬\n\n*Why can't you trust atoms?*\n**Because they make up everything!** 😄 Keep up the great study streak! 🔥`;
    } else if (lowerMessage.includes('streak') || lowerMessage.includes('xp') || lowerMessage.includes('badge')) {
      aiResponseText = `To build your daily streak flame 🔥 and earn **+100 Brain Synapse XP** today:\n\n• Maintain active study on YASSE Learn for **30 minutes**.\n• Complete a Practice Quiz or play a Math Sprint mini-game.\n• Ask a doubt to your teacher.\n\nYou're doing fantastic! 🚀`;
    } else {
      aiResponseText = `That's a great question regarding **${subject}** for **${grade}**! 📚\n\nIn standard CBSE/ICSE curriculum guidelines, understanding core concepts step-by-step is key. Let's break this down:\n\n1. **Core Principle**: Identify the fundamental physical laws or definitions.\n2. **Application**: Apply formulas such as \\( F = m \\times a \\) or chemical balanced equations.\n3. **Verification**: Always double-check your units (SI units like Joules, Watts, Amperes).\n\nWould you like a sample practice question or further breakdown on this topic? 💡`;
    }

    const chatPayload = {
      sender: 'assistant',
      content: aiResponseText,
      persona,
      mentorName,
      mentorTitle,
      timestamp: new Date().toISOString(),
    };

    console.log(`🤖 [YASSE AI Real-Time Tutor API Route] Persona: ${mentorName} (${persona}) responded:`, chatPayload);

    return NextResponse.json({
      success: true,
      message: chatPayload,
    });
  } catch (error) {
    return NextResponse.json({ error: 'AI Tutor service unavailable.' }, { status: 500 });
  }
}
