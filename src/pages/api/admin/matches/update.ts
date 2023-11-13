import { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "@/util/server";
import { updatePlayer } from "@/prisma/players";
import { updateMatch } from "@/prisma/matches";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  const data = req.body;
  delete data.id;
  await updateMatch(id, data);
  res.json({
    success: true,
    message: "Match updated",
  });
};

export default withMethods(handler, "PUT");
