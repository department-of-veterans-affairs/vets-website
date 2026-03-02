import { apiRequest } from 'platform/utilities/api';
import { API_ENDPOINTS } from '../utils/constants';
import { ensureValidCSRFToken } from './ensureValidCSRFToken';
import content from '../locales/en/content.json';

// Formats facility address fields
const formatAddress = ({
  address1 = '',
  address2 = '',
  address3 = '',
  city = '',
  state = '',
  zip = '',
} = {}) => ({
  address1,
  address2: [address2, address3].filter(Boolean).join(', '),
  address3: [city, state && zip ? `${state} ${zip}` : state || zip]
    .filter(Boolean)
    .join(', '),
});

export const fetchFacilities = async ({
  lat = null,
  long = null,
  page = null,
  facilityIds = [],
  type = 'health',
}) => {
  try {
    await ensureValidCSRFToken('fetchFacilities');

    const { data, meta } = await apiRequest(API_ENDPOINTS.facilities, {
      method: 'POST',
      body: JSON.stringify({
        type,
        lat,
        long,
        page,
        facilityIds: facilityIds.join(','),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!data?.length) {
      return {
        type: 'NO_SEARCH_RESULTS',
        errorMessage: content['error--no-results-found'],
      };
    }

    return {
      facilities: data.map(({ id, attributes }) => ({
        ...attributes,
        id,
        address: { physical: formatAddress(attributes?.address?.physical) },
      })),
      meta,
    };
  } catch ({ errors }) {
    const errorResponse = errors?.[0];
    if (
      errorResponse?.status === '403' &&
      errorResponse?.detail === 'Invalid Authenticity Token'
    ) {
      localStorage.removeItem('csrfToken');
    }

    return {
      type: 'SEARCH_FAILED',
      errorMessage: content['error--facilities--generic'],
    };
  }
};
