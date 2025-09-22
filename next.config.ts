import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://192.168.56.1:3000",
    ],
  },
} as any;

export default nextConfig;
