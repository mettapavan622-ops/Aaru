import React from 'react';
import { Eye, Feather, Zap, Compass, Shield, HeartHandshake } from 'lucide-react';

export const SixthElementSection: React.FC<{ onExploreCollection?: () => void }> = ({ onExploreCollection }) => {
  const pillars = [
    {
      title: 'Intuition',
      subtitle: 'The inner compass',
      description: 'Drapes that move with innate poise, anticipating every step with effortless kinetic grace.',
      icon: Eye,
      accent: '#0F4C5C'
    },
    {
      title: 'Softness',
      subtitle: 'Tactile gentleness',
      description: 'Featherlight mulberry silk and hand-spun muslin that caress like a second skin.',
      icon: Feather,
      accent: '#C08081'
    },
    {
      title: 'Power',
      subtitle: 'Unspoken presence',
      description: 'Regal proportions, architectural borders, and deep jewel palettes commanding quiet authority.',
      icon: Zap,
      accent: '#9C7C38'
    },
    {
      title: 'Confidence',
      subtitle: 'Effortless stature',
      description: 'Structured silhouettes and tailored fall that free the mind from distraction.',
      icon: Compass,
      accent: '#2D5A46'
    },
    {
      title: 'Strength',
      subtitle: 'Resilience of warp & weft',
      description: 'Triple-twisted silk filaments and interlocking Korvai weaves built to endure across generations.',
      icon: Shield,
      accent: '#0F4C5C'
    },
    {
      title: 'Protection',
      subtitle: 'Sacred embrace',
      description: 'Textiles as an energetic shield, wrapping the woman in auspicious grace and ceremonial warmth.',
      icon: HeartHandshake,
      accent: '#9C7C38'
    }
  ];

  return (
    <section id="the-sixth-element" className="py-20 lg:py-28 bg-[#FAF9F5] border-y border-[#E8DFD5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Manifesto Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#8C6D37]">
            The Brand Manifesto
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0F4C5C] tracking-tight">
            AARU — The Sixth Element of a Woman
          </h2>
          
          <div className="pt-2 text-sm sm:text-base font-light text-[#5C5549] space-y-2 leading-relaxed">
            <p className="font-serif italic text-lg sm:text-xl text-[#24211E]">
              Nature gives us five elements — Earth. Water. Fire. Air. Sky.
            </p>
            <p className="font-medium text-[#0F4C5C] uppercase tracking-widest text-xs">
              We believe there is one more.
            </p>
            <p className="text-[#24211E] font-serif text-xl sm:text-2xl font-semibold">
              AARU is the Sixth Element —
            </p>
            <p className="text-xs sm:text-sm tracking-[0.16em] uppercase text-[#736B5E] font-medium">
              Intuition • Softness • Power • Confidence • Strength • Protection
            </p>
          </div>

          <p className="pt-3 text-xs sm:text-sm text-[#736B5E] max-w-xl mx-auto font-light leading-relaxed">
            At AARU, clothing is not just worn — it becomes the invisible force that completes her.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white/70 border border-[#E8DFD5] p-7 hover:border-[#0F4C5C]/50 hover:bg-white transition-all duration-300 hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-10 h-10 rounded-none flex items-center justify-center transition-colors group-hover:scale-105"
                      style={{ backgroundColor: `${pillar.accent}15`, color: pillar.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-serif text-xs italic text-[#A89882]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#24211E] mb-1 group-hover:text-[#0F4C5C] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#8C6D37] mb-3">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs text-[#736B5E] leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-[#E8DFD5]/50 flex items-center justify-between text-[11px] text-[#0F4C5C] font-semibold">
                  <span className="uppercase tracking-widest text-[10px]">Sixth Element Capsule</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pillar.accent }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive CTA */}
        {onExploreCollection && (
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F4C5C] hover:bg-[#E8B4B8] hover:text-black border border-transparent hover:border-[#E8B4B8] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200 shadow-md cursor-pointer"
            >
              Shop The Sixth Element Edition
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
