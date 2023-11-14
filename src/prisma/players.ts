import prisma from "@/prisma/index";
import { paginatedQuery } from "@/prisma/util";
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
    orderBy: {
      points: "desc",
    },
  });
};

export const getPlayerById = async (id: string) => {
  return prisma.players.findUnique({
    where: {
      id,
    },
  });
};

export const updatePlayer = async (id: string, data: any) => {
  return prisma.players.update({
    where: {
      id,
    },
    data,
  });
};

export const findPlayers = async (query: any) => {
  // query could be { name: string, id: string, etc... }
  return prisma.players.findMany({
    where: {
      ...query,
    },
    orderBy: {
      points: "desc",
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

export const getAllPlayerIds = async (): Promise<string[]> => {
  // return a string array of all player ids: ex: ["1", "2", "3"]
  return prisma.players
    .findMany({
      select: {
        id: true,
      },
    })
    .then((players) => {
      return players.map((player) => player.id);
    });
};

export const updateScore = async (playerId: string, score: number) => {
  await prisma.players.update({
    where: {
      id: playerId,
    },
    data: {
      points: score,
    },
  });
};

export const giveLossExcept = async (
  players: string[],
  except: string | null
) => {
  // give everyone in players a loss except for the player with id except
  const ids = players.filter((p) => p !== except);
  return prisma.players.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      losses: {
        increment: 1,
      },
    },
  });
};
