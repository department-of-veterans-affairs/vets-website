import { isBefore, isValid } from 'date-fns';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';

/**
 * Validates an applicant's date of marriage to sponsor is not before
 * said applicant's date of birth.
 * @param {Object} errors - The errors object for the current page
 * @param {Object} page - The current page data
 */
export const validateMarriageAfterDob = (errors, page) => {
  const difference =
    Date.parse(page?.dateOfMarriageToSponsor) - Date.parse(page?.applicantDob);

  if (difference !== undefined && difference <= 0) {
    errors.dateOfMarriageToSponsor.addError(
      'Date of marriage must be after applicant’s date of birth',
    );
  }
};

/**
 * Validates Medicare termination date not before the effective date
 * @param {Object} errors - object holding the error message content
 * @param {Object} data - field data from the form inputs
 */
export const validateMedicarePartDDates = (errors, data) => {
  const { medicarePartDEffectiveDate, medicarePartDTerminationDate } = data;
  const fromDate = convertToDateField(medicarePartDEffectiveDate);
  const toDate = convertToDateField(medicarePartDTerminationDate);

  if (
    medicarePartDTerminationDate &&
    !isValid(new Date(medicarePartDTerminationDate))
  ) {
    errors.medicarePartDTerminationDate.addError(
      'Please enter a valid current or past date',
    );
  }

  if (!isValidDateRange(fromDate, toDate)) {
    errors.medicarePartDTerminationDate.addError(
      'Termination date must be after the effective date',
    );
  }
};

/**
 * Validates Other Health Insurance termination date not before the effective date
 * @param {Object} errors - object holding the error message content
 * @param {Object} data - field data from the form inputs
 */
export const validateOHIDates = (errors, data) => {
  const { effectiveDate, expirationDate } = data;
  const fromDate = convertToDateField(effectiveDate);
  const toDate = convertToDateField(expirationDate);

  if (expirationDate && !isValid(new Date(expirationDate))) {
    errors.expirationDate.addError('Please enter a valid current or past date');
  }

  if (!isValidDateRange(fromDate, toDate)) {
    errors.expirationDate.addError(
      'Termination date must be after the effective date',
    );
  }
};

/**
 * Validates Medicare plan fields for a given form item.
 *
 * Returns `true` when the item is **invalid** (i.e., has missing or bad data)
 * and `false` when all required fields are valid for the selected plan type.
 *
 * @param {Object} [item={}] Form data to validate.
 * @property {string} item.medicarePlanType The selected Medicare plan type. One of: 'A', 'B', 'C', 'D', 'A_B', 'NONE'.
 * @property {string} [item.medicarePartCCarrier] Name of the Medicare Part C (Medicare Advantage) carrier. Required if medicarePlanType is 'C'.
 * @property {string} [item.medicarePartCEffectiveDate] Effective date for Medicare Part C. Required if medicarePlanType is 'C'.
 * @property {boolean} [item.hasMedicarePartD] Whether the applicant has Medicare Part D. Required if medicarePlanType is 'D'.
 * @property {string} [item.medicarePartDEffectiveDate] Effective date for Medicare Part D. Required if medicarePlanType is 'D'.
 * @property {string} [item.medicarePartDTerminationDate] Termination date for Medicare Part D, if applicable.
 * @property {string} [item.medicarePartAFrontCard] Image or file reference for the front of the Medicare Part A card. Required if medicarePlanType is 'A' or 'A_B'.
 * @property {string} [item.medicarePartABackCard] Image or file reference for the back of the Medicare Part A card. Required if medicarePlanType is 'A' or 'A_B'.
 * @property {string} [item.medicarePartBFrontCard] Image or file reference for the front of the Medicare Part B card. Required if medicarePlanType is 'B' or 'A_B'.
 * @property {string} [item.medicarePartBBackCard] Image or file reference for the back of the Medicare Part B card. Required if medicarePlanType is 'B' or 'A_B'.
 * @property {string} [item.medicarePartAPartBFrontCard] Image or file reference for the front of a combined Medicare Part A/B card. Required if medicarePlanType is 'A_B'.
 * @property {string} [item.medicarePartAPartBBackCard] Image or file reference for the back of a combined Medicare Part A/B card. Required if medicarePlanType is 'A_B'.
 * @property {string} [item.medicarePartCFrontCard] Image or file reference for the front of the Medicare Part C card. Required if medicarePlanType is 'C'.
 * @property {string} [item.medicarePartCBackCard] Image or file reference for the back of the Medicare Part C card. Required if medicarePlanType is 'C'.
 * @property {string} [item.medicarePartDFrontCard] Image or file reference for the front of the Medicare Part D card. Required if medicarePlanType is 'D'.
 * @property {string} [item.medicarePartDBackCard] Image or file reference for the back of the Medicare Part D card. Required if medicarePlanType is 'D'.
 *
 * @returns {boolean} `true` if validation fails (invalid/missing fields); `false` if the item is valid.
 */
