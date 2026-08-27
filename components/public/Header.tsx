'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Newspaper, ChevronDown, UserCircle } from 'lucide-react';
import { Category, SiteSettings } from '@/lib/types';

interface HeaderProps {
  categories: Category[];
  settings: SiteSettings;
}

export default function Header({ categories, settings }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* 1. Masthead / Main Logo Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800">
        {/* Left Side Tagline / Issue */}
        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Est. 2026 • Digital Edition
          </span>
          <span className="text-xs text-neutral-500 font-serif italic">
            {settings.general.tagline || 'Truth, Independence & Modern Journalism'}
          </span>
        </div>

        {/* Center: Iconic Newspaper Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="group flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Newspaper className="w-8 h-8 md:w-10 md:h-10 text-brand-600 group-hover:scale-105 transition-transform" />
              <h1 className="font-headline text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
                {settings.general.logo_text || 'CHRONICLE'}
              </h1>
            </div>
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-neutral-500 mt-1">
              Global News & Investigative Journalism
            </span>
          </Link>
        </div>

        {/* Right: Actions (Search, Admin Portal button) */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-brand-600 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-md transition"
            aria-label="Search articles"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search News...</span>
          </button>

          {/* Admin Login / CMS Link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-md shadow-sm transition"
          >
            <UserCircle className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 rounded-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center space-x-1 font-sans text-sm font-semibold tracking-wide uppercase">
            <li>
              <Link
                href="/"
                className={`inline-block py-3 px-3.5 border-b-2 transition-colors ${
                  pathname === '/'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:text-brand-600'
                }`}
              >
                Home
              </Link>
            </li>
            {categories.map((category) => {
              const isActive = pathname === `/category/${category.slug}`;
              return (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className={`inline-block py-3 px-3.5 border-b-2 transition-colors ${
                      isActive
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:text-brand-600'
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/contact"
                className={`inline-block py-3 px-3.5 border-b-2 transition-colors ${
                  pathname === '/contact'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:text-brand-600'
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Quick Subscribe / Live feed indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>LIVE DESK</span>
          </div>
        </div>
      </nav>

      {/* 3. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-neutral-900 dark:text-white uppercase"
          >
            Home
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-brand-600 uppercase"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-brand-600 uppercase"
          >
            Contact Form
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-brand-600 uppercase"
          >
            WordPress-like Admin
          </Link>
        </div>
      )}

      {/* 4. Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-lg shadow-2xl p-6 border border-neutral-200 dark:border-neutral-800 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-headline font-bold text-neutral-900 dark:text-white mb-4">
              Search The Daily Chronicle
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, headlines, authors, keywords..."
                autoFocus
                className="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-neutral-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-md shadow transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
