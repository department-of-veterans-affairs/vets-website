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
export const isValidSSN = platformIsValidSSN;
export const isValidPhone = platformIsValidPhone;
export const isValidEmail = platformIsValidEmail;
export const isValidUSZipCode = platformIsValidUSZipCode;
export const isValidCanPostalCode = platformIsValidCanPostalCode;

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

/**
 * Validation messages
 * Provides consistent error messages across the application
 */
export const VALIDATION_MESSAGES = {
  // Name validation
  NAME_INVALID_FIRST: 'Contains invalid characters',
  NAME_INVALID_MIDDLE: 'Middle name contains invalid characters',
  NAME_INVALID_LAST: 'Last name contains invalid characters',
  NAME_INVALID_SUFFIX: 'Suffix contains invalid characters',

  // SSN
  SSN_FORMAT: 'SSN must be 9 digits',

  // Email
  EMAIL_FORMAT: 'Please enter a valid email address',

  // VA File Number
  VA_FILE_FORMAT: 'VA file number must be 8 or 9 digits',

  // Mexican postal codes
  POSTAL_MEXICO: 'Postal code must be 5 digits',

  // Canadian postal codes
  POSTAL_CANADA: 'Postal code must be in format A1A 1A1',

  // Military ZIP codes
  ZIP_MILITARY_AA: 'ZIP code must start with 340',
  ZIP_MILITARY_AE: 'ZIP code must start with 09',
  ZIP_MILITARY_AP: 'ZIP code must start with 962-966',
};
