import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

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
