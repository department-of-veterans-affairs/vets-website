import { isInsideListLoopReturn, isOutsideListLoopReturn } from './helpers';

/**
 * This module is intended to create a reusable location schema and UI that can
 * be reused throughout the 686c-674 form since we have multiple places we ask
 * for this same information. The schema can handle two cases:
 * 1. If the user is inside the US we provide a dropdown of US states and a textfield for the city
 * 2. If the user is outside the US they can check the isOutsideUS checkbox and be shown a textfield for a country and a texfield for the city
 *
 * Important Logic
 * This module needs to work both outside of a list loop and inside of a list loop, to accomidate this
 * you are required to pass in an `isInsideListLoop` boolean and if this is true the module utilizes the
 * `index` of the list loop
 *
 * @param {string} chapter - The name of the chapter this module is used inside of
 * @param {string} outerField - The name of the set of location fields in the schema
 * @param {boolean} isInsideListLoop - A boolean for if this module is being used inside a list loop
 * @param {string} formChapter - The name of the form chapter this module is being used in
 * @param {string} countryUiLabel - The form label used when the country input is rendered into the DOM
 * @param {string} stateUiLabel - The form label used when the state input is rendered into the DOM
 * @param {string} cityUiLabel - The form label used when the city input is rendered into the DOM
 *
 * @return {object}
 * */

export const locationUISchema = (
  chapter,
  outerField,
  isInsideListLoop,
  uiTitle,
  formChapter,
  countryUiLabel = 'Country',
  stateUiLabel = 'State',
  cityUiLabel = 'City',
) => {
  // IF we are inside a list loop, return hideIf and required uiSchema that use `index`
  if (isInsideListLoop) {
    return isInsideListLoopReturn(
      chapter,
      outerField,
      uiTitle,
      formChapter,
      countryUiLabel,
      stateUiLabel,
      cityUiLabel,
    );
  }

  // IF we are NOT inside a list loop, return hideIf and required uiSchema that do NOT use `index`
  return isOutsideListLoopReturn(
    chapter,
    outerField,
    uiTitle,
    formChapter,
    countryUiLabel,
    stateUiLabel,
    cityUiLabel,
  );
};
