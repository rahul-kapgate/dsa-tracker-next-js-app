import { z } from "zod";

export const createQuestionSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string().trim().min(1, "Description is required"),

  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  topic: z.string().trim().min(1, "Topic is required"),

  companies: z.array(z.string()).optional(),

  revision: z.boolean().optional(),

  notes: z.string().optional(),

  question_url: z.string().optional(),
});

export const updateQuestionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  topic: z.string().optional(),
  companies: z.array(z.string()).optional(),
  revision: z.boolean().optional(),
  notes: z.string().optional(),
  question_url: z.string().optional(),
});
