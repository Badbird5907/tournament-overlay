import { NextApiRequest, NextApiResponse } from "next";
import { getSetting } from "@/prisma/settings";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const data = await getSetting(id as string);
  res.status(200).json({
    success: true,
    data,
  });
}
