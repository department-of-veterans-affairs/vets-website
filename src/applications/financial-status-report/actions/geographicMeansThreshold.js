/**
 * @fileoverview This module provides functionality to retrieve GMT (Geographical Mean Test) thresholds.
 * It supports fetching data from production, staging, or using mock data based on configuration toggles.
 */

import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import {
  GMT_FETCH_INITIATED,
  GMT_FETCH_SUCCESS,
  GMT_FETCH_FAILURE,
} from '../constants/actionTypes';

// Constants used for calculating thresholds
const INCOME_UPPER_PERCENTAGE = 1.5;
const ASSET_PERCENTAGE = 0.065;
const DISCRETIONARY_INCOME_PERCENTAGE = 0.0125;

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
 * @param {Object} config - Configuration object for testing purposes.
 * @returns {Promise<Object>} A promise resolving to the GMT thresholds data.
 */
export const getGMT = (dependents, year, zipCode, config = {}) => dispatch => {
  const {
    detectLocalhost = environment.isLocalhost(),
    useMockData = false,
    useStagingData = false,
    mockGmtValue = 76750, // Default mock value
  } = config;

  dispatch({ type: GMT_FETCH_INITIATED });

  let requestUrl;

  if (detectLocalhost && useMockData) {
    const thresholds = calculateThresholds(mockGmtValue);
    return Promise.resolve({
      gmtThreshold: mockGmtValue,
      error: null,
      ...thresholds,
    });
  }
  if (detectLocalhost && useStagingData) {
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

      const result = {
        ...data,
        ...calculateThresholds(data.gmtThreshold),
        error: null,
      };

      dispatch({ type: GMT_FETCH_SUCCESS, payload: result });
      return result;
    })
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`income_limits failed: ${error}`);
      });
      dispatch({ type: GMT_FETCH_FAILURE, error });
      return { gmtThreshold: null, error };
    });
};
