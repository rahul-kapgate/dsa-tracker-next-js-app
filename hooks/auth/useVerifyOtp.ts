import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (payload: {
      email: string;
      otp: string;
    }) => {
      const { data } = await apiClient.post(
        "/api/auth/verify-otp",
        payload
      );

      return data;
    },
  });
};