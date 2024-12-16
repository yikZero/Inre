import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '片单推荐 - INRE',
  description: 'Remember the gentle whispers of relaxation',
};

export default function Page() {
  return (
    <>
      <div className="pt-[10.5rem] text-4xl font-semibold text-white">
        片单推荐
      </div>
    </>
  );
}
