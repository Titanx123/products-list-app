/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig