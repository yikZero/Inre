import type { Metadata } from 'next';

import Footer from '@/components/footer';
import Header from '@/components/header/header';

import './globals.css';

export const metadata: Metadata = {
  title: 'INRE - 探索无垠影视世界',
  description: 'Remember the gentle whispers of relaxation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-background antialiased">
        <Header />
        <main className="min-h-dvh">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
