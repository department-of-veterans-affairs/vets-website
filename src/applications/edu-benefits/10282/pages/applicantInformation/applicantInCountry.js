import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { country } = fullSchema10282.definitions;

export const uiSchema = {
  country: {
    'ui:title': 'What country do you live in?',
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:webComponentField': VaSelectField,
    'ui:errorMessages': {
      required: 'You must select a Country',
    },
  },
};

export const schema = {
  type: 'object',
  required: ['country'],
  properties: {
    country,
  },
};