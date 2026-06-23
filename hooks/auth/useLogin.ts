import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
    }) => {
      const { data } = await apiClient.post(
        "/api/auth/login",
        payload
      );

      return data;
    },
  });
};