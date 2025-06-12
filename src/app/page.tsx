'use client';

import { useState, useEffect } from 'react';
import { FiExternalLink, FiImage, FiLoader } from 'react-icons/fi';
import BannerPreview from '../components/BannerPreview';
import MetaFieldsForm from '../components/MetaFieldsForm';
import { ScrapedData, MetaFields } from './types';

export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New meta fields state
  const [metaFields, setMetaFields] = useState<MetaFields>({
    mainHeading: '',
    subheading: '',
    bodyText: '',
    cta: '',
    logoUrl: '',
    bannerImages: []
  });

  const handleScrape = async () => {
    if (!websiteUrl) return;

    setIsLoading(true);
    setError(null);
    setScrapedData(null);

    try {
      if (!websiteUrl.startsWith('http')) {
        throw new Error('Please include http:// or https://');
      }

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: websiteUrl }),
      });

      const data = await response.json();
      console.log('Full response:', { status: response.status, data });

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Request failed');
      }

      setScrapedData(data);
    } catch (err) {
      console.error('Full error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrapedData) {
      setMetaFields({
        mainHeading: scrapedData.headings[0] || '',
        subheading: scrapedData.headings[1] || '',
        bodyText: scrapedData.headings.slice(2).join(' ') || '',
        cta: 'Click Here',
        logoUrl: scrapedData.logo || '', // Use the new logo field
        bannerImages: scrapedData.images.slice(0) || []
      });
    }
  }, [scrapedData]);
  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScrape();
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>AI-Powered Ad Banner Generator</h1>
          <p style={{ color: 'var(--foreground)' }}>Create stunning ads from any website content</p>
        </header>

        <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          {/* Input Section */}
          <div className="p-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Website Content Scraper</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className="flex-1 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--card-border)'
                }}
              />
              <button
                onClick={handleScrape}
                disabled={isLoading || !websiteUrl}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                  isLoading || !websiteUrl
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <FiExternalLink />
                    <span>Scrape Content</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="p-6">
            {scrapedData ? (
              <div className="space-y-6">
                {/* Headings */}
                {scrapedData.headings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>Headings</h3>
                    <div className="space-y-2">
                      {scrapedData.headings.map((heading, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg border"
                          style={{
                            backgroundColor: 'var(--card-bg)',
                            borderColor: 'var(--card-border)'
                          }}
                        >
                          <h4 className="font-medium" style={{ color: 'var(--foreground)' }}>{heading}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                {scrapedData.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                      <FiImage />
                      <span>Images</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {scrapedData.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg border"
                          style={{ borderColor: 'var(--card-border)' }}
                        >
                          <img
                            src={img.startsWith('http') ? img : `https://${new URL(websiteUrl).hostname}${img}`}
                            alt={`Scraped image ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center">
                            <a
                              href={img.startsWith('http') ? img : `https://${new URL(websiteUrl).hostname}${img}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white px-3 py-1 rounded-lg text-sm"
                              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                            >
                              View Full
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Fields Form */}
                <div className="mt-8">
                  <MetaFieldsForm metaFields={metaFields} onChange={setMetaFields} />
                </div>

                {/* Live Banner Preview */}
                <div className="mt-8 flex justify-center">
                  <BannerPreview metaFields={metaFields} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <FiExternalLink className="text-3xl" style={{ color: 'var(--foreground)' }} />
                </div>
                <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  {isLoading ? 'Scraping website...' : 'No content scraped yet'}
                </h3>
                <p style={{ color: 'var(--foreground)' }} className="max-w-md">
                  Enter a website URL and click "Scrape Content" to extract headings, text, and images.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
