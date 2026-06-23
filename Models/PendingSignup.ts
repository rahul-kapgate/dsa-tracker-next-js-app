import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPendingSignup extends Document {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpiresAt: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const PendingSignupSchema = new Schema<IPendingSignup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const PendingSignup: Model<IPendingSignup> =
  mongoose.models.PendingSignup ||
  mongoose.model<IPendingSignup>("PendingSignup", PendingSignupSchema);

export default PendingSignup;
