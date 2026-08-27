'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Post } from '@/lib/types';

interface TrendingBarProps {
  posts: Post[];
  breakingText?: string;
}

export default function TrendingBar({ posts, breakingText = "TRENDING NOW" }: TrendingBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(now)
      );
    };
    updateDateTime();
  }, []);

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (!posts || posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  return (
    <div className="bg-neutral-900 text-neutral-200 border-b border-neutral-800 text-xs py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Breaking/Trending Ticker */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
          {/* Badge */}
          <div className="flex items-center gap-1.5 bg-brand-600 text-white font-bold px-2.5 py-1 rounded text-[11px] uppercase tracking-wider shrink-0 shadow-sm animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>{breakingText}</span>
          </div>

          {/* Post item */}
          <div className="flex-1 truncate">
            <Link
              href={`/news/${currentPost.slug}`}
              className="hover:text-brand-500 font-medium transition-colors line-clamp-1"
            >
              {currentPost.title}
            </Link>
          </div>

          {/* Navigation Arrows */}
          {posts.length > 1 && (
            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                onClick={handlePrev}
                aria-label="Previous story"
                className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next story"
                className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Date & Secondary Info */}
        <div className="hidden lg:flex items-center gap-4 text-neutral-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>{currentDateStr || 'Today'}</span>
          </div>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/about-us" className="hover:text-white transition">About</Link>
            <Link href="/admin" className="text-brand-500 hover:underline font-semibold">CMS Admin</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
