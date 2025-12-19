/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/',
  },

  // Image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
};

export default nextConfig;
