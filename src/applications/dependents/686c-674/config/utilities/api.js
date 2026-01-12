import { apiRequest } from 'platform/utilities/api';

import { SERVER_ERROR_REGEX, CLIENT_ERROR_REGEX } from '../constants';

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);
export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

/**
 * Get data from API endpoint
 * @param {string} apiRoute - path to api endpoint
 * @param {object} options - apiRequest options
 * @returns {Promise<object>} - API response data attributes or error
 */
export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
}

/**
 * checkAddingDependentsForPension determines if adding dependents outside of 674
 * @param {object} formData - The form data
 * @returns {boolean} - True if adding dependents outside of 674, false otherwise
 */
export const checkAddingDependentsNot674ForPension = (formData = {}) => {
  const addingDependents = formData['view:addOrRemoveDependents']?.add;
  const addDependentOptions = formData['view:addDependentOptions'] || {};
  const isAddingDependentsNot674 = [
    'addChild',
    'addDisabledChild',
    'addSpouse',
  ].some(option => addDependentOptions[option]);
  return addingDependents && isAddingDependentsNot674;
};

/**
 * checkAdding674ForPension determines if adding 674 dependents
 * @param {object} formData - The form data
 * @returns {boolean} - True if adding 674 dependents, false otherwise
 */
export const checkAdding674ForPension = (formData = {}) => {
  const addingDependents = formData['view:addOrRemoveDependents']?.add;
  const addDependentOptions = formData['view:addDependentOptions'] || {};
  return addingDependents && addDependentOptions?.report674;
};

/**
 * showPensionBackupPath determines if the pension related question backup path should be shown
 * @param {object} formData - The form data
 * @returns {boolean} - True if the backup path should be shown, false otherwise
 */
export const showPensionBackupPath = (formData = {}) => {
  // -1 in prefill indicates pension awards API failed
  const { veteranInformation: vi, vaDependentsNetWorthAndPension } = formData;
  return (
    vaDependentsNetWorthAndPension &&
    vi?.isInReceiptOfPension === -1 &&
    (checkAddingDependentsNot674ForPension(formData) ||
      checkAdding674ForPension(formData))
  );
};

/** isVetInReceiptOfPension determines if the veteran is in receipt of pension
 * @param {object} formData - The form data
 * @returns {boolean} - True if in receipt of pension, false otherwise
 */
export const isVetInReceiptOfPension = (formData = {}) => {
  // -1 = pension awards API failed, 1 = in receipt of pension, 0 = not in receipt of pension
  const { veteranInformation: vi } = formData;
  const isInReceiptOfPension = vi?.isInReceiptOfPension === 1;
  const backupPathIsInReceiptOfPension =
    vi?.isInReceiptOfPension === -1 && formData['view:checkVeteranPension'];
  return isInReceiptOfPension || backupPathIsInReceiptOfPension;
};

/**
 * showPensionRelatedQuestions determines if the pension related questions should be shown
 * @param {object} formData - The form data
 * @returns {boolean} - True if the questions should be shown, false otherwise, true if feature flag is off
 */
export const showPensionRelatedQuestions = (formData = {}) => {
  const { vaDependentsNetWorthAndPension } = formData;
  if (vaDependentsNetWorthAndPension) {
    const isInReceiptOfPension = isVetInReceiptOfPension(formData);
    const isAddingDependents = checkAddingDependentsNot674ForPension(formData);
    return isAddingDependents && isInReceiptOfPension;
  }
  // keep current behavior if feature flag is off
  return true;
};

/** show674IncomeQuestions determines if the 674 income questions should be shown
 * @param {object} formData - The form data
 * @returns {boolean} - True if the questions should be shown, false otherwise, true if feature flag is off
 */
export const show674IncomeQuestions = (formData = {}) => {
  const { vaDependentsNetWorthAndPension } = formData;
  if (vaDependentsNetWorthAndPension) {
    const isInReceiptOfPension = isVetInReceiptOfPension(formData);
    const isAdding674 = checkAdding674ForPension(formData);
    return isAdding674 && isInReceiptOfPension;
  }
  // keep current behavior if feature flag is off
  return true;
};

/**
 * shouldShowStudentIncomeQuestions determines if student income questions should be shown based on feature flag
 * @param {object} formData - The form data
 * @param {number} index - The index of the student in the studentInformation array
 * @returns {boolean} - True if the questions should be shown, false otherwise
 */
export const shouldShowStudentIncomeQuestions = ({ formData = {}, index }) => {
  const { vaDependentsNetWorthAndPension, studentInformation } = formData;
  if (vaDependentsNetWorthAndPension) {
    return show674IncomeQuestions(formData);
  }
  return studentInformation?.[index]?.claimsOrReceivesPension;
};
