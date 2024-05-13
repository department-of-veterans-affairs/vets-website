import React from 'react';
import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import {
  capitalizeEachWord,
  formSubtitle,
  formatMonthYearDate,
  isClaimingNew,
  sippableId,
} from '../utils';
import { NULL_CONDITION_STRING, SHOW_TOXIC_EXPOSURE } from '../constants';

/* ---------- content ----------*/
export const conditionsPageTitle = 'Toxic Exposure';
export const conditionsQuestion =
  'Are any of your new conditions related to toxic exposure during your military service? Check any that are related.';
export const conditionsDescription = (
  <va-additional-info
    class="vads-u-margin-y--3"
    trigger="What is toxic exposure?"
  >
    <div>
      <p className="vads-u-margin-top--0">
        Toxic exposures include exposures to substances like Agent Orange, burn
        pits, radiation, asbestos, or contaminated water.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a
          href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about toxic exposure (opens in new tab)
        </a>
      </p>
    </div>
  </va-additional-info>
);

export const gulfWar1990PageTitle = 'Service after August 2, 1990';
export const gulfWar1990Question =
  'Did you serve in any of these Gulf War locations on or after August 2, 1990? Check any locations where you served.';
export const summaryOfGulfWar1990PageTitle =
  'Summary of service after August 2, 1990';

export const gulfWar2001PageTitle = 'Service post-9/11';
export const gulfWar2001Question =
  'Did you serve in any of these Gulf War locations on or after September 11, 2001? Check any locations where you served.';

export const noneAndConditionError =
  'You selected a condition, and you also selected “I’m not claiming any conditions related to toxic exposure.” You’ll need to uncheck one of these options to continue.';

export const noneAndLocationError =
  'You selected a location, and you also selected "None of these locations." You’ll need to uncheck one of these options to continue.';

export const dateRangeAdditionalInfo = (
  <va-additional-info trigger="What if I have more than one date range?">
    <p>
      You only need to enter one date range. We’ll use this information to find
      your record.
    </p>
  </va-additional-info>
);

export const dateRangeDescription =
  'Enter any date range you served in this location. You don’t need to have exact dates.';
export const startDateApproximate = 'Service start date (approximate)';
export const endDateApproximate = 'Service end date (approximate)';
export const goBackLink = 'Edit locations and dates';
export const noDatesEntered = 'No dates entered';

/**
 * Generate the Toxic Exposure subtitle, which is used on Review and Submit and on the pages
 * themselves. If there are item counts, it will display something like '1 of 3: Location Name'.
 * If either count is invalid, the prefix will be dropped to only display 'Location Name'.
 *
 * @param {number} currentItem - this item's count out of the total selected items
 * @param {number} totalItems - total number of selected items
 * @param {string} locationName - Display name of the location
 * @returns
 */
export function teSubtitle(currentItem, totalItems, locationName) {
  return (
    (currentItem > 0 &&
      totalItems > 0 &&
      `Location ${currentItem} of ${totalItems}: ${locationName}`) ||
    locationName
  );
}

/**
 * Create the markup for page description including the subtitle and date range description text
 *
 * @param {number} currentItem - Current item being viewed
 * @param {number} totalItems - Total items for this location
 * @param {string} locationName - Display name of the location
 * @returns h4 subtitle and p description
 */
export function dateRangePageDescription(
  currentItem,
  totalItems,
  locationName,
) {
  const subtitle = formSubtitle(
    teSubtitle(currentItem, totalItems, locationName),
  );
  return (
    <>
      {subtitle}
      <p>{dateRangeDescription}</p>
    </>
  );
}

/* ---------- utils ---------- */
/**
 * Checks if the toxic exposure pages should be displayed using the following criteria
 *  1. toggle is enabled
 *  2. the claim has a claim type of new
 *  3. claiming at least one new disability
 *
 * Note: toggle is currently read from the redux store by Form526EZApp and stored in sessions storage since
 * not all form aspects have ready access to the store.
 * @returns true if all criteria are met, false otherwise
 */
