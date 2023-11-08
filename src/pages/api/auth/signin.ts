import {NextApiRequest, NextApiResponse} from "next";
import {verifyToken} from "@/util/auth-server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {token} = req.body;
  const valid = await verifyToken(token);
  if (!valid) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      code: 401
    });
  } else {
    res.setHeader("Set-Cookie", `tAdminToken=${token}; Path=/; HttpOnly`);
    res.status(200).json({
      success: true,
      message: "Authorized",
      code: 200
    });
  }
}