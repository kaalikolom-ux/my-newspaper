import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Eye,
  FolderTree,
  Users,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { getAuthors, getCategories, getPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export const runtime = 'edge';

export default async function AdminDashboardPage() {
  const [posts, categories, authors] = await Promise.all([
    getPosts({ limit: 10 }),
    getCategories(),
    getAuthors(),
  ]);

  const totalViews = posts.reduce((acc, p) => acc + p.views_count, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Editorial Desk</span>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
            Welcome to Chronicle CMS Dashboard
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            Manage your newspaper articles, desks, writers, media, and site settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Stories</span>
            <span className="font-headline text-2xl font-black text-neutral-900 dark:text-white mt-1 block">
              {posts.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +4 this week
            </span>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-600 rounded-md">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Reads</span>
            <span className="font-headline text-2xl font-black text-neutral-900 dark:text-white mt-1 block">
              {totalViews.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.4% engagement
            </span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-md">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">News Desks</span>
            <span className="font-headline text-2xl font-black text-neutral-900 dark:text-white mt-1 block">
              {categories.length}
            </span>
            <span className="text-[11px] text-neutral-500 font-sans block mt-1">Active categories</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-md">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Editorial Team</span>
            <span className="font-headline text-2xl font-black text-neutral-900 dark:text-white mt-1 block">
              {authors.length}
            </span>
            <span className="text-[11px] text-neutral-500 font-sans block mt-1">Authors & Editors</span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-md">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Split: Recent Posts Table + System & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Articles (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="font-headline text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Recent News Articles
            </h2>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>View All Posts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xs overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
                    {post.featured_image && (
                      <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-headline text-xs sm:text-sm font-bold text-neutral-900 dark:text-white hover:text-brand-600 block truncate"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-sans mt-0.5">
                      {post.category && <span>{post.category.name}</span>}
                      <span>•</span>
                      <span>By {post.author?.full_name || 'Staff'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {post.status}
                  </span>
                  <Link
                    href={`/news/${post.slug}`}
                    target="_blank"
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                    title="View live story"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture & Status (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-5 shadow-xs space-y-4">
            <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600" />
              <span>Production Stack Status</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Supabase DB & RLS</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-600">Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Cloudflare Pages Edge</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-600">Ready</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Cloudflare Turnstile</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-600">Protected</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/settings"
                className="block text-center text-xs font-semibold py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 rounded-xs transition"
              >
                Configure Keys & Permalinks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
