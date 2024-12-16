'use client';

import Image from 'next/image';
import Link from 'next/link';

import { type RecommendProps } from '@/lib/data/recommend-data';
import fetcher from '@/lib/fetcher';

import { ChevronRight } from 'lucide-react';
import useSWR from 'swr';

interface HomeRecommendCardProps {
  title: string;
  link: string;
  recommendData: RecommendProps[];
}

interface TMDBResponse {
  poster_path: string;
  title?: string;
  name?: string;
}

interface TMDBFindResponse {
  movie_results: TMDBResponse[];
  tv_results: TMDBResponse[];
}

interface MediaPosterProps {
  imdbId: string;
  tmdbId?: number;
  mediaType?: 'movie' | 'tv';
}

function MediaPoster({ imdbId, tmdbId, mediaType }: MediaPosterProps) {
  const apiUrl =
    tmdbId && mediaType
      ? `/api/tmdb/${mediaType}/${tmdbId}?language=zh-CN`
      : `/api/tmdb/find/${imdbId}?external_source=imdb_id&language=zh-CN`;

  const { data, isLoading } = useSWR<TMDBResponse | TMDBFindResponse>(
    apiUrl,
    fetcher,
    { revalidateOnFocus: false },
  );

  const media = tmdbId
    ? (data as TMDBResponse)
    : (data as TMDBFindResponse)?.movie_results[0] ||
      (data as TMDBFindResponse)?.tv_results[0];

  if (isLoading || !media) {
    return <div className="h-48 w-full animate-pulse rounded-lg bg-white/5" />;
  }

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg">
      <Image
        loading="lazy"
        src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
        alt={media.title || media.name || '海报'}
        fill
        className="object-cover"
        sizes="96px"
      />
    </div>
  );
}

export default function HomeRecommendCard({
  title,
  link,
  recommendData,
}: HomeRecommendCardProps) {
  return (
    <div className="group flex w-full flex-col gap-3 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.09] px-4 pb-4 pt-3 outline outline-white/10 transition duration-300 hover:from-white/[0.07] hover:to-white/[0.13] hover:outline-white/15">
      <div className="flex flex-row">
        <h2 className="w-full text-[0.9375rem] font-medium text-white">
          {title}
        </h2>
        <Link
          href={link}
          className="flex shrink-0 flex-row items-center gap-1 text-sm text-[#2563EB] opacity-0 transition duration-300 hover:opacity-80 group-hover:opacity-100"
        >
          查看片单 <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="flex flex-row gap-3">
        {recommendData.map((item) => (
          <MediaPoster
            key={item.imdb_id}
            imdbId={item.imdb_id}
            tmdbId={item.tmdb_id}
            mediaType={item.media_type}
          />
        ))}
      </div>
    </div>
  );
}
