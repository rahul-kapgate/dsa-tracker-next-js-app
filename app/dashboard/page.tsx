"use client";

export default function Dashboard() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#191919] text-white">
        {/* Background Glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6">
          <div className="text-center">
            <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              dashboard
            </h1>
          </div>
        </div>
      </main>
    </>
  );
}
