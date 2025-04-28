import { createApi } from '@reduxjs/toolkit/query/react';
import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  defaultSelectedSortOption,
  EMPTY_FIELD,
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
  const prescriptionData = prescription.attributes || prescription;

  return {
    id: prescriptionData.prescriptionId,
    prescriptionId: prescriptionData.prescriptionId,
    prescriptionNumber: prescriptionData.prescriptionNumber || EMPTY_FIELD,
    prescriptionName:
      prescriptionData.prescriptionName ||
      prescriptionData.orderableItem ||
      EMPTY_FIELD,
    refillStatus: prescriptionData.refillStatus || EMPTY_FIELD,
    refillSubmitDate: prescriptionData.refillSubmitDate || EMPTY_FIELD,
    refillDate: prescriptionData.refillDate || EMPTY_FIELD,
    refillRemaining: prescriptionData.refillRemaining,
    facilityName: prescriptionData.facilityName || EMPTY_FIELD,
    orderedDate: prescriptionData.orderedDate || EMPTY_FIELD,
    quantity: prescriptionData.quantity || EMPTY_FIELD,
    expirationDate: prescriptionData.expirationDate || EMPTY_FIELD,
    dispensedDate: prescriptionData.dispensedDate || EMPTY_FIELD,
    sortedDispensedDate:
      prescriptionData.sortedDispensedDate ||
      prescriptionData.dispensedDate ||
      EMPTY_FIELD,
    stationNumber: prescriptionData.stationNumber || EMPTY_FIELD,
    isRefillable: prescriptionData.isRefillable || false,
    isTrackable: prescriptionData.isTrackable || false,
    sig: prescriptionData.sig || EMPTY_FIELD,
    cmopDivisionPhone: prescriptionData.cmopDivisionPhone || EMPTY_FIELD,
    dialCmopDivisionPhone:
      prescriptionData.dialCmopDivisionPhone || EMPTY_FIELD,
    providerFirstName: prescriptionData.providerFirstName || EMPTY_FIELD,
    providerLastName: prescriptionData.providerLastName || EMPTY_FIELD,
    remarks: prescriptionData.remarks || EMPTY_FIELD,
    dispStatus: prescriptionData.dispStatus || EMPTY_FIELD,
    prescriptionSource: prescriptionData.prescriptionSource || EMPTY_FIELD,
    indicationForUse: prescriptionData.indicationForUse || EMPTY_FIELD,
    cmopNdcNumber: prescriptionData.cmopNdcNumber || EMPTY_FIELD,
    trackingList: prescriptionData.trackingList || [],
    rxRfRecords: prescriptionData.rxRfRecords || [],
    // Additional fields that might be useful
    disclaimer: prescriptionData.disclaimer || EMPTY_FIELD,
    shape: prescriptionData.shape || EMPTY_FIELD,
    color: prescriptionData.color || EMPTY_FIELD,
    frontImprint: prescriptionData.frontImprint || EMPTY_FIELD,
    backImprint: prescriptionData.backImprint || EMPTY_FIELD,
  };
};

// Create the prescriptions API slice
export const prescriptionsApi = createApi({
  reducerPath: 'prescriptionsApi',
  baseQuery: async ({ path, options = {} }) => {
    try {
      const result = await apiRequest(path, { ...options });
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
            prescriptions: response.data.map(prescription =>
              convertPrescription(prescription),
            ),
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
      query: id => ({
        path: `${apiBasePath}/prescriptions/${id}/refill`,
        method: 'PATCH',
      }),
    }),
    bulkRefillPrescriptions: builder.mutation({
      query: ids => {
        const idParams = ids.map(id => `ids[]=${id}`).join('&');
        return {
          path: `${apiBasePath}/prescriptions/refill_prescriptions?${idParams}`,
          method: 'PATCH',
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
