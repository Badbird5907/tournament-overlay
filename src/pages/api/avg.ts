import { NextApiRequest, NextApiResponse } from "next";
import { getAverageTopPlayers } from "@/prisma/matches";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const limit = parseInt((req.query.limit || "15") as string);
  res.status(200).json(await getAverageTopPlayers(limit));
}
