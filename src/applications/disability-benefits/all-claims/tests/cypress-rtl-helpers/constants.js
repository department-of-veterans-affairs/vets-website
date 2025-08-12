/**
 * @fileoverview Constants for Cypress RTL helpers
 * @module cypress-rtl-helpers/constants
 */

// Timeout configurations
export const TIMEOUTS = {
  DEFAULT: 10000,
  SHORT: 5000,
  LONG: 30000,
  RETRY: 500,
};

// Modal visibility states
export const MODAL_STATES = {
  VISIBLE: ['', undefined, 'true'],
  HIDDEN: 'false',
};

// Common selectors used across helpers
export const SELECTORS = {
  CONTINUE_BUTTON: 'button',
  VA_MODAL: 'va-modal',
  VA_CHECKBOX: 'va-checkbox',
  VA_ALERT: 'va-alert',
  VA_BUTTON: 'va-button',
  SKIP_WIZARD: '.skip-wizard-link',
  RADIO_NO: [
    'input[type="radio"][value="N"]',
    'input[type="radio"][value="no"]',
  ],
  RADIO_YES: [
    'input[type="radio"][value="Y"]',
    'input[type="radio"][value="yes"]',
  ],
};
