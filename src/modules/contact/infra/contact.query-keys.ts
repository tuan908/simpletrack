import { PaginatedParams } from "@/core/contracts/Paginated";

export const contactQueryKeys = {
  all: ["contacts"] as const,
  list: ({ page, pageSize }: PaginatedParams) =>
    [...contactQueryKeys.all, "list", page, pageSize] as const,
  detail: (id: string) => [...contactQueryKeys.all, "detail", id] as const,
};