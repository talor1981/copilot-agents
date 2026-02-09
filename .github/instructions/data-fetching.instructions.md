---
description: Critical rules for API management, RTK Query implementation, and Error Boundary integration.
---

# Data Fetching & API Architecture

This project uses **RTK Query** (Redux Toolkit) for all data fetching and state synchronization. Direct use of the `fetch` API or `axios` is prohibited for component-level data.

## Core Principles

### 1. State Synchronization & Status Codes
* **Source of Truth:** RTK Query is the sole manager of server-state.
* **The "200" Rule:** Only HTTP status code `200 OK` is considered a successful state update. 
* **Validation:** Use `transformResponse` or `baseQuery` wrappers to ensure that any non-200 response (even if it doesn't throw a network error) is treated as an error state to prevent corrupting the cache.

### 2. Error Handling & Boundaries
* **Propagation:** API errors must be handled such that they can be caught by **Error Boundaries**.
* **Granularity:** * **Global:** Handled via a generic middleware or a top-level Error Boundary for 500-level errors.
    * **Feature-level:** Use the `error` object returned by the generated hooks to trigger local UI fallbacks or re-throw to the nearest boundary.

## Implementation Standard

### Example API Slice
When generating new endpoints, follow this pattern:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const featureApi = createApi({
  reducerPath: 'featureApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Feature'],
  endpoints: (builder) => ({
    getFeatureData: builder.query<ResponseType, RequestType>({
      query: (id) => `/feature/${id}`,
      // Rule: Strict 200 validation
      transformResponse: (response: ResponseType, meta) => {
        if (meta?.response?.status !== 200) {
          throw new Error('API Response was not 200 OK');
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Feature', id }],
    }),
  }),
});