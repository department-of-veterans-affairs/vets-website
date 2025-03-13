import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { ensureValidCSRFToken } from './ensureValidCSRFToken';
import content from '../locales/en/content.json';

const formatAddress = (address = {}) => {
  const joinAddressParts = (...parts) => {
    const [city, state, zip] = parts;
    const stateZip = state && zip ? `${state} ${zip}` : state || zip;
    return [city, stateZip].filter(Boolean).join(', ');
  };

  return {
    address1: address?.address1 || '',
    address2: [address?.address2, address?.address3].filter(Boolean).join(', '),
    address3: joinAddressParts(address?.city, address?.state, address?.zip),
  };
};

const formatFacilityIds = facilityIds => {
  let facilityIdList = '';
  if (facilityIds.length > 0) {
    facilityIdList = `${facilityIds.join(',')}`;
  }

  return facilityIdList;
};

export const fetchFacilities = async ({
  lat = null,
  long = null,
  radius = null,
  page = null,
  perPage = null,
  facilityIds = [],
  type = 'health',
}) => {
  await ensureValidCSRFToken('fetchFacilities');

  const url = `${
    environment.API_URL
  }/v0/caregivers_assistance_claims/facilities`;

  const body = {
    type,
    lat,
    long,
    radius,
    page,
    perPage,
    facilityIds: formatFacilityIds(facilityIds),
  };

  const fetchRequest = apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  Sentry.withScope(scope => {
    scope.setLevel(Sentry.Severity.Log);
    scope.setExtra('facilityId(s)', formatFacilityIds(facilityIds));
    Sentry.captureMessage('FetchFacilities facilityIds');
  });

  return fetchRequest
    .then(response => {
      if (!response?.data?.length) {
        return {
          type: 'NO_SEARCH_RESULTS',
          errorMessage: content['error--no-results-found'],
        };
      }
      const facilities = response.data.map(facility => {
        const attributes = facility?.attributes;

        // Return a new facility object with the updated address
        return {
          ...attributes,
          id: facility.id,
          address: {
            physical: formatAddress(attributes?.address?.physical ?? {}),
          },
        };
      });

      return {
        facilities,
        meta: response.meta,
      };
    })
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error.errors);
        Sentry.captureMessage(content['error--facilities-fetch']);
      });

      const errorResponse = error?.errors?.[0];

      if (
        errorResponse?.status === '403' &&
        errorResponse?.detail === 'Invalid Authenticity Token'
      ) {
        Sentry.withScope(scope => {
          scope.setLevel(Sentry.Severity.Log);
          scope.setExtra('status', errorResponse?.status);
          scope.setExtra('detail', errorResponse?.detail);
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
    });
};
