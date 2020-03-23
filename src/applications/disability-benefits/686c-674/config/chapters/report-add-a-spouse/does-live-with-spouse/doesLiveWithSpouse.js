import { genericSchemas } from '../../../generic-schema';

import { doesLiveTogether } from './helpers';

const {
  countryDropdown,
  genericTextInput,
  genericNumberAndDashInput: numberAndDashInput,
} = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    spouseDoesLiveWithVeteran: {
      type: 'boolean',
    },
    currentSpouseReasonForSeparation: genericTextInput,
    currentSpouseAddress: {
      type: 'object',
      properties: {
        currentSpouseCountry: countryDropdown,
        currentSpouseStreet: genericTextInput,
        currentSpouseLine2: genericTextInput,
        currentSpouseLine3: genericTextInput,
        currentSpouseCity: genericTextInput,
        currentSpouseState: genericTextInput,
        currentSpousePostalCode: numberAndDashInput,
      },
    },
  },
};

export const uiSchema = {
  spouseDoesLiveWithVeteran: {
    'ui:required': () => true,
    'ui:title': 'Does your spouse live with you?',
    'ui:widget': 'yesNo',
    'ui:errorMessages': { required: 'Please select an option' },
  },
  currentSpouseReasonForSeparation: {
    'ui:required': doesLiveTogether,
    'ui:title': 'Reason for separation',
    'ui:options': {
      expandUnder: 'spouseDoesLiveWithVeteran',
      expandUnderCondition: false,
    },
    'ui:errorMessages': { required: 'Please give a brief explanation' },
  },
  currentSpouseAddress: {
    'ui:title': 'Your spouse’s address',
    'ui:options': {
      expandUnder: 'spouseDoesLiveWithVeteran',
      expandUnderCondition: false,
    },
    currentSpouseCountry: {
      'ui:title': 'Country',
      'ui:required': doesLiveTogether,
      'ui:errorMessages': { required: 'Please select a country' },
    },
    currentSpouseStreet: {
      'ui:title': 'Street',
      'ui:required': doesLiveTogether,
      'ui:errorMessages': { required: 'Please enter a street address' },
    },
    currentSpouseLine2: {
      'ui:title': 'Line 2',
    },
    currentSpouseLine3: {
      'ui:title': 'Line 3',
    },
    currentSpouseCity: {
      'ui:title': 'City',
      'ui:required': doesLiveTogether,
      'ui:errorMessages': { required: 'Please enter a city' },
    },
    currentSpouseState: {
      'ui:title': 'State',
      'ui:required': doesLiveTogether,
      'ui:errorMessages': {
        required: 'Please enter a state, or country if outside the U.S.',
      },
    },
    currentSpousePostalCode: {
      'ui:required': doesLiveTogether,
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:title': 'Postal Code',
      'ui:errorMessages': { required: 'Please enter a postal code' },
    },
  },
};
