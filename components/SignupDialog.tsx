"use client";

import { useEffect, useState } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useSignup } from "@/hooks/auth/useSignup";
import { useVerifyOtp } from "@/hooks/auth/useVerifyOtp";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OTP_LENGTH = 6;

export default function SignupDialog({
  open,
  onOpenChange,
}: SignupDialogProps) {
  const [step, setStep] = useState<"signup" | "otp">("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const signupMutation = useSignup();
  const verifyOtpMutation = useVerifyOtp();

  const loading = signupMutation.isPending || verifyOtpMutation.isPending;

  useEffect(() => {
    if (!open) {
      setStep("signup");
      setName("");
      setEmail("");
      setPassword("");
      setOtp("");
      setError("");
    }
  }, [open]);

  const resetAll = () => {
    setStep("signup");
    setName("");
    setEmail("");
    setPassword("");
    setOtp("");
    setError("");
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) resetAll();
    onOpenChange(nextOpen);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    signupMutation.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          setStep("otp");
          setOtp("");
        },

        onError: (error: any) => {
          setError(error?.response?.data?.message || "Signup failed");
        },
      },
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    verifyOtpMutation.mutate(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          handleClose(false);
        },

        onError: (error: any) => {
          setError(error?.response?.data?.message || "OTP verification failed");
        },
      },
    );
  };

  const isSignupDisabled =
    loading ||
    !name.trim() ||
    !email.trim() ||
    !password.trim() ||
    password.length < 6;

  const isOtpDisabled = loading || otp.length !== OTP_LENGTH;

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

            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {step === "signup" ? "Create Account" : "Verify Email"}
            </DialogTitle>

            <DialogDescription className="text-zinc-400">
              {step === "signup"
                ? "Start tracking your DSA progress in a clean, organized way."
                : `We sent a 6-digit code to ${email}. Enter it below to finish setup.`}
            </DialogDescription>
          </DialogHeader>

          {step === "signup" ? (
            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-zinc-700 bg-[#171717] text-white placeholder:text-zinc-500 focus-visible:ring-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border-zinc-700 bg-[#171717] text-white placeholder:text-zinc-500 focus-visible:ring-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-zinc-700 bg-[#171717] text-white placeholder:text-zinc-500 focus-visible:ring-white/10"
                />
                <p className="text-xs text-zinc-500">
                  Use at least 6 characters for a valid password.
                </p>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isSignupDisabled}
                className="h-11 w-full bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
              <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full border border-zinc-700 bg-zinc-900 p-2">
                    <Mail className="h-4 w-4 text-zinc-300" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Check your inbox
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Enter the code sent to{" "}
                      <span className="text-white">{email}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">OTP Code</Label>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={(value: string) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <p className="text-center text-xs text-zinc-500">
                  The code expires in 10 minutes.
                </p>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isOtpDisabled}
                className="h-11 w-full bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Verify & Create Account
                  </span>
                )}
              </Button>

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep("signup");
                    setOtp("");
                    setError("");
                  }}
                  className="h-10 px-0 text-zinc-400 hover:bg-transparent hover:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </span>
                </Button>

                <p className="text-xs text-zinc-500">
                  Didn&apos;t get the OTP? Use resend later if you add a resend
                  API.
                </p>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
