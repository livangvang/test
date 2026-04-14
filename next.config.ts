import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.ready-market.com.tw",
      },
      {
        protocol: "https",
        hostname: "www.shadowmotor.com.tw",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
