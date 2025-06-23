import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import constants from 'vets-json-schema/dist/constants.json';

// Get military states to filter them out
const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);

// Get states from the same source as the addressUI component
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);
const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

// Get countries from the same source as the addressUI component
const COUNTRY_VALUES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.value);
const COUNTRY_NAMES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.label);

export default {
  uiSchema: {
    ...titleUI('When and where did your marriage end?'),
    dateOfTermination: currentOrPastDateUI('Date'),
    'view:marriageEndedOutsideUS': {
      'ui:title': 'The marriage ended outside the U.S.',
      'ui:webComponentField': VaCheckboxField,
    },
    marriageEndLocation: {
      city: {
        'ui:title': 'City',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter the city where your marriage ended',
        },
      },
      state: {
        'ui:title': 'State',
        'ui:webComponentField': VaSelectField,
        'ui:required': formData => !formData['view:marriageEndedOutsideUS'],
        'ui:options': {
          hideIf: formData => formData['view:marriageEndedOutsideUS'],
        },
        'ui:errorMessages': {
          required: 'Please select a state',
        },
      },
      country: {
        'ui:title': 'Country',
        'ui:webComponentField': VaSelectField,
        'ui:required': formData => formData['view:marriageEndedOutsideUS'],
        'ui:errorMessages': {
          required: 'Please select a country',
        },
        'ui:options': {
          updateSchema: formData => {
            if (formData['view:marriageEndedOutsideUS']) {
              return {
                'ui:hidden': false,
              };
            }
            return {
              'ui:hidden': true,
            };
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dateOfTermination', 'marriageEndLocation'],
    properties: {
      dateOfTermination: currentOrPastDateSchema,
      'view:marriageEndedOutsideUS': {
        type: 'boolean',
        default: false,
      },
      marriageEndLocation: {
        type: 'object',
        required: ['city'],
        properties: {
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
            enum: STATE_VALUES,
            enumNames: STATE_NAMES,
          },
          country: {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          },
        },
      },
    },
  },
};
