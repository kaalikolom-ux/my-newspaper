import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tiryicmmbbwytdrxwnsb.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcnlpY21tYmJ3eXRkcnh3bnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTUwMDcsImV4cCI6MjEwMzM5MTAwN30.9V3djlAZyjUx0FdlLuhDsMnEmtTH0JwYCwy6twT9QyY';

  let cookieStore: any;
  try {
    cookieStore = cookies();
  } catch {
    cookieStore = null;
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore?.get(name)?.value;
          } catch {
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore?.set({ name, value, ...options });
          } catch {
            // Ignored from Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore?.set({ name, value: '', ...options });
          } catch {
            // Ignored from Server Component
          }
        },
      },
    }
  );
}
