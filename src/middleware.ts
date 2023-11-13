import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/util/auth-server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  let token = request.cookies.get("tAdminToken")?.value;
  const authorization = request.headers.get("Authorization");
  if (!token && authorization) {
    const [type, value] = authorization.split(" ");
    if (type === "Bearer") {
      token = value as string;
    }
  }
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token || !verifyToken(token)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } else if (request.nextUrl.pathname.startsWith("/api/admin")) {
    if (!token || !verifyToken(token)) {
      // if the token is invalid
      // return 401
      const response = new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
          code: 401,
        }),
        {
          status: 401,
        }
      );
      response.headers.set("Content-Type", "application/json");
      return response;
    }
  }
  return NextResponse.next();
}
