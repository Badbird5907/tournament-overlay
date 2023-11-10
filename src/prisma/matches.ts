import { PaginationConfig } from "@/types/pagination";
import { paginate, paginatedQuery } from "@/prisma/util";
import prisma from "@/prisma/index";

export const getAllMatches = async () => {
  return prisma.matches.findMany({
    orderBy: {
      start: "desc",
    },
  });
};

export const getMatch = async (id: string) => {
  console.log("getMatch", id);
  return prisma.matches.findUnique({
    where: {
      id,
    },
  });
};

export const getMatchesByPlayer = async (playerId: string) => {
  return prisma.matches.findMany({
    where: {
      players: {
        has: playerId,
      },
    },
  });
};

export const findMatchesPaginated = async (
  query: any,
  pagination: PaginationConfig
) => {
  return paginatedQuery(prisma.matches, query, pagination);
};
