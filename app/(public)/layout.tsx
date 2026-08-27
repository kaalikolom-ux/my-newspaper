import React from 'react';
import { getBreakingNews, getCategories, getSiteSettings } from '@/lib/data';
import TrendingBar from '@/components/public/TrendingBar';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export const runtime = 'edge';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings, breakingPosts] = await Promise.all([
    getCategories(),
    getSiteSettings(),
    getBreakingNews(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Top Trending/Breaking News Ticker */}
      {settings.appearance.enable_trending_ticker && (
        <TrendingBar
          posts={breakingPosts}
          breakingText={settings.appearance.breaking_news_text || 'TRENDING'}
        />
      )}

      {/* 2. Masthead and Main Navigation */}
      <Header categories={categories} settings={settings} />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* 4. Footer */}
      <Footer categories={categories} settings={settings} />
    </div>
  );
}
