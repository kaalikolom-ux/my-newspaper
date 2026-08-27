'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_POSTS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export const runtime = 'edge';

export default function AdminPostsListPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== 'all' && post.category?.slug !== selectedCategory) return false;
    if (selectedStatus !== 'all' && post.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return post.title.toLowerCase().includes(q) || (post.author?.full_name.toLowerCase() || '').includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs">
        <div>
          <h1 className="font-headline text-2xl font-bold text-neutral-900 dark:text-white">
            All Articles & Stories
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            WordPress-like Post Management • Total {filteredPosts.length} items
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Story</span>
        </Link>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xs shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-xs font-semibold ${
                selectedStatus === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setSelectedStatus('published')}
              className={`px-3 py-1 rounded-xs font-semibold ${
                selectedStatus === 'published'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setSelectedStatus('draft')}
              className={`px-3 py-1 rounded-xs font-semibold ${
                selectedStatus === 'draft'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Drafts
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">All Desks & Categories</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, authors..."
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Posts Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Headline</th>
                <th className="p-4">Author</th>
                <th className="p-4">Desk / Category</th>
                <th className="p-4">Views</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500 font-serif">
                    No articles found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                    {/* Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xs overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
                          {post.featured_image && (
                            <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="font-headline font-bold text-neutral-900 dark:text-white hover:text-brand-600 line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            /news/{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="p-4 text-neutral-700 dark:text-neutral-300 font-medium">
                      {post.author?.full_name || 'Mahmud Hasan'}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      {post.category && (
                        <span
                          className="category-ribbon text-[10px]"
                          style={{ backgroundColor: post.category.color || '#e11d48' }}
                        >
                          {post.category.name}
                        </span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="p-4 text-neutral-600 dark:text-neutral-400 font-sans">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-neutral-400" />
                        <span>{post.views_count.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-neutral-500 font-sans">
                      {formatDate(post.published_at)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {post.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-brand-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                          title="Edit article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/news/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-brand-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                          title="View live article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
