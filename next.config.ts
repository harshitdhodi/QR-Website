import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.qradmin.rndtd.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/auth/otp',
          destination: 'https://www.qradmin.rndtd.com/api/auth/otp',
        },
        {
          source: '/api/auth/register',
          destination: 'https://www.qradmin.rndtd.com/api/auth/register',
        },
      ],
      fallback: [
        {
          source: '/api/:path*',
          destination: 'https://www.qradmin.rndtd.com/api/:path*',
        },
      ]
    }
  },
};

export default nextConfig;