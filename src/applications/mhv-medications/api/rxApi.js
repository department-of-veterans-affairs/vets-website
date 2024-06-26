import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import { INCLUDE_IMAGE_ENDPOINT } from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;
const headers = {
  'Content-Type': 'application/json',
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
 * Recursive function that will continue polling the provided API endpoint if it sends a 404 response.
 * At this time, we will only get a 404 if the patient record has not yet been created.
 * @param {String} path the API endpoint
 * @param {Object} options headers, method, etc.
 * @param {number} endTime the cutoff time to stop polling the path and simply return the error
 * @returns
 */
const apiRequestWithRetry = async (path, options, endTime) => {
  return testableApiRequestWithRetry(2000, apiRequest)(path, options, endTime);
};

export const getAllergies = async () => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/allergies`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

export const getDocumentation = (id, ndcNumber) => {
  return apiRequest(
    `${apiBasePath}/prescriptions/${id}/documentation?ndc=${ndcNumber}`,
    {
      method: 'GET',
      headers,
    },
  );
};

export const getPaginatedSortedList = (pageNumber = 1, sortEndpoint = '') => {
  return apiRequest(
    `${apiBasePath}/prescriptions?page=${pageNumber}&per_page=20${sortEndpoint}`,
    { headers },
  );
};

export const getRefillablePrescriptionList = () => {
  return apiRequest(
    `${apiBasePath}/prescriptions/list_refillable_prescriptions`,
    { headers },
  );
};

export const getPrescriptionImage = cmopNdcNumber => {
  return apiRequest(
    `${apiBasePath}/prescriptions/get_prescription_image/${cmopNdcNumber}`,
    { headers },
  );
};

export const getPrescriptionSortedList = (
  sortEndpoint,
  includeImage = false,
) => {
  return apiRequest(
    `${apiBasePath}/prescriptions?${sortEndpoint}${
      includeImage ? INCLUDE_IMAGE_ENDPOINT : ''
    }`,
    { headers },
  );
};

export const getPrescription = id => {
  return apiRequest(`${apiBasePath}/prescriptions/${id}`, { headers });
};

export const fillRx = id => {
  return apiRequest(`${apiBasePath}/prescriptions/${id}/refill`, {
    method: 'PATCH',
    headers,
  });
};

export const fillRxs = ids => {
  const idParams = ids.map(id => `ids[]=${id}`).join('&');
  const url = `${apiBasePath}/prescriptions/refill_prescriptions?${idParams}`;
  const requestOptions = {
    method: 'PATCH',
    headers,
  };
  return apiRequest(url, requestOptions);
};
