// core/contracts/Paginated.ts

export interface Paginated<T> {
  items: T[];
  total: number; // total number of items across all pages
  page: number; // current page (1-based)
  pageSize: number; // items per page
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function createPaginated<T>(params: {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}): Paginated<T> {
  const { items, total, page, pageSize } = params;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
