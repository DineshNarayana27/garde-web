"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Maximize, Volume2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';
import { useQuery } from '@tanstack/react-query';
import { getContentById } from '../../../lib/api/content';

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const { data: content, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: () => getContentById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-red border-t-transparent" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-center">
        <h1 className="mb-4 text-4xl font-bold">Content Not Found</h1>
        <button onClick={() => router.back()} className="text-accent-red hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Mux Player */}
      <div className="h-full w-full">
        <MuxPlayer
          playbackId={content.mux_playback_id}
          metadata={{
            video_id: content.id,
            video_title: content.title,
            viewer_user_id: 'user-123',
          }}
          streamType="on-demand"
          autoPlay
          className="h-full w-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Custom Overlay Controls */}
      <div 
        className={`absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-b from-black/60 via-transparent to-black/60 p-8 transition-opacity duration-500 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-3 text-white transition-transform hover:scale-105"
          >
            <ArrowLeft size={24} />
            <span className="text-lg font-bold">{content.title}</span>
          </button>
          <div className="flex items-center gap-6">
            <button className="text-white hover:text-accent-red transition-colors">
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center justify-center gap-12">
          <button className="text-white hover:scale-110 transition-transform">
            <SkipBack size={40} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
          >
            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
          </button>
          <button className="text-white hover:scale-110 transition-transform">
            <SkipForward size={40} fill="currentColor" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="space-y-4">
          <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-accent-red" />
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium">12:45 / 45:00</span>
              <button className="hover:text-accent-red transition-colors">
                <Volume2 size={24} />
              </button>
            </div>
            <button className="hover:text-accent-red transition-colors">
              <Maximize size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
