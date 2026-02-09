---
description: Critical rules for implementing server actions, mutations, and database operations.
---

# Server Actions & Data Mutations

This project uses **Server Actions** for all data mutations. Direct API routes for internal mutations are prohibited.

## Core Principles

### 1. Server Actions for All Mutations
* **Mutations Only:** All data creation, updates, and deletions MUST use Server Actions.
* **No API Routes:** Do not create API routes for internal mutations - use Server Actions instead.
* **Client Invocation:** Server Actions must be called from Client Components (marked with `'use client'`).

### 2. File Organization & Naming
* **File Name:** Server action files MUST be named `actions.ts`
* **Colocation:** Place `actions.ts` in the same directory as the component that calls it
* **Structure Example:**
  ```
  app/
  └── dashboard/
      ├── page.tsx           # Server Component
      ├── DashboardForm.tsx  # Client Component that calls actions
      └── actions.ts         # Server Actions
  ```

### 3. Type Safety & Validation
* **TypeScript Types:** All data passed to server actions MUST have appropriate TypeScript types
* **No FormData Type:** Do NOT use the `FormData` TypeScript type - extract and type data explicitly
* **Zod Validation:** ALL server actions MUST validate input data using Zod schemas
* **Return Types:** Server actions should return typed objects with `{ success: boolean, error?: string, data?: T }`

### 4. Authentication & Authorization
* **Auth Check First:** EVERY server action MUST check for logged-in user before any operations
* **Use Clerk:** Use `auth()` from `@clerk/nextjs/server` to verify authentication
* **Early Return:** Return error immediately if user is not authenticated

### 5. Database Operations
* **No Direct Queries:** Server actions MUST NOT use Drizzle queries directly
* **Helper Functions:** Use helper functions from `/data` directory to interact with database
* **Separation of Concerns:** Keep database logic separate from action logic

### 6. Error Handling
* **No Thrown Errors:** Server actions MUST NOT throw errors - always return an object
* **Return Format:** Always return `{ success: boolean, error?: string, data?: T }`
* **Catch All Errors:** Wrap operations in try/catch and return error objects
* **User-Friendly Messages:** Return clear error messages that can be displayed to users

## Implementation Pattern

### Server Action Template
```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createItem, updateItem } from "@/data/items";

// Define Zod schema for validation
const createItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  url: z.string().url(),
});

type CreateItemInput = z.infer<typeof createItemSchema>;

export async function createItemAction(input: CreateItemInput) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Validate input with Zod
  const validation = createItemSchema.safeParse(input);
  if (!validation.success) {
    return { 
      success: false, 
      error: validation.error.errors[0].message 
    };
  }

  try {
    // 3. Call database helper function
    const item = await createItem({
      ...validation.data,
      userId,
    });

    // 4. Revalidate cache if needed
    revalidatePath("/dashboard");

    // 5. Return success response
    return { success: true, data: item };
  } catch (error) {
    // IMPORTANT: Never throw errors, always return error object
    console.error("Error creating item:", error);
    return { 
      success: false, 
      error: "Failed to create item" 
    };
  }
}
```

### Database Helper Pattern
```typescript
// filepath: data/items.ts
import db from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createItem(data: {
  title: string;
  description?: string;
  url: string;
  userId: string;
}) {
  const [item] = await db
    .insert(items)
    .values(data)
    .returning();
  
  return item;
}

export async function getItemsByUserId(userId: string) {
  return db.query.items.findMany({
    where: eq(items.userId, userId),
  });
}

export async function deleteItem(itemId: string, userId: string) {
  await db
    .delete(items)
    .where(eq(items.id, itemId))
    .where(eq(items.userId, userId));
}
```

