import Image from 'next/image';
import { notFound } from 'next/navigation';

import MediaScores from '@/components/media/media-scores';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type MediaParams = Promise<{ slug: string }>;

interface MediaPageProps {
  params: MediaParams;
  type: 'movie' | 'tv';
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCountry {
  name: string;
}

interface BaseMedia {
  id: number;
  overview: string;
  backdrop_path: string | null;
  genres: Genre[];
  production_countries: ProductionCountry[];
}

interface Movie extends BaseMedia {
  type: 'movie';
  title: string;
  release_date: string;
  runtime: number;
}

interface TVShow extends BaseMedia {
  type: 'tv';
  name: string;
  first_air_date: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
}

type Media = Movie | TVShow;

// 辅助函数
const formatMovieRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}小时${remainingMinutes}分钟`;
};

const formatTVRuntime = (minutes: number[]) => {
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

async function getMedia(
  type: 'movie' | 'tv',
  id: string,
): Promise<Media | null> {
  try {
    const res = await fetch(
      `${baseUrl}/api/tmdb/${type}/${id}?language=zh-CN`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return { ...data, type };
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
}

export default async function MediaPage(props: MediaPageProps) {
  const { slug } = await props.params;
  const media = await getMedia(props.type, slug);

  if (!media) {
    notFound();
  }

  const title = media.type === 'movie' ? media.title : media.name;
  const releaseDate =
    media.type === 'movie' ? media.release_date : media.first_air_date;
  const runtime =
    media.type === 'movie'
      ? formatMovieRuntime(media.runtime)
      : formatTVRuntime(media.episode_run_time);

  return (
    <>
      {media.backdrop_path && (
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
            src={`https://image.tmdb.org/t/p/w1280${media.backdrop_path}`}
            alt={title}
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
            {media.genres?.map((genre: Genre) => (
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
                {title}
              </h1>
              <div className="flex flex-row items-center gap-3">
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {runtime}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {formatReleaseDate(releaseDate)}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {media.production_countries?.[0]?.name || '未知'}
                </div>
                {media.type === 'tv' && (
                  <>
                    <div
                      aria-hidden
                      className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                    />
                    <div className="text-[0.9375rem] leading-[25px] text-white/85">
                      {formatStatus(media.status)}
                    </div>
                    <div
                      aria-hidden
                      className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                    />
                    <div className="text-[0.9375rem] leading-[25px] text-white/85">
                      {`${media.number_of_seasons}季 ${media.number_of_episodes}集`}
                    </div>
                  </>
                )}
              </div>
              <div className="max-w-[795px] text-[0.9375rem] font-normal leading-[25px] tracking-[0.3px] text-white/65">
                {media.overview}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <MediaScores title={title} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
