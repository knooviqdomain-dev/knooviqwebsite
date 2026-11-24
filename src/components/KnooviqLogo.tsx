import React from 'react';

interface KnooviqLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  forceDark?: boolean;
}

export const KnooviqLogo: React.FC<KnooviqLogoProps> = ({
  className = '',
  size = 'md',
  forceDark = false,
}) => {
  // Height sizing for logo image
  const heightClass = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10 lg:h-9 xl:h-11 2xl:h-12',
    lg: 'h-11 sm:h-12 lg:h-12 xl:h-14',
    xl: 'h-14 sm:h-16 lg:h-18 xl:h-20',
  }[size];

  return (
    <div className={`inline-flex items-center justify-center select-none transition-transform duration-200 hover:scale-[1.02] my-auto ${className}`}>
      {forceDark ? (
        <img
          src="/knooviq-logo-darkmode.png"
          alt="KNOOVIQ INDUSTRIES PVT LTD"
          className={`${heightClass} w-auto object-contain block`}
          loading="eager"
        />
      ) : (
        <>
          {/* Light Mode: Transparent Official Logo */}
          <img
            src="/knooviq-header-logo.png"
            alt="KNOOVIQ INDUSTRIES PVT LTD"
            className={`${heightClass} w-auto object-contain block dark:hidden`}
            loading="eager"
          />

          {/* Dark Mode: High-Contrast Transparent Official Logo */}
          <img
            src="/knooviq-logo-darkmode.png"
            alt="KNOOVIQ INDUSTRIES PVT LTD"
            className={`${heightClass} w-auto object-contain hidden dark:block`}
            loading="eager"
          />
        </>
      )}
    </div>
  );
};
