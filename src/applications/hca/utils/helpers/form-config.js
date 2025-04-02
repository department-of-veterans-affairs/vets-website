import { inRange } from 'lodash';
import { isAfter, isBefore } from 'date-fns';
import { DEPENDENT_VIEW_FIELDS, HIGH_DISABILITY_MINIMUM } from '../constants';
import { replaceStrValues } from './general';
import content from '../../locales/en/content.json';

/**
 * Helper that determines if user is unauthenticated
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is truthy
 */
export const isLoggedOut = formData => {
  const { 'view:isLoggedIn': isLoggedIn } = formData;
  return !isLoggedIn;
};

/**
 * Helper that determines if the Veteran has a lower disability rating
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield value is less than the high-
 * disability minimum
 */
export const hasLowDisabilityRating = formData => {
  return formData['view:totalDisabilityRating'] < HIGH_DISABILITY_MINIMUM;
};

/**
 * Helper that determines if the Veteran has high-disability compensation from VA
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if `vaCompensationType` is set to 'highDisability'
 */
export const hasHighCompensation = formData => {
  const { vaCompensationType } = formData;
  return vaCompensationType === 'highDisability';
};

/**
 * Helper that determines if the Veteran has low-disability compensation from VA
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if `vaCompensationType` is set to 'lowDisability'
 */
export const hasLowCompensation = formData => {
  const { vaCompensationType } = formData;
  return vaCompensationType === 'lowDisability';
};

/**
 * Helper that determines if the Veteran has no compensation from VA
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if `vaCompensationType` is set to 'none'
 */
export const hasNoCompensation = formData => {
  const { vaCompensationType } = formData;
  return vaCompensationType === 'none';
};

/**
 * Helper that determines if the user is short form eligible
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the total disability rating is less than the
 * minimum percetage and the user does not self-declares they receive
 * compensation equal to that of a high-disability-rated Veteran
 */
export const notShortFormEligible = formData => {
  return hasLowDisabilityRating(formData) && !hasHighCompensation(formData);
};

/**
 * Helper that determines if the form data contains values that require users
 * to upload their military discharge papers
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is unauthenticated and was not found
 * in the MPI database
 */
export const dischargePapersRequired = formData => {
  const { 'view:isUserInMvi': isUserInMvi } = formData;
  return (
    isLoggedOut(formData) && notShortFormEligible(formData) && !isUserInMvi
  );
};

/**
 * Helper that determines if the form data contains values that indicate an
 * authenticated user is missing date of birth information from their profile
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged in and viewfield is empty
 */
export const isMissingVeteranDob = formData => {
  const { 'view:veteranInformation': veteranInfo = {} } = formData;
  const { veteranDateOfBirth } = veteranInfo;
  return !isLoggedOut(formData) && !veteranDateOfBirth;
};

/**
 * Helper that determines if the feature flag status for the registration-only question
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the form data is `true`
 */
export const isRegOnlyEnabled = formData => {
  return formData['view:isRegOnlyEnabled'];
};

/**
 * Helper that determines if the Veteran's home and mailing address are the same
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the viewfield is set to `false`
 */
export const hasDifferentHomeAddress = formData => {
  return !formData['view:doesMailingMatchHomeAddress'];
};

/**
 * Helper that determines if the registration-only questions should be show to authenticated users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged in, feature flag is active & total disability
 * rating is 10-40%
 */
export const includeRegOnlyAuthQuestions = formData => {
  const { 'view:totalDisabilityRating': totalRating } = formData;
  return (
    !isLoggedOut(formData) &&
    isRegOnlyEnabled(formData) &&
    inRange(totalRating, 10, 40)
  );
};

/**
 * Helper that determines if the registration-only questions should be show to guest users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged out, feature flag is active & VA
 * compensation is set to `lowDisability`
 */
export const includeRegOnlyGuestQuestions = formData => {
  return (
    isLoggedOut(formData) &&
    isRegOnlyEnabled(formData) &&
    hasLowCompensation(formData)
  );
};

