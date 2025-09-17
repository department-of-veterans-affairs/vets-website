import { isPlainObject, isEmpty, pickBy } from 'lodash';
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
    otherLocationsKey: 'otherHerbicideLocations',
  },
  otherExposures: {
    detailsKey: 'otherExposuresDetails',
    specifyKey: 'specifyOtherExposures',
  },
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
 * Removes orphaned details for deselected items to prevent submission of
 * partial data that would fail validation.
 *
 * @param {Object} details - Detail information (dates, descriptions)
 * @param {Object.<string, boolean>} selections - Selected items
 * @returns {Object} Details for selected items only, orphaned details removed
 */
const retainSelectedDetails = (details, selections) => {
  if (!isPlainObject(details) || !isPlainObject(selections)) return {};

  return pickBy(details, (_value, key) => selections[key] === true);
};

/**
 * Checks if description field has content to determine if it should be purged.
 * Empty descriptions indicate incomplete/abandoned data that should be removed.
 *
 * @param {string|Object} obj - String or object with description
 * @param {string} [obj.description] - Description property
 * @returns {boolean} True if description has content (should not be purged)
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
 * Removes false/unchecked conditions to clean up the payload.
 * Only keeps conditions the user actively selected.
 *
 * @param {Object.<string, boolean>} conditions - Condition selections
 * @returns {Object.<string, true>} Only conditions set to true, false values removed
 */
const retainCheckedConditions = conditions => {
  if (!isPlainObject(conditions)) return {};

  return pickBy(conditions, value => value === true);
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
    return !value || (typeof value === 'object' && isEmpty(value));
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
 * Removes orphaned and non-applicable exposure data left behind when users
 * deselect options (opt-out scenarios). Prevents submission of partial data
 * that would fail backend validation.
 *
 * @param {Object} toxicExposure - Toxic exposure data object
 * @param {Object.<string, boolean>} [toxicExposure[exposureType]] - Location/exposure selections as boolean values
 * @param {Object} [toxicExposure[detailsKey]] - Detail objects (dates, descriptions) for selected locations
 * @param {string} exposureType - Exposure type key (e.g., 'gulfWar1990')
 * @param {Object} mapping - Mapping configuration for exposure type
 * @param {string} mapping.detailsKey - Key for details object
 * @param {string} [mapping.otherLocationsKey] - Key for other locations
 * @returns {Object} Toxic exposure object with orphaned/non-applicable data removed
 */
const purgeExposureDetails = (toxicExposure, exposureType, mapping) => {
  const { detailsKey, otherLocationsKey } = mapping;
  const result = { ...toxicExposure };

  // Remove orphaned details (details without corresponding exposure selections)
  if (detailsKey && result[detailsKey] && !result[exposureType]) {
    delete result[detailsKey];
    return result;
  }

  // Remove entire exposure section when user deselected all options
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

  // Remove details for deselected items (prevent orphaned data)
  if (detailsKey && result[detailsKey] && result[exposureType]) {
    const retainedDetails = retainSelectedDetails(
      result[detailsKey],
      result[exposureType],
    );

    if (isEmpty(retainedDetails)) {
      delete result[detailsKey];
    } else {
      result[detailsKey] = retainedDetails;
    }
  }

  // Remove other locations when user selected 'none' (opted out)
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

  if (!isValidToxicExposureData(formData)) {
    return formData;
  }

  const clonedData = cloneDeep(formData);
  let { toxicExposure } = clonedData;

  if (!isPlainObject(toxicExposure)) {
    return clonedData;
  }

  const conditions = toxicExposure.conditions || {};

  // User selected "none" for conditions - complete opt-out scenario
  if (isNoneOnlySelected(conditions)) {
    return {
      ...clonedData,
      toxicExposure: createNoneOnlyCondition(),
    };
  }

  // Remove orphaned data from all exposure types
  Object.entries(EXPOSURE_TYPE_MAPPING).forEach(([exposureType, mapping]) => {
    toxicExposure = purgeExposureDetails(toxicExposure, exposureType, mapping);
  });

  // Remove otherHerbicideLocations if user opted out of herbicide exposures or left it incomplete
  if (
    toxicExposure.otherHerbicideLocations &&
    (!toxicExposure.herbicide ||
      !hasSelectedConditions(toxicExposure.herbicide) ||
      !hasValidDescription(toxicExposure.otherHerbicideLocations))
  ) {
    delete toxicExposure.otherHerbicideLocations;
  }

  // Remove specifyOtherExposures if user opted out of other exposures or left it incomplete
  if (
    toxicExposure.specifyOtherExposures &&
    (!toxicExposure.otherExposures ||
      !hasSelectedConditions(toxicExposure.otherExposures) ||
      !hasValidDescription(toxicExposure.specifyOtherExposures))
  ) {
    delete toxicExposure.specifyOtherExposures;
  }

  // Remove unchecked conditions (clean up opt-out selections)
  if (toxicExposure.conditions) {
    toxicExposure = {
      ...toxicExposure,
      conditions: retainCheckedConditions(toxicExposure.conditions),
    };
  }

  // Remove entire toxicExposure if user opted out of everything
  if (isEmptyToxicExposure(toxicExposure)) {
    delete clonedData.toxicExposure;
    return clonedData;
  }

  return { ...clonedData, toxicExposure };
};
