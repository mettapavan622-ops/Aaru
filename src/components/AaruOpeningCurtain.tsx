import React, { useEffect, useState } from 'react';
import { AARU_LOGO_IMAGE_URL } from './AaruLogo';

interface AaruOpeningCurtainProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

/**
 * AaruOpeningCurtain:
 * Cinematic luxury couture curtain reveal inspired by high-end fashion ateliers.
 * Features realistic deep burgundy fabric folds, centered AARU gold seal,
 * soft lighting aura, and cinematic center-parting reveal.
 *
 * Sequence:
 * 0.0s - 0.3s: Screen filled with deep burgundy couture drapery.
 * 0.3s - 1.2s: Centered AARU brand emblem fades in with subtle gold glow.
 * 1.2s - 2.8s: Curtains slide open from center to left and right edges with cubic-bezier easing.
 * 2.5s - 3.2s: Homepage hero emerges beneath.
 * 3.2s: Curtain unmounts cleanly from DOM, restoring standard scrolling.
 */
export const AaruOpeningCurtain: React.FC<AaruOpeningCurtainProps> = ({
  onComplete,
  forceShow = false
}) => {
  const [isVisible, setIsVisible] = useState(() => {
    if (forceShow) return true;
    if (typeof window === 'undefined') return false;
    // Check if curtain has already been shown in this session
    const hasSeenCurtain = sessionStorage.getItem('aaru_curtain_shown');
    return !hasSeenCurtain;
  });

  const [stage, setStage] = useState<'closed' | 'logo-in' | 'parting' | 'finished'>('closed');

  useEffect(() => {
    if (!isVisible) {
      if (onComplete) onComplete();
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      sessionStorage.setItem('aaru_curtain_shown', 'true');
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }

    // Prevent body scrolling while curtain is active
    document.body.style.overflow = 'hidden';

    // Timeline Sequence
    const t1 = setTimeout(() => {
      setStage('logo-in');
    }, 250);

    const t2 = setTimeout(() => {
      setStage('parting');
    }, 1200);

    const t3 = setTimeout(() => {
      setStage('finished');
      setIsVisible(false);
      document.body.style.overflow = '';
      sessionStorage.setItem('aaru_curtain_shown', 'true');
      if (onComplete) onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = '';
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const isParting = stage === 'parting' || stage === 'finished';

  // Realistic vertical curtain panel folds (8 panels on left, 8 on right)
  const foldPattern = [
    'from-[#240B12] via-[#4A1F2B] to-[#1E080F]',
    'from-[#1E080F] via-[#542332] to-[#2B0E17]',
    'from-[#2B0E17] via-[#461D29] to-[#1A070D]',
    'from-[#1A070D] via-[#5C2737] to-[#260C14]',
    'from-[#260C14] via-[#4A1F2B] to-[#1E080F]',
    'from-[#1E080F] via-[#542332] to-[#2B0E17]',
    'from-[#2B0E17] via-[#461D29] to-[#1A070D]',
    'from-[#1A070D] via-[#5C2737] to-[#240B12]',
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* LEFT CURTAIN PANEL */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-1/2 flex overflow-hidden shadow-[25px_0_50px_rgba(0,0,0,0.85)] z-20 transition-transform duration-[1600ms] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
        style={{
          transform: isParting ? 'translateX(-100%)' : 'translateX(0%)',
        }}
      >
        {foldPattern.map((gradient, i) => (
          <div 
            key={`left-fold-${i}`}
            className={`flex-1 h-full bg-gradient-to-r ${gradient} relative`}
          >
            {/* Ambient vertical fold highlight */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/[0.07] blur-[1px]" />
            {/* Deep fabric shadow crease */}
            <div className="absolute inset-y-0 right-0 w-2.5 bg-black/40 blur-[2px]" />
          </div>
        ))}
        {/* Subtle fabric top header shadow */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        {/* Center seam shadow border */}
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/70 to-transparent pointer-events-none" />
      </div>

      {/* RIGHT CURTAIN PANEL */}
      <div 
        className="absolute top-0 bottom-0 right-0 w-1/2 flex overflow-hidden shadow-[-25px_0_50px_rgba(0,0,0,0.85)] z-20 transition-transform duration-[1600ms] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
        style={{
          transform: isParting ? 'translateX(100%)' : 'translateX(0%)',
        }}
      >
        {foldPattern.map((gradient, i) => (
          <div 
            key={`right-fold-${i}`}
            className={`flex-1 h-full bg-gradient-to-r ${gradient} relative`}
          >
            {/* Ambient vertical fold highlight */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/[0.07] blur-[1px]" />
            {/* Deep fabric shadow crease */}
            <div className="absolute inset-y-0 left-0 w-2.5 bg-black/40 blur-[2px]" />
          </div>
        ))}
        {/* Subtle fabric top header shadow */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        {/* Center seam shadow border */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/70 to-transparent pointer-events-none" />
      </div>

      {/* CENTERED LOGO & AURA PRESENTATION */}
      <div 
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-out ${
          stage === 'closed' 
            ? 'opacity-0 scale-95' 
            : isParting 
              ? 'opacity-0 scale-105 blur-sm' 
              : 'opacity-100 scale-100'
        }`}
      >
        {/* Ambient gold/amber glow */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#B49A62]/15 blur-3xl pointer-events-none animate-pulse" />

        {/* Traditional Ornamental Arch Frame around Emblem */}
        <div className="relative p-6 sm:p-8 rounded-full border border-[#B49A62]/40 bg-[#1A070D]/70 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center">
          {/* Inner hairline ring */}
          <div className="absolute inset-2 rounded-full border border-[#B49A62]/20 pointer-events-none" />

          {/* Central Logo Asset */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Telugu Sacred Monogram */}
            <span className="font-telugu text-xl sm:text-2xl font-bold tracking-widest text-[#B49A62] drop-shadow-[0_2px_8px_rgba(180,154,98,0.5)]">
              ఆరు
            </span>
            
            {/* AARU Brand Mark Image */}
            <img 
              src={AARU_LOGO_IMAGE_URL} 
              alt="AARU Atelier" 
              className="h-10 sm:h-14 md:h-16 w-auto object-contain my-2 filter brightness-125 contrast-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" 
            />

            {/* Tagline / Subtitle */}
            <span className="text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-[#F5F0E7]/90 font-serif font-light mt-1">
              The Sixth Element
            </span>
          </div>

          {/* Micro gold corner flourishes */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#B49A62]" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#B49A62]" />
        </div>

        {/* Editorial Sub-caption */}
        <p className="mt-6 text-xs sm:text-sm font-serif italic tracking-widest text-[#F5F0E7]/80 text-center max-w-xs drop-shadow-md">
          Tradition Woven Into Intuition
        </p>
      </div>
    </div>
  );
};

export default AaruOpeningCurtain;
