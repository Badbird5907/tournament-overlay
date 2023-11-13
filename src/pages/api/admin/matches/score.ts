import { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "@/util/server";
import { getMatch, updateMatch } from "@/prisma/matches";
import { MatchPlayer } from ".prisma/client";
import { getPlayerById, updateScore } from "@/prisma/players";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // this route updates the player's score
  // if the player's score is already set for the match (player & score exists in endResult)
  // that means that there probably was an error and this request should correct that error
  // so, if the player's score is already set, we should subtract the player's score from the original score, and then add the new score
  const { playerId, matchId, score } = req.body;
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
  let playerScore = player.points;
  let endResult: MatchPlayer[] = match.endResult;
  if (endResult) {
    const res = endResult.find((r) => r.id === playerId) as MatchPlayer;
    if (res) {
      // if the player's score is already set for the match
      playerScore -= res.pointsGained;
      // remove res
      endResult.splice(endResult.indexOf(res), 1);
    }
  }
  playerScore += score;
  // update endResult
  if (!endResult) endResult = [];
  endResult.push({ id: playerId, pointsGained: score });
  match.endResult = endResult;
  await updateMatch(matchId, { endResult });
  await updateScore(playerId, playerScore);
  res.status(200).json({ message: "Score updated" });
}
export default withMethods(handler, "POST", "PUT");
