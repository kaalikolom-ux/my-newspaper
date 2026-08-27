'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  FileCode,
  Users,
  Settings,
  ExternalLink,
  PlusCircle,
  Newspaper,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'All Posts', href: '/admin/posts', icon: FileText },
  { label: 'Add New Post', href: '/admin/posts/new', icon: PlusCircle },
  { label: 'Categories & Desks', href: '/admin/categories', icon: FolderTree },
  { label: 'Static Pages', href: '/admin/pages', icon: FileCode },
  { label: 'Users & Roles', href: '/admin/users', icon: Users },
  { label: 'Settings & Permalinks', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 min-h-screen flex flex-col border-r border-neutral-800 select-none">
      {/* WordPress Brand Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-600 flex items-center justify-center text-white font-black font-headline">
            C
          </div>
          <div>
            <span className="font-headline font-bold text-white text-sm tracking-wide block">
              CHRONICLE CMS
            </span>
            <span className="text-[10px] text-neutral-400">WordPress Engine v2.6</span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 text-xs font-medium font-sans">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href) && item.href !== '/admin/posts/new');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white font-bold'
                  : 'hover:bg-neutral-800 hover:text-white text-neutral-400'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Public Portal Link */}
      <div className="p-3 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 hover:text-white rounded-md text-xs font-semibold transition"
        >
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-brand-500" />
            <span>Visit Live Site</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </Link>
      </div>
    </aside>
  );
}
