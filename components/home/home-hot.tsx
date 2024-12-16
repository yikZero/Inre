'use client';

import Link from 'next/link';

import MediaCard from '@/components/media-card';
import fetcher from '@/lib/fetcher';

import { ChevronRight } from 'lucide-react';
import useSWR from 'swr';

interface Subject {
  rate: string;
  title: string;
  url: string;
  cover: string;
  id: string;
  episodes_info?: string;
}

interface HotProps {
  title: string;
  type: string;
  link: string;
}

export default function HomeHot({ title, type, link }: HotProps) {
  const { data, isLoading } = useSWR<{ subjects: Subject[] }>(
    `/api/douban/search_subjects?type=${type}&tag=%E7%83%AD%E9%97%A8&page_limit=6`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading || !data?.subjects) {
    return (
      <div className="mx-auto mt-16 max-w-[78rem] px-6">
        <div className="h-[17.2rem] w-full animate-pulse rounded-lg bg-white/5" />
      </div>
    );
  }

  return (
    <div className="group mx-auto mt-[4.5rem] max-w-[78rem] px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row">
          <div className="flex w-full flex-row items-center gap-4">
            <h2 className="text-base font-medium text-white">{title}</h2>
            <div className="h-2 w-[1px] bg-white/25" />
            <div className="flex flex-row gap-3">
              <div className="text-sm font-medium text-white/85">豆瓣</div>
              <div className="text-sm text-white/65">IMDb</div>
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
          {data.subjects.map((item) => (
            <MediaCard
              key={item.id}
              title={item.title}
              description={item.episodes_info}
              rate={item.rate}
              cover={item.cover}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
