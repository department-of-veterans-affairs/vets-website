import { add, isAfter, isBefore, isValid } from 'date-fns';
import { isValidSSN } from 'platform/forms-system/src/js/utilities/validations';
import { minYear } from 'platform/forms-system/src/js/helpers';
import {
  convertToDateField,
  validateDate,
} from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';
import content from '../locales/en/content.json';

const ERR_FUTURE_DATE = content['validation--date-range--future'];
const ERR_SSN_UNIQUE = content['validation--ssn-unique'];
const ERR_SSN_INVALID = content['validation--ssn-invalid'];

const normalizeSSN = val => String(val ?? '').replace(/\D/g, '');

const getCurrentItemIndex = () => {
  try {
    const pathname = window?.location?.pathname || '';
    const match = pathname.match(/\/(\d+)(?:\?|$)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
};

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
 * @returns {number|null} returns.currentIndex - The current array index, if the URL param exists
 */
const getSsnMatches = (fullData, current) => {
  const currentIndex = getCurrentItemIndex();
  const sponsor = normalizeSSN(fullData?.sponsorSsn);
  const applicants = (fullData?.applicants ?? [])
    .map(a => normalizeSSN(a?.applicantSsn))
    .filter(Boolean);

  const sponsorMatch = sponsor === current;
  const applicantMatches = applicants.filter(
    (ssn, index) =>
      ssn === current && (currentIndex === null || index !== currentIndex),
  ).length;

  return { sponsorMatch, applicantMatches, currentIndex };
};

/**
 * Validates that an SSN is valid and unique among all form participants.
 *
 * @param {Object} options
 * @param {Object} options.errors - The validation errors object to add errors to
 * @param {string} options.fieldData - The SSN field data to validate
 * @param {Object} options.fullData - The complete form data for cross-reference checking
 * @param {boolean} [options.isSponsor=false] - Whether this is validating the sponsor's SSN
 */
const validateUniqueSsn = ({
  errors,
  fieldData,
  fullData,
  isSponsor = false,
} = {}) => {
  const current = normalizeSSN(fieldData);
  if (!current) return;

  if (!isValidSSN(current)) {
    errors.addError(ERR_SSN_INVALID);
    return;
  }

  const { sponsorMatch, applicantMatches, currentIndex } = getSsnMatches(
    fullData,
    current,
  );

  if (!isSponsor && sponsorMatch) {
    errors.addError(ERR_SSN_UNIQUE);
    return;
  }

  const duplicateThreshold = !isSponsor && currentIndex === null ? 1 : 0;
  if (applicantMatches > duplicateThreshold) {
    errors.addError(ERR_SSN_UNIQUE);
  }
};

export const validateSponsorSsn = (errors, fieldData, fullData) => {
  validateUniqueSsn({ errors, fieldData, fullData, isSponsor: true });
};

export const validateApplicantSsn = (errors, fieldData, fullData) => {
  validateUniqueSsn({ errors, fieldData, fullData });
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
 * Validates file upload has proper structure
 * @param {Array} fileArray - Array of uploaded files
 * @returns {boolean} - true if file upload is valid
 */
const hasValidUpload = fileArray =>
  Array.isArray(fileArray) && fileArray[0]?.name;

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

  const isValidEffectiveDate = dateString => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const oneYearFromNow = add(new Date(), { years: 1 });
    return isValid(date) && !isAfter(date, oneYearFromNow);
  };

  const isValidPastDate = dateString => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return isValid(date) && isBefore(date, new Date());
  };

  if (!medicarePlanType) return true;

  const planValidations = {
    ab: () => {
      if (
        !isValidEffectiveDate(medicarePartAEffectiveDate) ||
        !isValidEffectiveDate(medicarePartBEffectiveDate)
      ) {
        return true;
      }
      return (
        !hasValidUpload(medicarePartAPartBFrontCard) ||
        !hasValidUpload(medicarePartAPartBBackCard)
      );
    },
    a: () => {
      if (!isValidEffectiveDate(medicarePartAEffectiveDate)) {
        return true;
      }
      return (
        !hasValidUpload(medicarePartAFrontCard) ||
        !hasValidUpload(medicarePartABackCard)
      );
    },
    b: () => {
      if (!isValidEffectiveDate(medicarePartBEffectiveDate)) {
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
        !isValidEffectiveDate(medicarePartCEffectiveDate)
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
    if (!isValidEffectiveDate(medicarePartDEffectiveDate)) return true;

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
    healthcareParticipants,
    insuranceCardFront,
    insuranceCardBack,
  } = item;

  const isValidPastDate = dateString => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return isValid(date) && isBefore(date, new Date());
  };

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

  if (!insuranceType) return true;
  if (!provider || !isValidPastDate(effectiveDate)) return true;

  if (expirationDate) {
    if (!isValidPastDate(expirationDate)) return true;
    if (!hasValidDateRange(effectiveDate, expirationDate)) return true;
  }

  if (insuranceType === 'medigap' && !medigapPlan) return true;
  if (throughEmployer === undefined || throughEmployer === null) return true;
  if (eob === undefined || eob === null) return true;

  if (!hasValidParticipants(healthcareParticipants)) return true;

  return (
    !hasValidUpload(insuranceCardFront) || !hasValidUpload(insuranceCardBack)
  );
};

/**
 * Validates basic required fields for all applicants
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if any basic field is missing
 */
const validateApplicantBasicFields = item => {
  const {
    applicantName,
    applicantDob,
    applicantSsn,
    applicantGender: { gender } = {},
    applicantPhone,
    applicantAddress: { street, city, state } = {},
    applicantRelationshipToSponsor,
  } = item ?? {};

  if (!applicantName?.first || !applicantName?.last) return true;
  if (!applicantDob) return true;
  if (!applicantSsn) return true;
  if (!gender) return true;
  if (!applicantPhone) return true;
  if (!street || !city || !state) return true;
  return !applicantRelationshipToSponsor?.relationshipToVeteran;
};

/**
 * Validates date of birth is valid and not in future
 * @param {string} applicantDob - Date of birth string
 * @returns {boolean} - true if date is invalid
 */
const validateApplicantDateOfBirth = applicantDob => {
  if (!isValid(new Date(applicantDob))) return true;
  return isAfter(new Date(applicantDob), new Date());
};

/**
 * Validates child-specific document requirements based on relationship origin
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if child documents are incomplete
 */
const validateChildDocuments = item => {
  const {
    applicantRelationshipOrigin,
    applicantBirthCertOrSocialSecCard,
    applicantAdoptionPapers,
    applicantStepMarriageCert,
  } = item;
  const relationshipOrigin = applicantRelationshipOrigin?.relationshipToVeteran;

  if (!relationshipOrigin) return true;

  if (
    (relationshipOrigin === 'adoption' || relationshipOrigin === 'step') &&
    !hasValidUpload(applicantBirthCertOrSocialSecCard)
  ) {
    return true;
  }

  if (
    relationshipOrigin === 'adoption' &&
    !hasValidUpload(applicantAdoptionPapers)
  ) {
    return true;
  }

  return (
    relationshipOrigin === 'step' && !hasValidUpload(applicantStepMarriageCert)
  );
};

/**
 * Validates age-based dependent status for children (18-23 years old)
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if dependent status is incomplete
 */
const validateChildDependentStatus = item => {
  const { applicantDob, applicantDependentStatus, applicantSchoolCert } = item;
  const birthDate = new Date(applicantDob);
  const age = Math.floor(
    (new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000),
  );

  if (age >= 18 && age <= 23) {
    if (!applicantDependentStatus?.status) return true;
    if (
      ['enrolled', 'intendsToEnroll'].includes(
        applicantDependentStatus.status,
      ) &&
      !hasValidUpload(applicantSchoolCert)
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Validates child-specific requirements
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if child validation fails
 */
const validateChildRequirements = item => {
  if (validateChildDocuments(item)) return true;
  return validateChildDependentStatus(item);
};

/**
 * Validates marriage date requirements for spouses
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if marriage date validation fails
 */
const validateSpouseMarriageDate = item => {
  const { applicantDob, dateOfMarriageToSponsor } = item;
  if (!dateOfMarriageToSponsor) return true;
  if (!isValid(new Date(dateOfMarriageToSponsor))) return true;
  if (isAfter(new Date(dateOfMarriageToSponsor), new Date())) return true;
  return isAfter(new Date(applicantDob), new Date(dateOfMarriageToSponsor));
};

/**
 * Validates spouse-specific requirements
 * Note: This simplified version doesn't handle deceased sponsor scenarios
 * since we don't have access to formData in isItemIncomplete
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if spouse validation fails
 */
const validateSpouseRequirements = item => {
  return validateSpouseMarriageDate(item);
};

/**
 * Validates if an applicant item is complete based on required fields
 * Note: This simplified version validates what we can without access to formData
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if item is incomplete, false if complete
 */
export const validateApplicant = (item = {}) => {
  if (validateApplicantBasicFields(item)) return true;
  if (validateApplicantDateOfBirth(item.applicantDob)) return true;

  const relationshipToVeteran =
    item.applicantRelationshipToSponsor?.relationshipToVeteran;

  if (relationshipToVeteran === 'child') {
    return validateChildRequirements(item);
  }

  if (relationshipToVeteran === 'spouse') {
    return validateSpouseRequirements(item);
  }

  return false;
};

/**
 * Validates that a date is not more than one year in the future.
 *
 * Ensures the date is valid, within the allowed year range (minYear to current year + 1),
 * and not more than one calendar year from today. Used for dates that should be current or near-future.
 *
 * @param {Object} errors - The errors object to add validation errors to
 * @param {string} dateString - The date string to validate (format: 'YYYY-MM-DD')
 * @param {Object} formData - The complete form data object
 * @param {Object} schema - The JSON schema for the date field
 * @param {Object} [errorMessages={}] - Optional custom error messages to override defaults
 */
export const validateFutureDate = (
  errors,
  dateString,
  formData,
  schema,
  errorMessages = {},
) => {
  const yearFromToday = add(new Date(), { years: 1 });
  const maxYear = new Date().getFullYear() + 1;

  validateDate(
    errors,
    dateString,
    formData,
    schema,
    errorMessages,
    undefined,
    undefined,
    minYear,
    maxYear,
  );

  const date = dateString ? new Date(dateString) : null;
  if (date && isValid(date) && isAfter(date, yearFromToday)) {
    errors.addError(ERR_FUTURE_DATE);
  }
};
