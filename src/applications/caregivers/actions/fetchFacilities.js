import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import content from '../locales/en/content.json';

const joinAddressParts = (...parts) => {
  return parts.filter(part => part != null).join(', ');
};

const formatQueryParams = ({
  lat,
  long,
  radius,
  page,
  perPage,
  facilityIds,
}) => {
  const formatFacilityIdParams = () => {
    let facilityIdParams = '';
    if (facilityIds.length > 0) {
      facilityIdParams = `facilityIds=${facilityIds.join(',')}`;
    }

    return facilityIdParams;
  };

  const params = [
    lat ? `lat=${lat}` : null,
    long ? `long=${long}` : null,
    radius ? `radius=${radius}` : null,
    page ? `page=${page}` : null,
    perPage ? `per_page=${perPage}` : null,
    formatFacilityIdParams() || null,
  ];

  let filteredParams = params.filter(Boolean);
  if (filteredParams.length > 0) {
    filteredParams = `&${filteredParams.join('&')}`;
  }

  return filteredParams;
};

export const fetchFacilities = async ({
  lat = null,
  long = null,
  radius = null,
  page = null,
  perPage = null,
  facilityIds = [],
}) => {
  const baseUrl = `${
    environment.API_URL
  }/v0/caregivers_assistance_claims/facilities?type=health`;

  const queryParams = formatQueryParams({
    lat,
    long,
    radius,
    page,
    perPage,
    facilityIds,
  });

  const requestUrl = `${baseUrl}${queryParams}`;
  const fetchRequest = apiRequest(requestUrl);

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
        const { physical } = attributes?.address;

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
          ...attributes,
          id: facility.id,
          address: {
            physical: newPhysicalAddress,
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
