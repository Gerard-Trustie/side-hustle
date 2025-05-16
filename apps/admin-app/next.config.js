/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trustie-userfile.s3.eu-west-1.amazonaws.com",
        port: "",
        pathname: "/protected/**",
      },
      {
        protocol: "https",
        hostname: "trustie.co.uk",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
