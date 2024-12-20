'use client';

import Image from 'next/image';
import { StaticImageData } from 'next/image';

import IMDbLogo from '@/images/IMDb.png';
import Rottentomatoes from '@/images/Rotten tomatoes.png';
import DoubanLogo from '@/images/douban.png';

import useSWR from 'swr';

interface MediaScore {
  score: string;
  fullscore: string;
  votecount: string;
}

interface MediaScores {
  code: string;
  imdb?: MediaScore;
  db?: MediaScore;
  lfq?: MediaScore;
}

interface ScoreDisplayProps {
  score: string;
  fullscore: string;
  icon: StaticImageData;
  alt: string;
}

interface MediaScoresProps {
  title: string;
  className?: string;
}

const SCORE_SOURCES = [
  { key: 'db', icon: DoubanLogo, alt: 'Douban' },
  { key: 'imdb', icon: IMDbLogo, alt: 'IMDb' },
  { key: 'lfq', icon: Rottentomatoes, alt: 'Rotten Tomatoes' },
] as const;

const fetchMediaScores = async (title: string): Promise<MediaScores | null> => {
  try {
    const encodedTitle = encodeURIComponent(title);
    const res = await fetch(`/api/scores?title=${encodedTitle}`);

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching scores:', error);
    return null;
  }
};

function useMediaScores(title: string | undefined) {
  return useSWR<MediaScores | null>(
    title ? `/api/scores/${title}` : null,
    () => (title ? fetchMediaScores(title) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      revalidateOnMount: true,
    },
  );
}

const formatScore = (score: string, defaultValue: string = '-'): string => {
  if (!score || score === '') return defaultValue;
  return score;
};

const ScoreDisplay = ({ score, fullscore, icon, alt }: ScoreDisplayProps) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <Image src={icon} alt={alt} className="size-6 rounded-full" />
      <div className="flex flex-row items-baseline gap-0.5">
        <div className="text-xl font-semibold text-white/85">
          {formatScore(score)}
        </div>
        <div className="text-xs font-semibold text-white/45">/{fullscore}</div>
      </div>
    </div>
  );
};

export default function MediaScores({
  title,
  className = '',
}: MediaScoresProps) {
  const { data: scores } = useMediaScores(title);

  if (!scores || scores.code !== '0')
    return (
      <>
        <div className="size-4 bg-transparent"></div>
      </>
    );

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {SCORE_SOURCES.map(({ key, icon, alt }) => {
        const scoreData = scores[key as keyof MediaScores] as
          | MediaScore
          | undefined;
        if (!scoreData?.score) return null;

        return (
          <ScoreDisplay
            key={key}
            score={scoreData.score}
            fullscore={scoreData.fullscore}
            icon={icon}
            alt={alt}
          />
        );
      })}
    </div>
  );
}
