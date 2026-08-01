/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cameroon-merchants/ui",
    "@cameroon-merchants/templates",
    "@cameroon-merchants/config-schema",
  ],
};

export default nextConfig;
