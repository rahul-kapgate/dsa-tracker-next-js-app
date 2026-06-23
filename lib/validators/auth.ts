import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(50),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .toLowerCase(),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});