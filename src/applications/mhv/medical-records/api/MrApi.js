import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import vaccines from '../tests/fixtures/vaccines.json';
import vaccine from '../tests/fixtures/vaccine.json';
import notes from '../tests/fixtures/notes.json';
import note from '../tests/fixtures/note.json';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';
import allergies from '../tests/fixtures/allergies.json';
import { Testing } from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
};

export const getLabsAndTests = () => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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

export const getLabOrTest = id => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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

export const getNote = id => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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

export const getVitalsList = () => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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

export const getConditions = () => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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

export const getCondition = id => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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
  if (environment.BUILDTYPE === 'localhost' && Testing) {
    return apiRequest(`${apiBasePath}/medical_records/allergies`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(allergies);
    }, 1000);
  });
};

export const getAllergy = id => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
    return apiRequest(`${apiBasePath}/medical_records/allergies/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const allergy = allergies.entry.find(
        alg => String(alg.resource.id) === String(id),
      );
      resolve(allergy.resource);
    }, 1000);
  });
};

/**
 * Get a patient's vaccines
 * @returns list of patient's vaccines in FHIR format
 */
export const getVaccineList = () => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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
export const getVaccine = id => {
  if (environment.BUILDTYPE === 'localhost' && Testing) {
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
