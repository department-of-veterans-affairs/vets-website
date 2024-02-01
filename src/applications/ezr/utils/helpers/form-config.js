import {
  DEPENDENT_VIEW_FIELDS,
  EMERGENCY_CONTACT_VIEW_FIELDS,
  INSURANCE_VIEW_FIELDS,
} from '../constants';

/**
 * Helper that determines if the form data is missing the Veteran's date of birth
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is empty
 */
export function isMissingVeteranDob(formData) {
  return !formData['view:userDob'];
}

/**
 * Helper that determines if the form data is missing the Veteran's birth sex
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is empty
 */
export function isMissingVeteranGender(formData) {
  return !formData['view:userGender'];
}

/**
 * Helper that determines if the form data is missing the Veteran's birth sex
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is empty
 */
export function isSigiEnabled(formData) {
  return formData['view:isSigiEnabled'];
}

/**
 * Helper that determines if the Veteran's home and mailing address are the same
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is set to `false`
 */
export function hasDifferentHomeAddress(formData) {
  return !formData['view:doesMailingMatchHomeAddress'];
}

/**
 * Helper that determines if the form data contains values that allow users to fill
 * in their household financial information
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user can submit financial information.
 */
export function includeHouseholdInformation(formData) {
  return formData['view:householdEnabled'];
}

/**
 * Helper that determines if the form data contains values that require the financial
 * status alert to be shown
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user cannot submit financial information.
 */
export function showFinancialStatusAlert(formData) {
  return !includeHouseholdInformation(formData);
}

/**
 * Helper that determines if the form data contains values that require users
 * to fill out spousal information
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user declares they would like to provide their
 * financial data & have a marital status of 'married' or 'separated'.
 */
export function includeSpousalInformation(formData) {
  if (!includeHouseholdInformation(formData)) return false;
  const { maritalStatus } = formData['view:maritalStatus'];
  return (
    maritalStatus?.toLowerCase() === 'married' ||
    maritalStatus?.toLowerCase() === 'separated'
  );
}

/**
 * Helper that determines if the Veteran & their spouse cohabitated last year
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if cohabitedLastYear is set to `false` and spousal
 * information should be included in the form
 */
export function spouseDidNotCohabitateWithVeteran(formData) {
  const { cohabitedLastYear } = formData;
  return includeSpousalInformation(formData) && !cohabitedLastYear;
}

/**
 * Helper that determines if the Veteran's spouse has the same address
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if sameAddress is set to `false` and spousal
 * information should be included in the form
 */
export function spouseAddressDoesNotMatchVeterans(formData) {
  const { sameAddress } = formData;
  return includeSpousalInformation(formData) && !sameAddress;
}

/**
 * Helper that determines if dependent information needs to be collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export function includeDependentInformation(formData) {
  return (
    includeHouseholdInformation(formData) &&
    !formData[DEPENDENT_VIEW_FIELDS.skip]
  );
}

/**
 * Helper that determines if insurance policy information needs to be collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export function collectMedicareInformation(formData) {
  const { isEnrolledMedicarePartA } = formData['view:isEnrolledMedicarePartA'];
  return isEnrolledMedicarePartA;
}

/**
 * Helper that determines if insurance policy information needs to be collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export function includeInsuranceInformation(formData) {
  return !formData[INSURANCE_VIEW_FIELDS.skip];
}

/**
 * Helper that determines if emergency contact information needs to be collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export function includeEmergencyContactInformation(formData) {
  return !formData[EMERGENCY_CONTACT_VIEW_FIELDS.skip];
}
