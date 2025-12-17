/**
 * @module regex-patterns
 * @description Centralized regular expression patterns for bio-aquia/shared validation.
 * @deprecated Prefer using validators module which provides platform and custom validation functions.
 * This module re-exports from validators for backward compatibility.
 *
 * MIGRATION NOTE: New code should import from '@bio-aquia/shared/utils/validators'
 * to use validation functions directly.
 */

import {
  MILITARY_ZIP_PATTERNS,
  VALIDATION_MESSAGES as PLATFORM_MESSAGES,
} from '../../utils/validators';

/**
 * Name validation patterns
 * Platform equivalent: isValidName() in platform/forms/validations.js
 */
export const NAME_PATTERNS = {
  /** Standard name - letters, spaces, hyphens, apostrophes */
  STANDARD: /^[a-zA-Z\s'-]+$/,
  /** Optional name field - same as standard but allows empty */
  OPTIONAL: /^[a-zA-Z\s'-]*$/,
  /** Name with first letter requirement - matches platform's isValidName */
  WITH_FIRST_LETTER: /^[a-zA-Z][a-zA-Z\s'-]*$/,
  /** Alias for WITH_FIRST_LETTER for backward compatibility */
  STANDARD_NAME: /^[a-zA-Z][a-zA-Z\s'-]*$/,
  /** Suffix - letters, spaces, and periods (for Jr., Sr., etc.) */
  SUFFIX: /^[a-zA-Z\s.]*$/,
  /** Alias for SUFFIX for consistency */
  NAME_SUFFIX: /^[a-zA-Z\s.]*$/,
};

/**
 * Date and time patterns
 * Platform equivalent: isFullDate() in platform/forms/validations.js
 */
export const DATE_PATTERNS = {
  /** ISO date format YYYY-MM-DD */
  ISO: /^\d{4}-\d{2}-\d{2}$/,
  /** Alias for ISO for backward compatibility */
  ISO_DATE: /^\d{4}-\d{2}-\d{2}$/,
};

/**
 * Identification number patterns
 * Platform equivalents:
 * - isValidSSN() in platform/forms/validations.js
 * - isValidVAFileNumber() in platform/forms-system/src/js/utilities/validations/index.js
 */
export const ID_PATTERNS = {
  /** Social Security Number - 9 digits */
  SSN: /^\d{9}$/,
  /** VA file number - 8 or 9 digits */
  VA_FILE_NUMBER: /^\d{8,9}$/,
};

/**
 * Contact information patterns
 * Platform equivalents:
 * - isValidPhone() in platform/forms/validations.js
 * - isValidEmail() in platform/forms/validations.js
 * - isValidUSZipCode() in platform/forms/address/index.js
 */
export const CONTACT_PATTERNS = {
  /** US phone number - 10 digits */
  PHONE_US: /^\d{10}$/,
  /** US ZIP code - 5 digits or 5+4 format (alias for POSTAL_PATTERNS.USA) */
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  /** Email address - basic validation */
  EMAIL_BASIC: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** Email address - comprehensive validation */
  EMAIL_FULL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

/**
 * Character validation patterns
 */
export const CHAR_PATTERNS = {
  /** Contains letters (alphabetic characters) */
  HAS_LETTERS: /[a-zA-Z]/,
  /** Contains invalid phone characters (allows only digits, spaces, parentheses, hyphens) */
  INVALID_PHONE_CHARS: /[^0-9\s()-]/,
};

/**
 * Postal code patterns by country
 * Platform equivalents:
 * - isValidUSZipCode() in platform/forms/address/index.js
 * - isValidCanPostalCode() in platform/forms/address/index.js
 * - isValidMexicoPostalCode() in validators (custom implementation)
 */
export const POSTAL_PATTERNS = {
  /** USA - 5 digits or 5+4 format */
  USA: /^\d{5}(-\d{4})?$/,
  /** Canada - A1A 1A1 format */
  CANADA: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
  /** Mexico - 5 digits */
  MEXICO: /^\d{5}$/,
};

/**
 * Military postal code patterns
 * Re-exported from validators
 */
export const MILITARY_POSTAL_PATTERNS = MILITARY_ZIP_PATTERNS;

/**
 * Common validation messages
 * Re-exported from validators
 */
export const VALIDATION_MESSAGES = PLATFORM_MESSAGES;
