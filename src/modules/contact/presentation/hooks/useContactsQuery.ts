import { useSuspenseQuery } from "@tanstack/react-query";
import { contactQueryOptions } from "../../infra/contact.query-options";

export function useContactsQuery() {
  const { data, isLoading, isError } = useSuspenseQuery(
    contactQueryOptions.list({ page: 1, pageSize: 10 }),
  );

  if (!data.ok) {
    return { contacts: [], isLoading, isError: true };
  }

  return { contacts: data.value, isLoading, isError };
}
