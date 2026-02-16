import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for the Free Public APIs response
export interface PublicAPI {
  id: number;
  emoji: string;
  title: string;
  description: string;
  documentation: string;
  methods: number;
  health: number;
  source: string;
}

export interface GetApisParams {
  limit?: number;
  sort?: 'best' | 'new' | 'fast' | 'popular' | 'noerror' | 'reliable' | 'all';
}

// User's Link type
export interface UserLink {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Dynamic base query that handles both external and internal APIs
const dynamicBaseQuery = fetchBaseQuery({
  baseUrl: 'https://www.freepublicapis.com/api',
  prepareHeaders: (headers) => {
    return headers;
  },
});

// RTK Query API slice following strict HTTP 200 validation
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: async (args, api, extraOptions) => {
    // Check if this is an internal API call (starts with /api/)
    if (typeof args === 'string' && args.startsWith('/api/')) {
      // For internal APIs, use relative path
      const result = await fetchBaseQuery({ baseUrl: '' })(args, api, extraOptions);
      return result;
    } else if (typeof args === 'object' && args.url?.startsWith('/api/')) {
      // For internal APIs with object config
      const result = await fetchBaseQuery({ baseUrl: '' })(args, api, extraOptions);
      return result;
    }
    // For external APIs, use the default base query
    return dynamicBaseQuery(args, api, extraOptions);
  },
  tagTypes: ['PublicAPIs', 'UserLinks'],
  endpoints: (builder) => ({
    // Get list of public APIs
    getPublicApis: builder.query<PublicAPI[], GetApisParams>({
      query: ({ limit = 10, sort = 'best' } = {}) => ({
        url: '/apis',
        params: { limit, sort },
      }),
      // Strict 200 validation as per data-fetching instructions
      transformResponse: (response: PublicAPI[], meta) => {
        if (meta?.response?.status !== 200) {
          throw new Error('API Response was not 200 OK');
        }
        return response;
      },
      providesTags: ['PublicAPIs'],
    }),
    
    // Get a random API
    getRandomApi: builder.query<PublicAPI, void>({
      query: () => '/random',
      transformResponse: (response: PublicAPI, meta) => {
        if (meta?.response?.status !== 200) {
          throw new Error('API Response was not 200 OK');
        }
        return response;
      },
      providesTags: ['PublicAPIs'],
    }),
    
    // Get specific API by ID
    getApiById: builder.query<PublicAPI, number>({
      query: (id) => `/apis/${id}`,
      transformResponse: (response: PublicAPI, meta) => {
        if (meta?.response?.status !== 200) {
          throw new Error('API Response was not 200 OK');
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'PublicAPIs', id }],
    }),
    
    // Get user's links from internal API
    getUserLinks: builder.query<UserLink[], void>({
      query: () => '/api/links',
      transformResponse: (response: UserLink[], meta) => {
        if (meta?.response?.status !== 200) {
          throw new Error('API Response was not 200 OK');
        }
        return response;
      },
      providesTags: ['UserLinks'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetPublicApisQuery, 
  useGetRandomApiQuery, 
  useGetApiByIdQuery,
  useGetUserLinksQuery,
} = dashboardApi;
