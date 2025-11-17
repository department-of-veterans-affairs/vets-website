import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { format } from 'date-fns-tz';
import { cloneDeep } from 'lodash';
import { remapOtherVeteranFields } from './submit-helpers';

const disallowedFields = [
  'vaFileNumberLastFour',
  'veteranSsnLastFour',
  'otherVeteranFullName',
  'otherVeteranSocialSecurityNumber',
  'otherVaFileNumber',
  '_metadata', // old arrayBuilder metadata key
  'metadata', // arrayBuilder metadata key
  'isLoggedIn',
];

/**
 * Build a full name string from an object containing first/middle/last
 * @param {Object} fullName Object to be destructured for flattening
 * @param {string} first First name to be processed
 * @param {string} middle Middle name to be processed
 * @param {string} last Last name to be processed
 * @returns {string} A single string combining the provided name parts,
 * with undefined or empty parts removed and separated by spaces
 */
export function flattenRecipientName({ first, middle, last }) {
  // Filter out undefined values and join with spaces
  const parts = [first, middle, last].filter(part => !!part);

  // Join remaining parts with space and trim extra spaces
  return parts.join(' ').trim();
}

/**
 * Custom replacer for JSON.stringify used to clean empty or null values
 * and flatten recipientName objects.
 * @param {string} key The key of the property being processed
 * @param {*} value The value of the property being processed
 * @returns {*} Returns the cleaned or transformed value for JSON serialization,
 *  or `undefined` to omit the key from the final JSON
 */
export function replacer(key, value) {
  // Clean up empty objects, which we have no reason to send
  if (typeof value === 'object' && value) {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }
  }

  // Clean up null values, which we have no reason to send
  if (value === null) {
    return undefined;
  }

  if (key === 'recipientName') {
    // If the value is an object, flatten it to a string
    if (typeof value === 'object' && value !== null) {
      return flattenRecipientName(value);
    }
    // If it's already a string, return it as is
    return value;
  }

  return value;
}

/**
 * Remove fields that are not allowed to be submitted from a form object.
 * @param {Object} form - The form object containing a `data` property.
 * @param {Object} form.data - The form data object where fields may be removed.
 * @returns {Object} A deep-cloned copy of the original form with disallowed fields
 * removed from the `data` property, leaving all other fields intact.
 */
export function removeDisallowedFields(form) {
  const cleanedForm = cloneDeep(form);

  // Remove disallowed fields from the data
  disallowedFields.forEach(field => {
    if (cleanedForm.data[field] !== undefined) {
      delete cleanedForm.data[field];
    }
  });

  return cleanedForm;
}

/**
 * Prepare form data for backend submission by cloning, cleaning, and stringifying it.
 * @param {Object} formConfig - The configuration object for the form
 * @param {Object} form - The form object containing a `data` property to be transformed.
 * @param {Object} form.data - The form data object where certain fields may be removed.
 * @param {Function} replacerFn - A custom replacer function for `JSON.stringify`
 * that removes null/empty/view: values.
 * @returns {string} A JSON string of the cleaned form data, ready for submission.
 */
export function transformForSubmit(formConfig, form, replacerFn) {
  // Clone the form data to avoid mutating the original form
  // This is to avoid mutating the redux store directly
  const data = cloneDeep(form.data);

  const fields = Object.keys(data);
  fields.forEach(field => {
    if (
      data[field] === undefined ||
      data[field] === null ||
      field.startsWith('view:')
    ) {
      delete data[field];
    }
  });

  return JSON.stringify(data, replacerFn);
}

/**
 * Main pre-submit transform that remaps certain fields, removes disallowed fields,
 * and builds the final submission payload for backend submission.
 * @param {Object} formConfig - Configuration object for the form (used for submission, not mutated).
 * @param {Object} form - The form object containing a `data` property to be transformed.
 * @param {Object} form.data - Form data including `claimantType`, `isLoggedIn`, and other fields.
 * @returns {string} A JSON string containing:
 *   - `incomeAndAssetsClaim.form`: The cleaned and transformed form data as a string.
 *   - `localTime`: The current local time formatted with offset, for submission tracking.
 */
export function transform(formConfig, form) {
  const clonedForm = cloneDeep(form);

  const { claimantType, isLoggedIn } = clonedForm.data;

  const shouldRemap = isLoggedIn !== true || claimantType !== 'VETERAN';

  if (shouldRemap) {
    // map otherVeteran* fields to veteran* fields for backend submission
    clonedForm.data = remapOtherVeteranFields(clonedForm.data);
  }

  // Remove disallowed fields from the form data as they will
  // get flagged by vets-api and the submission will be rejected
  const cleanedForm = removeDisallowedFields(clonedForm);

  const formData = transformForSubmit(formConfig, cleanedForm, replacer);

  return JSON.stringify({
    incomeAndAssetsClaim: {
      form: formData,
    },
    // can’t use toISOString because we need the offset
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
}

/**
 * Submit the 0969 form to the backend API.
 * @param {Object} form - The form object containing data to be submitted.
 * @param {Object} formConfig - Configuration object for the form, used in transforming the data.
 * @returns {Promise<Object>} A promise resolving to the API response object from the submission request.
 */
export function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(formConfig, form);

  return apiRequest(`${environment.API_URL}/income_and_assets/v0/form0969`, {
    body,
    headers,
    method: 'POST',
    mode: 'cors',
  });
}
