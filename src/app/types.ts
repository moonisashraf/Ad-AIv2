// src/types.ts

export type ScrapedData = {
  headings: string[];
  paragraphs: string[];
  images: string[];
  logo?: string; // New field
  error?: string;
};

export type MetaFields = {
  mainHeading: string;
  subheading: string;
  bodyText: string;
  cta: string;
  logoUrl: string;
  bannerImages: string[];
};
