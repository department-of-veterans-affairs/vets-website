import omit from 'platform/utilities/data/omit';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

/**
 * @file Contains configuration and utilities for ArrayBuilder used in the EZR form.
 */

/**
 * Configuration for ArrayBuilder sections (defined by arrayPath) that need flattened or wrapped for V1/V2 compatibility.
 * Maps ArrayBuilder sections and their fields to be flattened or wrapped.
 */
export const ARRAY_BUILDER_CONFIG = {
  spouseInformation: {
    arrayPath: 'spouseInformation',
    enabled: data => {
      const confirmationFlowFeatureEnabled =
        data?.ezrSpouseConfirmationFlowEnabled;
      const confirmationFlowFormEnabled =
        data?.['view:isSpouseConfirmationFlowEnabled'];
      return confirmationFlowFeatureEnabled || confirmationFlowFormEnabled;
    },
    fields: [
      'spouseFullName',
      'spouseSocialSecurityNumber',
      'spouseDateOfBirth',
      'cohabitedLastYear',
      'dateOfMarriage',
      'spousePhone',
      'provideSupportLastYear',
      'sameAddress',
      'spouseAddress',
    ],
  },
  financialInformation: {
    arrayPath: 'financialInformation',
    enabled: data => {
      const providersAndDependentsPrefillFeatureEnabled =
        data?.ezrProvidersAndDependentsPrefillEnabled;
      const providersAndDependentsPrefillFormEnabled =
        data?.['view:isProvidersAndDependentsPrefillEnabled'];
      return (
        providersAndDependentsPrefillFeatureEnabled ||
        providersAndDependentsPrefillFormEnabled
      );
    },
    fields: [
      'view:veteranGrossIncome',
      'view:veteranNetIncome',
      'view:veteranOtherIncome',
      'view:spouseGrossIncome',
      'view:spouseNetIncome',
      'view:spouseOtherIncome',
      'view:deductibleMedicalExpenses',
      'view:deductibleFuneralExpenses',
      'view:deductibleEducationExpenses',
    ],
  },
};

/**
 * Get enabled ArrayBuilder configurations
 * @param {Object} data - Form data object.
 * @param {Object} state - Application state containing feature toggle values from Redux state.
 * @returns {Object} Object containing only enabled configurations.
 */
export function getEnabledConfigs(data = {}, state = { featureToggles: {} }) {
  const featureToggles = toggleValues(state);
  const mergedData = { ...data, ...featureToggles };

  return Object.fromEntries(
    Object.entries(ARRAY_BUILDER_CONFIG).filter(([, config]) => {
      return config.enabled(mergedData);
    }),
  );
}

/**
 * Convert single-item arrays to flat structures.
 *
 * Takes ArrayBuilder array data and unwraps the array to flat structure for submissions.
 *
 * @example
 * // V1 Structure (Expected by existing code)
 * {
 *   "spouseFullName": { "first": "Jane", "last": "Doe" },
 *   "spouseSocialSecurityNumber": "123456789",
 *   "spouseDateOfBirth": "1980-01-01",
 *   "cohabitedLastYear": false
 * }
 *
 * // V2 Structure (What ArrayBuilder creates)
 * {
 *   "spouseInformation": [
 *     {
 *       "spouseFullName": { "first": "Jane", "last": "Doe" },
 *       "spouseSocialSecurityNumber": "123456789",
 *       "spouseDateOfBirth": "1980-01-01",
 *       "cohabitedLastYear": false
 *     }
 *  ]
 * }
 *
 * @param {Object} formData - The form data containing single-item arrays.
 * @returns {Object} Form data with single-item arrays flattened to root level.
 */
export function unwrapSingleItem(formData, state = { featureToggles: {} }) {
  const configs = getEnabledConfigs(formData, state);
  let result = { ...formData };
  Object.values(configs).forEach(config => {
    const { arrayPath } = config;
    const arrayData = formData[arrayPath];
    // Only process if we have an array with data.
    if (Array.isArray(arrayData) && arrayData.length > 0) {
      const firstItem = arrayData[0];
      // Copy each field from array[0] to root level.
      Object.keys(firstItem).forEach(fieldName => {
        const fieldValue = firstItem[fieldName];
        // Handle nested view field structures like 'view:deductibleMedicalExpenses': { deductibleMedicalExpenses: 234 }
        if (
          fieldName.startsWith('view:') &&
          fieldValue &&
          typeof fieldValue === 'object' &&
          !Array.isArray(fieldValue)
        ) {
          // Extract nested values for view fields only
          Object.keys(fieldValue).forEach(nestedKey => {
            result[nestedKey] = fieldValue[nestedKey];
          });
        }
        // Always copy the original field as well
        result[fieldName] = fieldValue;
      });
    }

    // Remove the array from the result to avoid submitting it to the API.
    result = omit(arrayPath, result);
  });
  return result;
}

/**
 * Convert flat structures to single-item arrays.
 *
 * @example
 * // V1 Structure (Used by existing code)
 * {
 *   "spouseFullName": { "first": "Jane", "last": "Doe" },
 *   "spouseSocialSecurityNumber": "123456789",
 *   "spouseDateOfBirth": "1980-01-01",
 *   "cohabitedLastYear": false
 * }
 *
 * // V2 Structure (What ArrayBuilder creates)
 * {
 *   "spouseInformation": [
 *     {
 *       "spouseFullName": { "first": "Jane", "last": "Doe" },
 *       "spouseSocialSecurityNumber": "123456789",
 *       "spouseDateOfBirth": "1980-01-01",
 *       "cohabitedLastYear": false
 *     }
 *   ]
 * }
 *
 * @param {Object} formData - The form data with flat fields.
 * @param {Object} state - Application state containing feature toggle values from Redux state.
 * @returns {Object} Form data with flat fields wrapped in single-item arrays.
 */
export function wrapInSingleArray(formData, state = { featureToggles: {} }) {
  const configs = getEnabledConfigs(formData, state);
  if (!formData || typeof formData !== 'object') {
    return formData;
  }

  const result = { ...formData };

  Object.values(configs).forEach(config => {
    const { arrayPath, fields } = config;
    // Check if any of the flat fields exist in the form data.
    const flatFieldsData = {};
    let hasAnyField = false;

    fields.forEach(fieldName => {
      if (fieldName in formData) {
        flatFieldsData[fieldName] = formData[fieldName];
        hasAnyField = true;
      }
    });

    // If we found flat fields, create the single-item array structure.
    if (hasAnyField) {
      result[arrayPath] = [flatFieldsData];
    }
  });

  return result;
}
