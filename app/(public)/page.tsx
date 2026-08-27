import React from 'react';
import { getAuthors, getCategories, getPopularPosts, getPosts } from '@/lib/data';
import HeroGrid from '@/components/public/HeroGrid';
import CategorySection from '@/components/public/CategorySection';
import SidebarWidgets from '@/components/public/SidebarWidgets';
export const runtime = 'edge';

export default async function HomePage() {
  const [allPosts, categories, popularPosts, authors] = await Promise.all([
    getPosts({ limit: 12 }),
    getCategories(),
    getPopularPosts(5),
    getAuthors(),
  ]);

  // Featured stories for the 5-Grid Hero
  const heroPosts = allPosts.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* 1. Newspaper 5-Grid Hero Section */}
      <HeroGrid posts={heroPosts} />

      {/* 2. Main Magazine Grid (2 Columns: Category Blocks + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Category-wise Story Blocks (8 Cols) */}
        <div className="lg:col-span-8 space-y-10">
          {categories.map((category) => {
            const categoryPosts = allPosts.filter(
              (p) => p.category_id === category.id || p.category?.slug === category.slug
            );
            // If no exact match in the small slice, give a fallback slice so categories look populated
            const displayedPosts = categoryPosts.length > 0 ? categoryPosts : allPosts.slice(0, 4);

            return (
              <CategorySection
                key={category.id}
                category={category}
                posts={displayedPosts}
              />
            );
          })}
        </div>

        {/* Right: Sidebar Widgets (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <SidebarWidgets popularPosts={popularPosts} authors={authors} />
          </div>
        </div>
      </div>
    </div>
  );
}
