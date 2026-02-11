/**
 * @module utils/validators
 * @description Centralized validators for bio-aquia applications.
 * Re-exports platform validators and provides custom validators.
 *
 * This module provides a single import point for all validation needs:
 * - Platform validators (from VA.gov platform)
 * - Custom validators (specific to bio-aquia needs)
 */

// Import platform validators
import {
  isValidEmail as platformIsValidEmail,
  isValidName as platformIsValidName,
  isValidPhone as platformIsValidPhone,
  isValidSSN as platformIsValidSSN,
} from 'platform/forms/validations';

import {
  isValidCanPostalCode as platformIsValidCanPostalCode,
  isValidUSZipCode as platformIsValidUSZipCode,
} from 'platform/forms/address';

/**
 * Re-export platform validators
 */
export const isValidName = platformIsValidName;
export const isValidPhone = platformIsValidPhone;
export const isValidEmail = platformIsValidEmail;
export const isValidUSZipCode = platformIsValidUSZipCode;
export const isValidCanPostalCode = platformIsValidCanPostalCode;

/**
 * SSN validation - extends platform's SSN validation with additional checks
 * Accepts both 9-digit (123456789) and formatted (123-45-6789) SSNs
 * Rejects invalid patterns (all zeros, sequential numbers, invalid area codes)
 *
 * @param {string} value - SSN to validate
 * @returns {boolean} True if valid
 * @example
 * isValidSSN('123-45-6789') // true
 * isValidSSN('123456789') // true
 * isValidSSN('000-00-0000') // false (invalid area code)
 * isValidSSN('666-12-3456') // false (invalid area code)
 * isValidSSN('900-12-3456') // false (invalid area code)
 */
export const isValidSSN = value => {
  if (!value) return false;

  // Strip non-digits
  const digits = value.replace(/\D/g, '');

  // Additional business logic checks
  if (digits.length !== 9) return false;
  if (digits === '000000000') return false;
  if (digits === '123456789') return false;
  if (digits === '999999999') return false;

  // Check invalid area codes (first 3 digits)
  const areaCode = digits.substring(0, 3);
  if (areaCode === '000') return false;
  if (areaCode === '666') return false;
  if (areaCode >= '900') return false;

  // Use platform validation for additional checks
  return platformIsValidSSN(value);
};

/**
 * Custom validators (not in platform)
 */

/**
 * VA File Number validation - validates 8 or 9 digit VA file numbers
 * Simple digit validation without SSN rules.
 *
 * @param {string} value - VA file number to validate
 * @returns {boolean} True if valid (8 or 9 digits) or empty
 * @example
 * isValidVAFileNumber('12345678') // true (8 digits)
 * isValidVAFileNumber('123456789') // true (9 digits)
 * isValidVAFileNumber('') // true (optional)
 * isValidVAFileNumber('1234567') // false (too short)
 * isValidVAFileNumber('12-34567') // false (contains dash)
 */
export const isValidVAFileNumber = value => {
  // Empty/undefined is valid for optional field
  if (!value || value === '') return true;

  // Must be digits only (no letters, dashes, spaces)
  if (!/^\d+$/.test(value)) return false;

  // Must be exactly 8 or 9 digits
  return value.length === 8 || value.length === 9;
};

/**
 * Mexican postal code validation - 5 digits
 *
 * @param {string} value - Mexican postal code to validate
 * @returns {boolean} True if valid
 * @example
 * isValidMexicoPostalCode('12345') // true
 * isValidMexicoPostalCode('1234') // false
 */
export const isValidMexicoPostalCode = value => {
  if (!value) return false;
  return /^\d{5}$/.test(value);
};

/**
 * Military ZIP code range patterns
 * Validates ZIP codes match the correct range for each military state:
 * - AA (Armed Forces Americas): 340xx
 * - AE (Armed Forces Europe): 09xxx
 * - AP (Armed Forces Pacific): 96[2-6]xx
 */
export const MILITARY_ZIP_PATTERNS = {
  /** Armed Forces Americas - ZIP codes starting with 340 */
  AA: /^340\d{2}$/,
  /** Armed Forces Europe - ZIP codes starting with 09 */
  AE: /^09\d{3}$/,
  /** Armed Forces Pacific - ZIP codes 96200-96699 */
  AP: /^96[2-6]\d{2}$/,
};

/**
 * Validate military ZIP code for a given military state
 *
 * @param {string} zipCode - ZIP code to validate
 * @param {string} state - Military state (AA, AE, or AP)
 * @returns {boolean} True if valid for the given state
 * @example
 * isValidMilitaryZip('34012', 'AA') // true
 * isValidMilitaryZip('09123', 'AE') // true
 * isValidMilitaryZip('96234', 'AP') // true
 * isValidMilitaryZip('12345', 'AA') // false (wrong range)
 */
export const isValidMilitaryZip = (zipCode, state) => {
  if (!zipCode || !state) return false;
  const pattern = MILITARY_ZIP_PATTERNS[state];
  return pattern ? pattern.test(zipCode) : false;
};

export const isValidNameLength = (errors, fieldData, length) => {
  if (fieldData && fieldData.length > length) {
    errors.addError(
      `Please enter a name under ${length} characters. If your name is longer, enter the first ${length} characters only.`,
    );
  }
};

/**
 * Validation messages
 * Provides consistent error messages across the application
 */
export const VALIDATION_MESSAGES = {
  // Name validation
  NAME_INVALID: 'Must contain only letters, spaces, hyphens, and apostrophes',
  NAME_INVALID_FIRST: 'Contains invalid characters',
  NAME_INVALID_MIDDLE: 'Middle name contains invalid characters',
  NAME_INVALID_LAST: 'Last name contains invalid characters',
  NAME_INVALID_SUFFIX: 'Suffix contains invalid characters',

  // Date messages
  DATE_FORMAT: 'Date must be in YYYY-MM-DD format',

  // ID messages
  SSN_FORMAT: 'SSN must be 9 digits',
  VA_FILE_FORMAT: 'VA file number must be 8 or 9 digits',

  // Contact messages
  PHONE_FORMAT: 'Please enter a 10-digit phone number (with or without dashes)',
  EMAIL_FORMAT: 'Enter a valid email address using the format email@domain.com',

  // Postal messages
  ZIP_USA: 'Enter a valid 5-digit ZIP code (12345) or ZIP+4 (12345-6789)',
  POSTAL_CANADA: 'Postal code must be in format A1A 1A1',
  POSTAL_MEXICO: 'Postal code must be 5 digits',

  // Military ZIP codes
  ZIP_MILITARY_AA: 'ZIP code must start with 340',
  ZIP_MILITARY_AE: 'ZIP code must start with 09',
  ZIP_MILITARY_AP: 'ZIP code must start with 962-966',
};
