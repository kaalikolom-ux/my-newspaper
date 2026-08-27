import React from 'react';
import Link from 'next/link';
import { Newspaper, Facebook, Twitter, Instagram, Youtube, Linkedin, Globe, Shield, ArrowUpRight } from 'lucide-react';
import { Category, SiteSettings } from '@/lib/types';

interface FooterProps {
  categories: Category[];
  settings: SiteSettings;
}

export default function Footer({ categories, settings }: FooterProps) {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t-4 border-brand-600 mt-16 font-sans">
      {/* 1. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        {/* Column 1: Brand & Mission Statement (Takes 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-8 h-8 text-brand-500" />
            <span className="font-headline text-2xl font-black text-white uppercase tracking-tight">
              {settings.general.logo_text || 'CHRONICLE'}
            </span>
          </div>
          
          <p className="text-xs text-neutral-400 leading-relaxed font-serif">
            {settings.general.footer_about ||
              'The Daily Chronicle is a premier digital news magazine bringing you breaking news, in-depth investigative reports, technology updates, and cultural insights from around the globe.'}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={settings.social.facebook || '#'}
              aria-label="Facebook"
              className="p-2 bg-neutral-900 hover:bg-brand-600 text-neutral-300 hover:text-white rounded-xs transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={settings.social.twitter || '#'}
              aria-label="Twitter"
              className="p-2 bg-neutral-900 hover:bg-brand-600 text-neutral-300 hover:text-white rounded-xs transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={settings.social.instagram || '#'}
              aria-label="Instagram"
              className="p-2 bg-neutral-900 hover:bg-brand-600 text-neutral-300 hover:text-white rounded-xs transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={settings.social.youtube || '#'}
              aria-label="YouTube"
              className="p-2 bg-neutral-900 hover:bg-brand-600 text-neutral-300 hover:text-white rounded-xs transition"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={settings.social.linkedin || '#'}
              aria-label="LinkedIn"
              className="p-2 bg-neutral-900 hover:bg-brand-600 text-neutral-300 hover:text-white rounded-xs transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: News Sections / Categories (Takes 4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
            News Desks
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-neutral-400 hover:text-brand-500 py-1 transition flex items-center gap-1 group"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color || '#e11d48' }} />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Corporate, Editorial & Legal (Takes 4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
            Company & Policy
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>
              <Link href="/about-us" className="hover:text-white transition flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                <span>About Our Editorial Board</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                <span>Contact & Editorial Desk</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-neutral-500" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white transition flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-neutral-500" />
                <span>Terms of Service</span>
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/admin"
                className="inline-block px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-brand-500 text-brand-500 text-xs font-semibold rounded-xs transition"
              >
                Enter WordPress-like Dashboard →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Bottom Copyright & Credits Bar */}
      <div className="border-t border-neutral-900 bg-neutral-950 py-5 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>{settings.general.copyright_text || '© 2026 The Daily Chronicle. All rights reserved.'}</span>
          <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
            <span>Powered by <strong>Next.js + Supabase + Cloudflare Pages</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
