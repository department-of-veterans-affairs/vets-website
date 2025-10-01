import get from 'platform/forms-system/src/js/utilities/data/get';
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';
import titleCase from 'platform/utilities/data/titleCase';
import { createSelector } from 'reselect';
import { Title } from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import { isWithinInterval, parseISO, startOfDay, subYears } from 'date-fns';
import { showPdfFormAlignment } from '../../../helpers';

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

export function doesHaveDependents(formData) {
  return get(['view:hasDependents'], formData) === true;
}

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

export function currentSpouseHasFormerMarriages(formData) {
  return (
    hasMarriageHistory(formData) &&
    formData.currentSpouseMaritalHistory === 'YES'
  );
}

export function showSpouseAddress(formData) {
  return (
    hasMarriageHistory(formData) &&
    requiresSpouseInfo(formData) &&
    (formData.maritalStatus === 'SEPARATED' ||
      get(['view:liveWithSpouse'], formData) === false)
  );
}

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

export function dependentIsOutsideHousehold(formData, index) {
  // if 'view:hasDependents' is false,
  // all checks requiring dependents must be false
  return (
    doesHaveDependents(formData) &&
    !get(['dependents', index, 'childInHousehold'], formData)
  );
}

export function getMarriageTitle(index) {
  const desc = numberToWords(index + 1);
  return `${titleCase(desc)} marriage`;
}

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

export function getDependentChildTitle(item, description) {
  if (item.fullName) {
    return `${item.fullName.first || ''} ${item.fullName.last ||
      ''} ${description}`;
  }
  return description;
}

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
