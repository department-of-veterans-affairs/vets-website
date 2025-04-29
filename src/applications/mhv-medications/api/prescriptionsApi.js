import { createApi } from '@reduxjs/toolkit/query/react';
import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  defaultSelectedSortOption,
  rxListSortingOptions,
} from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

/**
 * Convert a prescription resource from the API response into the expected format
 * @param {Object} prescription - The prescription data from API
 * @returns {Object} - Formatted prescription object
 */
export const convertPrescription = prescription => {
  // Handle the case where prescription might be null/undefined
  if (!prescription) return null;

  // Extract from attributes if available, otherwise use the prescription object directly
  return prescription.attributes || prescription;
};

// Create the prescriptions API slice
export const prescriptionsApi = createApi({
  reducerPath: 'prescriptionsApi',
  baseQuery: async ({ path, options = {} }) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const result = await apiRequest(path, { ...defaultOptions, ...options });
      return { data: result };
    } catch (error) {
      return {
        error: {
          status: error.status || 500,
          message: error.message || 'Failed to fetch data',
        },
      };
    }
  },
  endpoints: builder => ({
    getPrescriptionsList: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          perPage = 10,
          sortEndpoint = rxListSortingOptions[defaultSelectedSortOption]
            .API_ENDPOINT,
          filterOption = '',
          includeImage = false,
        } = params;

        let queryParams = `page=${page}&per_page=${perPage}`;
        if (sortEndpoint) queryParams += sortEndpoint;
        if (filterOption) queryParams += filterOption;
        if (includeImage) queryParams += '&include_image=true';

        return {
          path: `${apiBasePath}/prescriptions?${queryParams}`,
        };
      },
      transformResponse: response => {
        // Handle the response structure and convert prescriptions
        if (response?.data && Array.isArray(response.data)) {
          return {
            prescriptions: response.data.map(prescription =>
              convertPrescription(prescription),
            ),
            pagination: response.meta?.pagination || {},
            meta: response.meta || {},
          };
        }
        return { prescriptions: [], pagination: {}, meta: {} };
      },
    }),
    getPrescriptionById: builder.query({
      query: id => ({
        path: `${apiBasePath}/prescriptions/${id}`,
      }),
      transformResponse: response => {
        // If it's a single prescription (not in an entry array)
        if (
          response &&
          (response.data || response.attributes || response.resource)
        ) {
          return convertPrescription(response.data || response);
        }
        return null;
      },
    }),
    getRefillablePrescriptions: builder.query({
      query: () => ({
        path: `${apiBasePath}/prescriptions/list_refillable_prescriptions`,
      }),
      transformResponse: response => {
        if (response?.data && Array.isArray(response.data)) {
          return {
            prescriptions: response.data
              .map(prescription => convertPrescription(prescription))
              .sort((a, b) =>
                a.prescriptionName.localeCompare(b.prescriptionName),
              )
              .filter(prescription => prescription?.isRefillable),
            meta: response.meta || {},
          };
        }
        return { prescriptions: [], meta: {} };
      },
    }),
    getPrescriptionDocumentation: builder.query({
      query: id => ({
        path: `${apiBasePath}/prescriptions/${id}/documentation`,
      }),
    }),
    refillPrescription: builder.mutation({
      query: id => {
        return {
          path: `${apiBasePath}/prescriptions/${id}/refill`,
          method: 'PATCH',
        };
      },
    }),
    bulkRefillPrescriptions: builder.mutation({
      query: ids => {
        const idParams = ids.map(id => `ids[]=${id}`).join('&');
        return {
          path: `${apiBasePath}/prescriptions/refill_prescriptions?${idParams}`,
          options: { method: 'PATCH' },
        };
      },
      transformResponse: response => {
        return {
          successfulIds: response?.successfulIds || [],
          failedIds: response?.failedIds || [],
        };
      },
    }),
  }),
});

// Export the auto-generated hooks for use in React components
export const {
  useGetPrescriptionsListQuery,
  useGetPrescriptionByIdQuery,
  useGetRefillablePrescriptionsQuery,
  useGetPrescriptionDocumentationQuery,
  useRefillPrescriptionMutation,
  useBulkRefillPrescriptionsMutation,
  endpoints: {
    // The following are auto-generated hooks for the endpoints
    getPrescriptionsList,
    getPrescriptionById,
    getRefillablePrescriptions,
    getPrescriptionDocumentation,
    refillPrescription,
    bulkRefillPrescriptions,
  },
  // The following are useful utilities provided by RTK Query
  usePrefetch,
} = prescriptionsApi;
