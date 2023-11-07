import prisma from "@/prisma/index";
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
