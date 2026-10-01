import React from 'react';
import { Eye, Feather, Zap, Compass, Shield, HeartHandshake, ArrowRight } from 'lucide-react';

interface SixthElementSectionProps {
  onExploreCollection?: () => void;
}

/**
 * SixthElementSection:
 * Elevated luxury fashion house manifesto for AARU.
 * Articulates the 5 natural elements and establishes AARU as the Sixth Element:
 * Intuition, Softness, Power, Confidence, Strength, Protection.
 */
export const SixthElementSection: React.FC<SixthElementSectionProps> = ({ 
  onExploreCollection 
}) => {
  const pillars = [
    {
      index: '01',
      title: 'Intuition',
      subtitle: 'The Inner Compass',
      description: 'Drapes that move with innate poise, anticipating every step with effortless kinetic grace.',
      icon: Eye
    },
    {
      index: '02',
      title: 'Softness',
      subtitle: 'Tactile Gentleness',
      description: 'Featherlight mulberry silk and hand-spun organza that caress like a second skin.',
      icon: Feather
    },
    {
      index: '03',
      title: 'Power',
      subtitle: 'Unspoken Presence',
      description: 'Regal proportions, architectural borders, and deep jewel palettes commanding quiet authority.',
      icon: Zap
    },
    {
      index: '04',
      title: 'Confidence',
      subtitle: 'Effortless Stature',
      description: 'Structured silhouettes and tailored fall that free the mind from distraction.',
      icon: Compass
    },
    {
      index: '05',
      title: 'Strength',
      subtitle: 'Resilience of Warp & Weft',
      description: 'Triple-twisted silk filaments and interlocking Korvai weaves built to endure across generations.',
      icon: Shield
    },
    {
      index: '06',
      title: 'Protection',
      subtitle: 'Sacred Embrace',
      description: 'Textiles as an energetic shield, wrapping the woman in auspicious grace and ceremonial warmth.',
      icon: HeartHandshake
    }
  ];

  return (
    <section id="the-sixth-element" className="relative w-full bg-[#0D261E] py-24 lg:py-32 overflow-hidden select-none border-y border-[#B49A62]/20">
      {/* Background radial lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(180,154,98,0.1),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Core Manifesto Statement Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-3 justify-center">
            <span className="w-8 h-px bg-[#B49A62]/60" />
            <span className="text-[10px] sm:text-xs font-serif tracking-[0.32em] uppercase text-[#B49A62] font-semibold">
              The Brand Manifesto
            </span>
            <span className="w-8 h-px bg-[#B49A62]/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F5F0E7] tracking-tight leading-[1.12]">
            AARU — The Sixth Element of a Woman
          </h2>

          <div className="pt-3 space-y-2 text-[#F5F0E7]/80">
            <p className="font-serif italic text-lg sm:text-2xl text-[#B49A62]">
              Nature gives five elements — Earth · Water · Fire · Air · Sky.
            </p>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[#F5F0E7]/90 font-medium">
              We believe there is one more.
            </p>
          </div>

          <p className="pt-2 text-xs sm:text-sm text-[#F5F0E7]/70 font-light leading-relaxed max-w-xl mx-auto">
            At AARU, clothing is not simply worn — it becomes the invisible force that completes her: intuition, softness, power, confidence, strength, and protection.
          </p>
        </div>

        {/* 6 Pillars in an Editorial 3-Column Luxury Matrix */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative bg-[#0B1E18]/80 border border-[#B49A62]/20 hover:border-[#B49A62]/60 p-8 sm:p-9 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Micro corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#B49A62]/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#B49A62]/40" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 border border-[#B49A62]/40 flex items-center justify-center text-[#B49A62] group-hover:bg-[#B49A62] group-hover:text-[#0D261E] transition-all duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-sm tracking-widest text-[#B49A62]/60 font-mono">
                      {pillar.index}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-normal text-[#F5F0E7] group-hover:text-[#B49A62] transition-colors mb-1">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-[10px] tracking-[0.22em] uppercase font-serif text-[#B49A62]/80 mb-3">
                    {pillar.subtitle}
                  </p>

                  <p className="text-xs text-[#F5F0E7]/65 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#F5F0E7]/50 font-serif">
                  <span>Atelier Capsule</span>
                  <span className="text-[#B49A62] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action CTA */}
        {onExploreCollection && (
          <div className="mt-16 text-center">
            <button
              type="button"
              onClick={onExploreCollection}
              className="group px-8 py-4 bg-[#B49A62] hover:bg-[#c9ae75] text-[#0D261E] text-xs font-semibold tracking-[0.22em] uppercase transition-all duration-300 inline-flex items-center gap-3 cursor-pointer shadow-xl hover:shadow-[#B49A62]/20"
            >
              <span>Explore The Sixth Element Edition</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default SixthElementSection;
