import React from 'react';
import { Sparkles, ShieldCheck, Truck, Scissors } from 'lucide-react';

/**
 * LuxuryTrustBar:
 * Horizontal deep forest green trust & service strip inspired by the reference recording.
 * Features delicate gold icons, hairline dividers, and minimal typography.
 */
export const LuxuryTrustBar: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Authentic Craftsmanship',
      subtitle: 'Handcrafted by master artisans'
    },
    {
      icon: ShieldCheck,
      title: '100% Heirloom Silks',
      subtitle: 'Silk Mark certified purity'
    },
    {
      icon: Truck,
      title: 'Safe & Insured Shipping',
      subtitle: 'Express delivery worldwide'
    },
    {
      icon: Scissors,
      title: 'Custom Studio Tailoring',
      subtitle: 'Personalized couture fit'
    }
  ];

  return (
    <section className="relative w-full bg-[#0D261E] py-10 sm:py-14 border-y border-[#B49A62]/20 select-none overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,154,98,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-center">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4 group"
              >
                {/* Gold Crest Icon Circle */}
                <div className="w-11 h-11 rounded-full border border-[#B49A62]/40 bg-[#0B1E18] flex items-center justify-center text-[#B49A62] shrink-0 group-hover:border-[#B49A62] group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-serif text-sm sm:text-base font-semibold text-[#F5F0E7] tracking-wide">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#F5F0E7]/60 font-light">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LuxuryTrustBar;
