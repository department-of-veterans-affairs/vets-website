import React from 'react';
import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import { capitalizeEachWord, isClaimingNew, sippableId } from '../utils';
import { NULL_CONDITION_STRING, SHOW_TOXIC_EXPOSURE } from '../constants';

/* ---------- content ----------*/
export const conditionsPageTitle = 'Toxic Exposure';
export const conditionsQuestion =
  'Are any of your new conditions related to toxic exposure during your military service? Check any that are related.';
export const conditionsDescription = (
  <va-additional-info
    class="vads-u-margin-top--2"
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

export const noneAndConditionError =
  'You selected a condition, and you also selected “I’m not claiming any conditions related to toxic exposure.” You’ll need to uncheck one of these options to continue.';

export const gulfWar1990LocationsAdditionalInfo = (
  <va-additional-info trigger="What if I have more than one date range?">
    <p>
      You only need to enter one date range. We’ll use this information to find
      your record.
    </p>
  </va-additional-info>
);

export function dateRangePageDescription(currentPage, totalPages, location) {
  return (
    <>
      <h4 className="vads-u-font-size--h5 vads-u-margin-top--2">
        {currentPage !== 0 &&
          totalPages !== 0 &&
          `${currentPage} of ${totalPages}: `}
        {location}
      </h4>
      <p>
        Enter any date range you served in this location. You don’t need to have
        exact dates.
      </p>
    </>
  );
}

/* ---------- utils ---------- */
/**
 * Checks if the toxic exposure pages should be displayed. Note: toggle is currently read
 * from the redux store by Form526EZApp and stored in sessions storage since not all form
 * aspects have ready access to the store.
 * @returns true if the toggle is enabled and Veteran is claiming at least one new condition, false otherwise
 */
export const showToxicExposurePages = formData =>
  window.sessionStorage.getItem(SHOW_TOXIC_EXPOSURE) === 'true' &&
  formData?.newDisabilities?.length > 0;

/**
 * Checks if
 * 1. at least one new condition is being claimed
 * 2. at least one checkbox on the TE conditions page is selected that is not 'none'
 *
 * @param {*} formData
 * @returns true if at least one condition is claimed for toxic exposure, false otherwise
 */
export const isClaimingTECondition = formData =>
  showToxicExposurePages &&
  isClaimingNew(formData) &&
  formData.toxicExposureConditions &&
  Object.keys(formData.toxicExposureConditions).some(
    condition =>
      condition !== 'none' &&
      formData.toxicExposureConditions[condition] === true,
  );

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
export const makeTEConditionsSchema = formData => {
  const options = (formData?.newDisabilities || []).map(disability =>
    sippableId(disability.condition),
  );

  options.push('none');

  return checkboxGroupSchema(options);
};

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
export const makeTEConditionsUISchema = formData => {
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
};

/**
 * Validates selected Toxic Exposure conditions. If the 'none' checkbox is selected along with a new condition
 * adds an error.
 *
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateTEConditions(errors, formData) {
  const { toxicExposureConditions = {} } = formData;

  if (
    toxicExposureConditions.none === true &&
    Object.values(toxicExposureConditions).filter(value => value === true)
      .length > 1
  ) {
    errors.toxicExposureConditions.addError(noneAndConditionError);
  }
}

/**
 * Given the key for checkbox options, find the index within the selected items
 * In this example, key='bahrain' would give index of 1, and key='airspace' would give index 3
 * gulfWar1990: {
 *   bahrain: true,
 *   egypt: false,
 *   airspace: true,
 * }
 *
 * @param {string} key - the id for the checkbox option
 * @param {string} objectName - name of the object to look at in the form data
 * @param {object} formData - full formData for the form
 * @returns {number} - index of the key within the list of selected items
 */
export function getKeyIndex(key, objectName, { formData }) {
  if (!formData[objectName]) return 0;

  let index = 0;
  const properties = Object.keys(formData[objectName]);
  for (let i = 0; i < properties.length; i += 1) {
    if (formData[objectName][properties[i]] === true) {
      index += 1;
      if (key === properties[i]) {
        return index;
      }
    }
  }
  return 0;
}

/**
 * Given an object storing checkbox values, get a count of how many values are true
 * @param {string} objectName - name of the object to look at in the form data
 * @param {object} formData - full formData for the form
 * @returns {number} count of checkboxes with a value of true
 */
export function getSelectedCount(objectName, { formData } = {}) {
  if (!formData[objectName]) return 0;

  return Object.values(formData[objectName]).filter(value => value === true)
    .length;
}
