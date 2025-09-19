import { isEmpty, pickBy, cloneDeep } from 'lodash';
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
 * Helper function that processes a single exposure type, removing orphaned and
 * non-applicable data. Called by purgeToxicExposureData for each exposure type
 * (gulfWar1990, gulfWar2001, herbicide, otherExposures).
 *
 * Handles four main cleanup scenarios for each exposure type:
 * 1. Removes null exposure fields as orphaned data
 * 2. Removes orphaned details when main selection is missing
 * 3. Removes entire section when all values are false/none
 * 4. Removes "other" fields when null, invalid, or user selected 'none'
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @param {Object.<string, boolean>} [toxicExposure[exposureType]] - Location/exposure selections as boolean values
 * @param {Object} [toxicExposure[detailsKey]] - Detail objects (dates, descriptions) for selected locations
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object
 * @param {string} [mapping.otherKey] - Key for other/specify fields
 * @returns {Object} Toxic exposure object with orphaned/non-applicable data removed
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherKey } = mapping;
  const result = { ...toxicExposure };

  // Remove null exposure fields (orphaned data)
  if (result[exposureType] === null) {
    delete result[exposureType];
    delete result[detailsKey];
    delete result[otherKey];
    return result;
  }

  // Remove orphaned details (details without corresponding exposure selections)
  if (result[detailsKey] && !result[exposureType]) {
    delete result[detailsKey];
  }

  // Remove entire exposure section when user deselected all options
  if (result[exposureType] && !hasSelectedConditions(result[exposureType])) {
    delete result[exposureType];
    delete result[detailsKey];
    delete result[otherKey];
  }

  // Remove details for deselected items
  if (result[detailsKey] && result[exposureType]) {
    const retainedDetails = pickBy(
      result[detailsKey],
      (_value, key) => result[exposureType][key] === true,
    );

    if (isEmpty(retainedDetails)) {
      delete result[detailsKey];
    } else {
      result[detailsKey] = retainedDetails;
    }
  }

  // Remove other/specify fields when:
  // - Field is null (orphaned data)
  // - User selected 'none' or has no selections
  if (
    otherKey &&
    otherKey in result &&
    (result[otherKey] === null ||
      result[exposureType]?.none ||
      !hasSelectedConditions(result[exposureType]))
  ) {
    delete result[otherKey];
  }

  return result;
};

/**
 * Removes orphaned and non-applicable toxic exposure data from form payload
 * to prevent backend validation errors when users opt out of sections.
 *
 * This function handles scenarios where users:
 * - Start filling sections then deselect them (leaving orphaned details)
 * - Select "none" for conditions (complete opt-out)
 * - Remove all selections but leave partial data behind
 *
 * NOT a validation function - this is purely for cleaning up data that
 * shouldn't be submitted based on user's opt-out choices.
 *
 * @param {Object} formData - Form data to transform
 * @param {boolean} [formData.disability526ToxicExposureOptOutDataPurge] - Feature flag for opt-out data purging
 * @param {Object} [formData.toxicExposure] - Toxic exposure data
 * @param {Object.<string, boolean>} [formData.toxicExposure.conditions] - Health condition selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.gulfWar1990] - Gulf War 1990 location selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.gulfWar2001] - Gulf War 2001 location selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.herbicide] - Herbicide exposure location selections
 * @param {Object.<string, boolean>} [formData.toxicExposure.otherExposures] - Other exposure type selections
 * @returns {Object} Form data with orphaned/non-applicable toxic exposure data removed
 */
export const purgeToxicExposureData = formData => {
  if (formData.disability526ToxicExposureOptOutDataPurge !== true) {
    return formData;
  }

  if (!formData?.toxicExposure) {
    return formData;
  }

  const clonedData = cloneDeep(formData);
  let { toxicExposure } = clonedData;

  // Handle invalid toxicExposure types (string, array, etc.)
  if (
    !toxicExposure ||
    typeof toxicExposure !== 'object' ||
    Array.isArray(toxicExposure)
  ) {
    return clonedData;
  }

  // Remove toxicExposure from clonedData
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
    // Remove entire toxicExposure when no conditions are selected
    return clonedData;
  }

  // Remove orphaned data from all exposure types
  let processedExposure = toxicExposure;
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    processedExposure = purgeExposureDetails(
      processedExposure,
      exposureType,
      mapping,
    );
  });
  toxicExposure = processedExposure;

  // Remove unchecked conditions
  if (toxicExposure.conditions) {
    toxicExposure.conditions = pickBy(
      toxicExposure.conditions,
      value => value === true,
    );
  }

  // Remove entire toxicExposure if user opted out of everything
  const hasNoMeaningfulData = Object.keys(toxicExposure).every(key => {
    const value = toxicExposure[key];
    return !value || (typeof value === 'object' && isEmpty(value));
  });

  if (hasNoMeaningfulData) {
    return clonedData;
  }

  return { ...clonedData, toxicExposure };
};
