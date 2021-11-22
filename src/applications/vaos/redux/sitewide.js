/*
 * These are actions that are shared by multiple reducers. Because we are lazy loading
 * reducers, importing across those boundaries may pull in code we don't want.
 */
export const STARTED_NEW_APPOINTMENT_FLOW = 'vaos/STARTED_NEW_APPOINTMENT_FLOW';
export const STARTED_NEW_EXPRESS_CARE_FLOW =
  'vaos/STARTED_NEW_EXPRESS_CARE_FLOW';
export const STARTED_NEW_VACCINE_FLOW = 'vaos/STARTED_NEW_VACCINE_FLOW';
export const FORM_SUBMIT_SUCCEEDED = 'vaos/FORM_SUBMIT_SUCCEEDED';
export const EXPRESS_CARE_FORM_SUBMIT_SUCCEEDED =
  'expressCare/FORM_SUBMIT_SUCCEEDED';
export const VACCINE_FORM_SUBMIT_SUCCEEDED =
  'covid19Vaccine/FORM_SUBMIT_SUCCEEDED';
