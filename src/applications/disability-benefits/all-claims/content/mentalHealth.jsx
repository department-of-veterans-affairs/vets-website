import {
  isClaimingNew,
  makeConditionsSchema,
  sippableId,
  validateConditions,
} from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

/* ---------- content ----------*/
export const conditionsPageTitle = 'Mental health conditions';
export const conditionsQuestion =
  'Are any of your new conditions a mental health condition related to a traumatic event during your military service? Check any that are related.';
export const examplesHint =
  'Examples of mental health disorders include, but are not limited to, post-traumatic stress disorder (PTSD), depression, anxiety, and bipolar disorder.';

export const noneAndConditionError =
  'If you’re not claiming any mental health conditions related to a traumatic event, unselect the other options you selected';

/* ---------- utils ---------- */
/**
 * Checks if the mental health pages should be displayed using the following criteria
 *  1. 'syncModern0781Flow' is true
 *  2. the claim has a claim type of new
 *  3. claiming at least one new disability
 *
 * @returns true if all criteria are met, false otherwise
 */
export function showMentalHealthPages(formData) {
  return (
    formData?.syncModern0781Flow === true &&
    isClaimingNew(formData) &&
    formData?.newDisabilities?.length > 0
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
 * @returns {object} Object with ids for each condition
 */
export function makeMHConditionsSchema(formData) {
  return makeConditionsSchema(formData);
}

/**
 * Builds the UI Schema based on user entered condition names
 *
 * Example output:
 *  {
 *   anemia: {
 *     'ui:title': 'Anemia',
 *   },
 *   tinnitusringingorhissinginears: {
 *     'ui:title': 'Tinnitus (ringing or hissing in ears)',
 *   },
 *   none: {
 *     'ui:title': 'I am not claiming any meantal health conditions related to a traumatic event.',
 *   },
 * }
 * @param {*} formData - Full formData for the form
 * @returns {object} Object with id and title for each condition
 */
export function makeMHConditionsUISchema(formData) {
  const { newDisabilities = [] } = formData;
  const options = {};

  newDisabilities.forEach(disability => {
    const { condition } = disability;

    const capitalizedDisabilityName =
      typeof condition === 'string'
        ? condition.charAt(0).toUpperCase() + condition.slice(1)
        : NULL_CONDITION_STRING;

    options[sippableId(condition || NULL_CONDITION_STRING)] = {
      'ui:title': capitalizedDisabilityName,
    };
  });

  options.none = {
    'ui:title':
      'I am not claiming any mental health conditions related to a traumatic event.',
  };

  return options;
}

/**
 * Validates the 'none' checkbox is not selected along with a new condition
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateMHConditions(errors, formData) {
  const { conditions = {} } = formData?.mentalHealth;

  validateConditions(conditions, errors, 'mentalHealth', noneAndConditionError);
}
