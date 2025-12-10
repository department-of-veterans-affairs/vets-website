import { createApi } from '@reduxjs/toolkit/query/react';
import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import { convertAllergy as sharedConvertAllergy } from '@department-of-veterans-affairs/mhv/exports';
import { FIELD_NONE_NOTED, FIELD_NOT_AVAILABLE } from '../util/constants';

/**
 * TODO: implement retry logic
 */
const apiBasePath = `${environment.API_URL}/my_health/v1`;

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

// Create the allergies API slice
export const allergiesApi = createApi({
  reducerPath: 'allergiesApi',
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
    getAllergies: builder.query({
      query: () => ({
        path: `${apiBasePath}/medical_records/allergies`,
      }),
      // Transform the response to use our existing conversion function
      transformResponse: response => {
        // Make sure entry exists and is an array before mapping
        if (response?.entry && Array.isArray(response.entry)) {
          return response.entry.map(allergy =>
            convertAllergy(allergy.resource),
          );
        }
        return [];
      },
    }),
    getAllergyById: builder.query({
      query: id => ({
        path: `${apiBasePath}/medical_records/allergies/${id}`,
      }),
      // Transform the single allergy response
      transformResponse: response => {
        if (response.resource) {
          return convertAllergy(response.resource);
        }
        if (response?.entry && response.entry[0]?.resource) {
          return convertAllergy(response.entry[0].resource);
        }
        return response;
      },
    }),
  }),
});

export const {
  useGetAllergiesQuery,
  useGetAllergyByIdQuery,
  usePrefetch,
  endpoints: { getAllergies, getAllergyById },
} = allergiesApi;
