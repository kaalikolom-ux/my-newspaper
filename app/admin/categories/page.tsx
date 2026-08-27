'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit, CheckCircle2, FolderTree, ExternalLink } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { Category } from '@/lib/types';
import { slugify } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#e11d48');
  const [notice, setNotice] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(slugify(val));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug: slug || slugify(name),
      description,
      color,
      order_index: categories.length + 1,
    };

    setCategories([...categories, newCategory]);
    setName('');
    setSlug('');
    setDescription('');
    setNotice(`Desk / Category "${newCategory.name}" successfully created!`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category desk?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs">
        <h1 className="font-headline text-2xl font-bold text-neutral-900 dark:text-white">
          News Desks & Categories
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-0.5">
          Organize your news publications, color themes, and navigation taxonomy.
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* 2-Column WordPress Layout (Add form on left, Table on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add New Category (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs shadow-xs space-y-4">
          <h2 className="font-headline text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Add New Category</span>
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Science & Space"
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="science-and-space"
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Accent / Theme Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-8 rounded-xs cursor-pointer border border-neutral-300 p-0.5"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-28 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of this news desk..."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
            >
              Add New Category
            </button>
          </form>
        </div>

        {/* Right: Existing Categories Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Desk Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Color Badge</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                    <td className="p-4 font-headline font-bold text-neutral-900 dark:text-white">
                      {cat.name}
                    </td>
                    <td className="p-4 text-neutral-500 font-mono">
                      /category/{cat.slug}
                    </td>
                    <td className="p-4">
                      <span
                        className="category-ribbon text-[10px]"
                        style={{ backgroundColor: cat.color || '#e11d48' }}
                      >
                        {cat.name}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/category/${cat.slug}`}
                          target="_blank"
                          className="p-1.5 text-neutral-500 hover:text-brand-600 rounded transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition"
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
      </div>
    </div>
  );
}
