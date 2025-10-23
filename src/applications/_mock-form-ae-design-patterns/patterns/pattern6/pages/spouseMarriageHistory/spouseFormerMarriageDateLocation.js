import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemSubsequentPageTitleUI,
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
    ...arrayBuilderItemSubsequentPageTitleUI(({ formContext }) => {
      const first =
        formContext?.formData?.spouseFullName?.first ?? 'your current spouse';
      return `When and where was ${first} previously married?`;
    }),
    dateOfMarriage: currentOrPastDateUI('Date'),
    'view:marriedOutsideUS': {
      'ui:title': 'They got married outside the U.S.',
      'ui:webComponentField': VaCheckboxField,
    },
    marriageLocation: {
      city: {
        'ui:title': 'City',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter the city where you got married',
        },
      },
      state: {
        'ui:title': 'State',
        'ui:webComponentField': VaSelectField,
        'ui:required': (formData, index) => {
          const item = formData?.spouseMarriageHistory?.[index];
          return !item?.['view:marriedOutsideUS'];
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.spouseMarriageHistory?.[index];
            return item?.['view:marriedOutsideUS'];
          },
          labels: STATE_VALUES.reduce((acc, value, idx) => {
            acc[value] = STATE_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a state',
        },
      },
      country: {
        'ui:title': 'Country',
        'ui:webComponentField': VaSelectField,
        'ui:required': (formData, index) => {
          const item = formData?.spouseMarriageHistory?.[index];
          return item?.['view:marriedOutsideUS'];
        },
        'ui:errorMessages': {
          required: 'Please select a country',
        },
        'ui:options': {
          hideIf: (formData, index) => {
            const item = formData?.spouseMarriageHistory?.[index];
            return !item?.['view:marriedOutsideUS'];
          },
          labels: COUNTRY_VALUES.reduce((acc, value, idx) => {
            acc[value] = COUNTRY_NAMES[idx];
            return acc;
          }, {}),
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dateOfMarriage', 'marriageLocation'],
    properties: {
      dateOfMarriage: currentOrPastDateSchema,
      'view:marriedOutsideUS': {
        type: 'boolean',
        default: false,
      },
      marriageLocation: {
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
