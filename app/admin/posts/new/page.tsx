import React from 'react';
import { getAuthors, getCategories } from '@/lib/data';
import PostEditor from '@/components/admin/PostEditor';

export const runtime = 'edge';

export default async function AdminNewPostPage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);

  return (
    <PostEditor
      categories={categories}
      authors={authors}
      isEditing={false}
    />
  );
}
