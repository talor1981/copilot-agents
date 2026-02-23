import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TimeZoneResponse, SupportedTimeZone } from './types';

/**
 * RTK Query API for fetching timezone data via our Next.js API proxy
 * Uses local API route to avoid CORS issues with TimeAPI.io
 */
export const globalTimeApi = createApi({
  reducerPath: 'globalTimeApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
  }),
  tagTypes: ['GlobalTime'],
  endpoints: (builder) => ({
    getTimeZone: builder.query<TimeZoneResponse, SupportedTimeZone>({
      query: (timeZone) => `/time?timeZone=${encodeURIComponent(timeZone)}`,
      // Strict 200 validation as per data-fetching.instructions.md
      transformResponse: (response: TimeZoneResponse, meta) => {
        if (meta?.response?.status !== 200) {
          throw new Error('API Response was not 200 OK');
        }
        return response;
      },
      providesTags: (result, error, timeZone) => [{ type: 'GlobalTime', id: timeZone }],
    }),
  }),
});

export const { useGetTimeZoneQuery } = globalTimeApi;
