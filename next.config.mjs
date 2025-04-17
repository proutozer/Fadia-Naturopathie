/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Désactive explicitement ESLint pendant le build
      ignoreDuringBuilds: true,
    },
    // Désactiver également la vérification des types TypeScript
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  