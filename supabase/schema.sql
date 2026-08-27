-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR MODERN NEWSPAPER / MAGAZINE CMS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'author', 'subscriber');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'published', 'scheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE comment_status AS ENUM ('approved', 'pending', 'spam');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'subscriber'::user_role NOT NULL,
    social_links JSONB DEFAULT '{"twitter": "", "facebook": "", "linkedin": "", "website": ""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#e11d48',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status post_status DEFAULT 'draft'::post_status NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_breaking BOOLEAN DEFAULT false NOT NULL,
    is_trending BOOLEAN DEFAULT false NOT NULL,
    views_count BIGINT DEFAULT 0 NOT NULL,
    reading_time_min INT DEFAULT 3 NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. POST_TAGS RELATION TABLE
CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 8. PAGES TABLE (For static pages: About, Privacy, Terms)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status comment_status DEFAULT 'approved'::comment_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. HELPER FUNCTIONS & TRIGGERS

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to safely increment post view counter
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.posts
    SET views_count = views_count + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role user_role := 'subscriber'::user_role;
    user_count INT;
    gen_username TEXT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM public.profiles;
    -- Make the very first registered user an Admin!
    IF user_count = 0 THEN
        default_role := 'admin'::user_role;
    END IF;

    gen_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 4)
    );

    INSERT INTO public.profiles (id, username, full_name, email, role, avatar_url)
    VALUES (
        NEW.id,
        gen_username,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        default_role,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is author or admin
CREATE OR REPLACE FUNCTION is_author_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'author' OR role = 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full control on profiles" ON public.profiles
    FOR ALL USING (is_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (is_admin());

-- TAGS POLICIES
CREATE POLICY "Tags are viewable by everyone" ON public.tags
    FOR SELECT USING (true);

CREATE POLICY "Authors and Admins can manage tags" ON public.tags
    FOR ALL USING (is_author_or_admin());

-- POSTS POLICIES
CREATE POLICY "Published posts are viewable by everyone" ON public.posts
    FOR SELECT USING (
        status = 'published' AND published_at <= NOW()
        OR auth.uid() = author_id
        OR is_admin()
    );

CREATE POLICY "Authors can insert posts" ON public.posts
    FOR INSERT WITH CHECK (
        is_author_or_admin() AND auth.uid() = author_id
    );

CREATE POLICY "Authors can update own posts or Admin any post" ON public.posts
    FOR UPDATE USING (
        (auth.uid() = author_id AND is_author_or_admin()) OR is_admin()
    );

CREATE POLICY "Authors can delete own posts or Admin any post" ON public.posts
    FOR DELETE USING (
        (auth.uid() = author_id AND is_author_or_admin()) OR is_admin()
    );

-- POST_TAGS POLICIES
CREATE POLICY "Post tags are viewable by everyone" ON public.post_tags
    FOR SELECT USING (true);

CREATE POLICY "Authors and Admins can manage post tags" ON public.post_tags
    FOR ALL USING (is_author_or_admin());

-- PAGES POLICIES
CREATE POLICY "Published pages are viewable by everyone" ON public.pages
    FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Admins can manage pages" ON public.pages
    FOR ALL USING (is_admin());

-- COMMENTS POLICIES
CREATE POLICY "Approved comments are viewable by everyone" ON public.comments
    FOR SELECT USING (status = 'approved' OR is_admin());

CREATE POLICY "Anyone can submit a comment" ON public.comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage comments" ON public.comments
    FOR ALL USING (is_admin());

-- CONTACT SUBMISSIONS POLICIES
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view and delete submissions" ON public.contact_submissions
    FOR ALL USING (is_admin());

-- SITE SETTINGS POLICIES
CREATE POLICY "Settings are viewable by everyone" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can update settings" ON public.site_settings
    FOR ALL USING (is_admin());

-- ==============================================================================
-- 14. STORAGE BUCKET SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Media images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update and delete their own uploads" ON storage.objects
    FOR UPDATE USING (bucket_id = 'media' AND auth.uid() = owner);

CREATE POLICY "Admins can delete any media" ON storage.objects
    FOR DELETE USING (bucket_id = 'media' AND (auth.uid() = owner OR is_admin()));

-- ==============================================================================
-- 15. SEED DATA (Default Settings, Categories, Pages, Demo Articles)
-- ==============================================================================

-- Site Settings Seed
INSERT INTO public.site_settings (key, value) VALUES
('general', '{
    "site_title": "The Daily Chronicle",
    "tagline": "Truth, Independence & Modern Journalism",
    "logo_text": "CHRONICLE",
    "footer_about": "The Daily Chronicle is a premier digital news magazine bringing you breaking news, in-depth investigative reports, technology updates, and cultural insights from around the globe.",
    "permalink_structure": "/news/%slug%",
    "enable_comments": true,
    "copyright_text": "© 2026 The Daily Chronicle. All rights reserved."
}'::jsonb),
('social', '{
    "facebook": "https://facebook.com",
    "twitter": "https://twitter.com",
    "youtube": "https://youtube.com",
    "instagram": "https://instagram.com",
    "linkedin": "https://linkedin.com"
}'::jsonb),
('appearance', '{
    "primary_color": "#e11d48",
    "enable_trending_ticker": true,
    "hero_style": "newspaper_5_grid",
    "breaking_news_text": "BREAKING"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Categories Seed
INSERT INTO public.categories (id, name, slug, description, color, order_index) VALUES
('11111111-1111-1111-1111-111111111101', 'Politics', 'politics', 'National & International Politics, Governance, and Policy analysis.', '#dc2626', 1),
('11111111-1111-1111-1111-111111111102', 'Technology', 'technology', 'AI, Startups, Gadgets, Cyber Security & Science innovations.', '#2563eb', 2),
('11111111-1111-1111-1111-111111111103', 'Business', 'business', 'Stock markets, Global Economy, Trade, Finance & Crypto updates.', '#059669', 3),
('11111111-1111-1111-1111-111111111104', 'Sports', 'sports', 'Football, Cricket, Tennis, Olympics, and Tournament coverage.', '#d97706', 4),
('11111111-1111-1111-1111-111111111105', 'Lifestyle', 'lifestyle', 'Health, Travel, Food, Fashion, and Modern Living.', '#9333ea', 5),
('11111111-1111-1111-1111-111111111106', 'Entertainment', 'entertainment', 'Cinema, Music, Celebrity, Arts, and Pop Culture.', '#db2777', 6)
ON CONFLICT (slug) DO NOTHING;

-- Tags Seed
INSERT INTO public.tags (id, name, slug) VALUES
('22222222-2222-2222-2222-222222222201', 'Artificial Intelligence', 'artificial-intelligence'),
('22222222-2222-2222-2222-222222222202', 'Global Summit', 'global-summit'),
('22222222-2222-2222-2222-222222222203', 'World Cup', 'world-cup'),
('22222222-2222-2222-2222-222222222204', 'Innovation', 'innovation'),
('22222222-2222-2222-2222-222222222205', 'Economy 2026', 'economy-2026')
ON CONFLICT (slug) DO NOTHING;

-- Pages Seed
INSERT INTO public.pages (title, slug, content, is_published) VALUES
('About Us', 'about-us', '## About The Daily Chronicle\n\nFounded with a vision to deliver unbiased, rapid, and insightful journalism, **The Daily Chronicle** is an independent media platform operated by top tier investigative journalists and digital storytellers.\n\n### Our Editorial Mission\n- **Truth & Accuracy:** Rigorous fact-checking before publishing.\n- **Independence:** Free from corporate and political pressures.\n- **Innovation:** Modern multimedia reporting and interactive data visualization.', true),
('Privacy Policy', 'privacy-policy', '## Privacy Policy\n\nWe value your privacy. This policy explains how we collect and protect personal information when you visit our website.\n\n### Data Collection\nWe only collect information necessary to improve your reading experience, such as analytics, newsletter subscription data, and contact form inquiries. We never sell your personal data to third parties.', true),
('Terms of Service', 'terms-of-service', '## Terms of Service\n\nBy accessing and using this website, you agree to comply with and be bound by the following terms and conditions. All content is protected by international copyright laws.', true)
ON CONFLICT (slug) DO NOTHING;
