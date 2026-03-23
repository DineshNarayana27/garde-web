import { useRouter } from 'next/navigation';
import { Star, Play, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { Content } from '../../types';
import { Badge } from '../ui';

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const router = useRouter();
  const { addToList, removeFromList, isInList } = useStore();
  const inList = isInList(content.id);

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inList) {
      removeFromList(content.id);
    } else {
      addToList(content);
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${content.id}`);
  };

  // Design system logic for badges
  const isRising = content.view_count > 1000; // RISING: fast growing content
  const isNew = new Date(content.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // NEW: added in last 7 days
  const isAward = content.rating && parseFloat(content.rating) > 8.5; // Award winner heuristic

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative w-[180px] flex-shrink-0 cursor-pointer"
      onClick={() => router.push(`/detail/${content.id}`)}
    >
      {/* Poster Image — 180×270px portrait ratio */}
      <div className="relative w-[180px] h-[270px] overflow-hidden rounded-xl border border-[#1E1E30] bg-[#0D0D18] transition-all duration-500 group-hover:border-[#6366F1]/50 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
        {content.thumbnail_url ? (
          <div className="h-full w-full">
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('bg-gradient-to-br', 'from-[#0D0D18]', 'to-[#1A1A2E]', 'flex', 'items-center', 'justify-center');
                  const span = document.createElement('span');
                  span.className = 'text-[10px] font-900 tracking-[3px] text-white/20 uppercase';
                  span.innerText = 'Garde';
                  parent.appendChild(span);
                }
              }}
            />
            {/* Dark gradient for text readability at the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#080810] to-transparent" />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#0D0D18] to-[#1A1A2E] flex items-center justify-center">
             <span className="text-[10px] font-900 tracking-[3px] text-white/20 uppercase">Garde</span>
          </div>
        )}

        {/* Status Badges — small and clean */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20">
          {isNew && <Badge variant="new" className="px-2 py-0.5 text-[8px] font-700">NEW</Badge>}
          {isRising && <Badge variant="rising" className="px-2 py-0.5 text-[8px] font-700">RISING</Badge>}
          {isAward && <Badge variant="award" className="px-2 py-0.5 text-[8px] font-700">AWARD</Badge>}
        </div>

        {/* Action Overlay — Pill style, centered on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]">
          <div className="flex items-center bg-[#1E1E30]/90 border border-white/10 rounded-full overflow-hidden shadow-2xl">
            <button 
              onClick={handlePlay}
              className="flex h-10 w-12 items-center justify-center bg-[#6366F1] text-white hover:bg-[#4F46E5] transition-colors"
            >
              <Play size={16} fill="currentColor" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button 
              onClick={handleToggleList}
              className="flex h-10 w-12 items-center justify-center text-white hover:bg-white/5 transition-colors"
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Card Info — structure from referencestyle.html */}
      <div className="mt-3 px-1">
        <h3 className="text-[13px] font-600 text-white line-clamp-1 group-hover:text-[#6366F1] transition-colors duration-200">
          {content.title}
        </h3>
        <p className="mt-0.5 text-[11px] text-[#8888A8]">
          Garde Films · {content.year}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[#F5C518] font-700 text-[10px]">
            ★ {content.rating}
          </span>
          <span className="text-[#1E1E30] text-[10px]">·</span>
          <span className="text-[#8888A8] text-[10px] uppercase tracking-wider">{content.view_count}K screenings</span>
        </div>
      </div>
    </motion.div>
  );
}
