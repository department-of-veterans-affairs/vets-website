import cloneDeep from 'lodash/cloneDeep';
import { parse, parseISO, isValid } from 'date-fns';

import omit from 'platform/utilities/data/omit';

import {
  filterInactivePageData,
  getActivePages,
  getInactivePages,
  stringifyFormReplacer,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { validateWhiteSpace } from 'platform/forms/validations';

import { MARRIAGE_TYPES, PICKLIST_DATA } from '../constants';

export const validateName = (errors, pageData) => {
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
  if (typeof value === 'object' && value !== null) {
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

function copyDataFields(sourceData, cleanData, fields) {
  fields.forEach(field => {
    const value = sourceData[field];
    if (Array.isArray(value) ? value.length > 0 : value) {
      // eslint-disable-next-line no-param-reassign
      cleanData[field] = value;
    }
  });
}

export function buildSubmissionData(payload) {
  if (!payload?.data) {
    return payload;
  }

  const sourceData = payload.data;
  const cleanData = {};

  const addEnabled = sourceData['view:addOrRemoveDependents']?.add === true;
  const removeEnabled =
    sourceData['view:addOrRemoveDependents']?.remove === true;
  const addOptions = sourceData['view:addDependentOptions'] || {};
  const removeOptions = sourceData['view:removeDependentOptions'] || {};

  // Always include these - needed for BE
  Object.assign(cleanData, {
    useV2: true,
    daysTillExpires: 365,
  });

  const essentialFields = [
    'veteranInformation',
    'veteranContactInformation',
    'statementOfTruthSignature',
    'statementOfTruthCertified',
    'metadata',
  ];

  essentialFields.forEach(field => {
    if (sourceData[field]) {
      cleanData[field] = sourceData[field];
    }
  });

  // Handle fields that can be undefined/false - vaDependentsNetWorthAndPension recently added to formData
  ['householdIncome', 'vaDependentsNetWorthAndPension'].forEach(field => {
    if (sourceData[field] !== undefined) {
      cleanData[field] = sourceData[field];
    }
  });

  const addDataMappings = {
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

  const removeDataMappings = {
    reportDivorce: ['reportDivorce'],
    reportDeath: ['deaths'],
    reportStepchildNotInHousehold: ['stepChildren'],
    reportMarriageOfChildUnder18: ['childMarriage'],
    reportChild18OrOlderIsNotAttendingSchool: ['childStoppedAttendingSchool'],
  };

  // Add options
  const enabledAddOptions = {};
  if (addEnabled) {
    Object.entries(addDataMappings).forEach(([option, fields]) => {
      if (addOptions[option] === true) {
        enabledAddOptions[option] = true;
        copyDataFields(sourceData, cleanData, fields);
      }
    });
  }

  // Remove options
  const enabledRemoveOptions = {};
  if (removeEnabled) {
    Object.entries(removeDataMappings).forEach(([option, fields]) => {
      if (removeOptions[option] === true) {
        enabledRemoveOptions[option] = true;
        copyDataFields(sourceData, cleanData, fields);
      }
    });
  }

  if (Object.keys(enabledAddOptions).length > 0) {
    cleanData['view:addDependentOptions'] = enabledAddOptions;
  }

  if (Object.keys(enabledRemoveOptions).length > 0) {
    cleanData['view:removeDependentOptions'] = enabledRemoveOptions;
  }

  const mainControl = {};
  if (addEnabled && Object.keys(enabledAddOptions).length > 0) {
    mainControl.add = true;
  }
  if (removeEnabled && Object.keys(enabledRemoveOptions).length > 0) {
    mainControl.remove = true;
  }

  if (Object.keys(mainControl).length > 0) {
    cleanData['view:addOrRemoveDependents'] = mainControl;
  }

  const selectableOptions = { ...enabledAddOptions, ...enabledRemoveOptions };
  if (Object.keys(selectableOptions).length > 0) {
    cleanData['view:selectable686Options'] = selectableOptions;
  }

  return { ...payload, data: cleanData };
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

  const cleanedPayload = buildSubmissionData(withoutInactivePages);

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

export const showDupeModalIfEnabled = (formData = {}) =>
  !!formData.vaDependentsDuplicateModals;

export const isAddingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.add;
export const isRemovingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.remove;
export const showV3Picklist = formData => !!formData?.vaDependentsV3;
export const noV3Picklist = formData => !formData?.vaDependentsV3;
export const showOptionsSelection = formData =>
  showV3Picklist(formData) ? formData.dependents?.awarded.length > 0 : true;

export const hasAwardedDependents = (formData = {}) =>
  Array.isArray(formData?.dependents?.awarded) &&
  formData.dependents.awarded.length > 0;

export const isVisiblePicklistPage = (formData, relationship) => {
  const pickList = formData?.[PICKLIST_DATA] || [];
  return (
    (showV3Picklist(formData) &&
      formData?.['view:addOrRemoveDependents']?.remove &&
      pickList.some(
        item => item.selected && item.relationshipToVeteran === relationship,
      )) ||
    false
  );
};

export const hasSelectedPicklistItems = formData =>
  (formData?.[PICKLIST_DATA] || []).some(item => item.selected);
