// https://github.com/pmndrs/react-three-next/blob/main/package.json
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")(["three"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }

    return config;
  },
};

module.exports = withTM(nextConfig);
