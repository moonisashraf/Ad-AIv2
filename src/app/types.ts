// src/app/types.ts

export type BannerSize = 
  '728x90' | '970x250' | '300x250' | 
  '336x280' | '160x600' | '300x600' | '320x50';

export type ScrapedData = {
  headings: string[];
  images: string[];
  logo?: string;
  brandColors?: string[];
  error?: string;
};

// NEW: Defines the structure for an AI-generated design
export type AiDesign = {
  backgroundColor: string;
  elements: Array<{
    type: 'logo' | 'headline' | 'subheading' | 'cta' | 'image';
    position: { top: string; left: string; width: string; height: string; };
    style: {
      color?: string;
      fontFamily?: string;
      fontSize: string;
      fontWeight: 'normal' | 'bold' | 'bolder';
      textAlign: 'left' | 'center' | 'right';
      backgroundColor?: string;
      borderRadius?: string;
      // For image masking
      clipPath?: string;
    };
  }>;
};

export type MetaFields = {
  mainHeading: string;
  subheading: string;
  cta: string;
  logoUrl: string;
  bannerImage: string;
  brandColors: string[];
  // The active design for the banners
  design: AiDesign | null; 
};
