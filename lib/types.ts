export type UserRole = 'admin' | 'author' | 'subscriber';
export type PostStatus = 'draft' | 'published' | 'scheduled';
export type CommentStatus = 'approved' | 'pending' | 'spam';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  bio?: string | null;
  role: UserRole;
  social_links?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string;
  order_index?: number;
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  category_id?: string | null;
  author_id?: string | null;
  status: PostStatus;
  is_featured: boolean;
  is_breaking: boolean;
  is_trending: boolean;
  views_count: number;
  reading_time_min: number;
  meta_title?: string | null;
  meta_description?: string | null;
  published_at: string;
  created_at: string;
  updated_at?: string;
  // Joined fields
  category?: Category | null;
  author?: Profile | null;
  tags?: Tag[];
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CommentItem {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: CommentStatus;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  general: {
    site_title: string;
    tagline: string;
    logo_text: string;
    footer_about: string;
    permalink_structure: string;
    enable_comments: boolean;
    copyright_text: string;
  };
  social: {
    facebook: string;
    twitter: string;
    youtube: string;
    instagram: string;
    linkedin: string;
  };
  appearance: {
    primary_color: string;
    enable_trending_ticker: boolean;
    hero_style: string;
    breaking_news_text: string;
  };
}
