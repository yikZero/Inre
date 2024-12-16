import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DOUBAN_BASE_URL = 'https://movie.douban.com/j';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: pathSegments } = await context.params;

    const path = pathSegments.join('/');

    const searchParams = request.nextUrl.searchParams;

    const url = `${DOUBAN_BASE_URL}/${path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json',
        Referer: 'https://movie.douban.com',
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      throw new Error(`Douban API responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
