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

function cleanFormData(payload) {
  if (!payload?.data) {
    return payload;
  }

  const data = { ...payload.data };

  // Get control flags
  const addEnabled = data['view:addOrRemoveDependents']?.add === true;
  const removeEnabled = data['view:addOrRemoveDependents']?.remove === true;

  const addOptions = data['view:addDependentOptions'] || {};
  const removeOptions = data['view:removeDependentOptions'] || {};

  // Define mappings between control flags and their data fields
  const addMappings = {
    addSpouse: [
      'currentMarriageInformation',
      'doesLiveWithSpouse',
      'spouseInformation',
      'spouseSupportingDocuments',
      'spouseMarriageHistory',
      'veteranMarriageHistory',
    ],
    addChild: ['childrenToAdd', 'childSupportingDocuments'],
    addDisabledChild: ['childrenToAdd', 'childSupportingDocuments'],
    report674: ['studentInformation'],
  };

  const removeMappings = {
    reportDivorce: ['reportDivorce'],
    reportDeath: ['deaths'],
    reportStepchildNotInHousehold: ['stepChildren'],
    reportMarriageOfChildUnder18: ['childMarriage'],
    reportChild18OrOlderIsNotAttendingSchool: ['childStoppedAttendingSchool'],
  };

  const removeDataFields = (mappings, options, enabled) => {
    if (!enabled) {
      // Remove all fields if the main flag is disabled
      Object.values(mappings)
        .flat()
        .forEach(field => delete data[field]);
      return {};
    }

    const cleanOptions = {};
    const fieldsToKeep = new Set();

    // Determine which fields to keep based on enabled options
    Object.entries(mappings).forEach(([option, fields]) => {
      if (options[option] === true) {
        cleanOptions[option] = true;
        fields.forEach(field => fieldsToKeep.add(field));
      }
    });

    // Remove fields that aren't needed
    Object.values(mappings)
      .flat()
      .forEach(field => {
        if (!fieldsToKeep.has(field)) {
          delete data[field];
        }
      });

    return cleanOptions;
  };

  const cleanAddOptions = removeDataFields(addMappings, addOptions, addEnabled);
  const cleanRemoveOptions = removeDataFields(
    removeMappings,
    removeOptions,
    removeEnabled,
  );

  // Update control objects
  if (Object.keys(cleanAddOptions).length > 0) {
    data['view:addDependentOptions'] = cleanAddOptions;
  } else {
    delete data['view:addDependentOptions'];
  }

  if (Object.keys(cleanRemoveOptions).length > 0) {
    data['view:removeDependentOptions'] = cleanRemoveOptions;
  } else {
    delete data['view:removeDependentOptions'];
  }

  // Clean main control object
  const cleanMainOptions = {};
  if (addEnabled && Object.keys(cleanAddOptions).length > 0) {
    cleanMainOptions.add = true;
  }
  if (removeEnabled && Object.keys(cleanRemoveOptions).length > 0) {
    cleanMainOptions.remove = true;
  }

  if (Object.keys(cleanMainOptions).length > 0) {
    data['view:addOrRemoveDependents'] = cleanMainOptions;
  } else {
    delete data['view:addOrRemoveDependents'];
  }

  // Clean selectable options (combine both add and remove)
  const cleanSelectableOptions = { ...cleanAddOptions, ...cleanRemoveOptions };
  if (Object.keys(cleanSelectableOptions).length > 0) {
    data['view:selectable686Options'] = cleanSelectableOptions;
  } else {
    delete data['view:selectable686Options'];
  }

  // Remove empty arrays
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key]) && data[key].length === 0) {
      delete data[key];
    }
  });

  return { ...payload, data };
}

export function customTransformForSubmit(formConfig, form) {
  const payload = cloneDeep(form);
  if (!payload.data) {
    payload.data = {};
  }
  payload.data.useV2 = true;
  payload.data.daysTillExpires = 365;

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

  const cleanedPayload = cleanFormData(withoutInactivePages);

  return JSON.stringify(cleanedPayload, customFormReplacer) || '{}';
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
