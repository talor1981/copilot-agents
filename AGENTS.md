# Agent Instructions for Link Shortener Project

This file serves as the entry point for AI coding assistants (LLMs) working on this project.

---

## 🚨 CRITICAL: MANDATORY WORKFLOW REQUIREMENT 🚨

**⚠️ READ THIS FIRST - NON-NEGOTIABLE REQUIREMENT ⚠️**

**YOU MUST ALWAYS FOLLOW THE FOUR-AGENT WORKFLOW DESCRIBED BELOW.**

This is **NOT** a suggestion. This is **NOT** optional. This is a **HARD REQUIREMENT**.

### ❌ FORBIDDEN: Direct Implementation

**DO NOT:**
- Skip the Manager Agent step
- Go directly to code generation
- Bypass the Code Review Agent
- Skip the Validator Agent
- Work as a single agent

### ✅ REQUIRED: Multi-Agent Workflow

**YOU MUST:**
1. **START** as Manager Agent - Analyze requirements and identify instruction files
2. **DELEGATE** to Implementation Agent - Generate code following patterns
3. **VALIDATE** with Code Review Agent - Check against all standards
4. **TEST** with Validator Agent - Run automated checks and tests
5. **DELIVER** as Manager Agent - Present approved and validated code to user

**If you do not follow this workflow, your implementation is INVALID and will be REJECTED.**

---

## 🤖 Multi-Agent Architecture

This project uses a **four-agent workflow** to ensure code quality, instruction compliance, and automated validation:

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

4. **✅ Validator Agent** (`.github/agents/validator.agent.md`)
   - **Role:** Automated Verification
   - **Responsibility:** Runs automated checks, tests, and validations
   - **Tasks:** TypeScript compilation, linting, unit tests, build verification

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
[Validator Agent]
     ├─→ Runs TypeScript compilation check
     ├─→ Executes linting (ESLint)
     ├─→ Runs unit tests (if applicable)
     ├─→ Verifies build succeeds
     └─→ Provides validation report (PASS/FAIL)
          ↓
     [If validation fails]
          ↓
     [Implementation Agent fixes]
          ↓
     [Validator Agent re-validates]
          ↓
[Manager Agent]
     └─→ Delivers final validated code to user
```

### Agent Communication Format

To ensure consistency and completeness across agent handoffs, agents should provide structured communication:

#### 📋 Manager Agent → Implementation Agent
- Task description with context
- List of relevant instruction files to read
- Required patterns to follow
- Expected deliverables

#### 🔨 Implementation Agent → Review Agent
- Summary of what was implemented
- Instruction files followed
- Files created/modified
- Patterns applied
- Self-assessment and concerns

#### 🔍 Review Agent → Manager Agent
- Verdict: APPROVE / APPROVE_WITH_MINOR_CHANGES / REQUEST_CHANGES / REJECT
- Instruction compliance assessment
- Critical issues (if any)
- Recommendations (must-fix vs nice-to-have)
- Next steps

#### ✅ Validator Agent → Manager Agent
- Validation verdict: PASS / FAIL
- TypeScript compilation status
- ESLint results
- Build verification status
- Test results (if applicable)
- Detailed error report (if failed)

---

## 🔄 Iteration Limits & Escalation Protocol

### ⚠️ CRITICAL: Preventing Infinite Review Loops

To prevent circular dependencies and infinite review cycles, the following iteration limits are **MANDATORY**:

### Maximum Review Cycles
**🚨 HARD LIMIT: 3 REVIEW ATTEMPTS 🚨**

Each implementation may go through **a maximum of 3 review cycles**. After the 3rd rejection, the Manager Agent **MUST** escalate.

---

### Review Cycle Protocol

#### 🔵 1st Review Rejection
**Action Required by Implementation Agent:**
- ✅ Read the Code Review Agent's feedback in detail
- ✅ Identify **specific** violated patterns or rules
- ✅ Re-read the relevant instruction files focusing on the violated sections
- ✅ Fix **only** the identified issues
- ✅ Submit revised implementation to Review Agent

**Manager Agent Monitoring:**
- Track that Implementation Agent addresses specific feedback
- Verify instruction files were re-consulted

---

#### 🟡 2nd Review Rejection
**⚠️ WARNING: Escalation Risk - Final Attempt**

**Action Required by Implementation Agent:**
- ✅ **STOP and re-read ALL relevant instruction files from scratch**
- ✅ Compare implementation line-by-line against documented patterns
- ✅ Create a compliance checklist mapping each requirement to code
- ✅ Address **all** feedback from both review cycles
- ✅ Submit revised implementation with detailed compliance report

**Manager Agent Monitoring:**
- Review the compliance checklist before submission
- Verify all previous feedback has been addressed
- Prepare escalation plan if 3rd rejection occurs

**Documentation Required:**
```markdown
## 2nd Revision Compliance Report
### Instruction Files Re-Read:
- [ ] File 1
- [ ] File 2

