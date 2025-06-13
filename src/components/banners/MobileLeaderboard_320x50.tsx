// src/components/banners/MobileLeaderboard_320x50.tsx
import React from 'react';
import { MetaFields } from '../../app/types';

interface BannerProps {
  metaFields: MetaFields;
}

const MobileLeaderboardBanner: React.FC<BannerProps> = ({ metaFields }) => {
  const isSvgLogo = metaFields.logoUrl?.includes('<svg');
  const buttonColor = metaFields.brandColors?.[0] || '#007bff';

  return (
    <div className="relative w-[320px] h-[50px] bg-gray-200 rounded-lg overflow-hidden shadow-lg text-left flex items-center">
      {metaFields.bannerImages?.[0] && (
        <img src={metaFields.bannerImages[0]} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 p-2 h-full flex items-center w-full">
        <div className="w-10 h-10 flex-shrink-0 mr-2 flex items-center justify-center">
          {isSvgLogo ? (
            <div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: metaFields.logoUrl }} />
          ) : (
            metaFields.logoUrl && <img src={metaFields.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
          )}
        </div>
        
        <div className="flex-grow">
          <h1 className="text-sm font-bold text-white leading-tight truncate">{metaFields.mainHeading}</h1>
          <p className="text-xs text-white truncate">{metaFields.subheading}</p>
        </div>
        
        <div className="ml-2 flex-shrink-0">
            <button className="text-white px-3 py-1 text-xs rounded-md font-semibold" style={{ backgroundColor: buttonColor }}>
                {metaFields.cta}
            </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLeaderboardBanner;
