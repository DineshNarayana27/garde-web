"use client";

import { useQuery } from '@tanstack/react-query';
import { Navbar } from '../components/layout/Navbar';
import { HeroBanner } from '../components/home/HeroBanner';
import { ContentRow } from '../components/home/ContentRow';
import { 
  getFeaturedContent, 
  getTrendingContent, 
  getNewReleases, 
  getContentByType,
  seedDatabase
} from '../lib/api/content';
import { useState } from 'react';

export default function Home() {
  const [isSeeding, setIsSeeding] = useState(false);
  const { data: featured, isLoading: isFeaturedLoading, refetch: refetchFeatured } = useQuery({
    queryKey: ['featured'],
    queryFn: getFeaturedContent,
  });

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      console.log('[Seed] Starting database seeding...');
      await seedDatabase();
      console.log('[Seed] Seeding completed, refetching featured content...');
      await refetchFeatured();
      // Force reload to refresh all rows
      window.location.reload();
    } catch (error: any) {
      console.error('[Seed] Error:', error);
      alert('Failed to seed database:\\n\\n' + (error.message || String(error)) + '\\n\\nSee console for details.');
    } finally {
      setIsSeeding(false);
    }
  };

  const isEmpty = !isFeaturedLoading && !featured;

  return (
    <main className="min-h-screen pb-20 bg-background">
      <Navbar />
      
      {isEmpty ? (
        <div className="relative flex h-[90vh] flex-col items-center justify-center px-4 text-center overflow-hidden">
          <div className="animate-gradient-slow absolute inset-0 z-0 opacity-20" />
          <div className="noise-overlay" />
          
          <div className="relative z-10">
            <h1 className="mb-4 font-sans text-5xl font-black md:text-7xl tracking-tighter uppercase text-white">Every story deserves to be seen</h1>
            <p className="mb-10 max-w-lg mx-auto text-lg text-secondary-text font-medium leading-relaxed">
              Garde is the home for independent filmmakers. <br />
              Submit a film to start the revolution.
            </p>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="rounded-full bg-accent-indigo px-12 py-5 text-lg font-black uppercase tracking-[4px] text-white transition-all hover:scale-105 hover:bg-accent-indigo/90 active:scale-95 disabled:opacity-50 shadow-2xl shadow-accent-indigo/30"
            >
              {isSeeding ? 'Initializing...' : 'Initialize Library'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <HeroBanner content={featured} />
          
          <div className="-mt-32 relative z-10 space-y-12">
            <ContentRow
              title="Now Showing"
              fetchFn={getTrendingContent}
              queryKey="trending"
            />
            <ContentRow
              title="New Releases"
              fetchFn={getNewReleases}
              queryKey="new-releases"
            />
            <ContentRow
              title="Independent Cinema"
              fetchFn={() => getContentByType('movie')}
              queryKey="movies"
            />
            <ContentRow
              title="Original Series"
              fetchFn={() => getContentByType('series')}
              queryKey="series"
            />
          </div>
        </>
      )}
    </main>
  );
}
