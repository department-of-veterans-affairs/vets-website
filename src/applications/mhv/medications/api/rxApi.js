import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';

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
