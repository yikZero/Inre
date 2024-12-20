'use client';

import SubHeader from '@/components/header/sub-header';
import MediaCard from '@/components/media/media-card';
import fetcher from '@/lib/fetcher';

import useSWR from 'swr';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
}

interface TMDBResponse {
  results: (Movie | TVShow)[];
}

export default function Page() {
  const { data } = useSWR<TMDBResponse>(
    `/api/tmdb/movie/popular?language=zh-CN&page=1&region=SGP`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <>
      <SubHeader />
      <div className="mx-auto mt-[124px] flex max-w-[78rem] flex-col gap-0 px-6">
        <div className="flex flex-row justify-between py-8">
          <div className="text-2xl font-semibold text-white">近期热门电影</div>
          <div className="flex flex-row rounded-lg bg-white/10 p-0.5">
            <div className="flex h-[1.875rem] cursor-pointer items-center rounded-[6px] bg-background px-3 text-[0.9375rem] font-medium text-white">
              热门
            </div>
            <div className="flex h-[1.875rem] items-center rounded-[6px] px-3 text-[0.9375rem] text-white/65">
              最新
            </div>
            <div className="flex h-[1.875rem] items-center rounded-[6px] px-3 text-[0.9375rem] text-white/65">
              高分
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-x-5 gap-y-8">
          {data?.results.map((item) => (
            <MediaCard
              key={item.id}
              id={String(item.id)}
              type="movie"
              title={'name' in item ? item.name : item.title}
              description={
                'first_air_date' in item
                  ? item.first_air_date
                  : item.release_date
              }
              rate={item.vote_average.toFixed(1)}
              cover={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              isHomepage={false}
            />
          ))}
        </div>
      </div>
    </>
  );
}
