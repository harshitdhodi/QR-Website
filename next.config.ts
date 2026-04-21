import type { NextConfig } from "next";
import { getAdminOrigin } from "./src/lib/adminOrigin";

const adminOrigin = getAdminOrigin();

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       // Forward backend API calls, but do NOT interfere with NextAuth at `/api/auth/*`.
  //       // We proxy the backend under `/api/backend/*` to avoid route collisions.
  //       source: "/api/backend/:path*",
  //       destination: `${adminOrigin}/api/:path*`,
  //     },
  //   ];
  // },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3060",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3060",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.qradmin.rndtd.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "qradmin.rndtd.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;