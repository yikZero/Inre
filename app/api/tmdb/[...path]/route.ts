import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    throw new Error('暂未配置 TMDB_ACCESS_TOKEN');
  }

  try {
    // 等待参数解析完成
    const { path: pathSegments } = await context.params;

    // 获取完整的 API 路径
    const path = pathSegments.join('/');

    // 获取所有查询参数
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    // 构建完整的 URL
    const url = `${TMDB_BASE_URL}/${path}${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`TMDB API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from TMDB' },
      { status: 500 },
    );
  }
}
