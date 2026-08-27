# Modern Newspaper CMS (WordPress Alternative)
**Stack: Next.js (App Router) + Tailwind CSS + Supabase (PostgreSQL, Auth, Storage, RLS) + Cloudflare Pages & Turnstile**

An enterprise-ready, blazing-fast digital newspaper portal and headless CMS inspired by the aesthetic of **Newspaper / Newsmag** themes and the editorial workflow of **WordPress**.

---

## Features

### 1. Digital Newspaper Portal (Public Front-end)
- **Breaking News & Trending Ticker:** Live date, auto-cycling hot/trending ticker badge, next/prev controls.
- **Iconic Newspaper Hero 5-Grid:** 1 Major Lead Feature story + 4 sub-featured grid stories with category ribbons and metadata overlays.
- **Color-Coded News Desks:** Politics, Technology, Business, Sports, Lifestyle, Entertainment sections.
- **Dynamic Magazine Sidebar:**
  - Most Read / Popular Stories with ranked numeric badges (1 to 5).
  - Editorial Columnists & Staff Writers spotlight with instant profile links.
  - Sponsored content / Ad placement slots.
  - Daily Dispatch newsletter subscription card.
- **Single Article Template (`/news/[slug]`):**
  - High-impact editorial headline, excerpt lead, reading time, view counter.
  - Byline with author avatar, role, and publication timestamp.
  - One-click social sharing (Facebook, X, LinkedIn, WhatsApp, Copy Link).
  - Rich typography markdown body support (`##`, `###`, blockquotes, code blocks).
  - Author bio box, related stories, and comments section protected by **Cloudflare Turnstile**.
- **Multi-Author Profiles (`/author/[username]`):**
  - Author hero card with cover, avatar, bio, social profiles, total article count, and total views.
  - Filtered grid of all published stories by the author.
- **Category & Tag Archives (`/category/[slug]`, `/tag/[slug]`):**
  - Dynamic desk banners with color accents and paginated news grid.
- **Editorial Contact Desk (`/contact`):**
  - Clean office details, whistleblower tips box, and contact form integrated with **Cloudflare Turnstile** bot protection.

---

### 2. WordPress-like Admin Dashboard & CMS (`/admin`)
- **Dashboard Overview:** Real-time metrics (Total stories, total reads, active desks, registered authors) and recent publications.
- **Post Management (`/admin/posts`):** WordPress-style table with filter tabs (*All*, *Published*, *Draft*), desk dropdown, search bar, quick edit, and trash.
- **Full Story Editor (`/admin/posts/new` & `/admin/posts/[id]/edit`):**
  - Big headline editor, automatic or custom slug permalink (`/news/custom-slug`).
  - Quick Markdown toolbar (H2, H3, Bold, Italic, Quotes, Lists, Code).
  - Right Inspector Box:
    - Publish Status (Published, Draft, Scheduled).
    - Author assignment dropdown.
    - Hero 5-Grid, Breaking Ticker, and Trending toggles.
    - Desk / Category selector.
    - Featured Image URL and live preview.
    - SEO & Social Meta (Custom Meta Title, Meta Description).
- **Categories & Desks Manager (`/admin/categories`):** Classic WordPress 2-column layout to create and manage categories with custom color pickers and slugs.
- **Static Pages Manager (`/admin/pages`):** Manage About Us, Privacy Policy, Terms of Service, etc.
- **Users & Roles Manager (`/admin/users`):**
  - Role capabilities: **Admin**, **Author**, **Subscriber**.
  - Role promotion/demotion dropdown.
- **Site Settings & Permalinks (`/admin/settings`):**
  - Publication name, tagline, masthead logo text, footer description.
  - Permalink structure selection (`/news/%slug%` vs `/%category%/%slug%`).
  - Cloudflare Turnstile keys configuration.

---

## 3-Step Quick Start

### Step 1: Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the Public Newspaper, or [http://localhost:3000/admin](http://localhost:3000/admin) for the WordPress-like CMS Dashboard.

---

### Step 2: Supabase Setup (Database, Auth, Storage, RLS)
1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, paste the entire SQL code, and click **Run**.
4. Copy your **Project URL**, **Anon Key**, and **Service Role Key** from *Project Settings -> API*.
5. Create a `.env.local` file in your root folder:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your-turnstile-site-key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

---

### Step 3: Cloudflare Turnstile (Bot Protection)
1. Go to your **Cloudflare Dashboard** -> **Turnstile**.
2. Click **Add Site**, enter your domain name or `localhost`, and select **Managed**.
3. Copy the **Site Key** into `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` and **Secret Key** into `CLOUDFLARE_TURNSTILE_SECRET_KEY`.

---

### Step 4: Git + Cloudflare Pages Deployment
1. Initialize Git and commit:
```bash
git init
git add .
git commit -m "Initial commit of Modern Newspaper CMS"
```
2. Push your repository to **GitHub** / **GitLab**.
3. In Cloudflare Dashboard:
   - Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
   - Select your repository.
   - Set Framework preset: **Next.js**.
   - Build command: `npx @cloudflare/next-on-pages` (or `npm run build`).
   - Build output directory: `.vercel/output/static` (or `.next`).
   - Add your Environment variables in Cloudflare Pages settings.
   - Click **Save and Deploy**!

---

## File Structure

```
newspaper-cms/
├── app/
│   ├── (public)/                 # Public Magazine Pages
│   │   ├── layout.tsx            # Header, Breaking News Ticker, Footer
│   │   ├── page.tsx              # Newspaper Hero 5-Grid + Category Blocks
│   │   ├── news/[slug]/page.tsx  # Single Story Template
│   │   ├── author/[username]/    # Multi-Author Profile Template
│   │   ├── category/[slug]/      # Category Archive
│   │   ├── tag/[slug]/           # Tag Archive
│   │   ├── contact/page.tsx      # Contact with Cloudflare Turnstile
│   │   ├── [slug]/page.tsx       # Static Custom Pages
│   │   └── search/page.tsx       # Search Results
│   ├── (auth)/                   # Authentication
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/                    # WordPress-like Admin CMS
│   │   ├── layout.tsx            # Admin Shell with Dark Sidebar
│   │   ├── page.tsx              # Analytics & Metrics Overview
│   │   ├── posts/                # Posts Table & Editor
│   │   ├── categories/           # Categories & Desks
│   │   ├── pages/                # Static Pages
│   │   ├── users/                # Role Manager
│   │   └── settings/             # Permalinks & Keys
│   ├── api/                      # API Endpoints
│   │   ├── contact/route.ts      # Turnstile Validation & Form Submissions
│   │   └── views/route.ts        # Post View Counter RPC
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── public/                   # Header, TrendingBar, HeroGrid, SidebarWidgets, SocialShare, TurnstileWidget, Footer
│   └── admin/                    # AdminSidebar, AdminHeader, PostEditor
├── lib/
│   ├── data.ts                   # Unified Supabase + Mock Data Fetcher
│   ├── mock-data.ts              # Rich Fallback Articles & Authors
│   ├── turnstile.ts              # Server-side Turnstile Validator
│   ├── types.ts                  # TypeScript Models
│   ├── utils.ts                  # Slugify, Reading Time & Date helpers
│   └── supabase/                 # Supabase Browser, Server & Middleware Clients
├── supabase/
│   └── schema.sql                # Complete DB Tables, RLS, Triggers & Seed Data
├── wrangler.toml                 # Cloudflare Pages config
└── package.json
```
