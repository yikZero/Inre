import { Search } from 'lucide-react';

export default function SearchButton() {
  return (
    <>
      <button className="flex h-8 w-64 flex-row items-center rounded-full bg-white/5 pl-4 pr-[0.6875rem] outline outline-white/20 transition duration-300 hover:outline-white/15">
        <span className="w-full text-left text-[0.9375rem] leading-[1.375rem] text-white/45">
          搜索
        </span>
        <Search className="size-4 text-white/65" />
      </button>
    </>
  );
}
