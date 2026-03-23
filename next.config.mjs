/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
 async redirects() {
    return [
      // Redirect any attempts to access the deprecated auth route to the main login
      {
        source: '/(auth)/login',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
