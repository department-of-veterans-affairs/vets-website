/**
 * @module utils/nameHelpers
 * @description Helper functions for retrieving names from form data
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

/**
 * Helper function to get claimant's name from form data
 * @param {Object} formData - The form data
 * @param {string} [fallback='the claimant'] - Default text when name is not available
 * @returns {string} The claimant's name or fallback text
 */
export const getClaimantName = (formData, fallback = 'the claimant') => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return fallback;
  }

  const firstName =
    formData?.claimantInformation?.claimantFullName?.first || '';
  const lastName = formData?.claimantInformation?.claimantFullName?.last || '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || fallback;
};

/**
 * Helper function to get veteran's name from form data
 * @param {Object} formData - The form data
 * @param {string} [fallback='the Veteran'] - Default text when name is not available
 * @returns {string} The veteran's name or fallback text
 */
export const getVeteranName = (formData, fallback = 'the Veteran') => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return fallback;
  }

  const firstName = formData?.veteranInformation?.veteranFullName?.first || '';
  const lastName = formData?.veteranInformation?.veteranFullName?.last || '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || fallback;
};
