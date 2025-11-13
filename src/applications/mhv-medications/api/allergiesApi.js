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

const API_BASE_PATH_V2 = `${environment.API_URL}/my_health/v2`;

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
  if (allergy && allergy.attributes?.observedHistoric) {
    if (allergy.attributes.observedHistoric === 'o')
      return allergyTypes.OBSERVED;
    if (allergy.attributes.observedHistoric === 'h')
      return allergyTypes.REPORTED;
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

export const convertAcceleratedAllergy = allergy => {
  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergy.attributes.categories) &&
        allergy.attributes.categories[0].charAt(0).toUpperCase() +
          allergy.attributes.categories[0].slice(1)) ||
      FIELD_NOT_AVAILABLE,
    name: allergy.attributes.name || FIELD_NONE_NOTED,
    date: allergy.attributes.date
      ? formatDateLong(allergy.attributes.date)
      : FIELD_NOT_AVAILABLE,
    reaction: isArrayAndHasItems(allergy.attributes.reactions)
      ? allergy.attributes.reactions
      : [FIELD_NONE_NOTED],
    location: allergy.attributes.location || FIELD_NOT_AVAILABLE,
    observedOrReported: extractObservedReported(allergy),
    notes: isArrayAndHasItems(allergy.attributes.notes)
      ? allergy.attributes.notes.join(', ')
      : FIELD_NONE_NOTED,
    provider: allergy.attributes.provider || FIELD_NOT_AVAILABLE,
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
      query: (params = {}) => {
        const { isAcceleratingAllergies = false, isCerner = false } = params;
        let path = '';
        if (isAcceleratingAllergies) {
          path = `${API_BASE_PATH_V2}/medical_records/allergies`;
        } else if (isCerner) {
          path = `${apiBasePath}/medical_records/allergies?use_oh_data_path=1`;
        } else {
          path = `${apiBasePath}/medical_records/allergies`;
        }
        return {
          path,
        };
      },
      // Transform the response to use our existing conversion function
      transformResponse: response => {
        let data = [];
        // Make sure entry exists and is an array before mapping
        if (response?.entry && Array.isArray(response.entry)) {
          data = response.entry.map(allergy =>
            convertAllergy(allergy.resource),
          );
        }
        if (response?.data && Array.isArray(response.data)) {
          data = response.data.map(allergy =>
            convertAcceleratedAllergy(allergy),
          );
        }
        return data;
      },
    }),
    getAllergyById: builder.query({
      query: (params = {}) => {
        const {
          id,
          isAcceleratingAllergies = false,
          isCerner = false,
        } = params;
        let path = '';
        if (isAcceleratingAllergies) {
          path = `${API_BASE_PATH_V2}/medical_records/allergies/${id}`;
        } else if (isCerner) {
          path = `${apiBasePath}/medical_records/allergies/${id}?use_oh_data_path=1`;
        } else {
          path = `${apiBasePath}/medical_records/allergies/${id}`;
        }
        return path;
      },
      // Transform the single allergy response
      transformResponse: response => {
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
