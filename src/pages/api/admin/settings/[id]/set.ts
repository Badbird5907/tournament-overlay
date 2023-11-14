import { NextApiRequest, NextApiResponse } from "next";
import { setSetting } from "@/prisma/settings";
import { withMethods } from "@/util/server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { value } = req.body;
  await setSetting(id as string, value);
  res.status(200).json({
    success: true,
  });
}

export default withMethods(handler, "POST", "PUT");
