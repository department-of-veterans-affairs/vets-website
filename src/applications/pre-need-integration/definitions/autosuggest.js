import merge from 'lodash/merge';

import { validateAutosuggestOption } from 'platform/forms-system/src/js/validation';
import AutosuggestField from '../components/AutosugggestField';

// don't use for enum fields, they need access to the
// list of enums and names
export const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'any',
    },
    label: {
      type: 'string',
    },
  },
};

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
      'ui:field': AutosuggestField,
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
