import { NextApiRequest, NextApiResponse } from "next";
import { getTopPlayers } from "@/prisma/players";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const max = parseInt(req.query.max as string) || 10;
  const data = await getTopPlayers(max);
  res.status(200).json(data);
}
