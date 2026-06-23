import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50),

  email: z
    .string()
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(100),
});