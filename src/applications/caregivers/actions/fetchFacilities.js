import * as Sentry from '@sentry/browser';
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
  radius = null,
  page = null,
  perPage = null,
  facilityIds = [],
  type = 'health',
}) => {
  try {
    await ensureValidCSRFToken('fetchFacilities');

    Sentry.withScope(scope => {
      scope.setLevel(Sentry.Severity.Log);
      scope.setExtra('facilityId(s)', facilityIds.join(','));
      Sentry.captureMessage('FetchFacilities facilityIds');
    });

    const { data, meta } = await apiRequest(API_ENDPOINTS.facilities, {
      method: 'POST',
      body: JSON.stringify({
        type,
        lat,
        long,
        radius,
        page,
        perPage,
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
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      scope.setExtra('errors', error.errors);
      Sentry.captureMessage(content['error--facilities-fetch']);
    });

    const errorResponse = error?.errors?.[0];
    if (
      errorResponse?.status === '403' &&
      errorResponse?.detail === 'Invalid Authenticity Token'
    ) {
      Sentry.withScope(scope => {
        scope.setLevel(Sentry.Severity.Log);
        scope.setExtra('status', errorResponse.status);
        scope.setExtra('detail', errorResponse.detail);
        Sentry.captureMessage(
          'Error in fetchFacilities. Clearing csrfToken in localStorage.',
        );
      });
      localStorage.setItem('csrfToken', '');
    }

    return {
      type: 'SEARCH_FAILED',
      errorMessage: 'There was an error fetching the health care facilities.',
    };
  }
};
