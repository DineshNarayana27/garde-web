"use client";

import { Navbar } from '../../components/layout/Navbar';
import { ContentRow } from '../../components/home/ContentRow';
import { getContentByType } from '../../lib/api/content';

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="pt-32">
        <div className="px-4 md:px-8 lg:px-12 mb-12">
          <h1 className="text-[36px] font-900 tracking-[-1px] text-white">Films</h1>
          <p className="text-[#8888A8] text-[14px] mt-2 max-w-xl">
            Explore our curated collection of independent cinema and blockbuster productions.
          </p>
        </div>

        <div className="space-y-6">
          <ContentRow
            title="Action Movies"
            fetchFn={() => getContentByType('movie')}
            queryKey="movies-action"
          />
          <ContentRow
            title="Drama & Thrillers"
            fetchFn={() => getContentByType('movie')}
            queryKey="movies-drama"
          />
        </div>
      </div>
    </div>
  );
}
