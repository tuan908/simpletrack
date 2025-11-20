import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
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
  }
};

export default nextConfig;
