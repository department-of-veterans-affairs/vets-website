import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';

export const fetchFacilities = async (mapBoxResponse, request = null) => {
  if (mapBoxResponse?.errorMessage) {
    return mapBoxResponse.errorMessage;
  }
  // Increase the area of the boundary to improve search results
  const adjustedBoundaryCoordinates = [
    // min X
    mapBoxResponse[0] - 2,
    // min Y
    mapBoxResponse[1] - 2,
    // max X
    mapBoxResponse[2] + 2,
    // max Y
    mapBoxResponse[3] + 2,
  ];

  const lightHouseRequestUrl = `${
    environment.API_URL
  }/v1/facilities/va?bbox%5B%5D=${adjustedBoundaryCoordinates[0]}%2C%20${
    adjustedBoundaryCoordinates[1]
  }%2C%20${adjustedBoundaryCoordinates[2]}%2C%20${
    adjustedBoundaryCoordinates[3]
  }&per_page=500`;

  // eslint-disable-next-line no-param-reassign
  request = request || apiRequest(`${lightHouseRequestUrl}`, {});

  return request
    .then(response => {
      return response.data.map(facility => {
        const { physical } = facility.attributes.address;

        // Update the physical address object to make it more digestible in the components
        // eslint-disable-next-line no-param-reassign
        facility.attributes.address.physical = {
          address1: physical.address1,
          address2: physical.address3
            ? `${physical.address2}, ${physical.address3}`
            : physical.address2,
          address3: `${physical.city}, ${physical.state} ${physical.zip}`,
        };

        return {
          ...facility,
        };
      });
    })
    .catch(error => {
      const errors = error.errors.map(err => {
        return err.detail ? err.detail : err.title;
      });

      Sentry.withScope(scope => {
        scope.setExtra('error', errors);
        Sentry.captureMessage('Error fetching Lighthouse VA facilities');
      });

      return {
        type: 'SEARCH_FAILED',
        errorMessage: errors,
      };
    });
};
