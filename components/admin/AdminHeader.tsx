'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, User, Globe, Plus, Shield } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-between font-sans">
      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Story</span>
        </Link>
        <div className="hidden sm:flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Admin Access Enabled</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-brand-600 transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">The Daily Chronicle</span>
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-neutral-200 dark:border-neutral-800">
          <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold font-headline">
            M
          </div>
          <div className="hidden sm:block text-left text-xs">
            <span className="font-bold text-neutral-900 dark:text-white block leading-none">Mahmud Hasan</span>
            <span className="text-[10px] text-neutral-400">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
