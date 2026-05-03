import type { NextConfig } from "next";

// When deploying to GitHub Pages under https://<user>.github.io/HOBOEM/
// the build needs basePath/assetPrefix. Set NEXT_PUBLIC_BASE_PATH in CI.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactCompiler: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
