import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // 90 keeps text and chart labels in dashboard screenshots crisp
    qualities: [75, 90],
  },
};

export default nextConfig;
