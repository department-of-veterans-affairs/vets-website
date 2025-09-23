/**
 * @module regex-patterns
 * @description Centralized regular expression patterns for bio-aquia/shared validation.
 * These patterns are used across various schemas and components for consistent validation.
 */

/**
 * Name validation patterns
 */
export const NAME_PATTERNS = {
  /** Standard name - letters, spaces, hyphens, apostrophes */
  STANDARD: /^[a-zA-Z\s'-]+$/,
  /** Optional name field - same as standard but allows empty */
  OPTIONAL: /^[a-zA-Z\s'-]*$/,
  /** Name with first letter requirement */
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
 */
export const DATE_PATTERNS = {
  /** ISO date format YYYY-MM-DD */
  ISO: /^\d{4}-\d{2}-\d{2}$/,
  /** Alias for ISO for backward compatibility */
  ISO_DATE: /^\d{4}-\d{2}-\d{2}$/,
};

/**
 * Identification number patterns
 */
export const ID_PATTERNS = {
  /** Social Security Number - 9 digits */
  SSN: /^\d{9}$/,
  /** VA file number - 8 or 9 digits */
  VA_FILE_NUMBER: /^\d{8,9}$/,
};

/**
 * Contact information patterns
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
 */
export const MILITARY_POSTAL_PATTERNS = {
  /** Armed Forces Americas */
  AA: /^340\d{2}$/,
  /** Armed Forces Europe */
  AE: /^09\d{3}$/,
  /** Armed Forces Pacific */
  AP: /^96[2-6]\d{2}$/,
};

/**
 * Common validation messages
 */
export const VALIDATION_MESSAGES = {
  // Name messages
  NAME_INVALID: 'Must contain only letters, spaces, hyphens, and apostrophes',
  NAME_INVALID_FIRST: 'Contains invalid characters',
  NAME_INVALID_MIDDLE: 'Middle name contains invalid characters',
  NAME_INVALID_LAST: 'Last name contains invalid characters',

  // Date messages
  DATE_FORMAT: 'Date must be in YYYY-MM-DD format',

  // ID messages
  SSN_FORMAT: 'SSN must be 9 digits',
  VA_FILE_FORMAT: 'VA file number must be 8 or 9 digits',

  // Contact messages
  PHONE_FORMAT: 'Phone number must be 10 digits',
  EMAIL_FORMAT: 'Please enter a valid email address',

  // Postal messages
  ZIP_USA: 'ZIP code must be in format 12345 or 12345-6789',
  POSTAL_CANADA: 'Postal code must be in format A1A 1A1',
  POSTAL_MEXICO: 'Postal code must be 5 digits',

  // Military postal messages
  ZIP_MILITARY_AA: 'ZIP code must start with 340',
  ZIP_MILITARY_AE: 'ZIP code must start with 09',
  ZIP_MILITARY_AP: 'ZIP code must start with 962-966',
};
