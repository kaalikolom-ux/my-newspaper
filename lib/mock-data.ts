import { Category, Post, Profile, SiteSettings, Tag, PageItem } from "./types";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Politics",
    slug: "politics",
    description: "National & International Politics, Governance, and Policy analysis.",
    color: "#dc2626", // Red
    order_index: 1,
  },
  {
    id: "cat-2",
    name: "Technology",
    slug: "technology",
    description: "AI, Startups, Gadgets, Cyber Security & Science innovations.",
    color: "#2563eb", // Blue
    order_index: 2,
  },
  {
    id: "cat-3",
    name: "Business",
    slug: "business",
    description: "Stock markets, Global Economy, Trade, Finance & Crypto updates.",
    color: "#059669", // Green
    order_index: 3,
  },
  {
    id: "cat-4",
    name: "Sports",
    slug: "sports",
    description: "Football, Cricket, Tennis, Olympics, and Tournament coverage.",
    color: "#d97706", // Amber
    order_index: 4,
  },
  {
    id: "cat-5",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Health, Travel, Food, Fashion, and Modern Living.",
    color: "#9333ea", // Purple
    order_index: 5,
  },
  {
    id: "cat-6",
    name: "Entertainment",
    slug: "entertainment",
    description: "Cinema, Music, Celebrity, Arts, and Pop Culture.",
    color: "#db2777", // Pink
    order_index: 6,
  }
];

export const MOCK_AUTHORS: Profile[] = [
  {
    id: "usr-admin",
    username: "editor_chief",
    full_name: "Mahmud Hasan",
    email: "editor@chronicle.news",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Editor-in-Chief & Senior Investigative Journalist with 15+ years of reporting on global diplomacy, macroeconomics, and institutional governance.",
    role: "admin",
    social_links: {
      twitter: "https://twitter.com",
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      website: "https://chronicle.news"
    },
    created_at: "2025-01-10T10:00:00Z"
  },
  {
    id: "usr-author-1",
    username: "tanjil_tech",
    full_name: "Tanjil Rahman",
    email: "tanjil@chronicle.news",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Lead Technology Editor covering Artificial Intelligence, quantum computing, cloud platforms, and cyber-security ecosystems.",
    role: "author",
    social_links: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    },
    created_at: "2025-02-14T09:30:00Z"
  },
  {
    id: "usr-author-2",
    username: "sarah_k",
    full_name: "Sarah Kabir",
    email: "sarah@chronicle.news",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bio: "Chief Economics & Lifestyle Correspondent with a focus on sustainable urban living, arts, and culinary cultures.",
    role: "author",
    social_links: {
      twitter: "https://twitter.com",
      facebook: "https://facebook.com"
    },
    created_at: "2025-03-01T11:00:00Z"
  }
];

