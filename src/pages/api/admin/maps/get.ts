import { NextApiRequest, NextApiResponse } from "next";
import { getMaps } from "@/prisma/matches";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const data = await getMaps();
  res.status(200).json((data as any).map((d: { _id: string }) => d._id));
}
