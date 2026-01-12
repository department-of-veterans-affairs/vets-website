import { cloneDeep, pickBy } from 'lodash';
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
 * Checks if toxic exposure data contains actual user-entered values.
 * Returns false if all data is just initial form state (empty objects, undefined/null values).
 *
 * This prevents false positive "data purged" logging when user opts out but never
 * actually entered any exposure data.
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @returns {boolean} True if there's actual user-entered exposure data
 */
const hasToxicExposureData = toxicExposure => {
  if (!toxicExposure || typeof toxicExposure !== 'object') return false;

  const checkForActualData = obj => {
    if (!obj || typeof obj !== 'object') return false;

    return Object.entries(obj).some(([key, value]) => {
      // Skip view: prefixed keys (UI metadata)
      if (key.startsWith('view:')) return false;

      // True boolean indicates user selected this checkbox
      if (value === true) return true;

      // Non-empty string indicates user entered text
      if (typeof value === 'string' && value.trim()) return true;

      // Recursively check nested objects for actual data
      if (typeof value === 'object' && value !== null) {
        return checkForActualData(value);
      }

      return false;
    });
  };

  // Check all exposure sections (skip conditions, handled separately)
  const exposureData = { ...toxicExposure };
  delete exposureData.conditions;

  return checkForActualData(exposureData);
};

/**
 * Purges data for a single exposure type based on user opt-out actions.
 *
 * All sections filter their details based on checkbox state. When a checkbox
 * is unchecked (false), the corresponding details entry is removed.
 *
 * Sections without otherKey (gulfWar1990, gulfWar2001):
 * - When none === true: remove the entire section (exposureType + details)
 * - Otherwise: filter details to only keep entries for checked locations
 *
 * Sections with otherKey (herbicide, otherExposures):
 * - When none === true: remove section but continue processing for orphan cleanup
 * - Otherwise: filter details to only keep entries for checked locations
 * - Handles orphaned otherKey data (dates without description are removed)
 *
 * Note: The UI prevents selecting "None of these" while also entering "Other" text.
 * The otherKey handling is defensive - it ensures orphaned data from save-in-progress
 * edge cases or form state inconsistencies is properly cleaned up.
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990', 'herbicide')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object (e.g., 'herbicideDetails')
 * @param {string} [mapping.otherKey] - Key for other/specify fields (e.g., 'otherHerbicideLocations')
 * @returns {Object} Toxic exposure object with opted-out data removed
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherKey } = mapping;
  const result = { ...toxicExposure };
  const exposureSelections = result[exposureType];

  // For sections with otherKey: always check for orphaned otherKey data
  // This runs even if the parent exposureType doesn't exist
  if (otherKey && otherKey in result) {
    // Remove orphaned date fields without description
    // Dates without a description lack context and are meaningless
    const otherData = result[otherKey];

    // Skip if otherKey is null/undefined (preserve these values)
    if (otherData !== null && otherData !== undefined) {
      // Handle string values directly (legacy format)
      if (typeof otherData === 'string') {
        if (!otherData.trim()) {
          // Empty/whitespace string is orphaned, remove it
          delete result[otherKey];
        }
        // Non-empty string is a valid description, keep it
      } else if (typeof otherData === 'object') {
        // Handle object format with description property
        const { description } = otherData;
        const hasNoDescription =
          !description ||
          (typeof description === 'string' && !description.trim());

        if (hasNoDescription) {
          // Object with no/empty description but may have dates is orphaned, remove it
          delete result[otherKey];
        }
      }
    }
  }

  // Skip further processing if exposure type not present in data
  if (!(exposureType in result)) {
    return result;
  }

  // Check if user explicitly opted out by selecting 'none' checkbox
  const userSelectedNone = exposureSelections?.none === true;

  // For sections without otherKey: none === true triggers complete section removal
  // For sections with otherKey: continue processing to handle orphan cleanup
  if (userSelectedNone && !otherKey) {
    // User explicitly opted out, remove all related data for this exposure type
    delete result[exposureType];
    delete result[detailsKey];
    return result;
  }

  // Filter details based on checkbox state
  // Unchecking a checkbox is opting out of that specific location/exposure
  // Example: herbicide.vietnam === true keeps herbicideDetails.vietnam
  //          herbicide.cambodia === false removes herbicideDetails.cambodia
  if (result[detailsKey]) {
    if (exposureSelections && typeof exposureSelections === 'object') {
      result[detailsKey] = pickBy(
        result[detailsKey],
        (_value, key) => exposureSelections[key] === true,
      );
    } else if (exposureSelections) {
      // Parent exists but is invalid type (e.g., string instead of object)
      // Filter details to empty since we can't match against invalid parent
      result[detailsKey] = {};
    }
  }

  // Clean undefined values from exposure selections to match save-in-progress shape
  // Form system scaffolds all checkbox keys with undefined, but save-in-progress
  // only stores explicitly set values (true/false)
  if (result[exposureType] && typeof result[exposureType] === 'object') {
    result[exposureType] = pickBy(
      result[exposureType],
      value => value !== undefined,
    );
  }

  return result;
};

/**
 * Removes toxic exposure data when users explicitly opt out of sections.
 *
 * Form flow (from toxicExposurePages.js):
 * 1. User selects conditions on toxicExposureConditions page
 *    - Selecting "I'm not claiming any conditions" (none: true) opts out
 *    - Selecting actual conditions proceeds to exposure pages
 *
 * 2. On each exposure page (gulfWar, herbicide, additionalExposures):
 *    - User can check predefined locations/hazards
 *    - User can fill "other" text area (valid without checking any boxes)
 *    - User can check "None of these locations/hazards" to explicitly opt out
 *    - Note: "None of these" and "Other" are mutually exclusive in the UI
 *
 * Purge logic:
 * - No conditions selected: remove all exposure data, keep only conditions object
 * - gulfWar1990.none === true: remove gulfWar1990 and gulfWar1990Details
 * - gulfWar2001.none === true: remove gulfWar2001 and gulfWar2001Details
 * - Unchecked checkbox (false): filter out corresponding details entry
 * - otherHerbicideLocations without description: remove (orphaned dates)
 * - specifyOtherExposures without description: remove (orphaned dates)
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
  // Feature flag check allows gradual rollout and quick disable if issues arise
  if (!formData?.disability526ToxicExposureOptOutDataPurge) {
    return formData;
  }

  // No toxic exposure data to process
  if (!formData.toxicExposure) {
    return formData;
  }

  // Clone to prevent mutation of original form data
  const clonedData = cloneDeep(formData);
  let { toxicExposure } = clonedData;
  delete clonedData.toxicExposure;

  const conditions = toxicExposure.conditions || {};

  // No conditions selected means exposure data is orphaned and irrelevant
  // This covers both explicit opt-out (none: true) and unchecked all conditions
  if (!hasSelectedConditions(conditions)) {
    // Check if there's actual user-entered data to purge
    // If not, return unchanged to avoid false positive "data purged" logging
    if (!hasToxicExposureData(toxicExposure)) {
      return formData;
    }

    return {
      ...clonedData,
      toxicExposure: { conditions },
    };
  }

  // Process each exposure type for opt-outs and orphan cleanup
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    toxicExposure = purgeExposureDetails(toxicExposure, exposureType, mapping);
  });

  return { ...clonedData, toxicExposure };
};
