/**
 * Custom date validations for areas that allow partial dates
 * These validations use the form integration functions with allowPartialDates: true
 */
import {
  validateFormDateField,
  dateFieldToISO,
  isoToDateField,
} from './form-integration';

/**
 * Helper to convert various date formats to date field object
 */
const normalizeDateInput = dateInput => {
  // If it's already a date field object, return as-is
  if (dateInput && typeof dateInput === 'object' && 'year' in dateInput) {
    return dateInput;
  }

  // If it's a string, convert using isoToDateField
  if (typeof dateInput === 'string') {
    return isoToDateField(dateInput, { allowPartialDates: true });
  }

  // If it's null/undefined, return empty date field
  return { month: '', day: '', year: '' };
};

/**
 * Validate date fields that allow partial dates (month+year or year-only)
 * Used for: vaMedicalRecords, newConditions, severancePayDate
 */
export const validatePartialDate = (
  errors,
  dateField,
  formData,
  schema,
  errorMessages = {},
) => {
  const normalizedField = normalizeDateInput(dateField);

  const result = validateFormDateField(normalizedField, {
    required: schema.required || false,
    allowPartialDates: true,
  });

  if (!result.isValid) {
    errors.addError(errorMessages.required || result.error);
  }
};

/**
 * Validate required partial date fields
 */
export const validateRequiredPartialDate = (
  errors,
  dateField,
  formData,
  schema,
  errorMessages = {},
) => {
  const normalizedField = normalizeDateInput(dateField);

  const result = validateFormDateField(normalizedField, {
    required: false, // The field is not actually required, just validated if present
    allowPartialDates: true,
  });

  if (!result.isValid) {
    errors.addError(errorMessages.required || result.error);
  }
};

/**
 * Validate date ranges that allow partial dates
 */
export const validatePartialDateRange = (
  errors,
  fromField,
  toField,
  errorMessages = {},
) => {
  const normalizedFromField = normalizeDateInput(fromField);
  const normalizedToField = normalizeDateInput(toField);

  const fromResult = validateFormDateField(normalizedFromField, {
    allowPartialDates: true,
  });

  const toResult = validateFormDateField(normalizedToField, {
    allowPartialDates: true,
  });

  if (!fromResult.isValid) {
    errors.addError(errorMessages.from || fromResult.error);
    return;
  }

  if (!toResult.isValid) {
    errors.addError(errorMessages.to || toResult.error);
    return;
  }

  // Only validate range if both dates are complete
  const fromISO = dateFieldToISO(normalizedFromField, {
    allowPartialDates: true,
  });
  const toISO = dateFieldToISO(normalizedToField, { allowPartialDates: true });

  if (fromISO && toISO && !fromISO.includes('XX') && !toISO.includes('XX')) {
    const fromDate = new Date(fromISO);
    const toDate = new Date(toISO);

    if (fromDate > toDate) {
      errors.addError(
        errorMessages.range || 'End date must be after start date',
      );
    }
  }
};

/**
 * Validate year-only field that allows partial dates
 * Used for severance pay date which only accepts year
 */
export const validateYearOnlyPartialDate = (errors, fieldData) => {
  // Skip validation if no data provided (not required)
  if (!fieldData) {
    return;
  }

  // For year-only fields, convert to date field format for validation
  const yearField = { month: '', day: '', year: fieldData };

  const result = validateFormDateField(yearField, {
    required: false, // Don't enforce required since we're only validating the year if provided
    allowPartialDates: true,
  });

  if (!result.isValid) {
    errors.addError(result.error);
  }
};
