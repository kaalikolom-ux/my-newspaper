import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, User } from 'lucide-react';
import { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface HeroGridProps {
  posts: Post[];
}

export default function HeroGrid({ posts }: HeroGridProps) {
  if (!posts || posts.length === 0) return null;

  const leadPost = posts[0];
  const subPosts = posts.slice(1, 5);

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-3">
        {/* 1. Large Lead Story (Takes 7 cols on desktop) */}
        {leadPost && (
          <div className="lg:col-span-7 relative group overflow-hidden rounded-xs bg-neutral-900 min-h-[380px] md:min-h-[480px] flex flex-col justify-end">
            {leadPost.featured_image && (
              <img
                src={leadPost.featured_image}
                alt={leadPost.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="relative z-10 p-5 md:p-8 space-y-3">
              {leadPost.category && (
                <Link
                  href={`/category/${leadPost.category.slug}`}
                  className="category-ribbon inline-block shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: leadPost.category.color || '#e11d48' }}
                >
                  {leadPost.category.name}
                </Link>
              )}

              <h2 className="font-headline text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight group-hover:text-neutral-200 transition">
                <Link href={`/news/${leadPost.slug}`} className="hover:underline">
                  {leadPost.title}
                </Link>
              </h2>

              {leadPost.excerpt && (
                <p className="text-neutral-300 text-xs md:text-sm line-clamp-2 leading-relaxed font-sans">
                  {leadPost.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-neutral-300 text-xs pt-1 font-sans">
                {leadPost.author && (
                  <Link
                    href={`/author/${leadPost.author.username}`}
                    className="flex items-center gap-1.5 hover:text-white font-medium"
                  >
                    {leadPost.author.avatar_url ? (
                      <img
                        src={leadPost.author.avatar_url}
                        alt={leadPost.author.full_name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                    <span>{leadPost.author.full_name}</span>
                  </Link>
                )}

                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{formatDate(leadPost.published_at)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{leadPost.views_count.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Sub-featured Grid (Takes 5 cols on desktop, 2x2 layout) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
          {subPosts.map((post) => (
            <div
              key={post.id}
              className="relative group overflow-hidden rounded-xs bg-neutral-900 min-h-[190px] md:min-h-[235px] flex flex-col justify-end"
            >
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="relative z-10 p-3.5 md:p-4 space-y-1.5">
                {post.category && (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="category-ribbon text-[10px] inline-block shadow-xs transition hover:opacity-90"
                    style={{ backgroundColor: post.category.color || '#e11d48' }}
                  >
                    {post.category.name}
                  </Link>
                )}

                <h3 className="font-headline text-sm md:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-neutral-200 transition">
                  <Link href={`/news/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-neutral-300 font-sans">
                  <Clock className="w-3 h-3 text-neutral-400" />
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
