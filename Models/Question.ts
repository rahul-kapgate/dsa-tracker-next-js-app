import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  companies?: string[];
  revision?: boolean;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  question_url?: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    companies: [
      {
        type: String,
      },
    ],

    revision: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    question_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);
