import React from 'react';

/**
 * HabrenoirLogo - Universal luxury architectural monogram mark.
 * 
 * Supports:
 * 1. Dynamic CSS / Tailwind color inheritance:
 *    <HabrenoirLogo className="w-9 h-9 text-[#111111] group-hover:text-[#3D0C15] transition-colors" />
 * 
 * 2. Explicit color prop:
 *    <HabrenoirLogo color="#E5C378" className="w-10 h-10" />
 * 
 * 3. Pre-rendered high-contrast colorway variants:
 *    variant="black" | "white" | "gold" | "champagne" | "burgundy" | "currentColor"
 * 
 * 4. Image mode (using <img> directly when needed):
 *    <HabrenoirLogo asImage variant="gold" className="w-10 h-10" />
 */
export const HabrenoirLogo = ({
  className = 'w-8 h-8',
  variant = 'currentColor',
  color,
  alt = 'Habrenoir Architectural Monogram',
  asImage = false
}) => {
  const srcMap = {
    black: '/images/logo/logo-black.png',
    white: '/images/logo/logo-white.png',
    gold: '/images/logo/logo-gold.png',
    champagne: '/images/logo/logo-gold-champagne.png',
    burgundy: '/images/logo/logo-burgundy.png',
  };

  // If specific pre-rendered variant is requested or asImage is true
  if (asImage && srcMap[variant]) {
    return (
      <img
        src={srcMap[variant]}
        alt={alt}
        className={`${className} object-contain`}
      />
    );
  }

  if (variant !== 'currentColor' && !color && srcMap[variant]) {
    return (
      <img
        src={srcMap[variant]}
        alt={alt}
        className={`${className} object-contain`}
      />
    );
  }

  // Universal dynamic color mode using CSS mask.
  // This allows any Tailwind text color, hover color, or hex color to tint the monogram.
  const resolvedColor = color || 'currentColor';

  return (
    <span
      role="img"
      aria-label={alt}
      className={`inline-block ${className}`}
      style={{
        backgroundColor: resolvedColor,
        WebkitMaskImage: 'url(/images/logo/logo-mask.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: 'url(/images/logo/logo-mask.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  );
};

