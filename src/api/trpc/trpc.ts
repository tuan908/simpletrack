import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const createTrpcRouter = t.router;
export const publicProcedure = t.procedure;
