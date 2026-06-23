import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export const useLogout = () => {
  const router = useRouter();

  const clearUser = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/api/auth/logout");

      return data;
    },

    onSuccess: () => {
      clearUser();

      router.replace("/");
    },
  });
};
