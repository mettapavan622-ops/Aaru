import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface FounderStorySectionProps {
  onDiscoverStory: () => void;
}

export const FounderStorySection: React.FC<FounderStorySectionProps> = ({ onDiscoverStory }) => {
  return (
    <section id="aaru-by-moni" className="py-20 lg:py-28 bg-[#F5EFE6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Atelier & Portrait Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden bg-[#FAF7F2] border border-[#D4C7B5] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85"
                alt="Moni, Founder & Master Couturier of AARU"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24211E]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#E0B0B1]">
                  Founder & Creative Director
                </span>
                <p className="font-serif text-2xl font-bold tracking-wide">Moni</p>
                <p className="text-xs text-[#FAF7F2]/80 mt-0.5 font-light">
                  "Intuitive touch, ancient looms, modern sovereignty."
                </p>
              </div>
            </div>

            {/* Subtle Overlay Card: Tactile Mastery */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-5 shadow-xl border border-[#E8DFD5] max-w-[240px] hidden sm:block">
              <div className="flex items-center gap-2 text-[#9C7C38] mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Rare Dexterity</span>
              </div>
              <p className="text-xs text-[#5C5549] leading-snug font-serif italic">
                Six fingers of intuitive grace guiding every thread of the warp and weft.
              </p>
            </div>
          </div>

          {/* Narrative Editorial Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F4C5C]/10 text-[#0F4C5C] text-[11px] font-semibold uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              The Founder’s Chronicle
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#24211E] tracking-tight leading-[1.15]">
              AARU by Moni
            </h2>

            <p className="font-serif text-xl sm:text-2xl text-[#0F4C5C] italic font-normal">
              “For our founder, every weave tells a story.”
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-[#5C5549] font-light leading-relaxed">
              <p>
                With the rare gift of her six fingers, Moni possesses a heightened tactile sensitivity to textile tension, fiber purity, and structural drape. What began as a personal relationship with handlooms blossomed into AARU.
              </p>
              <p>
                She transforms fabric into more than an outfit — into <strong className="font-semibold text-[#24211E]">grace, strength, and protection</strong>. From personally drafting temple borders in Kanchipuram to orchestrating the exact gauge of pure gold zari in Varanasi, each creation is an extension of maternal protection and artistic intuition.
              </p>
              <p className="font-serif text-base sm:text-lg text-[#24211E] font-medium italic pt-2">
                “Every piece is created to move with you, belong to you, and elevate you.”
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                id="discover-moni-story-btn"
                type="button"
                onClick={onDiscoverStory}
                className="px-6 py-3 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                Discover the Story & Atelier
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="https://wa.me/919876543210?text=Hello%20Moni%20Atelier,%20I%20would%20love%20to%20know%20more%20about%20your%20signature%20handloom%20creations."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-[#9C7C38] text-[#9C7C38] hover:bg-[#9C7C38]/10 text-xs font-semibold uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                Request Founder Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
