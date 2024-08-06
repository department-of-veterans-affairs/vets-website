import constants from 'vets-json-schema/dist/constants.json';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { generateTitle } from '../../../helpers';

const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

export const schema = {
  type: 'object',
  properties: {
    currentMarriageInformation: {
      type: 'object',
      properties: {
        marriedOutsideUsa: {
          type: 'boolean',
          default: false,
        },
        location: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: STATE_VALUES,
              enumNames: STATE_NAMES,
            },
            city: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  currentMarriageInformation: {
    'ui:title': generateTitle('Where did you get married?'),
    marriedOutsideUsa: {
      'ui:title': 'I got married outside the U.S.',
      'ui:webComponentField': VaCheckboxField,
    },
    location: {
      city: {
        'ui:title': 'City',
        'ui:required': () => true,
        'ui:autocomplete': 'address-level2',
        'ui:errorMessages': {
          required: 'Enter the city where you were married',
        },
        'ui:webComponentField': VaTextInputField,
      },
      state: {
        'ui:title': 'State',
        'ui:webComponentField': VaSelectField,
        'ui:required': formData =>
          !formData?.currentMarriageInformation?.marriedOutsideUsa,
        'ui:errorMessages': {
          required: 'Select a state',
        },
        'ui:options': {
          updateSchema: (formData, _schema, _uiSchema) => {
            const updatedSchemaUI = _uiSchema;
            const location = formData?.currentMarriageInformation?.location;
            const marriedOutsideUsa =
              formData?.currentMarriageInformation?.marriedOutsideUsa;

            if (marriedOutsideUsa) {
              updatedSchemaUI['ui:options'].inert = true;
              location.state = undefined;
              return {
                type: 'string',
                enum: STATE_VALUES,
                enumNames: STATE_NAMES,
              };
            }

            updatedSchemaUI['ui:options'].inert = false;
            return {
              type: 'string',
              enum: STATE_VALUES,
              enumNames: STATE_NAMES,
            };
          },
        },
      },
    },
  },
};
