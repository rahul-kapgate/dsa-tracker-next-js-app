import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(
        "/api/auth/logout"
      );

      return data;
    },
  });
};