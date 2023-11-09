import { NextApiRequest, NextApiResponse } from "next";
import { getMatchesByPlayer } from "@/prisma/matches";
import { ensureObjectId } from "@/util/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { player } = req.query;
  if (!ensureObjectId(player, res)) return;
  res.status(200).json(await getMatchesByPlayer(player as string));
}
