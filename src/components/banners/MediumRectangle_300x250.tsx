// src/components/banners/MediumRectangle_300x250.tsx
import React from 'react';
import { MetaFields } from '../../app/types';

interface BannerProps {
  metaFields: MetaFields;
}

const MediumRectangleBanner: React.FC<BannerProps> = ({ metaFields }) => {
  const isSvgLogo = metaFields.logoUrl?.includes('<svg');
  const buttonColor = metaFields.brandColors?.[0] || '#007bff';

  return (
    <div className="relative w-[300px] h-[250px] bg-gray-200 rounded-lg overflow-hidden shadow-lg text-center flex flex-col justify-center items-center p-4">
      {metaFields.bannerImages?.[0] && (
        <img src={metaFields.bannerImages[0]} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 flex flex-col justify-around items-center h-full">
        <div className="flex-shrink-0 flex items-center justify-center h-16">
          {isSvgLogo ? (
            <div className="w-24 h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: metaFields.logoUrl }} />
          ) : (
            metaFields.logoUrl && <img src={metaFields.logoUrl} alt="Logo" className="max-w-full max-h-16 object-contain" />
          )}
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white leading-tight">{metaFields.mainHeading}</h1>
          <p className="text-md text-white mt-1">{metaFields.subheading}</p>
        </div>
        
        <div className="flex-shrink-0">
            <button className="text-white px-6 py-2 rounded-md font-semibold" style={{ backgroundColor: buttonColor }}>
                {metaFields.cta}
            </button>
        </div>
      </div>
    </div>
  );
};

export default MediumRectangleBanner;
