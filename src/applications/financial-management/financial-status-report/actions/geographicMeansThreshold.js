/**
 * This module provides functionality to retrieve GMT (Geographical Mean Test) thresholds.
 * It supports fetching data from production, staging, or using mock data based on configuration toggles.
 *
 * @module geographicMeanTest
 */

import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import {
  USE_GEOGRAPHIC_MOCK_DATA,
  MOCK_GMT_VALUE,
  USE_STAGING_DATA,
} from '../mocks/development';

// Constants used for calculating thresholds
import {
  INCOME_UPPER_PERCENTAGE,
  ASSET_PERCENTAGE,
  DISCRETIONARY_INCOME_PERCENTAGE,
} from '../constants/gmtCalculationTypes';

const isLocalhost = environment.isLocalhost();

// only to be updated when downstream services are updated
//  check with sitewide-public-websites to confirm income_limits also contains
//  data for the new year from VES
// Docs for our updates:
//   https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/benefits-memorials-2/engineering/front-end/features/gmt-yearly-update.md
const GMT_YEAR = 2025;

/**
 * Helper calculates and returns the income upper threshold, asset threshold, and discretionary income threshold
 * based on the given GMT value.
 *
 * @param {number} gmtValue - The GMT (Geographical Mean Test) value used for calculations.
 * @returns {Object} An object containing calculated thresholds.
 */

const calculateThresholds = gmtValue => {
  const incomeUpperThreshold = gmtValue * INCOME_UPPER_PERCENTAGE;
  const assetThreshold = gmtValue * ASSET_PERCENTAGE;
  const discretionaryIncomeThreshold =
    gmtValue * DISCRETIONARY_INCOME_PERCENTAGE;

  return {
    incomeUpperThreshold,
    assetThreshold,
    discretionaryIncomeThreshold,
  };
};

/**
 * Determines the appropriate data source based on configuration settings and environment.
 * Leverages GMT_YEAR constant for the year of the data being requested.
 *
 * @param {number} dependents - The number of dependents.
 * @param {string} zipCode - The ZIP code for which data is being requested.
 * @returns {string} The URL of the data source.
 */

const getDataUrl = (dependents, zipCode) => {
  if (isLocalhost && USE_GEOGRAPHIC_MOCK_DATA) {
    return null; // Return mock data directly
  }

  if (isLocalhost && USE_STAGING_DATA) {
    return `https://staging-api.va.gov/income_limits/v1/limitsByZipCode/${zipCode}/${GMT_YEAR}/${dependents}`;
  }

  return `${
    environment.API_URL
  }/income_limits/v1/limitsByZipCode/${zipCode}/${GMT_YEAR}/${dependents}`;
};

/**
 * Retrieves GMT thresholds data. Depending on configuration, it either fetches data from an API,
 * uses staging data, or returns mock data (if enabled).
 *
 * @param {number} dependents - The number of dependents.
 * @param {string} zipCode - The ZIP code for which data is being requested.
 * @returns {Promise<Object>} A promise resolving to the GMT thresholds data or error object.
 */
export const getGMT = async (dependents, zipCode) => {
  const dataUrl = getDataUrl(dependents, zipCode);

  if (dataUrl === null && isLocalhost) {
    // Mock data scenario
    return Promise.resolve({
      gmtThreshold: MOCK_GMT_VALUE,
      error: null,
      ...calculateThresholds(MOCK_GMT_VALUE),
    });
  }

  try {
    const { data } = await apiRequest(dataUrl);

    if (typeof data.gmtThreshold !== 'number') {
      throw new Error('GMT threshold is not a number');
    }

    return {
      ...data,
      ...calculateThresholds(data.gmtThreshold),
      error: null,
    };
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`income_limits failed: ${error}`);
    });

    return { gmtThreshold: null, error };
  }
};
