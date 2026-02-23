# Agent Instructions for Link Shortener Project

This file serves as the entry point for AI coding assistants (LLMs) working on this project.

---

## 🚨 CRITICAL: MANDATORY WORKFLOW REQUIREMENT 🚨

**⚠️ READ THIS FIRST - NON-NEGOTIABLE REQUIREMENT ⚠️**

**YOU MUST ALWAYS FOLLOW THE THREE-AGENT WORKFLOW DESCRIBED BELOW.**

This is **NOT** a suggestion. This is **NOT** optional. This is a **HARD REQUIREMENT**.

### ❌ FORBIDDEN: Direct Implementation

**DO NOT:**
- Skip the Manager Agent step
- Go directly to code generation
- Bypass the Code Review Agent
- Work as a single agent

### ✅ REQUIRED: Multi-Agent Workflow

**YOU MUST:**
1. **START** as Manager Agent - Analyze requirements and identify instruction files
2. **DELEGATE** to Implementation Agent - Generate code following patterns
3. **VALIDATE** with Code Review Agent - Check against all standards
4. **DELIVER** as Manager Agent - Present approved code to user

**If you do not follow this workflow, your implementation is INVALID and will be REJECTED.**

---

## 🤖 Multi-Agent Architecture

This project uses a **three-agent workflow** to ensure code quality and instruction compliance:

### Agent Roles

1. **📋 Code Manager Agent** (`.github/agents/code-manager.agent.md`)
   - **Role:** Orchestrator
   - **Responsibility:** Coordinates workflow between agents
   - **Tasks:** Requirement analysis, agent delegation, quality assurance

2. **🔨 Component Implementation Agent** (`.github/agents/component-implementer.agent.md`)
   - **Role:** Code Generator
   - **Responsibility:** Creates React components and server logic
   - **Tasks:** TypeScript/React code generation following instruction files

3. **🔍 Code Review Agent** (`.github/agents/code-reviewer.agent.md`)
   - **Role:** Quality Gatekeeper
   - **Responsibility:** Validates code against standards
   - **Tasks:** Pattern validation, React best practices, security review

### Workflow Process

```
User Request
     ↓
[Manager Agent]
     ├─→ Identifies relevant instruction files
     ├─→ Reads documentation
     └─→ Creates implementation plan
          ↓
[Implementation Agent]
     ├─→ Reads instruction files
     ├─→ Generates code following patterns
     └─→ Submits implementation
          ↓
[Code Review Agent]
     ├─→ Validates against instruction files
     ├─→ Checks React best practices
     └─→ Provides verdict (APPROVE/REQUEST CHANGES/REJECT)
          ↓
     [If changes needed]
          ↓
     [Implementation Agent fixes]
          ↓
     [Review Agent re-validates]
          ↓
[Manager Agent]
     └─→ Delivers final validated code to user
```

## 🎯 Quick Start for AI Assistants

### ⚠️ MANDATORY: Documentation-First Workflow

**🚨 NON-NEGOTIABLE REQUIREMENT 🚨**

**BEFORE writing a SINGLE LINE of code, you MUST:**

1. ✅ **READ THE ENTIRE relevant documentation file(s)** - No exceptions, no shortcuts
2. ✅ **FOLLOW ALL rules and patterns** specified in those files - These are requirements, not suggestions
3. ✅ **ONLY THEN generate code** that strictly adheres to the documented standards

**❌ FAILURE TO READ DOCUMENTATION = INVALID CODE**

If you generate code without first reading the relevant instruction files, your implementation will be rejected. This is not a "nice to have" - it is a **hard requirement**.

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

.github/
├── agents/         # Agent instruction files
└── instructions/   # Development instruction files
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

### 🛑 PRE-IMPLEMENTATION CHECKPOINT

**Before you proceed with ANY task, answer these questions:**

1. ✅ Have I identified which instruction files are relevant to this task?
2. ✅ Have I read those instruction files in their ENTIRETY?
3. ✅ Do I understand the patterns and rules I need to follow?
4. ✅ Am I ready to implement code that strictly follows those patterns?

**If you answered "NO" to ANY question, STOP and read the documentation first.**

## 📚 MANDATORY Reading by Feature

**🔴 STOP - READ FIRST - CODE SECOND 🔴**

