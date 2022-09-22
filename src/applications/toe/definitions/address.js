import { createSelector } from 'reselect';
import {
  countries,
  isValidUSZipCode,
  isValidCanPostalCode,
} from 'platform/forms/address';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';

// States with Military State Overrides
import { states } from '../constants/address';

function validatePostalCodes(errors, address) {
  if (address.country === 'USA' && !isValidUSZipCode(address.postalCode)) {
    errors.postalCode.addError('Please enter a valid zip code');
  }
  if (address.country === 'CAN' && !isValidCanPostalCode(address.postalCode)) {
    errors.postalCode.addError('Please enter a valid postal code');
  }
}

function validateAddress(errors, address, formData, currentSchema) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (
    ['USA', 'MEX'].includes(address.country) &&
    address.state === undefined &&
    currentSchema.required.length
  ) {
    errors.state.addError('Please select a state');
  }
  if (
    address.country === 'CAN' &&
    address.state === undefined &&
    currentSchema.required.length
  ) {
    errors.state.addError('Please select a province');
  }

  //   const hasAddressInfo =
  //     stateRequiredCountries.has(address.country) &&
  //     !currentSchema.required.length &&
  //     typeof address.street !== 'undefined' &&
  //     typeof address.city !== 'undefined' &&
  //     typeof address.postalCode !== 'undefined';

  //   if (hasAddressInfo && typeof address.state === 'undefined') {
  //     errors.state.addError(
  //       'Please enter a state or province, or remove other address information.',
  //     );
  //   }

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

const militaryCityCodes = ['APO', 'FPO', 'DPO'];
function isMilitaryCity(city = '') {
  return militaryCityCodes.includes(city.trim().toUpperCase());
}

const requiredFields = ['street', 'city', 'country', 'state', 'postalCode'];

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
    required: isRequired ? requiredFields : [],
    properties: {
      ...addressSchema.properties,
      country: {
        default: 'USA',
        type: 'string',
        enum: countryValues,
        enumNames: countryNames,
      },
      state: {
        title: 'State',
        type: 'string',
        maxLength: 51,
      },
      postalCode: {
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
  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }

  const addressChangeSelector = createSelector(
    ({ formData, path }) => get(path.concat('country'), formData),
    ({ formData, path }) => get(path.concat('city'), formData),
    ({ addressSchema }) => addressSchema,
    ({ livesOnMilitaryBase }) => livesOnMilitaryBase,

    (currentCountry, city, addressSchema, livesOnMilitaryBase) => {
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
            !addressSchema.required.some(field => field === 'state')
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

      const stateTitleUSA = 'State';
      const stateTitleCAN = 'Province';
      const stateTitleInternational = 'State/Province/Region';
      // Canada has a different title than others, so set that when necessary
      if (
        country === 'CAN' &&
        addressSchema.properties.state.title !== stateTitleCAN
      ) {
        schemaUpdate.properties = set(
          'state.title',
          stateTitleCAN,
          schemaUpdate.properties,
        );
      } else if (
        country === 'USA' &&
        addressSchema.properties.state.title !== stateTitleUSA
      ) {
        schemaUpdate.properties = set(
          'state.title',
          stateTitleUSA,
          schemaUpdate.properties,
        );
      } else if (
        !['USA', 'CAN'].includes(country) &&
        addressSchema.properties.state.title !== stateTitleInternational
      ) {
        schemaUpdate.properties = set(
          'state.title',
          stateTitleInternational,
          schemaUpdate.properties,
        );
      }

      // We constrain the state list when someone picks a city that’s a military base
      if (
        ((country === 'USA' && isMilitaryCity(city)) || livesOnMilitaryBase) &&
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
        schemaUpdate.properties = set(
          'state.title',
          'AA/AE/AP',
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
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) => {
        let currentSchema = addressSchema;
        if (isRequired) {
          const required = isRequired(formData, index);
          if (required && currentSchema.required.length === 0) {
            currentSchema = set('required', requiredFields, currentSchema);
          } else if (!required && currentSchema.required.length > 0) {
            currentSchema = set('required', [], currentSchema);
          }
        }

        const livesOnMilitaryBasePath = [...path];
        livesOnMilitaryBasePath.splice(-1, 1, 'livesOnMilitaryBase');
        const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);

        return addressChangeSelector({
          formData,
          addressSchema: currentSchema,
          path,
          livesOnMilitaryBase,
        });
      },
    },
    'ui:order': fieldOrder,
    country: {
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
    },
    street: {
      'ui:title': 'Street',
      'ui:autocomplete': 'address-line1',
      'ui:errorMessages': {
        required: 'Please enter a street address',
      },
    },
    street2: {
      'ui:title': 'Street address line 2',
      'ui:autocomplete': 'address-line2',
    },
    street3: {
      'ui:title': 'Street address line 3',
      'ui:autocomplete': 'address-line3',
    },
    city: {
      'ui:title': 'City',
      'ui:autocomplete': 'address-level2',
      'ui:errorMessages': {
        required: 'Please enter a city',
      },
    },
    state: {
      'ui:errorMessages': {
        required: 'Please enter a state',
        'ui:autocomplete': 'address-level1',
      },
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
    },
  };
}
