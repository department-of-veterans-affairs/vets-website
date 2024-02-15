import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { checkboxGroupSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import {
  capitalizeEachWord,
  isClaimingNew,
  showToxicExposurePages,
  sippableId,
} from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

/**
 * Checks if toggle is enabled and user is claiming at least one new condition for toxic exposure
 *
 * @param {*} formData
 * @returns true if at least one condition is claimed for toxic exposure, false otherwise
 */
export const isClaimingTECondition = formData =>
  showToxicExposurePages &&
  isClaimingNew(formData) &&
  Object.values(get('toxicExposureConditions', formData, {})).includes(true);

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

export const gulfWar1990PageTitle = 'Service locations after August 2, 1990';
export const gulfWar1990Question =
  'Did you serve in any of these Gulf War locations on or after August 2, 1990? Check any locations where you served.';

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
 * @param {*} formData Full formData for the form
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
 * };
 * @param {*} formData Full formData for the form
 * @returns {object} Object with id and title for each condition
 */
export const makeTEConditionsUISchema = formData => {
  const { newDisabilities } = formData;
  const options = {};

  if (newDisabilities) {
    newDisabilities.forEach(disability => {
      const { condition } = disability;

      const capitalizedDisabilityName =
        typeof condition === 'string'
          ? capitalizeEachWord(condition)
          : NULL_CONDITION_STRING;

      options[sippableId(condition)] = {
        'ui:title': capitalizedDisabilityName,
      };
    });
  }

  options.none = {
    'ui:title': 'I am not claiming any conditions related to toxic exposure',
  };

  return options;
};
