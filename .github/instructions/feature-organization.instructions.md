# Feature Organization Instructions

## 🎯 Purpose

This document defines the **mandatory** feature-based folder structure for organizing components, state management, and styles in this project. This pattern ensures consistency, maintainability, and clear separation of concerns.

---

## 🚨 MANDATORY RULE: Feature-Folder Pattern

**For EVERY new feature you create, you MUST follow this structure:**

```
components/
└── [feature-name]/
    ├── [FeatureName].tsx          # Main feature component
    ├── [FeatureName]Slice.ts      # Redux slice for UI/UX state
    ├── [FeatureName]Api.ts        # RTK Query API for server state
    ├── types.ts                   # TypeScript interfaces and types
    └── [FeatureName].module.css   # Feature-specific styles (optional)
```

### Example: Creating a "UserProfile" Feature

```
components/
└── user-profile/
    ├── UserProfile.tsx           # Main component
    ├── userProfileSlice.ts       # UI state (modals, form state, etc.)
    ├── userProfileApi.ts         # Server data fetching/mutations
    ├── types.ts                  # API contracts and data models
    └── UserProfile.module.css    # Styles (if needed)
```

---

## 📋 File Responsibilities

### 1. **[FeatureName].tsx** - Main Component File

**Purpose:** Contains the React component(s) for the feature

**Rules:**
- ✅ Use TypeScript with strict typing
- ✅ Prefer Server Components by default
- ✅ Only add `'use client'` if client-side interactivity is required
- ✅ Import from co-located files (slice, API, styles)
- ❌ Do NOT put business logic here - use hooks or server actions

**Example:**
```typescript
'use client';

import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { selectIsModalOpen, toggleModal } from './userProfileSlice';
import { useGetUserProfileQuery } from './userProfileApi';
import styles from './UserProfile.module.css';

export function UserProfile() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const { data, error, isLoading } = useGetUserProfileQuery();

  if (error) throw error; // Trigger Error Boundary
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>{data?.name}</h1>
      <button onClick={() => dispatch(toggleModal())}>
        Edit Profile
      </button>
    </div>
  );
}
```

---

### 2. **types.ts** - TypeScript Interfaces and Types

**Purpose:** Contains all TypeScript type definitions, interfaces, and models for the feature

**Use Cases:**
- ✅ API request/response contracts (e.g., from Swagger/OpenAPI)
- ✅ Data models (e.g., `Person`, `Employee`, `Link`, `User`)
- ✅ Form validation schemas
- ✅ Component prop types (if complex)
- ✅ Enums and constants with types
- ❌ Do NOT duplicate types that exist in global types

**Rules:**
- ✅ Keep all types in one file per feature for easy import
- ✅ Use clear, descriptive names (e.g., `UserProfile`, not `Profile`)
- ✅ Export all types for use in component, slice, and API files
- ✅ Use JSDoc comments for complex types
- ✅ Prefer `interface` for object shapes, `type` for unions/intersections

**Example:**
```typescript
/**
 * User profile data returned from the API
 * @see /api/user/profile endpoint
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for updating user profile
 */
export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}

/**
 * Response from profile update mutation
 */
export interface UpdateProfileResponse {
  success: boolean;
  profile: UserProfile;
  message?: string;
}

/**
 * User role enum
 */
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

/**
 * Form state for profile editor
 */
export interface ProfileFormData {
  name: string;
  avatar: string;
  isDirty: boolean;
  errors: Record<string, string>;
}
```

**Import Pattern:**
```typescript
// In userProfileApi.ts
import { UserProfile, UpdateProfileRequest } from './types';

// In userProfileSlice.ts
import { ProfileFormData } from './types';

// In UserProfile.tsx
import { UserProfile, UserRole } from './types';
```

---

### 3. **[featureName]Slice.ts** - Redux Slice for UI/UX State

**Purpose:** Manages **client-side UI state** (not server data)

**Use Cases:**
- ✅ Modal open/closed state
- ✅ Form validation state
- ✅ Tab selection
- ✅ Expanded/collapsed sections
- ✅ Local filters or sorting preferences
- ❌ Do NOT use for server data (use RTK Query instead)

