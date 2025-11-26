/**
 * @module utils/dynamicTitleHelpers
 * @description Helper functions for building dynamic page titles
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import { getPersonName } from './name-helpers';

/**
 * Helper function to build dynamic hospitalization status title
 * @param {Object} formData - The form data
 * @returns {string} Dynamic title like "Is [Name] hospitalized?"
 */
export const getHospitalizationStatusTitle = formData => {
  const personName = getPersonName(formData, 'the Veteran', 'the claimant');
  return `Is ${personName} hospitalized?`;
};

/**
 * Helper function to build dynamic hospitalization date title
 * @param {Object} formData - The form data
 * @returns {string} Dynamic title like "When was [Name] admitted to the hospital?"
 */
export const getHospitalizationDateTitle = formData => {
  const personName = getPersonName(formData, null, 'the claimant');
  if (personName) {
    return `When was ${personName} admitted to the hospital?`;
  }
  return 'When were you admitted to the hospital?';
};

/**
 * Helper function to build dynamic hospitalization facility title
 * @param {Object} formData - The form data
 * @returns {string} Dynamic title like "What's the name and address of the hospital where [Name] is admitted?"
 */
export const getHospitalizationFacilityTitle = formData => {
  const personName = getPersonName(formData, null, 'the claimant');
  if (personName) {
    return `What's the name and address of the hospital where ${personName} is admitted?`;
  }
  return `What's the name and address of the hospital where you are admitted?`;
};
