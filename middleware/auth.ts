import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function verifyToken(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
  } catch {
    throw new UnauthorizedError("Access token expired or invalid");
  }
}