### Client Component Usage
```typescript
'use client';

import { useState } from 'react';
import { createItemAction } from './actions';
import { Button } from '@/components/ui/button';

export function ItemForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Extract and type data explicitly
    const input = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
    };

    const result = await createItemAction(input);

    if (result.success) {
      // Handle success
      console.log('Item created:', result.data);
    } else {
      // Handle error
      console.error('Error:', result.error);
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Item'}
      </Button>
    </form>
  );
}
```

## Common Patterns

### Optimistic Updates
```typescript
'use client';

import { useOptimistic } from 'react';
import { deleteItemAction } from './actions';

export function ItemList({ items }: { items: Item[] }) {
  const [optimisticItems, removeOptimisticItem] = useOptimistic(
    items,
    (state, itemId: string) => state.filter(item => item.id !== itemId)
  );

  async function handleDelete(itemId: string) {
    removeOptimisticItem(itemId);
    await deleteItemAction({ itemId });
  }

  return (
    <div>
      {optimisticItems.map(item => (
        <div key={item.id}>
          {item.title}
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Form State Management
```typescript
'use client';

import { useActionState } from 'react';
import { createItemAction } from './actions';

export function ItemFormWithState() {
  const [state, formAction, isPending] = useActionState(
    createItemAction,
    { success: false }
  );

  return (
    <form action={formAction}>
      {/* form fields */}
      {state.error && <p className="text-destructive">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## Checklist for Server Actions

- [ ] File named `actions.ts` and colocated with component
- [ ] `"use server"` directive at the top of file
- [ ] Authentication check using `auth()` from Clerk
- [ ] Input validation using Zod schema
- [ ] Typed input parameters (not `FormData` type)
- [ ] Database operations via helper functions in `/data` directory
- [ ] Return typed object with `success`, `error`, and `data` properties
- [ ] `revalidatePath()` or `revalidateTag()` called when cache needs updating
- [ ] Error handling with try/catch
- [ ] Called from client component with `'use client'`

## Anti-Patterns to Avoid

❌ **DON'T:** Use FormData TypeScript type
```typescript
// Bad
export async function createItem(formData: FormData) { }
```

✅ **DO:** Extract and type data explicitly
```typescript
// Good
type CreateItemInput = { title: string; url: string };
export async function createItem(input: CreateItemInput) { }
```

❌ **DON'T:** Use Drizzle queries directly in server actions
```typescript
// Bad
export async function createItem(input: CreateItemInput) {
  await db.insert(items).values(input);
}
```

✅ **DO:** Use database helper functions
```typescript
// Good
export async function createItem(input: CreateItemInput) {
  await createItemHelper(input);
}
```

❌ **DON'T:** Skip authentication checks
```typescript
// Bad
export async function deleteItem(itemId: string) {
  await deleteItemHelper(itemId);
}
```

✅ **DO:** Always check authentication first
```typescript
// Good
export async function deleteItem(itemId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };
  await deleteItemHelper(itemId, userId);
}
```

❌ **DON'T:** Throw errors from server actions
```typescript
// Bad
export async function createItem(input: CreateItemInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const item = await createItemHelper(input);
  return item;
}
```

✅ **DO:** Return error objects
```typescript
// Good
export async function createItem(input: CreateItemInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };
  
  try {
    const item = await createItemHelper(input);
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: "Failed to create item" };
  }
}
```

## Integration with RTK Query

While RTK Query handles data **fetching** (reads), Server Actions handle data **mutations** (writes). They work together:

* **RTK Query:** GET requests, caching, optimistic updates for UI
* **Server Actions:** POST/PUT/DELETE operations, database mutations
* **Cache Invalidation:** After successful server action, trigger RTK Query refetch or use `revalidatePath()`

```typescript
'use client';

import { useGetItemsQuery } from './api';
import { createItemAction } from './actions';

export function ItemManager() {
  const { data, refetch } = useGetItemsQuery();

  async function handleCreate(input: CreateItemInput) {
    const result = await createItemAction(input);
    if (result.success) {
      // Refetch RTK Query data after mutation
      refetch();
    }
  }

  return (/* UI */);
}
```
