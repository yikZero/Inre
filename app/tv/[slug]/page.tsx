import Image from 'next/image';

import { QuantityIndicatorIcon } from '@/components/icons';
import MediaScores from '@/components/media-scores';

interface Genre {
  id: number;
  name: string;
}

interface ProductionCountry {
  name: string;
}

interface TVShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  episode_run_time: number[];
  backdrop_path: string | null;
  genres: Genre[];
  production_countries: ProductionCountry[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 辅助函数
const formatRuntime = (minutes: number[]) => {
  if (!minutes || minutes.length === 0) return '未知';
  const avgRuntime = Math.floor(
    minutes.reduce((a, b) => a + b, 0) / minutes.length,
  );
  return `${avgRuntime}分钟/集`;
};

const formatReleaseDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'Returning Series': '连载中',
    Ended: '已完结',
    Canceled: '已取消',
    'In Production': '制作中',
  };
  return statusMap[status] || status;
};

async function getTVShow(id: string): Promise<TVShow> {
  const res = await fetch(`${baseUrl}/api/tmdb/tv/${id}?language=zh-CN`);
  if (!res.ok) throw new Error('Failed to fetch TV show');
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const tv = await getTVShow(slug);

  return (
    <>
      {tv.backdrop_path && (
        <div
          className="relative -z-10 h-[520px] w-full"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 25%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 25%, transparent 100%)',
          }}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`}
            alt={tv.name}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-x-0 top-0 h-[5.5rem] bg-gradient-to-b from-black/65 to-black/0" />
        </div>
      )}
      <div className="mx-auto -mt-[8.75rem] flex max-w-[78rem] flex-col gap-[72px] px-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-2">
            {tv.genres?.map((genre: Genre) => (
              <div
                key={genre.id}
                className="flex h-[1.625rem] items-center rounded-full bg-white/10 px-3 text-sm font-medium text-white/85 backdrop-blur-sm"
              >
                {genre.name}
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-5xl font-semibold leading-[64px] tracking-[1px] text-white">
                {tv.name}
              </h1>
              <div className="flex flex-row items-center gap-3">
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {formatRuntime(tv.episode_run_time)}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {formatReleaseDate(tv.first_air_date)}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {tv.production_countries?.[0]?.name || '未知'}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {formatStatus(tv.status)}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {`${tv.number_of_seasons}季 ${tv.number_of_episodes}集`}
                </div>
              </div>
              <div className="max-w-[795px] text-[0.9375rem] font-normal leading-[25px] tracking-[0.3px] text-white/65">
                {tv.overview}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <MediaScores title={tv.name} />
              <div className="flex flex-row gap-1">
                {[...Array(3)].map((_, index) => (
                  <QuantityIndicatorIcon
                    key={index}
                    className={`text-white/${index === 0 ? '85' : '45'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
