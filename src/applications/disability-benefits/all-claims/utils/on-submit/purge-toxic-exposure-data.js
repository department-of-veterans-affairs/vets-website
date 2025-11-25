import { cloneDeep, isEmpty, pickBy } from 'lodash';
import {
  ADDITIONAL_EXPOSURES,
  GULF_WAR_1990_LOCATIONS,
  GULF_WAR_2001_LOCATIONS,
  HERBICIDE_LOCATIONS,
} from '../../constants';

/**
 * Map of exposure types to their details keys and location constants.
 * Used to dynamically process all toxic exposure types.
 * This is the source of truth for all toxic exposure data structure.
 *
 * @constant {Object}
 */
export const EXPOSURE_TYPE_MAPPING = {
  gulfWar1990: {
    detailsKey: 'gulfWar1990Details',
    locations: GULF_WAR_1990_LOCATIONS,
  },
  gulfWar2001: {
    detailsKey: 'gulfWar2001Details',
    locations: GULF_WAR_2001_LOCATIONS,
  },
  herbicide: {
    detailsKey: 'herbicideDetails',
    locations: HERBICIDE_LOCATIONS,
    otherKey: 'otherHerbicideLocations',
  },
  otherExposures: {
    detailsKey: 'otherExposuresDetails',
    exposureTypes: ADDITIONAL_EXPOSURES,
    otherKey: 'specifyOtherExposures',
  },
};

/**
 * Checks if any conditions other than 'none' are selected.
 *
 * @param {Object.<string, boolean>} conditions - Condition selections
 * @returns {boolean} True if any non-'none' conditions are selected
 */
const hasSelectedConditions = conditions => {
  if (!conditions) return false;
  return Object.keys(conditions).some(
    key => key !== 'none' && conditions[key] === true,
  );
};

/**
 * Processes a single exposure type, removing data that will cause 422 errors or that user explicitly opted out of.
 *
 * Removes:
 * - Orphaned details when parent missing/null/invalid (prevents 422)
 * - Orphaned otherKey when parent missing/null/invalid (prevents 422)
 * - Section when user has explicit false values
 * - Section when user selected 'none: true'
 * - Details for items user unchecked
 * - otherKey when user selected 'none' or has no valid selections
 *
 * Preserves (backend validates):
 * - Empty objects {} when parent exists
 * - Undefined values
 * - Null/empty values in otherKey when parent exists
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object
 * @param {string} [mapping.otherKey] - Key for other/specify fields
 * @returns {Object} Toxic exposure object with orphaned and opted-out data removed
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherKey } = mapping;
  const result = { ...toxicExposure };

  const exposureSelections = result[exposureType];
  const hasDetails = !!result[detailsKey];
  const exposureKeyExists = exposureType in result;
  const hasValidSelections =
    exposureKeyExists &&
    exposureSelections &&
    hasSelectedConditions(exposureSelections);

  // Remove orphaned data when parent doesn't exist, is null, or malformed
  // This prevents 422 validation errors. Note: undefined is preserved (doesn't cause 422)
  const isExposureValueMalformed =
    exposureKeyExists &&
    exposureSelections !== undefined &&
    (exposureSelections === null ||
      typeof exposureSelections !== 'object' ||
      Array.isArray(exposureSelections));

  if (!exposureKeyExists || isExposureValueMalformed) {
    if (hasDetails) delete result[detailsKey];
    if (otherKey && otherKey in result) delete result[otherKey];
    if (isExposureValueMalformed) delete result[exposureType];
    return result;
  }

  // Remove entire section when user explicitly deselected options
  // Matches inverse of showSummaryPage form predicate
  if (!hasValidSelections) {
    const hasNoneSelected = exposureSelections?.none === true;
    const hasUncheckedItems = Object.values(exposureSelections || {}).some(
      val => val === false,
    );

    // Only remove if user selected 'none' or has unchecked items
    if (hasNoneSelected || hasUncheckedItems) {
      delete result[exposureType];
      delete result[detailsKey];
      if (otherKey) delete result[otherKey];
      return result;
    }
  }

  // Remove details for specific items user unchecked
  // Matches inverse of showCheckboxLoopDetailsPage form predicate
  if (hasDetails && exposureKeyExists) {
    const detailsToKeep = pickBy(
      result[detailsKey],
      (_value, key) => result[exposureType][key] === true,
    );

    if (
      Object.keys(result[detailsKey]).length !==
      Object.keys(detailsToKeep).length
    ) {
      if (isEmpty(detailsToKeep)) {
        delete result[detailsKey];
      } else {
        result[detailsKey] = detailsToKeep;
      }
    }
  }

  // Remove otherKey when user opted out of parent section
  // Note: orphaned otherKey (parent missing/null) already handled above
  if (
    otherKey &&
    otherKey in result &&
    exposureKeyExists &&
    exposureSelections
  ) {
    const hasNoneSelected = exposureSelections.none === true;
    if (hasNoneSelected || !hasValidSelections) {
      delete result[otherKey];
    }
  }

  return result;
};

/**
 * Removes toxic exposure data to prevent 422 validation errors and honor user opt-outs.
 *
 * Removes:
 * - Orphaned data without valid parent (prevents 422 errors)
 * - Data user explicitly opted out of (false values, 'none' selected)
 *
 * Preserves:
 * - Empty objects, undefined values, and unknown fields (backend validates)
 *
 * @param {Object} formData - Form data to transform
 * @param {boolean} [formData.disability526ToxicExposureOptOutDataPurge] - Feature flag
 * @param {Object} [formData.toxicExposure] - Toxic exposure data
 * @param {Object.<string, boolean>} [formData.toxicExposure.conditions] - Condition selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.gulfWar1990] - Gulf War 1990 selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.gulfWar2001] - Gulf War 2001 selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.herbicide] - Herbicide selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.otherExposures] - Other exposure selections
 * @param {Object|string} [formData.toxicExposure.otherHerbicideLocations] - Other herbicide details
 * @param {Object|string} [formData.toxicExposure.specifyOtherExposures] - Other exposure details
 * @returns {Object} Form data with orphaned and opted-out data removed
 */
export const purgeToxicExposureData = formData => {
  const featureEnabled =
    formData.disability526ToxicExposureOptOutDataPurge === true;

  if (!featureEnabled) {
    return formData;
  }

  if (!formData?.toxicExposure) {
    return formData;
  }

  const clonedData = cloneDeep(formData);
  let { toxicExposure } = clonedData;

  if (
    !toxicExposure ||
    typeof toxicExposure !== 'object' ||
    Array.isArray(toxicExposure)
  ) {
    return clonedData;
  }

  delete clonedData.toxicExposure;
  const conditions = toxicExposure.conditions || {};

  // User selected "none" for conditions - complete opt-out scenario
  if (conditions.none === true && !hasSelectedConditions(conditions)) {
    return {
      ...clonedData,
      toxicExposure: { conditions: { none: true } },
    };
  }

  // No conditions selected = no toxic exposure claim = all exposure data is orphaned
  if (!hasSelectedConditions(conditions)) {
    return clonedData;
  }

  // Process all exposure types to remove orphaned data and explicit user opt-outs
  let processedExposure = toxicExposure;
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    processedExposure = purgeExposureDetails(
      processedExposure,
      exposureType,
      mapping,
    );
  });
  toxicExposure = processedExposure;

  return { ...clonedData, toxicExposure };
};
