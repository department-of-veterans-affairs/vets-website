/**
 * @fileoverview This module provides functionality to retrieve GMT (Geographical Mean Test) thresholds.
 * It supports fetching data from production, staging, or using mock data based on configuration toggles.
 */

import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

// Constants used for calculating thresholds
const INCOME_UPPER_PERCENTAGE = 1.5;
const ASSET_PERCENTAGE = 0.065;
const DISCRETIONARY_INCOME_PERCENTAGE = 0.0125;

// Manually toggle this to true for using mock data in local environment
const DETECT_LOCALHOST = environment.isLocalhost();
// Manually set to true to use mock data in a local environment. Ensure this is false in commits.
const USE_MOCK_DATA = false;
// Manually set to true to use staging data in a local environment. Ensure this is false in commits.
const USE_STAGING_DATA = false;
// Mock GMT value for testing
const MOCK_GMT_VALUE = 78300; // change value to test different scenarios

/**
 * Helper calculates and returns the income upper threshold, asset threshold, and discretionary income threshold
 * based on the given GMT value.
 *
 * @param {number} gmtValue - The GMT (Geographical Mean Test) value used for calculations.
 * @returns {Object} An object containing calculated thresholds.
 */
const calculateThresholds = gmtValue => ({
  incomeUpperThreshold: gmtValue * INCOME_UPPER_PERCENTAGE,
  assetThreshold: gmtValue * ASSET_PERCENTAGE,
  discretionaryIncomeThreshold: gmtValue * DISCRETIONARY_INCOME_PERCENTAGE,
});

/**
 * Retrieves GMT thresholds data. Depending on configuration, it either fetches data from an API,
 * uses staging data, or returns mock data.
 *
 * @param {number} dependents - The number of dependents.
 * @param {number} year - The year for which data is being requested.
 * @param {string} zipCode - The ZIP code for which data is being requested.
 * @returns {Promise<Object>} A promise resolving to the GMT thresholds data.
 */

export const getGMT = (dependents, year, zipCode) => {
  let requestUrl;

  if (DETECT_LOCALHOST && USE_MOCK_DATA) {
    const thresholds = calculateThresholds(MOCK_GMT_VALUE);
    return Promise.resolve({
      gmtThreshold: MOCK_GMT_VALUE,
      error: null,
      ...thresholds,
    });
  }
  if (DETECT_LOCALHOST && USE_STAGING_DATA && !USE_MOCK_DATA) {
    requestUrl = `https://staging-api.va.gov/income_limits/v1/limitsByZipCode/${zipCode}/${year}/${dependents}`;
  } else {
    requestUrl = `${
      environment.API_URL
    }/income_limits/v1/limitsByZipCode/${zipCode}/${year}/${dependents}`;
  }

  return apiRequest(requestUrl)
    .then(({ data }) => {
      if (typeof data.gmtThreshold !== 'number') {
        throw new Error('GMT threshold is not a number');
      }
      return {
        ...data,
        ...calculateThresholds(data.gmtThreshold),
        error: null,
      };
    })
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`income_limits failed: ${error}`);
      });
      return { gmtThreshold: null, error };
    });
};
