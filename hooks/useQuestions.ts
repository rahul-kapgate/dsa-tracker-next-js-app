// hooks/useQuestions.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Question = {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  topic: string;
  difficulty: Difficulty;
  createdAt?: string;
};

export type QuestionForm = {
  title: string;
  description: string;
  topic: string;
  difficulty: Difficulty;
};

type QuestionListParams = {
  page: number;
  limit: number;
  search?: string;
  difficulty?: Difficulty;
  topic?: string;
};

type QuestionListResponse = {
  success: boolean;
  data: Question[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (params: QuestionListParams) =>
    [...questionKeys.lists(), params] as const,
};

function cleanParams(params: QuestionListParams) {
  return {
    page: params.page,
    limit: params.limit,
    ...(params.search?.trim() && { search: params.search.trim() }),
    ...(params.difficulty && { difficulty: params.difficulty }),
    ...(params.topic?.trim() && { topic: params.topic.trim() }),
  };
}

export function getApiErrorMessage(error: unknown) {
  const err = error as any;

  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.response?.data?.errors?.fieldErrors) {
    const fieldErrors = err.response.data.errors.fieldErrors;

    const firstError = Object.values(fieldErrors)
      .flat()
      .filter(Boolean)[0];

    if (firstError) return String(firstError);
  }

  if (err?.message) {
    return err.message;
  }

  return "Something went wrong";
}

export const useQuestions = (params: QuestionListParams) => {
  return useQuery({
    queryKey: questionKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<QuestionListResponse>(
        "/api/question",
        {
          params: cleanParams(params),
        },
      );

      return data;
    },

    // keeps old table data while new search result is loading
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: QuestionForm) => {
      const { data } = await apiClient.post("/api/question", payload);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: QuestionForm;
    }) => {
      const { data } = await apiClient.put(`/api/question/${id}`, payload);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/api/question/${id}`);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};