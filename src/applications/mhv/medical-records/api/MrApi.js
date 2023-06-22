import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import careSummariesAndNotes from '../tests/fixtures/careSummariesAndNotes.json';
import vaccines from '../tests/fixtures/vaccines.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';
import allergies from '../tests/fixtures/allergies.json';
import { testing } from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const getLabsAndTests = () => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(
      // `${apiBasePath}/medical_records/labs_and_tests?patient_id=258974`, // labs (chem/hem)
      // `${apiBasePath}/medical_records/labs_and_tests?patient_id=1865867`, // micro
      // `${apiBasePath}/medical_records/labs_and_tests?patient_id=1861684`, // micro
      `${apiBasePath}/medical_records/labs_and_tests?patient_id=646151`, // micro
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(labsAndTests);
    }, 1000);
  });
};

export const getLabOrTest = id => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(`${apiBasePath}/medical_records/labs_and_tests/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const result = labsAndTests.find(lab => +lab.id === +id);
      resolve(result);
    }, 1000);
  });
};

export const getNotes = () => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(
      `${apiBasePath}/medical_records/clinical_notes?patient_id=1174378`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(careSummariesAndNotes);
    }, 1000);
  });
};

export const getNote = id => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(`${apiBasePath}/medical_records/clinical_notes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const summary = careSummariesAndNotes.find(sum => +sum.id === +id);
      resolve(summary);
    }, 1000);
  });
};

export const mockGetVitalsList = () => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(
      `${apiBasePath}/medical_records/vitals?patient_id=30163`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
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
      const condition = conditions.find(cond => cond.id === id);
      resolve(condition);
    }, 1000);
  });
};

export const getAllergies = () => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(
      `${apiBasePath}/medical_records/allergies?patient_id=30163`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(allergies);
    }, 1000);
  });
};

export const getAllergy = id => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(`${apiBasePath}/medical_records/allergies/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const allergy = allergies.find(alg => +alg.id === +id);
      resolve(allergy);
    }, 1000);
  });
};

/**
 * Get a patient's vaccines
 * @returns list of patient's vaccines in FHIR format
 */
export const getVaccineList = () => {
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(
      // Temporarily hard-coding a patient ID for development.
      `${apiBasePath}/medical_records/vaccines?patient_id=49006`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
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
  if (environment.BUILDTYPE === 'localhost' && testing) {
    return apiRequest(`${apiBasePath}/medical_records/vaccines/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const vaccine = vaccines.find(vac => +vac.id === +id);
      resolve(vaccine);
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
