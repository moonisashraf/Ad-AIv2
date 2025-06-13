// src/components/banners/Leaderboard_728x90.tsx
import React from 'react';
import { MetaFields } from '../../app/types';

interface BannerProps {
  metaFields: MetaFields;
}

const LeaderboardBanner: React.FC<BannerProps> = ({ metaFields }) => {
  // Guard clause to prevent render errors if props are not ready
  if (!metaFields) {
    return null;
  }

  const isSvgLogo = metaFields.logoUrl?.includes('<svg');
  const buttonColor = metaFields.brandColors?.[0] || '#007bff';

  return (
    <div className="relative w-[728px] h-[90px] bg-gray-200 rounded-lg overflow-hidden shadow-lg text-left flex items-center">
      {metaFields.bannerImages?.[0] && (
        <img src={metaFields.bannerImages[0]} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 p-4 h-full flex items-center w-full">
        <div className="w-24 flex-shrink-0 mr-4 flex items-center justify-center">
          {isSvgLogo ? (
            <div className="w-16 h-16 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: metaFields.logoUrl }} />
          ) : (
            metaFields.logoUrl && <img src={metaFields.logoUrl} alt="Logo" className="max-w-full max-h-16 object-contain" />
          )}
        </div>
        
        <div className="flex-grow">
          <h1 className="text-xl font-bold text-white leading-tight">{metaFields.mainHeading}</h1>
          <p className="text-sm text-white">{metaFields.subheading}</p>
        </div>
        
        <div className="ml-4 flex-shrink-0">
            <button className="text-white px-5 py-2 rounded-md font-semibold" style={{ backgroundColor: buttonColor }}>
                {metaFields.cta}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardBanner;
