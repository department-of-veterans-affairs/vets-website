import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import notes from '../tests/fixtures/notes.json';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';
import vaccines from '../tests/fixtures/vaccines.json';
import allergies from '../tests/fixtures/allergies.json';
import {
  findMatchingCvixReport,
  radiologyRecordHash,
} from '../util/radiologyUtil';
import radiology from '../tests/fixtures/radiologyRecordsMhv.json';
import cvix from '../tests/fixtures/radiologyCvix.json';

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

export const getMhvRadiologyTests = () => {
  return apiRequest(`${apiBasePath}/medical_records/radiology`, {
    headers,
  });
};

/**
 * Get radiology details from the backend. There are no APIs to get a single record by ID, so we
 * need to pull all records and retrieve the right one by ID or hash.
 * @param {*} id
 * @returns an object containing both the PHR and CVIX reports, if they exist
 */
export const getMhvRadiologyDetails = async id => {
  const [numericIdStr, hashId] = id.substring(1).split('-');
  const numericId = +numericIdStr;

  const [phrResponse, cvixResponse] = await Promise.all([
    getMhvRadiologyTests(),
    getImagingStudies(),
  ]);

  // Helper function to find a record first by numeric ID, then by hash
  const findRecordByIdOrHash = async (records, findNumericId, findHashId) => {
    const foundRecord = records.find(r => +r.id === findNumericId);
    if (foundRecord) return foundRecord;

    // If not found by ID, compute hashes and find by hash
    const recordsWithHash = await Promise.all(
      records.map(async r => ({
        ...r,
        hash: await radiologyRecordHash(r),
      })),
    );
    return recordsWithHash.find(r => r.hash === findHashId);
  };

  const phrDetails = await findRecordByIdOrHash(phrResponse, numericId, hashId);

  let cvixDetails;
  if (phrDetails) {
    cvixDetails = findMatchingCvixReport(phrResponse, cvixResponse);
  } else {
    cvixDetails = await findRecordByIdOrHash(cvixResponse, numericId, hashId);
  }

  return { phrDetails, cvixDetails };
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
