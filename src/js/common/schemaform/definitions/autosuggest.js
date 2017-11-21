import _ from 'lodash/fp';

import AutosuggestField from '../fields/AutosuggestField';

export const schema = {
  type: 'object',
  properties: {
    id: { type: 'any' },
    value: {
      type: 'string'
    },
    widget: {
      type: 'string'
    }
  }
};

export function uiSchema(label, getOptions, options = {}) {
  return _.merge({
    'ui:title': label,
    'ui:field': AutosuggestField,
    'ui:options': {
      showFieldLabel: 'label',
      getOptions
    }
  }, options);
}
