import { isPlainObject } from 'lodash';
import _ from 'platform/utilities/data';
import {
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
const EXPOSURE_TYPE_MAPPING = {
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
    otherLocationsKey: 'otherHerbicideLocations',
  },
  otherExposures: {
    detailsKey: 'otherExposuresDetails',
    specifyKey: 'specifyOtherExposures',
  },
};

/**
 * Derives all toxic exposure keys from EXPOSURE_TYPE_MAPPING.
 * Includes 'conditions' and all exposure types with their associated keys.
 *
 * @example
 * const keys = getAllToxicExposureKeys();
 * Returns: ['conditions', 'gulfWar1990', 'gulfWar1990Details', ...]
 *
 * @returns {string[]} Array containing all toxic exposure field keys
 */
export const getAllToxicExposureKeys = () => {
  const keys = ['conditions'];

  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    keys.push(exposureType);
    keys.push(mapping.detailsKey);
    if (mapping.otherLocationsKey) {
      keys.push(mapping.otherLocationsKey);
    }
    if (mapping.specifyKey) {
      keys.push(mapping.specifyKey);
    }
  });

  return keys;
};

/**
 * Validates that form data contains toxic exposure information.
 *
 * @param {Object} formData - Form data to validate
 * @returns {boolean} True if form data contains toxicExposure object
 */
const isValidToxicExposureData = formData =>
  formData && typeof formData === 'object' && formData.toxicExposure;

/**
 * Checks if any conditions other than 'none' are selected.
 *
 * @param {Object.<string, boolean>} conditions - Condition selections
 * @returns {boolean} True if any non-'none' conditions are selected
 */
const hasSelectedConditions = conditions =>
  Object.keys(conditions).some(
    key => key !== 'none' && conditions[key] === true,
  );

/**
 * Checks if only the 'none' condition is selected.
 *
 * @param {Object.<string, boolean>} conditions - Condition selections
 * @returns {boolean} True if only 'none' is selected
 */
const hasOnlyNoneCondition = conditions =>
  conditions.none === true && !hasSelectedConditions(conditions);

/**
 * Filters details to only include entries with corresponding selections.
 *
 * @param {Object} details - Detail information (dates, descriptions)
 * @param {Object.<string, boolean>} selections - Selected items
 * @returns {Object} Filtered details for selected items only
 */
const filterSelectedDetails = (details, selections) => {
  if (!isPlainObject(details) || !isPlainObject(selections)) return {};

  return Object.keys(details).reduce((filtered, key) => {
    // Only keep details if the selection is explicitly true
    if (selections[key] === true) {
      return { ...filtered, [key]: details[key] };
    }
    return filtered;
  }, {});
};

/**
 * Validates non-empty description in string or object format.
 *
 * @param {string|Object} obj - String or object with description
 * @param {string} [obj.description] - Description property
 * @returns {boolean} True if valid non-empty description exists
 */
const hasValidDescription = obj => {
  if (!obj) return false;

  const description = typeof obj === 'string' ? obj : obj?.description;
  return (
    description &&
    typeof description === 'string' &&
    description.trim().length > 0
  );
};

/**
 * Filters conditions to only include those explicitly checked.
 *
 * @param {Object.<string, boolean>} conditions - Condition selections
 * @returns {Object.<string, true>} Only conditions set to true
 */
const filterCheckedConditions = conditions => {
  if (!isPlainObject(conditions)) return {};

  return Object.keys(conditions).reduce((filtered, condition) => {
    if (conditions[condition] === true) {
      return { ...filtered, [condition]: true };
    }
    return filtered;
  }, {});
};

/**
 * Determines if toxic exposure object contains no meaningful data.
 *
 * @param {Object} toxicExposure - Toxic exposure object to check
 * @returns {boolean} True if empty or contains only empty values
 */
const isEmptyToxicExposure = toxicExposure => {
  return Object.keys(toxicExposure).every(key => {
    const value = toxicExposure[key];
    return (
      !value || (typeof value === 'object' && Object.keys(value).length === 0)
    );
  });
};

