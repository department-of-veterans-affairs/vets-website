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

let serviceBranches = [];
export const getBranches = () => {
  if (!serviceBranches.length) {
    const storedBranches = JSON.parse(
      window.sessionStorage.getItem(SERVICE_BRANCHES) || '[]',
    );
    serviceBranches = storedBranches;
  }
  return serviceBranches;
};

// set for testing purposes
export const testBranches = () => {
  serviceBranches = processBranches();
};

// for testing purposes
export const clearBranches = () => {
  window.sessionStorage.removeItem(SERVICE_BRANCHES);
  serviceBranches = [];
};

export const fetchBranches = () =>
  apiRequest('/benefits_reference_data/service-branches')
    .then(data => processBranches(data.items?.length ? data.items : branches))
    .catch(() => {
      Sentry.captureMessage('get_military_service_branches_failed');
      // pulled from mock data
      return processBranches();
    });

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

  'air force reserve': () => 'Air Force Reserves',
  'army reserve': () => 'Army Reserves',
  'coast guard reserve': () => 'Coast Guard Reserves',
  'marine corps reserve': () => 'Marine Corps Reserves',
  noaa: () => 'National Oceanic & Atmospheric Administration',
  'navy reserve': () => 'Navy Reserves',
};

// Used by prefill transformer & data migrations
export const migrateBranches = data => {
  let formData = _.clone(data);
  const periods = formData.serviceInformation?.servicePeriods || [];
  if (periods.length) {
    periods.forEach((period, index) => {
      const branch = period.serviceBranch?.trim() || '';
      const newBranch = reMapBranches[branch.toLowerCase()]?.() || branch;
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
