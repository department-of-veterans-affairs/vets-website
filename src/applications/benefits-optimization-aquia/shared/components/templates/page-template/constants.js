/**
 * Constants for page-template components
 * @module components/templates/page-template/constants
 */

// Date format strings
export const DATE_FORMAT = {
  SAVED_AT: "MMMM d, yyyy', at' h:mm aaaa z.",
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
};

// CSS Classes
export const CSS_CLASSES = {
  // Layout classes
  FORM_PANEL: 'form-panel',
  FIELDSET: 'vads-u-margin-y--2',

  // Typography classes
  HEADING_DARK: 'vads-u-color--gray-dark',
  HEADING_SERIF: 'vads-u-font-family--serif',
  HEADING_SIZE: 'vads-u-font-size--h4',
  HEADING_LINE_HEIGHT: 'vads-u-line-height--1',
  HEADING_NO_TOP_MARGIN: 'vads-u-margin-top--0',

  // Spacing classes
  MARGIN_Y_2: 'vads-u-margin-y--2',
  MARGIN_TOP_2: 'vads-u-margin-top--2',
  MARGIN_BOTTOM_1P5: 'vads-u-margin-bottom--1p5',
  MARGIN_BOTTOM_2: 'vads-u-margin-bottom--2',
  MARGIN_0: 'vads-u-margin--0',
  PADDING_1: 'vads-u-padding--1',

  // Layout utilities
  DISPLAY_FLEX: 'vads-u-display--flex',
  DISPLAY_BLOCK: 'vads-u-display--block',
  JUSTIFY_SPACE_BETWEEN: 'vads-u-justify-content--space-between',
  JUSTIFY_FLEX_END: 'vads-u-justify-content--flex-end',

  // Save status specific
  SAVE_SUCCESS_CONTAINER: 'panel saved-success-container',
  SAVE_ERROR: 'schemaform-save-error',
  SAVE_AUTOSAVING: 'saved-form-autosaving',
};

// Error messages
export const ERROR_MESSAGES = {
  CLIENT_FAILURE: (appType = 'application') =>
    `We're sorry. We're unable to connect to VA.gov. Please check that you're connected to the Internet, so we can save your ${appType} in progress.`,

  SERVER_FAILURE: (appType = 'application') =>
    `We're sorry, but we're having some issues and are working to fix them. You can continue filling out the ${appType}, but it will not be automatically saved as you fill it out.`,

  NO_AUTH_PREFIX: "Sorry, you're no longer signed in.",
  NO_AUTH_LINK_TEXT: (appType = 'application') =>
    `Sign in to save your ${appType} in progress`,
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED_SUCCESSFULLY_DEFAULT: 'We saved your application.',
  APPLICATION_ID: 'Your application ID number is',
  SAVED_AT: 'We saved it on',
};

// Navigation button text
export const BUTTON_TEXT = {
  BACK: 'Back',
  CONTINUE: 'Continue',
  SAVE: 'Save',
  UPDATE: 'Update',
};

// Default values
export const DEFAULTS = {
  FINISH_APP_LATER_MESSAGE: 'Finish this application later',
  APP_TYPE: 'application',
  SECTION_NAME: 'default',
};

// Accessibility
export const ARIA_LABELS = {
  SAVE_SUCCESS: 'Application saved successfully',
  SAVE_ERROR: 'Error saving application',
  SAVE_IN_PROGRESS: 'Saving application',
  FORM_NAVIGATION: 'Form navigation',
  REVIEW_MODE_NAVIGATION: 'Review page navigation',
};

// Test IDs for easier testing
export const TEST_IDS = {
  SAVE_STATUS_CONTAINER: 'save-status-container',
  SAVE_SUCCESS_ALERT: 'save-success-alert',
  SAVE_ERROR_ALERT: 'save-error-alert',
  SAVING_INDICATOR: 'saving-indicator',
  BACK_BUTTON: 'back-button',
  CONTINUE_BUTTON: 'continue-button',
  UPDATE_BUTTON: 'update-button',
  FORM_CONTAINER: 'form-container',
};
