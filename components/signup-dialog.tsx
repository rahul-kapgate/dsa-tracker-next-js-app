"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignupDialog({
  open,
  onOpenChange,
}: SignupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-[#202020] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Create Account
          </DialogTitle>

          <DialogDescription>
            Start tracking your DSA progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Input
            placeholder="Name"
            className="border-zinc-700"
          />

          <Input
            type="email"
            placeholder="Email"
            className="border-zinc-700"
          />

          <Input
            type="password"
            placeholder="Password"
            className="border-zinc-700"
          />

          <Button className="w-full">
            Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}