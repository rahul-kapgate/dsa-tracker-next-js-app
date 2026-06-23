"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, LogIn, ShieldCheck } from "lucide-react";

import { useLogin } from "@/hooks/auth/useLogin";

import { useRouter } from "next/navigation";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const loginMutation = useLogin();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loading = loginMutation.isPending;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          handleClose(false);

          router.push("/dashboard");
        },

        onError: (error: any) => {
          setError(error?.response?.data?.message || "Login failed");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden border-zinc-800 bg-[#202020] p-0 text-white shadow-2xl shadow-black/60 sm:max-w-md">
        <div className="h-1 w-full bg-gradient-to-r from-white via-zinc-400 to-zinc-700" />

        <div className="p-6 sm:p-7">
          <DialogHeader className="space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              DSA Tracker
            </div>

            <DialogTitle className="text-2xl font-semibold">
              Welcome Back
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="border-zinc-700 bg-[#171717]"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="border-zinc-700 bg-[#171717]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="h-11 w-full bg-white text-black hover:bg-zinc-200"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </span>
              )}
            </Button>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                className="text-sm text-zinc-500 hover:text-white"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
