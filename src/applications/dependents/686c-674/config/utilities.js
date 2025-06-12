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

/**
 * Mostly copied from the platform provided stringifyFormReplacer, with the removal of the address check. We don't need it here for our location use.
 */
export const customFormReplacer = (key, value) => {
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
  const payload = cloneDeep(form);
  // manually delete view:confirmEmail, since in our case we actually want the other view fields
  // delete payload.data.veteranContactInformation['view:confirmEmail'];
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
