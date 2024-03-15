// based on vets-website/src/platform/forms-system/src/js/definitions/autosuggest.js
// overridden uiSchema for new AutoSuggest component with NEW search algorithm
import merge from 'lodash/merge';

// import AutosuggestField from '../../../../platform/forms-system/src/js/fields/AutosuggestField';
import { validateAutosuggestOption } from '../validation';
import AutosuggestFieldNewSearchAlg from '../field-overloads/AutosuggestFieldNewSearchAlg';

/*
 * Create uiSchema for autosuggest
 *
 * @param {string} label - Label for the field
 * @param {function} getOptions - Function that fetchs options to be shown and returns a promise
 * @param {object} options - Any other options to override the uiSchema defaults with
 */
export function uiSchema(label, getOptions, options = {}) {
  const validations = [];
  if (!options['ui:options']?.freeInput) {
    validations.push(validateAutosuggestOption);
  }

  return merge(
    {},
    {
      'ui:title': label,
      'ui:field': AutosuggestFieldNewSearchAlg,
      'ui:validations': validations,
      'ui:errorMessages': {
        required: 'Please select an option from the suggestions',
      },
      'ui:options': {
        showFieldLabel: 'label',
        maxOptions: 20,
        getOptions,
      },
    },
    options,
  );
}
