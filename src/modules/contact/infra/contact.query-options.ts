import { PaginatedParams } from "@/core/contracts/Paginated";
import { queryOptions } from "@tanstack/react-query";
import { contactApi } from "./contact.api";
import { contactQueryKeys } from "./contact.query-keys";

export const contactQueryOptions = {
  list: ({ page, pageSize }: PaginatedParams) =>
    queryOptions({
      queryKey: contactQueryKeys.list({ page, pageSize }),
      queryFn: () => contactApi.getContacts({ page, pageSize }),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: contactQueryKeys.detail(id),
      queryFn: () => contactApi.getContactById(id),
    }),
};
