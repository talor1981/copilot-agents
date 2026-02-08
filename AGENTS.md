# Agent Instructions for Link Shortener Project

This file serves as the entry point for AI coding assistants (LLMs) working on this project.

## ⚠️ CRITICAL: READ DOCUMENTATION BEFORE CODING

**🚨 YOU MUST READ THE RELEVANT `/docs` FILE(S) BEFORE GENERATING ANY CODE 🚨**

All agent instructions are located in the `/docs` directory and organized by topic.
**NEVER generate code without first reading the appropriate documentation file:**

- **[docs/authentication-rules.md](./docs/authentication-rules.md)** - 🔒 **CRITICAL** - Clerk authentication rules (READ FIRST for auth work)
- **[docs/ui-components.md](./docs/ui-components.md)** - 🎨 **CRITICAL** - shadcn/ui component usage (READ FIRST for UI work)


## 🎯 Quick Start for AI Assistants

### ⚠️ MANDATORY: Documentation-First Workflow

**BEFORE writing ANY code, you MUST:**
1. ✅ Identify which `/docs` file(s) are relevant to your task
2. ✅ Read the ENTIRE relevant documentation file(s)
3. ✅ Follow ALL rules and patterns specified in those files
4. ✅ Only THEN generate code that adheres to the documented standards

### Priority Guidelines

1. **🔒 AUTHENTICATION: Use ONLY Clerk** - Read [docs/authentication-rules.md](./docs/authentication-rules.md) FIRST
2. **🎨 UI COMPONENTS: Use ONLY shadcn/ui** - Read [docs/ui-components.md](./docs/ui-components.md) FIRST
3. **Always use TypeScript** with strict mode - never use `any`
4. **Prefer Server Components** - only use `'use client'` when necessary
5. **Use Server Actions** for mutations - avoid API routes for internal operations
6. **Write self-documenting code** - clear names, proper types, minimal comments

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

**⚠️ CRITICAL WORKFLOW:**

For a comprehensive understanding of this project and its coding standards:

1. **ALWAYS** read [docs/README.md](./docs/README.md) for the complete guide
2. **BEFORE coding**, reference the specific `/docs` file for your task:
   - Working with auth? → Read [docs/authentication-rules.md](./docs/authentication-rules.md)
   - Building UI? → Read [docs/ui-components.md](./docs/ui-components.md)
   - Adding more features? → Check for relevant docs
3. Follow ALL patterns and examples provided in the documentation
4. Maintain consistency with existing code
5. **NEVER** assume or guess - if unsure, check the docs first

---

## 🚫 Common Mistakes to Avoid

- ❌ Writing code without reading the relevant `/docs` files first
- ❌ Using custom UI components instead of shadcn/ui (violates [docs/ui-components.md](./docs/ui-components.md))
- ❌ Implementing custom auth instead of Clerk (violates [docs/authentication-rules.md](./docs/authentication-rules.md))
- ❌ Ignoring established patterns in the documentation

---

**Note**: This project follows modern Next.js 15+ conventions with App Router, Server Components, and Server Actions as the primary patterns. **You MUST check the detailed documentation in `/docs` BEFORE implementing anything.** The documentation files contain critical rules that must be followed.
