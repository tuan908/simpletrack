// src/api/trpc/router.ts
import { contactsRouter } from "./procedures/contacts";
import { createTrpcRouter } from "./trpc";

export const appRouter = createTrpcRouter({
  contact: contactsRouter,
});

export type AppRouter = typeof appRouter;