export const MOCK_TAGS: Tag[] = [
  { id: "tag-1", name: "Artificial Intelligence", slug: "artificial-intelligence" },
  { id: "tag-2", name: "Global Summit", slug: "global-summit" },
  { id: "tag-3", name: "World Cup", slug: "world-cup" },
  { id: "tag-4", name: "Clean Energy", slug: "clean-energy" },
  { id: "tag-5", name: "Economy 2026", slug: "economy-2026" },
  { id: "tag-6", name: "Electric Vehicles", slug: "electric-vehicles" }
];

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    title: "Global Leaders Reach Historic Accord on Clean Energy & Sustainable Infrastructure",
    slug: "global-leaders-reach-historic-accord-clean-energy",
    excerpt: "In a landmark international summit, delegates from 85 countries finalized a binding treaty pledging $1.2 trillion for next-generation renewable grids.",
    content: `## A New Era for Sustainable Development

Delegates from over 85 nations concluded intensive deliberations today by adopting a transformative multilateral framework aimed at modernizing global energy grids. The agreement outlines aggressive timelines for transitioning industrial hubs toward zero-emission energy sources over the next decade.

### Key Milestones in the Accord

1. **Direct Capital Mobilization:** A dedicated $1.2 trillion fund will co-finance grid decarbonization projects across emerging economies.
2. **Standardized Carbon Tracking:** Universal cross-border validation protocols for industrial emissions.
3. **Open Technology Transfer:** Patent pooling for next-gen battery chemistries and solid-state storage.

> "Today's accord proves that when sovereign interests align with climate reality, humanity can make decisive leaps toward a resilient future," stated the summit director during the concluding plenary session.

### Economic and Industrial Implications

Financial markets responded with broad optimism across clean-tech equities. Institutional funds have already signaled reallocation of capital into green infrastructure bonds, anticipating steady yields backed by sovereign debt guarantees.

Experts emphasize that the true test lies in swift national ratification and uninterrupted supply chain coordination across lithium, copper, and rare-earth materials required for grid upgrades.`,
    featured_image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-1",
    author_id: "usr-admin",
    status: "published",
    is_featured: true,
    is_breaking: true,
    is_trending: true,
    views_count: 14820,
    reading_time_min: 4,
    meta_title: "Global Leaders Reach Historic Accord on Clean Energy",
    meta_description: "In a landmark summit, delegates finalized a binding $1.2 trillion treaty for renewable power infrastructure.",
    published_at: "2026-08-27T08:30:00Z",
    created_at: "2026-08-27T08:00:00Z",
    category: MOCK_CATEGORIES[0],
    author: MOCK_AUTHORS[0],
    tags: [MOCK_TAGS[1], MOCK_TAGS[3], MOCK_TAGS[4]]
  },
  {
    id: "post-2",
    title: "Next-Generation Autonomous Systems Transform Real-Time Supply Chain Logistics",
    slug: "next-gen-autonomous-systems-transform-logistics",
    excerpt: "Autonomous freight networks and intelligent routing algorithms have reduced cross-continental shipping latencies by nearly 40%.",
    content: `## The AI Revolution in Global Freight

Intelligent logistics platforms are fundamentally reshaping how physical cargo navigates air, rail, and sea hubs. By combining neural edge processing with real-time predictive meteorological feeds, freight operators have minimized port congestion bottlenecks significantly.

\`\`\`json
{
  "efficiency_gain": "38.5%",
  "fuel_reduction": "21.2%",
  "predictive_accuracy": "99.4%"
}
\`\`\`

### Autonomous Freight Nodes

Automated distribution centers now deploy synchronized robotics capable of offloading, sorting, and dispatching multi-ton containers with zero human intervention in hazardous conditions. Engineers project widespread standardisation across primary maritime routes by late 2027.`,
    featured_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-2",
    author_id: "usr-author-1",
    status: "published",
    is_featured: true,
    is_breaking: false,
    is_trending: true,
    views_count: 9430,
    reading_time_min: 3,
    meta_title: "Autonomous Systems Transform Logistics",
    meta_description: "Real-time AI logistics networks reduce cross-continental shipping latencies by 40%.",
    published_at: "2026-08-26T14:15:00Z",
    created_at: "2026-08-26T13:00:00Z",
    category: MOCK_CATEGORIES[1],
    author: MOCK_AUTHORS[1],
    tags: [MOCK_TAGS[0], MOCK_TAGS[3]]
  },
  {
    id: "post-3",
    title: "Global Financial Markets Rally as Inflation Cools Across Major Economic Zones",
    slug: "global-markets-rally-inflation-cools",
    excerpt: "Benchmark indices soared to unprecedented highs following central bank updates signalling stabilized consumer indices and lower borrowing costs.",
    content: `## Bullish Momentum Across Equities

Major financial hubs in New York, London, and Tokyo recorded historic single-day rallies today after consecutive monthly reports indicated core inflation stabilized at target benchmarks.

### Key Factors Fueling Market Optimism
- **Moderated Energy Tariffs:** Natural gas and petroleum reserves remained resilient through winter periods.
- **Consumer Confidence Rebound:** Retail spending climbed 3.4% quarter-over-quarter.
- **Tech Sector Capital Expansion:** Venture investments surged in high-yield chip fabrication and computational infrastructure.`,
    featured_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-3",
    author_id: "usr-author-2",
    status: "published",
    is_featured: true,
    is_breaking: false,
    is_trending: true,
    views_count: 11200,
    reading_time_min: 3,
    meta_title: "Global Markets Rally as Inflation Cools",
    meta_description: "Markets surge following positive central bank inflation signals.",
    published_at: "2026-08-25T11:00:00Z",
    created_at: "2026-08-25T10:00:00Z",
    category: MOCK_CATEGORIES[2],
    author: MOCK_AUTHORS[2],
    tags: [MOCK_TAGS[4]]
  },
  {
    id: "post-4",
    title: "Championship Thriller: Dramatic Stoppage Time Goal Seals Epic Comeback Victory",
    slug: "championship-thriller-stoppage-time-goal-seals-victory",
    excerpt: "In front of a roaring 80,000 capacity crowd, a 94th-minute curling strike secured a sensational title triumph in thrilling fashion.",
    content: `## A Night of Pure Sporting Drama

Football history was forged under the stadium floodlights as the underdogs orchestrated one of the most memorable tactical comebacks in tournament lore. Trailing by two goals at the 75-minute mark, a series of inspired substitutions ignited a breathtaking three-goal turnaround.

> "We never stopped believing for a single second. This victory belongs to the fans who stayed by our side through every hardship," the winning captain exclaimed in tears during the trophy presentation.`,
    featured_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-4",
    author_id: "usr-author-1",
    status: "published",
    is_featured: true,
    is_breaking: false,
    is_trending: false,
    views_count: 8750,
    reading_time_min: 2,
    meta_title: "Championship Thriller Comeback Victory",
    meta_description: "A dramatic 94th-minute strike delivers an unforgettable championship title.",
    published_at: "2026-08-24T20:45:00Z",
    created_at: "2026-08-24T20:00:00Z",
    category: MOCK_CATEGORIES[3],
    author: MOCK_AUTHORS[1],
    tags: [MOCK_TAGS[2]]
  },
  {
    id: "post-5",
    title: "Urban Green Sanctuaries: How Modern Metropolises Are Reclaiming Public Nature",
    slug: "urban-green-sanctuaries-reclaiming-public-nature",
    excerpt: "Architects and urban planners are converting disused industrial zones into biodiversity parks and community wellness corridors.",
    content: `## Rethinking Urban Habitats

From Singapore to Copenhagen, leading city architects are pioneering 'Biophilic Urbanism'—the integration of natural ecosystems directly within high-density metropolitan spaces.

Vertical forests, living roofs, and daylighted river corridors are proving not only to lower ambient temperatures by up to 3°C, but also to dramatically improve public mental health and community cohesion.`,
    featured_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-5",
    author_id: "usr-author-2",
    status: "published",
    is_featured: false,
    is_breaking: false,
    is_trending: true,
    views_count: 6540,
    reading_time_min: 3,
    meta_title: "Urban Green Sanctuaries",
    meta_description: "How metropolitan centers are transforming disused zones into green parks.",
    published_at: "2026-08-23T09:00:00Z",
    created_at: "2026-08-23T08:00:00Z",
    category: MOCK_CATEGORIES[4],
    author: MOCK_AUTHORS[2],
    tags: [MOCK_TAGS[3]]
  },
  {
    id: "post-6",
    title: "Acclaimed Director Unveils Groundbreaking Sci-Fi Masterpiece at Film Festival",
    slug: "acclaimed-director-unveils-groundbreaking-sci-fi-masterpiece",
    excerpt: "Critics and audience alike erupted in a 12-minute standing ovation following the premiere of the visually stunning cosmic odyssey.",
    content: `## A Cinematic Milestone

Fusing practical special effects with revolutionary holographic rendering, the newly premiered sci-fi epic has captivated festival-goers and film critics worldwide.

The film explores consciousness, interstellar exploration, and human intimacy across multiple generations, already generating major award season momentum.`,
    featured_image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-6",
    author_id: "usr-author-1",
    status: "published",
    is_featured: false,
    is_breaking: false,
    is_trending: false,
    views_count: 5120,
    reading_time_min: 3,
    meta_title: "Acclaimed Director Unveils Sci-Fi Masterpiece",
    meta_description: "Standing ovation at international film festival for landmark cinema premiere.",
    published_at: "2026-08-22T17:30:00Z",
    created_at: "2026-08-22T16:00:00Z",
    category: MOCK_CATEGORIES[5],
    author: MOCK_AUTHORS[1],
    tags: [MOCK_TAGS[0]]
  }
];

