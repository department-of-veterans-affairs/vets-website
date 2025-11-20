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
import { selectCernerPilotFlag } from '../util/selectors';

const documentationApiBasePath = `${environment.API_URL}/my_health/v1`;

export const getApiBasePath = state => {
  // Handle loading state - default to v1
  if (!state?.featureToggles || state.featureToggles.loading) {
    return `${environment.API_URL}/my_health/v1`;
  }

  const isCernerPilot = selectCernerPilotFlag(state);
  return `${environment.API_URL}/my_health/${isCernerPilot ? 'v2' : 'v1'}`;
};

export const getRefillMethod = state => {
  // Handle loading state - default to PATCH
  if (!state?.featureToggles || state.featureToggles.loading) {
    return 'PATCH';
  }

  const isCernerPilot = selectCernerPilotFlag(state);
  return isCernerPilot ? 'POST' : 'PATCH';
};

// Create the prescriptions API slice
export const prescriptionsApi = createApi({
  reducerPath: 'prescriptionsApi',
  baseQuery: async ({ path, options = {} }, api) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const state = api.getState();
    const apiBasePath = getApiBasePath(state);

    try {
      const result = await apiRequest(`${apiBasePath}${path}`, {
        ...defaultOptions,
        ...options,
      });
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
    getPrescriptionsExportList: builder.query({
      query: ({ filterOption = '', sortEndpoint, includeImage = false }) => ({
        path: `/prescriptions?${filterOption}${sortEndpoint}${
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
          path: `/prescriptions?${queryParams}`,
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
        path: `/prescriptions/${id}`,
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
        path: `/prescriptions/list_refillable_prescriptions`,
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
      // This endpoint always hits v1 docs API regardless of Cerner pilot flag
      async queryFn(id) {
        try {
          const response = await apiRequest(
            `${documentationApiBasePath}/prescriptions/${id}/documentation`,
          );

          const html = response?.data?.attributes?.html
            ? sanitizeKramesHtmlStr(response.data.attributes.html)
            : null;

          return { data: html };
        } catch (error) {
          const errors = error?.errors || [];
          return {
            error: {
              status: errors?.[0]?.status || 500,
              message: errors?.[0]?.title || 'Failed to fetch data',
            },
          };
        }
      },
    }),
    refillPrescription: builder.mutation({
      queryFn: async (id, { getState }) => {
        const state = getState();
        const apiBasePath = getApiBasePath(state);
        const method = getRefillMethod(state);

        try {
          const result = await apiRequest(
            `${apiBasePath}/prescriptions/${id}/refill`,
            {
              method,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          return { data: result };
        } catch ({ errors }) {
          return {
            error: {
              status: errors?.[0]?.status || 500,
              message: errors?.[0]?.title || 'Failed to refill prescription',
            },
          };
        }
      },
    }),
    bulkRefillPrescriptions: builder.mutation({
      queryFn: async (ids, { getState }) => {
        const state = getState();
        const apiBasePath = getApiBasePath(state);
        const method = getRefillMethod(state);
        const isOracleHealthPilot = selectCernerPilotFlag(state);

        if (isOracleHealthPilot) {
          try {
            const result = await apiRequest(
              `${apiBasePath}/prescriptions/refill_prescriptions`,
              {
                method,
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(ids),
              },
            );
            return {
              data: {
                ...result,
                successfulIds: result.data.attributes.prescriptionList || [],
                failedIds: result.data.attributes.failedPrescriptionIds || [],
              },
            };
          } catch ({ errors }) {
            return {
              error: {
                status: errors?.[0]?.status || 500,
                message: errors?.[0]?.title || 'Failed to refill prescriptions',
              },
            };
          }
        } else {
          const idParams = ids.map(id => `ids[]=${id}`).join('&');

          try {
            const result = await apiRequest(
              `${apiBasePath}/prescriptions/refill_prescriptions?${idParams}`,
              {
                method,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );
            return { data: result };
          } catch ({ errors }) {
            return {
              error: {
                status: errors?.[0]?.status || 500,
                message: errors?.[0]?.title || 'Failed to refill prescriptions',
              },
            };
          }
        }
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
  useGetPrescriptionsExportListQuery,
  endpoints: {
    // Auto-generated hooks for the endpoints
    getPrescriptionsList,
    getPrescriptionById,
    getRefillablePrescriptions,
    getPrescriptionDocumentation,
    refillPrescription,
    bulkRefillPrescriptions,
    getPrescriptionsExportList,
  },
  usePrefetch,
} = prescriptionsApi;
