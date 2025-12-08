import { cloneDeep, isEmpty, pickBy } from 'lodash';
import {
  ADDITIONAL_EXPOSURES,
  GULF_WAR_1990_LOCATIONS,
  GULF_WAR_2001_LOCATIONS,
  HERBICIDE_LOCATIONS,
} from '../../constants';

/**
 * Exposure type configuration for purge processing.
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
 * Checks if user has any true selections in an exposure type.
 *
 * @param {Object.<string, boolean>} selections - Selection object
 * @returns {boolean} True if any selections are true
 */
const hasValidSelections = selections => {
  if (!selections || typeof selections !== 'object') return false;
  return Object.values(selections).some(val => val === true);
};

/**
 * Checks if user explicitly opted out (has false values or selected 'none').
 *
 * @param {Object.<string, boolean>} selections - Selection object
 * @returns {boolean} True if user explicitly opted out
 */
const hasExplicitOptOut = selections => {
  if (!selections) return false;
  if (selections.none === true) return true;
  return Object.values(selections).some(val => val === false);
};

/**
 * Purges data for a single exposure type based on user opt-out actions.
 * Only removes data when user explicitly deselected items.
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object
 * @param {string} [mapping.otherKey] - Key for other/specify fields
 * @returns {Object} Toxic exposure object with opted-out data removed
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherKey } = mapping;
  const result = { ...toxicExposure };
  const exposureSelections = result[exposureType];

  // Skip if exposureSelections not present
  if (!(exposureType in result)) {
    return result;
  }

  // User opted out of entire section - remove all related data
  if (
    !hasValidSelections(exposureSelections) &&
    hasExplicitOptOut(exposureSelections)
  ) {
    delete result[exposureType];
    delete result[detailsKey];
    if (otherKey) delete result[otherKey];
    return result;
  }

  // Remove details for specific unchecked items
  if (result[detailsKey] && exposureSelections) {
    const detailsToKeep = pickBy(
      result[detailsKey],
      (_value, key) => exposureSelections[key] === true,
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

  // Remove otherKey if user selected 'none' or has no valid selections
  if (otherKey && otherKey in result && exposureSelections) {
    const shouldRemoveOtherKey =
      exposureSelections.none === true ||
      !hasValidSelections(exposureSelections);
    if (shouldRemoveOtherKey) {
      delete result[otherKey];
    }
  }

  return result;
};

/**
 * Removes toxic exposure data when users opt out of sections to prevent
 * backend validation errors.
 *
 * This function handles scenarios where users:
 * - Deselect all items in a section (all false values)
 * - Select "none" for conditions (complete opt-out)
 * - Uncheck specific items (removes associated details)
 *
 * Key behaviors:
 * - Keeps false values in selection objects (conditions, exposures) for backend visibility when mixed with true values
 * - Only removes entire sections when user has no true selections (all false or only 'none')
 * - Removes detail objects for items that are not selected (false or missing)
 * - Uses lodash's cloneDeep to prevent mutation
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
 * @returns {Object} Form data with opted-out data removed
 */
export const purgeToxicExposureData = formData => {
  // Feature flag check
  if (!formData?.disability526ToxicExposureOptOutDataPurge) {
    return formData;
  }

  // No toxic exposure data to process
  if (!formData.toxicExposure) {
    return formData;
  }

  const clonedData = cloneDeep(formData);
  let { toxicExposure } = clonedData;
  delete clonedData.toxicExposure;

  const conditions = toxicExposure.conditions || {};

  // User explicitly selected 'none' - keep minimal structure
  if (conditions.none === true && !hasSelectedConditions(conditions)) {
    return {
      ...clonedData,
      toxicExposure: { conditions: { none: true } },
    };
  }

  // No conditions selected - remove entire toxicExposure
  if (!hasSelectedConditions(conditions)) {
    return clonedData;
  }

  // Process each exposure type for user opt-outs
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    toxicExposure = purgeExposureDetails(toxicExposure, exposureType, mapping);
  });

  return { ...clonedData, toxicExposure };
};
