import set from 'platform/utilities/data/set';

import AdditionalSourcesField from '../components/AdditionalSourcesField';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export function additionalSourcesSchema(schema) {
  return set(
    'items.required',
    ['name', 'amount'],
    schema.definitions.additionalSources,
  );
}

export const additionalSourcesUI = {
  'ui:field': AdditionalSourcesField,
  'ui:options': {
    keepInPageOnReview: true,
  },
  items: {
    name: {
      'ui:title': 'Source',
    },
    amount: currencyUI('Amount'),
  },
};
