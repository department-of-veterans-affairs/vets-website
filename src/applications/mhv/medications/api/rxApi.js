import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

export const getPaginatedSortedList = (pageNumber = 1, sortEndpoint = '') => {
  return apiRequest(
    `${apiBasePath}/prescriptions?page=${pageNumber}&per_page=20${sortEndpoint}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const getPrescriptionSortedList = sortEndpoint => {
  return apiRequest(`${apiBasePath}/prescriptions?${sortEndpoint}`, {
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
