'use client';

import Link from 'next/link';

import MediaCard from '@/components/media/media-card';
import fetcher from '@/lib/fetcher';

import { ChevronRight } from 'lucide-react';
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

interface HotProps {
  title: string;
  type: 'movie' | 'tv';
  link: string;
}

export default function HomeHot({ title, type, link }: HotProps) {
  const { data, isLoading } = useSWR<TMDBResponse>(
    `/api/tmdb/${type}/popular?language=zh-CN&page=1&region=SGP`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading || !data?.results) {
    return (
      <div className="mx-auto mt-16 max-w-[78rem] px-6">
        <div className="h-[17.2rem] w-full animate-pulse rounded-lg bg-white/5" />
      </div>
    );
  }

  const items = data.results.slice(0, 6);

  return (
    <div className="group mx-auto mt-[4.5rem] max-w-[78rem] px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row">
          <div className="flex w-full flex-row items-center gap-4">
            <h2 className="text-base font-medium text-white">{title}</h2>
            <div className="h-2 w-[1px] bg-white/25" />
            <div className="flex flex-row gap-3">
              <div className="cursor-pointer text-sm font-medium text-white/85">
                TMDB
              </div>
              <div className="cursor-not-allowed text-sm font-normal text-white/65">
                豆瓣
              </div>
            </div>
          </div>
          <Link
            href={link}
            className="flex shrink-0 flex-row items-center text-sm text-[#2563EB] opacity-0 transition duration-300 hover:opacity-80 group-hover:opacity-100"
          >
            更多
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <MediaCard
              key={item.id}
              id={String(item.id)}
              type={type}
              title={'name' in item ? item.name : item.title}
              description={
                'first_air_date' in item
                  ? item.first_air_date
                  : item.release_date
              }
              rate={item.vote_average.toFixed(1)}
              cover={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
