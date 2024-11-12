import React from 'react';
import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import { isClaimingNew, sippableId } from '../utils';
import { NULL_CONDITION_STRING } from '../constants';

/* ---------- content ----------*/
export const conditionsPageTitle = 'Mental health conditions';
export const conditionsQuestion =
  'Are any of your new conditions a mental health condition related to a traumatic event during your military service? Check any that are related.';
export const examplesDescription =
  'Examples of mental health disorders include, but are not limited to, post-traumatic stress disorder (PTSD), depression, anxiety, and bipolar disorder.';

export const traumaticEventsInfo = (
  <va-accordion open-single>
    <va-accordion-item
      header="Examples of traumatic events"
      class="vads-u-margin-y--3"
      id="first"
      bordered
    >
      <h4 className="vads-u-margin-top--0">
        Traumatic events related to combat
      </h4>
      <ul>
        <li>You were engaged in combat with enemy forces</li>
        <li>You experienced fear of hostile military or terrorist activity</li>
        <li>You served in an imminent danger area</li>
        <li>You served as a drone aircraft crew member</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Traumatic events related to sexual assault or harassment
      </h4>
      <ul>
        <li>
          You experienced pressure to engage in sexual activities (for example,
          someone threatened you with bad treatment for refusing sex, or
          promised you better treatment in exchange for sex)
        </li>
        <li>
          You were pressured into sexual activities against your will (for
          example, when you were asleep or intoxicated)
        </li>
        <li>You were physically forced into sexual activities</li>
        <li>
          You experienced offensive comments about your body or sexual
          activities
        </li>
        <li>You experienced unwanted sexual advances</li>
        <li>
          You experienced someone touching or grabbing you against your will,
          including during hazing
        </li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Traumatic events related to other personal interactions
      </h4>
      <ul>
        <li>
          You experienced physical assault, battery, robbery, mugging, stalking,
          or harassment by a person who wasn’t part of an enemy force
        </li>
        <li>You experienced domestic intimate partner abuse or harassment</li>
      </ul>
      <h4 className="vads-u-margin-top--0">Other traumatic events</h4>
      <ul>
        <li>You got into a car accident</li>
        <li>You witnessed a natural disaster, like a hurricane</li>
        <li>You worked on burn ward or graves registration</li>
        <li>
          You witnessed the death, injury, or threat to another person or to
          yourself, that was caused by something other than a hostile military
          or terrorist activity
        </li>
        <li>
          You experienced or witnessed friendly fire that occurred on a gunnery
          range during a training mission
        </li>
      </ul>
    </va-accordion-item>
  </va-accordion>
);

export const noneAndConditionError =
  "If you're not claiming any mental health conditions related to a traumatic event, unselect the other options you selected";

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
  const options = (formData?.newDisabilities || []).map(disability =>
    sippableId(disability.condition),
  );

  options.push('none');

  return checkboxGroupSchema(options);
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
 * Validates selected Mental Health conditions. If the 'none' checkbox is selected along with a new condition
 * adds an error.
 *
 * @param {object} errors - Errors object from rjsf
 * @param {object} formData
 */
export function validateMHConditions(errors, formData) {
  const { conditions = {} } = formData?.mentalHealth;

  if (
    conditions?.none === true &&
    Object.values(conditions).filter(value => value === true).length > 1
  ) {
    errors.mentalHealth.conditions.addError(noneAndConditionError);
  }
}