**You MUST read the relevant instruction files B`.github/instructions/feature-organization.instructions.md`
- **Authentication & User Management** → `.github/instructions/authentication-rules.instructions.md`
- **Data Fetching & RTK Query** → `.github/instructions/data-fetching.instructions.md`
- **Server Actions & Mutations** → `.github/instructions/server-actions.instructions.md`
- **UI Components** → `.github/instructions/ui-components.instructions.md`
- **React Best Practices** → `.github/instructions/react-double-check-instructions.md`
- **UI Components** → [ui-components.instructions.md](.github/instructions/ui-components.instructions.md)
- **React Best Practices** → [react-double-check-instructions.md](.github/instructions/react-double-check-instructions.md)

## 🚫 Common Mistakes to Avoid

### ❌ CRITICAL ERROR #1: Writing code without reading the relevant `instructions` files first
**This is the #1 mistake and will result in code rejection. ALWAYS read documentation FIRST.**

### Other Violations:
- ❌ Using custom UI components instead of shadcn/ui (violates ui-components.instructions.md)
- ❌ Implementing custom auth instead of Clerk (violates authentication-rules.instructions.md)
- ❌ Using direct Drizzle queries in server actions (violates server-actions.instructions.md)
- ❌ Skipping Zod validation in server actions (violates server-actions.instructions.md)
- ❌ Creating API routes for mutations instead of server actions (violates server-actions.instructions.md)
- ❌ Ignoring established patterns in the documentation

## ✅ Task Completion Protocol

**AFTER completing ANY code generation task, you MUST provide:**

### Summary Format:
```markdown
## 📝 Task Summary

### ✅ Documentation Compliance Checklist (REQUIRED)
**I CONFIRM that I have:**
- [x] Read the COMPLETE instruction file(s) BEFORE writing code
- [x] Followed ALL patterns and rules from the documentation
- [x] Not generated any code without consulting the relevant docs

### Agent Workflow Completed
- [x] Manager Agent: Analyzed requirements and identified instruction files
- [x] Implementation Agent: Generated code following documented patterns
- [x] Review Agent: Validated code against instruction files - **APPROVED**

### What Was Implemented
- Brief description of the feature/fix

### Files Mod.github/instructions/data-fetching.instructions.md`
- [x] Read: `.github/instructions/server-actions.instructions.md`

### Patterns Applied
- ✅ Used RTK Query for data fetching
- ✅ Implemented Zod validation
- ✅ Added proper error handling
- ✅ HTTP 200 only policy enforced

### Code Review Results
- ✅ TypeScript strict mode compliant
- ✅ Server components by default
- ✅ Authentication checked
- ✅ Error boundaries configuredtructions.md`

### Patterns Applied
- ✅ Used RTK Query for data fetching
- ✅ Implemented Zod validation
- ✅ Added proper error handling

### Testing Recommendations
- [ ] Test the new feature in development
- [ ] Verify authentication flow
- [ ] Check error boundaries

### Next Steps (if applicable)
## 🎯 Agent Activation

**🚨 MANDATORY WORKFLOW - NO EXCEPTIONS 🚨**

When working on this project, you **MUST** follow this exact sequence:

### Step 1: Manager Agent (REQUIRED)
- ✅ Identifies the task scope and relevant instruction files
- ✅ Reads all relevant documentation
- ✅ Creates implementation plan
- ✅ Delegates to Implementation Agent

### Step 2: Implementation Agent (REQUIRED)
- ✅ Reads instruction files identified by Manager
- ✅ Generates code following documented patterns
- ✅ Submits implementation to Review Agent

### Step 3: Review Agent (REQUIRED)
- ✅ Validates implementation against instruction files
- ✅ Checks React best practices
- ✅ Provides verdict: APPROVE / REQUEST CHANGES / REJECT
- ✅ If changes needed, sends back to Implementation Agent

### Step 4: Manager Agent (REQUIRED)
- ✅ Reviews approved code
- ✅ Delivers final validated code to user

**This ensures every line of code is validated against project standards before delivery.**

---

## ⚠️ ENFORCEMENT

**If you skip ANY step in the workflow:**
- ❌ Your code is considered INVALID
- ❌ The implementation will be REJECTED
- ❌ You MUST restart from Step 1 (Manager Agent)

**NO EXCEPTIONS. NO SHORTCUTS. FOLLOW THE WORKFLOW.**

---

- Consider adding unit tests for X
- May need to update Y when Z is implemented
```

### Enforcement Rules
1. **No code delivery without summary** - The task is not complete until the summary is provided
2. **Be specific** - Reference actual file paths and line numbers
3. **Link to docs** - Mention which instruction files guided your implementation
4. **Flag deviations** - If you deviated from documented patterns, explain why

---

**Note**: This project follows modern Next.js 15+ conventions with App Router, Server Components, and Server Actions as the primary patterns.
