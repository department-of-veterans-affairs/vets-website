import { isPlainObject } from 'lodash';
import cloneDeep from 'platform/utilities/data/cloneDeep';
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
const isNoneOnlySelected = conditions =>
  conditions.none === true && !hasSelectedConditions(conditions);

/**
 * Retains details only for entries with corresponding selections.
 *
 * @param {Object} details - Detail information (dates, descriptions)
 * @param {Object.<string, boolean>} selections - Selected items
 * @returns {Object} Details for selected items only
 */
const retainSelectedDetails = (details, selections) => {
  if (!isPlainObject(details) || !isPlainObject(selections)) return {};

  return Object.keys(details).reduce((retained, key) => {
    if (selections[key] === true) {
      return { ...retained, [key]: details[key] };
    }
    return retained;
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
 * Retains only conditions that are explicitly checked (true).
 *
 * @param {Object.<string, boolean>} conditions - Condition selections
 * @returns {Object.<string, true>} Only conditions set to true
 */
const retainCheckedConditions = conditions => {
  if (!isPlainObject(conditions)) return {};

  return Object.keys(conditions).reduce((retained, condition) => {
    if (conditions[condition] === true) {
      return { ...retained, [condition]: true };
    }
    return retained;
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
 * Purges exposure details by removing unselected items and orphaned fields.
 *
 * @param {Object} toxicExposure - Toxic exposure data with selections and details
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object
 * @param {string} [mapping.otherLocationsKey] - Key for other locations
 * @returns {Object} Purged toxic exposure object
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherLocationsKey } = mapping;
  const result = { ...toxicExposure };

  // Remove orphaned details
  if (detailsKey && result[detailsKey] && !result[exposureType]) {
    delete result[detailsKey];
    return result;
  }

  // Remove exposure with no selections
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

  // Retain details to match selections
  if (detailsKey && result[detailsKey] && result[exposureType]) {
    const retainedDetails = retainSelectedDetails(
      result[detailsKey],
      result[exposureType],
    );

    if (Object.keys(retainedDetails).length === 0) {
      delete result[detailsKey];
    } else {
      result[detailsKey] = retainedDetails;
    }
  }

  // Remove other locations when herbicide.none selected
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
 * Purges and transforms toxic exposure data based on user selections.
 * Handles "none" condition case and individual exposure removal.
 *
 * @param {Object} formData - Form data to transform
 * @param {boolean} [formData.disability526ToxicExposureOptOutDataPurge] - Feature flag
 * @param {Object} [formData.toxicExposure] - Toxic exposure data
 * @param {Object.<string, boolean>} [formData.toxicExposure.conditions] - Selected conditions
 * @returns {Object} Form data with purged toxic exposure data
 */
export const purgeToxicExposureData = formData => {
  if (formData.disability526ToxicExposureOptOutDataPurge !== true) {
    return formData;
  }

  if (!isValidToxicExposureData(formData)) {
    return formData;
  }

  const clonedData = cloneDeep(formData);
  let { toxicExposure } = clonedData;

  if (!isPlainObject(toxicExposure)) {
    return clonedData;
  }

  const conditions = toxicExposure.conditions || {};

  // "None" only selection
  if (isNoneOnlySelected(conditions)) {
    return { ...clonedData, toxicExposure: createNoneOnlyCondition() };
  }

  // Process all exposure types
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    toxicExposure = purgeExposureDetails(toxicExposure, exposureType, mapping);
  });

  // Remove empty otherHerbicideLocations
  if (
    toxicExposure.otherHerbicideLocations &&
    !hasValidDescription(toxicExposure.otherHerbicideLocations)
  ) {
    delete toxicExposure.otherHerbicideLocations;
  }

  // Remove empty specifyOtherExposures
  if (
    toxicExposure.specifyOtherExposures &&
    !hasValidDescription(toxicExposure.specifyOtherExposures)
  ) {
    delete toxicExposure.specifyOtherExposures;
  }

  // Retain only checked conditions
  if (toxicExposure.conditions) {
    toxicExposure = {
      ...toxicExposure,
      conditions: retainCheckedConditions(toxicExposure.conditions),
    };
  }

  // Remove empty toxicExposure
  if (isEmptyToxicExposure(toxicExposure)) {
    delete clonedData.toxicExposure;

    return clonedData;
  }

  return { ...clonedData, toxicExposure };
};