/**
 * Creates toxic exposure object with only 'none' condition.
 *
 * @returns {{conditions: {none: true}}} Object with only 'none' selected
 */
const createNoneOnlyCondition = () => ({
  conditions: { none: true },
});

/**
 * Cleans exposure details by removing unselected items and orphaned fields.
 *
 * @param {Object} toxicExposure - Toxic exposure data with selections and details
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object
 * @param {string} [mapping.otherLocationsKey] - Key for other locations
 * @returns {Object} Cleaned toxic exposure object
 */
const cleanExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherLocationsKey } = mapping;
  const result = { ...toxicExposure };

  // If details exist but main selection is missing, remove the details
  if (detailsKey && result[detailsKey] && !result[exposureType]) {
    delete result[detailsKey];
    return result;
  }

  // If main selection exists but has no selected values, remove it and related fields
  if (result[exposureType] && !hasSelectedConditions(result[exposureType])) {
    delete result[exposureType];
    if (detailsKey && result[detailsKey]) {
      delete result[detailsKey];
    }
    if (otherLocationsKey && result[otherLocationsKey]) {
      delete result[otherLocationsKey];
    }
    return result;
  }

  // Main selection exists with values, clean up the details
  if (detailsKey && result[detailsKey] && result[exposureType]) {
    const filteredDetails = filterSelectedDetails(
      result[detailsKey],
      result[exposureType],
    );

    if (Object.keys(filteredDetails).length === 0) {
      delete result[detailsKey];
    } else {
      result[detailsKey] = filteredDetails;
    }
  }

  // Clean other locations if herbicide.none is true
  if (
    otherLocationsKey &&
    result[otherLocationsKey] &&
    result[exposureType]?.none
  ) {
    delete result[otherLocationsKey];
  }

  return result;
};

/**
 * Cleans and transforms toxic exposure data based on user selections.
 * Handles "none" condition case and individual exposure cleanup.
 *
 * @param {Object} formData - Form data to transform
 * @param {boolean} [formData.disability526ToxicExposureOptOutDataPurge] - Feature flag
 * @param {Object} [formData.toxicExposure] - Toxic exposure data
 * @param {Object.<string, boolean>} [formData.toxicExposure.conditions] - Selected conditions
 * @returns {Object} Form data with cleaned toxic exposure data
 */
export const cleanToxicExposureData = formData => {
  if (formData.disability526ToxicExposureOptOutDataPurge !== true) {
    return formData;
  }

  if (!isValidToxicExposureData(formData)) {
    return formData;
  }

  const clonedData = _.cloneDeep(formData);
  let { toxicExposure } = clonedData;

  if (!isPlainObject(toxicExposure)) {
    return clonedData;
  }

  const conditions = toxicExposure.conditions || {};

  // Handle "none" only selection - early return for simplicity
  if (hasOnlyNoneCondition(conditions)) {
    return { ...clonedData, toxicExposure: createNoneOnlyCondition() };
  }

  // Clean all exposure types dynamically using the mapping
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    toxicExposure = cleanExposureDetails(toxicExposure, exposureType, mapping);
  });

  // Clean otherHerbicideLocations if it has no valid description
  if (
    toxicExposure.otherHerbicideLocations &&
    !hasValidDescription(toxicExposure.otherHerbicideLocations)
  ) {
    delete toxicExposure.otherHerbicideLocations;
  }

  // Clean specifyOtherExposures if it has no valid description
  if (
    toxicExposure.specifyOtherExposures &&
    !hasValidDescription(toxicExposure.specifyOtherExposures)
  ) {
    delete toxicExposure.specifyOtherExposures;
  }

  // Clean up unchecked conditions
  if (toxicExposure.conditions) {
    toxicExposure = {
      ...toxicExposure,
      conditions: filterCheckedConditions(toxicExposure.conditions),
    };
  }

  // Remove entire toxicExposure if empty for backwards compatibility
  if (isEmptyToxicExposure(toxicExposure)) {
    delete clonedData.toxicExposure;

    return clonedData;
  }

  return { ...clonedData, toxicExposure };
};
