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

      // true boolean = user selected this checkbox
      if (value === true) return true;

      // Non-empty string = user entered text
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
 * Note: Behavior differs based on whether the section has an "other" text area.
 *
 * Sections WITHOUT otherKey (gulfWar1990, gulfWar2001):
 * - exposureType.none === true triggers removal of the entire section
 * - Unchecking a checkbox IS opting out of that specific location
 * - Filter details to only keep data for checked locations
 * - Empty details objects kept (backend handles empty objects consistently)
 *
 * Sections WITH otherKey (herbicide, otherExposures):
 * - exposureType.none === true AND otherKey has no description => Remove orphaned otherKey
 * - exposureType.none === true AND otherKey has description => N/A (form flow prevents)
 * - User may use the "other" text area without checking predefined options
 * - Main section data preserved; only orphaned date fields in otherKey are removed
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

  // For sections with otherKey: Always check for orphaned otherKey data
  // This must run even if the parent exposureType doesn't exist
  if (otherKey && otherKey in result) {
    // Sections with otherKey: Remove orphaned date fields without description
    // Dates without a description are meaningless - the description provides context
    const otherData = result[otherKey];

    // Skip if otherKey is null/undefined (preserve these values)
    if (otherData !== null && otherData !== undefined) {
      // Handle string values directly (legacy format)
      if (typeof otherData === 'string') {
        if (!otherData.trim()) {
          // Empty/whitespace string - orphaned, remove it
          delete result[otherKey];
        }
        // Non-empty string is a valid description - keep it
      } else if (typeof otherData === 'object') {
        // Handle object format with description property
        const { description } = otherData;
        const hasNoDescription =
          !description ||
          (typeof description === 'string' && !description.trim());

        if (hasNoDescription) {
          // Object with no/empty description but may have dates - orphaned, remove it
          delete result[otherKey];
        }
      }
    }
  }

  // Skip further processing if exposure type not present in data
  if (!(exposureType in result)) {
    return result;
  }

  // For sections with otherKey, we've already handled the otherKey cleanup above
  // Return early since these sections don't filter details based on checkbox state
  if (otherKey) {
    return result;
  }

  // Check if user explicitly opted out by selecting 'none' checkbox
  // This only applies to sections WITHOUT otherKey (gulfWar1990, gulfWar2001)
  const userSelectedNone = exposureSelections?.none === true;

  if (userSelectedNone) {
    // User explicitly opted out - remove all related data for this exposure type
    delete result[exposureType];
    delete result[detailsKey];
    return result;
  }

  // Sections WITHOUT otherKey: Filter details based on checkbox state
  // Unchecking a checkbox IS opting out of that specific location
  if (result[detailsKey] && exposureSelections) {
    // Filter details to only keep selected items for checkbox-only sections
    // Example: If gulfWar1990.bahrain === true but gulfWar1990.iraq === false,
    // keep gulfWar1990Details.bahrain but remove gulfWar1990Details.iraq
    result[detailsKey] = pickBy(
      result[detailsKey],
      (_value, key) => exposureSelections[key] === true,
    );
  }

  return result;
};

/**
 * Removes toxic exposure data when users explicitly opt out of sections.
 *
 * Form Flow (from toxicExposurePages.js):
 * 1. User selects conditions on toxicExposureConditions page
 *    - If user selects "I'm not claiming any conditions" (none: true), they've opted out
 *    - If user selects actual conditions, they proceed to exposure pages
 *
 * 2. On each exposure page (herbicide and additionalExposures):
 *    - User can check predefined locations/hazards
 *    - User can fill "other" text area (valid without checking any boxes)
 *    - User can check "None of these locations/hazards" to explicitly opt out
 *
 * Purge Logic (removes orphaned data, preserves empty objects):
 * - No conditions selected (any reason) => Remove orphaned exposure data, keep conditions
 * - gulfWar1990.none === true => Remove gulfWar1990 and gulfWar1990Details
 * - gulfWar2001.none === true => Remove gulfWar2001 and gulfWar2001Details
 * - gulfWar1990/gulfWar2001 checkbox false => Filter out corresponding details entry
 * - otherHerbicideLocations with no description => Remove (dates without context are orphaned)
 * - specifyOtherExposures with no description => Remove (dates without context are orphaned)
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
  // Feature flag check - allows gradual rollout and quick disable if issues arise
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

  // No conditions selected: Exposure data is orphaned and irrelevant
  // This covers both explicit opt-out (none: true) AND unchecked all conditions
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

  // Process each exposure type for explicit opt-outs (none === true)
  // Each exposure type (gulfWar1990, herbicide, etc.) is checked for none === true
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    toxicExposure = purgeExposureDetails(toxicExposure, exposureType, mapping);
  });

  return { ...clonedData, toxicExposure };
};
