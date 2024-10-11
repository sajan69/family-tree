/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['drive.google.com', 'lh3.googleusercontent.com','res.cloudinary.com'],
      },
    webpack(config) {
        config.resolve.fallback = {
    
          // if you miss it, all the other options in fallback, specified
          // by next.js will be dropped.
          ...config.resolve.fallback,  
    
          fs: false, // the solution
        };
        
        return config;
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript:{
      ignoreBuildErrors: true,
    }
  }
  
  
    export default nextConfig;