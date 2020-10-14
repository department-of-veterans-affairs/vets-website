import { createSelector } from 'reselect';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { validateWhiteSpace } from 'platform/forms/validations';

import { states, isValidUSZipCode } from 'platform/forms/address';

function validateAddress(errors, address) {
  validateWhiteSpace(errors.street, address.street);
  validateWhiteSpace(errors.city, address.city);

  const hasAddressInfo =
    typeof address.street !== 'undefined' &&
    typeof address.city !== 'undefined' &&
    typeof address.postalCode !== 'undefined';

  if (hasAddressInfo && typeof address.state === 'undefined') {
    errors.state.addError(
      'Please enter a state, or remove other address information.',
    );
  }

  const isValidPostalCode = isValidUSZipCode(address.postalCode);

  // Add error message for postal code if it is invalid
  if (address.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}

const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);
const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);
const usaStates = states.USA.map(state => state.value);
const usaLabels = states.USA.map(state => state.label);

function isMilitaryCity(city = '') {
  const lowerCity = city.toLowerCase().trim();

  return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
}

export const schema = {
  type: 'object',
  properties: {
    street: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
      pattern: '^.*\\S.*',
    },
    street2: {
      type: 'string',
      maxLength: 30,
    },
    state: {
      type: 'string',
      enum: usaStates,
      enumNames: usaLabels,
    },
    city: {
      type: 'string',
      minLength: 1,
      maxLength: 51,
      pattern: '^.*\\S.*',
    },
    postalCode: {
      type: 'string',
      maxLength: 10,
    },
  },
};

export function uiSchema(label = '') {
  const fieldOrder = ['street', 'street2', 'city', 'state', 'postalCode'];

  const addressChangeSelector = createSelector(
    ({ formData, path }) => get(path.concat('city'), formData),
    (...args) => get('addressSchema', ...args),
    (city, addressSchema) => {
      const schemaUpdate = {
        properties: addressSchema.properties,
      };

      const stateList = usaStates;
      const labelList = usaLabels;

      // We constrain the state list when someone picks a city that’s a military base
      if (
        isMilitaryCity(city) &&
        schemaUpdate.properties.state.enum !== militaryStates
      ) {
        const withEnum = set(
          'state.enum',
          militaryStates,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = set(
          'state.enumNames',
          militaryLabels,
          withEnum,
        );
      } else {
        schemaUpdate.properties = set(
          'state.enumNames',
          labelList,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = set(
          'state.enum',
          stateList,
          schemaUpdate.properties,
        );
      }

      return schemaUpdate;
    },
  );

  return {
    'ui:title': label,
    'ui:validations': [validateAddress],
    'ui:options': {
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) =>
        addressChangeSelector({
          formData,
          addressSchema,
          path,
        }),
    },
    'ui:order': fieldOrder,
    street: {
      'ui:title': 'Street',
    },
    street2: {
      'ui:title': 'Line 2',
    },
    city: {
      'ui:title': 'City',
    },
    state: {
      'ui:title': 'State',
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
  };
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function distanceBetween(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(1));
}

export function getPreciseLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
    );
  });
}
