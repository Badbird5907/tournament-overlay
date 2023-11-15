import { NextApiRequest, NextApiResponse } from "next";
import { getTopPlayers } from "@/prisma/players";
import { getAverageTopPlayers } from "@/prisma/matches";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const max = parseInt(req.query.max as string) || 10;
  const sort = (req.query.sort as string) || "avg";
  if (sort === "avg") {
    const data = await getAverageTopPlayers(max);
    res.status(200).json(data);
    return;
  }
  const data = await getTopPlayers(max);
  res.status(200).json(data);
}
