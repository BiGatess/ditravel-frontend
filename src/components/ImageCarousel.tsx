import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  "https://images.unsplash.com/photo-1544405335-50ea7ffc753b?auto=format&fit=crop&q=80&w=400", // Bana 1
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=400", // Bana 2
  "https://images.unsplash.com/photo-1579224163901-ec061ca97a3a?auto=format&fit=crop&q=80&w=400", // Bana 3
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=400", // Bana 4
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=400"  // Bana 5
];

export default function ImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Calculate width of one item + gap
      const itemWidth = scrollRef.current.clientWidth / 3;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -itemWidth : itemWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-6 group">
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory rounded-[4px] hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {IMAGES.map((src, idx) => (
          <div key={idx} className="w-[calc(33.333%-5.33px)] shrink-0 h-[160px] snap-start">
            <img src={src} className="w-full h-full object-cover rounded-[4px]" alt={`Trải nghiệm ${idx + 1}`} />
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
