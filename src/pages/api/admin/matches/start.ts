import { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "@/util/server";
import { createMatch } from "@/prisma/matches";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { map, description, players } = req.body;
  const data = await createMatch(map, description, players);
  res.status(200).json({
    success: true,
    ...data,
  });
}

export default withMethods(handler, "POST");
