import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function verifyToken(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as {
    userId: string;
  };

  return decoded;
}