"use client";

import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import SignupDialog from "@/components/SignupDialog";
import LoginDialog from "@/components/loginDialog";
import { useState } from "react";
import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [loginOpen, setLoginOpen] = useState(false);

  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <h1 className="text-xl font-bold">DSA Tracker</h1>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button className="text-sm font-medium rounded-full border-2 w-8 h-8 flex items-center justify-center bg-black text-white">
                  {(
                    user?.name?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "U"
                  ).toUpperCase()}
                </button>
                <ThemeToggle />
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setLoginOpen(true)}>
                  Login
                </Button>

                <Button onClick={() => setSignupOpen(true)}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* <SignupDialog open={signupOpen} onOpenChange={setSignupOpen} />
          <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} /> */}
    </>
  );
}
