'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScrapedData, MetaFields, BannerSize, DesignOptions, AiSuggestions } from './types';

// --- SELF-CONTAINED COMPONENTS AND ICONS ---

// --- ICONS (as SVG components) ---
const FiExternalLink = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>);
const FiImage = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const FiLoader = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>);
const FiDroplet = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>);
const FiLayout = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>);
const FiType = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>);
const FiPalette = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.703-.465-1.17-.465-1.12 0-2.032-.912-2.032-2.032 0-.437.18-.835.477-1.122.297-.287.703-.465 1.17-.465 1.12 0 2.032-.912 2.032-2.032 0-.437.18-.835.477-1.122.297-.287.703-.465 1.17-.465 1.12 0 2.032-.912 2.032-2.032A1.65 1.65 0 0 0 12 2z"></path></svg>);
const FiSparkles = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path><path d="M19 3l-4 4"></path><path d="M5 17l4-4"></path><path d="m21 21-4-4"></path><path d="m3 3 4 4"></path></svg>);

// --- EDITOR PANEL ---
const EditorPanel: React.FC<{
  metaFields: MetaFields;
  setMetaFields: (fields: MetaFields) => void;
  allImages: string[];
  allColors: string[];
  onGenerateCopy: () => void;
  onSuggestPalette: () => void;
  aiSuggestions: AiSuggestions;
  isAiLoading: boolean;
}> = ({ metaFields, setMetaFields, allImages, allColors, onGenerateCopy, onSuggestPalette, aiSuggestions, isAiLoading }) => {
  const updateField = (field: keyof MetaFields, value: any) => setMetaFields({ ...metaFields, [field]: value });
  const updateDesign = (field: keyof DesignOptions, value: any) => setMetaFields({ ...metaFields, design: { ...metaFields.design, [field]: value } });

  const ColorPicker: React.FC<{ label: string; value: string; onSelect: (color: string) => void }> = ({ label, value, onSelect }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {allColors.map(color => <div key={color} onClick={() => onSelect(color)} className="w-8 h-8 rounded-full cursor-pointer border-2" style={{ backgroundColor: color, borderColor: value === color ? '#3B82F6' : 'transparent' }}></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* AI Tools */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiSparkles /><span>AI Creative Assistant</span></h3>
        <div className="space-y-4">
          <button onClick={onGenerateCopy} disabled={isAiLoading} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400">
            {isAiLoading ? <FiLoader /> : <FiType />} Suggest Ad Copy
          </button>
          <button onClick={onSuggestPalette} disabled={isAiLoading} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400">
             {isAiLoading ? <FiLoader /> : <FiPalette />} Suggest Color Palette
          </button>
        </div>
      </div>
      {/* Content Editor */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiType /><span>Edit Content</span></h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Heading</label>
            <select value={metaFields.mainHeading} onChange={(e) => updateField('mainHeading', e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
              <option value={metaFields.mainHeading}>{metaFields.mainHeading}</option>
              {aiSuggestions.headlines.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subheading</label>
            <select value={metaFields.subheading} onChange={(e) => updateField('subheading', e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
              <option value={metaFields.subheading}>{metaFields.subheading}</option>
              {aiSuggestions.subheadings.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CTA Text</label><input type="text" value={metaFields.cta} onChange={(e) => updateField('cta', e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo URL or SVG</label><textarea value={metaFields.logoUrl} onChange={(e) => updateField('logoUrl', e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-700" rows={3}/></div>
        </div>
      </div>
       {/* Design Editor */}
       <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiLayout /><span>Customize Visuals</span></h3>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium">Background Type</label><select value={metaFields.design.backgroundType} onChange={(e) => updateDesign('backgroundType', e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-700"><option value="solid">Solid Color</option><option value="image">Image</option></select></div>
          {metaFields.design.backgroundType === 'image' && <div><label className="block text-sm font-medium">Background Image</label><div className="grid grid-cols-4 gap-2 mt-1">{allImages.map(img => <img key={img} src={img} onClick={() => updateField('bannerImage', img)} className={`w-full h-16 object-cover rounded-md cursor-pointer border-2 ${metaFields.bannerImage === img ? 'border-blue-500' : 'border-transparent'}`}/>)}</div></div>}
          <ColorPicker label="Background Color" value={metaFields.design.backgroundColor} onSelect={color => updateDesign('backgroundColor', color)} />
          <ColorPicker label="Text Color" value={metaFields.design.primaryTextColor} onSelect={color => updateDesign('primaryTextColor', color)} />
          <ColorPicker label="CTA Background" value={metaFields.design.ctaBackgroundColor} onSelect={color => updateDesign('ctaBackgroundColor', color)} />
        </div>
      </div>
    </div>
  );
};

// --- BANNER TEMPLATES ---
const SmartText: React.FC<{ text: string, className?: string, maxLines?: number }> = ({ text, className, maxLines = 1 }) => {
    const clampClass = `line-clamp-${maxLines}`;
    return <div className={`${clampClass} ${className}`}>{text}</div>
};

// Template 1: Classic Corporate
const CorporateTemplate: React.FC<{ size: BannerSize; metaFields: MetaFields; }> = ({ size, metaFields }) => {
    const [width, height] = size.split('x').map(Number);
    const isVertical = height > width;
    const { design, logoUrl, mainHeading, subheading, cta, bannerImage } = metaFields;
    const isSvgLogo = logoUrl?.includes('<svg');

    return (
        <div className="overflow-hidden rounded-lg shadow-lg text-left" style={{ width: '100%', maxWidth: `${width}px`, aspectRatio: `${width}/${height}`, backgroundColor: design.backgroundColor, color: design.primaryTextColor }}>
            <div className={`h-full flex ${isVertical ? 'flex-col' : 'flex-row'}`}>
                <div className={`flex flex-col justify-center p-4 ${isVertical ? 'w-full h-1/2' : 'w-3/5 h-full'}`}>
                    <div className="h-1/4 mb-2">{isSvgLogo ? <div className="w-1/2 h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain" dangerouslySetInnerHTML={{ __html: logoUrl }} /> : logoUrl && <img src={logoUrl} alt="Logo" className="max-w-1/2 max-h-full object-contain" />}</div>
                    <h1 className="font-bold text-2xl leading-tight line-clamp-2">{mainHeading}</h1>
                    <p className="text-base opacity-80 mt-1 line-clamp-3">{subheading}</p>
                    <button className="w-fit py-2 px-6 rounded-md font-semibold mt-4 text-sm" style={{ backgroundColor: design.ctaBackgroundColor, color: design.ctaTextColor }}>{cta}</button>
                </div>
                <div className={`bg-gray-500 ${isVertical ? 'w-full h-1/2' : 'w-2/5 h-full'}`}>
                    {design.backgroundType === 'solid' && <img src={bannerImage} className="w-full h-full object-cover" alt="Ad visual" /> }
                    {design.backgroundType === 'image' && <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url(${bannerImage})`}}></div> }
                </div>
            </div>
        </div>
    );
};

// Template 2: Modern Minimalist
const MinimalistTemplate: React.FC<{ size: BannerSize; metaFields: MetaFields; }> = ({ size, metaFields }) => {
    const [width, height] = size.split('x').map(Number);
    const { design, mainHeading, cta, bannerImage } = metaFields;
    const backgroundStyle: React.CSSProperties = design.backgroundType === 'image' ? { backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: design.backgroundColor };

    return (
        <div className="overflow-hidden rounded-lg shadow-lg relative text-center flex flex-col justify-center items-center p-8" style={{ width: '100%', maxWidth: `${width}px`, aspectRatio: `${width}/${height}`, color: design.primaryTextColor, ...backgroundStyle }}>
             {design.backgroundType === 'image' && <div className="absolute inset-0 bg-black bg-opacity-40"></div>}
             <div className="relative z-10 flex flex-col items-center justify-center">
                <h1 className="font-extrabold text-4xl my-4 line-clamp-3">{mainHeading}</h1>
                <button className="py-2 px-8 border-2 rounded-full font-bold" style={{ borderColor: design.ctaBackgroundColor, color: design.ctaBackgroundColor }}>{cta}</button>
             </div>
        </div>
    );
};

const templates = { 'Classic Corporate': CorporateTemplate, 'Modern Minimalist': MinimalistTemplate };
type TemplateName = keyof typeof templates;

// --- MAIN PAGE COMPONENT ---
const availableSizes: BannerSize[] = ['728x90', '970x250', '300x250', '336x280', '160x600', '300x600', '320x50'];
export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metaFields, setMetaFields] = useState<MetaFields | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestions>({ headlines: [], subheadings: [] });

  const handleScrape = async () => {
    if (!websiteUrl) return;
    setIsScraping(true); setError(null); setScrapedData(null); setMetaFields(null);
    try {
      const response = await fetch('/api/scrape', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: websiteUrl }), });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Request failed');
      setScrapedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsScraping(false);
    }
  };
  
  useEffect(() => {
    if (scrapedData) {
      const validImages = (scrapedData.images || []).filter(Boolean);
      setMetaFields({
        mainHeading: scrapedData.headings[0] || 'Your Amazing Product',
        subheading: scrapedData.headings[1] || 'A catchy tagline goes here',
        cta: 'Shop Now', logoUrl: scrapedData.logo || '',
        bannerImage: validImages[0] || '',
        design: {
          templateName: 'Classic Corporate',
          backgroundType: 'solid',
          backgroundColor: scrapedData.brandColors?.[1] || '#ffffff',
          primaryTextColor: scrapedData.brandColors?.[2] || '#000000',
          ctaBackgroundColor: scrapedData.brandColors?.[0] || '#007bff',
          ctaTextColor: '#ffffff'
        }
      });
    }
  }, [scrapedData]);
  
  const handleGenerateCopy = async () => {
      if(!scrapedData) return;
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
          setError("API key is not configured. Please check your .env.local file and restart the server.");
          return;
      }

      setIsAiLoading(true);
      const prompt = `Based on the following topics from a website: "${scrapedData.headings.join(', ')}", generate 3 short, impactful ad headlines and 3 slightly longer subheadings. Return a valid JSON object with two keys: "headlines" and "subheadings", where each key holds an array of 3 strings.`;
      
      try {
          const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const result = await response.json();
          if (!response.ok || !result.candidates) {
            throw new Error(result.error?.message || "AI request failed");
          }
          const text = result.candidates[0].content.parts[0].text;
          const suggestions = JSON.parse(text.replace(/```json|```/g, ''));
          setAiSuggestions(suggestions);
      } catch (e) {
          console.error("AI copy generation failed:", e);
          setError("Failed to generate AI suggestions. Check the API key or console for details.");
      } finally {
          setIsAiLoading(false);
      }
  };

  const handleSuggestPalette = async () => {
      if(!scrapedData?.brandColors || scrapedData.brandColors.length === 0) {
          setError("No brand colors found to suggest a palette.");
          return;
      };
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
          setError("API key is not configured. Please check your .env.local file and restart the server.");
          return;
      }
      
      setIsAiLoading(true);
      const prompt = `Given these brand colors: ${scrapedData.brandColors.join(', ')}, create a professional 5-color marketing palette. Ensure high contrast and accessibility. Return a valid JSON object with keys: "backgroundColor", "primaryTextColor", "ctaBackgroundColor", "ctaTextColor". Provide hex codes.`;
      
      try {
          const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const result = await response.json();
          if (!response.ok || !result.candidates) {
            throw new Error(result.error?.message || "AI request failed");
          }
          const text = result.candidates[0].content.parts[0].text;
          const newPalette = JSON.parse(text.replace(/```json|```/g, ''));
          setMetaFields(mf => mf ? {...mf, design: {...mf.design, ...newPalette}} : null);
      } catch(e) {
          console.error("AI palette suggestion failed:", e);
          setError("Failed to suggest AI palette. Check the API key or console for details.");
      } finally {
          setIsAiLoading(false);
      }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleScrape(); };
  
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-8"><h1 className="text-4xl font-bold mb-2">AI-Powered Ad Banner Generator</h1><p className="text-lg text-gray-600 dark:text-gray-300">Instantly create a full suite of ad banners from any website.</p></header>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"><div className="flex flex-col sm:flex-row gap-4"><input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="https://example.com" className="flex-1 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700"/>
            <button onClick={handleScrape} disabled={isScraping} className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg">{isScraping ? <FiLoader /> : <FiExternalLink />}<span>{isScraping ? 'Scraping...' : 'Scrape Content'}</span></button></div>
          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200">{error}</div>}
        </div>

        {metaFields && (
            <div className="mt-8 grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                  <EditorPanel metaFields={metaFields} setMetaFields={setMetaFields} allImages={scrapedData?.images || []} allColors={scrapedData?.brandColors || []} onGenerateCopy={handleGenerateCopy} onSuggestPalette={handleSuggestPalette} aiSuggestions={aiSuggestions} isAiLoading={isAiLoading}/>
                </div>
                <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2"><FiLayout /><span>Template Gallery</span></h3>
                      <select value={metaFields.design.templateName} onChange={(e) => setMetaFields({...metaFields, design: {...metaFields.design, templateName: e.target.value }})} className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                        {Object.keys(templates).map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 items-start justify-items-center">
                        {availableSizes.map(size => {
                            const BannerComponent = templates[metaFields.design.templateName as TemplateName];
                            return (<div key={size} className="w-full flex flex-col items-center gap-2">
                                <h4 className="font-medium text-gray-600 dark:text-gray-300">{size.replace('x', ' x ')}</h4>
                                <BannerComponent metaFields={metaFields} size={size} />
                            </div>)
                        })}
                    </div>
                  </div>
                </div>
            </div>
        )}
        {!metaFields && !isScraping && (<div className="text-center py-20"><FiExternalLink className="mx-auto text-5xl text-gray-400 mb-4" /><h3 className="mt-4 text-xl font-medium">Start by scraping a website</h3><p className="text-gray-500 dark:text-gray-400">Enter a URL above to generate your ad assets.</p></div>)}
      </div>
    </main>
  );
}
