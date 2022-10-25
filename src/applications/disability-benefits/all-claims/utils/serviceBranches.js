import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';

import branches from '../tests/fixtures/mocks/service-branches.json';
import { SERVICE_BRANCHES } from '../constants';

export const processBranches = (data = branches) => {
  const result = data.map(item => item.description).sort();
  window.sessionStorage.setItem(SERVICE_BRANCHES, JSON.stringify(result));
  return result;
};

export const fetchBranches = () => {
  return apiRequest('/benefits_reference_data/service-branches')
    .then(data => {
      return processBranches(data.items?.length ? data.items : branches);
    })
    .catch(() => {
      Sentry.captureMessage('get_military_service_branches_failed');
      // pulled from mock data
      return processBranches();
    });
};
