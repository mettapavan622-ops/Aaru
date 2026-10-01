import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ArchCollectionSpotlightProps {
  onSelectCategory?: (category: string) => void;
}

/**
 * ArchCollectionSpotlight:
 * Recreates the arched architectural window showcase from the reference recording.
 * Features 3 stately arches with gold hairline trims, rich photography, and minimal explore CTAs.
 */
export const ArchCollectionSpotlight: React.FC<ArchCollectionSpotlightProps> = ({
  onSelectCategory
}) => {
  const arches = [
    {
      id: 'sarees',
      category: 'Sarees',
      badge: 'New Collection',
      title: 'Heirloom Sarees',
      subtitle: 'Tradition in a new light.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      cta: 'Explore Sarees'
    },
    {
      id: 'kurtas',
      category: 'Kurtas & Sets',
      badge: 'Festive & Studio',
      title: 'Kurta Ensembles',
      subtitle: 'Everyday elegance, elevated.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      cta: 'Explore Kurtas'
    },
    {
      id: 'lehengas',
      category: 'Lehengas',
      badge: 'Bespoke Atelier',
      title: 'Dresses & Lehengas',
      subtitle: 'Modern silhouettes for every you.',
      image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85',
      cta: 'Explore Lehengas'
    }
  ];

  return (
    <section className="relative w-full bg-[#0D261E] py-20 lg:py-28 overflow-hidden select-none border-b border-[#B49A62]/20">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,154,98,0.06),transparent_70%)] pointer-events-none" />

      {/* Side Editorial Watermark Annotations */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 hidden xl:block pointer-events-none">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#B49A62]/50 [writing-mode:vertical-lr] rotate-180 font-serif">
          Modern · Rooted · Always You
        </p>
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden xl:block pointer-events-none">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#B49A62]/50 [writing-mode:vertical-lr] font-serif">
          Elegance Lives In Every Detail
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-18 space-y-3">
          <span className="text-[10px] sm:text-xs font-serif tracking-[0.32em] uppercase text-[#B49A62] font-semibold block">
            New Arrivals
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F5F0E7] tracking-tight">
            New Collections for Women
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F0E7]/70 font-light tracking-wide max-w-md mx-auto">
            Fresh silhouettes. Timeless craftsmanship. Made for you.
          </p>
        </div>

        {/* 3 Arched Window Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {arches.map((arch) => (
            <div
              key={arch.id}
              onClick={() => onSelectCategory && onSelectCategory(arch.category)}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Arched Photo Frame (rounded-t-full) */}
              <div className="relative w-full aspect-[3/4.6] rounded-t-full overflow-hidden border border-[#B49A62]/40 bg-[#0B1E18] shadow-2xl transition-all duration-500 group-hover:border-[#B49A62] group-hover:shadow-[0_12px_40px_rgba(180,154,98,0.18)]">
                {/* Image with zoom on hover */}
                <img
                  src={arch.image}
                  alt={arch.title}
                  className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Subtle dark gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D261E] via-transparent to-transparent opacity-80" />

                {/* Inner Arch Hairline */}
                <div className="absolute inset-2.5 rounded-t-full border border-[#B49A62]/20 pointer-events-none transition-colors group-hover:border-[#B49A62]/50" />
              </div>

              {/* Arch Caption & Information */}
              <div className="text-center mt-5 space-y-1.5 w-full">
                <span className="text-[9px] tracking-[0.28em] uppercase text-[#B49A62] font-serif font-bold block">
                  {arch.badge}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F5F0E7] group-hover:text-[#B49A62] transition-colors">
                  {arch.title}
                </h3>
                <p className="text-xs text-[#F5F0E7]/60 font-light">
                  {arch.subtitle}
                </p>
                
                {/* Minimal CTA link */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B49A62] group-hover:text-white transition-colors border-b border-[#B49A62]/40 pb-0.5 group-hover:border-white">
                    <span>{arch.cta}</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Traditional Ornamental Arch Pagination Divider */}
        <div className="mt-14 flex items-center justify-center gap-3">
          <span className="w-12 h-px bg-[#B49A62]/30" />
          <span className="text-[10px] font-serif tracking-[0.25em] text-[#B49A62]/80 uppercase">
            Handcrafted with Precision
          </span>
          <span className="w-12 h-px bg-[#B49A62]/30" />
        </div>

      </div>
    </section>
  );
};

export default ArchCollectionSpotlight;
