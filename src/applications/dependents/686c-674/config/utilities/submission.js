import cloneDeep from 'lodash/cloneDeep';

import {
  filterInactivePageData,
  getActivePages,
  getInactivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';

import {
  ADD_WORKFLOW_MAPPINGS,
  REMOVE_WORKFLOW_MAPPINGS,
  NO_SSN_REASON_PAYLOAD_MAPPINGS,
} from '../dataMappings';

import { isVetInReceiptOfPension } from './api';
import { customFormReplacer, showV3Picklist } from './formHelpers';
import {
  transformPicklistToV2,
  enrichDivorceWithSSN,
} from './picklistTransform';

/**
 * Extract data fields with values from source data
 *
 * Returns only fields that have meaningful data (non-empty values/arrays).
 * This prevents accidentally setting flags when no actual data exists, fixing
 * a bug where options could be enabled without corresponding data.
 *
 * @param {object} sourceData - source data object
 * @param {string[]} fields - fields to extract
 * @returns {object} object containing only fields with data
 */
function extractDataFields(sourceData, fields) {
  const result = {};
  fields.forEach(field => {
    const value = sourceData[field];
    if (Array.isArray(value) ? value.length > 0 : value) {
      result[field] = cloneDeep(value);
    }
  });
  return result;
}

/**
 * Transform form data into submission data format
 *
 * SINGLE SOURCE OF TRUTH for submission flags:
 * This function is the authoritative source for view:selectable686Options
 * in the final submission. It rebuilds these flags based on actual data
 * presence, not on what the user selected in the wizard.
 *
 * Why this matters:
 * - User might select an option in the wizard but not complete the data entry
 * - Pages may be visible during editing (wizard sets navigation flags)
 * - But submission should only include flags for workflows with actual data
 * - This prevents backend errors like "flag is true but data is nil"
 *
 * @param {object} payload - form object from Redux store with structure { data: {...}, ... }
 * @returns {object} - submission data object with validated flags
 */
export function buildSubmissionData(payload) {
  if (!payload?.data) {
    return payload;
  }

  const sourceData = payload.data;
  const cleanData = {};

  const addEnabled = sourceData['view:addOrRemoveDependents']?.add === true;
  const removeEnabled =
    sourceData['view:addOrRemoveDependents']?.remove === true;
  const addOptions = sourceData['view:addDependentOptions'] || {};
  const removeOptions = sourceData['view:removeDependentOptions'] || {};

  // Always include these - needed for BE
  Object.assign(cleanData, {
    useV2: true,
    daysTillExpires: 365,
  });

  const essentialFields = [
    'veteranInformation',
    'veteranContactInformation',
    'statementOfTruthSignature',
    'statementOfTruthCertified',
    'metadata',
  ];

  essentialFields.forEach(field => {
    if (sourceData[field]) {
      cleanData[field] = sourceData[field];
    }
  });

  // vaDependentsNetWorthAndPension can be false - check for undefined explicitly
  if (sourceData.vaDependentsNetWorthAndPension !== undefined) {
    cleanData.vaDependentsNetWorthAndPension =
      sourceData.vaDependentsNetWorthAndPension;
  }

  // householdIncome is only valid to submit when:
  // - The pension feature flag is off (legacy: all veterans answered this), OR
  // - The flag is on AND the veteran is confirmed in receipt of pension
  // This prevents stale answers collected before the flag was enabled from
  // reaching the backend for veterans who are not in receipt of pension.
  if (sourceData.householdIncome !== undefined) {
    const flagOn = sourceData.vaDependentsNetWorthAndPension;
    if (!flagOn || isVetInReceiptOfPension(sourceData)) {
      cleanData.householdIncome = sourceData.householdIncome;
    }
  }

  // Use centralized workflow mappings from dataMappings.js
  const addDataMappings = ADD_WORKFLOW_MAPPINGS;
  const removeDataMappings = REMOVE_WORKFLOW_MAPPINGS;
  const noSsnReasonMappings = NO_SSN_REASON_PAYLOAD_MAPPINGS;

  // Add options
  const enabledAddOptions = {};
  if (addEnabled) {
    Object.entries(addDataMappings).forEach(([option, fields]) => {
      if (addOptions[option] === true) {
        const optionData = extractDataFields(sourceData, fields);
        if (Object.keys(optionData).length > 0) {
          Object.assign(cleanData, optionData);
          enabledAddOptions[option] = true;
        }
      }
    });

    // Tranform No SSN Reason for the payload
    if (
      addOptions.addSpouse === true &&
      sourceData?.spouseInformation?.noSsn === true
    ) {
      cleanData.spouseInformation.noSsnReason =
        noSsnReasonMappings[(sourceData?.spouseInformation?.noSsnReason)];
    }
    if (addOptions.addChild === true && sourceData?.childrenToAdd?.length > 0) {
      sourceData.childrenToAdd.forEach((child, index) => {
        if (child.noSsn === true) {
          cleanData.childrenToAdd[index].noSsnReason =
            noSsnReasonMappings[child.noSsnReason];
        }
      });
    }
    if (
      addOptions.report674 === true &&
      sourceData?.studentInformation?.length > 0
    ) {
      sourceData.studentInformation.forEach((student, index) => {
        if (student.noSsn === true) {
          cleanData.studentInformation[index].noSsnReason =
            noSsnReasonMappings[student.noSsnReason];
        }
      });
    }
  }

  // Remove options
  const enabledRemoveOptions = {};
  if (removeEnabled) {
    Object.entries(removeDataMappings).forEach(([option, fields]) => {
      // Support both V2 (checkbox) and V3 (picklist) flows:
      // - V2: removeOptions[option] is set when user checks the box - only check selected options
      // - V3: removeOptions is empty - check all options after picklist transformation
      const isV3Flow = showV3Picklist(sourceData);
      const shouldCheckOption = isV3Flow || removeOptions[option] === true;

      if (shouldCheckOption) {
        const optionData = extractDataFields(sourceData, fields);
        if (Object.keys(optionData).length > 0) {
          Object.assign(cleanData, optionData);
          enabledRemoveOptions[option] = true;
        }
      }
    });
  }

  if (Object.keys(enabledAddOptions).length > 0) {
    cleanData['view:addDependentOptions'] = enabledAddOptions;
  }

  if (Object.keys(enabledRemoveOptions).length > 0) {
    cleanData['view:removeDependentOptions'] = enabledRemoveOptions;
  }

  const mainControl = {};
  if (addEnabled && Object.keys(enabledAddOptions).length > 0) {
    mainControl.add = true;
  }
  if (removeEnabled && Object.keys(enabledRemoveOptions).length > 0) {
    mainControl.remove = true;
  }

  if (Object.keys(mainControl).length > 0) {
    cleanData['view:addOrRemoveDependents'] = mainControl;
  }

  const selectableOptions = { ...enabledAddOptions, ...enabledRemoveOptions };
  if (Object.keys(selectableOptions).length > 0) {
    cleanData['view:selectable686Options'] = selectableOptions;
  }

  return { ...payload, data: cleanData };
}

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
 * IMPORTANT: Preserves critical wizard fields needed for page dependencies
 * during submission, even if their pages are marked inactive. This prevents
 * a cascade where removing view:addOrRemoveDependents causes all dependent
 * pages to become inactive and lose their data.
 *
 * @param {Object} formConfig - Form configuration object defining pages and structure
 * @param {Object} payload - Payload object with data property
 * @returns {Object} Payload object with inactive page data removed (but wizard fields preserved)
 */
function removeInactivePageData(formConfig, payload) {
  // Preserve wizard fields that are needed for page dependencies
  const wizardFields = {
    'view:addOrRemoveDependents': payload.data?.['view:addOrRemoveDependents'],
    'view:addDependentOptions': payload.data?.['view:addDependentOptions'],
    'view:removeDependentOptions':
      payload.data?.['view:removeDependentOptions'],
    'view:selectable686Options': payload.data?.['view:selectable686Options'],
  };

  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    payload.data,
  );
  const activePages = getActivePages(expandedPages, payload.data);
  const inactivePages = getInactivePages(expandedPages, payload.data);

  const filtered = filterInactivePageData(inactivePages, activePages, payload);

  // CRITICAL: filterInactivePageData can return either:
  // - Payload structure: { data: {...}, ... }
  // - Data object directly: { field1: ..., field2: ..., ... }
  // We need to restore wizard fields to the correct location
  if (!filtered) {
    return payload;
  }

  // Check if filtered has a data property (payload structure) or is a data object directly
  const isPayloadStructure = filtered.data !== undefined;
  const dataObject = isPayloadStructure ? filtered.data : filtered;

  // Restore wizard fields if they were removed
  // (They may have been removed if their pages were marked inactive due to
  // depends functions that check for awarded dependents in V3 flow)
  Object.keys(wizardFields).forEach(key => {
    if (wizardFields[key] && !dataObject[key]) {
      dataObject[key] = wizardFields[key];
    }
  });

  return filtered;
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
