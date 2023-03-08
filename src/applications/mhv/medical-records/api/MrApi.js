// import environment from 'platform/utilities/environment';
// import { apiRequest } from 'platform/utilities/api';
import vaccines from '../tests/fixtures/vaccines.json';
import vitals from '../tests/fixtures/vitals.json';

// const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const mockGetVaccineList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccines);
    }, 1500);
  });
};

export const mockGetVaccine = id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const vaccine = vaccines.find(vac => +vac.id === +id);
      resolve(vaccine);
    }, 1500);
  });
};

export const mockGetVitalsList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vitals);
    }, 1500);
  });
};

export const mockGetVital = id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const vital = vitals.find(vit => +vit.id === +id);
      resolve(vital);
    }, 1500);
  });
};
