import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
