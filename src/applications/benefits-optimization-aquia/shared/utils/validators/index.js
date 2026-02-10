/**
 * @module utils/validators
 * @description Centralized validation functions for VA.gov forms.
 * Re-exports platform validators and provides custom validators.
 */

export {
  // Platform validators
  isValidName,
  isValidSSN,
  isValidPhone,
  isValidEmail,
  isValidUSZipCode,
  isValidCanPostalCode,
  // Custom validators
  isValidVAFileNumber,
  isValidMexicoPostalCode,
  isValidMilitaryZip,
  isValidNameLength,
  MILITARY_ZIP_PATTERNS,
  VALIDATION_MESSAGES,
} from './validators';
