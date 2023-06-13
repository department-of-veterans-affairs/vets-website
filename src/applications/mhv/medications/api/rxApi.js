import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import prescriptions from '../tests/fixtures/presciptions.json';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const getPrescriptionList = () => {
  return apiRequest(`${apiBasePath}/prescriptions?page=1&per_page=10`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getPrescription = id => {
  return apiRequest(`${apiBasePath}/prescriptions/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const mockGetPrescriptionList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(prescriptions);
    }, 1000);
  });
};

export const mockGetPrescription = id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const prescription = prescriptions.find(rx => rx.id === +id);
      resolve(prescription);
    }, 1000);
  });
};
