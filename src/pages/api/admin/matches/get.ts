import { NextApiRequest, NextApiResponse } from "next";
import { findPlayers, findPlayersPaginated } from "@/prisma/players";
import { contains, rawAggregateContains, toObjectId } from "@/prisma/util";
import {
  ensureObjectId,
  ensureType,
  getPaginationConfig,
  isObjectId,
} from "@/util/server";
import { findMatchesPaginated } from "@/prisma/matches";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, search, player } = req.query;
  const query: any = {};
  if (id) {
    if (!ensureObjectId(id, res)) return;
    query["_id"] = {
      $oid: id as string,
    };
  }
  if (player) {
    if (!ensureObjectId(player, res)) return;
    query["players"] = {
      $elemMatch: {
        $eq: toObjectId(player as string),
      },
    };
  }
  if (search) {
    if (!ensureType(search, "string", res)) return;
    query["$or"] = [
      {
        map: rawAggregateContains(search as string),
      },
      ...(isObjectId(search) ? [{ _id: toObjectId(search as string) }] : []),
      {
        description: rawAggregateContains(search as string),
      },
      {
        notes: rawAggregateContains(search as string),
      },
      ...(isObjectId(search)
        ? [
            {
              winner: toObjectId(search as string),
            },
            {
              players: {
                $elemMatch: {
                  $eq: toObjectId(search as string),
                },
              },
            },
          ]
        : []),
    ];
  }
  const players = await findMatchesPaginated(query, getPaginationConfig(req));
  res.status(200).json({
    success: true,
    ...players,
  });
}
