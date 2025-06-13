import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  try {
    const backendResponse = await fetch('http://localhost:3001/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const data = await backendResponse.json();
    
    const response = {
      headings: data.headings || [],
      images: data.images || [],
      logo: data.logo || null,
      brandColors: data.brandColors || [], // Add brandColors
      error: data.error
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scraping failed' },
      { status: 500 }
    );
  }
}