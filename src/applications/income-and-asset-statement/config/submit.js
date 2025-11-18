import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { format } from 'date-fns-tz';
import { cloneDeep } from 'lodash';
import {
  pruneConfiguredArrays,
  remapOtherVeteranFields,
  removeDisallowedFields,
  removeInvalidFields,
  replacer,
} from './submit-helpers';

// -----------------------------------------------------------------------------
// 0969 FORM SUBMISSION PIPELINE (ordered)
//
// 1. Deep clone the incoming form object (avoid mutating redux store)
// 2. Remap "otherVeteran*" → "veteran*" fields when submission requires it
// 3. Remove disallowed fields that vets-api will reject
// 4. Prune configured list-and-loop array fields (trusts, annuities, waivers)
// 5. Remove invalid/null/empty/view-only fields
// 6. Flatten nested fields (e.g., recipientName) via custom JSON replacer
// 7. JSON.stringify the prepared form data (backend requires a *string*)
// 8. Wrap into the "incomeAndAssetsClaim" submission envelope
// 9. Send to vets-api with the user's local timestamp
// -----------------------------------------------------------------------------

// Fields vets-api does *not* allow for this submission
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

// Array pruning rules — remove inactive fields on list-and-loops
const arraysPruneConfig = {
  trusts: [
    {
      field: 'addedFundsAfterEstablishment',
      when: val => val === false,
      remove: ['addedFundsDate', 'addedFundsAmount'],
    },
  ],

  annuities: [
    {
      field: 'addedFundsAfterEstablishment',
      when: val => val === false,
      remove: ['addedFundsDate', 'addedFundsAmount'],
    },
  ],

  incomeReceiptWaivers: [
    {
      field: 'view:paymentsWillResume',
      when: val => val === false,
      remove: ['paymentResumeDate', 'expectedIncome'],
    },
  ],
};

/**
 * Clone and prepare the raw form data before serialization
 *
 * Steps 1–3 of the 0969 submission pipeline:
 *   1. Deep clone the incoming form data (avoid mutating Redux state)
 *   2. Conditionally remap "otherVeteran*" fields to "veteran*" fields
 *      when the submitter is not the authenticated Veteran
 *   3. Remove disallowed fields that vets-api will reject
 * @param {Object} form - The full form object from the platform, containing `data`
 * @param {Object} form.data - The data object representing user-entered form values
 * @returns {Object} - A new, cleaned data object with remapping and disallowed fields removed
 */
function prepareFormData(form) {
  // Step 1: clone to avoid mutating original form (Redux immutability)
  const clonedData = cloneDeep(form.data);

  const { claimantType, isLoggedIn } = clonedData;
  const userIsVeteran = isLoggedIn === true && claimantType === 'VETERAN';

  // Step 2: remap “otherVeteran*” → “veteran*” only when necessary
  const remappedData = userIsVeteran
    ? clonedData
    : remapOtherVeteranFields(clonedData);

  // Step 3: remove fields vets-api does not accept
  return removeDisallowedFields(remappedData, disallowedFields);
}

/**
 * Serializes and finalizes the cleaned form data in preparation for submission
 *
 * Steps 4–6 of the 0969 submission pipeline:
 *   4. Prune configured list-and-loop array fields via prune config
 *   5. Ensure no undefined values remain (backend rejects them)
 *   6. Return a final JSON payload string
 * @param {Object} data - The prepared and cleaned form data object
 * @param {Object} replacerFn - The prepared and cleaned form data object
 * @returns {string} A fully serialized, JSON-string payload ready for transmission
 */
function serializePreparedFormData(data, replacerFn) {
  // Step 4: apply array pruning rules
  const pruned = pruneConfiguredArrays(data, arraysPruneConfig);

  // Step 5: remove view-only, empty, invalid fields
  const cleaned = removeInvalidFields(pruned);

  // Step 6: Flatten nested fields (e.g., recipientName) via custom JSON replacer
  return JSON.stringify(cleaned, replacerFn);
}

/**
 * Main submission transform that executes the 0969 submission pipeline
 * and returns the final payload for the API.
 *
 * Steps 7–8 of the 0969 submission pipeline:
 *   7. Invoke the full submission pipeline
 *   8. Return the final JSON payload for submission
 * @param {Object} formConfig - The form configuration object (not modified)
 * @param {Object} form - The full form object containing `data` and metadata
 * @returns {string} Fully transformed JSON payload for submission
 */
export function transform(formConfig, form) {
  const preparedData = prepareFormData(form);
  const serializedData = serializePreparedFormData(preparedData, replacer);

  return JSON.stringify({
    incomeAndAssetsClaim: {
      // NOTE: Backend requires the form content as a *string*, not an object
      form: serializedData,
    },
    localTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  });
}

/**
 * Submit the 0969 form to the backend API
 *
 * Step 9 of the 0969 submission pipeline
 *   9: Send to vets-api
 * @param {Object} form - The form object containing data to be submitted
 * @param {Object} formConfig - Configuration object for the form, used in transforming the data
 * @returns {Promise<Object>} A promise resolving to the API response object from the submission request
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
