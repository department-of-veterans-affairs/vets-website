/*
 * These are actions that are shared by multiple reducers. Because we are lazy loading
 * reducers, importing across those boundaries may pull in code we don't want.
 */
export const STARTED_NEW_APPOINTMENT_FLOW = 'vaos/STARTED_NEW_APPOINTMENT_FLOW';
export const FORM_SUBMIT_SUCCEEDED = 'vaos/FORM_SUBMIT_SUCCEEDED';
