// import environment from 'platform/utilities/environment';
// import { apiRequest } from 'platform/utilities/api';
import vaccines from '../tests/fixtures/vaccines.json';

// const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const mockGetVaccineList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccines);
    }, 1500);
  });
};
