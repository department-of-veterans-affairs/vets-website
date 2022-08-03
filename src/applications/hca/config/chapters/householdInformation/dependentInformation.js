import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import DependentView from '../../../components/DependentView';
import { uiSchema as dependentUI } from '../../../definitions/dependent';

const { dependents } = fullSchemaHca.properties;

const ariaLabelfunc = data =>
  data.fullName && data.fullName.first && data.fullName.last
    ? `${data.fullName.first} ${data.fullName.last}`
    : 'Dependent';

export default {
  uiSchema: {
    'view:reportDependents': {
      'ui:title': 'Do you have any dependents to report?',
      'ui:widget': 'yesNo',
    },
    dependents: {
      items: {
        ...dependentUI,
        'ui:options': {
          itemAriaLabel: ariaLabelfunc,
        },
      },
      'ui:options': {
        expandUnder: 'view:reportDependents',
        itemName: 'Dependent',
        hideTitle: true,
        viewField: DependentView,
        itemAriaLabel: ariaLabelfunc,
      },
      'ui:errorMessages': {
        minItems: 'You must add at least one dependent.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['view:reportDependents'],
    properties: {
      'view:reportDependents': { type: 'boolean' },
      dependents: {
        ...dependents,
        minItems: 1,
      },
    },
  },
};
