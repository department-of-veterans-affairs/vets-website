/**
 * @module utils/platform-validators
 * @description Platform validation functions for VA.gov forms.
 * Re-exports platform validators for consistent use across bio-aquia apps.
 */

export {
  isValidName,
  isValidSSN,
  isValidVAFileNumber,
  isValidPhone,
  isValidEmail,
  isValidUSZipCode,
  isValidCanPostalCode,
  isValidMexicoPostalCode,
  isValidMilitaryZip,
  MILITARY_ZIP_PATTERNS,
  VALIDATION_MESSAGES,
} from './platform-validators';
