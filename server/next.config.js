/** @type {import('next').NextConfig} */
const nextConfig = {
  // prevent double render on dev mode, which causes 2 frames to exist
  reactStrictMode: false,
  images: {
    minimumCacheTTL: 1, // to allow dynamic images in case you are previewing them using next/image
    remotePatterns: [
      {
        hostname: "*",
        protocol: "http",
      },
      {
        hostname: "*",
        protocol: "https",
      },
    ],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    })
 
    return config
  },
};

export default nextConfig;
