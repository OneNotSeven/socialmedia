import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";
import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

// ✅ Define the Next.js config
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "encrypted-tbn0.gstatic.com",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "firebasestorage.googleapis.com",
      "m.media-amazon.com",
      "d1csarkz8obe9u.cloudfront.net",
      "i.pinimg.com",
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
  },
};

const config = (phase: string) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    return withPWA({
      dest: "public",
    })(nextConfig); // ✅ Correctly apply PWA to Next.js config
  }
  return nextConfig;
};

export default config;
