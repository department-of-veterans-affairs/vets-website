import cloneDeep from 'lodash/cloneDeep';
import { parse, parseISO, isValid } from 'date-fns';

import omit from 'platform/utilities/data/omit';

import { stringifyFormReplacer } from 'platform/forms-system/src/js/helpers';
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

  const selectableOptions = sourceData['view:selectable686Options'] || {};

  // Always include these - needed for BE
  Object.assign(cleanData, {
    useV2: true,
    daysTillExpires: 365,
  });

  // Essential fields
  const essentialFields = [
    'veteranInformation',
    'veteranContactInformation',
    'statementOfTruthSignature',
    'statementOfTruthCertified',
    'metadata',
    // 'dependents',
    // 'vaDependentsDuplicateModals', // Verify these are essential?
    // 'vaDependentsV3',
  ];

  essentialFields.forEach(field => {
    if (sourceData[field] !== undefined) {
      cleanData[field] = sourceData[field];
    }
  });

  const addSpouseFields = [
    'currentMarriageInformation',
    'doesLiveWithSpouse',
    'spouseInformation',
    'spouseSupportingDocuments',
    'spouseMarriageHistory',
    'veteranMarriageHistory',
  ];

  const childFields = ['childrenToAdd', 'childSupportingDocuments'];

  const report674Fields = ['studentInformation'];

  const removeFields = {
    reportDivorce: ['reportDivorce'],
    reportDeath: ['deaths'],
    reportStepchildNotInHousehold: ['stepChildren'],
    reportMarriageOfChildUnder18: ['childMarriage'],
    reportChild18OrOlderIsNotAttendingSchool: ['childStoppedAttendingSchool'],
  };

  const enabledAddOptions = {};

  if (addEnabled === true) {
    if (selectableOptions.addSpouse === true) {
      enabledAddOptions.addSpouse = true;
      copyDataFields(sourceData, cleanData, addSpouseFields);
    }

    const shouldIncludeChildData =
      selectableOptions.addChild === true ||
      selectableOptions.addDisabledChild === true;

    if (shouldIncludeChildData) {
      if (selectableOptions.addChild === true) {
        enabledAddOptions.addChild = true;
      }
      if (selectableOptions.addDisabledChild === true) {
        enabledAddOptions.addDisabledChild = true;
      }
      copyDataFields(sourceData, cleanData, childFields);
    }

    if (selectableOptions.report674 === true) {
      enabledAddOptions.report674 = true;
      copyDataFields(sourceData, cleanData, report674Fields);
    }
  }

  const enabledRemoveOptions = {};

  if (removeEnabled === true) {
    Object.entries(removeFields).forEach(([option, fields]) => {
      if (selectableOptions[option] === true) {
        enabledRemoveOptions[option] = true;
        copyDataFields(sourceData, cleanData, fields);
      }
    });
  }

  const hasActiveOptions =
    Object.keys(enabledAddOptions).length > 0 ||
    Object.keys(enabledRemoveOptions).length > 0;

  if (hasActiveOptions) {
    ['householdIncome', 'vaDependentsNetWorthAndPension'].forEach(field => {
      if (sourceData[field] !== undefined) {
        cleanData[field] = sourceData[field];
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

  const enabledSelectableOptions = {
    ...enabledAddOptions,
    ...enabledRemoveOptions,
  };
  if (Object.keys(enabledSelectableOptions).length > 0) {
    cleanData['view:selectable686Options'] = enabledSelectableOptions;
  }

  const managedViewFields = [
    'view:addOrRemoveDependents',
    'view:addDependentOptions',
    'view:removeDependentOptions',
    'view:selectable686Options',
  ];

  Object.keys(sourceData).forEach(key => {
    if (
      key.startsWith('view:') &&
      !managedViewFields.some(field => key.startsWith(field)) &&
      cleanData[key] === undefined
    ) {
      cleanData[key] = sourceData[key];
    }
  });

  return {
    metadata: payload.metadata,
    data: cleanData,
    formData: cleanData,
  };
}

export function customTransformForSubmit(formConfig, form) {
  const payload = cloneDeep(form);
  if (!payload.data) {
    payload.data = {};
  }
  payload.data.useV2 = true;
  payload.data.daysTillExpires = 365;

  const cleanedPayload = buildSubmissionData(payload);

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