/**
 * Helper that determines if the registration-only alert should be shown to
 * authenticated users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged in and users selected the
 * `regOnly` package
 */
export const showRegOnlyAuthConfirmation = formData => {
  const { 'view:vaBenefitsPackage': vaBenefitsPackage } = formData;
  return (
    includeRegOnlyAuthQuestions(formData) && vaBenefitsPackage === 'regOnly'
  );
};

/**
 * Helper that determines if the registration-only alert should be shown to
 * guest users
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user is logged out and users selected the
 * `regOnly` package
 */
export const showRegOnlyGuestConfirmation = formData => {
  const { 'view:vaBenefitsPackage': vaBenefitsPackage } = formData;
  return (
    includeRegOnlyGuestQuestions(formData) && vaBenefitsPackage === 'regOnly'
  );
};

/**
 * Helper that determines if the form data contains values that indicate the
 * user wants to fill out information related to toxic exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the toxic exposure quesions are enabled and
 * the user indicated they wanted to fill out questions related to exposure
 */
export const includeTeraInformation = formData => {
  const { hasTeraResponse } = formData;
  return hasTeraResponse;
};

/**
 * Helper that determines if the form data indicates the user has a birthdate that
 * makes them eligibile for radiation clean-up efforts
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user was born before Jan 1, 1966
 */
export const includeRadiationCleanUpEfforts = formData => {
  const { veteranDateOfBirth } = formData;
  const couldHaveServed = isBefore(
    new Date(veteranDateOfBirth),
    new Date('1966-01-01'),
  );
  return includeTeraInformation(formData) && couldHaveServed;
};

/**
 * Helper that determines if the form data indicates the user has a birthdate that
 * makes them eligibile for gulf war service
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user was born before Feb 29, 1976
 */
export const includeGulfWarService = formData => {
  const { veteranDateOfBirth } = formData;
  const couldHaveServed = isBefore(
    new Date(veteranDateOfBirth),
    new Date('1976-02-29'),
  );
  return includeTeraInformation(formData) && couldHaveServed;
};

/**
 * Helper that determines if the form data contains values that indicate the
 * user served in specific gulf war locations
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they served in the specified
 * Gulf War locations
 */
export const includeGulfWarServiceDates = formData => {
  const { gulfWarService } = formData;
  return (
    includeTeraInformation(formData) &&
    includeGulfWarService(formData) &&
    gulfWarService
  );
};

/**
 * Helper that determines if the form data indicates the user has a birthdate that
 * makes them eligibile for post-9/11 service
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user was born after Feb 28, 1976
 */
export const includePostSept11Service = formData => {
  const { veteranDateOfBirth } = formData;
  const couldHaveServed = isAfter(
    new Date(veteranDateOfBirth),
    new Date('1976-02-28'),
  );
  return includeTeraInformation(formData) && couldHaveServed;
};

/**
 * Helper that determines if the form data contains values that indicate the
 * user served in specific post-9/11 locations
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they served in the specified
 * post-9/11 locations
 */
export const includePostSept11ServiceDates = formData => {
  const { gulfWarService } = formData;
  return (
    includeTeraInformation(formData) &&
    includePostSept11Service(formData) &&
    gulfWarService
  );
};

/**
 * Helper that determines if the form data indicates the user has a birthdate that
 * makes them eligibile for agent orange exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user was born before Aug 1, 1965 or earlier
 */
export const includeAgentOrangeExposure = formData => {
  const { veteranDateOfBirth } = formData;
  const couldHaveServed = isBefore(
    new Date(veteranDateOfBirth),
    new Date('1965-08-01'),
  );
  return includeTeraInformation(formData) && couldHaveServed;
};

/**
 * Helper that determines if the form data contains values that indicate the
 * user has a specified other toxic exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they have a specified
 * toxic exposure
 */
