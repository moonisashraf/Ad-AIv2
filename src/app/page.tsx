'use client';

import React, { useState, useEffect } from 'react';
import { ScrapedData, MetaFields, BannerSize, AiDesign } from './types';

// --- ICONS (as SVG components) ---
const FiExternalLink = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>);
const FiLoader = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>);
const FiLayout = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>);
const FiSparkles = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path><path d="M19 3l-4 4"></path><path d="M5 17l4-4"></path><path d="m21 21-4-4"></path><path d="m3 3 4 4"></path></svg>);
const FiImage = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const FiType = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>);
const FiDroplet = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>);


// --- EDITOR PANEL COMPONENT ---
const EditorPanel: React.FC<{
  metaFields: MetaFields;
  setMetaFields: (fields: MetaFields) => void;
  scrapedImages: string[];
  brandColors: string[];
}> = ({ metaFields, setMetaFields, scrapedImages, brandColors }) => {
  
  const updateField = (field: keyof MetaFields, value: any) => {
    setMetaFields({ ...metaFields, [field]: value });
  };

  const updateElementStyle = (elementType: 'headline' | 'subheading' | 'cta', property: keyof AiDesign['elements'][0]['style'], value: any) => {
    if (metaFields.design) {
        const newElements = metaFields.design.elements.map(el => {
            if (el.type === elementType) {
                return { ...el, style: { ...el.style, [property]: value } };
            }
            return el;
        });
        setMetaFields({ ...metaFields, design: { ...metaFields.design, elements: newElements } });
    }
  };

  const ColorPicker: React.FC<{ label: string; onSelect: (color: string) => void; selectedColor?: string; }> = ({ label, onSelect, selectedColor }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="flex flex-wrap gap-2 mt-1">
            {brandColors.map(color => <div key={color} onClick={() => onSelect(color)} className="w-8 h-8 rounded-full cursor-pointer border-2" style={{ backgroundColor: color, borderColor: selectedColor === color ? '#3B82F6' : 'transparent' }}></div>)}
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiType /> Edit Content</h3>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium">Headline</label><input type="text" value={metaFields.mainHeading} onChange={(e) => updateField('mainHeading', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/></div>
          <div><label className="block text-sm font-medium">Subheading</label><input type="text" value={metaFields.subheading} onChange={(e) => updateField('subheading', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/></div>
          <div><label className="block text-sm font-medium">Call to Action</label><input type="text" value={metaFields.cta} onChange={(e) => updateField('cta', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"/></div>
          <div><label className="block text-sm font-medium">Logo URL or SVG</label><textarea value={metaFields.logoUrl} onChange={(e) => updateField('logoUrl', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700" rows={3}/></div>
        </div>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiImage /> Edit Visuals</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Banner Image</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {scrapedImages.map(img => <img key={img} src={img} onClick={() => updateField('bannerImage', img)} className={`w-full h-16 object-cover rounded-md cursor-pointer border-2 ${metaFields.bannerImage === img ? 'border-blue-500' : 'border-transparent'}`}/>)}
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium">Background Color</label>
              <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={metaFields.design?.backgroundColor || '#ffffff'} onChange={(e) => metaFields.design && setMetaFields({...metaFields, design: {...metaFields.design, backgroundColor: e.target.value}})} className="w-12 h-10 p-1 border rounded-md"/>
                  <div className="flex flex-wrap gap-2">
                    {brandColors.map(color => <div key={color} onClick={() => metaFields.design && setMetaFields({...metaFields, design: {...metaFields.design, backgroundColor: color}})} className="w-8 h-8 rounded-full cursor-pointer border-2" style={{ backgroundColor: color, borderColor: metaFields.design?.backgroundColor === color ? '#3B82F6' : 'transparent' }}></div>)}
                  </div>
              </div>
          </div>
          <ColorPicker label="Headline Color" selectedColor={metaFields.design?.elements.find(e => e.type === 'headline')?.style.color} onSelect={color => updateElementStyle('headline', 'color', color)} />
          <ColorPicker label="CTA Background" selectedColor={metaFields.design?.elements.find(e => e.type === 'cta')?.style.backgroundColor} onSelect={color => updateElementStyle('cta', 'backgroundColor', color)} />
          <ColorPicker label="CTA Text Color" selectedColor={metaFields.design?.elements.find(e => e.type === 'cta')?.style.color} onSelect={color => updateElementStyle('cta', 'color', color)} />
        </div>
      </div>
    </div>
  );
};


// --- DYNAMIC BANNER RENDERER ---
const DynamicBanner: React.FC<{ size: BannerSize, metaFields: MetaFields }> = ({ size, metaFields }) => {
    const { design, mainHeading, subheading, cta, logoUrl, bannerImage } = metaFields;
    if (!design) return <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">Click "Generate Creative Design" to start.</div>;

    const [width, height] = size.split('x').map(Number);
    const isSvgLogo = logoUrl?.includes('<svg');
    const aspectRatio = width / height;

    const renderElement = (element: AiDesign['elements'][0]) => {
        const responsiveFontSize = aspectRatio > 1 
            ? `calc(${element.style.fontSize} * 1vw)` // Horizontal
            : `calc(${element.style.fontSize} * 2vh)`; // Vertical or Square

        const style: React.CSSProperties = {
            position: 'absolute', top: element.position.top, left: element.position.left,
            width: element.position.width, height: element.position.height,
            color: element.style.color, fontFamily: element.style.fontFamily,
            fontSize: responsiveFontSize,
            fontWeight: element.style.fontWeight,
            textAlign: element.style.textAlign, backgroundColor: element.style.backgroundColor,
            borderRadius: element.style.borderRadius, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '2%',
            lineHeight: 1.1,
            boxSizing: 'border-box',
            whiteSpace: 'normal',
        };
        
        const content = {
            logo: isSvgLogo ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: logoUrl }} /> : (logoUrl && <img src={logoUrl} className="w-full h-full object-contain" />),
            headline: mainHeading,
            subheading: subheading,
            cta: cta,
            image: <div style={{width: '100%', height: '100%', clipPath: element.style.clipPath}}><img src={bannerImage} className="w-full h-full object-cover"/></div>
        }[element.type];
        
        // Return a button for CTA, otherwise a div
        if (element.type === 'cta') {
            return <button style={style}>{content}</button>;
        }
        return <div style={style}>{content}</div>;
    };

    return (
        <div className="overflow-hidden rounded-lg shadow-lg relative" style={{ width: '100%', maxWidth: `${width}px`, aspectRatio: `${width}/${height}`, backgroundColor: design.backgroundColor }}>
            {design.elements.map((el, index) => <React.Fragment key={`${el.type}-${index}`}>{renderElement(el)}</React.Fragment>)}
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const availableSizes: BannerSize[] = ['728x90', '970x250', '300x250', '336x280', '160x600', '300x600', '320x50'];
export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metaFields, setMetaFields] = useState<MetaFields | null>(null);

  const handleScrape = async () => {
    if (!websiteUrl) return;
    setIsScraping(true); setError(null); setScrapedData(null); setMetaFields(null);
    try {
      const response = await fetch('/api/scrape', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: websiteUrl }) });
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
        brandColors: scrapedData.brandColors || [],
        design: null
      });
    }
  }, [scrapedData]);
  
  const handleGenerateDesign = async () => {
      if(!metaFields) return;
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
          setError("API key is not configured. Please check your .env.local file and restart the server.");
          return;
      }

      setIsAiLoading(true);
      setError(null);
      
      const styles = ["Minimalist and Clean", "Bold and Energetic", "Corporate and Trustworthy", "Futuristic and Tech-focused", "Elegant and Luxurious"];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];

      const prompt = `
        You are an expert, award-winning graphic designer creating a series of digital ad banners with a creative style of "${randomStyle}".
        You will be given the banner's aspect ratio (horizontal, vertical, or square-ish) and must create a professional layout suitable for that shape.

        **Available Assets:**
        - Headline: "${metaFields.mainHeading}"
        - Subheading: "${metaFields.subheading}"
        - Brand Colors: ${JSON.stringify(metaFields.brandColors)}
        - Has Logo: ${!!metaFields.logoUrl}
        - Has Image: ${!!metaFields.bannerImage}

        **Design Rules:**
        1.  **Layout & Hierarchy:** Create a well-balanced layout. The headline is most important. The logo should be visible but not dominant (around 15-25% of the shortest side). The subheading is secondary.
        2.  **Typography:** Use responsive font sizes. Instead of pixels, provide a numeric value for \`fontSize\`. For horizontal banners, this number will be multiplied by '1vw'. For vertical banners, '2vh'. This ensures text scales. Headline font size value should be larger than subheading.
        3.  **Readability & Padding:** Ensure all text is legible with high contrast. All elements must have a "safe zone" and not touch the edges of the banner.
        4.  **Image Masking:** If an image is used, you can apply a creative \`clipPath\` to mask it into a shape (e.g., 'polygon(...)', 'circle(...)').

        **Output Format:**
        Return a single, valid JSON object following this exact structure, with no extra text or explanations.
        {
            "backgroundColor": "string (hex code)",
            "elements": [
                {
                  "type": "logo" | "headline" | "subheading" | "cta" | "image",
                  "position": { "top": "string (%)", "left": "string (%)", "width": "string (%)", "height": "string (%)" },
                  "style": {
                    "color": "string (hex code)", "fontFamily": "string (e.g., 'Helvetica, Arial, sans-serif')", 
                    "fontSize": "number (e.g., 5.5, not '5.5vw')",
                    "fontWeight": "bold" | "normal", "textAlign": "left" | "center" | "right", 
                    "backgroundColor": "string (for cta)", "borderRadius": "string (e.g., '8px')", "clipPath": "string (for image only)"
                  }
                }
            ]
        }
        The 'elements' array MUST contain an object for EACH available asset (logo, headline, subheading, image) AND a mandatory object for the 'cta'.
        `;
      
      try {
          const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await response.json();
          if (!response.ok || !result.candidates) { throw new Error(result.error?.message || "AI request failed"); }
          const text = result.candidates[0].content.parts[0].text;
          const newDesign = JSON.parse(text.replace(/```json|```/g, ''));
          setMetaFields(mf => mf ? {...mf, design: newDesign} : null);
      } catch (e) {
          console.error("AI design generation failed:", e);
          setError("Failed to generate AI design. The AI returned an invalid format. Please try again.");
      } finally {
          setIsAiLoading(false);
      }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleScrape(); };
  
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-8"><h1 className="text-4xl font-bold mb-2">AI-Powered Ad Banner Generator</h1><p className="text-lg text-gray-600 dark:text-gray-300">Instantly create a full suite of ad banners from any website.</p></header>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"><div className="flex flex-col sm:flex-row gap-4"><input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="https://example.com" className="flex-1 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700"/>
            <button onClick={handleScrape} disabled={isScraping} className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg">{isScraping ? <FiLoader /> : <FiExternalLink />}<span>{isScraping ? 'Scraping...' : 'Scrape Content'}</span></button></div>
        </div>

        {metaFields && (
            <div className="mt-8 grid grid-cols-12 gap-8">
                {/* --- Left Column: Editor --- */}
                <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                    <EditorPanel metaFields={metaFields} setMetaFields={setMetaFields} scrapedImages={scrapedData?.images || []} brandColors={scrapedData?.brandColors || []}/>
                </div>
                {/* --- Right Column: Previews --- */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2"><FiLayout /><span>Banner Previews</span></h3>
                        <button onClick={handleGenerateDesign} disabled={isAiLoading} className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400">
                            {isAiLoading ? <FiLoader /> : <FiSparkles />} Generate Creative Design
                        </button>
                        </div>
                        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200">{error}</div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 items-start justify-items-center">
                            {availableSizes.map(size => (
                                <div key={size} className="w-full flex flex-col items-center gap-2">
                                    <h4 className="font-medium text-gray-600 dark:text-gray-300">{size.replace('x', ' x ')}</h4>
                                    <DynamicBanner metaFields={metaFields} size={size} />
                                </div>
                            ))}
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
