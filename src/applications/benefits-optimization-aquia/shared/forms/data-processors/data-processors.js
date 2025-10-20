/**
 * @module forms/data-processors
 * @description Generic data processing utilities for form data transformation.
 * Provides reusable functions for transforming, sanitizing, and formatting form data.
 * Designed to be composable and business-logic agnostic.
 */

/**
 * Transforms date objects to ISO string format (YYYY-MM-DD).
 * Handles both Date objects and custom date structures with month/day/year properties.
 *
 * @param {Object} formData - Form data containing date fields
 * @param {Array<string>} dateFields - Array of field names to process
 * @param {Function} [formatter] - Custom date formatter function
 * @returns {Object} Processed form data with formatted dates
 * @example
 * transformDates(
 *   { birthDate: { month: 1, day: 15, year: 1990 } },
 *   ['birthDate']
 * ) // { birthDate: '1990-01-15' }
 */
export const transformDates = (formData, dateFields = [], formatter) => {
  if (!formData) return formData;

  const defaultFormatter = dateObj => {
    if (dateObj.month && dateObj.year) {
      const month = String(dateObj.month).padStart(2, '0');
      const day = String(dateObj.day || '01').padStart(2, '0');
      const { year } = dateObj;
      return `${year}-${month}-${day}`;
    }
    if (dateObj instanceof Date) {
      return dateObj.toISOString().split('T')[0];
    }
    return dateObj;
  };

  const dateFormatter = formatter || defaultFormatter;
  const processed = { ...formData };

  dateFields.forEach(field => {
    if (processed[field] && typeof processed[field] === 'object') {
      processed[field] = dateFormatter(processed[field]);
    }
  });

  return processed;
};

/**
 * Chains multiple data processors to transform form data.
 * Processors are applied in sequence, each receiving the output of the previous.
 *
 * @param {Object} data - Initial form data
 * @param {Array<Function>} processors - Array of processor functions
 * @returns {Object} Fully processed form data
 * @example
 * processFormData(formData, [
 *   data => transformDates(data, ['birthDate']),
 *   data => normalizeValue(data, 'phoneNumber')
 * ])
 */
export const processFormData = (data, processors = []) => {
  return processors.reduce((processedData, processor) => {
    return processor(processedData);
  }, data);
};

/**
 * Factory function for creating field-specific processors.
 *
 * @param {Array<string>} fields - Array of field names to process
 * @param {Function} transformer - Transformation function for each field
 * @returns {Function} Data processor function
 */
export const createFieldProcessor = (fields, transformer) => {
  return formData => {
    if (!formData) return formData;
    const processed = { ...formData };

    fields.forEach(field => {
      if (processed[field] !== undefined) {
        processed[field] = transformer(processed[field]);
      }
    });

    return processed;
  };
};

/**
 * Removes formatting from string values.
 * Generic utility for normalizing input.
 *
 * @param {string} value - Value to normalize
 * @param {RegExp} [pattern=/\D/g] - Pattern to remove
 * @returns {string} Normalized value
 */
export const normalizeValue = (value, pattern = /\D/g) => {
  if (!value) return '';
  return String(value).replace(pattern, '');
};

/**
 * Formats a value according to a pattern.
 * Generic formatter that can be used for various formats.
 *
 * @param {string} value - Value to format
 * @param {string} pattern - Format pattern (e.g., "(XXX) XXX-XXXX")
 * @returns {string} Formatted value
 */
export const formatValue = (value, pattern) => {
  if (!value || !pattern) return value;

  const digits = normalizeValue(value);
  let formatted = '';
  let digitIndex = 0;

  for (let i = 0; i < pattern.length && digitIndex < digits.length; i += 1) {
    if (pattern[i] === 'X') {
      formatted += digits[digitIndex];
      digitIndex += 1;
    } else {
      formatted += pattern[i];
    }
  }

  return formatted;
};

/**
 * Transforms boolean-like values to actual booleans.
 *
 * @param {Object} formData - Form data containing boolean fields
 * @param {Array<string>} booleanFields - Array of field names to process
 * @returns {Object} Processed form data with proper boolean values
 */
