import { parse, parseISO, isValid } from 'date-fns';

import omit from 'platform/utilities/data/omit';

import { stringifyFormReplacer } from 'platform/forms-system/src/js/helpers';

import { MARRIAGE_TYPES, PICKLIST_DATA } from '../constants';

export const PHONE_KEYS = ['phoneNumber', 'internationalPhone'];

/**
 * Cleans up form data for submission; m* Mostly copied from the platform provided stringifyFormReplacer, with the
 * removal of the address check. We don't need it here for our location use.
 * @param {string} key - form data field key
 * @param {any} value - form data field value
 * @returns {any} - cleaned form data field value
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

/**
 * Check if the form should go through v3 picklist unless Veteran has a v2 form
 * in progress
 * @param {object} formData - form data object
 * @returns {boolean} - true if v3 picklist should be shown
 */
export const showV3Picklist = formData =>
  !!formData?.vaDependentsV3 && formData?.vaDependentV2Flow !== true;

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string|number|Date} date - date to format
 * @param {string} template - date template for parsing non-ISO strings
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

/**
 * Get spouse evidence requirements from form data
 * @param {object} formData - form data object
 * @returns {object} - spouse evidence requirements
 */
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

/**
 * Get child evidence requirements from form data
 * @param {object} formData - form data object
 * @returns {object} - child evidence requirements
 */
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

/**
 * Check if duplicate modal should be shown
 * @param {object} formData - form data object
 * @returns {boolean} - true if duplicate modal should be shown
 */
export const showDupeModalIfEnabled = (formData = {}) =>
  !!formData.vaDependentsDuplicateModals;

/**
 * Check if adding dependents
 * @param {object} formData - form data object
 * @returns {boolean} - true if adding dependents
 */
export const isAddingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.add;

/**
 * Check if removing dependents
 * @param {object} formData - form data object
 * @returns {boolean} - true if removing dependents
 */
export const isRemovingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.remove;

/**
 * Show v2 flow if Veteran has a v2 form in progress
 * @param {object} formData - form data object
 * @returns {boolean} - true if v3 picklist should be shown
 */
export const noV3Picklist = formData => !showV3Picklist(formData);

/**
 * Check if there are awarded dependents in form data
 * @param {object} formData - form data object
 * @returns {boolean} - true if there are awarded dependents
 */
export const hasAwardedDependents = (formData = {}) =>
  Array.isArray(formData?.dependents?.awarded) &&
  formData.dependents.awarded.length > 0;

/**
 * If v3 flow is enabled, show options selection (add or remove question) if
 * there are awarded dependents and no dependents API error; if no awarded
 * dependents, only show the add dependents flow
 * @param {object} formData - form data object
 * @returns {boolean} - true if options selection should be shown
 */
export const showOptionsSelection = formData =>
  showV3Picklist(formData)
    ? !formData['view:dependentsApiError'] && hasAwardedDependents(formData)
    : true;

/**
 * If v3 picklist is enabled, check if remove flow is selected and if all the
 * dependents have a relationship value, then show the picklist page
 * @param {object} formData - form data object
 * @param {string} relationship - relationship to veteran
 * @returns {boolean} - true if picklist page is visible
 */
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

/**
 * Check if any picklist items are selected
 * @param {object} formData - form data object
 * @returns {boolean} - true if any picklist items are selected
 */
export const hasSelectedPicklistItems = formData =>
  (formData?.[PICKLIST_DATA] || []).some(item => item.selected);
