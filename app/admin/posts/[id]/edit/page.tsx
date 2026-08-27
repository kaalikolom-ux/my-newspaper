import React from 'react';
import { notFound } from 'next/navigation';
import { getAuthors, getCategories, getPosts } from '@/lib/data';
import PostEditor from '@/components/admin/PostEditor';

export const runtime = 'edge';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function AdminEditPostPage({ params }: EditPageProps) {
  const [allPosts, categories, authors] = await Promise.all([
    getPosts(),
    getCategories(),
    getAuthors(),
  ]);

  const post = allPosts.find((p) => p.id === params.id) || allPosts[0];

  if (!post) {
    notFound();
  }

  return (
    <PostEditor
      initialPost={post}
      categories={categories}
      authors={authors}
      isEditing={true}
    />
  );
}
