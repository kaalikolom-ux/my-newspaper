import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Eye, ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, getPopularPosts, getPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import SidebarWidgets from '@/components/public/SidebarWidgets';

export const runtime = 'edge';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} - Latest News & Updates`,
    description: category.description || `Browse the latest news in ${category.name}`,
  };
}

export default async function CategoryArchivePage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const [categoryPosts, popularPosts] = await Promise.all([
    getPosts({ categorySlug: category.slug }),
    getPopularPosts(5),
  ]);

  return (
    <div className="space-y-8">
      {/* Category Header Banner */}
      <div
        className="p-6 md:p-8 rounded-xs text-white shadow-xs"
        style={{ backgroundColor: category.color || '#e11d48' }}
      >
        <div className="flex items-center gap-2 text-xs text-white/80 font-sans mb-3">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>Category Archive</span>
        </div>

        <h1 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tight">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-white/90 text-sm md:text-base font-serif mt-2 max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryPosts.map((post) => (
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
