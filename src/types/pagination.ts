export type PaginationConfig = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  maxSize: number;
};
