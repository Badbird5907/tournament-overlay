import prisma from "@/prisma/index";
import {
  contains,
  paginate,
  paginateAggregate,
  paginatedQuery,
} from "@/prisma/util";
import { PaginationConfig } from "@/types/pagination";
export const getAllPlayers = async () => {
  return prisma.players.findMany();
};
export const getTopPlayers = async (limit: number) => {
  return prisma.players.findMany({
    orderBy: {
      wins: "desc",
    },
    take: limit,
  });
};

export const getPlayer = async (id: string) => {
  return prisma.players.findUnique({
    where: {
      id,
    },
  });
};

export const getPlayersByIds = async (ids: string[]) => {
  return prisma.players.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const findPlayers = async (query: any) => {
  // query could be { name: string, id: string, etc... }
  return prisma.players.findMany({
    where: {
      ...query,
    },
  });
};

export const findPlayersPaginated = async (
  query: any,
  pagination: PaginationConfig
) => {
  return paginatedQuery(prisma.players, query, pagination);
};

export const deletePlayers = async (ids: string[]) => {
  return prisma.players.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const addPlayer = async (
  name: string,
  email: string,
  description: string
) => {
  return prisma.players.create({
    data: {
      name,
      email,
      description,
    },
  });
};
