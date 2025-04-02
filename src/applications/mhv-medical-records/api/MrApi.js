import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { findMatchingPhrAndCvixStudies } from '../util/radiologyUtil';
import edipiNotFound from '../util/edipiNotFound';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
};

const textHeaders = {
  'Content-Type': 'text/plain',
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

export const getLabsAndTests = async () => {
  return apiRequest(`${apiBasePath}/medical_records/labs_and_tests`, {
    headers,
  });
};

export const getLabOrTest = id => {
  return apiRequest(`${apiBasePath}/medical_records/labs_and_tests/${id}`, {
    headers,
  });
};

/**
 * Pull the list of CVIX radiology reports, to be merged with VIA radiology reports.
 */
export const getImagingStudies = () => {
  return apiRequest(`${apiBasePath}/medical_records/imaging`, { headers });
};

/**
 * Request to download a particular study from CVIX.
 */
export const requestImagingStudy = studyId => {
  return apiRequest(
    `${apiBasePath}/medical_records/imaging/${studyId}/request`,
    { headers },
  );
};

/**
 * Get a list of available images for a given study.
 */
export const getImageList = studyId => {
  return apiRequest(
    `${apiBasePath}/medical_records/imaging/${studyId}/images`,
    { headers },
  );
};

export const getBbmiNotificationStatus = () => {
  return apiRequest(`${apiBasePath}/medical_records/bbmi_notification/status`, {
    headers,
  });
};

export const getMhvRadiologyTests = async () => {
  return apiRequest(`${apiBasePath}/medical_records/radiology`, {
    headers,
  });
};

/**
 * Get radiology details from the backend. There are no APIs to get a single record by ID, so we
 * need to pull all records and retrieve the right one by ID or hash.
 *
 * @param {*} id
 * @returns an object containing both the PHR and CVIX reports, if they exist
 */
export const getMhvRadiologyDetails = async id => {
  const [phrResponse, cvixResponse] = await Promise.all([
    getMhvRadiologyTests(),
    getImagingStudies(),
  ]);
  return findMatchingPhrAndCvixStudies(id, phrResponse, cvixResponse);
};

export const getNotes = async () => {
  return apiRequest(`${apiBasePath}/medical_records/clinical_notes`, {
    headers,
  });
};

export const getNote = id => {
  return apiRequest(`${apiBasePath}/medical_records/clinical_notes/${id}`, {
    headers,
  });
};

export const getVitalsList = async () => {
  return apiRequest(`${apiBasePath}/medical_records/vitals`, {
    headers,
  });
};

export const getAcceleratedVitals = async vitalsDate => {
  const from = `&from=${vitalsDate}`;
  const to = `&to=${vitalsDate}`;
  return apiRequest(
    `${apiBasePath}/medical_records/vitals?use_oh_data_path=1${from}${to}`,
    {
      headers,
    },
  );
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
export const getVaccineList = async () => {
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
 * Get the statuses of all available CVIX studies.
 */
export const getImageRequestStatus = () => {
  return apiRequest(`${apiBasePath}/medical_records/imaging/status`, {
    headers,
  });
};

/**
 * Get a patient's medications
 * @returns list of patient's medications
 */
export const getMedications = async () => {
  return apiRequest(`${apiBasePath}/prescriptions`, {
    headers,
  });
};

/**
 * Get a patient's appointments
 * @returns list of patient's appointments
 */
export const getAppointments = async (fromDate, toDate) => {
  const statusParams =
    '&statuses[]=booked&statuses[]=arrived&statuses[]=fulfilled&statuses[]=cancelled';
  const params = `_include=facilities,clinics&start=${fromDate}&end=${toDate}${statusParams}`;

  return apiRequest(`${environment.API_URL}/vaos/v2/appointments?${params}`, {
    headers,
  });
};

/**
 * Get a patient's demographic info
 * @returns patient's demographic info
 */
export const getDemographicInfo = async () => {
  return apiRequest(`${apiBasePath}/medical_records/patient/demographic`, {
    headers,
  });
};

/**
 * Get a patient's military service info
 * @returns patient's military service info
 */
export const getMilitaryService = async () => {
  try {
    return await apiRequest(`${apiBasePath}/medical_records/military_service`, {
      textHeaders,
    });
  } catch (error) {
    // Handle special case of missing EDIPI
    if (error?.error === 'No EDIPI found for the current user') {
      return edipiNotFound;
    }
    // Rethrow if it’s another error we don’t want to specially handle
    throw error;
  }
};

/**
 * Get a patient's account summary (treatment facilities)
 * @returns patient profile including a list of patient's treatment facilities
 */
export const getPatient = async () => {
  return apiRequest(`${apiBasePath}/medical_records/patient`, {
    headers,
  });
};

export const generateCCD = () => {
  return apiRequest(`${apiBasePath}/medical_records/ccd/generate`, { headers });
};

export const downloadCCD = timestamp => {
  return apiRequest(
    `${apiBasePath}/medical_records/ccd/download?date=${timestamp}`,
    {
      'Content-Type': 'application/xml',
    },
  );
};
