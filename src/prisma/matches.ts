import {PaginationConfig} from "@/types/pagination";
import {fixJson, paginatedQuery} from "@/prisma/util";
import prisma from "@/prisma";
import {getPlayersByIds} from "@/prisma/players";

export const getAllMatches = async () => {
  return prisma.matches.findMany({
    orderBy: {
      start: "desc",
    },
  });
};

export const getMatch = async (id: string) => {
  if (!id) return undefined;
  return prisma.matches.findUnique({
    where: {
      id,
    },
  });
};

export const getAverageTopPlayers = async (limit: number) => {
  const d = fixJson(
    await prisma.matches.aggregateRaw({
      pipeline: [
        {
          $unwind: "$endResult",
        },
        {
          $group: {
            _id: "$endResult.id",
            averagePoints: {
              $avg: "$endResult.pointsGained",
            },
          },
        },
        {
          $sort: {
            averagePoints: -1,
          },
        },
        {
          $limit: 10,
        },
      ],
    })
  );
  const ids = d.map((d: any) => d.id);
  const players = await getPlayersByIds(ids);
  // add a field player to the data
  return d.map((d: any) => {
    const player = players.find((p) => p.id === d.id);
    return {
      ...d,
      ...player,
    };
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

export const createMatch = async (
  map: string,
  description: string,
  players: string[]
) => {
  return prisma.matches.create({
    data: {
      map,
      description,
      players,
    },
  });
};

export const findMatchesPaginated = async (
  query: any,
  pagination: PaginationConfig
) => {
  return paginatedQuery(prisma.matches, query, pagination, {
    $sort: {
      start: -1,
    },
  });
};

export const getMaps = async () => {
  return prisma.matches.aggregateRaw({
    pipeline: [
      {
        $group: {
          _id: "$map",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ],
  });
};

export const updateMatch = async (id: string, data: any) => {
  return prisma.matches.update({
    where: {
      id,
    },
    data,
  });
};
