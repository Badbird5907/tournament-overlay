import { NextApiRequest, NextApiResponse } from "next";
import { fixJson } from "@/prisma/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const obj = {
    success: true,
    players: [
      {
        search: [
          {
            _id: { $oid: "654a81d2fd2844b78e5077c8" },
            name: "Player 1",
            description: "hi",
            wins: 15,
            losses: 0,
            matchHistory: [{ $oid: "654a823c2c1d7d4892d4cf70" }],
            createdAt: { $date: "2023-07-05T01:28:42.871Z" },
            updatedAt: { $date: "2023-09-26T02:44:09.368Z" },
          },
        ],
        size: [{ count: 11 }],
      },
    ],
  };
  res.status(200).json(fixJson(obj));
}
