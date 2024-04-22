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
  return apiRequest(`${apiBasePath}/medical_records/clinical_notes`, {
    headers,
  });
};

export const getNote = id => {
  return apiRequest(`${apiBasePath}/medical_records/clinical_notes/${id}`, {
    headers,
  });
};

export const getVitalsList = () => {
  return apiRequest(`${apiBasePath}/medical_records/vitals`, {
    headers,
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
      const condition = conditions.entry.find(entry => entry.id === id);
      resolve(condition);
    }, 1000);
  });
};

export const getAllergies = async () => {
  return apiRequest(`${apiBasePath}/medical_records/allergies`, {
    headers,
  });
};

export const getAllergy = id => {
  return apiRequest(`${apiBasePath}/medical_records/allergies/${id}`, {
    headers,
  });
};

/**
 * Get a patient's vaccines
 * @returns list of patient's vaccines in FHIR format
 */
export const getVaccineList = () => {
  return apiRequest(`${apiBasePath}/medical_records/vaccines`, {
    headers,
  });
};

/**
 * Get details for a single vaccine
 * @param {Long} id
 * @returns vaccine details in FHIR format
 */
export const getVaccine = id => {
  return apiRequest(`${apiBasePath}/medical_records/vaccines/${id}`, {
    headers,
  });
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
