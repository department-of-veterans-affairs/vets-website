/**
 * @module utils/nameHelpers
 * @description Helper functions for retrieving names from form data
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import { isClaimantVeteran } from './relationship-helpers';

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

/**
 * Helper function to get the appropriate person's name based on whether veteran is claimant
 * @param {Object} formData - The form data
 * @param {Object} options - Options for fallback text
 * @param {string} [options.veteranFallback='the Veteran'] - Fallback when veteran is claimant with no name
 * @param {string} [options.claimantFallback='the claimant'] - Fallback when other claimant with no name
 * @returns {string} The person's name or appropriate fallback
 */
export const getPersonName = (
  formData,
  { veteranFallback = 'the Veteran', claimantFallback = 'the claimant' } = {},
) => {
  if (isClaimantVeteran(formData)) {
    return getVeteranName(formData, veteranFallback);
  }
  return getClaimantName(formData, claimantFallback);
};
