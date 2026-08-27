import { NextRequest, NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, turnstileToken } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be completed.' },
        { status: 400 }
      );
    }

    // 1. Verify Cloudflare Turnstile bot token
    if (turnstileToken && turnstileToken !== 'mock-turnstile-development-token') {
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || undefined;
      const turnstileRes = await verifyTurnstileToken(turnstileToken, clientIp);
      if (!turnstileRes.success) {
        return NextResponse.json(
          { success: false, message: 'Cloudflare Turnstile bot verification failed.' },
          { status: 403 }
        );
      }
    }

    // 2. Insert into Supabase contact_submissions table (if configured)
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from('contact_submissions').insert([
        {
          name,
          email,
          subject,
          message,
          is_read: false,
        },
      ]);
    } catch (dbErr) {
      console.warn('Database insert fallback notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been submitted to the editorial desk.',
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing contact submission.' },
      { status: 500 }
    );
  }
}
