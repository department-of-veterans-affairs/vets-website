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
 * Helper that determines if the form data contains values that enable the
 * toxic exposure questions in the Military Service chapter
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is not short form eligible and the
 * TERA feature flag is set to true
 */
export function teraInformationEnabled(formData) {
  const { 'view:isTeraEnabled': isTeraEnabled } = formData;
  return isTeraEnabled;
}

/**
 * Helper that determines if the form data contains values that indicate the
 * user wants to fill out information related to toxic exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the toxic exposure quesions are enabled and
 * the user indicated they wanted to fill out questions related to exposure
 */
export function includeTeraInformation(formData) {
  const { hasTeraResponse } = formData;
  return teraInformationEnabled(formData) && hasTeraResponse;
}

/**
 * Helper that determines if the form data contains values that enable the
 * toxic exposure file upload in the Military Service chapter
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user wants to fill out TERA information and the
 * EZR Upload feature flag is set to true
 */
export function teraUploadEnabled(formData) {
  const { hasTeraResponse } = formData;
  return includeTeraInformation(formData) && hasTeraResponse;
}

/**
 * Helper that determines if the form data contains values that indicate the
 * user served in specific gulf war locations
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they served in the specified
 * Gulf War locations
 */
export function includeGulfWarServiceDates(formData) {
  const { gulfWarService } = formData;
  return gulfWarService && includeTeraInformation(formData);
}

/**
 * Helper that determines if the form data contains values that indicate the
 * user served in specific gulf war locations
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they served in the specified
 * Gulf War locations
 */
export function includeAgentOrangeExposureDates(formData) {
  const { exposedToAgentOrange } = formData;
  return exposedToAgentOrange && includeTeraInformation(formData);
}

/**
 * Helper that determines if the form data contains values that indicate the
 * user has a specified other toxic exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they have a specified
 * toxic exposure
 */
export function includeOtherExposureDates(formData) {
  const { 'view:otherToxicExposures': otherToxicExposures = {} } = formData;
  const exposures = Object.values(otherToxicExposures);
  return exposures.some(o => o) && includeTeraInformation(formData);
}

/**
 * Helper that determines if the form data contains values that indicate the
 * user has a specified other toxic exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they had a toxic exposure
 * that was not on the specified list
 */
export function includeOtherExposureDetails(formData) {
  return (
    formData['view:otherToxicExposures']?.exposureToOther &&
    includeTeraInformation(formData)
  );
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
 * Helper that determines if insurance policy information needs to be collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export function collectMedicareInformation(formData) {
  const { isEnrolledMedicarePartA } = formData['view:isEnrolledMedicarePartA'];
  return isEnrolledMedicarePartA;
}
