import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '电影列表 - INRE',
  description: 'Remember the gentle whispers of relaxation',
};

export default function Page() {
  return (
    <>
      <div className="pt-[10.5rem] text-4xl font-semibold text-white">电影</div>
    </>
  );
}
