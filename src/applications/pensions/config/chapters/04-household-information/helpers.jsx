import get from 'platform/forms-system/src/js/utilities/data/get';
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';
import titleCase from 'platform/utilities/data/titleCase';
import { createSelector } from 'reselect';
import { Title } from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import { isWithinInterval, parseISO, startOfDay, subYears } from 'date-fns';
import { showPdfFormAlignment } from '../../../helpers';

/**
 * Checks if the marital status is 'SEPARATED'
 * @param {object} formData - Full form data
 * @returns {boolean} True if marital status is 'SEPARATED'
 */
export function isSeparated(formData) {
  return formData.maritalStatus === 'SEPARATED';
}

/**
 * Determines if the Veteran's marital status requires providing marriage history.
 *
 * Behavior depends on the `showPdfFormAlignment` feature toggle:
 * - When enabled: marriage history is required for MARRIED, SEPARATED, WIDOWED, or DIVORCED
 * - When disabled: marriage history is required only for MARRIED or SEPARATED
 *
 * @param {Object} formData - The form data containing maritalStatus
 * @returns {boolean} True if marriage history should be collected
 */
export function hasMarriageHistory(formData = {}) {
  const pdfAlignmentEnabled = showPdfFormAlignment();

  const validStatuses = pdfAlignmentEnabled
    ? ['MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED']
    : ['MARRIED', 'SEPARATED'];

  return validStatuses.includes(formData.maritalStatus);
}

/**
 * Checks if the form data indicates the presence of dependents.
 * @param {object} formData - Full form data
 * @returns {boolean} True if dependents are indicated
 */
export function doesHaveDependents(formData) {
  return get(['view:hasDependents'], formData) === true;
}

/**
 * Checks if the marriage at the given index is the current marriage
 * @param {object} formData - Full form data
 * @param {number} index - Index of the marriage in the marriages array
 * @returns {boolean} True if the marriage at the given index is the current
 * marriage
 */
export function isCurrentMarriage(formData = {}, index) {
  const numMarriages = Array.isArray(formData.marriages)
    ? formData.marriages.length
    : 0;

  return (
    ['MARRIED', 'SEPARATED'].includes(formData.maritalStatus) &&
    numMarriages - 1 === index
  );
}

/**
 * Determines if spouse information pages are required.
 *
 * Spouse info is required when maritalStatus is either:
 * - MARRIED
 * - SEPARATED
 *
 * @param {object} formData - The form data
 * @returns {boolean} True if spouse info pages should be shown
 */
export function requiresSpouseInfo(formData = {}) {
  return ['MARRIED', 'SEPARATED'].includes(formData.maritalStatus);
}

/**
 * Checks if the current spouse has former marriages
 * @param {object} formData - Full form data
 * @returns {boolean} True if the current spouse has former marriages
 */
export function currentSpouseHasFormerMarriages(formData) {
  return (
    hasMarriageHistory(formData) &&
    formData.currentSpouseMaritalHistory === 'YES'
  );
}

/**
 * Determines if the spouse address page should be shown
 * @param {object} formData - Full form data
 * @returns {boolean} True if the spouse address should be shown
 */
export function showSpouseAddress(formData) {
  return (
    hasMarriageHistory(formData) &&
    requiresSpouseInfo(formData) &&
    (formData.maritalStatus === 'SEPARATED' ||
      get(['view:liveWithSpouse'], formData) === false)
  );
}

/**
 * Determines if a dependent child is between 18 and 23 years old
 * @param {string} childDOB - Child's date of birth in ISO format
 * @returns {boolean} True if the child is between 18 and 23 years old
 */
export function isBetween18And23(childDOB) {
  if (!childDOB) return false;
  const today = startOfDay(new Date());
  const lowerBound = subYears(today, 23);
  const upperBound = subYears(today, 18);

  return isWithinInterval(parseISO(childDOB), {
    start: lowerBound,
    end: upperBound,
  });
}

/**
 * Determines if a dependent is outside the household
 * @param {object} formData - Full form data
 * @param {number} index - Index of the dependent in the dependents array
 * @returns {boolean} True if the dependent is outside the household
 */
export function dependentIsOutsideHousehold(formData, index) {
  // if 'view:hasDependents' is false,
  // all checks requiring dependents must be false
  return (
    doesHaveDependents(formData) &&
    !get(['dependents', index, 'childInHousehold'], formData)
  );
}

/**
 * Creates the title for a marriage based on its index
 * @param {number} index - marriage index
 * @returns {string} Title for the marriage, e.g. first marriage, second marriage
 */
export function getMarriageTitle(index) {
  const desc = numberToWords(index + 1);
  return `${titleCase(desc)} marriage`;
}

/**
 * Creates the title for a marriage based on its index, with special handling
 * for the current marriage
 * @param {object} form - Full form data
 * @param {number} index - marriage index
 * @returns {string} Title for the marriage, e.g. first marriage, second marriage
 */
export function getMarriageTitleWithCurrent(form = {}, index) {
  const numMarriages = Array.isArray(form.marriages)
    ? form.marriages.length
    : 0;

  if (
    ['MARRIED', 'SEPARATED'].includes(form.maritalStatus) &&
    numMarriages - 1 === index
  ) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}

/**
 * Create the title for a dependent child
 * @param {object} item - Dependent child array item
 * @param {string} description - Description to append to the child's name
 * @returns {string} Title for the dependent child
 */
export function getDependentChildTitle(item, description) {
  if (item.fullName) {
    return `${item.fullName.first || ''} ${
      item.fullName.last || ''
    } ${description}`;
  }
  return description;
}

/**
 * Creates a selector for the spouse's full name to be used in page titles used
 * within updateSchema function
 * @param {function} nameTemplate - Function to build spouse's full name
 * @returns {object} Selector object with title property
 */
export function createSpouseLabelSelector(nameTemplate) {
  return createSelector(
    form =>
      form.marriages && form.marriages.length
        ? form.marriages[form.marriages.length - 1].spouseFullName
        : null,
    spouseFullName => {
      if (spouseFullName) {
        return {
          title: nameTemplate(spouseFullName),
        };
      }

      return {
        title: null,
      };
    },
  );
}

export const MarriageTitle = title => <Title title={title} />;