**Rules:**
- ✅ Must use Redux Toolkit's `createSlice`
- ✅ Export selectors for accessing state
- ✅ Keep logic pure and side-effect free
- ✅ Use TypeScript for state shape

**Example:**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

interface UserProfileState {
  isModalOpen: boolean;
  selectedTab: 'profile' | 'settings' | 'security';
}

const initialState: UserProfileState = {
  isModalOpen: false,
  selectedTab: 'profile',
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    setSelectedTab: (state, action: PayloadAction<UserProfileState['selectedTab']>) => {
      state.selectedTab = action.payload;
    },
  },
});

// Export actions
export const { toggleModal, setSelectedTab } = userProfileSlice.actions;

// Export selectors
export const selectIsModalOpen = (state: RootState) => state.userProfile.isModalOpen;
export const selectSelectedTab = (state: RootState) => state.userProfile.selectedTab;

// Export reducer
export default userProfileSlice.reducer;
```

**⚠️ Don't forget to register the reducer in `lib/store.ts`:**
```typescript
import userProfileReducer from '@/components/user-profile/userProfileSlice';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    userProfile: userProfileReducer,
  },
});
```

---

### 4. **[featureName]Api.ts** - RTK Query API for Server State

**Purpose:** Manages **server state** - data fetching, mutations, caching

**Use Cases:**
- ✅ Fetching data from API endpoints
- ✅ Creating/updating/deleting resources
- ✅ Managing server-side cache
- ❌ Do NOT use for UI state (use Redux slice instead)

**Rules:**
- ✅ Must follow patterns in `data-fetching.instructions.md`
- ✅ Enforce **HTTP 200 Only** policy
- ✅ Use proper TypeScript types for responses
- ✅ Handle errors properly (trigger Error Boundaries when critical)
- ✅ Use `providesTags` and `invalidatesTags` for cache management

**Example:**
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserProfile, UpdateProfileRequest } from './types';

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    validateStatus: (response) => response.status === 200, // HTTP 200 Only
  }),
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/user/profile',
      providesTags: ['UserProfile'],
    }),
    updateUserProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: '/user/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userProfileApi;
```

**⚠️ Don't forget to register the API in `lib/store.ts`:**
```typescript
import { userProfileApi } from '@/components/user-profile/userProfileApi';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    [userProfileApi.reducerPath]: userProfileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userProfileApi.middleware),
});
```

---

### 5. **[FeatureName].module.css** - Feature-Specific Styles (Optional)

**Purpose:** Contains styles specific to this feature

**Rules:**
- ✅ Use CSS Modules for scoped styles
- ✅ Prefer Tailwind utility classes in JSX when possible
- ✅ Only create this file if you need complex custom styles
- ❌ Do NOT duplicate Tailwind utilities

**Example:**
```css
.container {
  @apply flex flex-col gap-4 p-6;
}

.header {
  @apply text-2xl font-bold;
}

/* Custom styles that can't be done with Tailwind */
.customGradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## 📁 Complete Feature Organization Examples

### Simple Feature (Read-Only Data Display)

```
components/
└── stats-dashboard/
    ├── StatsDashboard.tsx        # Display component
    ├── statsDashboardApi.ts      # Fetch stats from server
    └── types.ts                  # Stats data models
```
*No slice needed - no UI state to manage*

---

### Complex Feature (Interactive with Server & UI State)

```
components/
└── link-editor/
    ├── LinkEditor.tsx            # Main component
    ├── LinkEditorForm.tsx        # Sub-component
    ├── linkEditorSlice.ts        # UI state (modal, form validation)
    ├── linkEditorApi.ts          # CRUD operations for links
    ├── types.ts                  # Link models and API contracts
    └── LinkEditor.module.css     # Custom styles
