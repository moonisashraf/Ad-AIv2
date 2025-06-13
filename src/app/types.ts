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

export type DesignOptions = {
  templateName: string;
  backgroundType: 'solid' | 'image';
  backgroundColor: string;
  primaryTextColor: string;
  ctaBackgroundColor: string;
  ctaTextColor: string;
};

export type MetaFields = {
  mainHeading: string;
  subheading: string;
  cta: string;
  logoUrl: string;
  bannerImage: string;
  design: DesignOptions;
};

export type AiSuggestions = {
  headlines: string[];
  subheadings: string[];
};
