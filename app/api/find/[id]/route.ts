import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/db';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const DOUBAN_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
};

interface MediaResult {
  imdbId: string | null;
  type: 'movie' | 'tv';
  doubanRating: number | null;
  summary: string | null;
}

async function getDetailsFromDouban(doubanId: string): Promise<MediaResult> {
  try {
    const response = await fetch(
      `https://movie.douban.com/subject/${doubanId}/`,
      {
        headers: DOUBAN_HEADERS,
      },
    );

    if (!response.ok) {
      throw new Error(`豆瓣请求失败: ${response.status}`);
    }

    const html = await response.text();

    // 匹配IMDb ID
    const imdbMatch = html.match(/IMDb:.*?(tt\d+)/i);
    const imdbId = imdbMatch ? imdbMatch[1] : null;

    // 匹配豆瓣评分 - 在class="rating_num"的标签中
    const ratingMatch = html.match(
      /<strong[^>]*class="[^"]*rating_num[^"]*"[^>]*>(\d+\.\d+)<\/strong>/,
    );
    const doubanRating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

    // 匹配剧情简介
    let summaryMatch = html.match(
      /<span class="introduction">([\s\S]*?)<\/span>/,
    );
    if (!summaryMatch) {
      // 备选匹配pattern
      summaryMatch = html.match(
        /<span property="v:summary".*?>([\s\S]*?)<\/span>/,
      );
    }
    const summary = summaryMatch
      ? summaryMatch[1].trim().replace(/<.*?>/g, '').replace(/\s+/g, ' ')
      : null;

    const isTV =
      html.includes('集数:') || html.includes('季数:') || html.includes('剧集');
    const type = isTV ? 'tv' : 'movie';

    return {
      imdbId,
      type,
      doubanRating,
      summary,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('获取豆瓣详情失败: ' + (error as Error).message);
  }
}

async function getTmdbIdAndTitle(
  imdbId: string,
  type: 'movie' | 'tv' | 'other',
): Promise<{ tmdbId: number | null; title: string | null }> {
  try {
    const response = await fetch(
      `${baseUrl}/api/tmdb/find/${imdbId}?external_source=imdb_id`,
    );

    if (!response.ok) {
      throw new Error(`TMDB查询失败: ${response.status}`);
    }

    const data = await response.json();
    const results = type === 'tv' ? data.tv_results : data.movie_results;

    if (!results?.length) {
      return { tmdbId: null, title: null };
    }

    const tmdbId = results[0].id;
    const detailsResponse = await fetch(
      `${baseUrl}/api/tmdb/${type}/${tmdbId}?language=zh-CN`,
    );

    if (!detailsResponse.ok) {
      throw new Error(`TMDB详情获取失败: ${detailsResponse.status}`);
    }

    const details = await detailsResponse.json();
    const title = type === 'tv' ? details.name : details.title;

    return { tmdbId, title };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('获取TMDB详情失败');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: 'INVALID_PARAMETERS',
          message: '请提供正确的参数',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 查询数据库
    const existingMedia = await prisma.media.findUnique({
      where: { doubanId: id },
      select: {
        title: true,
        type: true,
        doubanId: true,
        imdbId: true,
        tmdbId: true,
        doubanRating: true,
        summary: true,
      },
    });

    if (existingMedia) {
      return NextResponse.json(existingMedia);
    }

    // 获取豆瓣详情
    const { imdbId, type, doubanRating, summary } =
      await getDetailsFromDouban(id);
    if (!imdbId) {
      return new NextResponse(
        JSON.stringify({
          error: 'IMDB_ID_NOT_FOUND',
          message: '无法获取IMDB ID',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 获取TMDB信息
    const { tmdbId, title } = await getTmdbIdAndTitle(imdbId, type);
    if (!tmdbId || !title) {
      return new NextResponse(
        JSON.stringify({
          error: 'TMDB_DETAILS_NOT_FOUND',
          message: '无法获取TMDB详情',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 保存到数据库
    const newMedia = await prisma.media.create({
      data: {
        title,
        type,
        doubanId: id,
        imdbId,
        tmdbId,
        doubanRating,
        summary,
      },
      select: {
        title: true,
        type: true,
        doubanId: true,
        imdbId: true,
        tmdbId: true,
        doubanRating: true,
        summary: true,
      },
    });

    return NextResponse.json(newMedia);
  } catch (error) {
    const message = error instanceof Error ? error.message : '服务器内部错误';

    return new NextResponse(
      JSON.stringify({
        error: 'INTERNAL_SERVER_ERROR',
        message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
