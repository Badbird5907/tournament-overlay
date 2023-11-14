import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { PaginationConfig } from "@/types/pagination";

function requireMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  ...method: string[]
) {
  if (!method.includes(req.method || "")) {
    res.status(405).json({
      success: false,
      message: "Method Not Allowed. Accepted methods are: " + method.join(", "),
    });
    return false;
  }
  return true;
}

const withMethods = (
  handler: NextApiHandler,
  ...method: string[]
): NextApiHandler => {
  return async (req, res) => {
    if (!requireMethod(req, res, ...method)) return;
    return handler(req, res);
  };
};
const ensureType = (object: any, type: string, res: NextApiResponse) => {
  if (typeof object !== type) {
    res.status(400).json({
      success: false,
      message: `Expected ${type} but got ${typeof object}`,
    });
    return false;
  }
  return true;
};
const isObjectId = (id: any) => /^[a-f\d]{24}$/i.test(id);
const ensureObjectId = (id: any, res: NextApiResponse) => {
  if (!ensureType(id, "string", res)) return false;
  // ensure this is a valid mongodb objectid
  if (!isObjectId(id)) {
    res.status(400).json({
      success: false,
      message: `Expected a valid ObjectId but got ${id}`,
    });
    return false;
  }
  return true;
};
const getPaginationConfig = (req: NextApiRequest): PaginationConfig => {
  const page = parseInt((req.query.page || "1") as string);
  const limit = parseInt((req.query.limit || "15") as string);
  return {
    page,
    limit,
  };
};
export {
  requireMethod,
  withMethods,
  ensureType,
  ensureObjectId,
  getPaginationConfig,
  isObjectId,
};
