import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

import { connectDB } from "@/configs/dbConfig";
import Question from "@/models/Question";
import { verifyToken } from "@/middleware/auth";
import { createQuestionSchema } from "@/lib/validators/question.validation";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = verifyToken(req);

    const body = await req.json();

    const parsed = createQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const slug = slugify(data.title, {
      lower: true,
      strict: true,
    });

    const existing = await Question.findOne({
      slug,
      createdBy: user.userId,
      isDeleted: false,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Question already exists",
        },
        { status: 409 },
      );
    }

    const question = await Question.create({
      ...data,
      slug,
      createdBy: user.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Question created successfully.",
        data: question,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = verifyToken(req);

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const search = searchParams.get("search");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");

    const query: any = {
      createdBy: user.userId,
      isDeleted: false,
    };

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (topic) {
      query.topic = topic;
    }

    const total = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: questions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
