// src/api/trpc/router.ts
import { contactRouter } from "./procedures/contacts";
import { createTrpcRouter } from "./trpc";

export const appRouter = createTrpcRouter({
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
