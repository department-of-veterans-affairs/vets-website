import { isBefore, isValid } from 'date-fns';
import { isValidSSN } from 'platform/forms-system/src/js/utilities/validations';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';
import content from '../locales/en/content.json';

const ERR_SSN_UNIQUE = content['validation--ssn-unique'];
const ERR_SSN_INVALID = content['validation--ssn-invalid'];

const normalizeSSN = val => `${val ?? ''}`.replace(/\D/g, '');

/**
 * Analyzes SSN matches between sponsor and applicants in form data.
 *
 * @param {Object} fullData - The complete form data object
 * @param {string} fullData.sponsorSsn - The sponsor's Social Security Number
 * @param {Array} fullData.applicants - Array of applicant objects
 * @param {string} fullData.applicants[].applicantSsn - Each applicant's Social Security Number
 * @param {string} current - The SSN to check for matches (normalized, digits only)
 * @returns {Object} Match results
 * @returns {boolean} returns.sponsorMatch - True if current SSN matches the sponsor's SSN
 * @returns {number} returns.applicantMatches - Count of applicants with matching SSN
 */
const getSsnMatches = (fullData, current) => {
  const sponsor = normalizeSSN(fullData?.sponsorSsn);
  const applicants = (fullData?.applicants ?? [])
    .map(a => normalizeSSN(a?.applicantSsn))
    .filter(Boolean);
  return {
    sponsorMatch: !!sponsor && sponsor === current,
    applicantMatches: applicants.filter(ssn => ssn === current).length,
  };
};

/**
 * Validates that a sponsor's SSN is valid and unique among applicants.
 * Adds validation errors if the SSN is invalid or already used by an applicant.
 *
 * @param {Object} errors - The validation errors object to add errors to
 * @param {string} fieldData - The sponsor's SSN field data to validate
 * @param {Object} fullData - The complete form data for cross-reference checking
 * @param {Array} fullData.applicants - Array of applicant objects to check against
 * @returns {void}
 */
export const validateSponsorSsn = (errors, fieldData, fullData) => {
  const current = normalizeSSN(fieldData);
  if (!current) return;

  if (!isValidSSN(current)) {
    errors.addError(ERR_SSN_INVALID);
    return;
  }

  const { applicantMatches } = getSsnMatches(fullData, current);
  if (applicantMatches >= 1) errors.addError(ERR_SSN_UNIQUE);
};

/**
 * Validates that an applicant's SSN is valid and unique among all form participants.
 * Adds validation errors if the SSN is invalid, matches the sponsor's SSN, or is already used by another applicant.
 *
 * @param {Object} errors - The validation errors object to add errors to
 * @param {string} fieldData - The applicant's SSN field data to validate
 * @param {Object} fullData - The complete form data for cross-reference checking
 * @param {string} fullData.sponsorSsn - The sponsor's SSN to check against
 * @param {Array} fullData.applicants - Array of all applicant objects to check against
 * @returns {void}
 */
export const validateApplicantSsn = (errors, fieldData, fullData) => {
  const current = normalizeSSN(fieldData);
  if (!current) return;

  if (!isValidSSN(current)) {
    errors.addError(ERR_SSN_INVALID);
    return;
  }

  const { sponsorMatch, applicantMatches } = getSsnMatches(fullData, current);
  if (sponsorMatch || applicantMatches >= 1) errors.addError(ERR_SSN_UNIQUE);
};

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
 * @property {'ab'|'a'|'b'|'c'} [item.medicarePlanType] Selected plan type.
 *   - 'ab': Requires valid past dates for Parts A & B and uploaded cards. If Part D is present, it must have a valid past effective date, optional termination date, and uploaded cards.
 *   - 'a' : Requires a valid past Part A effective date and uploaded cards.
 *   - 'b' : Requires a valid past Part B effective date and uploaded cards.
 *   - 'c' : Requires a carrier, a valid past Part C effective date, and uploaded cards. If Part D is present, same rules as above.
 * @property {string} [item.medicarePartCCarrier] Required when `medicarePlanType === 'c'`.
 * @property {string} [item.medicarePartCEffectiveDate] Required past date when `medicarePlanType === 'c'`.
 * @property {boolean} [item.hasMedicarePartD] When `true` and plan supports Part D ('ab' or 'c'), Part D dates and cards are validated.
 * @property {string} [item.medicarePartDEffectiveDate] Required past date when Part D is present and supported.
 * @property {string} [item.medicarePartDTerminationDate] Optional; if provided, must be a past date when Part D is present and supported.
 * @property {{ medicarePartAEffectiveDate?: string }} [item['view:medicarePartAEffectiveDate']] Container for Part A effective date (must be a past date when required).
 * @property {{ medicarePartBEffectiveDate?: string }} [item['view:medicarePartBEffectiveDate']] Container for Part B effective date (must be a past date when required).
 * @property {Array} [item.medicarePartAFrontCard] Required uploaded file array for Part A front card.
 * @property {Array} [item.medicarePartABackCard] Required uploaded file array for Part A back card.
 * @property {Array} [item.medicarePartBFrontCard] Required uploaded file array for Part B front card.
 * @property {Array} [item.medicarePartBBackCard] Required uploaded file array for Part B back card.
 * @property {Array} [item.medicarePartAPartBFrontCard] Required uploaded file array for Parts A & B front card.
 * @property {Array} [item.medicarePartAPartBBackCard] Required uploaded file array for Parts A & B back card.
 * @property {Array} [item.medicarePartCFrontCard] Required uploaded file array for Part C front card.
 * @property {Array} [item.medicarePartCBackCard] Required uploaded file array for Part C back card.
 * @property {Array} [item.medicarePartDFrontCard] Required uploaded file array for Part D front card when Part D is present.
 * @property {Array} [item.medicarePartDBackCard] Required uploaded file array for Part D back card when Part D is present.
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
