/**
 * Constants for VA Form 21P-530a - State or Tribal Organization Application for Interment Allowance
 * @module constants
 */

export const TITLE =
  'Apply for a Veterans burial allowance for a state or tribal organization';
export const SUBTITLE =
  'State or Tribal Organization Application for Interment Allowance (Under 38 U.S.C. Chapter 23) (VA Form 21-530a)';

/**
 * Form submission endpoint
 */
export const SUBMIT_URL = '/v0/form21p_530a';

/**
 * Tracking prefix for analytics
 */
export const TRACKING_PREFIX = '21p-530a-interment-allowance-';

/**
 * Submission address for paper forms
 */
export const SUBMISSION_ADDRESS = {
  name: 'VA Pension Intake Center',
  street: 'P.O. Box 5365',
  city: 'Janesville',
  state: 'WI',
  zip: '53547-5365',
};
