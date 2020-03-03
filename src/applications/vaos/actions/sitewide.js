/*
 * These are actions that are shared between the appointments reducer
 * and the newAppointmnt reducer. The newAppointment code is lazy loaded,
 * so we don't want to import it load code we don't need yet.
 */
export const STARTED_NEW_APPOINTMENT_FLOW = 'vaos/STARTED_NEW_APPOINTMENT_FLOW';
export const FORM_SUBMIT_SUCCEEDED = 'vaos/FORM_SUBMIT_SUCCEEDED';
