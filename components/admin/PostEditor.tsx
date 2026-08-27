'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  Code,
  List,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Category, Post, PostStatus, Profile } from '@/lib/types';
import { slugify } from '@/lib/utils';

interface PostEditorProps {
  initialPost?: Partial<Post>;
  categories: Category[];
  authors: Profile[];
  isEditing?: boolean;
}

export default function PostEditor({
  initialPost,
  categories,
  authors,
  isEditing = false,
}: PostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featured_image || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category_id || (categories[0]?.id || ''));
  const [authorId, setAuthorId] = useState(initialPost?.author_id || (authors[0]?.id || ''));
  const [status, setStatus] = useState<PostStatus>(initialPost?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(initialPost?.is_featured || false);
  const [isBreaking, setIsBreaking] = useState(initialPost?.is_breaking || false);
  const [isTrending, setIsTrending] = useState(initialPost?.is_trending || false);
  const [metaTitle, setMetaTitle] = useState(initialPost?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.meta_description || '');

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleInsertMarkdown = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}Text${suffix}\n`);
  };

  const handleSave = async (publishStatus?: PostStatus) => {
    if (!title.trim()) {
      setNotice({ type: 'error', text: 'Please provide a story headline.' });
      return;
    }

    setSaving(true);
    setNotice(null);

    const postPayload = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      featured_image: featuredImage,
      category_id: categoryId,
      author_id: authorId,
      status: publishStatus || status,
      is_featured: isFeatured,
      is_breaking: isBreaking,
      is_trending: isTrending,
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt,
    };

    // Simulate save or write to Supabase
    setTimeout(() => {
      setSaving(false);
      setNotice({
        type: 'success',
        text: isEditing
          ? 'Post successfully updated!'
          : 'New story successfully created and published!',
      });
      setTimeout(() => {
        router.push('/admin/posts');
      }, 1200);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xs shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/posts')}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-headline text-lg font-bold text-neutral-900 dark:text-white">
              {isEditing ? 'Edit Story' : 'Add New Story (Newspaper Post)'}
            </h1>
            <span className="text-[11px] text-neutral-400">
              WordPress-style Block Editor & Metadata Inspector
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xs transition"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : isEditing ? 'Update Story' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`p-3.5 rounded-xs text-xs flex items-center gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Main Grid: Left Editor + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Headline, Slug, Formatting bar, Content Body (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Post Title Input */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Story Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter an engaging, journalistic headline here..."
                className="w-full font-headline text-xl md:text-2xl font-bold px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-2 focus:ring-brand-500 focus:outline-none text-neutral-900 dark:text-white"
              />
            </div>

            {/* Permalink / Slug Bar */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-xs border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 shrink-0">Permalink: /news/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="custom-slug"
                className="flex-1 bg-transparent border-b border-dashed border-neutral-400 focus:border-brand-500 focus:outline-none text-neutral-800 dark:text-neutral-200 font-semibold"
              />
            </div>
          </div>

          {/* Subtitle / Excerpt */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
              Excerpt / Lead Sub-heading
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence lead paragraph shown in hero grids and search cards..."
              className="w-full text-xs font-sans px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none text-neutral-900 dark:text-white"
            />
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs shadow-xs overflow-hidden">
            {/* Quick Markdown Toolbar */}
            <div className="bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 p-2 flex flex-wrap items-center gap-1 text-neutral-700 dark:text-neutral-300">
              <button
                type="button"
                onClick={() => handleInsertMarkdown('## ')}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs flex items-center gap-1 font-bold"
                title="Heading 2"
              >
                <Heading1 className="w-3.5 h-3.5" /> H2
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('### ')}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs flex items-center gap-1 font-bold"
                title="Heading 3"
              >
                <Heading2 className="w-3.5 h-3.5" /> H3
              </button>
              <span className="text-neutral-300 dark:text-neutral-600">|</span>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('**', '**')}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs font-bold"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('*', '*')}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs italic"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('> ')}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs"
                title="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('- ')}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertMarkdown('```\n', '\n```')}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs"
                title="Code block"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4">
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your news article body in Markdown or rich text paragraphs..."
                className="w-full text-sm font-serif leading-relaxed bg-transparent border-0 focus:outline-none text-neutral-900 dark:text-white resize-y"
              />
            </div>
          </div>
        </div>

        {/* Right: WordPress Inspector Side Boxes (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Status & Visibility Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-5 shadow-xs space-y-4">
            <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
              Publish Settings
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 font-bold uppercase mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs text-neutral-900 dark:text-white"
                >
                  <option value="published">Published (Public)</option>
                  <option value="draft">Draft (Private)</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 font-bold uppercase mb-1">Assign Author</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs text-neutral-900 dark:text-white"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.full_name} (@{a.username})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    Lead Feature (Hero 5-Grid)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    Breaking News Ticker
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    Trending Highlight
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 2. Category Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-5 shadow-xs space-y-3">
            <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
              Category Desk
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={categoryId === cat.id}
                      onChange={() => setCategoryId(cat.id)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{cat.name}</span>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || '#e11d48' }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* 3. Featured Image Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-5 shadow-xs space-y-3">
            <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
              Featured Image
            </h3>
            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/... or Supabase URL"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs text-neutral-900 dark:text-white text-xs"
              />
              {featuredImage ? (
                <div className="relative aspect-video rounded-xs overflow-hidden border border-neutral-200">
                  <img
                    src={featuredImage}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xs flex flex-col items-center justify-center text-neutral-400">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">No image URL entered</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. SEO & Social Metadata Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-5 shadow-xs space-y-3">
            <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
              SEO & Social Metadata
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 font-bold uppercase mb-1">Custom Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to headline..."
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs text-neutral-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-bold uppercase mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Defaults to excerpt..."
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs text-neutral-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
