import { createApi } from '@reduxjs/toolkit/query/react';
import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

/**
 * RTK Query API definition for prescription refills
 * Handles all API interactions with caching and automatic refetching
 */
export const refillsApi = createApi({
  reducerPath: 'refillsApi',
  baseQuery: async ({ path, options = {} }) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const result = await apiRequest(path, { ...defaultOptions, ...options });
      return { data: result };
    } catch ({ errors }) {
      return {
        error: {
          status: errors?.[0]?.status || 500,
          message: errors?.[0]?.title || 'Failed to fetch data',
        },
      };
    }
  },
  // Cache for 1 hour
  keepUnusedDataFor: 60 * 60,
  tagTypes: ['Refill'],
  endpoints: builder => ({
    getRefillablePrescriptions: builder.query({
      query: () => ({
        path: `${apiBasePath}/prescriptions/list_refillable_prescriptions`,
      }),
      providesTags: ['Refill'],
      transformResponse: response => {
        if (response?.data && Array.isArray(response.data)) {
          return {
            prescriptions: response.data,
            meta: response.meta || {},
          };
        }
        return { prescriptions: [], meta: {} };
      },
    }),
  }),
});

// Export auto-generated hooks for use in components
export const { useGetRefillablePrescriptionsQuery } = refillsApi;

// Export endpoint for use in loaders
export const { getRefillablePrescriptions } = refillsApi.endpoints;
