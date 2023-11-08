import { NextApiRequest, NextApiResponse } from "next";
import { findPlayers, findPlayersPaginated } from "@/prisma/players";
import { contains } from "@/prisma/util";
import {ensureObjectId, ensureType, getPaginationConfig, isObjectId} from "@/util/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, id, search } = req.query;
  const query: any = {};
  if (name) {
    if (!ensureType(name, "string", res)) return;
    query["name"] = contains(name as string);
  }
  if (id) {
    if (!ensureObjectId(id, res)) return;
    query["id"] = id;
  }
  if (search) {
    query["OR"] = [];
    if (!ensureType(search, "string", res)) return;
    query["OR"].push({ name: contains(search as string) });
    if (isObjectId(search)) {
      query["OR"].push({ id: search });
    }
  }
  const players = await findPlayersPaginated(query, getPaginationConfig(req));
  res.status(200).json({
    success: true,
    players,
  });
}
