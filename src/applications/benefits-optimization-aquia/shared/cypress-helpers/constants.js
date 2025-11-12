/**
 * @fileoverview Constants for Cypress RTL helpers
 * @module cypress-rtl-helpers/constants
 */

/**
 * Timeout configurations for various operations
 * @constant
 * @type {Object.<string, number>}
 * @property {number} DEFAULT - Default timeout for most operations (10 seconds)
 * @property {number} SHORT - Short timeout for quick operations (5 seconds)
 * @property {number} LONG - Long timeout for slow operations (30 seconds)
 * @property {number} RETRY - Delay between retry attempts (500ms)
 */
export const TIMEOUTS = {
  DEFAULT: 10000,
  SHORT: 5000,
  LONG: 30000,
  RETRY: 500,
};

/**
 * Modal visibility states for VA web components
 * @constant
 * @type {Object.<string, string|Array<string|undefined>>}
 * @property {Array<string|undefined>} VISIBLE - Values that indicate a visible modal
 * @property {string} HIDDEN - Value that indicates a hidden modal
 */
export const MODAL_STATES = {
  VISIBLE: ['', undefined, 'true'],
  HIDDEN: 'false',
};

/**
 * Common CSS selectors used across helper functions
 * @constant
 * @type {Object.<string, string|Array<string>>}
 * @property {string} CONTINUE_BUTTON - Selector for continue button
 * @property {string} VA_MODAL - Selector for VA modal component
 * @property {string} VA_CHECKBOX - Selector for VA checkbox component
 * @property {string} VA_ALERT - Selector for VA alert component
 * @property {string} VA_BUTTON - Selector for VA button component
 * @property {string} SKIP_WIZARD - Selector for skip wizard link
 * @property {Array<string>} RADIO_NO - Selectors for "No" radio buttons
 * @property {Array<string>} RADIO_YES - Selectors for "Yes" radio buttons
 */
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
