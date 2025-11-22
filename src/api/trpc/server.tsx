import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCContext, createTRPCOptionsProxy, TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
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

export async function HydrateClient(props: { children: React.ReactNode }) {
  // Read request headers to satisfy Next.js requirement that Server Components
  // access a request-specific data source before using current-time dependent
  // operations (e.g. React cache/dehydrate internals that use Date.now()).
  // We don't use the headers value here; reading it is sufficient.
  void headers();

  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}