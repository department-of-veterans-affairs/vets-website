/*
 * Map service labels as passed in from platform-monitoring's `externalService` variable
 * Service labels come from vets-api as snake_case values.
 */

/* @constant
 * @type {string}
 */
const defaultLabel = 'My HealtheVet';

/*
 * @readonly
 * @enum {string}
 */
/* eslint-disable camelcase */
const mhvServiceLabels = {
  mhv: 'MHV Login',
  mhv_meds: 'Medications',
  mhv_mr: 'Medical Records',
  mhv_platform: defaultLabel,
  mhv_sm: 'Secure Messaging',
};
/* eslint-enable camelcase */

export { defaultLabel, mhvServiceLabels };
