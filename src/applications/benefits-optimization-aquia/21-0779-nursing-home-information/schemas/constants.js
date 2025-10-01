/**
 * @module schemas/constants
 * @description Additional constants specific to 21-0779 Nursing Home Information form.
 * Common patterns are imported from bio-aquia/shared/schemas/regex-patterns.
 */

// Additional patterns specific to 21-0779
export const MEDICAID_PATTERNS = {
  MEDICAID_NUMBER: /^[A-Za-z0-9-]+$/,
};

export const MEDICAID_MESSAGES = {
  MEDICAID_NUMBER: 'Please enter a valid Medicaid number',
};
