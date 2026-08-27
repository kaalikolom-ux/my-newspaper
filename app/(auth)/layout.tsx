import React from 'react';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';

export const runtime = 'edge';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Newspaper className="w-8 h-8 text-brand-600 group-hover:scale-105 transition" />
          <span className="font-headline text-3xl font-black text-white tracking-tight uppercase">
            CHRONICLE
          </span>
        </Link>
        <span className="text-xs text-neutral-400 block mt-1">
          Publishing Portal & CMS Access
        </span>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xs shadow-xl p-8">
        {children}
      </div>

      <div className="mt-6 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-300 transition">
          ← Return to The Daily Chronicle homepage
        </Link>
      </div>
    </div>
  );
}
