import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import constants from 'vets-json-schema/dist/constants.json';

const { state } = fullSchema10282.definitions;

export const uiSchema = {
  ...titleUI('State'),
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
    state: {
      ...state,
      enum: constants.states.USA.map(st => st.label),
    },
  },
};
