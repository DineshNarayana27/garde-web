import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from '../cards/ContentCard';
import { Content } from '../../types';

interface ContentRowProps {
  title: string;
  items?: Content[];
  fetchFn?: () => Promise<Content[]>;
  queryKey?: string;
}

export function ContentRow({ title, items, fetchFn, queryKey }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: fetchedContents = [], isLoading } = useQuery({
    queryKey: [queryKey || title],
    queryFn: fetchFn || (() => Promise.resolve([])),
    enabled: !!fetchFn,
    staleTime: 5 * 60 * 1000,
  });

  const contents = items || fetchedContents;
  const isRowLoading = !!fetchFn && isLoading;

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between px-4 md:px-8 lg:px-12 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-accent-indigo rounded-full" />
          <h2 className="font-sans text-[20px] font-700 tracking-tight text-white">{title}</h2>
        </div>
        <button className="text-[11px] font-500 uppercase tracking-[0.08em] text-secondary-text hover:text-white transition-colors">
          View All
        </button>
      </div>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-[135px] -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/80 border border-border-custom backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-accent-indigo hover:text-white"
        >
          <ChevronLeft size={18} />
        </button>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar px-4 md:px-8 lg:px-12 pr-4 md:pr-8 lg:pr-12 pb-6 pt-1">
          {isRowLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-xl shimmer bg-card border border-border-custom"
                  style={{ width: 180, height: 270 }}
                />
              ))
            : contents.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-[135px] -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/80 border border-border-custom backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-accent-indigo hover:text-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
