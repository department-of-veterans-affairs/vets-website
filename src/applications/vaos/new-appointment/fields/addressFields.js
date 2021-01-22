import { validateWhiteSpace } from 'platform/forms/validations';
import { states, isValidUSZipCode } from 'platform/forms/address';
import { createSelector } from 'reselect';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';

function validateAddress(errors, addr) {
  validateWhiteSpace(errors.street, addr.street);
  validateWhiteSpace(errors.city, addr.city);

  const hasAddressInfo =
    typeof addr.street !== 'undefined' &&
    typeof addr.city !== 'undefined' &&
    typeof addr.postalCode !== 'undefined';

  if (hasAddressInfo && typeof addr.state === 'undefined') {
    errors.state.addError(
      'Please enter a state, or remove other address information.',
    );
  }

  const isValidPostalCode = isValidUSZipCode(addr.postalCode);

  // Add error message for postal code if it is invalid
  if (addr.postalCode && !isValidPostalCode) {
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

export const addressSchema = {
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

export function getAddressUISchema(label = '') {
  const fieldOrder = ['street', 'street2', 'city', 'state', 'postalCode'];

  const addressChangeSelector = createSelector(
    ({ formData, path }) => get(path.concat('city'), formData),
    (...args) => get('addrSchema', ...args),
    (city, addrSchema) => {
      const schemaUpdate = {
        properties: addrSchema.properties,
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
      updateSchema: (formData, addrSchema, addressUiSchema, index, path) =>
        addressChangeSelector({
          formData,
          addrSchema,
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
