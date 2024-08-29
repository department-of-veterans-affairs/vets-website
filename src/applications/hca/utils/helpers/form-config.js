import { inRange } from 'lodash';
import { DEPENDENT_VIEW_FIELDS, HIGH_DISABILITY_MINIMUM } from '../constants';

/**
 * Helper that determines if user is unauthenticated
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is truthy
 */
export function isLoggedOut(formData) {
  const { 'view:isLoggedIn': isLoggedIn } = formData;
  return !isLoggedIn;
}

/**
 * Helper that determines if the Veteran has a lower disability rating
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield value is less than the high-
 * disability minimum
 */
export function hasLowDisabilityRating(formData) {
  return formData['view:totalDisabilityRating'] < HIGH_DISABILITY_MINIMUM;
}

/**
 * Helper that determines if the Veteran has high-disability compensation from VA
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if `vaCompensationType` is set to 'highDisability'
 */
export function hasHighCompensation(formData) {
  const { vaCompensationType } = formData;
  return vaCompensationType === 'highDisability';
}

/**
 * Helper that determines if the Veteran has low-disability compensation from VA
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if `vaCompensationType` is set to 'lowDisability'
 */
export function hasLowCompensation(formData) {
  const { vaCompensationType } = formData;
  return vaCompensationType === 'lowDisability';
}

/**
 * Helper that determines if the Veteran has no compensation from VA
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if `vaCompensationType` is set to 'none'
 */
export function hasNoCompensation(formData) {
  const { vaCompensationType } = formData;
  return vaCompensationType === 'none';
}

/**
 * Helper that determines if the user is short form eligible
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the total disability rating is less than the
 * minimum percetage and the user does not self-declares they receive
 * compensation equal to that of a high-disability-rated Veteran
 */
export function notShortFormEligible(formData) {
  return hasLowDisabilityRating(formData) && !hasHighCompensation(formData);
}

/**
 * Helper that determines if the form data contains values that require users
 * to upload their military discharge papers
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user was not found in the MPI database
 */
export function dischargePapersRequired(formData) {
  const { 'view:isUserInMvi': isUserInMvi } = formData;
  return notShortFormEligible(formData) && !isUserInMvi;
}

/**
 * Helper that determines if the form data contains values that indicate an
 * authenticated user is missing date of birth information from their profile
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged in and viewfield is empty
 */
export function isMissingVeteranDob(formData) {
  const { 'view:userDob': userDob } = formData;
  return !isLoggedOut(formData) && !userDob;
}

/**
 * Helper that determines if the feature flag status for the registration-only question
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the form data is `true`
 */
export function isRegOnlyEnabled(formData) {
  return formData['view:isRegOnlyEnabled'];
}

/**
 * Helper that determines if the feature flag status for the gender identity question
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the form data is `true`
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
 * Helper that determines if the registration-only questions should be show to authenticated users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged in, feature flag is active & total disability
 * rating is 10-40%
 */
export function includeRegOnlyAuthQuestions(formData) {
  const { 'view:totalDisabilityRating': totalRating } = formData;
  return (
    !isLoggedOut(formData) &&
    isRegOnlyEnabled(formData) &&
    inRange(totalRating, 10, 40)
  );
}

/**
 * Helper that determines if the registration-only questions should be show to guest users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged out, feature flag is active & VA
 * compensation is set to `lowDisability`
 */
export function includeRegOnlyGuestQuestions(formData) {
  return (
    isLoggedOut(formData) &&
    isRegOnlyEnabled(formData) &&
    hasLowCompensation(formData)
  );
}

/**
 * Helper that determines if the registration-only alert should be shown to
 * authenticated users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged in and users selected the
 * `regOnly` package
 */
export function showRegOnlyAuthConfirmation(formData) {
  const { 'view:vaBenefitsPackage': vaBenefitsPackage } = formData;
  return !isLoggedOut(formData) && vaBenefitsPackage === 'regOnly';
}

/**
 * Helper that determines if the registration-only alert should be shown to
 * guest users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged out and users selected the
 * `regOnly` package
 */
export function showRegOnlyGuestConfirmation(formData) {
  const { 'view:vaBenefitsPackage': vaBenefitsPackage } = formData;
  return isLoggedOut(formData) && vaBenefitsPackage === 'regOnly';
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
  return hasTeraResponse;
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
  return includeTeraInformation(formData) && gulfWarService;
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
  return includeTeraInformation(formData) && exposures.some(o => o);
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
    includeTeraInformation(formData) &&
    formData['view:otherToxicExposures']?.exposureToOther
  );
}

/**
 * Helper that determines if financial confirmation alert is to be shown
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they did not want to
 * disclose their financials
 */
export function showFinancialConfirmation(formData) {
  const { discloseFinancialInformation } = formData;
  return notShortFormEligible(formData) && !discloseFinancialInformation;
}

/**
 * Helper that determines if financial information is being collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they wanted to disclose
 * their financials
 */
export function includeHouseholdInformation(formData) {
  const { discloseFinancialInformation } = formData;
  return notShortFormEligible(formData) && discloseFinancialInformation;
}

/**
 * Helper that determines if the form data contains values that require users
 * to fill out spousal information
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user declares they would like to provide their
 * financial data & have a marital status of 'married' or 'separated'
 */
export function includeSpousalInformation(formData) {
  const { maritalStatus } = formData;
  const hasSpouseToDeclare =
    maritalStatus?.toLowerCase() === 'married' ||
    maritalStatus?.toLowerCase() === 'separated';
  return includeHouseholdInformation(formData) && hasSpouseToDeclare;
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
  const { isEnrolledMedicarePartA } = formData;
  return notShortFormEligible(formData) && isEnrolledMedicarePartA;
}

/**
 * Helper that determines if we should display the Lighthouse facility list
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `true`
 */
export function useLighthouseFacilityList(formData) {
  return formData['view:isFacilitiesApiEnabled'];
}

/**
 * Helper that determines if we should display the hardcoded facility list
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export function useJsonFacilityList(formData) {
  return !useLighthouseFacilityList(formData);
}
