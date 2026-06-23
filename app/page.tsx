"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignupDialog from "@/components/signup-dialog";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#191919] text-white">
        {/* Background Glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400">
              🚀 DSA Tracker
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Never lose track of a
              <span className="block bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                coding problem again.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Save DSA questions, track your progress, add notes, and build a
              consistent interview preparation routine.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button className=" p-4 text-lg" onClick={() => setOpen(true)}>
                Start Tracking
              </Button>

              <Button className=" p-4 text-lg">Explore</Button>
            </div>
          </div>
        </div>
      </main>

      <SignupDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
