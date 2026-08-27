import { MOCK_AUTHORS, MOCK_CATEGORIES, MOCK_PAGES, MOCK_POSTS, MOCK_SITE_SETTINGS, MOCK_TAGS } from "./mock-data";
import { Category, PageItem, Post, Profile, SiteSettings, Tag } from "./types";
import { createServerSupabaseClient } from "./supabase/server";

function hasValidSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes('placeholder') && !key.includes('placeholder') && url.startsWith('http'));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (hasValidSupabaseConfig()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
        return {
          general: { ...MOCK_SITE_SETTINGS.general, ...(settingsMap['general'] || {}) },
          social: { ...MOCK_SITE_SETTINGS.social, ...(settingsMap['social'] || {}) },
          appearance: { ...MOCK_SITE_SETTINGS.appearance, ...(settingsMap['appearance'] || {}) },
        };
      }
    } catch {
      // Fall back to defaults
    }
  }
  return MOCK_SITE_SETTINGS;
}

export async function getCategories(): Promise<Category[]> {
  if (hasValidSupabaseConfig()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fall back
    }
  }
  return MOCK_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug) || null;
}

export async function getAuthors(): Promise<Profile[]> {
  if (hasValidSupabaseConfig()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'author']);
      if (!error && data && data.length > 0) {
        return data as Profile[];
      }
    } catch {
      // Fall back
    }
  }
  return MOCK_AUTHORS;
}

export async function getAuthorByUsername(username: string): Promise<Profile | null> {
  const authors = await getAuthors();
  return authors.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function getPosts(params?: {
  categorySlug?: string;
  tagSlug?: string;
  authorUsername?: string;
  onlyFeatured?: boolean;
  onlyTrending?: boolean;
  onlyBreaking?: boolean;
  searchQuery?: string;
  limit?: number;
}): Promise<Post[]> {
  if (hasValidSupabaseConfig()) {
    try {
      const supabase = createServerSupabaseClient();
      let query = supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:profiles(*),
          tags:tags(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (params?.onlyFeatured) query = query.eq('is_featured', true);
      if (params?.onlyTrending) query = query.eq('is_trending', true);
      if (params?.onlyBreaking) query = query.eq('is_breaking', true);
      if (params?.limit) query = query.limit(params.limit);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let filtered = data as Post[];
        if (params?.categorySlug) {
          filtered = filtered.filter(p => p.category?.slug === params.categorySlug);
        }
        if (params?.authorUsername) {
          filtered = filtered.filter(p => p.author?.username.toLowerCase() === params.authorUsername?.toLowerCase());
        }
        if (params?.searchQuery) {
          const q = params.searchQuery.toLowerCase();
          filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
        }
        if (filtered.length > 0) return filtered;
      }
    } catch {
      // Fall back to Mock
    }
  }

  // Filter mock posts
  let result = [...MOCK_POSTS];
  if (params?.categorySlug) {
    result = result.filter(p => p.category?.slug === params.categorySlug);
  }
  if (params?.authorUsername) {
    result = result.filter(p => p.author?.username.toLowerCase() === params.authorUsername?.toLowerCase());
  }
  if (params?.onlyFeatured) {
    result = result.filter(p => p.is_featured);
  }
  if (params?.onlyTrending) {
    result = result.filter(p => p.is_trending);
  }
  if (params?.onlyBreaking) {
    result = result.filter(p => p.is_breaking);
  }
  if (params?.searchQuery) {
    const q = params.searchQuery.toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(q) || (p.excerpt && p.excerpt.toLowerCase().includes(q)) || p.content.toLowerCase().includes(q));
  }
  if (params?.limit) {
    result = result.slice(0, params.limit);
  }

  return result;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (hasValidSupabaseConfig()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:profiles(*),
          tags:tags(*)
        `)
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as Post;
      }
    } catch {
      // Fall back
    }
  }
  return MOCK_POSTS.find(p => p.slug === slug) || null;
}

export async function getPopularPosts(limit: number = 5): Promise<Post[]> {
  const posts = await getPosts();
  return [...posts].sort((a, b) => b.views_count - a.views_count).slice(0, limit);
}

export async function getBreakingNews(): Promise<Post[]> {
  const posts = await getPosts({ onlyBreaking: true });
  if (posts.length > 0) return posts;
  return (await getPosts({ limit: 4 }));
}

export async function getPageBySlug(slug: string): Promise<PageItem | null> {
  if (hasValidSupabaseConfig()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      if (!error && data) {
        return data as PageItem;
      }
    } catch {
      // Fall back
    }
  }
  return MOCK_PAGES.find(p => p.slug === slug) || null;
}
