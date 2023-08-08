import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const getPrescriptionList = () => {
  return apiRequest(`${apiBasePath}/prescriptions?page=1&per_page=999`, {
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

export const fillRx = id => {
  return apiRequest(`${apiBasePath}/prescriptions/${id}/refill`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
