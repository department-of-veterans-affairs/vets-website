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

/**
 * Validates health insurance plan fields for a given form item.
 *
 * Returns `true` when the item is **invalid** (i.e., has missing or bad data)
 * and `false` when all required fields are valid for the selected plan type.
 *
 * @param {Object} [item={}] Form data to validate.
 * @property {'hmo'|'ppo'|'medicaid'|'medigap'|'other'} [item.insuranceType] Selected insurance type. **Required if any health insurance data is present**.
 * @property {string} [item.provider] Required insurance provider name.
 * @property {string} [item.effectiveDate] Required past date for insurance start date.
 * @property {string} [item.expirationDate] Optional; if provided, must be a past date and after effective date.
 * @property {string} [item.medigapPlan] Required when `insuranceType === 'medigap'`.
 * @property {boolean} [item.throughEmployer] Required boolean indicating if insurance is through employer.
 * @property {boolean} [item.eob] Required boolean indicating if insurance covers prescriptions.
 * @property {string} [item.additionalComments] Optional additional comments (max 200 chars).
 * @property {Object} [item.healthcareParticipants] Required object indicating which applicants are covered.
 * @property {Array} [item.insuranceCardFront] Required uploaded file array for front of insurance card.
 * @property {Array} [item.insuranceCardBack] Required uploaded file array for back of insurance card.
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
