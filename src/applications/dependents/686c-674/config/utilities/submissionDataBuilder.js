import cloneDeep from 'lodash/cloneDeep';
import {
  ADD_WORKFLOW_MAPPINGS,
  REMOVE_WORKFLOW_MAPPINGS,
} from '../dataMappings';
import { showV3Picklist } from './featureFlags';

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

  // Handle fields that can be undefined/false - vaDependentsNetWorthAndPension recently added to formData
  ['householdIncome', 'vaDependentsNetWorthAndPension'].forEach(field => {
    if (sourceData[field] !== undefined) {
      cleanData[field] = sourceData[field];
    }
  });

  // Use centralized workflow mappings from dataMappings.js
  const addDataMappings = ADD_WORKFLOW_MAPPINGS;
  const removeDataMappings = REMOVE_WORKFLOW_MAPPINGS;

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
