# React Double-Check & Self Review Instructions
For VS Code + Copilot

## Purpose

After generating or modifying any React code, you MUST perform a structured self-review before considering the task complete.

This review must follow:

1. React.js best practices
2. Project conventions
3. The rules defined in: `ui-components.instructions.md`

You are not allowed to skip this review phase.

---

# Mandatory Self-Review Process

After writing new code:

1. Re-read the entire file.
2. Cross-check with `ui-components.instructions.md`.
3. Validate against the checklist below.
4. If any issue is found — FIX IT immediately.
5. Only return the final improved version.

Do not explain the checklist unless explicitly asked.
Return the corrected production-ready code.

---

# 1. Architecture & Component Design

- Is the component:
  - Small and focused?
  - Single responsibility?
  - Reusable?
- Is business logic separated from UI logic?
- Are large components split into subcomponents?
- Are hooks extracted when logic is reusable?

If not aligned → refactor.

---

# 2. React Best Practices

## Hooks
- Are hooks called only at top level?
- Are dependencies correctly defined in `useEffect`, `useMemo`, `useCallback`?
- Are unnecessary re-renders avoided?
- Is derived state avoided when not needed?

## State Management
- Is state minimal?
- Is state colocated properly?
- Is unnecessary duplication avoided?

## Props
- Are props typed properly (TypeScript)?
- Are props destructured?
- Are default values handled safely?

---

# 3. Performance

- Any unnecessary re-renders?
- Missing `React.memo` where appropriate?
- Expensive calculations wrapped in `useMemo`?
- Stable callback references when required?
- Large lists using proper keys?
- No index as key (unless static list)?

---

# 4. UI & Component Standards

You MUST validate against:
`ui-components.instructions.md`

Specifically check:

- Naming conventions
- Styling system rules
- Design tokens usage
- Accessibility requirements
- Variant patterns
- Composition rules
- Folder structure
- Export patterns

If anything violates that file — refactor.

---

# 5. Accessibility (A11y)

- Proper semantic HTML?
- aria attributes when needed?
- Labels connected to inputs?
- Buttons not replaced with divs?
- Keyboard accessible?

If accessibility is incomplete → fix.

---

# 6. Type Safety (If TypeScript)

- No `any` unless absolutely necessary
- Proper interface/type definitions
- Avoid type duplication
- Correct generic usage
- Safe optional chaining

---

# 7. Error Handling

- Async code wrapped in try/catch?
- Loading and error states handled?
- No silent failures?

---

# 8. Clean Code Standards

- No dead code
- No console.logs
- No commented unused code
- Clear variable naming
- No magic numbers
- Readable structure

---

# 9. Security

- No dangerouslySetInnerHTML unless required
- Sanitization where needed
- No exposure of sensitive values
- Safe external links (rel="noopener noreferrer")

---

# 10. Final Validation

Before finishing, ask yourself:

- Would a senior React engineer approve this?
- Is this production-ready?
- Does it strictly follow `ui-components.instructions.md`?

If the answer is not 100% YES — improve it.

---

# Output Rules

- Return only the final improved code.
- Do NOT output explanations.
- Do NOT output the checklist.
- Do NOT mention that you performed a review.
- The output must be clean production-ready code.