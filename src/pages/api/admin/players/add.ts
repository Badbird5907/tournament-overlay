import { NextApiRequest, NextApiResponse } from "next";
import { addPlayer } from "@/prisma/players";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, description } = req.body;
  if (!name || !email) {
    res.status(400).json({
      success: false,
      message: "Missing name, email, or description",
    });
    return;
  }
  await addPlayer(name, email, description);
  res.status(200).json({
    success: true,
  });
}
