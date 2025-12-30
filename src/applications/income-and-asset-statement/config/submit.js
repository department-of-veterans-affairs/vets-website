import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { format } from 'date-fns-tz';
import { cloneDeep } from 'lodash';
import { ensureValidCSRFToken } from '../ensureValidCSRFToken';

import {
  collectAttachmentFiles,
  pruneConfiguredArrays,
  remapIncomeTypeFields,
  remapOtherVeteranFields,
  remapRecipientRelationshipsInArrays,
  removeDisallowedFields,
  removeInvalidFields,
  replacer,
} from './submit-helpers';

// -----------------------------------------------------------------------------
// 0969 FORM SUBMISSION PIPELINE (ordered)
//
// 1. Deep clone the incoming form object (avoid mutating redux store)
// 2. Remap "otherVeteran*" → "veteran*" fields when submission requires it
// 3. Remap "recipientRelationship" fields when submission requires it
// 4. Remap discontinued income "incomeType" to human-readable values
// 5. Collect attachment files from nested arrays into the main "files" array
// 6. Remove disallowed fields that vets-api will reject
// 7. Prune configured list-and-loop array fields (trusts, annuities, waivers)
// 8. Remove invalid/null/empty/view-only fields
// 9. Flatten nested fields (e.g., recipientName) via custom JSON replacer
// 10. JSON.stringify the prepared form data (backend requires a *string*)
// 11. Wrap into the "incomeAndAssetsClaim" submission envelope
// 12. Send to vets-api with the user's local timestamp
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
 * Steps 1–5 of the 0969 submission pipeline:
 *   1. Deep clone the incoming form data (avoid mutating Redux state)
 *   2. Conditionally remap "otherVeteran*" fields to "veteran*" fields
 *      when the submitter is not the authenticated Veteran
 *   3. Conditionally remap income "recipientRelationship" fields
 *   4. Remap discontinued income "incomeType" radio values to
 *      human-readable values or "otherIncomeType" string value
 *   5. Remove disallowed fields that vets-api will reject
 * @param {Object} data - The full form object containing `data` and metadata
 * @returns {Object} - A new, cleaned data object with remapping and disallowed fields removed
 */
export function prepareFormData(data) {
  // Step 1: clone to avoid mutating original form (Redux immutability)
  const clonedData = cloneDeep(data);

  const { claimantType, isLoggedIn } = clonedData;
  const userIsVeteran = isLoggedIn === true && claimantType === 'VETERAN';

  // Step 2: remap “otherVeteran*” → “veteran*” only when necessary
  const dataWithVeteranFieldsAdjusted = userIsVeteran
    ? clonedData
    : remapOtherVeteranFields(clonedData);

  // Step 3: remap income array fields when claimantType is "CUSTODIAN" or "PARENT"
  const dataWithAllFieldsAdjusted =
    claimantType === 'CUSTODIAN' || claimantType === 'PARENT'
      ? remapRecipientRelationshipsInArrays(dataWithVeteranFieldsAdjusted)
      : dataWithVeteranFieldsAdjusted;

  // Step 4: Transform discontinued incomes only if the array exists and has items
  const { discontinuedIncomes } = dataWithAllFieldsAdjusted;
  let maybeTransformedIncomes;
  if (Array.isArray(discontinuedIncomes) && discontinuedIncomes.length > 0) {
    maybeTransformedIncomes = discontinuedIncomes.map(remapIncomeTypeFields);
  }

  // Step 4: Collect attachments from 'trusts' and 'ownedAssets' into the 'files' array
  const collectedFiles = collectAttachmentFiles(clonedData);
  const newFiles = [
    ...(dataWithVeteranFieldsAdjusted.files || []),
    ...collectedFiles,
  ];

  // Assemble final object — only include discontinuedIncomes if we transformed it
  const assembledData = {
    ...dataWithAllFieldsAdjusted,
    ...(maybeTransformedIncomes
      ? { discontinuedIncomes: maybeTransformedIncomes }
      : {}),
    ...(newFiles.length > 0 ? { files: newFiles } : {}),
  };

  // Step 5: remove fields vets-api does not accept
  return removeDisallowedFields(assembledData, disallowedFields);
}

/**
 * Serializes and finalizes the cleaned form data in preparation for submission
 *
 * Steps 6–8 of the 0969 submission pipeline:
 *   6. Prune configured list-and-loop array fields via prune config
 *   7. Ensure no undefined values remain (backend rejects them)
 *   8. Return a final JSON payload string
 * @param {Object} preparedData - The prepared and cleaned form data object
 * @returns {string} A fully serialized, JSON-string payload ready for transmission
 */
export function serializePreparedFormData(preparedData) {
  // Step 6: apply array pruning rules
  const pruned = pruneConfiguredArrays(preparedData, arraysPruneConfig);

  // Step 7: remove view-only, empty, invalid fields
  const cleaned = removeInvalidFields(pruned);

  // Step 8: Flatten nested fields (e.g., recipientName) via custom JSON replacer
  return JSON.stringify(cleaned, replacer);
}

/**
 * Main submission transform that executes the 0969 submission pipeline
 * and returns the final payload for the API.
 *
 * Steps 9-10 of the 0969 submission pipeline:
 *   9. Invoke the full submission pipeline
 *   10. Return the final JSON payload for submission
 * @param {Object} form - The full form object containing `data` and metadata
 * @returns {string} Fully transformed JSON payload for submission
 */
export function transform(form) {
  const preparedData = prepareFormData(form.data);
  const serializedData = serializePreparedFormData(preparedData);

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
 * Step 11 of the 0969 submission pipeline
 *   11: Send to vets-api
 * @param {Object} form - The full form object containing `data` and metadata
 * @param {Object} formConfig - The form configuration object containing metadata and tracking info
 * @returns {Promise<Object>} A promise resolving to the API response object from the submission request
 */
export async function submit(form, formConfig) {
  const headers = { 'Content-Type': 'application/json' };
  const body = transform(form);
  const apiRequestOptions = {
    body,
    headers,
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
      if (window.DD_LOGS?.logger?.error) {
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
        if (window.DD_LOGS?.logger?.error) {
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
