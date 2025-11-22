import { createContext } from "@/api/trpc/context";
import { appRouter } from "@/api/trpc/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// Minimal server-side context creator. Do not import client-only helpers
// (like createTRPCContext) here — that can pull in the vendored RSC react
// runtime which may not expose client React APIs. If you need request
// information in your trpc context, read it from `req` and return it here.

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
