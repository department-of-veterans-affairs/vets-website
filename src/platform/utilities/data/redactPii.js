/**
 * Utility function for redacting common PII (Personally Identifiable Information) patterns
 * from input data before logging or transmitting to analytics services.
 *
 * This function is pure, non-mutative, and handles strings, objects, arrays, and nested structures.
 * It redacts: email addresses, SSNs, phone numbers, zip codes, and street addresses.
 *
 * @module platform/utilities/data/redactPii
 * @param {string|Object|Array|null|undefined} input - The data to redact PII from
 * @param {string} [redactionPlaceholder='[REDACTED]'] - The string to replace PII with
 * @returns {string|Object|Array} - A new object/array/string with PII redacted (original unchanged)
 *
 * @example
 * // Redact PII from a string
 * redactPii('Contact me at john@example.com or 555-123-4567')
 * // Returns: 'Contact me at [REDACTED - email] or [REDACTED - phone]'
 *
 * @example
 * // Redact PII from an object
 * redactPii({ query: 'john@example.com', page: 1 })
 * // Returns: { query: '[REDACTED - email]', page: 1 }
 *
 * @example
 * // Redact PII from nested structures
 * redactPii({ search: { query: '123-45-6789', filters: ['email@test.com'] } })
 * // Returns: { search: { query: '[REDACTED - ssn]', filters: ['[REDACTED - email]'] } }
 */

import cloneDeep from './cloneDeep';
import {
  EMAIL_PATTERN,
  SSN_PATTERN,
  PHONE_PATTERN,
  ZIP_CODE_PATTERN,
  STREET_ADDRESS_PATTERN,
  REDACTION_PLACEHOLDER,
} from './piiPatterns';

/**
 * Creates a type-specific redaction placeholder.
 *
 * @param {string} piiType - The type of PII (e.g., 'email', 'phone', 'ssn')
 * @param {string} basePlaceholder - The base placeholder format
 * @returns {string} - The type-specific placeholder
 */
function createTypePlaceholder(piiType, basePlaceholder) {
  // If basePlaceholder is the default, use type-specific format
  if (basePlaceholder === REDACTION_PLACEHOLDER) {
    return `[REDACTED - ${piiType}]`;
  }
  // If custom placeholder is provided, append type info
  return `${basePlaceholder} - ${piiType}`;
}

/**
 * Redacts PII patterns from a string by replacing matches with type-specific placeholders.
 *
 * @param {string} str - The string to redact
 * @param {string} placeholder - The base replacement string for PII
 * @returns {string} - The redacted string
 */
function redactString(str, placeholder) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }

  let redacted = str;

  // Apply each pattern sequentially to ensure all PII is caught
  // Order matters: more specific patterns (like ZIP codes) should be checked before
  // more general ones (like SSN which can overlap with ZIP+4 format)
  // Each pattern uses a type-specific placeholder
  redacted = redacted.replace(
    STREET_ADDRESS_PATTERN,
    createTypePlaceholder('address', placeholder),
  );
  redacted = redacted.replace(
    ZIP_CODE_PATTERN,
    createTypePlaceholder('zip', placeholder),
  );
  redacted = redacted.replace(
    SSN_PATTERN,
    createTypePlaceholder('ssn', placeholder),
  );
  redacted = redacted.replace(
    EMAIL_PATTERN,
    createTypePlaceholder('email', placeholder),
  );
  redacted = redacted.replace(
    PHONE_PATTERN,
    createTypePlaceholder('phone', placeholder),
  );

  return redacted;
}

/**
 * Main function to redact PII from various input types.
 *
 * @param {string|Object|Array|null|undefined} input - The data to redact
 * @param {string} [redactionPlaceholder=REDACTION_PLACEHOLDER] - Replacement string
 * @returns {string|Object|Array} - Redacted data (new reference, original unchanged)
 */
export default function redactPii(
  input,
  redactionPlaceholder = REDACTION_PLACEHOLDER,
) {
  // Handle null and undefined
  if (input === null || input === undefined) {
    return input;
  }

  // Handle strings
  if (typeof input === 'string') {
    return redactString(input, redactionPlaceholder);
  }

  // Handle non-object primitives (numbers, booleans, etc.)
  if (typeof input !== 'object') {
    return input;
  }

  // Handle arrays
  if (Array.isArray(input)) {
    return input.map(item => redactPii(item, redactionPlaceholder));
  }

  // Handle objects - create a deep clone to avoid mutating the original
  // Note: We need to preserve null values from the original since cloneDeep may convert them
  const cloned = cloneDeep(input);
  const redacted = {};

  Object.keys(input).forEach(key => {
    const originalValue = input[key];
    const clonedValue = cloned[key];

    // Recursively redact nested structures
    if (typeof originalValue === 'string') {
      redacted[key] = redactString(originalValue, redactionPlaceholder);
    } else if (originalValue === null) {
      // Explicitly preserve null values from original (cloneDeep may convert null to {})
      redacted[key] = null;
    } else if (typeof originalValue === 'object' && originalValue !== null) {
      redacted[key] = redactPii(clonedValue, redactionPlaceholder);
    } else {
      // Preserve non-string, non-object values as-is
      redacted[key] = originalValue;
    }
  });

  return redacted;
}
