'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import SearchItem from '@/components/search/search-item';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import fetcher from '@/lib/fetcher';

import { Search as SearchIcon } from 'lucide-react';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  media_type: 'movie' | 'tv';
  poster_path: string;
  release_date: string;
  original_language: string;
  original_name?: string;
  original_title?: string;
}

interface SearchResponse {
  results: SearchResult[];
}

export default function SearchMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: suggestions } = useSWR<SearchResponse>(
    debouncedTerm
      ? `/api/tmdb/search/multi?query=${encodeURIComponent(debouncedTerm)}&include_adult=false&language=zh-CN`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const handleSearch = useDebouncedCallback((term) => {
    setDebouncedTerm(term);
  }, 300);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const shouldShowSuggestions =
    suggestions?.results &&
    Array.isArray(suggestions.results) &&
    suggestions.results.length > 0 &&
    inputValue.trim() !== '';

  return (
    <Popover open={isOpen && shouldShowSuggestions} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="group relative">
          <form onSubmit={handleSubmit}>
            <div className="flex h-8 w-64 flex-row items-center rounded-full bg-white/5 pl-4 pr-[0.6875rem] outline outline-1 outline-white/20 transition duration-300 hover:outline-white/15 group-focus:bg-black/60 group-focus:backdrop-blur-lg">
              <input
                placeholder="搜索电影/电视剧"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleSearch(e.target.value);
                }}
                aria-controls="search-suggestions"
                className="h-full w-full bg-transparent text-left text-sm leading-[1.375rem] text-white placeholder:text-white/45 focus:outline-none focus:ring-0"
              />
              <button type="submit">
                <SearchIcon className="size-4 cursor-pointer text-white/65 transition duration-300 hover:text-[#2563EB]" />
              </button>
            </div>
          </form>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="flex max-h-[24rem] w-80 flex-col gap-1 overflow-y-auto rounded-xl border border-white/10 bg-[#16161A]/95 p-1 backdrop-blur-3xl scrollbar-hide"
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="end"
        sideOffset={4}
      >
        {suggestions?.results &&
          Array.isArray(suggestions.results) &&
          suggestions.results.slice(0, 5).map((item) => (
            <SearchItem
              key={item.id}
              item={item}
              onSelect={(item) => {
                const type = item.media_type === 'tv' ? 'tv' : 'movie';
                router.push(`/${type}/${item.id}`);
                setInputValue('');
                setDebouncedTerm('');
              }}
            />
          ))}
      </PopoverContent>
    </Popover>
  );
}
