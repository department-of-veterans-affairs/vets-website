import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import notes from '../tests/fixtures/notes.json';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';
import { IS_TESTING } from '../util/constants';
import vaccines from '../tests/fixtures/vaccines.json';
import allergies from '../tests/fixtures/allergies.json';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
};

const hitApi = runningUnitTest => {
  return (
    (environment.BUILDTYPE === 'localhost' && IS_TESTING) || runningUnitTest
  );
};

export const createSession = () => {
  return apiRequest(`${apiBasePath}/medical_records/session`, {
    method: 'POST',
    headers,
  });
};

export const getRefreshStatus = () => {
  return apiRequest(`${apiBasePath}/medical_records/session/status`, {
    headers,
  });
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

export const getLabsAndTests = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/labs_and_tests`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(labsAndTests);
    }, 1000);
  });
};

export const getLabOrTest = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/labs_and_tests/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const result = labsAndTests.entry.find(lab => lab.id === id);
      resolve(result);
    }, 1000);
  });
};

export const getNotes = () => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/clinical_notes`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

export const getNote = id => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/clinical_notes/${id}`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

export const getVitalsList = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/vitals`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vitals);
    }, 1000);
  });
};

export const getConditions = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/conditions`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(conditions);
    }, 1000);
  });
};

export const getCondition = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/conditions/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const condition = conditions.find(cond => cond.id === id);
      resolve(condition);
    }, 1000);
  });
};

export const getAllergies = async () => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/allergies`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

export const getAllergy = id => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/allergies/${id}`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

/**
 * Get a patient's vaccines
 * @returns list of patient's vaccines in FHIR format
 */
export const getVaccineList = () => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/vaccines`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

/**
 * Get details for a single vaccine
 * @param {Long} id
 * @returns vaccine details in FHIR format
 */
export const getVaccine = id => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/vaccines/${id}`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

/**
 * Get the VHIE sharing status of the current user.
 *
 * @returns JSON object containing consent_status, either OPT-IN or OPT-OUT
 */
export const getSharingStatus = () => {
  return apiRequest(`${apiBasePath}/health_records/sharing/status`, {
    headers,
  });
};

/**
 * Update the VHIE sharing status
 * @param {Boolean} optIn true to opt-in, false to opt-out
 */
export const postSharingUpdateStatus = (optIn = false) => {
  const endpoint = optIn ? 'optin' : 'optout';
  return apiRequest(`${apiBasePath}/health_records/sharing/${endpoint}`, {
    method: 'POST',
    headers,
  });
};

/**
 * Get all of a patient's medical records for generating a Blue Button report
 * @returns an object with
 * - labsAndTests
 * - careSummariesAndNotes
 * - vaccines
 * - allergies
 * - healthConditions
 * - vitals
 */
export const getDataForBlueButton = () => {
  return new Promise(resolve => {
    const data = {
      labsAndTests,
      careSummariesAndNotes: notes,
      vaccines,
      allergies,
      healthConditions: conditions,
      vitals,
    };
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};
