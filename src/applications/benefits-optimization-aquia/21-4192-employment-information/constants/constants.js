/**
 * @module constants
 * @description Application-wide constants for VA Form 21-4192
 */

/**
 * Main title for the form application
 * @constant {string}
 */
export const TITLE =
  'Provide Employment Information in Connection with Claim for Disability Benefits';

/**
 * Subtitle displaying the form number and description
 * @constant {string}
 */
export const SUBTITLE =
  'Request for Employment Information in Connection with Claim for Disability Benefits (VA Form 21-4192)';

/**
 * Form submission status states
 * @constant {Object}
 */
export const SUBMISSION_STATUS = {
  NOT_ATTEMPTED: 'not-attempted',
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
};

/**
 * Form sections
 * @constant {Object}
 */
export const SECTIONS = {
  EMPLOYER_INFORMATION: 'employer-information',
  VETERAN_INFORMATION: 'veteran-information',
  EMPLOYMENT_DETAILS: 'employment-details',
  TERMINATION_INFO: 'termination-info',
  BENEFITS_INFO: 'benefits-info',
  RESERVE_GUARD: 'reserve-guard',
  CERTIFICATION: 'certification',
};

/**
 * Employment status options
 * @constant {Object}
 */
export const EMPLOYMENT_STATUS = {
  CURRENT: 'current',
  TERMINATED: 'terminated',
};

/**
 * Termination reason options
 * @constant {Object}
 */
export const TERMINATION_REASONS = {
  RESIGNED: 'resigned',
  LAID_OFF: 'laid_off',
  RETIRED_DISABILITY: 'retired_disability',
  RETIRED_AGE: 'retired_age',
  OTHER: 'other',
};

/**
 * Time lost units
 * @constant {Object}
 */
export const TIME_LOST_UNITS = {
  DAYS: 'days',
  HOURS: 'hours',
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  csrfCheck: '/csrf_token',
  downloadPdf: '/form214192/download_pdf',
};