```

---

### Feature with Multiple Components

```
components/
└── analytics/
    ├── Analytics.tsx             # Main container
    ├── AnalyticsChart.tsx        # Chart sub-component
    ├── AnalyticsTable.tsx        # Table sub-component
    ├── analyticsSlice.ts         # Date range, filters, view mode
    ├── analyticsApi.ts           # Fetch analytics data
    ├── types.ts                  # Analytics data models
    └── index.ts                  # Barrel export
```

**index.ts (Barrel Export):**
```typescript
export { Analytics } from './Analytics';
export { useGetAnalyticsQuery } from './analyticsApi';
export { selectDateRange, setDateRange } from './analyticsSlice';
export type { AnalyticsData, DateRange, ChartDataPoint } from './types';
```

---

## 🔄 State Management Decision Tree

**When creating a new feature, ask yourself:**

```
Does this feature need to store data?
│
├─ YES → Is this data from the server?
│         │
│         ├─ YES → Create [featureName]Api.ts (RTK Query)
│         │
│         └─ NO → Create [featureName]Slice.ts (Redux)
│
└─ NO → Just create [FeatureName].tsx
```

**Examples:**
- **Server data** (RTK Query): User list, analytics, links, settings
- **UI state** (Redux): Modal state, form validation, tab selection, filters
- **Local state** (useState): Single component state that doesn't need sharing

---

## ✅ Checklist for Creating a New Feature

Before you start coding, ensure:

- [ ] Feature name is clear and follows kebab-case for folder, PascalCase for files
- [ ] Identified if you need RTK Query API file (server data)
- [ ] Identified if you need Redux slice (UI state)
- [ ] Read `data-fetching.instructions.md` if using RTK Query
- [ ] Read `server-actions.instructions.md` if mutating data
- [ ] Read `ui-components.instructions.md` for UI components
- [ ] Registered reducer/API in `lib/store.ts`
- [ ] Used TypeScript strict mode throughout
- [ ] Added proper error handling (Error Boundaries)

---

## 🚫 Common Mistakes to Avoid

### ❌ WRONG: Mixing Server and UI State in One Slice
```typescript
// DON'T DO THIS
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,        // ❌ Server data
    isModalOpen: false,    // ✅ UI state
  },
  // ...
});
```

**✅ CORRECT:** Separate concerns
- Use RTK Query for `userData`
- Use Redux slice for `isModalOpen`

---

### ❌ WRONG: Scattered Files
```
components/
├── UserProfile.tsx           // ❌ Mixed with other components
├── EditUserModal.tsx
└── ui/
    └── ...
lib/
└── userProfileSlice.ts       // ❌ Far from component
app/
└── api/
    └── userProfileApi.ts     // ❌ Wrong location
```

**✅ CORRECT:** Co-located in feature folder
```
components/
└── user-profile/
    ├── UserProfile.tsx
    ├── EditUserModal.tsx
    ├── userProfileSlice.ts
    └── userProfileApi.ts
```

---

### ❌ WRONG: Using Fetch Instead of RTK Query
```typescript
// ❌ DON'T DO THIS
const [data, setData] = useState(null);

useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(setData);
}, []);
```

**✅ CORRECT:** Use RTK Query
```typescript
const { data, error, isLoading } = useGetUsersQuery();
```

---

## 📚 Related Documentation

Before implementing features, read:
- [data-fetching.instructions.md](./data-fetching.instructions.md) - RTK Query patterns
- [server-actions.instructions.md](./server-actions.instructions.md) - Mutations and server actions
- [ui-components.instructions.md](./ui-components.instructions.md) - Component standards
- [authentication-rules.instructions.md](./authentication-rules.instructions.md) - Auth patterns

---

## 🎯 Summary

**Every feature MUST:**
1. Live in its own folder under `components/[feature-name]/`
2. Have a main component file: `[FeatureName].tsx`
3. Have a types file: `types.ts` (for API contracts, data models, interfaces)
4. Have an RTK Query API file if it needs server data: `[featureName]Api.ts`
5. Have a Redux slice if it needs UI state: `[featureName]Slice.ts`
6. Optionally have styles: `[FeatureName].module.css`

**This is NOT optional - it's the standard pattern for this project.**
