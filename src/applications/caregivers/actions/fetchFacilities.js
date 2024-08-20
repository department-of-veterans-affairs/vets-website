import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import content from '../locales/en/content.json';

export const fetchFacilities = async ({
  lat,
  long,
  radius = 500,
  page = 1,
  perPage = 5,
}) => {
  const lightHouseRequestUrl = `${
    environment.API_URL
  }/v0/health_care_applications/facilities?type=health&lat=${lat}&long=${long}&radius=${radius}&page=${page}&per_page=${perPage}`;

  const fetchRequest = apiRequest(`${lightHouseRequestUrl}`, {});

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
    .catch(({ error }) => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(content['error--facilities-fetch']);
      });

      return {
        type: 'SEARCH_FAILED',
        errorMessage: error,
      };
    });
};
