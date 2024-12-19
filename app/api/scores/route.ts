// app/api/scores/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    if (!title) {
      return new Response('Missing title parameter', { status: 400 });
    }

    const res = await fetch(
      `http://8.141.94.147/film_collect/GetFilmScoreServlet?t=${title}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!res.ok) {
      return new Response('Failed to fetch scores', { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600', // 1小时缓存
      },
    });
  } catch (error) {
    console.error('Error in scores API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
