import { NextApiRequest, NextApiResponse } from "next";
import { findPlayers, findPlayersPaginated } from "@/prisma/players";
import { contains, rawAggregateContains, toObjectId } from "@/prisma/util";
import {
  ensureObjectId,
  ensureType,
  getPaginationConfig,
  isObjectId,
  withMethods,
} from "@/util/server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, id, search } = req.query;
  const query: any = {};
  if (name) {
    if (!ensureType(name, "string", res)) return;
    query["name"] = contains(name as string);
  }
  if (id) {
    if (!ensureObjectId(id, res)) return;
    query["_id"] = {
      $oid: id as string,
    };
  }
  if (search) {
    if (!ensureType(search, "string", res)) return;
    query["$or"] = [
      {
        name: rawAggregateContains(search as string),
      },
      ...(isObjectId(search) ? [{ _id: toObjectId(search as string) }] : []),
      {
        description: rawAggregateContains(search as string),
      },
      {
        email: rawAggregateContains(search as string),
      },
      ...(!isNaN(parseInt(search as string))
        ? [
            { wins: parseInt(search as string) },
            {
              losses: parseInt(search as string),
            },
          ]
        : []),
    ];
  }
  const players = await findPlayersPaginated(query, getPaginationConfig(req));
  res.status(200).json({
    success: true,
    ...players,
  });
}
export default withMethods(handler, "GET");