export function showToxicExposurePages(formData) {
  return (
    window.sessionStorage.getItem(SHOW_TOXIC_EXPOSURE) === 'true' &&
    isClaimingNew(formData) &&
    formData?.newDisabilities?.length > 0
  );
}

/**
 * Checks if
 * 1. TE pages should be showing at all
 * 2. at least one checkbox on the TE conditions page is selected that is not 'none'
 *
 * @param {object} formData
 * @returns true if at least one condition is claimed for toxic exposure, false otherwise
 */
export function isClaimingTECondition(formData) {
  return (
    showToxicExposurePages(formData) &&
    formData?.toxicExposure?.conditions &&
    Object.keys(formData.toxicExposure.conditions).some(
      item =>
        item !== 'none' && formData.toxicExposure.conditions[item] === true,
    )
  );
}

/**
 * Builds the Schema based on user entered condition names
 *
 * Example output:
{
    type: 'object',
    properties: {
      anemia: {
        type: 'boolean'
      },
      tinnitusringingorhissinginears: {
        type: 'boolean'
      },
      none: {
        type: 'boolean'
      }
    }
  }
}
 *
 * @param {object} formData - Full formData for the form
 * @returns {object} Object with id's for each condition
 */
export function makeTEConditionsSchema(formData) {
  const options = (formData?.newDisabilities || []).map(disability =>
    sippableId(disability.condition),
  );

  options.push('none');

  return checkboxGroupSchema(options);
}

/**
 * Builds the UI Schema based on user entered condition names.
 *
 * Example output:
 *  {
 *   anemia: {
 *     'ui:title': 'Anemia',
 *   },
 *   tinnitusringingorhissinginears: {
 *     'ui:title': 'Tinnitus (Ringing Or Hissing In Ears)',
 *   },
 *   none: {
 *     'ui:title': 'I am not claiming any conditions related to toxic exposure',
 *   },
 * }
 * @param {*} formData - Full formData for the form
 * @returns {object} Object with id and title for each condition
 */
export function makeTEConditionsUISchema(formData) {
  const { newDisabilities = [] } = formData;
  const options = {};

  newDisabilities.forEach(disability => {
    const { condition } = disability;

    const capitalizedDisabilityName =
      typeof condition === 'string'
        ? capitalizeEachWord(condition)
        : NULL_CONDITION_STRING;

    options[sippableId(condition || NULL_CONDITION_STRING)] = {
      'ui:title': capitalizedDisabilityName,
    };
  });

  options.none = {
    'ui:title': 'I am not claiming any conditions related to toxic exposure',
  };

  return options;
}

/**
 * Validates selected Toxic Exposure conditions. If the 'none' checkbox is selected along with a new condition
 * adds an error.
 *
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateTEConditions(errors, formData) {
  const { conditions = {} } = formData?.toxicExposure;

  if (
    conditions?.none === true &&
    Object.values(conditions).filter(value => value === true).length > 1
  ) {
    errors.toxicExposure.conditions.addError(noneAndConditionError);
  }
}

/**
 * Validates selected Gulf War 1990 locations.
 * If the 'none' checkbox is selected
 * along with another location adds an error.
 *
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateGulfWar1990Locations(errors, formData) {
  const { gulfWar1990 = {} } = formData?.toxicExposure;

  if (
    gulfWar1990?.none === true &&
    Object.values(gulfWar1990).filter(value => value === true).length > 1
  ) {
    errors.toxicExposure.gulfWar1990.addError(noneAndLocationError);
  }
}

/**
 * Given the key for a selected checkbox option, find the index within the selected items. In this
 * example, there are two selected locations. The key='bahrain' would give index of 1, and
 * key='airspace' would give index 2.
 *
 * toxicExposure: {
 *    gulfWar1990: {
 *       bahrain: true,
 *       egypt: false,
 *       airspace: true,
 *    }
 * }
 *
 * @param {string} key - the id for the checkbox option
 * @param {string} objectName - name of the object to look at in the form data
 * @param {object} formData - full formData for the form
 * @returns {number} - index of the key within the list of selected items if found, 0 otherwise
 */
