import { get } from 'lodash';

/**
 * Get data from a path in the form data, using lodash get.
 * Defaulting to null if the path is not found.
 *
 * @param {Object} formData - The form data object
 * @param {string} path - The path to the desired data
 * @returns {* | null} The value at the specified path or null
 */
export const getDataFromPath = (formData, path) => {
  if (!path) return null;
  return get(formData, path, null);
};

/**
 * Adapt the form data to the standard format for PersonalInformation component.
 * This way formData can have any structure,
 * but the component will only need to know about the paths to the specific data it needs.
 *
 * @param {Object} formData - The form data object
 * @param {Object} adapter - The data adapter configuration
 * @param {string} adapter.ssnPath - The path to the SSN in the form data
 * @param {string} adapter.vaFileNumberPath - The path to the VA file number in the form data
 * @returns {Object} Adapted data in format for PersonalInformation component usage
 *
 * @example
 * const formData = {
 *   veteran: {
 *     ssnNested: '7890',
 *     vaFileNumberNested: '8901'
 *   }
 * };
 * const adapter = { ssnPath: 'veteran.ssnNested', vaFileNumberPath: 'veteran.vaFileNumberNested' };
 * adaptFormData(formData, adapter); // returns { ssnLastFour: '7890', vaFileLastFour: '8901' }
 */
export const adaptFormData = (formData, adapter = {}) => {
  const defaultAdapter = {
    ssnPath: 'ssn',
    vaFileNumberPath: 'vaFileNumber',
  };
  const adaptedAdapter = { ...defaultAdapter, ...adapter };
  return {
    ssn: getDataFromPath(formData, adaptedAdapter.ssnPath),
    vaFileLastFour: getDataFromPath(formData, adaptedAdapter.vaFileNumberPath),
  };
};
