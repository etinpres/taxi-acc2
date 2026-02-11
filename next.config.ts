import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/taxi-acc2',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
