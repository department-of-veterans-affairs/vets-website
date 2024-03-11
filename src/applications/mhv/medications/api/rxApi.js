import {
  apiRequest,
  environment,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import { INCLUDE_IMAGE_ENDPOINT } from '../util/constants';

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

export const getRefillablePrescriptionList = () => {
  return apiRequest(
    `${apiBasePath}/prescriptions/list_refillable_prescriptions`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const getPrescriptionImage = cmopNdcNumber => {
  return apiRequest(
    `${apiBasePath}/prescriptions/get_prescription_image/${cmopNdcNumber}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const getPrescriptionSortedList = (
  sortEndpoint,
  includeImage = false,
) => {
  return apiRequest(
    `${apiBasePath}/prescriptions?${sortEndpoint}${includeImage &&
      INCLUDE_IMAGE_ENDPOINT}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
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

export const fillRxs = ids => {
  const idParams = ids.map(id => `ids[]=${id}`).join('&');
  const url = `${apiBasePath}/prescriptions/refill_prescriptions?${idParams}`;
  const requestOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return apiRequest(url, requestOptions);
};
