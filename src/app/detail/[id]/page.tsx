"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Plus, Check, ArrowLeft, Star, Clock, Calendar, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Navbar } from '../../../components/layout/Navbar';
import { useStore } from '../../../store/useStore';
import { useQuery } from '@tanstack/react-query';
import { getContentById } from '../../../lib/api/content';

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToList, removeFromList, isInList } = useStore();

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: () => getContentById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <Navbar />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <h1 className="mb-4 text-4xl font-bold">Content Not Found</h1>
        <button onClick={() => router.back()} className="text-accent-red hover:underline">Go Back</button>
      </div>
    );
  }

  const inList = isInList(content.id);

  const handleToggleList = () => {
    if (inList) {
      removeFromList(content.id);
    } else {
      addToList(content);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.backdrop_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        
        <button 
          onClick={() => router.back()}
          className="absolute top-32 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform hover:scale-110 md:left-12"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Content Info */}
      <div className="relative -mt-40 px-4 md:px-12 lg:px-20">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Poster */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden w-72 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl lg:block"
          >
            <img src={content.thumbnail_url} alt={content.title} className="w-full" referrerPolicy="no-referrer" />
          </motion.div>

          {/* Details */}
          <div className="flex-grow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-4 flex flex-wrap gap-3">
                {content.genre.map(g => (
                  <span key={g} className="rounded-full bg-accent-red/20 px-4 py-1 text-xs font-bold text-accent-red backdrop-blur-md">
                    {g}
                  </span>
                ))}
              </div>

              <h1 className="mb-6 text-5xl font-black md:text-7xl tracking-tighter">
                {content.title}
              </h1>

              <div className="mb-8 flex flex-wrap items-center gap-6 text-sm font-bold text-secondary-text">
                <div className="flex items-center gap-2 text-gold">
                  <Star size={18} fill="currentColor" />
                  {content.rating}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {content.year}
                </div>
                {content.duration && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    {content.duration}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Globe size={18} />
                  {content.language}
                </div>
              </div>

              <p className="mb-10 max-w-3xl text-xl leading-relaxed text-secondary-text">
                {content.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => router.push(`/watch/${content.id}`)}
                  className="flex items-center gap-3 rounded-xl bg-accent-red px-10 py-4 text-lg font-black text-white shadow-lg shadow-accent-red/20 transition-transform hover:scale-105 active:scale-95"
                >
                  <Play size={24} fill="currentColor" />
                  Watch Now
                </button>
                <button 
                  onClick={handleToggleList}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-10 py-4 text-lg font-black text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
                >
                  {inList ? <Check size={24} /> : <Plus size={24} />}
                  {inList ? 'In Your List' : 'Add to List'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
