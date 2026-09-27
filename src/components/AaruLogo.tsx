import React from 'react';

/**
 * Official AARU English Image Logo URL
 * Uses the specific brand mark URL per specification:
 * https://i.postimg.cc/G3f1mLKc/Aaru-Logo-English-Blue-1.png
 */
export const AARU_LOGO_IMAGE_URL = 'https://i.postimg.cc/wxXC9WJG/Whats-App-Image-2026-09-25-at-2-01-33-PM.jpg';

export interface AaruLogoProps {
  className?: string;
  showSubtitle?: boolean; // Kept for backwards-compatibility; tagline strictly removed per specification
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  variant?: 'light' | 'dark';
  displayMode?: 'dual' | 'english' | 'telugu';
  layout?: 'centered' | 'horizontal' | 'left';
  showEmblem?: boolean;
}

/**
 * Authentic Telugu AARU Emblem / Seal
 * Monogram featuring the sacred Telugu script "ఆరు" inside a gold and teal seal.
 */
export const AaruEmblem: React.FC<{ 
  className?: string; 
  size?: number;
  variant?: 'light' | 'dark';
}> = ({ 
  className = "", 
  size, 
  variant = 'light' 
}) => {
  const isDark = variant === 'dark';
  const inlineStyle = size ? { width: size, height: size } : undefined;

  return (
    <div 
      style={inlineStyle}
      className={`relative inline-flex items-center justify-center shrink-0 border border-[#8C6D37]/40 ${
        size ? '' : 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10'
      } ${
        isDark 
          ? 'bg-gradient-to-br from-[#0F4C5C] to-[#072F38] text-[#FAF7F2]' 
          : 'bg-[#FAF7F2] text-[#0F4C5C]'
      } shadow-xs transition-transform duration-300 group-hover:scale-105 select-none ${className}`}
      aria-label="AARU Telugu Seal - ఆరు"
    >
      <div className="absolute inset-[2px] border border-[#8C6D37]/25 pointer-events-none" />
      <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />
      <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />
      <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />
      <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />

      <span 
        style={size ? { fontSize: Math.max(12, Math.round(size * 0.44)) } : undefined}
        className={`${size ? '' : 'text-xs sm:text-sm md:text-base'} font-telugu font-bold tracking-tight leading-none select-none`}
        title="ఆరు - AARU"
      >
        <span className={isDark ? 'text-[#FAF7F2]' : 'text-[#0F4C5C]'}>ఆ</span>
        <span className="text-[#8C6D37]">రు</span>
      </span>
    </div>
  );
};

/**
 * Image-based AARU Couture Brand Mark
 * Uses the specific logo URL: https://i.postimg.cc/G3f1mLKc/Aaru-Logo-English-Blue-1.png
 * Sized and scaled dynamically across mobile, tablet, and desktop viewports without distortion.
 * Maintains zero overlap with adjacent navbar elements, search inputs, or navigation links.
 */
export const AaruArtisticMark: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  variant?: 'light' | 'dark';
  className?: string;
}> = ({
  size = 'responsive',
  variant = 'light',
  className = ""
}) => {
  const isDark = variant === 'dark';

  // Responsive logo heights calibrated across viewports to precisely match reference images
  // Strictly preserves aspect ratio with object-contain and avoids distortion or overlap
  const sizeClasses = {
    sm: "h-8 xs:h-9 sm:h-11 md:h-13 max-h-[52px]",
    md: "h-10 xs:h-11 sm:h-13 md:h-16 max-h-[64px]",
    lg: "h-12 xs:h-14 sm:h-18 md:h-22 lg:h-24 max-h-[96px]",
    xl: "h-14 xs:h-18 sm:h-22 md:h-26 lg:h-30 max-h-[120px]",
    responsive: "h-9 xs:h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18 max-h-[72px]"
  };

  return (
    <img
      src={AARU_LOGO_IMAGE_URL}
      alt="AARU"
      className={`w-auto max-w-full object-contain select-none transition-transform duration-300 group-hover:scale-[1.02] shrink-0 ${
        sizeClasses[size] || sizeClasses.responsive
      } ${
        isDark ? 'brightness-125 contrast-110 drop-shadow-[0_1px_4px_rgba(255,255,255,0.15)]' : ''
      } ${className}`}
      loading="eager"
      decoding="async"
    />
  );
};

/**
 * Telugu AARU Logo Component with enlarged image logo (tagline removed)
 */
export const AaruTeluguLogo: React.FC<AaruLogoProps> = ({
  className = "",
  size = 'md',
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center justify-center gap-2.5 sm:gap-3 text-center select-none ${className}`}>
      <span className={`font-telugu font-bold text-2xl sm:text-3xl ${
        isDark ? 'text-[#FAF7F2]' : 'text-[#0F4C5C]'
      }`}>
        ఆరు
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D37] shrink-0" />
      <AaruArtisticMark size={size} variant={variant} />
    </div>
  );
};

/**
 * Pure English AARU Logo Component using the enlarged image logo (tagline removed)
 */
export const AaruEnglishLogo: React.FC<AaruLogoProps> = ({
  className = "",
  size = 'md',
  variant = 'light',
  layout = 'centered'
}) => {
  return (
    <AaruLogo
      className={className}
      size={size}
      variant={variant}
      layout={layout}
    />
  );
};

/**
 * Full Master AARU Logo Component
 * - Significantly enlarged dimensions across components
 * - The tagline [a woman's sixth element] is completely removed per user specification
 * - Responsive flexbox layout with dedicated spacing that prevents overlap across any screen size
 */
export const AaruLogo: React.FC<AaruLogoProps> = ({
  className = "",
  size = 'responsive',
  variant = 'light',
  displayMode = 'dual',
  layout = 'left',
  showEmblem = false
}) => {
  if (displayMode === 'telugu') {
    return (
      <AaruTeluguLogo 
        className={className} 
        size={size} 
        variant={variant} 
      />
    );
  }

  // Left-aligned Layout (Primary for Header Navbar Placement)
  if (layout === 'left') {
    return (
      <div className={`flex items-center justify-start shrink-0 group select-none ${className}`}>
        <AaruArtisticMark size={size} variant={variant} />
        {showEmblem && (
          <AaruEmblem 
            variant={variant} 
            className="ml-3 hidden md:inline-flex" 
          />
        )}
      </div>
    );
  }

  // Stacked / Centered Layout (Primary for Modals, Auth Screens, and Mobile Navigation)
  if (layout === 'centered') {
    return (
      <div className={`flex items-center justify-center shrink-0 text-center group select-none ${className}`}>
        {showEmblem && (
          <AaruEmblem 
            variant={variant} 
            className="mr-3 hidden md:inline-flex" 
          />
        )}
        <AaruArtisticMark size={size} variant={variant} className="mx-auto" />
      </div>
    );
  }

  // Horizontal Layout (for side-by-side spaces like Footer)
  return (
    <div className={`flex items-center gap-3 sm:gap-4 shrink-0 group select-none ${className}`}>
      {showEmblem && <AaruEmblem variant={variant} className="shrink-0" />}
      <AaruArtisticMark size={size} variant={variant} />
    </div>
  );
};

export default AaruLogo;
