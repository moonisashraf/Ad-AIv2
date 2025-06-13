// src/components/banners/WideSkyscraper_160x600.tsx
import React from 'react';
import { MetaFields } from '../../app/types';

interface BannerProps {
  metaFields: MetaFields;
}

const WideSkyscraperBanner: React.FC<BannerProps> = ({ metaFields }) => {
  const isSvgLogo = metaFields.logoUrl?.includes('<svg');
  const buttonColor = metaFields.brandColors?.[0] || '#007bff';

  return (
    <div className="relative w-[160px] h-[600px] bg-gray-200 rounded-lg overflow-hidden shadow-lg text-center flex flex-col justify-between p-4">
      {metaFields.bannerImages?.[0] && (
        <img src={metaFields.bannerImages[0]} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 flex flex-col justify-between items-center h-full">
        <div className="flex-shrink-0 h-24 flex items-center justify-center">
            {isSvgLogo ? (
                <div className="w-24 h-full flex items-center justify-center [&>svg]:w-24 [&>svg]:h-24" dangerouslySetInnerHTML={{ __html: metaFields.logoUrl }} />
            ) : (
                metaFields.logoUrl && <img src={metaFields.logoUrl} alt="Logo" className="max-w-full max-h-24 object-contain" />
            )}
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white leading-tight my-4">{metaFields.mainHeading}</h1>
          <p className="text-md text-white">{metaFields.subheading}</p>
        </div>
        
        <div className="flex-shrink-0 w-full">
            <button className="text-white w-full py-3 rounded-md font-semibold" style={{ backgroundColor: buttonColor }}>
                {metaFields.cta}
            </button>
        </div>
      </div>
    </div>
  );
};

export default WideSkyscraperBanner;
