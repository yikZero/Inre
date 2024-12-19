import Image from 'next/image';
import { notFound } from 'next/navigation';

import { QuantityIndicatorIcon } from '@/components/icons';
import MediaScores from '@/components/media-scores';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Genre {
  id: number;
  name: string;
}

interface ProductionCountry {
  name: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  backdrop_path: string | null;
  genres: Genre[];
  production_countries: ProductionCountry[];
}

// 辅助函数
const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}小时${remainingMinutes}分钟`;
};

const formatReleaseDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

async function getMovie(id: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${baseUrl}/api/tmdb/movie/${id}?language=zh-CN`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) {
    notFound();
  }

  return (
    <>
      {movie.backdrop_path && (
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
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title}
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
            {movie.genres?.map((genre: Genre) => (
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
                {movie.title}
              </h1>
              <div className="flex flex-row items-center gap-3">
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {formatRuntime(movie.runtime)}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {formatReleaseDate(movie.release_date)}
                </div>
                <div
                  aria-hidden
                  className="h-[14px] w-[1.5px] rotate-[15deg] bg-white/25"
                />
                <div className="text-[0.9375rem] leading-[25px] text-white/85">
                  {movie.production_countries?.[0]?.name || '未知'}
                </div>
              </div>
              <div className="max-w-[795px] text-[0.9375rem] font-normal leading-[25px] tracking-[0.3px] text-white/65">
                {movie.overview}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <MediaScores title={movie.title} />
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
