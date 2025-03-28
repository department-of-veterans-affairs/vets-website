import { isBefore, subYears, isWithinInterval } from 'date-fns';
import { DEPENDENT_VIEW_FIELDS, INSURANCE_VIEW_FIELDS } from '../constants';

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
 * Helper that determines if the Veteran's home and mailing address are the same
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is set to `false`
 */
export function hasDifferentHomeAddress(formData) {
  return !formData['view:doesMailingMatchHomeAddress'];
}

/**
 * Helper that determines if the form data contains values that indicate the
 * user wants to fill out information related to toxic exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the toxic exposure quesions are enabled and
 * the user indicated they wanted to fill out questions related to exposure
 */
export function includeTeraInformation(formData) {
  return formData.hasTeraResponse;
}

export function canVeteranProvideAgentOrangeResponse(formData) {
  /**
   * Birthdays before the year 1900 are invalidated by the 'parseVeteranDob' function
   * in src/applications/ezr/utils/helpers/general.js
   */
  return (
    includeTeraInformation(formData) &&
    isBefore(new Date(formData?.veteranDateOfBirth), new Date('1966-01-01'))
  );
}

export function canVeteranProvideRadiationCleanupResponse(formData) {
  /**
   * Birthdays before the year 1900 are invalidated by the 'parseVeteranDob' function
   * in src/applications/ezr/utils/helpers/general.js
   */
  return (
    includeTeraInformation(formData) &&
    isBefore(new Date(formData?.veteranDateOfBirth), new Date('1966-01-01'))
  );
}

export function canVeteranProvideGulfWarServiceResponse(formData) {
  /**
   * Birthdays before the year 1900 are invalidated by the 'parseVeteranDob' function
   * in src/applications/ezr/utils/helpers/general.js
   */
  return (
    includeTeraInformation(formData) &&
    isBefore(new Date(formData?.veteranDateOfBirth), new Date('1976-01-01'))
  );
}

export function canVeteranProvideCombatOperationsResponse(formData) {
  /**
   * Birthdays before the year 1900 are invalidated by the 'parseVeteranDob' function
   * in src/applications/ezr/utils/helpers/general.js
   */
  return (
    includeTeraInformation(formData) &&
    isBefore(new Date(formData?.veteranDateOfBirth), subYears(new Date(), 15))
  );
}

export function canVeteranProvidePostSept11ServiceResponse(formData) {
  return (
    includeTeraInformation(formData) &&
    isWithinInterval(new Date(formData?.veteranDateOfBirth), {
      start: new Date('1976-01-01'),
      end: subYears(new Date(), 15),
    })
  );
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
  return (
    gulfWarService &&
    includeTeraInformation(formData) &&
    canVeteranProvideGulfWarServiceResponse(formData)
  );
}

/**
 * Helper that determines if the form data contains values that indicate the
 * user served in specific post-911 gulf war locations
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they served in the specified
 * Post-9/11 Gulf War locations
 */
export function includePostSept11ServiceDates(formData) {
  const { gulfWarService } = formData;
  return (
    gulfWarService &&
    includeTeraInformation(formData) &&
    canVeteranProvidePostSept11ServiceResponse(formData)
  );
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
  return (
    exposedToAgentOrange &&
    includeTeraInformation(formData) &&
    canVeteranProvideAgentOrangeResponse(formData)
  );
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
  return exposures.includes(true) && includeTeraInformation(formData);
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

export function includeHouseholdInformationWithV1Prefill(formData) {
  return (
    formData['view:householdEnabled'] &&
    !formData['view:isProvidersAndDependentsPrefillEnabled']
  );
}

export function includeHouseholdInformationWithV2Prefill(formData) {
  return (
    formData['view:householdEnabled'] &&
    formData['view:isProvidersAndDependentsPrefillEnabled']
  );
}

export function includeSpousalInformationWithV1Prefill(formData) {
  if (!includeHouseholdInformationWithV1Prefill(formData)) return false;
  const { maritalStatus } = formData['view:maritalStatus'];
  return (
    maritalStatus?.toLowerCase() === 'married' ||
    maritalStatus?.toLowerCase() === 'separated'
  );
}

export function includeSpousalInformationWithV2Prefill(formData) {
  if (!includeHouseholdInformationWithV2Prefill(formData)) return false;
  const { maritalStatus } = formData['view:maritalStatus'];
  return (
    maritalStatus?.toLowerCase() === 'married' ||
    maritalStatus?.toLowerCase() === 'separated'
  );
}
