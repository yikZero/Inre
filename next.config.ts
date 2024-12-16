import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.yikzero.com',
      },
      {
        protocol: 'https',
        hostname: '*.doubanio.com',
      },
    ],
  },
};

export default nextConfig;
