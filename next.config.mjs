// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Use boolean instead of "loose" string
    esmExternals: true,
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable standalone output for Docker
  output: "standalone",

  // Webpack configuration for client-side fallbacks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Remove generateStaticParams - this is NOT a valid Next.js config option
  // This function belongs in page components, not in next.config.js

  // Remove onDemandEntries - this is for development mode only and deprecated

  // Simplified async functions (return empty arrays if no custom logic needed)
  async headers() {
    return [];
  },

  async rewrites() {
    return [];
  },

  async redirects() {
    return [];
  },
};

export default nextConfig;
