import merge from 'lodash/merge';

import { ComboBox } from '../components/ComboBox';
// import { validateAutoSuggest } from 'src/platform/forms-system/src/js/validation'

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
export function uiSchema(label, options = {}) {
  const validations = [];

  return merge(
    {},
    {
      'ui:title': label,
      'ui:field': ComboBox,
      'ui:validations': validations,
      'ui:errorMessages': {
        required: 'Please select an option from the suggestions',
      },
      'ui:options': {
        showFieldLabel: 'label',
        maxOptions: 20,
      },
    },
    options,
  );
}
