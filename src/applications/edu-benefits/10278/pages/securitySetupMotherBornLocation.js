import {
  titleUI,
  textUI,
  selectUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import constants from 'vets-json-schema/dist/constants.json';

const filteredStates = constants.states.USA.filter(
  state => !['AP', 'AE', 'AA'].includes(state.value),
);
const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

const uiSchema = {
  ...titleUI('What city and state was your mother born in?'),
  securityAnswerLocation: {
    city: {
      ...textUI({
        title: 'City',
        errorMessages: {
          required: 'Enter a city',
        },
      }),
    },
    state: {
      ...selectUI({
        title: 'State, province, or region',
        errorMessages: {
          required: 'Select a state, province, or region',
        },
      }),
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    motherBornLocation: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          maxLength: 30,
        },
        state: {
          type: 'string',
          enum: STATE_VALUES,
          enumNames: STATE_NAMES,
        },
      },
      required: ['city', 'state'],
    },
  },
  required: ['motherBornLocation'],
};

export { schema, uiSchema };
