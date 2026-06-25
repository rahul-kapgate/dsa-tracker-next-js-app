"use client";

import { useEffect } from "react";
import { useMe } from "@/hooks/auth/useMe";
import { useAuthStore } from "@/store/auth-store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isSuccess, isError, isLoading } = useMe();

  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }

    if (isError) {
      logout();
    }
  }, [data, isSuccess, isError, setUser, logout]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}