### Issues from 1st Review:
- Issue 1: [How it was fixed]
- Issue 2: [How it was fixed]

### Issues from 2nd Review:
- Issue 1: [How it was fixed]
- Issue 2: [How it was fixed]

### Pattern Compliance Verification:
- [ ] Pattern 1: [Code reference]
- [ ] Pattern 2: [Code reference]
```

---

#### 🔴 3rd Review Rejection - ESCALATION REQUIRED

**🚨 AUTOMATIC ESCALATION TRIGGERED 🚨**

**Manager Agent MUST:**

1. **⛔ STOP the Implementation Agent immediately**
2. **📋 Generate Escalation Report:**
   ```markdown
   ## ⚠️ ESCALATION REPORT ⚠️
   
   **Task:** [Brief description]
   **Review Cycles:** 3 (LIMIT REACHED)
   
   ### Root Cause Analysis:
   - What pattern/rule is being consistently violated?
   - Why is the Implementation Agent unable to comply?
   - Is there ambiguity in the instruction files?
   - Is there a conflict between instruction files?
   
   ### Attempted Fixes:
   1st Attempt: [What was tried]
   2nd Attempt: [What was tried]
   3rd Attempt: [What was tried]
   
   ### Recommendation:
   [ ] Pattern needs clarification in instruction files
   [ ] Implementation approach fundamentally incompatible
   [ ] Instruction files have conflicting requirements
   [ ] Human developer intervention required
   [ ] Other: [Specify]
   ```

3. **👤 Present to User:**
   - Acknowledge the iteration limit has been reached
   - Present the escalation report
   - Request human developer guidance or clarification
   - **DO NOT** attempt a 4th implementation without user approval

---

### Iteration Tracking

**Manager Agent MUST maintain visible iteration count:**

```markdown
📊 **Review Cycle Status:** [1/3] | [2/3] | [3/3 - ESCALATION]
```

Display this status at the beginning of each review cycle response.

---

### Emergency Override

**Only the user can authorize a 4th attempt** by explicitly stating:
> "Override iteration limit and attempt implementation again"

**If override is granted:**
- Reset counter to [1/3]
- Manager Agent must identify new approach or clarification
- Document what changed to justify the override

---

### Success Criteria

**To avoid escalation:**
- ✅ Implementation Agent reads ALL feedback carefully
- ✅ Specific instruction file sections are quoted in fixes
- ✅ Each fix directly addresses review feedback
- ✅ Manager Agent validates before re-submission

**Remember:** The goal is quality, not speed. Take time to understand the patterns rather than rushing to "fix" quickly.

---

## 🔄 Partial Approval Flow & Review Verdicts

The Code Review Agent must provide **granular feedback** to optimize the review-iteration cycle. Not all issues are blocking, and partial approvals enable faster delivery while maintaining quality standards.

### 📊 Review Verdict Taxonomy

#### ✅ **APPROVE**
**When to Use:**
- Zero violations of instruction files
- All patterns correctly implemented
- No security, performance, or type safety issues
- Code is production-ready as-is

**What Happens Next:**
- Manager Agent delivers code immediately to user
- No iteration required
- **Iteration Count:** 0

---

#### ⚠️ **APPROVE_WITH_MINOR_CHANGES**
**When to Use:**
- Core implementation is sound and follows instruction files
- Non-blocking suggestions for improvement (readability, optimization, future-proofing)
- Issues that don't violate hard requirements
- Code can ship in current state, but could be better

**What Happens Next:**
- Manager Agent delivers code to user **immediately**
- Suggestions documented in delivery summary under "Optional Improvements"
- User decides whether to address suggestions now or later
- **Iteration Count:** 0 (ships as-is)

**Example Scenarios:**
- ✅ Uses RTK Query correctly, ⚠️ but could add optimistic updates
- ✅ Server Action has Zod validation, ⚠️ but error messages could be more specific
- ✅ TypeScript types are correct, ⚠️ but could use a branded type for better clarity
- ✅ Component structure is sound, ⚠️ but could extract a custom hook for reusability

---

#### 🔄 **REQUEST_CHANGES**
**When to Use:**
- Violations of instruction file requirements (but not fundamental architecture)
- Missing required patterns (Zod validation, auth checks, error handling)
- Type safety issues (`any` types, missing null checks)
- Security vulnerabilities that must be fixed
- Performance issues that will cause problems in production

**What Happens Next:**
- Implementation Agent receives specific fix instructions
- Implementation Agent makes **targeted corrections**
- Review Agent re-validates **only the changed portions**
- **Iteration Count:** 1-2 (fixes required before shipping)

---

#### ❌ **REJECT**
**When to Use:**
- Fundamental architecture violations
- Wrong technology stack (custom auth instead of Clerk, axios instead of RTK Query)
- Complete disregard for instruction files
- Implementation requires full rewrite, not fixes

**What Happens Next:**
- Manager Agent halts delivery
- Implementation Agent **restarts from scratch**
- Must re-read instruction files before new attempt
- **Iteration Count:** Reset to 0, full reimplementation

---

### 🎯 Decision Matrix

```
Does it violate instruction files?
    ↓ NO
    Are there any suggestions for improvement?
        ↓ NO → ✅ APPROVE
        ↓ YES
        Would code break or degrade significantly without fixes?
            ↓ NO → ⚠️ APPROVE_WITH_MINOR_CHANGES
            ↓ YES → 🔄 REQUEST_CHANGES
    ↓ YES (violates instruction files)
    Is the core architecture wrong?
        ↓ YES → ❌ REJECT
        ↓ NO
        Can it be fixed with targeted changes?
            ↓ YES → 🔄 REQUEST_CHANGES
            ↓ NO → ❌ REJECT
