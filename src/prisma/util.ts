import { Prisma } from ".prisma/client";
import StringFilter = Prisma.StringFilter;
import { PaginationConfig } from "@/types/pagination";

export const contains = (
  str: string,
  insensitive: boolean = true
): StringFilter<any> => {
  return {
    contains: str,
    mode: insensitive ? "insensitive" : "default",
  };
};

export const startsWith = (
  str: string,
  insensitive: boolean = true
): StringFilter<any> => {
  return {
    startsWith: str,
    mode: insensitive ? "insensitive" : "default",
  };
};

export const endsWith = (
  str: string,
  insensitive: boolean = true
): StringFilter<any> => {
  return {
    endsWith: str,
    mode: insensitive ? "insensitive" : "default",
  };
};

export const paginate = (
  pagination: PaginationConfig
): { skip: number; take: number } => {
  const { page, limit } = pagination;
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
};
