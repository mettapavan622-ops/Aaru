import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick?: () => void;
  onStoryClick?: () => void;
  onExplore?: () => void;
  onShopNewArrivals?: () => void;
  onSixthElementStory?: () => void;
  onCustomStudio?: () => void;
  onShopLookClick?: () => void;
  onSareesRTSClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onExploreClick, 
  onStoryClick,
  onExplore,
  onShopNewArrivals,
  onSixthElementStory 
}) => {
  const handleShopNewArrivals = () => {
    if (onExploreClick) onExploreClick();
    else if (onShopNewArrivals) onShopNewArrivals();
    else if (onExplore) onExplore();
  };

  const handleStory = () => {
    if (onStoryClick) {
      onStoryClick();
    } else if (onSixthElementStory) {
      onSixthElementStory();
    } else {
      const el = document.getElementById('the-sixth-element');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] lg:min-h-[82vh] flex items-center bg-[#FAF9F5] border-b border-[#E8DFD5] overflow-hidden">
      {/* Clean, Lighter Background Matching the Luxury Reference Design */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#FAF9F5]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#FAF9F5] to-[#FAF7F2]" />
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#F3ECE0]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Eyebrow / Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F5EFE6] border border-[#D4C7B5] text-[#8C6D37] rounded-none">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.22em] uppercase">
                Heirloom Textiles • Studio Collection 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#24211E] leading-[1.12] sm:leading-[1.08]">
              Clothing as an invisible force of <span className="italic font-normal text-[#0F4C5C]">intuition</span> & <span className="text-[#8C6D37] font-normal">strength</span>.
            </h1>

            {/* Body Narrative */}
            <p className="font-sans text-xs sm:text-sm lg:text-base text-[#5C5549] font-light leading-relaxed max-w-xl">
              At AARU, clothing is not just worn — it becomes the invisible force that completes her. Handcrafted Banarasi kadwa brocades, featherlight organza, and custom heirloom drapes crafted with pure silks and natural zari.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                id="hero-explore-btn"
                type="button"
                onClick={handleShopNewArrivals}
                className="px-6 sm:px-7 py-3.5 bg-[#0F4C5C] hover:bg-[#E8B4B8] hover:text-black text-[#FAF7F2] text-xs font-semibold tracking-[0.16em] uppercase shadow-md transition-all duration-300 hover:translate-x-0.5 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center border border-transparent hover:border-[#E8B4B8]"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-story-btn"
                type="button"
                onClick={handleStory}
                className="px-6 sm:px-7 py-3.5 bg-transparent hover:bg-[#E8B4B8] hover:text-black text-[#24211E] text-xs font-semibold tracking-[0.16em] uppercase border border-[#D4C7B5] hover:border-[#E8B4B8] transition-all cursor-pointer w-full sm:w-auto text-center"
              >
                The Sixth Element Story
              </button>
            </div>

            {/* Service Pillars in Light Warm Luxury Aesthetic */}
            <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-3 sm:gap-6 border-t border-[#E8DFD5] text-[#24211E] max-w-lg">
              <div>
                <p className="text-[11px] sm:text-xs font-bold font-serif text-[#0F4C5C]">100% Pure Silks</p>
                <p className="text-[10px] sm:text-[11px] text-[#736B5E] mt-0.5">Silk Mark Certified</p>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold font-serif text-[#0F4C5C]">24h Express</p>
                <p className="text-[10px] sm:text-[11px] text-[#736B5E] mt-0.5">Ready-to-Ship Drapes</p>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold font-serif text-[#0F4C5C]">Custom Studio</p>
                <p className="text-[10px] sm:text-[11px] text-[#736B5E] mt-0.5">Custom Tailoring</p>
              </div>
            </div>
          </div>

          {/* Right Campaign Showcase Imagery with Light Boutique Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative frame */}
              <div className="absolute -inset-3 border border-[#D4C7B5]/60 bg-white/40 pointer-events-none hidden sm:block" />
              
              <div className="relative overflow-hidden bg-white shadow-xl border border-[#E8DFD5]">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
                  alt="AARU Luxury Heirloom Saree Collection"
                  className="w-full h-[460px] sm:h-[520px] object-cover object-top hover:scale-102 transition-transform duration-700"
                />
                
                {/* Floating atelier caption badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3.5 border border-[#E8DFD5] shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37] block">Featured Creation</span>
                    <p className="font-serif text-xs font-semibold text-[#24211E]">Kavya Emerald Banarasi Tissue Saree</p>
                  </div>
                  <span className="text-xs font-sans font-bold text-[#0F4C5C]">₹28,900</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
