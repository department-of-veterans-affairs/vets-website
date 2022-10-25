import * as Sentry from '@sentry/browser';

import _ from 'platform/utilities/data';
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

const reMapBranches = {
  // Unchanged values
  // 'Air Force': () => 'Air Force',
  // 'Air National Guard': () => 'Air National Guard',
  // 'Army': () => 'Army',
  // 'Army National Guard': () => 'Army National Guard',
  // 'Coast Guard': () => 'Coast Guard',
  // 'Marine Corps': () => 'Marine Corps',
  // 'Navy': () => 'Navy',
  // 'Public Health Service': () => 'Public Health Service',

  'Air Force Reserve': () => 'Air Force Reserves',
  'Army Reserve': () => 'Army Reserves',
  'Coast Guard Reserve': () => 'Coast Guard Reserves',
  'Marine Corps Reserve': () => 'Marine Corps Reserves',
  NOAA: () => 'National Oceanic & Atmospheric Administration',
  'Navy Reserve': () => 'Navy Reserves',
};

// Used by prefill transformer & data migrations
export const migrateBranches = data => {
  let formData = _.clone(data);
  const periods = formData.serviceInformation.servicePeriods || [];
  if (periods.length) {
    periods.forEach((period, index) => {
      const branch = period.serviceBranch?.trim() || '';
      const newBranch = reMapBranches[branch]?.() || branch;
      if (branch !== newBranch) {
        formData = _.set(
          ['serviceInformation', 'servicePeriods', index, 'serviceBranch'],
          newBranch,
          formData,
        );
      }
    });
  }
  return formData;
};