export const MOCK_PAGES: PageItem[] = [
  {
    id: "pg-1",
    title: "About Us",
    slug: "about-us",
    content: `## About The Daily Chronicle\n\nFounded with a vision to deliver unbiased, rapid, and insightful journalism, **The Daily Chronicle** is an independent digital media platform operated by seasoned investigative journalists, tech analysts, and visual storytellers.\n\n### Our Editorial Values\n- **Truth & Accuracy:** Exhaustive fact-checking before publication.\n- **Editorial Independence:** Shielded from commercial or partisan bias.\n- **Speed & Depth:** Combining breaking alerts with nuanced analytical context.`,
    is_published: true,
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "pg-2",
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: `## Privacy Policy\n\nYour privacy is paramount. This policy outlines our transparent data handling principles.\n\n### Information We Collect\nWe only record anonymized analytics, newsletter opt-in emails, and direct contact form submissions. We will never sell, lease, or distribute your personal details to third-party advertisers.`,
    is_published: true,
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "pg-3",
    title: "Terms of Service",
    slug: "terms-of-service",
    content: `## Terms of Service\n\nBy accessing and utilizing The Daily Chronicle, you consent to our terms of service, community guidelines, and copyright protection standards. Content may not be syndicated or reproduced without prior written authorization.`,
    is_published: true,
    created_at: "2025-01-01T00:00:00Z"
  }
];

export const MOCK_SITE_SETTINGS: SiteSettings = {
  general: {
    site_title: "The Daily Chronicle",
    tagline: "Truth, Independence & Modern Journalism",
    logo_text: "CHRONICLE",
    footer_about: "The Daily Chronicle is a premier digital news magazine bringing you breaking news, in-depth investigative reports, technology updates, and cultural insights from around the globe.",
    permalink_structure: "/news/%slug%",
    enable_comments: true,
    copyright_text: "© 2026 The Daily Chronicle. All rights reserved."
  },
  social: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com"
  },
  appearance: {
    primary_color: "#e11d48",
    enable_trending_ticker: true,
    hero_style: "newspaper_5_grid",
    breaking_news_text: "BREAKING NEWS"
  }
};
