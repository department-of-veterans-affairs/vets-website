import omit from '~/platform/utilities/data/omit';

/**
 * Configuration for ArrayBuilder sections with maxItems: 1
 * Maps ArrayBuilder sections to their flat field equivalents for V1/V2 compatibility
 */
export const ARRAY_BUILDER_CONFIG = {
  spouseInformation: {
    arrayPath: 'spouseInformation',
    enabled: () => true,
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
    enabled: () => true,
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
 * @returns {Object} Object containing only enabled configurations
 */
export function getEnabledConfigs() {
  return Object.fromEntries(
    Object.entries(ARRAY_BUILDER_CONFIG).filter(([, config]) => {
      return config.enabled;
    }),
  );
}

/**
 * Convert single-item arrays to flat structures.
 * Takes ArrayBuilder array data and unwraps the single item to flat structure for submissions.
 * @param {Object} formData - The form data containing single-item arrays.
 * @returns {Object} Form data with single-item arrays flattened to root level.
 */
export function unwrapSingleItem(formData) {
  const configs = getEnabledConfigs();
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
 * Takes V1 flat data and wraps it in ArrayBuilder single-item array structure for prefill.
 * @param {Object} formData - The form data with flat fields.
 * @returns {Object} Form data with flat fields wrapped in single-item arrays.
 */
export function wrapInSingleArray(formData) {
  if (!formData || typeof formData !== 'object') {
    return formData;
  }

  const configs = getEnabledConfigs();
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
