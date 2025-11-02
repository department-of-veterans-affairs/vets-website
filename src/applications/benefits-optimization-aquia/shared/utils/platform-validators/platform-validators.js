/**
 * @module utils/platform-validators
 * @description Wrappers around platform validation functions for use with Zod schemas.
 * Provides consistent validation across bio-aquia apps using VA.gov platform standards.
 *
 * Platform validation sources:
 * - platform/forms/validations.js (name, SSN, phone, email)
 * - platform/forms/address/index.js (US ZIP, Canadian postal codes)
 *
 * Custom validators (not in platform):
 * - VA file number (8-9 digits)
 * - Mexico postal codes
 * - Military ZIP code ranges (AA/AE/AP)
 */

import {
  isValidName as platformIsValidName,
  isValidSSN as platformIsValidSSN,
  isValidPhone as platformIsValidPhone,
  isValidEmail as platformIsValidEmail,
} from 'platform/forms/validations';

import {
  isValidUSZipCode as platformIsValidUSZipCode,
  isValidCanPostalCode as platformIsValidCanPostalCode,
} from 'platform/forms/address';

/**
 * Name validation - uses platform's name pattern
 * Platform pattern: /^[a-zA-Z][a-zA-Z '-]*$/
 * @param {string} value - Name to validate
 * @returns {boolean} True if valid
 */
export const isValidName = value => {
  if (!value) return false;
  return platformIsValidName(value);
};

/**
 * SSN validation - extends platform's SSN validation with additional checks
 * Accepts both 9-digit (123456789) and formatted (123-45-6789) SSNs
 * Rejects invalid patterns (all zeros, sequential numbers, invalid area codes)
 * @param {string} value - SSN to validate
 * @returns {boolean} True if valid
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
 * VA File Number validation - validates 8 or 9 digit VA file numbers
 * Accepts 8 or 9 digit VA file numbers (digits only)
 * Does not validate as SSN - simply checks digit length
 * @param {string} value - VA file number to validate
 * @returns {boolean} True if valid
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
 * Phone number validation - uses platform's phone validation
 * Validates US 10-digit phone numbers
 * Automatically strips non-digit characters before validation
 * @param {string} value - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = value => {
  if (!value) return true; // Optional field
  return platformIsValidPhone(value);
};

/**
 * Email validation - uses platform's comprehensive email validation
 * Uses StackOverflow's comprehensive email regex pattern
 * More robust than simple regex patterns
 * @param {string} value - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = value => {
  if (!value) return false;
  return platformIsValidEmail(value);
};

/**
 * US ZIP code validation - uses platform's ZIP validation
 * Accepts 5-digit (12345) or 9-digit (12345-6789) formats
 * Also allows space separator (12345 6789)
 * @param {string} value - ZIP code to validate
 * @returns {boolean} True if valid
 */
export const isValidUSZipCode = value => {
  if (!value) return false;
  return platformIsValidUSZipCode(value);
};

/**
 * Canadian postal code validation - uses platform's validation
 * Format: A1A 1A1 or A1A-1A1 (space or dash separator)
 * @param {string} value - Postal code to validate
 * @returns {boolean} True if valid
 */
export const isValidCanPostalCode = value => {
  if (!value) return false;
  return platformIsValidCanPostalCode(value);
};

/**
 * Custom validations not available in platform
 */

/**
 * Mexican postal code validation - 5 digits
 * Not available in platform, custom implementation
 * @param {string} value - Mexican postal code to validate
 * @returns {boolean} True if valid
 */
export const isValidMexicoPostalCode = value => {
  if (!value) return false;
  return /^\d{5}$/.test(value);
};

/**
 * Military ZIP code range validation
 * Platform recognizes military states (AA, AE, AP) but doesn't validate ZIP ranges
 * These patterns are specific to military postal codes:
 * - AA (Americas): 340xx
 * - AE (Europe): 09xxx
 * - AP (Pacific): 96[2-6]xx
 */
export const MILITARY_ZIP_PATTERNS = {
  AA: /^340\d{2}$/,
  AE: /^09\d{3}$/,
  AP: /^96[2-6]\d{2}$/,
};

/**
 * Validate military ZIP code for a given military state
 * @param {string} zipCode - ZIP code to validate
 * @param {string} state - Military state (AA, AE, or AP)
 * @returns {boolean} True if valid for the given state
 */
export const isValidMilitaryZip = (zipCode, state) => {
  if (!zipCode || !state) return false;
  const pattern = MILITARY_ZIP_PATTERNS[state];
  return pattern ? pattern.test(zipCode) : false;
};

/**
 * Validation messages - aligned with platform's user-friendly messaging
 * Platform messages provide better UX with format examples
 */
export const VALIDATION_MESSAGES = {
  // Name messages - aligned with platform
  NAME_INVALID: 'Must contain only letters, spaces, hyphens, and apostrophes',
  NAME_INVALID_FIRST: 'Contains invalid characters',
  NAME_INVALID_MIDDLE: 'Middle name contains invalid characters',
  NAME_INVALID_LAST: 'Last name contains invalid characters',
  NAME_INVALID_SUFFIX: 'Suffix contains invalid characters',

  // Date messages
  DATE_FORMAT: 'Date must be in YYYY-MM-DD format',

  // ID messages - simplified for clarity
  SSN_FORMAT: 'SSN must be 9 digits',
  VA_FILE_FORMAT: 'VA file number must be 8 or 9 digits',

  // Contact messages - aligned with platform definitions
  PHONE_FORMAT: 'Please enter a 10-digit phone number (with or without dashes)',
  EMAIL_FORMAT: 'Enter a valid email address using the format email@domain.com',

  // Postal messages - aligned with platform where available
  ZIP_USA: 'Enter a valid 5-digit ZIP code (12345) or ZIP+4 (12345-6789)',
  POSTAL_CANADA: 'Postal code must be in format A1A 1A1',
  POSTAL_MEXICO: 'Postal code must be 5 digits',

  // Military postal messages - custom (not in platform)
  ZIP_MILITARY_AA: 'ZIP code must start with 340',
  ZIP_MILITARY_AE: 'ZIP code must start with 09',
  ZIP_MILITARY_AP: 'ZIP code must start with 962-966',
};
