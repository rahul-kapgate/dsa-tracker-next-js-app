import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import slugify from "slugify";

import { connectDB } from "@/configs/dbConfig";
import Question from "@/models/Question";
import { verifyToken } from "@/middleware/auth";
import {
  createQuestionSchema,
  updateQuestionSchema,
} from "@/lib/validators/question.validation";

//GET Bt ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const user = verifyToken(req);

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Question Id",
        },
        {
          status: 400,
        },
      );
    }

    const question = await Question.findOne({
      _id: id,
      createdBy: user.userId,
      isDeleted: false,
    });

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: question,
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

//PUT BY id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const user = verifyToken(req);

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Question Id",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    const parsed = updateQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    let slug: string | undefined;

    if (parsed.data.title) {
      slug = slugify(parsed.data.title, {
        lower: true,
        strict: true,
      });

      const duplicate = await Question.findOne({
        slug,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "Question title already exists",
          },
          { status: 409 },
        );
      }
    }

    const updated = await Question.findOneAndUpdate(
      {
        _id: id,
        createdBy: user.userId,
        isDeleted: false,
      },
      {
        ...parsed.data,
        ...(slug && { slug }),
        updatedBy: user.userId,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question updated successfully.",
      data: updated,
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

//soft delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const user = verifyToken(req);

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Question Id",
        },
        {
          status: 400,
        },
      );
    }

    const deleted = await Question.findOneAndUpdate(
      {
        _id: id,
        createdBy: user.userId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        updatedBy: user.userId,
      },
      {
        returnDocument: "after",
      },
    );

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully.",
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
