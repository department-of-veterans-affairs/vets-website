import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import careSummariesAndNotes from '../tests/fixtures/careSummariesAndNotes.json';
import vaccines from '../tests/fixtures/vaccines.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const mockGetLabsAndTestsList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(labsAndTests);
    }, 1000);
  });
};

export const mockGetVaccinesList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccines);
    }, 1000);
  });
};

export const mockGetCareSummariesAndNotesList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(careSummariesAndNotes);
    }, 1000);
  });
};

export const mockGetVaccine = id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const vaccine = vaccines.find(vac => +vac.id === +id);
      resolve(vaccine);
    }, 1000);
  });
};

export const mockGetVitalsList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vitals);
    }, 1000);
  });
};

export const mockGetConditionsList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(conditions);
    }, 1000);
  });
};

export const mockGetCondition = id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const condition = conditions.find(cond => +cond.id === +id);
      resolve(condition);
    }, 1000);
  });
};

/**
 * Get a pdf of a single vaccine
 * @param {Long} folderId
 * @returns json with base64 of a pdf
 */
export const getVaccinePdf = id => {
  return apiRequest(`${apiBasePath}/medical_records/vaccines/pdf?id=${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get a pdf of a list of all vaccines
 * @returns json with base64 of a pdf
 */
export const getAllVaccinesPdf = () => {
  return apiRequest(`${apiBasePath}/medical_records/vaccines/pdf`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
