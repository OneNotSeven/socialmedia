import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['encrypted-tbn0.gstatic.com','hebbkx1anhila5yf.public.blob.vercel-storage.com','firebasestorage.googleapis.com',"m.media-amazon.com",'d1csarkz8obe9u.cloudfront.net','i.pinimg.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
