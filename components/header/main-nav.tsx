'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { allLinks } from '@/lib/data/nav-links-data';
import { cn } from '@/lib/utils';

export default function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-row">
      {allLinks.map((link) => {
        const linkUrl = `/${link.id}`;
        const match = new RegExp(`^${linkUrl}`);
        const isActive = match.test(pathname);
        return (
          <Link key={link.id} href={link.link} className="h-[4.5rem] px-4">
            <div
              className={cn(
                'relative flex h-full items-center text-[0.875rem] text-white/65 transition duration-300 hover:text-white/85',
                isActive && 'font-medium text-white/85',
              )}
            >
              {link.label}
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-[0.125rem] rounded-t-full bg-white/85" />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
