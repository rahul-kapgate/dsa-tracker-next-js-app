import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await apiClient.post("/api/auth/login", payload);

      return data;
    },

    onSuccess: (data) => {
      setUser(data.user);
    },
  });
};