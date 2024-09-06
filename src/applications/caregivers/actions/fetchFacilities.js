import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import content from '../locales/en/content.json';

export const fetchFacilities = async ({
  lat = null,
  long = null,
  radius = null,
  page = null,
  perPage = null,
  facilityIds = [],
}) => {
  let facilityIdParams = '';
  if (facilityIds.length > 0) {
    facilityIdParams = facilityIds.map(id => `facilityIds[]=${id}`);
    facilityIdParams = `${facilityIdParams.join('&')}`;
  }

  const queryParams = [
    lat ? `lat=${lat}` : null,
    long ? `long=${long}` : null,
    radius ? `radius=${radius}` : null,
    page ? `page=${page}` : null,
    perPage ? `per_page=${perPage}` : null,
    facilityIdParams || null,
  ];

  let filteredParams = queryParams.filter(Boolean);
  if (filteredParams.length > 0) {
    filteredParams = `&${filteredParams.join('&')}`;
  }

  const baseUrl = `${
    environment.API_URL
  }/v0/health_care_applications/facilities?type=health`;

  const requestUrl = `${baseUrl}${filteredParams}`;
  const fetchRequest = apiRequest(requestUrl);

  // Helper function to join address parts, filtering out null or undefined values
  const joinAddressParts = (...parts) => {
    return parts.filter(part => part != null).join(', ');
  };

  return fetchRequest
    .then(response => {
      return response.map(facility => {
        const { physical } = facility?.address;

        // Create a new address object without modifying the original facility
        const newPhysicalAddress = {
          address1: physical.address1,
          address2: joinAddressParts(physical?.address2, physical?.address3),
          address3: joinAddressParts(
            physical.city,
            physical.state,
            physical.zip,
          ),
        };

        // Return a new facility object with the updated address
        return {
          ...facility,
          address: {
            physical: newPhysicalAddress,
          },
        };
      });
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
