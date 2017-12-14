import _ from 'lodash/fp';

import AutosuggestField from '../fields/AutosuggestField';

export function schema(field) {
  return {
    type: 'object',
    properties: {
      id: field || { type: 'any' },
      value: {
        type: 'string'
      },
      widget: {
        type: 'string'
      }
    }
  };
}

export function uiSchema(label, getOptions, options = {}) {
  return _.merge({
    'ui:title': label,
    'ui:field': AutosuggestField,
    'ui:options': {
      showFieldLabel: 'label',
      maxOptions: 20,
      getOptions
    }
  }, options);
}
