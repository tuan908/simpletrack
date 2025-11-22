import { useTRPC } from "@/api/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useContactsQuery() {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useSuspenseQuery(
    trpc.contacts.list.queryOptions({
      page: 1,
      pageSize: 10,
    })
  );

  if (!data.ok) {
    return { contacts: [], isLoading, isError: true };
  }

  return { contacts: data.value, isLoading, isError };
}
