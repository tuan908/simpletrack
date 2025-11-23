import type { NextConfig } from "next";
import createIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: ["http://localhost:3000"],
  experimental: {
    scrollRestoration: true,
    authInterrupts: true,
    appNavFailHandling: true,
    globalNotFound: true,
    useWasmBinary: true,
    optimisticClientCache: true,
    optimizeCss: true,
    optimizeServerReact: true,
    prerenderEarlyExit: true,
    preloadEntriesOnStart: true,
    parallelServerCompiles: true,
    proxyPrefetch: "flexible",
  },
};

const withIntlPlugin = createIntlPlugin("./src/core/i18n/request.ts");

export default withIntlPlugin(nextConfig);
