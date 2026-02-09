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

// RTK Query API slice following strict HTTP 200 validation
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://www.freepublicapis.com/api',
  }),
  tagTypes: ['PublicAPIs'],
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
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetPublicApisQuery, 
  useGetRandomApiQuery, 
  useGetApiByIdQuery 
} = dashboardApi;