export const includeOtherExposureDates = formData => {
  const { 'view:otherToxicExposures': otherToxicExposures = {} } = formData;
  const exposures = Object.values(otherToxicExposures);
  return includeTeraInformation(formData) && exposures.some(o => o);
};

/**
 * Helper that determines if the form data contains values that indicate the
 * user has a specified other toxic exposure
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they had a toxic exposure
 * that was not on the specified list
 */
export const includeOtherExposureDetails = formData => {
  return (
    includeTeraInformation(formData) &&
    formData['view:otherToxicExposures']?.exposureToOther
  );
};

/**
 * Helper that determines if financial confirmation alert is to be shown
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they did not want to
 * disclose their financials
 */
export const showFinancialConfirmation = formData => {
  const { discloseFinancialInformation } = formData;
  return notShortFormEligible(formData) && !discloseFinancialInformation;
};

/**
 * Helper that determines if financial information is being collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user indicated they wanted to disclose
 * their financials
 */
export const includeHouseholdInformation = formData => {
  const { discloseFinancialInformation } = formData;
  return notShortFormEligible(formData) && discloseFinancialInformation;
};

/**
 * Helper that determines if the form data contains values that require users
 * to fill out spousal information
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if the user declares they would like to provide their
 * financial data & have a marital status of 'married' or 'separated'
 */
export const includeSpousalInformation = formData => {
  const { maritalStatus } = formData;
  const hasSpouseToDeclare =
    maritalStatus?.toLowerCase() === 'married' ||
    maritalStatus?.toLowerCase() === 'separated';
  return includeHouseholdInformation(formData) && hasSpouseToDeclare;
};

/**
 * Helper that determines if the Veteran & their spouse cohabitated last year
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if cohabitedLastYear is set to `false` and spousal
 * information should be included in the form
 */
export const spouseDidNotCohabitateWithVeteran = formData => {
  const { cohabitedLastYear } = formData;
  return includeSpousalInformation(formData) && !cohabitedLastYear;
};

/**
 * Helper that determines if the Veteran's spouse has the same address
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if sameAddress is set to `false` and spousal
 * information should be included in the form
 */
export const spouseAddressDoesNotMatchVeterans = formData => {
  const { sameAddress } = formData;
  return includeSpousalInformation(formData) && !sameAddress;
};

/**
 * Helper that determines if dependent information needs to be collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export const includeDependentInformation = formData => {
  return (
    includeHouseholdInformation(formData) &&
    !formData[DEPENDENT_VIEW_FIELDS.skip]
  );
};

/**
 * Helper that determines if insurance policy information needs to be collected
 * @param {Object} formData - the current data object passed from the form
 * @returns {Boolean} - true if viewfield is set to `false`
 */
export const collectMedicareInformation = formData => {
  const { isEnrolledMedicarePartA } = formData;
  return notShortFormEligible(formData) && isEnrolledMedicarePartA;
};

/**
 * Helper that determines if we should display the hardcoded facility list
 * @param {Object} testItem (optional) - mocked sample data for unit testing purposes
 * @returns {Array} - array of override values for the Array Builder options
 */
export const insuranceTextOverrides = () => {
  return {
    getItemName: item => item?.insuranceName || '—',
    cardDescription: item =>
      replaceStrValues(
        content['insurance-info--card-description'],
        item?.insurancePolicyHolderName || '—',
      ),
    cancelAddTitle: () => content['insurance-info--array-cancel-add-title'],
    cancelEditTitle: () => content['insurance-info--array-cancel-edit-title'],
    cancelEditDescription: () =>
      content['insurance-info--array-cancel-edit-description'],
    cancelEditReviewDescription: () =>
      content['insurance-info--array-cancel-edit-review-description'],
    cancelAddYes: () => content['insurance-info--array-cancel-add-yes'],
    cancelEditYes: () => content['insurance-info--array-cancel-edit-yes'],
  };
};
