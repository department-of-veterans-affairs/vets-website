import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';
import { createSelector } from 'reselect';

import {
  countries,
  states,
  isValidUSZipCode,
  isValidCanPostalCode,
} from 'platform/forms/address';

import {
  canadaStateTitle,
  cityErrorMessage,
  cityTitle,
  countryErrorMessage,
  countryTitle,
  postalCodeErrorMessage,
  postalCodeTitle,
  stateErrorMessage,
  stateOrProvinceErrorMessage,
  stateOrProvinceMissingErrorMessage,
  stateTitle,
  streetErrorMessage,
  streetThreeTitle,
  streetTwoTitle,
  zipCodePatternErrorMessage,
  zipCodeRequiredErrorMessage,
  zipCodeTitle,
} from '../../../constants/labels';

function validatePostalCodes(errors, address) {
  let isValidPostalCode = true;

  // Checks if postal code is valid
  if (address.country === 'USA') {
    isValidPostalCode =
      isValidPostalCode && isValidUSZipCode(address.postalCode);
  }
  if (address.country === 'CAN') {
    isValidPostalCode =
      isValidPostalCode && isValidCanPostalCode(address.postalCode);
  }

  // Add error message for postal code if it is invalid
  if (address.postalCode && !isValidPostalCode) {
    const errorMessage =
      address.country === 'USA'
        ? zipCodePatternErrorMessage
        : postalCodeErrorMessage;
    errors.postalCode.addError(errorMessage);
  }
}

export const stateRequiredCountries = new Set(['USA', 'CAN']);

const countryLabels = [
  'Belize',
  'Botswana',
  'Cameroon',
  'Central African Republic',
  'Chad',
  'Gambia',
  'Grenada',
  'Hong Kong',
  'Ireland',
  'Mauritania',
  'Netherlands Antilles',
  'Qatar',
  'Seychelles',
  'Syrian Arab Republic',
  'Tanzania',
  'Tonga',
  'Yemen',
  'Zimbabwe',
];

const targetValues = countries.map(country => {
  if (countryLabels.includes(country.label)) {
    return country.value;
  }
  return '';
});

const postalCodeNotRequiredCountries = new Set(targetValues);

function validateAddress(errors, address, formData, currentSchema) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA or Canada
  if (
    stateRequiredCountries.has(address.country) &&
    address.state === undefined &&
    currentSchema.required.includes('state')
  ) {
    errors.state.addError(stateOrProvinceErrorMessage);
  }

  const hasAddressInfo =
    stateRequiredCountries.has(address.country) &&
    !currentSchema.required.length &&
    typeof address.street !== 'undefined' &&
    typeof address.city !== 'undefined' &&
    typeof address.postalCode !== 'undefined';

  if (hasAddressInfo && typeof address.state === 'undefined') {
    errors.state.addError(stateOrProvinceMissingErrorMessage);
  }

  validatePostalCodes(errors, address);
}

const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);
const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);
const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);
const usaStates = states.USA.map(state => state.value);
const usaLabels = states.USA.map(state => state.label);
const canProvinces = states.CAN.map(state => state.value);
const canLabels = states.CAN.map(state => state.label);
const mexStates = states.MEX.map(state => state.value);
const mexLabels = states.MEX.map(state => state.label);

function isMilitaryCity(city = '') {
  const lowerCity = city.toLowerCase().trim();

  return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
}

const requiredFields = ['street', 'city', 'country'];

/*
 * Create schema for addresses
 *
 * @param {object} schema - Schema for a full form, including address definition in definitions
 * @param {boolean} isRequired - If the address is required or not, defaults to false
 * @param {string} addressProperty - The name of the address definition to use from the common
 *   definitions in currentSchema
 */
export function schema(
  currentSchema,
  isRequired = false,
  addressProperty = 'address',
) {
  const addressSchema = currentSchema.definitions[addressProperty];
  return {
    type: 'object',
    required: isRequired ? requiredFields : ['country'],
    properties: {
      ...addressSchema.properties,
      country: {
        default: 'USA',
        type: 'string',
        enum: countryValues,
        enumNames: countryNames,
      },
      state: {
        title: stateTitle,
        type: 'string',
        maxLength: 51,
      },
      postalCode: {
        title: postalCodeTitle,
        type: 'string',
        maxLength: 10,
      },
    },
  };
}

/*
 * Create uiSchema for addresses
 *
 * @param {string} label - Block label for the address
 * @param {boolean} useStreet3 - Show a third line in the address
 * @param {function} isRequired - A function for conditionally setting if an address is required.
 *   Receives formData and an index (if in an array item)
 * @param {boolean} ignoreRequired - Ignore the required fields array, to avoid overwriting form specific
 *   customizations
 */
