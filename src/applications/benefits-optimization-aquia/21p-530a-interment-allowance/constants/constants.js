/**
 * Constants for VA Form 21P-530a - State or Tribal Organization Application for Interment Allowance
 * @module constants
 */

export const TITLE =
  'Apply for a VA interment allowance for a state or tribal organization';
export const SUBTITLE =
  'State or Tribal Organization Application for Interment Allowance (Under 38 U.S.C. Chapter 23) (VA Form 21P-530a)';

/**
 * Tracking prefix for analytics
 */
export const TRACKING_PREFIX = '21p-530a-interment-allowance-';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  csrfCheck: '/csrf_token',
  downloadPdf: '/form21p530a/download_pdf',
};
