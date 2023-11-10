import { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "@/util/server";
import { updatePlayer } from "@/prisma/players";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  const data = req.body;
  delete data.id;
  const player = await updatePlayer(id, data);
  console.log(player);
  res.json({
    success: true,
    message: "Player updated",
  });
};

export default withMethods(handler, "PUT");
