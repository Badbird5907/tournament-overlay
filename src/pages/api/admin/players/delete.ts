import { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "@/util/server";
import { deletePlayers } from "@/prisma/players";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ids } = req.body || req.query;
  if (!Array.isArray(ids)) {
    res.status(400).json({
      success: false,
      message: "Expected an array of ids",
    });
    return;
  }
  await deletePlayers(ids);
  res.status(200).json({
    success: true,
    message: "Successfully deleted players",
  });
}
export default withMethods(handler, "DELETE", "POST");
