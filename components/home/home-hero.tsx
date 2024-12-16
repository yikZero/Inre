'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { ArrowUpRight, ChevronRight } from 'lucide-react';

export default function HomeHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 -z-10 h-[50.625rem] w-full"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 75%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 75%, transparent 100%)',
          }}
        >
          <Image
            src="https://cdn.yikzero.com/markdown/images/202412162223929.png"
            alt="Background Image"
            fill
            unoptimized
            loading="eager"
            className={cn(
              'object-cover object-top blur-xl transition duration-1000',
              { 'blur-none': isLoaded },
            )}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-[#09090B]/[0.88]" />
        </div>
        <div className="mx-auto flex flex-col items-center gap-12 px-6 pt-[10.5rem]">
          <Link
            target="_blank"
            href="https://ro.yikzero.com/about"
            className="group flex w-fit flex-row gap-1.5 rounded-full border border-white/15 bg-white/10 py-0.5 pl-0.5 pr-2 backdrop-blur-sm transition duration-300 hover:border-white/10"
          >
            <Image
              width={24}
              height={24}
              src="https://cdn.yikzero.com/roominess5/designwork/avatar.jpg!/fw/96"
              alt="Avatar"
              className="rounded-full object-cover object-center"
            />
            <div className="flex flex-row items-center gap-0.5 text-sm text-white/65 transition duration-300 group-hover:text-white/85">
              了解作者
              <ArrowUpRight className="size-4" />
            </div>
          </Link>
          <div className="flex flex-col items-center gap-6">
            <h1 className="flex flex-col text-5xl font-semibold leading-[4rem] tracking-[0.06rem] text-white">
              <span>探索无垠影视世界</span>
              <span>尽享精彩视听盛宴</span>
            </h1>
            <div className="flex flex-col items-center text-[0.9375rem] leading-6 tracking-[0.3px] text-white/65">
              <span>
                👏 欢迎来到 INRE，这是一个融合个人兴趣与技术实践的影视搜索平台。
              </span>
              <span>
                作为一名热爱电影的设计师，希望为同样热爱影视的你提供便捷的观影体验。
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <button className="flex h-10 flex-row items-center gap-1 rounded-lg border border-white/15 bg-gradient-to-b from-[#2563EB] to-[#0050FF] pl-4 pr-[0.625rem] text-[0.9375rem] font-medium text-white transition duration-300 hover:opacity-80">
              开始探索
              <ChevronRight className="size-4 text-white" />
            </button>
            <button className="h-10 rounded-lg border border-white/10 bg-black/25 px-4 text-[0.9375rem] font-medium text-white transition duration-300 hover:opacity-80">
              查看推荐
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