```

---

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

## 📊 Instruction File Priority Hierarchy

### ⚠️ When to Apply This Hierarchy

Use this hierarchy to resolve conflicts when **multiple instruction files provide different or contradicting guidance** for the same implementation.

**🚨 IMPORTANT:** This hierarchy does NOT override explicit requirements. If an instruction file has a **hard requirement** (marked with ❌/✅ or "MUST"), that requirement always applies regardless of hierarchy level.

---

### 🔢 Priority Levels (Highest to Lowest)

#### **Level 1: Security & Authentication** 🔒
**File:** `authentication-rules.instructions.md`

**Why Highest Priority:** Security vulnerabilities can compromise the entire application

**When This Takes Precedence:**
- Security always trumps convenience, performance, or aesthetics
- Authentication requirements override UI/UX preferences

---

#### **Level 2: Data Layer & API Management** 🔄
**File:** `data-fetching.instructions.md`

**Why Second Priority:** Data integrity issues cascade throughout the application

**When This Takes Precedence:**
- Data validation rules override UI component preferences
- API error handling patterns supersede generic error UI

---

#### **Level 3: Business Logic & Server Operations** ⚙️
**File:** `server-actions.instructions.md`

**Why Third Priority:** Business logic correctness ensures application functionality

**When This Takes Precedence:**
- Mutation patterns override UI form implementations
- Server-side validation supersedes client-side convenience

---

#### **Level 4: UI/UX & Component Design** 🎨
**Files:** `ui-components.instructions.md`, `react-double-check.instructions.md`

**Why Fourth Priority:** UI can adapt to higher-level constraints

**When This Takes Precedence:**
- Component patterns guide implementation when no higher-level concerns exist

---

#### **Level 5: Code Organization & Structure** 📁
**File:** `feature-organization.instructions.md`

**Why Lowest Priority:** Organizational patterns are most flexible

**When This Takes Precedence:**
- When creating new features with no conflicting requirements

---

### � Documentation Versioning

All instruction files should follow **semantic versioning** (MAJOR.MINOR.PATCH):

- **MAJOR** (x.0.0): Breaking changes that invalidate previous implementations
- **MINOR** (0.x.0): New features, patterns, or requirements (backward compatible)
- **PATCH** (0.0.x): Clarifications, typo fixes, or minor improvements

**BEFORE implementing ANY feature, you MUST:**
1. ✅ **Check the version** at the top of each instruction file
2. ✅ **Review breaking changes** in the changelog (if version changed)
3. ✅ **Avoid deprecated patterns** even if they still work

---

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
- [x] Validator Agent: Ran automated checks - **PASSED**

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

### Step 4: Validator Agent (REQUIRED)
- ✅ Runs TypeScript compilation check
- ✅ Executes ESLint validation
- ✅ Runs unit tests (if tests exist)
- ✅ Verifies Next.js build succeeds
- ✅ Provides validation report: PASS / FAIL
- ✅ If validation fails, sends back to Implementation Agent with error details

### Step 5: Manager Agent (REQUIRED)
- ✅ Reviews approved and validated code
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

## 🚨 Error Recovery & Failure Modes

**Agents are not infallible. This section defines mandatory procedures for handling failures.**

### Failure Mode Taxonomy

#### 🔴 Type 1: Missing or Inaccessible Documentation

**Scenario:** Implementation Agent or Manager Agent cannot locate required instruction files.

**Required Actions:**
1. **STOP immediately** - Do NOT attempt to guess or infer patterns
2. **Document the missing file** - List the exact file path that was expected
3. **Search for alternatives** - Use grep_search or file_search to locate similar documentation
4. **Escalate to user**

**User Communication Template:**
```markdown
⚠️ **WORKFLOW BLOCKED: Missing Documentation**

