# Data Layer - Database Helper Functions

This directory contains database helper functions that wrap Drizzle ORM queries.

## Purpose

Server Actions should NOT directly use Drizzle queries. Instead, they call helper functions from this directory. This provides:

- **Separation of Concerns:** Database logic is isolated from action logic
- **Reusability:** Helper functions can be used across multiple server actions
- **Testability:** Database operations can be mocked and tested independently
- **Type Safety:** Centralized type definitions for database operations

## File Organization

```
data/
├── README.md          # This file
├── users.ts           # User-related database operations
├── links.ts           # Link shortener database operations
└── analytics.ts       # Analytics database operations
```

## Example Helper Function

```typescript
// filepath: data/links.ts
import db from "@/db";
import { links } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createLink(data: {
  shortCode: string;
  originalUrl: string;
  userId: string;
}) {
  const [link] = await db
    .insert(links)
    .values(data)
    .returning();
  
  return link;
}

export async function getLinksByUserId(userId: string) {
  return db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (links, { desc }) => [desc(links.createdAt)],
  });
}

export async function getLinkByShortCode(shortCode: string) {
  return db.query.links.findFirst({
    where: eq(links.shortCode, shortCode),
  });
}

export async function deleteLink(linkId: string, userId: string) {
  await db
    .delete(links)
    .where(
      and(
        eq(links.id, linkId),
        eq(links.userId, userId)
      )
    );
}
```

## Usage in Server Actions

```typescript
// filepath: app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { createLink } from "@/data/links";
import { z } from "zod";

const createLinkSchema = z.object({
  shortCode: z.string().min(3),
  originalUrl: z.string().url(),
});

export async function createLinkAction(input: z.infer<typeof createLinkSchema>) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const validation = createLinkSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    // Call database helper function
    const link = await createLink({
      ...validation.data,
      userId,
    });

    return { success: true, data: link };
  } catch (error) {
    console.error("Error creating link:", error);
    return { success: false, error: "Failed to create link" };
  }
}
```

## Guidelines

1. **One file per resource:** Group related database operations by resource (users, links, etc.)
2. **Typed inputs/outputs:** Use TypeScript interfaces for function parameters and return types
3. **Error handling:** Let errors bubble up to be caught by server actions
4. **No business logic:** Keep these functions focused on database operations only
5. **Export functions:** Export all helper functions for use in server actions
