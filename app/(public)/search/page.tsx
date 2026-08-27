import React from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Clock, Eye, ArrowLeft } from 'lucide-react';
import { getPopularPosts, getPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import SidebarWidgets from '@/components/public/SidebarWidgets';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const [matchingPosts, popularPosts] = await Promise.all([
    getPosts({ searchQuery: query }),
    getPopularPosts(5),
  ]);

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans mb-4">
          <Link href="/" className="hover:text-brand-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>Search Archive</span>
        </div>

        <h1 className="font-headline text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <SearchIcon className="w-6 h-6 text-brand-600" />
          <span>Search Results for: &ldquo;{query}&rdquo;</span>
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-2">
          Found {matchingPosts.length} matching story result{matchingPosts.length === 1 ? '' : 's'}.
        </p>

        {/* Re-search Form */}
        <form action="/search" method="GET" className="mt-4 flex max-w-xl gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search another headline, topic or author..."
            className="flex-1 px-4 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {matchingPosts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-8">
              <p className="text-sm text-neutral-500 font-serif">
                No published articles matched your search query. Try different keywords.
              </p>
            </div>
          ) : (
            matchingPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-4 sm:p-5 flex flex-col sm:flex-row gap-4 group hover:border-brand-600 transition shadow-2xs"
              >
                <div className="relative w-full sm:w-48 h-32 shrink-0 overflow-hidden rounded-xs bg-neutral-200 dark:bg-neutral-800">
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

                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1.5">
                    <h3 className="font-headline text-base sm:text-lg font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-brand-600 transition">
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

                  <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-sans pt-1">
                    {post.author && <span>By {post.author.full_name}</span>}
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views_count.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
