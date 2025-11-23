import "server-only";

import {
  createTRPCContext,
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import "server-only"; // <-- ensure this file cannot be imported from the client
import { makeQueryClient } from "./query-client";
import { appRouter } from "./router";
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    await queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    await queryClient.prefetchQuery(queryOptions);
  }
}
