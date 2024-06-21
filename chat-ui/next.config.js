/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MASTER_PROMPT: process.env.MASTER_PROMPT,
  },
};

module.exports = nextConfig;
