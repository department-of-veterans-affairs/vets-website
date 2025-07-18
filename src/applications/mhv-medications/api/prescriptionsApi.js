import { createApi } from '@reduxjs/toolkit/query/react';
import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  sanitizeKramesHtmlStr,
  convertPrescription,
  filterRecentlyRequestedForAlerts,
} from '../util/helpers';
import {
  defaultSelectedSortOption,
  INCLUDE_IMAGE_ENDPOINT,
  rxListSortingOptions,
} from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

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
    } catch ({ errors }) {
      return {
        // TODO: Need to standardize API error responses
        error: {
          status: errors?.[0]?.status || 500,
          message: errors?.[0]?.title || 'Failed to fetch data',
        },
      };
    }
  },
  // Cache for 1 hour.
  keepUnusedDataFor: 60 * 60,
  // Refetch data every 60 seconds if the component mounts or the arguments change
  // This is commented out for now due to the 6 requests per day limit to VistA
  // refetchOnMountOrArgChange: 60,
  tagTypes: ['Prescription'],
  endpoints: builder => ({
    getPrescriptionSortedList: builder.query({
      query: ({ sortEndpoint, includeImage = false }) => ({
        path: `${apiBasePath}/prescriptions?${sortEndpoint}${
          includeImage ? INCLUDE_IMAGE_ENDPOINT : ''
        }`,
      }),
      providesTags: ['Prescription'],
      transformResponse: response => {
        if (response?.data && Array.isArray(response.data)) {
          return {
            prescriptions: response.data.map(prescription =>
              convertPrescription(prescription),
            ),
            meta: response.meta || {},
          };
        }
        return { prescriptions: [], meta: {} };
      },
    }),
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
        if (filterOption) queryParams += filterOption;
        if (sortEndpoint) queryParams += sortEndpoint;
        if (includeImage) queryParams += '&include_image=true';

        return {
          path: `${apiBasePath}/prescriptions?${queryParams}`,
        };
      },
      providesTags: ['Prescription'],
      transformResponse: response => {
        // Handle the response structure and convert prescriptions
        if (response?.data && Array.isArray(response.data)) {
          return {
            prescriptions: response.data.map(prescription =>
              convertPrescription(prescription),
            ),
            refillAlertList: filterRecentlyRequestedForAlerts(
              response.meta?.recentlyRequested || [],
            ),
            pagination: response.meta?.pagination || {},
            meta: response.meta || {},
          };
        }
        return {
          prescriptions: [],
          refillAlertList: [],
          pagination: {},
          meta: {},
        };
      },
    }),
    getPrescriptionById: builder.query({
      query: id => ({
        path: `${apiBasePath}/prescriptions/${id}`,
      }),
      providesTags: ['Prescription'],
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
      providesTags: ['Prescription'],
      transformResponse: response => {
        if (response?.data && Array.isArray(response.data)) {
          return {
            prescriptions: response.data
              .map(prescription => convertPrescription(prescription))
              .sort((a, b) =>
                a.prescriptionName.localeCompare(b.prescriptionName),
              )
              .filter(prescription => prescription?.isRefillable),
            refillAlertList: filterRecentlyRequestedForAlerts(
              response.meta?.recentlyRequested || [],
            ),
            meta: response.meta || {},
          };
        }
        return {
          prescriptions: [],
          refillAlertList: [],
          meta: {},
        };
      },
    }),
    getPrescriptionDocumentation: builder.query({
      query: id => ({
        path: `${apiBasePath}/prescriptions/${id}/documentation`,
      }),
      transformResponse: response => {
        return response?.data?.attributes?.html
          ? sanitizeKramesHtmlStr(response.data.attributes.html)
          : null;
      },
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
      invalidatesTags: ['Prescription'],
      transformResponse: response => {
        return {
          successfulIds: response?.successfulIds || [],
          failedIds: response?.failedIds || [],
        };
      },
    }),
  }),
});

// Auto-generated hooks for use in React components
export const {
  useGetPrescriptionsListQuery,
  useGetPrescriptionByIdQuery,
  useGetRefillablePrescriptionsQuery,
  useGetPrescriptionDocumentationQuery,
  useRefillPrescriptionMutation,
  useBulkRefillPrescriptionsMutation,
  useGetPrescriptionSortedListQuery,
  endpoints: {
    // Auto-generated hooks for the endpoints
    getPrescriptionsList,
    getPrescriptionById,
    getRefillablePrescriptions,
    getPrescriptionDocumentation,
    refillPrescription,
    bulkRefillPrescriptions,
    getPrescriptionSortedList,
  },
  usePrefetch,
} = prescriptionsApi;
