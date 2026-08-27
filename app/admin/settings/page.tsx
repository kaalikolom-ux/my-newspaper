'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, Globe, Shield, Sliders, Link2, Sparkles } from 'lucide-react';
import { MOCK_SITE_SETTINGS } from '@/lib/mock-data';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(MOCK_SITE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [siteKey, setSiteKey] = useState(process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '');
  const [secretKey, setSecretKey] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs">
        <h1 className="font-headline text-2xl font-bold text-neutral-900 dark:text-white">
          Site Settings & Permalinks
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-0.5">
          Configure site identity, WordPress-style URL permalink structures, and Cloudflare integrations.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Site settings and permalink rules saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. General Site Identity */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <Globe className="w-4 h-4 text-brand-600" />
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              General Publication Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Publication Title *
              </label>
              <input
                type="text"
                required
                value={settings.general.site_title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, site_title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Masthead Logo Text
              </label>
              <input
                type="text"
                value={settings.general.logo_text}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, logo_text: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 font-headline font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Tagline / Editorial Motto
              </label>
              <input
                type="text"
                value={settings.general.tagline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, tagline: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Footer About Statement
              </label>
              <textarea
                rows={3}
                value={settings.general.footer_about}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, footer_about: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 2. WordPress-style Permalinks Structure */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <Link2 className="w-4 h-4 text-brand-600" />
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Permalink Settings (URL Routing)
            </h2>
          </div>

          <p className="text-xs text-neutral-500">
            Choose how article permalinks are structured across your digital newspaper portal:
          </p>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer">
              <input
                type="radio"
                name="permalink"
                value="/news/%slug%"
                checked={settings.general.permalink_structure === '/news/%slug%'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, permalink_structure: e.target.value },
                  })
                }
                className="text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="font-bold text-neutral-900 dark:text-white block">
                  Post Name / News Standard (Recommended)
                </span>
                <span className="text-neutral-400 font-mono text-[11px]">
                  https://yoursite.pages.dev/news/sample-story-headline/
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer">
              <input
                type="radio"
                name="permalink"
                value="/%category%/%slug%"
                checked={settings.general.permalink_structure === '/%category%/%slug%'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, permalink_structure: e.target.value },
                  })
                }
                className="text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="font-bold text-neutral-900 dark:text-white block">
                  Category + Post Name
                </span>
                <span className="text-neutral-400 font-mono text-[11px]">
                  https://yoursite.pages.dev/technology/sample-story-headline/
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 3. Cloudflare Turnstile Bot Shield */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Cloudflare Turnstile Bot Security
            </h2>
          </div>

          <p className="text-xs text-neutral-500">
            Protects contact inquiries and comments against automated scrapers and spambots.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Turnstile Site Key (Public)
              </label>
              <input
                type="text"
                value={siteKey}
                onChange={(e) => setSiteKey(e.target.value)}
                placeholder="0x4AAAAAA..."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Turnstile Secret Key (Server Private)
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="••••••••••••••••••••"
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 4. Newspaper Appearance Settings */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Magazine Layout & Theme
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance.enable_trending_ticker}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: {
                      ...settings.appearance,
                      enable_trending_ticker: e.target.checked,
                    },
                  })
                }
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="font-bold text-neutral-800 dark:text-neutral-200">
                Display Top Breaking / Trending News Ticker Bar
              </span>
            </label>

            <div>
              <label className="block font-bold uppercase text-neutral-600 dark:text-neutral-300 mb-1">
                Breaking News Badge Text
              </label>
              <input
                type="text"
                value={settings.appearance.breaking_news_text}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: {
                      ...settings.appearance,
                      breaking_news_text: e.target.value,
                    },
                  })
                }
                className="w-48 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs font-bold uppercase tracking-wider"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
