import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      const { data } = await apiClient.get("/api/auth/me");

      return data.user;
    },

    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};