import { genericSchemas } from '../../../generic-schema';
import emailUI from 'platform/forms-system/src/js/definitions/email';

export const schema = {
  type: 'object',
  required: [],
  properties: {
    countryDropdown: genericSchemas.countryDropdown,
    street: genericSchemas.genericTextInput,
    line2: genericSchemas.genericTextInput,
    line3: genericSchemas.genericTextInput,
    city: genericSchemas.genericTextInput,
    state: genericSchemas.genericTextInput,
    postalCode: genericSchemas.genericNumberAndDashInput,
    phoneNumber: genericSchemas.phoneInput,
    emailAddress: genericSchemas.emailInput,
  },
};

export const uiSchema = {
  countryDropdown: {
    'ui:title': 'Country',
    'ui:required': () => true,
  },
  street: {
    'ui:title': 'Street',
    'ui:required': () => true,
  },
  line2: {
    'ui:title': 'Line 2',
  },
  line3: {
    'ui:title': 'Line 3',
  },
  city: {
    'ui:title': 'City',
    'ui:required': () => true,
  },
  state: {
    'ui:title': 'State',
    'ui:required': () => true,
  },
  postalCode: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:required': () => true,
    'ui:title': 'Postal Code',
  },
  phoneNumber: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:required': () => true,
    'ui:title': 'Phone Number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers, no dashes or parentheses',
    },
  },
  emailAddress: emailUI(),
};
