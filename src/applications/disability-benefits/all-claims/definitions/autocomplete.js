import merge from 'lodash/merge';

import AutoComplete from '../components/AutoComplete';

/*
 * Create uiSchema for autocomplete
 *
 * @param {string} label - Label for the field
 * @param {object} options - Any other options to override the uiSchema defaults with
 */
export function uiSchema(label, options = {}) {
  return merge(
    {},
    {
      'ui:title': label,
      'ui:field': AutoComplete,
    },
    options,
  );
}

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