export const transformBooleans = (formData, booleanFields = []) => {
  if (!formData) return formData;

  const processed = { ...formData };

  booleanFields.forEach(field => {
    if (processed[field] !== undefined) {
      const value = processed[field];
      if (value === 'true' || value === true) {
        processed[field] = true;
      } else if (value === 'false' || value === false) {
        processed[field] = false;
      } else {
        processed[field] = Boolean(value);
      }
    }
  });

  return processed;
};

/**
 * Removes empty or undefined values from form data.
 * Useful for cleaning data before submission.
 *
 * @param {Object} formData - Form data to sanitize
 * @param {Object} [options={}] - Sanitization options
 * @param {boolean} [options.removeEmptyStrings=false] - Remove empty strings
 * @param {boolean} [options.removeNull=true] - Remove null values
 * @param {boolean} [options.removeUndefined=true] - Remove undefined values
 * @param {boolean} [options.deep=true] - Recursively sanitize nested objects
 * @returns {Object} Sanitized form data
 */
export const sanitizeFormData = (formData, options = {}) => {
  const {
    removeEmptyStrings = false,
    removeNull = true,
    removeUndefined = true,
    deep = true,
  } = options;

  if (!formData || typeof formData !== 'object') return formData;

  const sanitized = {};

  Object.entries(formData).forEach(([key, value]) => {
    if (removeUndefined && value === undefined) return;
    if (removeNull && value === null) return;
    if (removeEmptyStrings && value === '') return;

    if (
      deep &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      const sanitizedNested = sanitizeFormData(value, options);
      if (Object.keys(sanitizedNested).length > 0) {
        sanitized[key] = sanitizedNested;
      }
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

/**
 * Creates a processor for handling nested data structures.
 *
 * @param {string} path - Dot-notation path to nested data
 * @param {Function} processor - Processor function to apply
 * @returns {Function} Nested data processor
 */
export const createNestedProcessor = (path, processor) => {
  return formData => {
    if (!formData) return formData;

    const pathParts = path.split('.');
    const cloned = { ...formData };

    let current = cloned;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        return formData;
      }
      current[part] = { ...current[part] };
      current = current[part];
    }

    const lastPart = pathParts[pathParts.length - 1];
    if (current[lastPart] !== undefined) {
      current[lastPart] = processor(current[lastPart]);
    }

    return cloned;
  };
};

/**
 * Transforms field names in form data.
 * Useful for API compatibility or data mapping.
 *
 * @param {Object} formData - Form data to transform
 * @param {Object} fieldMap - Mapping of old field names to new field names
 * @returns {Object} Transformed form data
 */
export const transformFieldNames = (formData, fieldMap) => {
  if (!formData || !fieldMap) return formData;

  const transformed = {};

  Object.entries(formData).forEach(([key, value]) => {
    const newKey = fieldMap[key] || key;
    transformed[newKey] = value;
  });

  return transformed;
};

/**
 * Creates a conditional processor that runs based on field values.
 *
 * @param {Function} condition - Condition function that receives form data
 * @param {Function} trueProcessor - Processor for when condition is true
 * @param {Function} [falseProcessor] - Optional processor for when condition is false
 * @returns {Function} Conditional processor
 */
export const createConditionalProcessor = (
  condition,
  trueProcessor,
  falseProcessor,
) => {
  return formData => {
    if (condition(formData)) {
      return trueProcessor(formData);
    }
    return falseProcessor ? falseProcessor(formData) : formData;
  };
};

/**
 * Merges default values with form data.
 * Only applies defaults for undefined fields.
 *
 * @param {Object} formData - Current form data
 * @param {Object} defaults - Default values
 * @returns {Object} Merged form data
 */
export const applyDefaults = (formData, defaults) => {
  if (!defaults) return formData;

  const merged = { ...defaults };

  if (formData) {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        merged[key] = value;
      }
    });
  }

  return merged;
};
