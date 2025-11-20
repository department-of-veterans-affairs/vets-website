import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { format } from 'date-fns-tz';
import { cloneDeep } from 'lodash';
import { remapOtherVeteranFields } from './submit-helpers';
import { ensureValidCSRFToken } from '../ensureValidCSRFToken';

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
 * @param {Object} data - The full form object containing `data` and metadata
 * @returns {Object} - A new, cleaned data object with remapping and disallowed fields removed
 */
export function prepareFormData(data) {
  // Step 1: clone to avoid mutating original form (Redux immutability)
  const clonedData = cloneDeep(data);

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
 * @param {Object} preparedData - The prepared and cleaned form data object
 * @param {Object} replacerFn - The prepared and cleaned form data object
 * @returns {string} A fully serialized, JSON-string payload ready for transmission
 */
export function serializePreparedFormData(preparedData, replacerFn) {
  // Step 4: apply array pruning rules
  const pruned = pruneConfiguredArrays(preparedData, arraysPruneConfig);

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
 * @param {Object} form - The full form object containing `data` and metadata
 * @returns {string} Fully transformed JSON payload for submission
 */
export function transform(form) {
  const preparedData = prepareFormData(form.data);
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
 * @param {Object} form - The full form object containing `data` and metadata
 * @returns {Promise<Object>} A promise resolving to the API response object from the submission request
 */
export async function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(formConfig, form);
  const apiRequestOptions = {
    body,
    headers,
    body,
    method: 'POST',
    mode: 'cors',
  };

  const onSuccess = resp => {
    window.dataLayer.push({
      event: `${formConfig.trackingPrefix}-submission-successful`,
    });
    return resp.data;
  };

  const onFailure = respOrError => {
    if (respOrError instanceof Response && respOrError.status === 429) {
      const error = new Error('vets_throttled_error_income_and_assets');
      error.extra = parseInt(respOrError.headers.get('x-ratelimit-reset'), 10);

      return Promise.reject(error);
    }
    return Promise.reject(respOrError);
  };

  const sendRequest = async () => {
    await ensureValidCSRFToken();
    return apiRequest(
      `${environment.API_URL}/income_and_assets/v0/form0969`,
      apiRequestOptions,
    ).then(onSuccess);
  };

  return sendRequest().catch(async respOrError => {
    // if it's a CSRF error, clear CSRF and retry once
    const errorResponse = respOrError?.errors?.[0];
    if (
      errorResponse?.status === '403' &&
      errorResponse?.detail === 'Invalid Authenticity Token'
    ) {
      // Log the CSRF error before retrying
      if (window.DD_LOGS) {
        window.DD_LOGS.logger.error(
          '21P-0969 CSRF token invalid, retrying request',
          {
            formId: formConfig.formId,
            trackingPrefix: formConfig.trackingPrefix,
            inProgressFormId: form?.loadedData?.metadata?.inProgressFormId,
            errorCode: errorResponse?.code,
            errorStatus: errorResponse?.status,
            timestamp: new Date().toISOString(),
          },
        );
      }

      localStorage.setItem('csrfToken', '');
      return sendRequest().catch(retryError => {
        // Log the failed retry
        if (window.DD_LOGS) {
          window.DD_LOGS.logger.error('21P-0969 CSRF retry failed', {
            formId: formConfig.formId,
            trackingPrefix: formConfig.trackingPrefix,
            inProgressFormId: form?.loadedData?.metadata?.inProgressFormId,
            originalError: errorResponse,
            retryError: retryError?.errors?.[0],
            timestamp: new Date().toISOString(),
          });
        }
        return onFailure(retryError);
      });
    }

    // in other cases, handle error regularly
    return onFailure(respOrError);
  });
}
