import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { connectDB } from "@/configs/dbConfig";
import User from "@/models/User";

interface JwtPayload {
  userId: string;
}

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select(
      "_id name email isEmailVerified createdAt",
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Me API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid token",
      },
      { status: 401 },
    );
  }
}
