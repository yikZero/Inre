import Image from 'next/image';
import Link from 'next/link';

interface MediaCardProps {
  id: string;
  title: string;
  description?: string;
  type: string;
  rate?: string;
  cover: string;
}

export default function MediaCard({
  id,
  title,
  description,
  type,
  rate,
  cover,
}: MediaCardProps) {
  return (
    <>
      <Link href={`/${type}/${id}`} className="flex flex-col">
        <div className="relative h-[17.2rem] w-full overflow-hidden rounded-lg">
          {rate && (
            <div className="absolute right-0 top-0 z-10 rounded-bl-lg rounded-tr-lg bg-black/25 px-2 py-0.5 text-sm font-medium text-white/85">
              {rate}
            </div>
          )}
          <Image
            loading="lazy"
            src={cover}
            sizes="96px"
            fill
            alt={title}
            className="object-cover transition duration-500 hover:scale-105"
          />
        </div>
        <div className="flex flex-col">
          <div className="line-clamp-1 pb-1 pt-2 text-[0.9375rem] font-medium leading-[1.4375rem] text-white/85">
            {title}
          </div>
          {description && (
            <div className="line-clamp-1 text-sm leading-[1.375rem] text-white/65">
              {description}
            </div>
          )}
        </div>
      </Link>
    </>
  );
}
