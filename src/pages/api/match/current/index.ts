import { getSetting } from "@/prisma/settings";
import { NextApiRequest, NextApiResponse } from "next";
import { getMatchStatus } from "@/pages/api/match/[id]/status";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await getSetting("currentMatch");
  if (!data) {
    res.status(404).json({
      message: "Match not found",
    });
    return;
  }
  const d = await getMatchStatus(data);
  if (!d) {
    res.status(404).json({
      message: "Match not found",
    });
    return;
  }
  res.status(d.status).json(d.data);
}
