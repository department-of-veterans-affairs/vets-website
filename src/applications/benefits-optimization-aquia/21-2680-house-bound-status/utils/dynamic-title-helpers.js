/**
 * @module utils/dynamicTitleHelpers
 * @description Helper functions for building dynamic page titles
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import { isClaimantVeteran } from './relationship-helpers';
import { getVeteranName, getClaimantName } from './name-helpers';

/**
 * Helper function to build dynamic hospitalization status title
 * @param {Object} formData - The form data
 * @returns {string} Dynamic title like "Is [Name] hospitalized?"
 */
export const getHospitalizationStatusTitle = formData => {
  const isVeteran = isClaimantVeteran(formData);
  const name = isVeteran
    ? getVeteranName(formData, '')
    : getClaimantName(formData, '');

  if (name) {
    return `Is ${name} receiving hospital care?`;
  }

  return isVeteran
    ? 'Is the Veteran receiving hospital care?'
    : 'Is the claimant receiving hospital care?';
};

/**
 * Helper function to build dynamic hospitalization date title
 * @param {Object} formData - The form data
 * @returns {string} Dynamic title like "When was [Name] admitted to the hospital?"
 */
export const getHospitalizationDateTitle = formData => {
  const isVeteran = isClaimantVeteran(formData);
  const name = isVeteran
    ? getVeteranName(formData, '')
    : getClaimantName(formData, '');

  if (name) {
    return `When was ${name} admitted to the hospital?`;
  }

  return isVeteran
    ? 'When were you admitted to the hospital?'
    : 'When was the claimant admitted to the hospital?';
};

/**
 * Helper function to build dynamic hospitalization facility title
 * @param {Object} formData - The form data
 * @returns {string} Dynamic title like "What's the name and address of the hospital where [Name] is admitted?"
 */
export const getHospitalizationFacilityTitle = formData => {
  const isVeteran = isClaimantVeteran(formData);
  const name = isVeteran
    ? getVeteranName(formData, '')
    : getClaimantName(formData, '');

  if (name) {
    return `What's the name and address of the hospital where ${name} is admitted?`;
  }

  return isVeteran
    ? "What's the name and address of the hospital where you are admitted?"
    : "What's the name and address of the hospital where the claimant is admitted?";
};
