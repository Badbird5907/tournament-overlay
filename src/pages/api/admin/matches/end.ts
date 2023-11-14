import { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "@/util/server";
import { getMatch, updateMatch } from "@/prisma/matches";
import { giveLossExcept } from "@/prisma/players";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  const match = await getMatch(id);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }
  if (match.end) {
    return res.status(400).json({ message: "Match already ended" });
  }
  await updateMatch(id, { end: new Date() });
  // give everyone a loss except for the winner
  const { players } = match;
  await giveLossExcept(players, match.winner);
  res.status(200).json({ message: "Success" });
};
export default withMethods(handler, "POST");
