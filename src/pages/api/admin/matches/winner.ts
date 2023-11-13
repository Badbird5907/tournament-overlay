import { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "@/util/server";
import { getMatch, updateMatch } from "@/prisma/matches";
import { getPlayerById, updatePlayer } from "@/prisma/players";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { matchId, playerId } = req.body;
  const match = await getMatch(matchId);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }
  const player = await getPlayerById(playerId);
  if (
    !match.players.some((p: string) => {
      return p === playerId;
    }) ||
    !player
  ) {
    return res.status(404).json({ message: "Player not found" });
  }
  const oldWinner = match.winner;
  const matchOver = !!match.end;
  if (oldWinner) {
    await updatePlayer(oldWinner, {
      wins: {
        decrement: 1,
      },
      ...(matchOver ? { losses: { increment: 1 } } : {}),
    });
  }
  await updatePlayer(playerId, {
    wins: {
      increment: 1,
    },
    ...(matchOver ? { losses: { decrement: 1 } } : {}),
  });
  await updateMatch(matchId, { winner: playerId });
  res.status(200).json({ message: "Success" });
};
export default withMethods(handler, "POST", "PUT");
