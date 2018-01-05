import _ from 'lodash/fp';

import AutosuggestField from '../fields/AutosuggestField';
import { validateAutosuggestOption } from '../validation';

// don't use for enum fields, they need access to the
// list of enums and names
export const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'any'
    },
    label: {
      type: 'string'
    }
  }
};

export function uiSchema(label, getOptions, options = {}) {
  return _.merge({
    'ui:title': label,
    'ui:field': AutosuggestField,
    'ui:validations': [
      validateAutosuggestOption
    ],
    'ui:errorMessages': {
      type: 'Please select an option from the suggestions'
    },
    'ui:options': {
      showFieldLabel: 'label',
      maxOptions: 20,
      getOptions
    }
  }, options);
}
