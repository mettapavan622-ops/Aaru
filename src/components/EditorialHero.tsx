import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface EditorialHeroProps {
  onExploreClick?: () => void;
  onStoryClick?: () => void;
  onExplore?: () => void;
  onShopNewArrivals?: () => void;
  onSixthElementStory?: () => void;
  onCustomStudio?: () => void;
  onShopLookClick?: () => void;
  onSareesRTSClick?: () => void;
}

/**
 * EditorialHero:
 * Cinematic luxury fashion campaign hero inspired by the atelier reference recording.
 * Features full-bleed campaign photography, deep forest green backdrop (#123A2F),
 * editorial corner annotations, high-contrast serif typography, and minimal rectangular CTAs.
 */
export const EditorialHero: React.FC<EditorialHeroProps> = ({
  onExploreClick,
  onStoryClick,
  onExplore,
  onShopNewArrivals,
  onSixthElementStory
}) => {
  const handlePrimaryCTA = () => {
    if (onExploreClick) onExploreClick();
    else if (onShopNewArrivals) onShopNewArrivals();
    else if (onExplore) onExplore();
    else {
      const el = document.getElementById('curated-collections');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSecondaryCTA = () => {
    if (onStoryClick) onStoryClick();
    else if (onSixthElementStory) onSixthElementStory();
    else {
      const el = document.getElementById('the-sixth-element');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[88vh] lg:min-h-[96vh] flex items-center bg-[#0D261E] overflow-hidden select-none">
      {/* FULL-BLEED CAMPAIGN BACKGROUND IMAGE & LUXURY LIGHTING */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2200&q=90"
          alt="AARU Luxury Couture Campaign"
          className="w-full h-full object-cover object-[center_28%] lg:object-[65%_25%] filter brightness-[0.78] contrast-[1.08] saturate-[1.05] transition-transform duration-1000 ease-out scale-100 hover:scale-[1.01]"
        />

        {/* Ambient Dark Forest Green Gradient Overlays for High Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1E18]/95 via-[#0D261E]/75 to-transparent lg:w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E18] via-transparent to-[#0B1E18]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(180,154,98,0.12),transparent_60%)] pointer-events-none" />
      </div>

      {/* EDITORIAL CORNER ANNOTATIONS (High-Fashion Lookbook Detail) */}
      <div className="absolute top-24 lg:top-28 right-6 lg:right-12 z-10 hidden sm:flex flex-col items-end pointer-events-none text-right">
        <span className="text-[10px] tracking-[0.28em] uppercase font-serif text-[#B49A62]/90">
          A Heritage Woven
        </span>
        <span className="text-[9px] tracking-[0.24em] uppercase text-[#F5F0E7]/60 mt-0.5">
          For Tomorrow
        </span>
      </div>

      <div className="absolute bottom-6 right-6 lg:right-12 z-10 hidden sm:block pointer-events-none text-right">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#B49A62]/80 font-medium">
          Timeless · Ethical · Exquisite
        </span>
      </div>

      <div className="absolute bottom-6 left-6 lg:left-12 z-10 hidden sm:block pointer-events-none">
        <span className="text-[9px] tracking-[0.25em] uppercase text-[#F5F0E7]/60 font-light">
          100% Pure Silks · Silk Mark Certified
        </span>
      </div>

      {/* MAIN EDITORIAL HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-20 lg:py-28 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          
          {/* Eyebrow Kicker */}
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-px bg-[#B49A62]/60" />
            <span className="text-[10px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#B49A62] font-semibold">
              Tradition Meets Tomorrow
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-[#F5F0E7] leading-[1.06] text-balance">
            Clothing as an <span className="italic font-light text-[#B49A62]">invisible force</span> of intuition &amp; strength.
          </h1>

          {/* Subheading Narrative */}
          <p className="font-sans text-xs sm:text-sm lg:text-base text-[#F5F0E7]/80 font-light leading-relaxed max-w-lg tracking-wide">
            At AARU, clothing is not simply worn — it becomes the invisible force that completes her. Handcrafted Banarasi kadwa brocades, featherlight organza, and custom heirloom drapes.
          </p>

          {/* Minimal Rectangular Luxury CTAs (No Rounded Pills) */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-explore-btn"
              type="button"
              onClick={handlePrimaryCTA}
              className="group px-8 py-3.5 sm:py-4 bg-[#B49A62] hover:bg-[#c9ae75] text-[#0D261E] text-xs font-semibold tracking-[0.22em] uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl hover:shadow-[#B49A62]/20"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              id="hero-story-btn"
              type="button"
              onClick={handleSecondaryCTA}
              className="px-8 py-3.5 sm:py-4 bg-transparent hover:bg-white/10 text-[#F5F0E7] text-xs font-medium tracking-[0.22em] uppercase border border-[#F5F0E7]/35 hover:border-[#B49A62] transition-all duration-300 cursor-pointer text-center"
            >
              Discover AARU
            </button>
          </div>

          {/* Subtle Craft Proof Strip */}
          <div className="pt-6 sm:pt-8 flex items-center gap-6 sm:gap-10 border-t border-white/15 text-[#F5F0E7]/80">
            <div>
              <p className="text-xs sm:text-sm font-serif text-[#B49A62] font-semibold">Varanasi &amp; Kanchipuram</p>
              <p className="text-[10px] text-[#F5F0E7]/60 tracking-wider uppercase mt-0.5">Master Weaver Looms</p>
            </div>
            <div className="h-6 w-px bg-white/15" />
            <div>
              <p className="text-xs sm:text-sm font-serif text-[#B49A62] font-semibold">Real Zari &amp; Silks</p>
              <p className="text-[10px] text-[#F5F0E7]/60 tracking-wider uppercase mt-0.5">Heirloom Grade</p>
            </div>
            <div className="h-6 w-px bg-white/15 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-xs sm:text-sm font-serif text-[#B49A62] font-semibold">Custom Atelier</p>
              <p className="text-[10px] text-[#F5F0E7]/60 tracking-wider uppercase mt-0.5">Bespoke Fit</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EditorialHero;
