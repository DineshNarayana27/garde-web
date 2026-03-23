import { useRouter } from 'next/navigation';
import { Play, Plus, Info, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { Content } from '../../types';
import { Badge, Button } from '../ui';

interface HeroBannerProps {
  content?: Content | null;
}

export function HeroBanner({ content }: HeroBannerProps) {
  const router = useRouter();
  const { addToList, removeFromList, isInList } = useStore();
  
  if (!content) {
    return (
      <div className="relative h-[92vh] w-full overflow-hidden bg-background shimmer">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
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
    <div className="relative h-[92vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${content.backdrop_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Noise Overlay */}
      <div className="noise-overlay opacity-10" />

      {/* Hero Content */}
      <div className="relative flex h-full max-w-7xl flex-col justify-end pb-32 px-safe-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Featured Badge */}
          <div className="mb-4">
            <span className="inline-block bg-accent-indigo text-white text-[10px] font-700 px-2 py-1 rounded tracking-[1px] uppercase">
              Featured Film
            </span>
          </div>

          {/* Title — Display typography */}
          <h1 className="mb-4 text-[36px] md:text-[48px] lg:text-[56px] font-900 uppercase text-white tracking-[-1px] leading-[1.1] max-w-xl">
            {content.title}
          </h1>

          {/* Meta Information */}
          <div className="mb-6 flex flex-wrap items-center gap-2.5 text-[12px] font-500 uppercase tracking-wide">
            <span className="text-accent-gold font-700">★ {content.rating}</span>
            <span className="text-[#8888A8]">·</span>
            <span className="text-[#8888A8]">{content.year}</span>
            <span className="text-[#8888A8]">·</span>
            {content.duration && (
              <>
                <span className="text-[#8888A8]">{content.duration}</span>
                <span className="text-[#8888A8]">·</span>
              </>
            )}
            <span className="text-accent-indigo">{content.type}</span>
          </div>

          {/* Description */}
          <p className="mb-8 text-[14px] text-[#8888A8] line-clamp-3 leading-relaxed max-w-lg font-400">
            {content.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary"
              size="lg"
              onClick={() => router.push(`/watch/${content.id}`)}
              className="gap-2"
            >
              <Play size={18} fill="currentColor" />
              Watch Now
            </Button>
            <Button 
              variant="secondary"
              size="lg"
              onClick={handleToggleList}
              className="gap-2"
            >
              {inList ? <Check size={18} /> : <Plus size={18} />}
              {inList ? 'In Watchlist' : '+ Watchlist'}
            </Button>
            <Button 
              variant="ghost"
              size="lg"
              onClick={() => router.push(`/detail/${content.id}`)}
              className="gap-2"
            >
              <Info size={18} />
              More Info
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
