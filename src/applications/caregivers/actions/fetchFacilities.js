import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import content from '../locales/en/content.json';

export const fetchFacilities = async (mapBoxResponse, request = null) => {
  if (mapBoxResponse?.errorMessage) {
    return mapBoxResponse.errorMessage;
  }

  // Increase the area of the boundary to improve search results
  const adjustedBoundaryCoordinates = [
    // min X
    mapBoxResponse[0] - 0.3,
    // min Y
    mapBoxResponse[1] - 0.3,
    // max X
    mapBoxResponse[2] + 0.3,
    // max Y
    mapBoxResponse[3] + 0.3,
  ];

  const lightHouseRequestUrl = `${
    environment.API_URL
  }/v1/facilities/va?bbox%5B%5D=${adjustedBoundaryCoordinates[0]}%2C%20${
    adjustedBoundaryCoordinates[1]
  }%2C%20${adjustedBoundaryCoordinates[2]}%2C%20${
    adjustedBoundaryCoordinates[3]
  }&per_page=500`;

  const fetchRequest = request || apiRequest(`${lightHouseRequestUrl}`, {});

  // Helper function to join address parts, filtering out null or undefined values
  const joinAddressParts = (...parts) => {
    return parts.filter(part => part !== null).join(', ');
  };

  return fetchRequest
    .then(({ data }) => {
      return data.map(facility => {
        const { physical } = facility.attributes.address;

        // Create a new address object without modifying the original facility
        const newPhysicalAddress = {
          address1: physical.address1,
          address2: joinAddressParts(physical.address2, physical.address3),
          address3: joinAddressParts(
            physical.city,
            physical.state,
            physical.zip,
          ),
        };

        // Return a new facility object with the updated address
        return {
          ...facility,
          attributes: {
            ...facility.attributes,
            address: {
              ...facility.attributes.address,
              physical: newPhysicalAddress,
            },
          },
        };
      });
    })
    .catch(({ errors }) => {
      const messages = errors.map(err => err.detail || err.title);

      Sentry.withScope(scope => {
        scope.setExtra('error', messages);
        Sentry.captureMessage(content['error--facilities-fetch']);
      });

      return {
        type: 'SEARCH_FAILED',
        errorMessage: messages,
      };
    });
};
