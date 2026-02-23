import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to proxy TimeAPI.io requests
 * Solves CORS issues by making server-side requests
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeZone = searchParams.get('timeZone');

    if (!timeZone) {
      return NextResponse.json(
        { error: 'timeZone parameter is required' },
        { status: 400 }
      );
    }

    // Make server-side request to TimeAPI.io
    const response = await fetch(
      `https://timeapi.io/api/v1/timezone/zone?timeZone=${encodeURIComponent(timeZone)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    // Strict 200 check as per data-fetching.instructions.md
    if (response.status !== 200) {
      return NextResponse.json(
        { error: 'Failed to fetch time data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Time API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
