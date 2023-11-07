import { NextApiRequest, NextApiResponse } from "next";
import { getMatch } from "@/prisma/matches";
import { getPlayersByIds } from "@/prisma/players";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const d = await getMatchStatus(id);
  res.status(d.status).json(d.data);
}

export const getMatchStatus = async (id: string) => {
  const data = await getMatch(id);
  if (!data) {
    return {
      data: {
        message: "Match not found",
      },
      status: 404,
    };
  }
  const players = data.players;
  let newPlayers = await getPlayersByIds(players);
  // sort by wins desc
  newPlayers = newPlayers.sort((a, b) => b.wins - a.wins);
  return {
    data: {
      data,
      players: newPlayers,
    },
    status: 200,
  };
};
