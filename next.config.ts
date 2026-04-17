import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.supaimg.com",
      },
    ],
  },
};

export default nextConfig;
