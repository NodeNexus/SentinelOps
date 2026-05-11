/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Allow all image domains for Next.js Image Optimization
  images: {
    remotePatterns: [],
  },
  // Ensure trailing slash consistency
  trailingSlash: false,
  // Production source maps (disable to reduce bundle size in prod)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
