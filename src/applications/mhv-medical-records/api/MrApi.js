import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import notes from '../tests/fixtures/notes.json';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';
import vaccines from '../tests/fixtures/vaccines.json';
import allergies from '../tests/fixtures/allergies.json';
import { radiologyRecordHash } from '../util/helpers';
import radiology from '../tests/fixtures/radiologyRecordsMhv.json';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
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

export const getLabsAndTests = () => {
  return apiRequest(`${apiBasePath}/medical_records/labs_and_tests`, {
    headers,
  });
};

export const getLabOrTest = id => {
  return apiRequest(`${apiBasePath}/medical_records/labs_and_tests/${id}`, {
    headers,
  });
};

export const getMhvRadiologyTests = () => {
  return apiRequest(`${apiBasePath}/medical_records/radiology`, {
    headers,
  });
};

export const getMhvRadiologyDetails = async id => {
  const numericId = +id.substring(1).split('-')[0];
  const response = await getMhvRadiologyTests();
  let details = response.find(record => +record.id === numericId);
  if (!details) {
    // If the underlying radiology ID has changed due to wipe-and-replace, use the hash to compare.
    const hashId = id.split('-')[1];
    details = (await Promise.all(
      response.map(async record => ({
        ...record,
        hash: await radiologyRecordHash(record),
      })),
    )).find(record => record.hash === hashId);
  }
  return details;
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

export const getConditions = async () => {
  return apiRequest(`${apiBasePath}/medical_records/conditions`, {
    headers,
  });
};

export const getCondition = id => {
  return apiRequest(`${apiBasePath}/medical_records/conditions/${id}`, {
    headers,
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

export const getAcceleratedAllergies = async () => {
  return apiRequest(
    `${apiBasePath}/medical_records/allergies?use_oh_data_path=1`,
    {
      headers,
    },
  );
};

export const getAcceleratedAllergy = id => {
  return apiRequest(
    `${apiBasePath}/medical_records/allergies/${id}?use_oh_data_path=1`,
    {
      headers,
    },
  );
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

export const getImagingStudies = () => {
  return apiRequest(`${apiBasePath}/medical_records/imaging`, { headers });
};

export const requestImagingStudy = studyId => {
  return apiRequest(
    `${apiBasePath}/medical_records/imaging/${studyId}/request`,
    { headers },
  );
};

export const getImageList = studyId => {
  return apiRequest(
    `${apiBasePath}/medical_records/imaging/${studyId}/images`,
    { headers },
  );
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
      radiology,
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

export const generateCCD = () => {
  return apiRequest(`${apiBasePath}/medical_records/ccd/generate`, { headers });
};

export const downloadCCD = timestamp => {
  return apiRequest(
    `${apiBasePath}/medical_records/ccd/download?date=${timestamp}`,
    { headers },
  );
};
