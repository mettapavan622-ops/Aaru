import React from 'react';

interface AaruLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  variant?: 'light' | 'dark';
  displayMode?: 'dual' | 'english' | 'telugu';
}

/**
 * Authentic Telugu AARU Emblem / Seal
 * Clean, high-definition designer monogram featuring the sacred Telugu script "ఆరు"
 * set inside an architectural zari gold and royal peacock teal seal.
 * (No bulky, distorted hand-drawn SVG paths - crisp, legible, authentic).
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
        size ? '' : 'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10'
      } ${
        isDark 
          ? 'bg-gradient-to-br from-[#0F4C5C] to-[#072F38] text-[#FAF7F2]' 
          : 'bg-[#FAF7F2] text-[#0F4C5C]'
      } shadow-xs transition-transform duration-300 group-hover:scale-105 select-none ${className}`}
      aria-label="AARU Telugu Seal - ఆరు"
    >
      {/* Delicate Inner Framing Ring */}
      <div className="absolute inset-[2px] border border-[#8C6D37]/25 pointer-events-none" />

      {/* 4 Tiny Corner Zari Accents */}
      <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />
      <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />
      <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />
      <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#8C6D37]" />

      {/* Authentic Telugu Script "ఆరు" */}
      <span 
        style={size ? { fontSize: Math.max(12, Math.round(size * 0.46)) } : undefined}
        className={`${size ? '' : 'text-[11px] sm:text-xs md:text-sm'} font-telugu font-bold tracking-tight leading-none select-none`}
        title="ఆరు - The Sixth Element"
      >
        <span className={isDark ? 'text-[#FAF7F2]' : 'text-[#0F4C5C]'}>ఆ</span>
        <span className="text-[#8C6D37]">రు</span>
      </span>
    </div>
  );
};

/**
 * Pure Telugu AARU Logo Component
 * Clearly and properly presents the Telugu brand identity "ఆరు"
 */
