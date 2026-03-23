"use client";

import { Navbar } from '../../components/layout/Navbar';
import { ContentRow } from '../../components/home/ContentRow';
import { useStore } from '../../store/useStore';

export default function MyListPage() {
  const myList = useStore((state) => state.myList);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="pt-32 px-4 md:px-8 lg:px-12">
        <h1 className="mb-8 text-4xl font-black md:text-6xl tracking-tight">My List</h1>
        
        {myList.length > 0 ? (
          <ContentRow title="Saved for Later" items={myList} />
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <p className="text-xl text-secondary-text mb-6">Your list is empty.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="rounded-lg bg-accent-red px-8 py-3 font-bold text-white transition-transform hover:scale-105"
            >
              Browse Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
