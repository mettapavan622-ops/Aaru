import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FounderStorySectionProps {
  onDiscoverStory: () => void;
}

/**
 * FounderStorySection:
 * Editorial portrait & storytelling section inspired by the reference recording
 * ("Tradition lives beautifully." / AARU by Moni).
 */
export const FounderStorySection: React.FC<FounderStorySectionProps> = ({ onDiscoverStory }) => {
  return (
    <section id="aaru-by-moni" className="relative w-full bg-[#FAF7F2] py-24 lg:py-32 overflow-hidden select-none border-b border-[#E8DFD5]">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#B49A62]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Editorial Fashion Portrait Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative gold hairline frame */}
              <div className="absolute -inset-3.5 border border-[#B49A62]/30 pointer-events-none hidden sm:block" />
              
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0D261E] shadow-2xl border border-[#D4C7B5]">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85"
                  alt="Moni, Founder & Creative Director of AARU"
                  className="w-full h-full object-cover object-top filter brightness-95 hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Bottom editorial gradient caption */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#0D261E] via-[#0D261E]/60 to-transparent text-[#F5F0E7]">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B49A62] font-serif block">
                    Founder &amp; Creative Director
                  </span>
                  <p className="font-serif text-2xl font-normal mt-0.5 text-[#F5F0E7]">Moni</p>
                  <p className="text-xs text-[#F5F0E7]/75 font-light italic mt-1">
                    "Intuitive touch, ancient looms, modern sovereignty."
                  </p>
                </div>
              </div>

              {/* Atelier Rare Dexterity Stamp */}
              <div className="absolute -bottom-6 -right-3 bg-[#0D261E] p-4 border border-[#B49A62]/40 shadow-xl max-w-[210px] hidden sm:block text-[#F5F0E7]">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#B49A62] font-serif font-bold block mb-1">
                  Tactile Mastery
                </span>
                <p className="text-[11px] text-[#F5F0E7]/80 leading-snug font-serif italic">
                  Six fingers of intuitive grace guiding every thread of the warp and weft.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative Story */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-px bg-[#8C6D37]/50" />
              <span className="text-[10px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#8C6D37] font-semibold">
                Our Story
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A2E26] tracking-tight leading-[1.12]">
              Tradition lives <span className="italic font-light text-[#8C6D37]">beautifully</span>.
            </h2>

            <p className="font-serif text-xl sm:text-2xl text-[#0F4C5C] italic font-normal leading-relaxed">
              “For our founder, every weave tells an unspoken story of strength.”
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-[#5C5549] font-light leading-relaxed">
              <p>
                With the rare gift of her six fingers, Moni possesses a heightened tactile sensitivity to textile tension, fiber purity, and structural drape. What began as a personal reverence for Indian handlooms blossomed into AARU.
              </p>
              <p>
                Thoughtfully curated sarees, kurtas, and heirloom pieces — bringing India’s finest craftsmanship to your everyday. From personally drafting temple borders in Kanchipuram to orchestrating the gauge of pure gold zari in Varanasi, each piece is woven for tomorrow.
              </p>
              <blockquote className="border-l-2 border-[#B49A62] pl-4 font-serif text-base sm:text-lg text-[#24211E] italic pt-1">
                “Every piece is created to move with you, belong to you, and elevate you.”
              </blockquote>
            </div>

            <div className="pt-4">
              <button
                id="discover-moni-story-btn"
                type="button"
                onClick={onDiscoverStory}
                className="group px-8 py-3.5 bg-[#0F4C5C] hover:bg-[#09323c] text-[#FAF7F2] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 inline-flex items-center gap-3 cursor-pointer shadow-md"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FounderStorySection;
