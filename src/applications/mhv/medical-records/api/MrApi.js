// import environment from 'platform/utilities/environment';
// import { apiRequest } from 'platform/utilities/api';
import vaccines from '../tests/fixtures/vaccines.json';
import vitals from '../tests/fixtures/vitals.json';

// const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const mockGetVaccineList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccines);
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
    }, 1500);
  });
};
