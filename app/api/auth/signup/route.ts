import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/configs/dbConfig";
import User from "@/models/User";
import PendingSignup from "@/models/PendingSignup";

import { generateOtp } from "@/lib/generateOtp";
import { signupSchema } from "@/lib/validators/auth";

import { sendEmail } from "@/emails/send-email";
import { verifyEmailTemplate } from "@/emails/templates/verify-email";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 },
      );
    }

    const otp = generateOtp();

    const hashedPassword = await bcrypt.hash(password, 12);

    await PendingSignup.deleteOne({
      email,
    });

    const pendingSignup = await PendingSignup.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: verifyEmailTemplate(otp),
      });
    } catch (error) {
      await PendingSignup.deleteOne({
        _id: pendingSignup._id,
      });

      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
