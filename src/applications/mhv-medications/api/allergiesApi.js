import { createApi } from '@reduxjs/toolkit/query/react';
import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  convertAllergy as sharedConvertAllergy,
  convertUnifiedAllergy as sharedConvertAcceleratedAllergy,
} from '@department-of-veterans-affairs/mhv/exports';
import { FIELD_NONE_NOTED, FIELD_NOT_AVAILABLE } from '../util/constants';

/**
 * TODO: implement retry logic
 */
export const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const API_BASE_PATH_V2 = `${environment.API_URL}/my_health/v2`;

// Options for Medications app (different from Medical Records defaults)
const allergyOptions = {
  emptyField: FIELD_NOT_AVAILABLE,
  noneNotedField: FIELD_NONE_NOTED,
  includeProvider: false,
  joinAllCategories: false,
};

/**
 * Convert a FHIR AllergyIntolerance resource using shared converter.
 * Wrapper that passes Medications options.
 */
export const convertAllergy = allergy => {
  return sharedConvertAllergy(allergy, allergyOptions);
};

export const convertAcceleratedAllergy = allergy => {
  return sharedConvertAcceleratedAllergy(allergy, allergyOptions);
};

/**
 * Build the API path for getAllergies endpoint
 * @param {Object} params - Query parameters
 * @param {boolean} params.isAcceleratingAllergies - Use v2 accelerated API
 * @param {boolean} params.isCerner - Use Cerner/Oracle Health path
 * @returns {Object} Object containing the path
 */
export const buildGetAllergiesQuery = (params = {}) => {
  const { isAcceleratingAllergies = false, isCerner = false } = params;
  let path = '';
  if (isAcceleratingAllergies) {
    path = `${API_BASE_PATH_V2}/medical_records/allergies`;
  } else {
    path = isCerner
      ? `${apiBasePath}/medical_records/allergies?use_oh_data_path=1`
      : `${apiBasePath}/medical_records/allergies`;
  }
  return { path };
};

/**
 * Build the API path for getAllergyById endpoint
 * @param {Object} params - Query parameters
 * @param {string} params.id - Allergy ID
 * @param {boolean} params.isAcceleratingAllergies - Use v2 accelerated API
 * @param {boolean} params.isCerner - Use Cerner/Oracle Health path
 * @returns {Object} Object containing the path
 */
export const buildGetAllergyByIdQuery = (params = {}) => {
  const { id, isAcceleratingAllergies = false, isCerner = false } = params;
  let path = '';
  if (isAcceleratingAllergies) {
    path = `${API_BASE_PATH_V2}/medical_records/allergies/${id}`;
  } else {
    path = isCerner
      ? `${apiBasePath}/medical_records/allergies?use_oh_data_path=1`
      : `${apiBasePath}/medical_records/allergies`;
  }
  return { path };
};

/**
 * Transform response for getAllergies endpoint
 * @param {Object} response - API response
 * @returns {Array} Transformed allergies array
 */
export const transformAllergiesResponse = response => {
  let data = [];
  // Make sure entry exists and is an array before mapping
  if (response?.entry && Array.isArray(response.entry)) {
    data = response.entry.map(allergy => convertAllergy(allergy.resource));
  }
  if (response?.data && Array.isArray(response.data)) {
    data = response.data.map(allergy => convertAcceleratedAllergy(allergy));
  }
  return data;
};

/**
 * Transform response for getAllergyById endpoint
 * @param {Object} response - API response
 * @returns {Object} Transformed allergy object
 */
export const transformAllergyByIdResponse = response => {
  if (response.resource) {
    return convertAllergy(response.resource);
  }
  if (
    response?.entry &&
    Array.isArray(response.entry) &&
    response.entry[0]?.resource
  ) {
    return convertAllergy(response.entry[0].resource);
  }
  if (response?.data) {
    return convertAcceleratedAllergy(response.data);
  }
  return response;
};

/**
 * Base query function for allergies API
 * @param {Object} args - Query arguments
 * @param {string} args.path - API path
 * @param {Object} args.options - Request options
 * @returns {Object} Result or error object
 */
export const allergiesBaseQuery = async ({ path, options = {} }) => {
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
};

// Create the allergies API slice
export const allergiesApi = createApi({
  reducerPath: 'allergiesApi',
  baseQuery: allergiesBaseQuery,
  endpoints: builder => ({
    getAllergies: builder.query({
      query: buildGetAllergiesQuery,
      transformResponse: transformAllergiesResponse,
    }),
    getAllergyById: builder.query({
      query: buildGetAllergyByIdQuery,
      transformResponse: transformAllergyByIdResponse,
    }),
  }),
});

export const {
  useGetAllergiesQuery,
  useGetAllergyByIdQuery,
  usePrefetch,
  endpoints: { getAllergies, getAllergyById },
} = allergiesApi;
