'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, UserPlus, Shield, ShieldCheck, UserCheck, ExternalLink, CheckCircle2 } from 'lucide-react';
import { MOCK_AUTHORS } from '@/lib/mock-data';
import { Profile, UserRole } from '@/lib/types';

export const runtime = 'edge';

const INITIAL_USERS: Profile[] = [
  ...MOCK_AUTHORS,
  {
    id: 'usr-sub-1',
    username: 'rahim_reader',
    full_name: 'Abdur Rahim',
    email: 'rahim@example.com',
    avatar_url: null,
    role: 'subscriber',
    created_at: '2025-04-01T12:00:00Z',
  }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>(INITIAL_USERS);
  const [notice, setNotice] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setNotice(`User role updated to ${newRole.toUpperCase()}!`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xs shadow-xs">
        <div>
          <h1 className="font-headline text-2xl font-bold text-neutral-900 dark:text-white">
            Users & Roles Management
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            WordPress-like Multi-Tier Access: <strong>Administrator</strong>, <strong>Author</strong>, and <strong>Subscriber</strong>.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Role Capabilities Reference Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xs shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Administrator</span>
          </div>
          <p className="text-neutral-500 leading-relaxed font-sans">
            Full system control: create/edit/delete all articles, manage desks, change permalinks, configure Turnstile and manage users.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xs shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Author / Columnist</span>
          </div>
          <p className="text-neutral-500 leading-relaxed font-sans">
            Can write and publish their own articles, upload media, view personal reader stats, and customize author profile page.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xs shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Subscriber / Reader</span>
          </div>
          <p className="text-neutral-500 leading-relaxed font-sans">
            Registered site member: can submit verified comments, save bookmarks, and receive daily email dispatches.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Profile Link</th>
                <th className="p-4 text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                            {user.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white block font-headline">
                          {user.full_name}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">@{user.username}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-neutral-600 dark:text-neutral-400">
                    {user.email}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          : user.role === 'author'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    {user.role !== 'subscriber' ? (
                      <Link
                        href={`/author/${user.username}`}
                        target="_blank"
                        className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>View Author Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-neutral-400">N/A</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs text-xs font-medium"
                    >
                      <option value="admin">Admin</option>
                      <option value="author">Author</option>
                      <option value="subscriber">Subscriber</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
