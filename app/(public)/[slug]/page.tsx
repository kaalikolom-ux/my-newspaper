import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, FileText } from 'lucide-react';
import { getPageBySlug, getPopularPosts } from '@/lib/data';
import SidebarWidgets from '@/components/public/SidebarWidgets';

export const runtime = 'edge';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: 'Page Not Found' };
  return {
    title: page.title,
  };
}

export default async function StaticCustomPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  const popularPosts = await getPopularPosts(5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <article className="lg:col-span-8 space-y-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-6 md:p-10 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans">
          <Link href="/" className="hover:text-brand-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900 dark:text-white">{page.title}</span>
        </div>

        <div className="border-b-2 border-brand-600 pb-4">
          <div className="flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-widest">
            <FileText className="w-4 h-4" />
            <span>Editorial Page</span>
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mt-1">
            {page.title}
          </h1>
        </div>

        <div className="prose prose-neutral lg:prose-lg dark:prose-invert max-w-none font-serif leading-relaxed space-y-4 pt-2">
          {page.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="font-headline font-bold text-2xl text-neutral-900 dark:text-white mt-6 mb-3">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-headline font-bold text-xl text-neutral-900 dark:text-white mt-5 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <li key={idx} className="text-neutral-700 dark:text-neutral-300">
                  {paragraph.replace('- ', '')}
                </li>
              );
            }
            return (
              <p key={idx} className="text-neutral-800 dark:text-neutral-200">
                {paragraph}
              </p>
            );
          })}
        </div>
      </article>

      <div className="lg:col-span-4">
        <div className="sticky top-20">
          <SidebarWidgets popularPosts={popularPosts} />
        </div>
      </div>
    </div>
  );
}
