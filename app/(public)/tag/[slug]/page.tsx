import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Eye, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { getPopularPosts, getPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import SidebarWidgets from '@/components/public/SidebarWidgets';

export const runtime = 'edge';

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tagName = params.slug.replace(/-/g, ' ');
  return {
    title: `Stories tagged #${tagName}`,
  };
}

export default async function TagArchivePage({ params }: TagPageProps) {
  const tagName = params.slug.replace(/-/g, ' ');
  const [allPosts, popularPosts] = await Promise.all([
    getPosts(),
    getPopularPosts(5),
  ]);

  const tagPosts = allPosts.filter((p) =>
    p.tags?.some((t) => t.slug === params.slug || t.name.toLowerCase() === tagName.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-neutral-900 text-white p-6 md:p-8 rounded-xs shadow-xs">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-sans mb-3">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>Topic Tag</span>
        </div>

        <div className="flex items-center gap-2 text-brand-500 font-bold uppercase text-xs">
          <TagIcon className="w-4 h-4" />
          <span>Topic Archive</span>
        </div>

        <h1 className="font-headline text-3xl md:text-5xl font-black capitalize mt-1">
          #{tagName}
        </h1>
        <p className="text-neutral-400 text-xs font-sans mt-2">
          Browsing all published stories and analyses tagged with #{tagName}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(tagPosts.length > 0 ? tagPosts : allPosts.slice(0, 4)).map((post) => (
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
