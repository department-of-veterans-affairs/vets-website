import React from 'react';
import {
  capitalizeEachWord,
  formSubtitle,
  formTitle,
  isPlaceholderRated,
  makeConditionsSchema,
  sippableId,
  validateConditions,
} from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

import { formatMonthYearDate } from '../utils/dates';

/* ---------- content ----------*/
export const conditionsPageTitle = 'Toxic exposure';
export const conditionsQuestion =
  'Are any of your new conditions related to toxic exposure during your military service? Check any that are related.';
export const conditionsDescription = (
  <va-additional-info
    class="vads-u-margin-y--3"
    trigger="What is toxic exposure?"
  >
    <div>
      <p className="vads-u-margin-top--0">
        Toxic exposure includes exposure to substances like Agent Orange, burn
        pits, radiation, asbestos, or contaminated water.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a
          href="https://www.va.gov/disability/eligibility/hazardous-materials-exposure/"
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

export const herbicidePageTitle = 'Agent Orange locations';
export const herbicideQuestion =
  'Did you serve in any of these locations where the military used the herbicide Agent Orange? Check any locations where you served.';

export const additionalExposuresPageTitle = 'Other toxic exposures';
export const additionalExposuresQuestion =
  'Have you been exposed to any of these hazards? Check any that you’ve been exposed to.';
export const specifyOtherExposuresLabel =
  'Other toxic exposures not listed here (250 characters maximum)';

export const noneAndConditionError =
  'You selected a condition, and you also selected “I’m not claiming any conditions related to toxic exposure.” You’ll need to uncheck one of these options to continue.';
export const noneAndLocationError =
  'You selected a location, and you also selected “None of these locations.” You’ll need to uncheck one of these options to continue.';
export const noneAndHazardError =
  'You selected a hazard, and you also selected “None of these.” You’ll need to uncheck one of these options to continue.';

export const otherInvalidCharError =
  'You entered an invalid character in the text field. This field only allows letters, numbers, hyphens, apostrophes, periods, commas, ampersands (& symbol), number signs (# symbol), and spaces.';

export const dateRangeAdditionalInfo = (
  <va-additional-info trigger="What if I have more than one date range?">
    <p>
      You only need to enter one date range. We’ll use this information to find
      your record.
    </p>
  </va-additional-info>
);

export const dateRangeDescriptionWithLocation =
  'Enter any date range you served in this location. You don’t need to have exact dates.';
export const dateRangeDescriptionWithHazard =
  'Enter any date range you were exposed to this hazard. You don’t need to have exact dates.';
export const startDateApproximate = 'Service start date (approximate)';
export const exposureStartDateApproximate = 'Exposure start date (approximate)';
export const exposureEndDateApproximate = 'Exposure end date (approximate)';
export const endDateApproximate = 'Service end date (approximate)';
export const goBackLink = 'Edit locations and dates';
export const goBackLinkExposures = 'Edit exposures and dates';
export const noDatesEntered = 'No dates entered';
export const notSureDatesSummary = 'I’m not sure of the dates';
export const notSureDatesDetails =
  'I’m not sure of the dates I served in this location';
export const notSureHazardDetails =
  'I’m not sure of the dates I was exposed to this hazard';

/**
 * Generate the Toxic Exposure subtitle, which is used on Review and Submit and on the pages
 * themselves. If there are item counts, it will display something like 'Location 1 of 3: Location Name'.
 * If either count is invalid, the prefix will be dropped to only display 'Location Name'.
 *
 * @param {number} currentItem - this item's count out of the total selected items
 * @param {number} totalItems - total number of selected items
 * @param {string} itemName - Display name of the location or hazard
 * @param {string} itemType - Name of the item. Defaults to 'Location'
 * @returns {string} subtitle
 */
export function teSubtitle(
  currentItem,
  totalItems,
  itemName,
  itemType = 'Location',
) {
  return (
    (currentItem > 0 &&
      totalItems > 0 &&
      `${itemType} ${currentItem} of ${totalItems}: ${itemName}`) ||
    itemName
  );
}

/* ---------- utils ---------- */
/**
 * Checks if a disability is a real toxic exposure candidate.
 * A disability is a candidate if it has a valid condition string,
 * is not a placeholder rated disability, and has cause 'NEW' or 'SECONDARY'.
 *
 * @param {object} d - disability object
 * @returns {boolean} true if the disability is a valid TE candidate
 */
const isRealTECandidate = d =>
  d &&
  typeof d.condition === 'string' &&
  !isPlaceholderRated(d.condition) &&
  (d.cause === 'NEW' || d.cause === 'SECONDARY');

/**
 * Checks if the form data contains at least one real new disability
 * that is a toxic exposure candidate.
 *
 * @param {object} formData - full form data
 * @returns {boolean} true if there is at least one real new disability
 */
const hasRealNewDisabilities = formData =>
  Array.isArray(formData?.newDisabilities) &&
  formData.newDisabilities.some(isRealTECandidate);

/**
 * Checks if the toxic exposure pages should be displayed.
 * Shows when there is at least one real new or secondary condition.
 * This logic works for both legacy and new conditions workflows.
 *
 * @param {object} formData - full form data
 * @returns {boolean} true if toxic exposure pages should show
 */
export const showToxicExposurePages = formData => {
  // Show when there is at least one real (non-placeholder) new or secondary condition
  // This approach works across both workflows without relying on view:claimType
  return hasRealNewDisabilities(formData);
};

/**
 * Checks if
 * 1. TE pages should be showing
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
  return makeConditionsSchema(formData);
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

  const formatSide = side => {
    if (!side || typeof side !== 'string') return '';
    const clean = side.trim().toLowerCase();
    const map = { left: 'Left', right: 'Right', bilateral: 'Bilateral' };
    return map[clean] || clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  newDisabilities.forEach(disability => {
    const { condition, sideOfBody } = disability;

    let id = sippableId(NULL_CONDITION_STRING);
    let title = NULL_CONDITION_STRING;

    if (typeof condition === 'string' && condition.trim() !== '') {
      const base = condition.trim();
      const side = formatSide(sideOfBody);
      id = sippableId(base);
      const display = capitalizeEachWord(base);
      title = side ? `${display}, ${side}` : display;
    }

    options[id] = { 'ui:title': title };
  });

  options.none = {
    'ui:title': 'I am not claiming any conditions related to toxic exposure',
  };

  return options;
}

/**
 * Validates 'none' checkbox is not selected along with a new condition
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateTEConditions(errors, formData) {
  const { conditions = {} } = formData?.toxicExposure;

  validateConditions(
    conditions,
    errors,
    'toxicExposure',
    noneAndConditionError,
  );
}

/**
 * Get the value for the 'other' field's description
 * @param {object} formData - full form data
 * @param {string} objectName - name of the object containing the 'other' field
 * @returns {string} sanitized description value if present
 */
export function getOtherFieldDescription(formData, objectName) {
  const description = formData?.toxicExposure?.[objectName]?.description;

  return typeof description === 'string' ? description.trim() : '';
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
export function getKeyIndex(key, objectName, formData) {
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
 * @param {string} checkboxObjectName - name of the checkbox object to look at in the form data
 * @param {object} formData - full formData for the form
 * @param {string} otherFieldName - name of the 'other' field to look at in the form data
 * @returns {number} count of checkboxes with a value of true
 */
export function getSelectedCount(
  checkboxObjectName,
  formData,
  otherFieldName = '',
) {
  const otherFieldDescription = getOtherFieldDescription(
    formData,
    otherFieldName,
  );
  if (!formData?.toxicExposure?.[checkboxObjectName] && !otherFieldDescription)
    return 0;

  let count = 0;
  const ignoredItems = ['none', 'notsure'];
  for (const [key, value] of Object.entries(
    formData.toxicExposure[checkboxObjectName],
  )) {
    // Skip `none` and `notsure` as non-locations
    if (value === true && !ignoredItems.includes(key)) {
      count += 1;
    }
  }

  return count + (otherFieldDescription ? 1 : 0);
}

/**
 * Validates selected items (e.g. gulfWar1990Locations, gulfWar2001Locations, etc.).
 * If the 'none' checkbox is selected along with another item, adds an error.
 *
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 * @param {string} objectName - Name of the object to look at in the form data
 * @param {string} otherObjectName - Name of the object containing other location or other hazard data
 * @param {string} selectionTypes - locations or hazards
 */
export function validateSelections(
  errors,
  formData,
  objectName,
  otherObjectName,
  selectionTypes = 'locations',
) {
  const { [objectName]: items = {} } = formData?.toxicExposure;

  if (
    items?.none === true &&
    !!getSelectedCount(objectName, formData, otherObjectName)
  ) {
    errors.toxicExposure[objectName].addError(
      selectionTypes === 'hazards' ? noneAndHazardError : noneAndLocationError,
    );
  }
}

/**
 * Checks if a specific details page should display. It should display if all
 * the following is true
 * 1. TE pages should be showing at all
 * 2. the given checkbox data is present for the given itemId with a value of true
 * 3. the 'none' checkbox is not true
 *
 * @param {object} formData - full form data
 * @param {string} itemId - unique id for the item
 * @returns {boolean} true if the page should display, false otherwise
 */
export function showCheckboxLoopDetailsPage(
  formData,
  checkboxObjectName,
  itemId,
) {
  return (
    itemId !== 'notsure' &&
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
 * 2. at least one checkbox item was selected OR an 'other' item input was populated
 * 3. the 'none' checkbox is not true
 * 4. the 'notsure' checkbox is not the only one selected
 *
 * @param {object} formData - full form data
 * @param {string} checkboxObjectName - name of the object containing the checkboxes
 * @param {string} otherObjectName - name of the object containing an 'other' input
 * @returns {boolean} true if the page should display, false otherwise
 */
export function showSummaryPage(
  formData,
  checkboxObjectName,
  otherObjectName = '',
) {
  if (
    isClaimingTECondition(formData) &&
    formData?.toxicExposure[checkboxObjectName]
  ) {
    const checkboxes = formData?.toxicExposure[checkboxObjectName];
    const numSelected = Object.values(
      formData?.toxicExposure[checkboxObjectName],
    ).filter(value => value === true).length;
    return (
      checkboxes.none !== true &&
      ((numSelected > 0 && (checkboxes.notsure !== true || numSelected > 1)) ||
        !!getOtherFieldDescription(formData, otherObjectName))
    );
  }
  return false;
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
    if (dates?.['view:notSure']) {
      return notSureDatesSummary;
    }
    return noDatesEntered;
  }
  const startDate =
    formatMonthYearDate(dates?.startDate) || 'No start date entered';
  const endDate = formatMonthYearDate(dates?.endDate) || 'No end date entered';
  return `${startDate} - ${endDate}`;
}

/**
 * Create a title and subtitle for a page which will be passed into ui:title so that
 * they are grouped in the same legend
 * @param {string} title - the title for the page, which displays below the stepper
 * @param {string} subTitle - the subtitle for the page, which displays below the title
 * @returns {JSX.Element} markup with title and subtitle. example below.
 *
 * <h3 class="...">Service after August 2, 1990</h3>
 * <h4 class="...">Location 2 of 2: Iraq</h4>
 */
export function titleWithSubtitle(title, subTitle) {
  return (
    <>
      {formTitle(title)}
      {formSubtitle(subTitle)}
    </>
  );
}

/**
 * Group together the title, subtitle and description for the details page
 * @param {string} title - the title for the page, which displays below the stepper
 * @param {string} subTitle - markup for the page that displays in between the title and rest of the page
 * @param {string} type - the type of page to generate for, locations or hazards
 * @returns {JSX.Element} legend for the fieldset
 */
export function detailsPageBegin(title, subTitle, type = 'locations') {
  return (
    <legend>
      {formTitle(title)}
      {formSubtitle(subTitle)}
      <p className="vads-u-color--base vads-u-font-weight--normal vads-u-margin-bottom--0">
        {type === 'locations'
          ? dateRangeDescriptionWithLocation
          : dateRangeDescriptionWithHazard}
      </p>
    </legend>
  );
}

/**
 * Review field component for toxic exposure date fields
 * Handles year-only dates (YYYY-XX) and month/year dates (YYYY-MM) correctly
 * @param {Object} props - Review field props
 * @param {Object} props.children - Children object containing formData and uiSchema
 * @returns {JSX.Element} Review field row
 */
export const reviewDateField = ({ children }) => {
  const { formData, uiSchema: fieldUiSchema } = children.props;
  const formattedDate = formatMonthYearDate(formData);
  return (
    <div className="review-row">
      <dt>{fieldUiSchema['ui:title']}</dt>
      <dd>{formattedDate}</dd>
    </div>
  );
};
