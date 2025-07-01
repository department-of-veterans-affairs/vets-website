import { createApi } from '@reduxjs/toolkit/query/react';
import {
  formatDateLong,
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  extractContainedResource,
  getReactions,
  isArrayAndHasItems,
} from '../util/helpers';
import {
  allergyTypes,
  FIELD_NONE_NOTED,
  FIELD_NOT_AVAILABLE,
} from '../util/constants';

/**
 * TODO: implement retry logic
 */
const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const extractLocation = allergy => {
  if (isArrayAndHasItems(allergy?.recorder?.extension)) {
    const ref = allergy.recorder.extension[0].valueReference?.reference;
    // Use the reference inside "recorder" to get the value from "contained".
    const org = extractContainedResource(allergy, ref);
    if (org?.name) {
      return org.name;
    }
  }
  return FIELD_NOT_AVAILABLE;
};

export const extractObservedReported = allergy => {
  if (allergy && isArrayAndHasItems(allergy.extension)) {
    const extItem = allergy.extension.find(
      item => item.url && item.url.includes('allergyObservedHistoric'),
    );
    if (extItem?.valueCode) {
      if (extItem.valueCode === 'o') return allergyTypes.OBSERVED;
      if (extItem.valueCode === 'h') return allergyTypes.REPORTED;
    }
  }
  return FIELD_NOT_AVAILABLE;
};

export const convertAllergy = allergy => {
  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergy.category) &&
        allergy.category[0].charAt(0).toUpperCase() +
          allergy.category[0].slice(1)) ||
      FIELD_NOT_AVAILABLE,
    name: allergy?.code?.text || FIELD_NONE_NOTED,
    date: allergy?.recordedDate
      ? formatDateLong(allergy.recordedDate)
      : FIELD_NOT_AVAILABLE,
    reaction: getReactions(allergy),
    location: extractLocation(allergy),
    observedOrReported: extractObservedReported(allergy),
    notes:
      (isArrayAndHasItems(allergy.note) && allergy.note[0].text) ||
      FIELD_NONE_NOTED,
  };
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
