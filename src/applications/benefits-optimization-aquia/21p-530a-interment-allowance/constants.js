/**
 * Constants for VA Form 21P-530a - State or Tribal Organization Application for Interment Allowance
 * @module constants
 */

export const TITLE =
<<<<<<< HEAD
  'Apply for a Veterans burial allowance for a state or tribal organization';
=======
  'State or Tribal Organization Application for Interment Allowance';
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
export const SUBTITLE = 'VA Form 21P-530a';

/**
 * Form submission endpoint
 */
export const SUBMIT_URL = '/v0/form21p_530a';

/**
 * Tracking prefix for analytics
 */
export const TRACKING_PREFIX = '21p-530a-interment-allowance-';

/**
 * Branch of service options
 */
export const BRANCH_OF_SERVICE = [
  { value: 'army', label: 'Army' },
  { value: 'navy', label: 'Navy' },
  { value: 'marines', label: 'Marines' },
  { value: 'air_force', label: 'Air Force' },
  { value: 'space_force', label: 'Space Force' },
  { value: 'coast_guard', label: 'Coast Guard' },
  { value: 'national_guard', label: 'National Guard' },
  { value: 'reserves', label: 'Reserves' },
];

/**
 * Current interment allowance rate
 * Note: This is adjusted annually for inflation
 */
export const CURRENT_ALLOWANCE_RATE = '$978';

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
