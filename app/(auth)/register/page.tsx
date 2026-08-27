'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TurnstileWidget from '@/components/public/TurnstileWidget';

export const runtime = 'edge';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      router.push('/admin');
    } catch (err: any) {
      console.warn('Register notice:', err);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-headline text-xl font-bold text-neutral-900 dark:text-white">
          Create Reader / Author Account
        </h1>
        <p className="text-xs text-neutral-500 font-sans">
          Join The Daily Chronicle publishing community.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Tanjil Rahman"
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tanjil@example.com"
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <TurnstileWidget onVerify={() => {}} />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
        >
          <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
        <span>Already have an account? </span>
        <Link href="/login" className="text-brand-600 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
