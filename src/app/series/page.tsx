"use client";

import { Navbar } from '../../components/layout/Navbar';
import { ContentRow } from '../../components/home/ContentRow';
import { getContentByType } from '../../lib/api/content';

export default function SeriesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="pt-32 px-4 md:px-8 lg:px-12">
        <h1 className="mb-8 text-4xl font-black md:text-6xl tracking-tight">Series</h1>
        
        <div className="space-y-12">
          <ContentRow 
            title="Popular Series" 
            fetchFn={() => getContentByType('series')} 
            queryKey="series-popular"
          />
          <ContentRow 
            title="New Releases" 
            fetchFn={() => getContentByType('series')} 
            queryKey="series-new"
          />
        </div>
      </div>
    </div>
  );
}
