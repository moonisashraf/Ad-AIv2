// src/components/BannerPreview.tsx
import React, { useRef, useEffect } from 'react';
import { MetaFields, BannerSize } from '../app/types';

// --- AUTO-FIT TEXT COMPONENT ---
const FitText: React.FC<{ children: React.ReactNode, initialFontSize: number, className?: string, isButton?: boolean }> = ({ children, initialFontSize, className, isButton = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        let currentSize = initialFontSize;
        text.style.fontSize = `${currentSize}px`;

        const padding = isButton ? 16 : 4; // Less padding for buttons
        const isOverflowing = () => text.scrollWidth > (container.clientWidth - padding) || text.scrollHeight > (container.clientHeight - padding);

        while (isOverflowing() && currentSize > 8) {
            currentSize -= 1;
            text.style.fontSize = `${currentSize}px`;
        }
    }, [children, initialFontSize, isButton]);

    return (
        <div ref={containerRef} className={`w-full h-full flex items-center justify-center ${className}`}>
            <span ref={textRef} className="text-center" style={{ whiteSpace: 'nowrap', lineHeight: '1.2' }}>{children}</span>
        </div>
    );
};

// --- RESPONSIVE BANNER SHELL ---
const AdShell: React.FC<{ size: BannerSize, metaFields: MetaFields, children: React.ReactNode }> = ({ size, metaFields, children }) => {
    const [width, height] = size.split('x').map(Number);
    return (
        <div 
            className="relative overflow-hidden rounded-lg shadow-lg text-white" 
            style={{ 
                width: '100%',
                maxWidth: `${width}px`, 
                aspectRatio: `${width} / ${height}`, 
                backgroundColor: '#171717' 
            }}
        >
            {metaFields.bannerImages?.[0] && <img src={metaFields.bannerImages[0]} alt="Background" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            {children}
        </div>
    );
};

// --- DEDICATED BANNER LAYOUTS ---
const VerticalBanner: React.FC<{ size: BannerSize, metaFields: MetaFields }> = ({ size, metaFields }) => {
    if (!metaFields) return null;
    const isSvgLogo = metaFields.logoUrl?.includes('<svg');
    const buttonColor = metaFields.brandColors?.[0] || '#007bff';
    return (
        <AdShell size={size} metaFields={metaFields}>
            <div className="relative z-10 w-full h-full p-4 flex flex-col items-center justify-around">
                <div className="flex-shrink-0 w-3/4 h-1/4">
                     {isSvgLogo ? (<div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain" dangerouslySetInnerHTML={{ __html: metaFields.logoUrl }} />) : (metaFields.logoUrl && <img src={metaFields.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />)}
                </div>
                <div className="flex-grow w-full flex flex-col justify-center items-center py-2">
                    <div className="w-full h-1/2"><FitText initialFontSize={32} className="font-bold">{metaFields.mainHeading}</FitText></div>
                    <div className="w-full h-1/2 opacity-80"><FitText initialFontSize={20}>{metaFields.subheading}</FitText></div>
                </div>
                <div className="flex-shrink-0 w-3/4 h-1/6"><button className="text-white w-full h-full rounded-md font-semibold" style={{ backgroundColor: buttonColor }}><FitText initialFontSize={18} isButton>{metaFields.cta}</FitText></button></div>
            </div>
        </AdShell>
    );
};

const HorizontalBanner: React.FC<{ size: BannerSize, metaFields: MetaFields }> = ({ size, metaFields }) => {
    if (!metaFields) return null;
    const isSvgLogo = metaFields.logoUrl?.includes('<svg');
    const buttonColor = metaFields.brandColors?.[0] || '#007bff';
    return (
        <AdShell size={size} metaFields={metaFields}>
            <div className="relative z-10 w-full h-full p-2 flex items-center justify-between">
                <div className="h-full w-1/5 flex items-center justify-center flex-shrink-0 p-1">
                    {isSvgLogo ? (<div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain" dangerouslySetInnerHTML={{ __html: metaFields.logoUrl }} />) : (metaFields.logoUrl && <img src={metaFields.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />)}
                </div>
                <div className="h-full flex-grow flex flex-col items-center justify-center px-2">
                    <div className="w-full h-1/2"><FitText initialFontSize={24} className="font-bold">{metaFields.mainHeading}</FitText></div>
                    <div className="w-full h-1/2 opacity-80"><FitText initialFontSize={16}>{metaFields.subheading}</FitText></div>
                </div>
                <div className="h-full w-1/4 flex items-center justify-center flex-shrink-0 p-1">
                    <button className="text-white w-full h-3/4 max-h-12 rounded-md font-semibold" style={{ backgroundColor: buttonColor }}><FitText initialFontSize={16} isButton>{metaFields.cta}</FitText></button>
                </div>
            </div>
        </AdShell>
    );
};

// --- BANNER CONTROLLER ---
const bannerComponents: { [key in BannerSize]: React.FC<{ metaFields: MetaFields, size: BannerSize }> } = {
  '728x90': HorizontalBanner, '970x250': HorizontalBanner, '320x50': HorizontalBanner,
  '300x250': VerticalBanner, '336x280': VerticalBanner, '160x600': VerticalBanner, '300x600': VerticalBanner,
};

const BannerPreview: React.FC<{ metaFields: MetaFields; size: BannerSize }> = ({ metaFields, size }) => {
  if (!metaFields) return null;
  const BannerComponent = bannerComponents[size];
  if (!BannerComponent) return <div className="text-red-500">Invalid banner size.</div>;
  return <BannerComponent metaFields={metaFields} size={size}/>;
};

export default BannerPreview;
