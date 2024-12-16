import HomeRecommendCard from '@/components/home/home-recommend-card';
import { ccRecommends, yikZeroRecommends } from '@/lib/data/recommend-data';

export default function HomeRecommends() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-[78rem] flex-row gap-4 px-6 pt-36">
        <HomeRecommendCard
          title="陈宝推荐"
          link="/recommend"
          recommendData={ccRecommends}
        />
        <HomeRecommendCard
          title="张宝推荐"
          link="/recommend"
          recommendData={yikZeroRecommends}
        />
      </div>
    </>
  );
}
