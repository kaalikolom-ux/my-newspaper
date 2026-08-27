import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const runtime = 'edge';

export const metadata = {
  title: 'WordPress-like CMS Admin Dashboard | The Daily Chronicle',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-950 font-sans">
      {/* 1. Left Dark WordPress-style Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
