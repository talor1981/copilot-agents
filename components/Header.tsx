'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/" className="text-xl font-semibold">
            LinkShortener
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <SignedOut>
            {/* Opens sign-in modal */}
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            
            {/* Opens sign-up modal */}
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            {/* User button with sign-out option */}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
