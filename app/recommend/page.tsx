import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '片单推荐 - INRE',
  description: 'Remember the gentle whispers of relaxation',
};

export default function Page() {
  return (
    <>
      <div className="mx-auto mt-[124px] flex max-w-[78rem] flex-col gap-0 px-6">
        <div className="text-4xl font-semibold text-white">片单推荐</div>
      </div>
    </>
  );
}