export const validateMedicarePlan = (item = {}) => {
  const {
    medicarePlanType,
    medicarePartCCarrier,
    medicarePartCEffectiveDate,
    hasMedicarePartD,
    medicarePartDEffectiveDate,
    medicarePartDTerminationDate,
    medicarePartAFrontCard,
    medicarePartABackCard,
    medicarePartBFrontCard,
    medicarePartBBackCard,
    medicarePartAPartBFrontCard,
    medicarePartAPartBBackCard,
    medicarePartCFrontCard,
    medicarePartCBackCard,
    medicarePartDFrontCard,
    medicarePartDBackCard,
  } = item;
  const medicarePartAEffectiveDate =
    item['view:medicarePartAEffectiveDate']?.medicarePartAEffectiveDate;
  const medicarePartBEffectiveDate =
    item['view:medicarePartBEffectiveDate']?.medicarePartBEffectiveDate;

  const isValidPastDate = dateString => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return isValid(date) && isBefore(date, new Date());
  };

  const hasValidUpload = fileArray =>
    Array.isArray(fileArray) && fileArray[0]?.name;

  if (!medicarePlanType) return true;

  const planValidations = {
    ab: () => {
      if (
        !isValidPastDate(medicarePartAEffectiveDate) ||
        !isValidPastDate(medicarePartBEffectiveDate)
      ) {
        return true;
      }
      return (
        !hasValidUpload(medicarePartAPartBFrontCard) ||
        !hasValidUpload(medicarePartAPartBBackCard)
      );
    },
    a: () => {
      if (!isValidPastDate(medicarePartAEffectiveDate)) {
        return true;
      }
      return (
        !hasValidUpload(medicarePartAFrontCard) ||
        !hasValidUpload(medicarePartABackCard)
      );
    },
    b: () => {
      if (!isValidPastDate(medicarePartBEffectiveDate)) {
        return true;
      }
      return (
        !hasValidUpload(medicarePartBFrontCard) ||
        !hasValidUpload(medicarePartBBackCard)
      );
    },
    c: () => {
      if (
        !medicarePartCCarrier ||
        !isValidPastDate(medicarePartCEffectiveDate)
      ) {
        return true;
      }
      return (
        !hasValidUpload(medicarePartCFrontCard) ||
        !hasValidUpload(medicarePartCBackCard)
      );
    },
  };

  const validator = planValidations[medicarePlanType];
  if (!validator || validator()) return true;

  const supportsPartD = ['ab', 'c'].includes(medicarePlanType);
  if (supportsPartD && hasMedicarePartD === true) {
    if (!isValidPastDate(medicarePartDEffectiveDate)) return true;

    if (
      medicarePartDTerminationDate &&
      !isValidPastDate(medicarePartDTerminationDate)
    ) {
      return true;
    }

    if (
      !hasValidUpload(medicarePartDFrontCard) ||
      !hasValidUpload(medicarePartDBackCard)
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Validates health insurance plan fields for a given form item.
 *
 * Returns `true` when the item is **invalid** (i.e., has missing or bad data)
 * and `false` when all required fields are valid for the selected plan type.
 *
 * @param {Object} [item={}] Form data to validate.
 * @property {string} insuranceType - The type of insurance plan (e.g., 'medigap', 'private', etc.).
 * @property {string} provider - The name of the insurance provider.
 * @property {string} effectiveDate - The date the insurance plan became effective (YYYY-MM-DD).
 * @property {string} [expirationDate] - The date the insurance plan expires (YYYY-MM-DD), if applicable.
 * @property {string} [medigapPlan] - The Medigap plan identifier, required if insuranceType is 'medigap'.
 * @property {boolean} throughEmployer - Whether the plan is through an employer.
 * @property {boolean} eob - Whether an Explanation of Benefits (EOB) is provided.
 * @property {string} [additionalComments] - Optional additional comments (max 200 characters).
 * @property {Object.<string, boolean>} healthcareParticipants - Object mapping participant keys to true/false indicating coverage.
 * @property {Array<Object>} insuranceCardFront - Array of uploaded files for the front of the insurance card.
 * @property {Array<Object>} insuranceCardBack - Array of uploaded files for the back of the insurance card.
 *
 * @returns {boolean} `true` if validation fails (invalid/missing fields); `false` if the item is valid.
 */
export const validateHealthInsurancePlan = (item = {}) => {
  const {
    insuranceType,
    provider,
    effectiveDate,
    expirationDate,
    medigapPlan,
    throughEmployer,
    eob,
    additionalComments,
    healthcareParticipants,
    insuranceCardFront,
    insuranceCardBack,
  } = item;

  const isValidPastDate = dateString => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return isValid(date) && isBefore(date, new Date());
  };

  const hasValidUpload = fileArray =>
    Array.isArray(fileArray) && fileArray[0]?.name;

  const hasValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    const fromDate = convertToDateField(startDate);
    const toDate = convertToDateField(endDate);
    return isValidDateRange(fromDate, toDate);
  };

  const hasValidParticipants = participants => {
    if (!participants || typeof participants !== 'object') return false;
    return Object.values(participants).some(value => value === true);
  };

  const isValidComments = comments =>
    !comments || (typeof comments === 'string' && comments.length <= 200);

  if (!insuranceType) return true;
  if (!provider || !isValidPastDate(effectiveDate)) return true;

  if (expirationDate) {
    if (!isValidPastDate(expirationDate)) return true;
    if (!hasValidDateRange(effectiveDate, expirationDate)) return true;
  }

  if (insuranceType === 'medigap' && !medigapPlan) return true;
  if (throughEmployer === undefined || throughEmployer === null) return true;
  if (eob === undefined || eob === null) return true;

  if (!isValidComments(additionalComments)) return true;
  if (!hasValidParticipants(healthcareParticipants)) return true;

  return (
    !hasValidUpload(insuranceCardFront) || !hasValidUpload(insuranceCardBack)
  );
};
