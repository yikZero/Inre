import HomeHero from '@/components/home/home-hero';
import HomeHot from '@/components/home/home-hot';
import HomeRecommends from '@/components/home/home-recommends';

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeRecommends />
      <HomeHot title="近期热门电视剧" type="tv" link="/tv" />
      <HomeHot title="近期热门电影" type="movie" link="/movie" />
    </>
  );
}
