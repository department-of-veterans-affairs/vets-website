import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import { tooltipNames } from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;
const headers = {
  'Content-Type': 'application/json',
};

/**
 * Helper function to create headers with x-key-inflection
 */
const getHeadersWithInflection = () => {
  return {
    ...headers,
    'X-Key-Inflection': 'camel', // Add the custom header key for tooltips
  };
};

/**
 * Helper function to create a delay
 */
const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Testable implementation.
 * @see {@link apiRequestWithRetry} for more information
 * @param {*} retryInterval how long to wait between requests
 * @param {*} apiRequestFunc the API function to call; can be mocked for tests
 * @returns
 */
export const testableApiRequestWithRetry = (
  retryInterval,
  apiRequestFunc,
) => async (path, options, endTime) => {
  if (Date.now() >= endTime) {
    throw new Error('Timed out while waiting for response');
  }

  const response = await apiRequestFunc(path, options);

  // Check if the status code is 202 and if the retry time limit has not been reached
  if (response?.status === 202 && Date.now() < endTime) {
    await delay(retryInterval);
    return testableApiRequestWithRetry(retryInterval, apiRequestFunc)(
      path,
      options,
      endTime,
    );
  }

  return response;
};

/**
 * Gets all tooltips
 */
export const getTooltipsList = async () => {
  return apiRequest(`${apiBasePath}/tooltips`, {
    headers: getHeadersWithInflection(),
  });
};

/**
 * Updates hidden value of tooltip
 */
export const apiHideTooltip = async tooltipId => {
  return apiRequest(`${apiBasePath}/tooltips/${tooltipId}`, {
    method: 'PATCH',
    headers: getHeadersWithInflection(),
    body: JSON.stringify({
      tooltip: {
        hidden: true,
      },
    }),
  });
};

/**
 * Creates a new tooltip
 */
export const createTooltip = async () => {
  return apiRequest(`${apiBasePath}/tooltips`, {
    method: 'POST',
    headers: getHeadersWithInflection(),
    body: JSON.stringify({
      tooltip: {
        tooltipName: tooltipNames.mhvMedicationsTooltipFilterAccordion,
        hidden: false,
      },
    }),
  });
};

/**
 * Call to increment the tooltip counter.
 * Note if session is not unique the counter will not be incremented.
 * This logic is handled by the api.
 */
export const incrementTooltipCounter = async tooltipId => {
  return apiRequest(
    `${apiBasePath}/tooltips/${tooltipId}?increment_counter=true`,
    {
      method: 'PATCH',
      headers: getHeadersWithInflection(),
    },
  );
};

/**
 * Posts an activity log when user lands medications details page
 */
export const landMedicationDetailsAal = prescription => {
  return apiRequest(`${apiBasePath}/aal`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      aal: {
        activityType: 'RxRefill',
        action: 'View Medication Detail Page',
        detailValue: `RX #: ${prescription.prescriptionNumber} RX Name: ${
          prescription.prescriptionName
        }`,
        performerType: 'Self',
        status: '1',
      },
      product: 'rx',
      oncePerSession: true,
    }),
  });
};
