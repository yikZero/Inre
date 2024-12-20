import Image from 'next/image';

import { Logo } from '@/components/icons';
import TMDBLogo from '@/images/TMDB.png';

export default function Footer() {
  return (
    <>
      <footer className="mt-32 w-full bg-white/[0.04]">
        <div className="relative mx-auto flex max-w-[78rem] flex-row items-center justify-between px-6 pb-8 pt-10">
          <Logo className="h-8 w-auto text-white" />
          <div className="text-sm font-normal text-white/45">
            © 2024 yikZero 保留所有权利
          </div>
          <div className="flex flex-row items-center gap-2 text-sm font-normal text-white/45">
            数据来源于
            <Image
              src={TMDBLogo}
              alt="TMDBLogo"
              className="h-[0.875rem] w-auto"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/15 to-white/0"
          />
        </div>
      </footer>
    </>
  );
}
