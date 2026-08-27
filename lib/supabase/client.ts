import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tiryicmmbbwytdrxwnsb.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcnlpY21tYmJ3eXRkcnh3bnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTUwMDcsImV4cCI6MjEwMzM5MTAwN30.9V3djlAZyjUx0FdlLuhDsMnEmtTH0JwYCwy6twT9QyY';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
