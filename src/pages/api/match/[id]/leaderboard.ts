import { NextApiRequest, NextApiResponse } from "next";
import { getMatchStatus } from "@/pages/api/match/[id]/status";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const d = await getMatchStatus(id);
  if (!d) {
    res.status(404).json({
      message: "Match not found",
    });
    return;
  }
  res.status(d.status).json(d.data.players);
}