export function getKeyIndex(key, objectName, { formData }) {
  if (
    !formData ||
    !formData?.toxicExposure ||
    !formData?.toxicExposure[objectName]
  ) {
    return 0;
  }

  let index = 0;
  const properties = Object.keys(formData.toxicExposure[objectName]);
  for (let i = 0; i < properties.length; i += 1) {
    if (formData.toxicExposure[objectName][properties[i]] === true) {
      index += 1;
      if (key === properties[i]) {
        return index;
      }
    }
  }
  return 0;
}

/**
 * Given an object storing checkbox values, get a count of how many values have been selected
 * by the Veteran
 *
 * @param {string} objectName - name of the object to look at in the form data
 * @param {object} formData - full formData for the form
 * @returns {number} count of checkboxes with a value of true
 */
export function getSelectedCount(objectName, { formData } = {}) {
  if (
    !formData ||
    !formData?.toxicExposure ||
    !formData?.toxicExposure[objectName]
  )
    return 0;

  return Object.values(formData.toxicExposure[objectName]).filter(
    value => value === true,
  ).length;
}

/**
 * Checks if a specific details page should display. It should display if all
 * the following is true
 * 1. TE pages should be showing at all
 * 2. the given checkbox data is present for the given itemId with a value of true
 * 3. the 'none' location checkbox is not true
 *
 * @param {object} formData - full form data
 * @param {string} locationId - unique id for the location
 * @returns {boolean} true if the page should display, false otherwise
 */
export function showCheckboxLoopDetailsPage(
  formData,
  checkboxObjectName,
  itemId,
) {
  return (
    isClaimingTECondition(formData) &&
    formData?.toxicExposure[checkboxObjectName] &&
    formData?.toxicExposure[checkboxObjectName].none !== true &&
    formData?.toxicExposure[checkboxObjectName][itemId] === true
  );
}

/**
 * Checks if the a checkbox and loop's summary page should display. It should display if all the following
 * are true
 * 1. TE pages should be showing at all
 * 2. at least one checkbox item was selected
 * 3. the 'none' location checkbox is not true
 *
 * @param {object} formData - full form data
 * @returns {boolean} true if the page should display, false otherwise
 */
export function showSummaryPage(formData, checkboxObjectName) {
  return (
    isClaimingTECondition(formData) &&
    formData?.toxicExposure[checkboxObjectName] &&
    formData?.toxicExposure[checkboxObjectName].none !== true &&
    Object.values(formData.toxicExposure[checkboxObjectName]).filter(
      value => value === true,
    ).length > 0
  );
}

/**
 * Takes a date range object with start and end dates and generates a description. Fields are optional so
 * the output format may vary depending on available data. Scenarios
 * startDate: '' and endDate: '' -> 'No dates entered'
 * startDate: '1992-04-01' and endDate: '1995-06-01' -> 'April 1992 - June 1995'
 * startDate: '1992-04-01' and endDate: '' -> 'April 1992 - No end date entered'
 * startDate: '' and endDate: '1995-06-01' -> 'No start date entered - June 1995'
 *
 * @param {object} dates - object containing the date range
 * @returns {string} a description string with month and year, e.g. "September 1992 - September 1993"
 */
export function datesDescription(dates) {
  if (!dates?.startDate && !dates?.endDate) {
    return noDatesEntered;
  }
  const startDate =
    formatMonthYearDate(dates?.startDate) || 'No start date entered';
  const endDate = formatMonthYearDate(dates?.endDate) || 'No end date entered';
  return `${startDate} - ${endDate}`;
}
