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
import {
  selectCernerPilotFlag,
  selectEnableKramesHtmlSanitizationFlag,
} from '../util/selectors';

export const documentationApiBasePath = `${environment.API_URL}/my_health/v1`;

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

/**
 * Build query path for getPrescriptionsExportList endpoint
 * @param {Object} params - Query parameters
 * @param {string} params.filterOption - Filter option string
 * @param {string} params.sortEndpoint - Sort endpoint string
 * @param {boolean} params.includeImage - Whether to include images
 * @returns {Object} Object containing the path
 */
export const buildExportListQuery = ({
  filterOption = '',
  sortEndpoint,
  includeImage = false,
}) => ({
  path: `/prescriptions?${filterOption}${sortEndpoint}${
    includeImage ? INCLUDE_IMAGE_ENDPOINT : ''
  }`,
});

/**
 * Build query path for getPrescriptionsList endpoint
 * @param {Object} params - Query parameters
 * @returns {Object} Object containing the path
 */
export const buildPrescriptionsListQuery = (params = {}) => {
  const {
    page = 1,
    perPage = 10,
    sortEndpoint = rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
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
};

/**
 * Build query path for getPrescriptionById endpoint
 * @param {string} id - Prescription ID
 * @returns {Object} Object containing the path
 */
export const buildPrescriptionByIdQuery = id => ({
  path: `/prescriptions/${id}`,
});

/**
 * Build query path for getRefillablePrescriptions endpoint
 * @returns {Object} Object containing the path
 */
export const buildRefillablePrescriptionsQuery = () => ({
  path: `/prescriptions/list_refillable_prescriptions`,
});

/**
 * Transform response for getPrescriptionsExportList endpoint
 * @param {Object} response - API response
 * @returns {Object} Transformed response with prescriptions and meta
 */
export const transformExportListResponse = response => {
  if (response?.data && Array.isArray(response.data)) {
    return {
      prescriptions: response.data.map(prescription =>
        convertPrescription(prescription),
      ),
      meta: response.meta || {},
    };
  }
  return { prescriptions: [], meta: {} };
};

/**
 * Transform response for getPrescriptionsList endpoint
 * @param {Object} response - API response
 * @returns {Object} Transformed response with prescriptions, pagination, etc.
 */
export const transformPrescriptionsListResponse = response => {
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
};

/**
 * Transform response for getPrescriptionById endpoint
 * @param {Object} response - API response
 * @returns {Object|null} Transformed prescription or null
 */
export const transformPrescriptionByIdResponse = response => {
  if (response && (response.data || response.attributes || response.resource)) {
    return convertPrescription(response.data || response);
  }
  return null;
};

/**
 * Transform response for getRefillablePrescriptions endpoint
 * @param {Object} response - API response
 * @returns {Object} Transformed response with refillable prescriptions
 */
export const transformRefillablePrescriptionsResponse = response => {
  if (response?.data && Array.isArray(response.data)) {
    return {
      prescriptions: response.data
        .map(prescription => convertPrescription(prescription))
        .sort((a, b) => a.prescriptionName.localeCompare(b.prescriptionName))
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
};

/**
 * Transform response for bulkRefillPrescriptions endpoint
 * @param {Object} response - API response
 * @returns {Object} Transformed response with successful and failed IDs
 */
export const transformBulkRefillResponse = response => {
  return {
    successfulIds: response?.successfulIds || [],
    failedIds: response?.failedIds || [],
  };
};

export const transformPrescriptionDocumentationResponse = (response, state) => {
  const html = response?.data?.attributes?.html;

  if (!html) {
    return null;
  }

  // Check feature flag to determine if we should use the sanitizer
  // Default to true (sanitize) when flag is not set or loading
  const shouldEnableSanitization =
    !state?.featureToggles ||
    state.featureToggles.loading ||
    selectEnableKramesHtmlSanitizationFlag(state) !== false;

  return shouldEnableSanitization ? sanitizeKramesHtmlStr(html) : html;
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
      query: buildExportListQuery,
      providesTags: ['Prescription'],
      transformResponse: transformExportListResponse,
    }),
    getPrescriptionsList: builder.query({
      query: buildPrescriptionsListQuery,
      providesTags: ['Prescription'],
      transformResponse: transformPrescriptionsListResponse,
    }),
    getPrescriptionById: builder.query({
      query: buildPrescriptionByIdQuery,
      providesTags: ['Prescription'],
      transformResponse: transformPrescriptionByIdResponse,
    }),
    getRefillablePrescriptions: builder.query({
      query: buildRefillablePrescriptionsQuery,
      providesTags: ['Prescription'],
      // Refetch when tab regains focus to sync state across multiple tabs
      refetchOnFocus: true,
      refetchOnReconnect: true,
      transformResponse: transformRefillablePrescriptionsResponse,
    }),
    getPrescriptionDocumentation: builder.query({
      // This endpoint always hits v1 docs API regardless of Cerner pilot flag
      async queryFn(id, { getState }) {
        try {
          const response = await apiRequest(
            `${documentationApiBasePath}/prescriptions/${id}/documentation`,
          );

          const state = getState();
          const html = transformPrescriptionDocumentationResponse(
            response,
            state,
          );

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
              `${apiBasePath}/prescriptions/refill`,
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
                failedIds: result.data.attributes.failedPrescriptionList || [],
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
      // Invalidate prescription cache to prevent duplicate refill attempts
      // This ensures the refillable list is updated immediately after successful refills
      invalidatesTags: ['Prescription'],
      transformResponse: transformBulkRefillResponse,
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
