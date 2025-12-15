import { isBefore, isValid } from 'date-fns';
import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';

/**
 * Generic validator for date ranges with effective/termination or effective/expiration date patterns
 * @param {Object} errors - object holding the error message content
 * @param {Object} data - field data from the form inputs
 * @param {Object} options - configuration options
 * @param {string} options.startDateKey - key name for the effective/start date field
 * @param {string} options.endDateKey - key name for the termination/expiration/end date field
 * @param {string} [options.invalidDateMessage] - custom error message for invalid dates
 * @param {string} [options.rangeErrorMessage] - custom error message for invalid date range
 */
export const validateDateRange = (errors, data, options = {}) => {
  const {
    startDateKey,
    endDateKey,
    invalidDateMessage = 'Please provide a valid current or past date',
    rangeErrorMessage = 'Termination date must be after the effective date',
  } = options;

  const startDate = data[startDateKey];
  const endDate = data[endDateKey];

  const fromDate = convertToDateField(startDate);
  const toDate = convertToDateField(endDate);

  // Validate end date is a valid date if provided
  if (endDate && !isValid(new Date(endDate))) {
    errors[endDateKey].addError(invalidDateMessage);
    return;
  }

  // Validate date range (end date must be after effective date)
  if (!isValidDateRange(fromDate, toDate)) {
    errors[endDateKey].addError(rangeErrorMessage);
  }
};

/**
 * Validates health insurance plan fields for a given array item.
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

  const hasValidUpload = fileArray =>
    Array.isArray(fileArray) && fileArray[0]?.name;

  const isValidComments = comments =>
    !comments || (typeof comments === 'string' && comments.length <= 200);

  const isValidPastDate = dateString => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return isValid(date) && isBefore(date, new Date());
  };

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
