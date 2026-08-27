import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Category, Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface CategorySectionProps {
  category: Category;
  posts: Post[];
}

export default function CategorySection({ category, posts }: CategorySectionProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const otherPosts = posts.slice(1, 4);

  return (
    <section className="mb-10">
      {/* Category Section Header Ribbon */}
      <div className="flex items-center justify-between border-b-2 mb-5 pb-1" style={{ borderColor: category.color || '#e11d48' }}>
        <h2
          className="font-headline text-lg md:text-xl font-bold uppercase tracking-wider px-3 py-1 text-white inline-block rounded-xs"
          style={{ backgroundColor: category.color || '#e11d48' }}
        >
          {category.name}
        </h2>
        <Link
          href={`/category/${category.slug}`}
          className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 hover:text-brand-600 flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Big Card for Category */}
        {mainPost && (
          <div className="md:col-span-6 group space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-800">
              {mainPost.featured_image && (
                <img
                  src={mainPost.featured_image}
                  alt={mainPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-headline text-lg md:text-xl font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-brand-600 transition">
                <Link href={`/news/${mainPost.slug}`}>
                  {mainPost.title}
                </Link>
              </h3>

              <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
                {mainPost.author && (
                  <Link href={`/author/${mainPost.author.username}`} className="font-semibold text-neutral-700 dark:text-neutral-300 hover:underline">
                    {mainPost.author.full_name}
                  </Link>
                )}
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(mainPost.published_at)}</span>
                </div>
              </div>

              {mainPost.excerpt && (
                <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm line-clamp-3 leading-relaxed font-sans">
                  {mainPost.excerpt}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Small List Cards on the Right */}
        <div className="md:col-span-6 divide-y divide-neutral-200 dark:divide-neutral-800">
          {otherPosts.map((post) => (
            <div key={post.id} className="py-3 first:pt-0 last:pb-0 flex gap-4 group">
              <div className="relative w-28 sm:w-36 h-20 sm:h-24 shrink-0 overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-800">
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-1.5">
                <h4 className="font-headline text-xs sm:text-sm font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-600 transition">
                  <Link href={`/news/${post.slug}`}>
                    {post.title}
                  </Link>
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-sans">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