**Issue:** Cannot locate required instruction file: `[file_path]`
**Context:** Working on [feature description]
**Action Required:** Please provide the correct path or alternative documentation
```

---

#### 🔴 Type 2: Conflicting Requirements

**Scenario:** Review Agent discovers irreconcilable conflicts between instruction files.

**Required Actions:**
1. **Document both conflicting requirements** - Quote exact text from both sources
2. **Analyze impact** - Explain what breaks if either path is chosen
3. **Propose resolution options** - Present 2-3 alternatives with trade-offs
4. **Request clarification**

---

#### 🔴 Type 3: Ambiguous User Requirements

**Scenario:** Manager Agent receives requirements that are unclear or contradictory.

**Required Actions:**
1. **Identify ambiguities** - List specific unclear points
2. **Propose most likely interpretation** - Based on project patterns
3. **Request clarification** - Use focused questions
4. **Do NOT proceed** - Wait for user confirmation

---

#### 🔴 Type 4: Technical Failures

**Scenario:** Any agent encounters system-level errors.

**Required Actions:**
1. **Retry once** - Attempt the operation a second time
2. **Log the error** - Capture full error message
3. **Attempt workaround** - If applicable
4. **Escalate if unresolved**

---

### Recovery Protocols

**Suspend immediately if:**
- Missing critical documentation
- Conflicting requirements unresolved
- User requirements ambiguous
- Repeated technical failures

---

## Enforcement Rules
1. **No code delivery without summary** - The task is not complete until the summary is provided
2. **Be specific** - Reference actual file paths and line numbers
3. **Link to docs** - Mention which instruction files guided your implementation
4. **Flag deviations** - If you deviated from documented patterns, explain why

---

**Note**: This project follows modern Next.js 15+ conventions with App Router, Server Components, and Server Actions as the primary patterns.
