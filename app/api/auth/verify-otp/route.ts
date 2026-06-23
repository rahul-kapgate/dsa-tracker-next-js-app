import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/configs/dbConfig";
import User from "@/models/User";
import PendingSignup from "@/models/PendingSignup";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required",
        },
        { status: 400 }
      );
    }

    const pendingSignup =
      await PendingSignup.findOne({
        email,
      });

    if (!pendingSignup) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Signup session expired. Please signup again.",
        },
        { status: 404 }
      );
    }

    if (
      pendingSignup.otpExpiresAt <
      new Date()
    ) {
      await PendingSignup.deleteOne({
        _id: pendingSignup._id,
      });

      return NextResponse.json(
        {
          success: false,
          message: "OTP expired",
        },
        { status: 400 }
      );
    }

    if (pendingSignup.otp !== otp) {
      console.log(pendingSignup.otp, otp)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: pendingSignup.name,
      email: pendingSignup.email,
      password: pendingSignup.password,
      isEmailVerified: true,
    });

    await PendingSignup.deleteOne({
      _id: pendingSignup._id,
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}