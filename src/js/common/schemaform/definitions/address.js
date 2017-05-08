import _ from 'lodash/fp';
import { countries } from '../../utils/options-for-select';
import { validateAddress } from '../validation';

/*
 * These are schema definitions for some common form fields
 */
const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);

export function schema(currentSchema, isRequired = false) {
  return {
    type: 'object',
    required: isRequired ? ['street', 'city', 'country', 'postalCode'] : undefined,
    properties: _.assign(currentSchema.definitions.address.properties, {
      country: {
        'default': 'USA',
        type: 'string',
        'enum': countryValues,
        enumNames: countryNames
      },
      state: {
        type: 'string'
      },
      postalCode: {
        type: 'string',
        maxLength: 10
      }
    })
  };
}

export function uiSchema(label = 'Address') {
  return {
    'ui:title': label,
    'ui:field': 'address',
    'ui:validations': [
      validateAddress
    ],
    'ui:order': ['country', 'street', 'street2', 'city', 'state', 'postalCode'],
    country: {
      'ui:title': 'Country'
    },
    street: {
      'ui:title': 'Street'
    },
    street2: {
      'ui:title': 'Line 2'
    },
    street3: {
      'ui:title': 'Line 3'
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
}
