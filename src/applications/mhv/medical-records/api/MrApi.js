import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import notes from '../tests/fixtures/notes.json';
import note from '../tests/fixtures/dischargeSummary.json';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';
import { IS_TESTING } from '../util/constants';
import vaccines from '../tests/fixtures/vaccines.json';
import vaccine from '../tests/fixtures/vaccine.json';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
};

const hitApi = runningUnitTest => {
  return (
    (environment.BUILDTYPE === 'localhost' && IS_TESTING) || runningUnitTest
  );
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

export const getNotes = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/clinical_notes`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(notes);
    }, 1000);
  });
};

export const getNote = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/clinical_notes/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(note);
    }, 1000);
  });
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

export const getAllergies = () => {
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
export const getVaccineList = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/vaccines`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccines);
    }, 1000);
  });
};

/**
 * Get details for a single vaccine
 * @param {Long} id
 * @returns vaccine details in FHIR format
 */
export const getVaccine = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/vaccines/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccine);
    }, 1000);
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
