import { PICKLIST_DATA } from '../constants';

/**
 * Check if the form should go through v3 picklist unless Veteran has a v2 form
 * in progress
 * @param {object} formData - form data object
 * @returns {boolean} - true if v3 picklist should be shown
 */
export const showV3Picklist = formData =>
  !!formData?.vaDependentsV3 && formData?.vaDependentV2Flow !== true;

/**
 * Show v2 flow if Veteran has a v2 form in progress
 * @param {object} formData - form data object
 * @returns {boolean} - true if v3 picklist should be shown
 */
export const noV3Picklist = formData => !showV3Picklist(formData);

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
