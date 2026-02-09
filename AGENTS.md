# Agent Instructions for Link Shortener Project

This file serves as the entry point for AI coding assistants (LLMs) working on this project.

## 🎯 Quick Start for AI Assistants

### ⚠️ MANDATORY: Documentation-First Workflow

**BEFORE writing ANY code, you MUST:**

1. ✅ Read the ENTIRE relevant documentation file(s)
2. ✅ Follow ALL rules and patterns specified in those files
3. ✅ Only THEN generate code that adheres to the documented standards

### Priority Guidelines

1. **Always use TypeScript** with strict mode - never use `any`
2. **Prefer Server Components** - only use `'use client'` when necessary
3. **Use Server Actions** for mutations - avoid API routes for internal operations
4. **Write self-documenting code** - clear names, proper types, minimal comments

## API Management & Error Boundary Standards

### Technical Context & Dependencies
The primary data layer for this project is **RTK Query**. Before generating any API slices, hooks, or data-handling logic, you **MUST** refer to `data-fetching.instructions.md`. You are required to strictly follow the RTK Query patterns and the **"HTTP 200 Only"** validation logic defined therein. Do not suggest alternative fetching implementations (e.g., standard `fetch`, `axios`) unless explicitly requested.

### Strict HTTP 200 Policy

The system enforces a strict contract where only an **HTTP 200** status code is treated as a successful state update. In all `baseQuery` or `transformResponse` logic, you must intercept any non-200 status (including 201, 204, or 4xx/5xx). If the status is not 200, the error must be formatted and returned to the RTK Query `error` state to prevent invalid data from entering the cache.

### Error Boundary Strategy
The application utilizes a dual-layer error strategy:
- **Global Boundary:** High-level failures (Network Errors, 500s) should bubble up to the global Error Boundary or be intercepted by middleware for global notifications (Toasts/Modals).
- **Feature Boundary:** For feature-specific components, generate code that monitors the `error` property from RTK Query hooks.
- **Triggering Boundaries:** If an API error is critical to a component's lifecycle, use the following pattern to throw the error to the nearest Error Boundary:
  ```typescript
  if (error) throw error; // Triggers the nearest React Error Boundary

### Tech Stack Quick Reference

```typescript
// Framework
Next.js 16 (App Router) + React 19 + TypeScript 5

// Styling
Tailwind CSS 4 + shadcn/ui (new-york style)

// Database
Neon PostgreSQL + Drizzle ORM

// Authentication
Clerk

// Icons
Lucide React
```

### File Organization

```
app/                  # Next.js App Router
├── actions/         # Server Actions (mutations)
├── api/            # API routes (webhooks, public APIs)
├── [shortCode]/    # Dynamic redirect route
└── dashboard/      # Protected dashboard pages

db/                  # Database
├── schema.ts       # Drizzle schema definitions
├── index.ts        # DB instance
└── queries/        # Query functions

components/          # React components
├── ui/             # shadcn/ui components
└── [feature]/      # Feature-specific components

lib/                # Utilities
└── utils.ts        # Helper functions

docs/               # Agent instructions
```

### Common Patterns

#### Server Component with Data Fetching
```typescript
import db from "@/db";

export default async function Page() {
  const data = await db.query.users.findMany();
  return <div>{/* render */}</div>;
}
```

#### Server Action for Mutation
```typescript
"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createItem(data: FormData) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };
  
  // Mutation logic
  revalidatePath("/dashboard");
  return { success: true };
}
```

#### Client Component with Interaction
```typescript
'use client';
import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

## 🔑 Core Principles

1. **Type Safety** - Leverage TypeScript's type system fully
2. **Server-First** - Default to server components and server actions
3. **User Experience** - Responsive design, loading states, error handling
4. **Security** - Validate all inputs, check authentication, sanitize data
5. **Performance** - Optimize database queries, use proper indexing, lazy load when needed
6. **Consistency** - Follow established patterns throughout the codebase



## 🚀 Getting Started

## � Required Reading by Feature

Before implementing any feature, read the relevant instruction files:

- **Authentication & User Management** → [authentication-rules.instructions.md](.github/instructions/authentication-rules.instructions.md)
- **Data Fetching & RTK Query** → [data-fetching.instructions.md](.github/instructions/data-fetching.instructions.md)
- **Server Actions & Mutations** → [server-actions.instructions.md](.github/instructions/server-actions.instructions.md)
- **UI Components** → [ui-components.instructions.md](.github/instructions/ui-components.instructions.md)

## 🚫 Common Mistakes to Avoid

- ❌ Writing code without reading the relevant `instructions` files first
- ❌ Using custom UI components instead of shadcn/ui (violates ui-components.instructions.md)
- ❌ Implementing custom auth instead of Clerk (violates authentication-rules.instructions.md)
- ❌ Using direct Drizzle queries in server actions (violates server-actions.instructions.md)
- ❌ Skipping Zod validation in server actions (violates server-actions.instructions.md)
- ❌ Creating API routes for mutations instead of server actions (violates server-actions.instructions.md)
- ❌ Ignoring established patterns in the documentation

---

**Note**: This project follows modern Next.js 15+ conventions with App Router, Server Components, and Server Actions as the primary patterns. 
