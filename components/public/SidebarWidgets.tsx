'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Mail, Send, CheckCircle2, User, ExternalLink, Sparkles } from 'lucide-react';
import { Post, Profile } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface SidebarWidgetsProps {
  popularPosts: Post[];
  authors?: Profile[];
}

export default function SidebarWidgets({ popularPosts, authors = [] }: SidebarWidgetsProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <aside className="space-y-8">
      {/* 1. Trending / Most Read Widget */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b-2 border-brand-600 pb-2 mb-4">
          <Flame className="w-5 h-5 text-brand-600 fill-brand-600" />
          <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white">
            Most Read Stories
          </h3>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {popularPosts.map((post, idx) => (
            <div key={post.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 group">
              {/* Numeric Rank Badge (1-5) */}
              <span
                className={`w-7 h-7 shrink-0 rounded-xs flex items-center justify-center font-headline font-bold text-xs ${
                  idx === 0
                    ? 'bg-brand-600 text-white'
                    : idx === 1
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {idx + 1}
              </span>

              <div className="flex-1 space-y-1">
                <h4 className="font-headline text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-brand-600 transition leading-snug">
                  <Link href={`/news/${post.slug}`}>
                    {post.title}
                  </Link>
                </h4>
                <div className="text-[11px] text-neutral-400 font-sans flex items-center gap-2">
                  <span>{formatDate(post.published_at)}</span>
                  <span>•</span>
                  <span>{post.views_count.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Responsive Advertisement / Sponsor Slot */}
      <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xs p-6 text-center space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
          SPONSORED SPOTLIGHT
        </span>
        <h4 className="font-headline text-sm font-bold text-neutral-800 dark:text-white">
          Empower Your Modern Publishing Workflow
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Lightning-fast Edge delivery powered by Cloudflare Pages & Supabase PostgreSQL.
        </p>
        <div className="pt-2">
          <Link
            href="/about-us"
            className="inline-block text-xs font-semibold px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xs transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* 3. Featured Editorial Authors / Columnists */}
      {authors && authors.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-5 shadow-xs">
          <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-white pb-2 mb-4">
            <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-600" />
              <span>Editorial Authors</span>
            </h3>
          </div>

          <div className="space-y-4">
            {authors.map((author) => (
              <div key={author.id} className="flex items-center gap-3 group">
                <div className="w-11 h-11 shrink-0 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                  {author.avatar_url ? (
                    <img
                      src={author.avatar_url}
                      alt={author.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                      {author.full_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/author/${author.username}`}
                    className="font-headline text-xs font-bold text-neutral-900 dark:text-white group-hover:text-brand-600 transition block truncate"
                  >
                    {author.full_name}
                  </Link>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 capitalize truncate">
                    {author.role === 'admin' ? 'Editor-in-Chief' : 'Staff Writer'}
                  </p>
                </div>

                <Link
                  href={`/author/${author.username}`}
                  aria-label={`View articles by ${author.full_name}`}
                  className="p-1.5 text-neutral-400 group-hover:text-brand-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Newsletter Subscription Box */}
      <div className="bg-neutral-900 text-white rounded-xs p-6 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Mail className="w-24 h-24" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1.5 text-brand-500 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Dispatch</span>
          </div>
          <h4 className="font-headline text-base font-bold">
            Get Morning Headlines in Your Inbox
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Join 45,000+ readers. Curated investigative journalism, tech breakdowns, and global analysis every morning.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium py-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address..."
                className="w-full px-3.5 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
              >
                <span>Subscribe Now</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
}
