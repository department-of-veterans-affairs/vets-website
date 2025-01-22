import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import content from '../locales/en/content.json';

const formatAddress = address => {
  const joinAddressParts = (...parts) => {
    const [city, state, zip] = parts;
    const stateZip = state && zip ? `${state} ${zip}` : state || zip;
    return [city, stateZip].filter(Boolean).join(', ');
  };

  return {
    address1: address.address1,
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

const fetchNewCSRFToken = async () => {
  const message = 'No csrfToken when making fetchFacilities.';
  const url = '/v0/maintenance_windows';
  Sentry.captureMessage(`${message} Calling ${url} to generate new one.`);

  apiRequest(`${environment.API_URL}/v0/maintenance_windows`)
    .then(() => {
      Sentry.captureMessage(
        `${message} ${url} successfully called to generate token.`,
      );
    })
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(
          `${message} ${url} failed when called to generate token.`,
        );
      });
    });
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
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) {
    await fetchNewCSRFToken();
  }

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
            physical: formatAddress(attributes?.address.physical),
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
        scope.setExtra('error', error);
        Sentry.captureMessage(content['error--facilities-fetch']);
      });

      return {
        type: 'SEARCH_FAILED',
        errorMessage: 'There was an error fetching the health care facilities.',
      };
    });
};
