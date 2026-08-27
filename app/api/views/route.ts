import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ success: false, message: 'Missing postId' }, { status: 400 });
    }

    try {
      const supabase = createServerSupabaseClient();
      await supabase.rpc('increment_post_views', { post_id: postId });
    } catch {
      // Ignored
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
