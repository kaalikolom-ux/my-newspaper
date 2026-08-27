import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Twitter, Facebook, Linkedin, Globe, Mail, FileText, Eye, Clock, ArrowLeft } from 'lucide-react';
import { getAuthorByUsername, getPopularPosts, getPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import SidebarWidgets from '@/components/public/SidebarWidgets';

export const runtime = 'edge';

interface AuthorPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = await getAuthorByUsername(params.username);
  if (!author) {
    return { title: 'Author Not Found' };
  }
  return {
    title: `${author.full_name} - Editorial Profile`,
    description: author.bio || undefined,
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const author = await getAuthorByUsername(params.username);
  if (!author) {
    notFound();
  }

  const [authorPosts, popularPosts] = await Promise.all([
    getPosts({ authorUsername: author.username }),
    getPopularPosts(5),
  ]);

  const totalViews = authorPosts.reduce((acc, p) => acc + p.views_count, 0);

  return (
    <div className="space-y-8">
      {/* 1. Author Profile Hero Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans mb-6">
          <Link href="/" className="hover:text-brand-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>Authors</span>
          <span>/</span>
          <span className="font-semibold text-neutral-900 dark:text-white">{author.full_name}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-full overflow-hidden border-4 border-brand-600 bg-neutral-200 shadow-md">
            {author.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={author.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-neutral-500">
                {author.full_name.charAt(0)}
              </div>
            )}
          </div>

          {/* Author Information */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-600">
                {author.role === 'admin' ? 'Senior Editorial Board' : 'Contributing Author'}
              </span>
              <h1 className="font-headline text-2xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                {author.full_name}
              </h1>
              <p className="text-xs text-neutral-500 font-sans">@{author.username}</p>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-serif leading-relaxed max-w-3xl">
              {author.bio || 'Journalist, essayist, and analytical contributor for The Daily Chronicle.'}
            </p>

            {/* Author Metrics */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs text-neutral-600 dark:text-neutral-400 font-sans border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5 font-semibold">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>{authorPosts.length} Articles Published</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <Eye className="w-4 h-4 text-brand-600" />
                <span>{totalViews.toLocaleString()} Total Reads</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              {author.social_links?.twitter && (
                <a
                  href={author.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-black hover:text-white rounded-full transition"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.social_links?.facebook && (
                <a
                  href={author.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-[#1877f2] hover:text-white rounded-full transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {author.social_links?.linkedin && (
                <a
                  href={author.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-[#0a66c2] hover:text-white rounded-full transition"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {author.social_links?.website && (
                <a
                  href={author.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-600 hover:text-white rounded-full transition"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Author Articles Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b-2 border-brand-600 pb-2">
            <h2 className="font-headline text-lg font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Published Stories by {author.full_name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden group flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                    {post.category && (
                      <div className="absolute top-2 left-2">
                        <span
                          className="category-ribbon text-[10px]"
                          style={{ backgroundColor: post.category.color || '#e11d48' }}
                        >
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-headline text-base font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-brand-600 transition">
                      <Link href={`/news/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 font-sans">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <SidebarWidgets popularPosts={popularPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
