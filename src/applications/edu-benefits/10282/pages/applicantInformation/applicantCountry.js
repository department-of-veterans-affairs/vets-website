import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { country } = fullSchema10282.definitions;

export const uiSchema = {
  ...titleUI('Your country of residence'),
  country: {
    'ui:title': 'What country do you live in?',
    'ui:webComponentField': VaSelectField,
    'ui:errorMessages': {
      required: 'You must select a country',
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
