import React from 'react';
import { MetaFields } from '../app/types';

interface BannerPreviewProps {
  metaFields: MetaFields;
}

const BannerPreview: React.FC<BannerPreviewProps> = ({ metaFields }) => {
  return (
    <div className="relative w-[728px] h-[90px] bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Background Image */}
      {metaFields.bannerImages[0] && (
        <img
          src={metaFields.bannerImages[0]}
          alt="Banner Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Logo */}
      {metaFields.logoUrl && metaFields.logoUrl !== 'svg-logo' && (
        <img
          src={metaFields.logoUrl}
          alt="Logo"
          className="absolute top-4 left-4 w-16 h-16 object-contain"
        />
      )}

      {metaFields.logoUrl === 'svg-logo' && (
        <div className="absolute top-4 left-4 w-16 h-16 flex items-center justify-center">
          <span className="text-sm bg-gray-300 text-black px-2 py-1 rounded">SVG Logo</span>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-4">
        <h1 className="text-2xl font-bold text-white mb-1">{metaFields.mainHeading}</h1>
        <p className="text-lg text-white mb-2">{metaFields.subheading}</p>
        <p className="text-sm text-white mb-3">{metaFields.bodyText}</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-fit">
          {metaFields.cta}
        </button>
      </div>
    </div>
  );
};

export default BannerPreview;
