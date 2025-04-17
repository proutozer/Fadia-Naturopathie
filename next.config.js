/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactive la vérification ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  // Si vous avez aussi des problèmes de types TypeScript
  typescript: {
    // Désactiver la vérification TypeScript pendant le build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
