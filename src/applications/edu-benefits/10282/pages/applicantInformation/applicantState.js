import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { state } = fullSchema10282.definitions;

export const uiSchema = {
  state: {
    'ui:title': 'What state do you live in?',
    'ui:webComponentField': VaSelectField,
    'ui:errorMessages': {
      required: 'You must select a state',
    },
  },
};

export const schema = {
  type: 'object',
  required: ['state'],
  properties: {
    state,
  },
};