export const AaruTeluguLogo: React.FC<AaruLogoProps> = ({
  className = "",
  showSubtitle = true,
  size = 'md',
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  const teluguFontSizes = {
    sm: "text-xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl",
    responsive: "text-lg sm:text-2xl md:text-3xl"
  };

  const subtitleClasses = {
    sm: "text-[8px] tracking-[0.22em]",
    md: "text-[9px] sm:text-[10px] tracking-[0.26em]",
    lg: "text-[10px] sm:text-[11px] tracking-[0.3em]",
    xl: "text-[12px] tracking-[0.32em]",
    responsive: "hidden sm:block text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.20em] sm:tracking-[0.26em]"
  };

  return (
    <div className={`flex items-center ${size === 'responsive' ? 'gap-1.5 sm:gap-2.5 md:gap-3' : 'gap-3'} group select-none ${className}`}>
      {/* Telugu Typography Logo */}
      <div className="flex flex-col items-start leading-none">
        <div className="flex items-baseline gap-2">
          <span className={`font-telugu font-bold tracking-wide ${teluguFontSizes[size]} ${
            isDark ? 'text-[#FAF7F2]' : 'text-[#0F4C5C]'
          }`}>
            ఆరు
          </span>
          <span className={`${size === 'responsive' ? 'w-1 h-1 sm:w-1.5 sm:h-1.5' : 'w-1.5 h-1.5'} rounded-full bg-[#8C6D37] shrink-0`} />
          <span className={`font-serif ${size === 'responsive' ? 'text-xs sm:text-sm' : 'text-sm'} tracking-[0.2em] font-medium ${
            isDark ? 'text-[#D4C7B5]' : 'text-[#736B5E]'
          }`}>
            (AARU)
          </span>
        </div>

        {showSubtitle && (
          <span className={`font-sans uppercase font-semibold mt-1 ${subtitleClasses[size]} ${
            isDark ? 'text-[#D4C7B5]' : 'text-[#8C6D37]'
          }`}>
            A Woman’s Sixth Element
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Pure English AARU Logo Component
 * High-end haute couture English typography wordmark
 */
export const AaruEnglishLogo: React.FC<AaruLogoProps> = ({
  className = "",
  showSubtitle = true,
  size = 'md',
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  const textClasses = {
    sm: "text-xl tracking-[0.24em]",
    md: "text-2xl sm:text-3xl tracking-[0.26em]",
    lg: "text-3xl sm:text-4xl tracking-[0.28em]",
    xl: "text-4xl sm:text-5xl tracking-[0.3em]",
    responsive: "text-base sm:text-xl md:text-2xl lg:text-3xl tracking-[0.16em] sm:tracking-[0.24em]"
  };

  const subtitleClasses = {
    sm: "text-[8px] tracking-[0.22em]",
    md: "text-[9px] sm:text-[10px] tracking-[0.26em]",
    lg: "text-[10px] sm:text-[11px] tracking-[0.3em]",
    xl: "text-[12px] tracking-[0.32em]",
    responsive: "hidden sm:block text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.20em] sm:tracking-[0.26em]"
  };

  return (
    <div className={`flex flex-col items-start leading-none group select-none ${className}`}>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-serif font-bold ${textClasses[size]} ${
          isDark ? 'text-[#FAF7F2] group-hover:text-white' : 'text-[#0F4C5C] group-hover:text-[#083540]'
        } transition-colors`}>
          AARU
        </span>
        <span className={`${size === 'responsive' ? 'w-1 h-1 sm:w-1.5 sm:h-1.5' : 'w-1.5 h-1.5'} rounded-full bg-[#8C6D37] shrink-0`} />
      </div>

      {showSubtitle && (
        <span className={`font-sans uppercase font-semibold mt-0.5 ${subtitleClasses[size]} ${
          isDark ? 'text-[#D4C7B5]' : 'text-[#8C6D37]'
        }`}>
          A Woman’s Sixth Element
        </span>
      )}
    </div>
  );
};

/**
 * Full Authentic AARU Master Logo Component
 * Unites the English luxury wordmark with the authentic Telugu emblem seal "ఆరు".
 * Replaces the old SVG component with crisp typography & heirloom jewelry styling.
 */
export const AaruLogo: React.FC<AaruLogoProps> = ({
  className = "",
  showSubtitle = true,
  size = 'md',
  variant = 'light',
  displayMode = 'dual'
}) => {
  if (displayMode === 'english') {
    return (
      <AaruEnglishLogo 
        className={className} 
        showSubtitle={showSubtitle} 
        size={size} 
        variant={variant} 
      />
    );
  }

  if (displayMode === 'telugu') {
    return (
      <AaruTeluguLogo 
        className={className} 
        showSubtitle={showSubtitle} 
        size={size} 
        variant={variant} 
      />
    );
  }

  const isDark = variant === 'dark';
  const isResponsive = size === 'responsive';

  const emblemSizes: Record<string, number | undefined> = {
    sm: 30,
    md: 38,
    lg: 46,
    xl: 56,
    responsive: undefined
  };

  const textClasses: Record<string, string> = {
    sm: "text-xl tracking-[0.22em]",
    md: "text-2xl sm:text-3xl tracking-[0.24em]",
    lg: "text-3xl sm:text-4xl tracking-[0.26em]",
    xl: "text-4xl sm:text-5xl tracking-[0.28em]",
    responsive: "text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-[0.14em] sm:tracking-[0.22em]"
  };

  const subtitleClasses: Record<string, string> = {
    sm: "text-[8px] tracking-[0.18em]",
    md: "text-[9px] sm:text-[10px] tracking-[0.20em] sm:tracking-[0.24em]",
    lg: "text-[10px] sm:text-[11px] tracking-[0.20em] sm:tracking-[0.24em]",
    xl: "text-[12px] tracking-[0.26em]",
    responsive: "hidden sm:block text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.16em] sm:tracking-[0.22em]"
  };

  return (
    <div className={`flex items-center ${isResponsive ? 'gap-1.5 sm:gap-2.5 md:gap-3' : 'gap-3'} group select-none ${className}`}>
      {/* Authentic Telugu Emblem Seal (ఆరు) */}
      <AaruEmblem 
        size={emblemSizes[size]} 
        variant={variant} 
        className="shrink-0 group-hover:border-[#8C6D37] transition-all" 
      />

      {/* English Haute Atelier Typography */}
      <div className="flex flex-col items-start leading-none min-w-0">
        <div className="flex items-baseline gap-1 sm:gap-1.5">
          <span className={`font-serif font-bold ${textClasses[size]} ${
            isDark ? 'text-[#FAF7F2] group-hover:text-white' : 'text-[#0F4C5C] group-hover:text-[#083540]'
          } transition-colors whitespace-nowrap`}>
            AARU
          </span>
          <span className={`${isResponsive ? 'w-1 h-1 sm:w-1.5 sm:h-1.5' : 'w-1.5 h-1.5'} rounded-full bg-[#8C6D37] shrink-0`} />
        </div>
        
        {showSubtitle && (
          <span className={`font-sans uppercase font-semibold mt-0.5 max-w-full truncate ${subtitleClasses[size]} ${
            isDark ? 'text-[#D4C7B5]' : 'text-[#8C6D37]'
          }`}>
            A Woman’s Sixth Element
          </span>
        )}
      </div>
    </div>
  );
};

export default AaruLogo;
