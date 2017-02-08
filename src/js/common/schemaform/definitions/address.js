import { countries } from '../utils/options-for-select';
import { validateAddress } from '../validation';

/*
 * These are schema definitions for some common form fields
 */
const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);

export const schema = {
  type: 'object',
  title: 'Address',
  required: ['street', 'city', 'country', 'postalCode'],
  properties: {
    country: {
      'default': 'USA',
      type: 'string',
      'enum': countryValues,
      enumNames: countryNames
    },
    street: {
      type: 'string',
      minLength: 1,
      maxLength: 50
    },
    street2: {
      type: 'string',
      minLength: 1,
      maxLength: 50
    },
    city: {
      type: 'string',
      minLength: 1,
      maxLength: 51
    },
    state: {
      type: 'string'
    },
    postalCode: {
      type: 'string',
      maxLength: 10
    }
  }
};

export const uiSchema = {
  'ui:title': 'Address',
  'ui:field': 'address',
  'ui:validations': [
    validateAddress
  ],
  country: {
    'ui:title': 'Country'
  },
  street: {
    'ui:title': 'Street'
  },
  street2: {
    'ui:title': 'Line 2'
  },
  city: {
    'ui:title': 'City'
  },
  state: {
    'ui:title': 'State'
  },
  postalCode: {
    'ui:title': 'Postal code',
    'ui:options': {
      widgetClassNames: 'usa-input-medium'
    }
  }
};
