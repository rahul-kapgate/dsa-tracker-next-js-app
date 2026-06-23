import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (
      payload: SignupPayload
    ) => {
      const { data } = await apiClient.post(
        "/api/auth/signup",
        payload
      );

      return data;
    },
  });
};