import cloneDeep from 'lodash/cloneDeep';
import {
  filterInactivePageData,
  getActivePages,
  getInactivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';

import { customFormReplacer } from './formDataCleaning';
import { showV3Picklist } from './featureFlags';
import { buildSubmissionData } from './submissionDataBuilder';
import {
  transformPicklistToV2,
  enrichDivorceWithSSN,
} from './v3ToV2Transformers';

/**
 * Initializes payload with required defaults for backend submission.
 *
 * @param {Object} form - Raw form data from the application
 * @returns {Object} Payload object with data property and defaults set
 */
function prepareSubmissionPayload(form) {
  const payload = cloneDeep(form);
  if (!payload.data) {
    payload.data = {};
  }
  payload.data.useV2 = true;
  payload.data.daysTillExpires = 365;
  return payload;
}

/**
 * Filters out data from inactive pages based on form configuration.
 *
 * @param {Object} formConfig - Form configuration object defining pages and structure
 * @param {Object} payload - Payload object with data property
 * @returns {Object} Payload object with inactive page data removed
 */
function removeInactivePageData(formConfig, payload) {
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    payload.data,
  );
  const activePages = getActivePages(expandedPages, payload.data);
  const inactivePages = getInactivePages(expandedPages, payload.data);

  return filterInactivePageData(inactivePages, activePages, payload);
}

/**
 * Extracts data object from payload for transformation functions.
 *
 * TYPE SAFETY NOTE:
 * filterInactivePageData returns a payload object { data: {...}, ... }
 * but transformPicklistToV2 and showV3Picklist expect a data object.
 *
 * This extraction ensures all functions receive the correct type and prevents
 * the bug where flags are set without corresponding data.
 *
 * @param {Object} payload - Payload object with data property
 * @returns {Object} Data object extracted from payload
 */
function extractDataFromPayload(payload) {
  return payload.data || payload;
}

/**
 * Transforms V3 picklist removal data to V2 format if V3 is enabled.
 *
 * @param {Object} data - Form data object
 * @returns {Object} Data object with V3 transformations applied (if applicable)
 */
function applyPicklistTransformations(data) {
  return showV3Picklist(data) ? transformPicklistToV2(data) : data;
}

/**
 * Enriches data with SSN from awarded dependents if needed.
 *
 * @param {Object} data - Form data object
 * @returns {Object} Data object with SSN enrichment applied
 */
function enrichDataWithSSN(data) {
  return enrichDivorceWithSSN(data);
}

/**
 * Rebuilds submission data with validated flags and wraps in payload structure.
 *
 * This is where submission flags are set based on actual data presence.
 * buildSubmissionData is the single source of truth for flags that go to backend.
 *
 * @param {Object} payload - Payload structure (without data property)
 * @param {Object} transformedData - Transformed form data
 * @returns {Object} Complete payload with validated submission flags
 */
function rebuildSubmissionPayload(payload, transformedData) {
  return buildSubmissionData({
    ...payload,
    data: transformedData,
  });
}

/**
 * Get form data for submission - main entry point for form submission.
 *
 * TRANSFORMATION PIPELINE:
 * 1. Prepare payload with defaults (useV2, daysTillExpires)
 * 2. Filter out data from inactive pages
 * 3. Extract data for transformation (type safety)
 * 4. Transform V3 picklist data to V2 format
 * 5. Enrich reportDivorce with SSN from awarded dependents
 * 6. Rebuild submission data with validated flags
 * 7. Extract data from payload structure for backend
 * 8. Serialize to JSON
 *
 * @param {Object} formConfig - Form configuration object defining structure
 * @param {Object} form - Raw form data from Redux store
 * @returns {Object} Object with body (JSON string) and data (cleaned payload)
 */
export function customTransformForSubmit(formConfig, form) {
  // Step 1: Initialize payload with required defaults
  const payload = prepareSubmissionPayload(form);

  // Step 2: Remove data from pages user didn't visit/complete
  const payloadWithoutInactivePages = removeInactivePageData(
    formConfig,
    payload,
  );

  // Step 3: Extract data for transformation (type safety)
  const dataToTransform = extractDataFromPayload(payloadWithoutInactivePages);

  // Step 4: Transform V3 picklist data to V2 format if needed
  const transformedData = applyPicklistTransformations(dataToTransform);

  // Step 5: Enrich reportDivorce with SSN from awarded dependents
  const enrichedData = enrichDataWithSSN(transformedData);

  // Step 6: Rebuild payload with validated flags (single source of truth)
  const finalPayload = rebuildSubmissionPayload(
    payloadWithoutInactivePages,
    enrichedData,
  );

  // Step 7: Extract the data from payload structure for backend submission
  // buildSubmissionData returns { data: cleanData, ...payload }
  // but backend expects just the cleanData without the wrapper
  const submissionData = finalPayload.data || finalPayload;

  // Step 8: Serialize to JSON for backend submission
  return {
    body: JSON.stringify(submissionData, customFormReplacer) || '{}',
    data: finalPayload || {},
  };
}
