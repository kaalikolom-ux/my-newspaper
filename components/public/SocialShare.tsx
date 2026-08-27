'use client';

import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, Check, MessageSquare } from 'lucide-react';

interface SocialShareProps {
  title: string;
  url?: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 border-y border-neutral-200 dark:border-neutral-800 my-6">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 mr-2">
        <Share2 className="w-4 h-4" />
        <span>Share:</span>
      </div>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2] hover:opacity-90 text-white rounded-xs text-xs font-medium transition shadow-2xs"
      >
        <Facebook className="w-3.5 h-3.5 fill-white" />
        <span>Facebook</span>
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:opacity-90 text-white rounded-xs text-xs font-medium transition shadow-2xs"
      >
        <Twitter className="w-3.5 h-3.5 fill-white" />
        <span>X / Post</span>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a66c2] hover:opacity-90 text-white rounded-xs text-xs font-medium transition shadow-2xs"
      >
        <Linkedin className="w-3.5 h-3.5 fill-white" />
        <span>LinkedIn</span>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25d366] hover:opacity-90 text-white rounded-xs text-xs font-medium transition shadow-2xs"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 rounded-xs text-xs font-medium transition"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