export function uiSchema(
  label = 'Address',
  useStreet2 = true,
  useStreet3 = false,
  isRequired = null,
  ignoreRequired = false,
) {
  let fieldOrder = [
    'country',
    'street',
    'street2',
    'street3',
    'city',
    'state',
    'postalCode',
  ];
  if (!useStreet2) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }
  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }

  const addressChangeSelector = createSelector(
    ({ formData, path }) => get(path.concat('country'), formData),
    ({ formData, path }) => get(path.concat('city'), formData),
    ({ addressSchema }) => addressSchema,
    (currentCountry, city, addressSchema) => {
      const schemaUpdate = {
        properties: addressSchema.properties,
        required: addressSchema.required,
      };
      const country =
        currentCountry || addressSchema.properties.country.default;
      const required = addressSchema.required.length > 0;

      let stateList;
      let labelList;
      if (country === 'USA') {
        stateList = usaStates;
        labelList = usaLabels;
      } else if (country === 'CAN') {
        stateList = canProvinces;
        labelList = canLabels;
      } else if (country === 'MEX') {
        stateList = mexStates;
        labelList = mexLabels;
      }

      if (stateList) {
        // We have a list and it’s different, so we need to make schema updates
        if (addressSchema.properties.state.enum !== stateList) {
          const withEnum = set(
            'state.enum',
            stateList,
            schemaUpdate.properties,
          );
          schemaUpdate.properties = set('state.enumNames', labelList, withEnum);

          // all the countries with state lists require the state field, so add that if necessary
          if (
            !ignoreRequired &&
            required &&
            !addressSchema.required.some(field => field === 'state') &&
            country !== 'MEX'
          ) {
            schemaUpdate.required = addressSchema.required.concat('state');
          }
        }
        // We don’t have a state list for the current country, but there’s an enum in the schema
        // so we need to update it
      } else if (addressSchema.properties.state.enum) {
        const withoutEnum = unset('state.enum', schemaUpdate.properties);
        schemaUpdate.properties = unset('state.enumNames', withoutEnum);
        if (!ignoreRequired && required) {
          schemaUpdate.required = addressSchema.required.filter(
            field => field !== 'state',
          );
        }
      }

      // Canada has a different title than others, so set that when necessary
      if (
        country === 'CAN' &&
        addressSchema.properties.state.title !== canadaStateTitle
      ) {
        schemaUpdate.properties = set(
          'state.title',
          canadaStateTitle,
          schemaUpdate.properties,
        );
      } else if (
        country !== 'CAN' &&
        addressSchema.properties.state.title !== stateTitle
      ) {
        schemaUpdate.properties = set(
          'state.title',
          stateTitle,
          schemaUpdate.properties,
        );
      }

      if (
        country === 'USA' &&
        addressSchema.properties.postalCode.title !== zipCodeTitle
      ) {
        schemaUpdate.properties = set(
          'postalCode.title',
          zipCodeTitle,
          schemaUpdate.properties,
        );
      } else if (
        country !== 'USA' &&
        addressSchema.properties.postalCode.title !== postalCodeTitle
      ) {
        schemaUpdate.properties = set(
          'postalCode.title',
          postalCodeTitle,
          schemaUpdate.properties,
        );
      }

      // We constrain the state list when someone picks a city that’s a military base
      if (
        country === 'USA' &&
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
      }

      return schemaUpdate;
    },
  );

  function postalCodeRequired(formData) {
    return !postalCodeNotRequiredCountries.has(formData.address.country);
  }

  function stateRequired(formData) {
    return stateRequiredCountries.has(formData.address.country);
  }

  function setRequiredFields(required, currentSchema, formData) {
    const addressFields = [];
    if (required) {
      requiredFields.forEach(field => {
        addressFields.push(field);
      });
      if (postalCodeRequired(formData)) {
        addressFields.push('postalCode');
      }
      if (stateRequired(formData)) {
        addressFields.push('state');
      }
    } else if (!required) {
      addressFields.push('country');
    }
    return set('required', addressFields, currentSchema);
  }

  return {
    'ui:title': label,
    'ui:validations': [validateAddress],
    'ui:options': {
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) => {
        let currentSchema = addressSchema;
        if (isRequired) {
          const required = isRequired(formData, index);
          currentSchema = setRequiredFields(required, currentSchema, formData);
        }
        return addressChangeSelector({
          formData,
          addressSchema: currentSchema,
          path,
        });
      },
    },
    'ui:order': fieldOrder,
    country: {
      'ui:title': countryTitle,
      'ui:errorMessages': {
        required: countryErrorMessage,
      },
    },
    street: {
      'ui:title': 'Street address',
      'ui:errorMessages': {
        required: streetErrorMessage,
      },
    },
    street2: {
      'ui:title': streetTwoTitle,
    },
    street3: {
      'ui:title': streetThreeTitle,
    },
    city: {
      'ui:title': cityTitle,
      'ui:errorMessages': {
        required: cityErrorMessage,
      },
    },
    state: {
      'ui:errorMessages': {
        required: stateErrorMessage,
      },
    },
    postalCode: {
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:errorMessages': {
        required: zipCodeRequiredErrorMessage,
        pattern: zipCodePatternErrorMessage,
      },
    },
  };
}
