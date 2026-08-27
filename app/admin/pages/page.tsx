'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, FileCode, CheckCircle2 } from 'lucide-react';
import { MOCK_PAGES } from '@/lib/mock-data';
import { PageItem } from '@/lib/types';
import { slugify } from '@/lib/utils';

export default function AdminPagesManagerPage() {
  const [pages, setPages] = useState<PageItem[]>(MOCK_PAGES);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPage: PageItem = {
      id: `pg-${Date.now()}`,
      title,
      slug: slug || slugify(title),
      content,
      is_published: true,
      created_at: new Date().toISOString(),
    };

    setPages([...pages, newPage]);
    setIsCreating(false);
    setTitle('');
    setSlug('');
    setContent('');
    setNotice(`Page "${newPage.title}" created successfully!`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this static page?')) {
      setPages(pages.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs">
        <div>
          <h1 className="font-headline text-2xl font-bold text-neutral-900 dark:text-white">
            Static Editorial Pages
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Manage About Us, Privacy Policy, Terms of Service, and custom landing pages.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel' : 'Add New Page'}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {isCreating && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs shadow-xs space-y-4 animate-in fade-in">
          <h2 className="font-headline text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
            Create New Custom Page
          </h2>
          <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Editorial Guidelines"
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="editorial-guidelines"
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Content (Markdown & Headings)
              </label>
              <textarea
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write page content in markdown format..."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Publish Page
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pages Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug / Path</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                <td className="p-4 font-headline font-bold text-neutral-900 dark:text-white">
                  {p.title}
                </td>
                <td className="p-4 text-neutral-500 font-mono">
                  /{p.slug}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    Published
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/${p.slug}`}
                      target="_blank"
                      className="p-1.5 text-neutral-500 hover:text-brand-600 rounded transition"
                      title="View live page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition"
                      title="Delete page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
