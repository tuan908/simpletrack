import { useTRPC } from "@/api/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface UseContactsQueryProps {
  search?: string;
}

export function useContactsQuery({search}: UseContactsQueryProps) {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useSuspenseQuery(
    trpc.contact.list.queryOptions({
      page: 1,
      pageSize: 10,
      search
    }),
  );

  if (!data.ok) {
    return { contacts: [], isLoading, isError: true };
  }

  return { contacts: data.value, isLoading, isError };
}
