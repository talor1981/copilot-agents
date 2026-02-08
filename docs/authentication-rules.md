# Authentication Rules

## ⚠️ CRITICAL: Clerk-Only Authentication

**ALL authentication in this application MUST be handled by Clerk.**
- ❌ NO custom auth systems
- ❌ NO other authentication providers
- ❌ NO manual JWT/session handling
- ✅ ONLY use Clerk methods and components

## Protected Routes

### Dashboard Protection

The `/dashboard` route is **PROTECTED** and requires authentication:

```typescript
// app/dashboard/layout.tsx or middleware.ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  
  return <>{children}</>;
}
```

### Homepage Redirect for Authenticated Users

If a user is **logged in** and tries to access the homepage (`/`), redirect them to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  
  // If logged in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }
  
  // Show landing page for unauthenticated users
  return (
    <div>
      {/* Landing page content */}
    </div>
  );
}
```

## Authentication UI - Modal Mode

**CRITICAL**: Sign in and sign out must **ALWAYS launch as modals**, not redirect to separate pages.

### Clerk Configuration

Set up Clerk to use modal mode in your environment variables:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Root Layout Setup

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Using Modal Authentication

```typescript
// components/Header.tsx
'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between py-4">
        <h1>LinkShortener</h1>
        
        <div className="flex items-center gap-4">
          <SignedOut>
            {/* Opens sign-in modal */}
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            
            {/* Opens sign-up modal */}
            <SignUpButton mode="modal">
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
```

### Alternative Modal Approach

```typescript
'use client';

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { openSignIn, openSignUp } = useClerk();
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        onClick={() => openSignIn({ 
          afterSignInUrl: "/dashboard",
          afterSignUpUrl: "/dashboard"
        })}
      >
        Sign In
      </Button>
      
      <Button 
        onClick={() => openSignUp({ 
          afterSignInUrl: "/dashboard",
          afterSignUpUrl: "/dashboard"
        })}
      >
        Sign Up
      </Button>
    </div>
  );
}
```

## Middleware Configuration

Create middleware to handle route protection globally:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:shortCode', // Public short link redirects
]);

export default clerkMiddleware((auth, request) => {
  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

## Server Actions with Auth

Every server action that modifies data MUST check authentication:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";

export async function createLink(url: string) {
  // ALWAYS check auth first
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: "Unauthorized - Please sign in" };
  }
  
  // Proceed with authenticated logic
  // ...
}
```

## API Routes with Auth

```typescript
// app/api/links/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Handle authenticated request
}
```

## User Data Access

Get the current user information:

```typescript
import { currentUser, auth } from "@clerk/nextjs/server";

// Get user ID only (faster)
const { userId } = await auth();

// Get full user object (more data)
const user = await currentUser();
```

## Quick Checklist

Before implementing any auth feature:

- [ ] Using Clerk methods only? ✅
- [ ] No custom auth? ✅
- [ ] Dashboard protected? ✅
- [ ] Homepage redirects logged-in users? ✅
- [ ] Auth UI uses modals? ✅
- [ ] Server actions check auth? ✅
- [ ] Middleware configured? ✅

## Common Mistakes to Avoid

❌ **DON'T** create custom sign-in pages with redirects
```typescript
// WRONG - Don't do this
redirect("/sign-in");
```

✅ **DO** use Clerk modals
```typescript
// CORRECT
<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>
```

❌ **DON'T** forget to check auth in server actions
```typescript
// WRONG - Missing auth check
export async function createLink(url: string) {
  await db.insert(links).values({ url });
}
```

✅ **DO** always check authentication first
```typescript
// CORRECT
export async function createLink(url: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };
  await db.insert(links).values({ userId, url });
}
```

## Environment Variables Required

```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Redirect URLs (leave empty for modal mode)
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=

# After auth success
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Webhook (if using user sync)
CLERK_WEBHOOK_SECRET=whsec_...
```
