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
 * Purges data for a single exposure type based on user selections.
 *
 * Users can select predefined locations/hazards via checkboxes OR enter custom
 * ones via "Other" text area - both indicate exposure and lead to date entry.
 *
 * Filtering rules:
 * - Unchecked checkbox: removes corresponding details entry
 * - "None of these" (none: true): removes entire section
 * - otherKey with description: preserved (description + dates retained)
 * - otherKey without description: removed (dates alone are orphaned)
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object (e.g., 'herbicideDetails')
 * @param {string} [mapping.otherKey] - Key for other/specify fields (e.g., 'otherHerbicideLocations')
 * @returns {Object} Toxic exposure object with opted-out data removed
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherKey } = mapping;
  const result = { ...toxicExposure };
  const exposureSelections = result[exposureType];

  // Clean up orphaned otherKey data (dates without description)
  if (otherKey && otherKey in result) {
    const otherData = result[otherKey];

    if (otherData !== null && otherData !== undefined) {
      if (typeof otherData === 'string') {
        // Empty string has no description
        if (!otherData.trim()) {
          delete result[otherKey];
        }
      } else if (typeof otherData === 'object') {
        const { description } = otherData;
        const hasNoDescription =
          !description ||
          (typeof description === 'string' && !description.trim());

        // Object with dates but no description is orphaned
        if (hasNoDescription) {
          delete result[otherKey];
        }
      }
    }
  }

  if (!(exposureType in result)) {
    return result;
  }

  const userSelectedNone = exposureSelections?.none === true;

  // "None of these" removes entire section
  if (userSelectedNone && !otherKey) {
    delete result[exposureType];
    delete result[detailsKey];
    return result;
  }

  // Filter details: keep only entries where checkbox is checked (true)
  if (result[detailsKey]) {
    if (exposureSelections && typeof exposureSelections === 'object') {
      result[detailsKey] = pickBy(
        result[detailsKey],
        (_value, key) => exposureSelections[key] === true,
      );
    } else if (exposureSelections) {
      // Invalid parent type - clear details
      result[detailsKey] = {};
    }
  }

  // Remove undefined values to match save-in-progress shape
  if (result[exposureType] && typeof result[exposureType] === 'object') {
    result[exposureType] = pickBy(
      result[exposureType],
      value => value !== undefined,
    );
  }

  return result;
};

/**
 * Removes toxic exposure data when users opt out or uncheck selections.
 *
 * Users can select predefined locations/hazards via checkboxes OR enter custom
 * ones via "Other" text area - both indicate exposure and lead to date entry.
 *
 * Purge rules:
 * - No conditions selected: remove all exposure data, keep only conditions
 * - "None of these" (none: true): remove entire section and details
 * - Unchecked checkbox: filter out corresponding details entry
 * - otherKey with description: preserved (description + dates retained)
 * - otherKey without description: removed (dates alone are orphaned)
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
