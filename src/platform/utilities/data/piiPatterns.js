/**
 * Regex patterns for identifying common PII patterns in user input.
 * These patterns are used to redact sensitive data before logging
 * or transmitting to analytics services.
 *
 * @module platform/utilities/data/piiPatterns
 */

/**
 * Pattern for matching email addresses.
 * Matches: user@example.com, user.name@example.co.uk
 */
export const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

/**
 * Pattern for matching Social Security Numbers (SSN).
 * Matches: 123-45-6789, 123456789
 * Excludes invalid patterns: 000-xx-xxxx, xxx-00-xxxx, xxx-xx-0000, 666-xx-xxxx, 9xx-xx-xxxx
 */
export const SSN_PATTERN = /\b(?!000|666|9\d{2})\d{3}-?(?!00)\d{2}-?(?!0{4})\d{4}\b/g;

/**
 * Pattern for matching US phone numbers.
 * Matches: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, +1 123-456-7890
 */
export const PHONE_PATTERN = /(\+?\d{1,2}\s?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;

/**
 * Pattern for matching US zip codes (5-digit and ZIP+4 formats).
 * Matches: 12345, 12345-6789
 */
export const ZIP_CODE_PATTERN = /\b\d{5}(?:-\d{4})?\b/g;

/**
 * Pattern for matching street addresses.
 * Matches common address patterns like "123 Main St", "456 Oak Avenue", "789 N. Park Blvd"
 * Also matches abbreviated forms like "123 Main St." and numbered streets like "123 1st St"
 */
export const STREET_ADDRESS_PATTERN = /\b\d+\s+[A-Z0-9\s.#]+(?:Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Boulevard|Blvd\.?|Drive|Dr\.?|Lane|Ln\.?|Court|Ct\.?|Place|Pl\.?|Way|Circle|Cir\.?|Highway|Hwy\.?)\b/gi;

/**
 * Combined pattern that matches any of the above PII patterns.
 */
export const ALL_PII_PATTERNS = [
  EMAIL_PATTERN,
  SSN_PATTERN,
  PHONE_PATTERN,
  ZIP_CODE_PATTERN,
  STREET_ADDRESS_PATTERN,
];

/**
 * Default redaction replacement string used when PII is detected.
 */
export const REDACTION_PLACEHOLDER = '[REDACTED]';
