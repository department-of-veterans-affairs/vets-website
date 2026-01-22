/**
 * Date handling module for disability-benefits/all-claims
 * Centralizes all date-related functionality including formatting, validation, and comparisons
 *
 * This module exports only the public API that should be used by external consumers.
 * Internal utilities are kept in separate files and not exported here.
 */

// Re-export public API from individual modules
export {
  // Formatting functions
  formatDate,
  formatDateRange,
  formatMonthYearDate,
  formatDateShort,
  formatDateLong,
  // Validation functions
  isValidFullDate,
  isValidYear,
  validateAge,
  validateSeparationDate,
  validateServicePeriod,
  // Comparison functions
  isLessThan180DaysInFuture,
  isWithinRange,
  isWithinServicePeriod,
  // Parsing functions
  parseDate,
  parseDateWithTemplate,
  // BDD-specific functions
  isBddClaimValid,
  getBddSeparationDateError,
  // Partial date checks
  isMonthOnly,
  isYearOnly,
  isYearMonth,
  // Service date functions
  findEarliestServiceDate,
  isTreatmentBeforeService,
  // Constants
  DATE_FORMAT,
  DATE_FORMAT_SHORT,
  DATE_FORMAT_LONG,
  PARTIAL_DATE_FORMAT,
  DATE_TEMPLATE,
} from './formatting';

export {
  isDateBefore,
  isDateAfter,
  isDateSame,
  isDateBetween,
  compareDates,
} from './comparisons';

export {
  validateDateNotBeforeReference,
  validateSeparationDateWithRules,
  validateTitle10ActivationDate,
  validateApproximateDate,
  validateApproximateMonthYearDate,
} from './validations';

// Product-specific exports for one-off functionality
export { productSpecificDates } from './product-specific';

// Form system integration utilities
export {
  dateFieldToISO,
  isoToDateField,
  formatReviewDate,
  validateFormDateField,
  createDateRange,
  validateFormDateRange,
  getCurrentFormDate,
  adjustFormDate,
} from './form-integration';
