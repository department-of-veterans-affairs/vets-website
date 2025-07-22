import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import cloneDeep from 'lodash/cloneDeep';
import { parse, parseISO, isValid } from 'date-fns';

import omit from 'platform/utilities/data/omit';
import { validateWhiteSpace } from 'platform/forms/validations';
import {
  filterInactivePageData,
  getActivePages,
  getInactivePages,
  stringifyFormReplacer,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { apiRequest } from 'platform/utilities/api';

import { spouseMarriageHistoryOptions } from './chapters/report-add-a-spouse/spouseMarriageHistoryArrayPages';
import { veteranMarriageHistoryOptions } from './chapters/report-add-a-spouse/veteranMarriageHistoryArrayPages';
import { arrayBuilderOptions } from './chapters/report-add-child/config';
import { removeChildStoppedAttendingSchoolOptions } from './chapters/report-child-stopped-attending-school/removeChildStoppedAttendingSchoolArrayPages';
import { deceasedDependentOptions } from './chapters/report-dependent-death/deceasedDependentArrayPages';
import { removeMarriedChildOptions } from './chapters/report-marriage-of-child/removeMarriedChildArrayPages';
import { removeChildHouseholdOptions } from './chapters/stepchild-no-longer-part-of-household/removeChildHouseholdArrayPages';
import { addStudentsOptions } from './chapters/674/addStudentsArrayPages';

const ALL_ARRAY_OPTIONS = [
  spouseMarriageHistoryOptions,
  veteranMarriageHistoryOptions,
  arrayBuilderOptions,
  removeChildStoppedAttendingSchoolOptions,
  deceasedDependentOptions,
  removeMarriedChildOptions,
  removeChildHouseholdOptions,
  addStudentsOptions,
];

import { MARRIAGE_TYPES } from './constants';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
}

const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

const validateName = (errors, pageData) => {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
};

const PHONE_KEYS = ['phoneNumber', 'internationalPhone'];

/**
 * Mostly copied from the platform provided stringifyFormReplacer, with the removal of the address check. We don't need it here for our location use.
 */
export const customFormReplacer = (key, value) => {
  // Remove all non-digit characters from phone-related fields
  if (typeof value === 'string' && PHONE_KEYS.includes(key)) {
    return value.replace(/\D/g, '');
  }
  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }

    // autosuggest widgets save value and label info, but we should just return the value
    if (value.widget === 'autosuggest') {
      return value.id;
    }

    // Exclude file data
    if (value.confirmationCode && value.file) {
      return omit('file', value);
    }
  }
  // Clean up empty objects in arrays
  if (Array.isArray(value)) {
    const newValues = value.filter(v => !!stringifyFormReplacer(key, v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  return value;
};

const {
  optionSelection,
  veteranInformation,
  addChild,
  addSpouse,
  reportDivorce,
  deceasedDependents,
  reportChildMarriage,
  reportChildStoppedAttendingSchool,
  reportStepchildNotInHousehold,
  report674,
  householdIncome,
} = fullSchema.properties;

export {
  validateName,
  optionSelection,
  veteranInformation,
  addChild,
  addSpouse,
  reportDivorce,
  deceasedDependents,
  reportChildMarriage,
  reportChildStoppedAttendingSchool,
  reportStepchildNotInHousehold,
  report674,
  householdIncome,
  isServerError,
  isClientError,
};

export function customTransformForSubmit(formConfig, form) {
  for (const option of ALL_ARRAY_OPTIONS) {
    const items = form.data?.[option.arrayPath];
    if (Array.isArray(items)) {
      const hasIncomplete = items.some(option.isItemIncomplete);
      if (hasIncomplete) {
        // Return a custom error instead of throwing!
        return {
          error: `You have incomplete ${
            option.nounPlural
          }. Please complete all before submitting.`,
        };
      }
    }
  }

  const payload = cloneDeep(form);
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    payload.data,
  );
  const activePages = getActivePages(expandedPages, payload.data);
  const inactivePages = getInactivePages(expandedPages, payload.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    payload,
  );

  return JSON.stringify(withoutInactivePages, customFormReplacer) || '{}';
}

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @returns {dateObj|null} date object
 */
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (template) {
      newDate = parse(date, template, new Date());
    }
  } else if (date instanceof Date && isValid(date)) {
    // Remove timezone offset - the only time we pass in a date object is for
    // unit tests (see https://stackoverflow.com/a/67599505)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  }
  return isValid(newDate) ? newDate : null;
};

export const spouseEvidence = (formData = {}) => {
  const { veteranAddress } = formData.veteranContactInformation || {};
  const isOutsideUSA =
    veteranAddress?.country !== 'USA' || Boolean(veteranAddress?.isMilitary);

  const { typeOfMarriage } = formData.currentMarriageInformation || {};
  const isCommonLawMarriage = typeOfMarriage === MARRIAGE_TYPES.commonLaw;
  const isTribalMarriage = typeOfMarriage === MARRIAGE_TYPES.tribal;
  const isProxyMarriage = typeOfMarriage === MARRIAGE_TYPES.proxy;
  const needsSpouseUpload =
    typeof typeOfMarriage === 'string' &&
    typeOfMarriage !== MARRIAGE_TYPES.ceremonial;

  return {
    isCommonLawMarriage,
    isTribalMarriage,
    isProxyMarriage,
    isOutsideUSA,
    needsSpouseUpload,
  };
};

export const childEvidence = (formData = {}) => {
  const veteranAddress =
    formData?.veteranContactInformation?.veteranAddress || {};
  const livesOutsideUSA =
    veteranAddress.country !== 'USA' || veteranAddress.isMilitary;

  const childrenToAdd = formData?.childrenToAdd || [];
  const hasStepChild = childrenToAdd.some(
    childFormData => childFormData?.relationshipToChild?.stepchild,
  );
  const hasAdoptedChild = childrenToAdd.some(
    childFormData => childFormData?.relationshipToChild?.adopted,
  );
  const hasDisabledChild = childrenToAdd.some(
    childFormData =>
      childFormData?.doesChildHaveDisability &&
      childFormData?.doesChildHavePermanentDisability,
  );

  const showBirthCertificate = livesOutsideUSA || hasStepChild;

  return {
    showBirthCertificate,
    hasAdoptedChild,
    hasDisabledChild,
    needsChildUpload:
      showBirthCertificate || hasDisabledChild || hasAdoptedChild,
  };
};
