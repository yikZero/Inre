import { Metadata } from 'next';

import SubHeader from '@/components/header/sub-header';

export const metadata: Metadata = {
  title: '电影列表 - INRE',
  description: 'Remember the gentle whispers of relaxation',
};

export default function Page() {
  return (
    <>
      <SubHeader />
      <div className="mx-auto mt-[124px] max-w-[78rem] px-6">
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
      </div>
    </>
  );
}
