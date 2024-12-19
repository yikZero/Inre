import { Suspense } from 'react';

import Link from 'next/link';

import MainNav from '@/components/header/main-nav';
import { Logo } from '@/components/icons';
import SearchMenu from '@/components/search/search-menu';

export default function Header() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-[4.5rem] items-center justify-center border-b border-white/[0.09] transition duration-300">
        <div className="flex w-full max-w-[78rem] items-center justify-between px-6">
          <div className="flex flex-row items-center gap-6">
            <Link href="/" className="transition duration-300 hover:opacity-80">
              <Logo className="h-[2.25rem] w-auto text-foreground" />
            </Link>
            <div className="h-4 w-[1px] bg-white/15" />
            <MainNav />
          </div>
          <Suspense>
            <SearchMenu />
          </Suspense>
        </div>
      </header>
    </>
  );
}
