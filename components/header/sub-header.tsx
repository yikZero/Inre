import Image from 'next/image';

import IMDbLogo from '@/images/IMDb.png';
import DoubanLogo from '@/images/douban.png';

export default function SubHeader() {
  return (
    <>
      <div className="fixed inset-x-0 top-[4.5rem] h-[3.375rem] border-b border-white/[0.09] bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[78rem] flex-row items-center gap-3 px-6">
          <div className="flex h-[1.75rem] flex-row items-center gap-[6px] rounded-[6px] bg-white px-3">
            <Image
              src={DoubanLogo}
              alt="douban"
              className="size-[1.125rem] rounded-full"
            />
            <div className="text-sm font-medium text-[#007711]">豆瓣</div>
          </div>
          <div className="flex h-[1.75rem] flex-row items-center gap-[6px] rounded-[6px] px-3">
            <Image
              src={IMDbLogo}
              alt="IMDb"
              className="size-[1.125rem] rounded-full grayscale"
            />
            <div className="text-sm font-normal text-white/65">IMDb</div>
          </div>
        </div>
      </div>
    </>
  );
}
