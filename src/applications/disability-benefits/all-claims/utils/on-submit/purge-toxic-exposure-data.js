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
 * Helper function that processes a single exposure type, removing orphaned and
 * non-applicable data. Called by purgeToxicExposureData for each exposure type
 * (gulfWar1990, gulfWar2001, herbicide, otherExposures).
 *
 * Handles five main cleanup scenarios for each exposure type:
 * 1. Removes null exposure fields as orphaned data
 * 2. Removes orphaned details when main selection is missing
 * 3. Removes entire section when all values are false/none or section is empty
 * 4. Removes details for items where selection is not true (keeps false selections, removes their details)
 * 5. Removes "other" fields when null, 'none' selected, no selections, or corresponding 'other' not true
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @param {Object.<string, boolean>} [toxicExposure[exposureType]] - Location/exposure selections as boolean values
 * @param {Object} [toxicExposure[detailsKey]] - Detail objects (dates, descriptions) for selected locations
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object
 * @param {string} [mapping.otherKey] - Key for other/specify fields (e.g., 'otherHerbicideLocations', 'specifyOtherExposures')
 * @returns {Object} Toxic exposure object with orphaned/non-applicable data removed
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherKey } = mapping;
  const result = { ...toxicExposure };

  // Check conditions for various cleanup scenarios
  const isExposureNull = result[exposureType] === null;
  const hasDetails = !!result[detailsKey];
  const hasExposure = !!result[exposureType];
  const hasValidSelections =
    hasExposure && hasSelectedConditions(result[exposureType]);

  // Remove null exposure fields (orphaned data)
  if (isExposureNull) {
    delete result[exposureType];
    delete result[detailsKey];
    delete result[otherKey];
    return result;
  }

  // Remove orphaned details (details without corresponding exposure selections)
  const hasOrphanedDetails = hasDetails && !hasExposure;
  if (hasOrphanedDetails) {
    delete result[detailsKey];
  }

  // Remove orphaned otherKey when parent exposure doesn't exist
  const hasOrphanedOtherKey = otherKey && result[otherKey] && !hasExposure;
  if (hasOrphanedOtherKey) {
    delete result[otherKey];
  }

  // Remove entire exposure section when user deselected all options
  const shouldRemoveSection = hasExposure && !hasValidSelections;
  if (shouldRemoveSection) {
    delete result[exposureType];
    delete result[detailsKey];
    delete result[otherKey];
  }

  // Remove details for deselected items
  const shouldFilterDetails = hasDetails && hasExposure;
  if (shouldFilterDetails) {
    const retainedDetails = pickBy(
      result[detailsKey],
      (_value, key) => result[exposureType][key] === true,
    );

    const hasNoRetainedDetails = isEmpty(retainedDetails);
    if (hasNoRetainedDetails) {
      delete result[detailsKey];
    } else {
      result[detailsKey] = retainedDetails;
    }
  }

  // Remove other/specify fields when:
  // - Field is null (orphaned data)
  // - User selected 'none' or has no selections
  // - The corresponding 'other' selection is not true (e.g., otherExposures.other !== true)
  const hasOtherField = otherKey && otherKey in result;
  if (hasOtherField) {
    const isOtherFieldNull = result[otherKey] === null;
    const hasNoneSelected = result[exposureType]?.none;
    const hasNoSelections = !hasSelectedConditions(result[exposureType]);
    const otherNotSelected = result[exposureType]?.other !== true;

    const shouldRemoveOtherField =
      isOtherFieldNull ||
      hasNoneSelected ||
      hasNoSelections ||
      otherNotSelected;
    if (shouldRemoveOtherField) {
      delete result[otherKey];
    }
  }

  return result;
};

/**
 * Removes orphaned and non-applicable toxic exposure data from form payload
 * to prevent backend validation errors when users opt out of sections.
 *
 * This function handles scenarios where users:
 * - Start filling sections then deselect them (leaving orphaned details)
 * - Select "none" for conditions (complete opt-out - removes all exposure data, keeps only { conditions: { none: true } })
 * - Have no conditions selected (empty/missing/all false - removes entire toxicExposure object)
 * - Remove all selections but leave partial data behind
 * - Have null exposure fields that need cleanup
 * - Have orphaned "other" fields (otherHerbicideLocations, specifyOtherExposures) when corresponding 'other' selection not true
 *
 * Key behaviors:
 * - Preserves unknown/unrecognized fields (forward compatibility)
 * - Keeps false values in selection objects (conditions, exposures) for backend visibility
 * - Removes orphaned detail objects for false/missing selections
 * - Only removes data matching known orphaned patterns
 * - Uses lodash's cloneDeep to prevent mutation
 * - Processes only exposure types defined in EXPOSURE_TYPE_MAPPING
 *
 * NOT a validation function - this is purely for cleaning up data that
 * shouldn't be submitted based on user's opt-out choices.
 *
 * @param {Object} formData - Form data to transform
 * @param {boolean} [formData.disability526ToxicExposureOptOutDataPurge] - Feature flag for opt-out data purging
 * @param {Object} [formData.toxicExposure] - Toxic exposure data
 * @param {Object.<string, boolean>} [formData.toxicExposure.conditions] - Health condition selections (keeps all values including false)
 * @param {Object.<string, boolean>} [formData.toxicExposure.gulfWar1990] - Gulf War 1990 location selections (keeps all values including false)
 * @param {Object.<string, boolean>} [formData.toxicExposure.gulfWar2001] - Gulf War 2001 location selections (keeps all values including false)
 * @param {Object.<string, boolean>} [formData.toxicExposure.herbicide] - Herbicide exposure location selections (keeps all values including false)
 * @param {Object.<string, boolean>} [formData.toxicExposure.otherExposures] - Other exposure type selections (keeps all values including false)
 * @param {Object} [formData.toxicExposure.otherHerbicideLocations] - Other herbicide locations details (removed if herbicide.other !== true)
 * @param {Object} [formData.toxicExposure.specifyOtherExposures] - Other exposures details (removed if otherExposures.other !== true)
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
