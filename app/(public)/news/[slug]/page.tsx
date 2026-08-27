import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Eye, User, ArrowLeft, Tag as TagIcon, MessageCircle } from 'lucide-react';
import { getPopularPosts, getPostBySlug, getPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import SocialShare from '@/components/public/SocialShare';
import SidebarWidgets from '@/components/public/SidebarWidgets';
import TurnstileWidget from '@/components/public/TurnstileWidget';

export const runtime = 'edge';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function SinglePostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const [allPosts, popularPosts] = await Promise.all([
    getPosts({ limit: 6 }),
    getPopularPosts(5),
  ]);

  // Related posts from same category or fallback
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category_id === post.category_id || true))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Article Column (8 Cols) */}
      <article className="lg:col-span-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans">
          <Link href="/" className="hover:text-brand-600 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          {post.category && (
            <>
              <Link
                href={`/category/${post.category.slug}`}
                className="hover:text-brand-600 font-semibold"
              >
                {post.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="truncate max-w-[200px] sm:max-w-xs text-neutral-400">{post.title}</span>
        </div>

        {/* Category Ribbon */}
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="category-ribbon text-xs inline-block shadow-xs"
            style={{ backgroundColor: post.category.color || '#e11d48' }}
          >
            {post.category.name}
          </Link>
        )}

        {/* Headline */}
        <h1 className="font-headline text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-white leading-[1.18] tracking-tight">
          {post.title}
        </h1>

        {/* Excerpt / Lead Intro */}
        {post.excerpt && (
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-serif leading-relaxed border-l-4 border-brand-600 pl-4 py-1 italic">
            {post.excerpt}
          </p>
        )}

        {/* Byline Bar (Author, Date, Reading time, Views) */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
          <div className="flex items-center gap-3">
            {post.author && (
              <Link
                href={`/author/${post.author.username}`}
                className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white hover:text-brand-600"
              >
                {post.author.avatar_url ? (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-300"
                  />
                ) : (
                  <User className="w-5 h-5 text-neutral-400" />
                )}
                <div>
                  <span className="block">{post.author.full_name}</span>
                  <span className="text-[10px] text-neutral-400 font-normal uppercase">
                    {post.author.role === 'admin' ? 'Senior Editor' : 'Staff Reporter'}
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <span>•</span>
            <div>{post.reading_time_min} min read</div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.views_count.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Top Social Share */}
        <SocialShare title={post.title} />

        {/* Featured Image */}
        {post.featured_image && (
          <div className="space-y-2">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-800">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-neutral-400 font-sans italic text-right">
              Photo / Illustration: The Daily Chronicle Archives
            </p>
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-neutral lg:prose-lg dark:prose-invert max-w-none font-serif leading-relaxed space-y-4 pt-2">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="font-headline font-bold text-2xl text-neutral-900 dark:text-white mt-6 mb-3">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="font-headline font-bold text-xl text-neutral-900 dark:text-white mt-5 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-brand-600 pl-4 py-2 my-4 text-neutral-700 dark:text-neutral-300 italic font-serif bg-neutral-100/60 dark:bg-neutral-800/40 rounded-r-xs"
                >
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            return (
              <p key={index} className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg leading-[1.8]">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-500 mr-2">
              <TagIcon className="w-3.5 h-3.5" />
              <span>Tags:</span>
            </div>
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-50 dark:hover:bg-neutral-700 hover:text-brand-600 text-neutral-700 dark:text-neutral-300 rounded-xs text-xs font-medium transition"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        {post.author && (
          <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 mt-8">
            <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden border-2 border-brand-600 bg-neutral-200">
              {post.author.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-neutral-500">
                  {post.author.full_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-600">Written by</span>
                  <h3 className="font-headline text-lg font-bold text-neutral-900 dark:text-white">
                    <Link href={`/author/${post.author.username}`} className="hover:underline">
                      {post.author.full_name}
                    </Link>
                  </h3>
                </div>
                <Link
                  href={`/author/${post.author.username}`}
                  className="text-xs font-semibold px-3 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs hover:border-brand-600 transition"
                >
                  View All Stories →
                </Link>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                {post.author.bio || 'Staff journalist at The Daily Chronicle.'}
              </p>
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="font-headline text-lg font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b-2 border-brand-600 pb-2">
              Related Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rPost) => (
                <div key={rPost.id} className="group space-y-2">
                  <div className="relative aspect-video overflow-hidden rounded-xs bg-neutral-200 dark:bg-neutral-800">
                    {rPost.featured_image && (
                      <img
                        src={rPost.featured_image}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                  </div>
                  <h4 className="font-headline text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-brand-600 transition">
                    <Link href={`/news/${rPost.slug}`}>
                      {rPost.title}
                    </Link>
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-sans block">
                    {formatDate(rPost.published_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section with Cloudflare Turnstile */}
        <div className="pt-10 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-brand-600" />
            <h3 className="font-headline text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Discussion & Reader Comments
            </h3>
          </div>

          <form className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                Your Comment
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share your thoughts on this story..."
                className="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Cloudflare Turnstile Protection */}
            <TurnstileWidget onVerify={() => {}} />

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
            >
              Submit Comment
            </button>
          </form>
        </div>
      </article>

      {/* Sidebar (4 Cols) */}
      <aside className="lg:col-span-4">
        <div className="sticky top-20">
          <SidebarWidgets popularPosts={popularPosts} />
        </div>
      </aside>
    </div>
  );
}
