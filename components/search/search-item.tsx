import { useCallback, useRef } from 'react';

import Image from 'next/image';

import { SearchResult } from '@/components/search/search-menu';
import { cn } from '@/lib/utils';

const getYear = (date: string) => {
  if (!date) return '';
  const year = new Date(date).getFullYear();
  return !isNaN(year) ? `（${year}）` : '';
};

interface SearchItemProps {
  item: SearchResult;
  onSelect: (item: SearchResult) => void;
}

export default function SearchItem({ item, onSelect }: SearchItemProps) {
  const imageErrorRef = useRef(false);
  const year = getYear(item.release_date);

  const handleImageError = useCallback(() => {
    imageErrorRef.current = true;
  }, []);

  return (
    <li
      onClick={() => onSelect(item)}
      className={cn(
        'group flex w-full cursor-pointer flex-row gap-[0.625rem] rounded-lg p-2 transition duration-300 hover:bg-white/15',
      )}
    >
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-[2px]">
        {!imageErrorRef.current && item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title || item.name || ''}
            sizes="48px"
            fill
            className="object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-white/5 text-xs font-medium text-white/30">
            暂无
            <br />
            图片
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-[0.9375rem] font-medium leading-[21px] text-white/85">
          {item.title || item.name}
          {year}
        </div>
        <div className="line-clamp-1 text-[0.8125rem] font-normal text-white/65">
          {item.media_type === 'tv' ? '电视剧' : '电影'}
          {item.original_language !== 'zh'
            ? ` / ${item.original_name || item.original_title}`
            : ''}
        </div>
        <div className="line-clamp-2 whitespace-normal text-[0.8125rem] font-normal text-white/45">
          {item.overview?.trim()}
        </div>
      </div>
    </li>
  );
}
