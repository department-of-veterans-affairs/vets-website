import { isAfter, isValid } from 'date-fns';
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
 * Validates basic required fields for all applicants
 * @param {Object} item - The applicant item data
 * @returns {boolean} - true if any basic field is missing
 */
const validateApplicantBasicFields = item => {
  const {
    applicantName,
    applicantDob,
    applicantSSN,
    applicantGender: { gender } = {},
    applicantPhone,
    applicantAddress: { street, city, state } = {},
    applicantRelationshipToSponsor,
  } = item ?? {};

  if (!applicantName?.first || !applicantName?.last) return true;
  if (!applicantDob) return true;
  if (!applicantSSN) return true;
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
 * Validates file upload has proper structure
 * @param {Array} fileArray - Array of uploaded files
 * @returns {boolean} - true if file upload is invalid
 */
const validateFileUpload = fileArray =>
  !fileArray || !Array.isArray(fileArray) || !fileArray[0]?.name;

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
    validateFileUpload(applicantBirthCertOrSocialSecCard)
  ) {
    return true;
  }

  if (
    relationshipOrigin === 'adoption' &&
    validateFileUpload(applicantAdoptionPapers)
  ) {
    return true;
  }

  return (
    relationshipOrigin === 'step' &&
    validateFileUpload(applicantStepMarriageCert)
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
      validateFileUpload(applicantSchoolCert)
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
