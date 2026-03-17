import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cache optimised images for 24 hours instead of the default few seconds.
    // This prevents Next.js from re-downloading and re-optimising the same
    // image on every page navigation, which was the main source of slowness.
    minimumCacheTTL: 86400,
    // Serve modern formats (avif first, then webp) when the browser supports
    // them — typically 30–60 % smaller than the original JPEG/PNG.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
      },
      {
        protocol: "https",
        hostname: "test.com",
      },
      {
        protocol: "http",
        hostname: "test.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ],
  },
};

export default nextConfig;
