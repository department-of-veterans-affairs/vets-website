import _ from 'lodash/fp';

import AdditionalSourcesField from '../components/AdditionalSourcesField';

export function additionalSourcesSchema(schema) {
  return _.set('items.required', ['name', 'amount'], schema.definitions.additionalSources);
}

export const additionalSourcesUI = {
  'ui:field': AdditionalSourcesField,
  'ui:options': {
    keepInPageOnReview: true
  },
  items: {
    name: {
      'ui:title': 'Source'
    },
    amount: {
      'ui:title': 'Amount',
      'ui:options': {
        classNames: 'schemaform-currency-input'
      }
    }
  }
};
