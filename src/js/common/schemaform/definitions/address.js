import _ from 'lodash/fp';
import { createSelector } from 'reselect';

import { countries, pciuCountries, states, statesOnlyInPCIU, isValidUSZipCode, isValidCanPostalCode, isValidSpecialCharacter } from '../../../../platform/forms/address';

function validatePostalCodes(errors, address) {
  let isValidPostalCode = true;

  // Checks if postal code is valid
  if (address.country === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidUSZipCode(address.postalCode);
  }
  if (address.country === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidCanPostalCode(address.postalCode);
  }

  // Add error message for postal code if it is invalid
  if (address.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}

export const stateRequiredCountries = new Set(['USA', 'CAN', 'MEX']);

function validateAddress(errors, address, formData, currentSchema) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (stateRequiredCountries.has(address.country)
    && address.state === undefined
    && currentSchema.required.length) {
    errors.state.addError('Please select a state or province');
  }

  const hasAddressInfo = stateRequiredCountries.has(address.country)
    && !currentSchema.required.length
    && typeof address.street !== 'undefined'
    && typeof address.city !== 'undefined'
    && typeof address.postalCode !== 'undefined';

  if (hasAddressInfo && typeof address.state === 'undefined') {
    errors.state.addError('Please enter a state or province, or remove other address information.');
  }

  validatePostalCodes(errors, address);
}

const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);
const militaryStates = states.USA
  .filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA')
  .map(state => state.value);
const militaryLabels = states.USA
  .filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA')
  .map(state => state.label);
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

const requiredFields = ['street', 'city', 'country', 'state', 'postalCode'];

/*
 * Create schema for addresses
 *
 * @param {object} schema - Schema for a full form, including address definition in definitions
 * @param {boolean} isRequired - If the address is required or not, defaults to false
 */
export function schema(currentSchema, isRequired = false) {
  const addressSchema = currentSchema.definitions.address || currentSchema.definitions.addressWithRequiredZip;
  return {
    type: 'object',
    required: isRequired ? requiredFields : [],
    properties: _.assign(addressSchema.properties, {
      country: {
        'default': 'USA',
        type: 'string',
        'enum': countryValues,
        enumNames: countryNames
      },
      state: {
        title: 'State',
        type: 'string',
        maxLength: 51
      },
      postalCode: {
        type: 'string',
        maxLength: 10
      }
    })
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
export function uiSchema(label = 'Address', useStreet3 = false, isRequired = null, ignoreRequired = false) {
  let fieldOrder = ['country', 'street', 'street2', 'street3', 'city', 'state', 'postalCode'];
  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }

  const addressChangeSelector = createSelector(
    ({ formData, path }) => _.get(path.concat('country'), formData),
    ({ formData, path }) => _.get(path.concat('city'), formData),
    _.get('addressSchema'),
    (currentCountry, city, addressSchema) => {
      const schemaUpdate = {
        properties: addressSchema.properties,
        required: addressSchema.required
      };
      const country = currentCountry || addressSchema.properties.country.default;
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
          const withEnum = _.set('state.enum', stateList, schemaUpdate.properties);
          schemaUpdate.properties = _.set('state.enumNames', labelList, withEnum);

          // all the countries with state lists require the state field, so add that if necessary
          if (!ignoreRequired && required && !addressSchema.required.some(field => field === 'state')) {
            schemaUpdate.required = addressSchema.required.concat('state');
          }
        }
      // We don’t have a state list for the current country, but there’s an enum in the schema
      // so we need to update it
      } else if (addressSchema.properties.state.enum) {
        const withoutEnum = _.unset('state.enum', schemaUpdate.properties);
        schemaUpdate.properties = _.unset('state.enumNames', withoutEnum);
        if (!ignoreRequired && required) {
          schemaUpdate.required = addressSchema.required.filter(field => field !== 'state');
        }
      }

      // Canada has a different title than others, so set that when necessary
      if (country === 'CAN' && addressSchema.properties.state.title !== 'Province') {
        schemaUpdate.properties = _.set('state.title', 'Province', schemaUpdate.properties);
      } else if (country !== 'CAN' && addressSchema.properties.state.title !== 'State') {
        schemaUpdate.properties = _.set('state.title', 'State', schemaUpdate.properties);
      }

      // We constrain the state list when someone picks a city that’s a military base
      if (country === 'USA' && isMilitaryCity(city) && schemaUpdate.properties.state.enum !== militaryStates) {
        const withEnum = _.set('state.enum', militaryStates, schemaUpdate.properties);
        schemaUpdate.properties = _.set('state.enumNames', militaryLabels, withEnum);
      }

      return schemaUpdate;
    }
  );

  return {
    'ui:title': label,
    'ui:validations': [
      validateAddress
    ],
    'ui:options': {
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) => {
        let currentSchema = addressSchema;
        if (isRequired) {
          const required = isRequired(formData, index);
          if (required && currentSchema.required.length === 0) {
            currentSchema = _.set('required', requiredFields, currentSchema);
          } else if (!required && currentSchema.required.length > 0) {
            currentSchema = _.set('required', [], currentSchema);
          }
        }
        return addressChangeSelector({
          formData,
          addressSchema: currentSchema,
          path
        });
      }
    },
    'ui:order': fieldOrder,
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
    state: {},
    postalCode: {
      'ui:title': 'Postal code',
      'ui:options': {
        widgetClassNames: 'usa-input-medium'
      }
    }
  };
}


// PCIU Validations

function validateSpecialCharacter(errors, string) {
  if (string && !isValidSpecialCharacter(string)) {
    errors.addError(
      "Please only use letters, numbers, and the special characters #%&'()+,./:@"
    );
  }
}

function validateZIP(errors, zip) {
  if (zip && !isValidUSZipCode(zip)) {
    errors.addError('Please enter a valid 5 or 9 digit ZIP (dashes allowed)');
  }
}

// PCIU helpers
function mergeUniques(first, second) {
  const result = [];
  let firstPointer = 0;
  let secondPointer = 0;

  while (result.length < (first.length + second.length)) {
    if (!second[secondPointer] || first[firstPointer] < second[secondPointer]) {
      result.push(first[firstPointer]);
      firstPointer++;
    } else {
      result.push(second[secondPointer]);
      secondPointer++;
    }
  }
  return result;
}

// PCIU states and countries
const pciuAllStates = mergeUniques(states.USA, statesOnlyInPCIU);
const pciuStates = pciuAllStates.map(state => state.value);
const pciuStateLabels = pciuAllStates.map(state => state.label);
const militaryPostOfficeTypeCodes = ['APO', 'DPO', 'FPO'];


// PCIU schemas
/*
 * Create uiSchema for PCIU addresses
 *
 * @param {string} addressName - Property name for the address
 * @param {string} title - Block label for the address
 */
export const pciuAddressUISchema = (addressName, title) => {

  function validateCity(errors, city, { veteran }) {
    const state = veteran[addressName]['view:state'];
    const isMilitaryState = militaryStates.includes(state);
    if (city && state && isMilitaryState && !isMilitaryCity(city)) {
      errors.addError(
        'Please enter APO, FPO, or DPO'
      );
    }
  }

  return {
    'ui:title': title,
    type: {
      'ui:options': {
        hideIf: () => true,
        updateSchema: (formData, typeSchema) => {
          /* eslint-disable no-param-reassign */
          const address = formData.veteran[addressName];
          const country = address.country;
          const state = address['view:state'];
          const city = address['view:city'];
          const isDomestic = country === 'USA';
          const isMilitary = militaryPostOfficeTypeCodes.includes(city) || militaryStates.includes(state);
          if (isDomestic) {
            formData.veteran[addressName].type = 'DOMESTIC';
          } else if (isMilitary) {
            formData.veteran[addressName].type = 'MILITARY';
          } else if (country) {
            formData.veteran[addressName].type = 'INTERNATIONAL';
          }
          return typeSchema;
          /* eslint-enable no-param-reassign */
        }
      }
    },
    country: {
      'ui:title': 'Country'
    },
    'view:state': {
      'ui:title': 'State',
      'ui:required': (formData) => {
        const address = formData.veteran[addressName];
        const isUSA = address.country === 'USA';
        const isMilitary = !!address.militaryPostOfficeTypeCode;
        return isUSA || isMilitary;
      },
      'ui:options': {
        labels: pciuStateLabels,
        updateSchema: (formData, stateSchema) => {
          /* eslint-disable no-param-reassign */
          const address = formData.veteran[addressName];
          const viewState = address['view:state'];
          const state = address.state;
          const militaryState = address.militaryState;
          if (militaryStates.includes(viewState)) {
            formData.veteran[addressName].militaryState = viewState;
            delete formData.veteran[addressName].state;
            delete formData.veteran[addressName].city;
          } else if (viewState) {
            formData.veteran[addressName].state = viewState;
            delete formData.veteran[addressName].militaryState;
            delete formData.veteran[addressName].militaryPostOfficeTypeCode;
          } else {
            formData.veteran[addressName]['view:state'] = (state || militaryState);
          }
          return stateSchema;
          /* eslint-enable no-param-reassign */
        }
      }
    },
    state: {
      'ui:options': {
        labels: pciuStateLabels,
        hideIf: () => true
      }
    },
    addressLine1: {
      'ui:title': 'Street',
      'ui:validations': [validateSpecialCharacter],
    },
    addressLine2: {
      'ui:title': 'Line 2',
      'ui:validations': [validateSpecialCharacter],
    },
    addressLine3: {
      'ui:title': 'Line 3',
      'ui:validations': [validateSpecialCharacter],
    },
    'view:city': {
      'ui:title': 'City or Military Post Office Type',
      'ui:validations': [validateSpecialCharacter, validateCity],
      'ui:options': {
        updateSchema: (formData, citySchema) => {
          /* eslint-disable no-param-reassign */
          const address = formData.veteran[addressName];
          const viewCity = address['view:city'];
          const city = address.city;
          const militaryPostOfficeType = address.militaryPostOfficeType;
          if (militaryPostOfficeTypeCodes.includes(viewCity)) {
            formData.veteran[addressName].militaryPostOfficeTypeCode = viewCity;
            delete formData.veteran[addressName].city;
          } else if (viewCity) {
            formData.veteran[addressName].city = viewCity;
            delete formData.veteran[addressName].militaryPostOfficeTypeCode;
            delete formData.veteran[addressName].militaryState;
          } else {
            formData.veteran[addressName]['view:city'] = (city || militaryPostOfficeType);
          }
          return citySchema;
          /* eslint-enable no-param-reassign */
        }
      }
    },
    city: {
      'ui:options': {
        hideIf: () => true
      }
    },
    militaryStateCode: {
      'ui:options': {
        hideIf: () => true
      }
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      }
    },
    militaryPostOfficeTypeCode: {
      'ui:title': 'Military Post Office Type Code',
      'ui:options': {
        hideIf: () => true
      }
    },
    'ui:options': {
      updateSchema: (formData, pciuAddressSchema) => {
        const newSchema = _.merge({}, pciuAddressSchema);
        const schemaProps = pciuAddressSchema.properties;
        const address = formData.veteran[addressName];
        const state = address['view:state'];
        const city = address['view:city'];
        const isMilitaryState = militaryStates.includes(state);
        const isUSA = address.country === 'USA';
        const hasMilitaryStateLabels = schemaProps['view:state'].enum === pciuStates;
        const hasMilitaryCityLabels = schemaProps['view:city'].enum === militaryPostOfficeTypeCodes;
        /* eslint-disable no-param-reassign */
        if (isUSA && isMilitaryState && !hasMilitaryCityLabels) {
          newSchema.properties['view:city'].enum = militaryPostOfficeTypeCodes;
        } else {
          delete newSchema.properties['view:city'].enum;
        }
        if (isUSA && isMilitaryCity(city) && !hasMilitaryStateLabels) {
          newSchema.properties['view:state'].enum = militaryStates;
          newSchema.properties['view:state'].enumNames = militaryLabels;
        } else {
          newSchema.properties['view:state'].enum = pciuStates;
          newSchema.properties['view:state'].enumNames = pciuStateLabels;
        }
        return newSchema;
        /* eslint-enable no-param-reassign */
      }
    }
  };
};


/*
 * Create schema for PCIU addresses
 *
 * @param {boolean} isRequired - If the address is required or not, defaults to false
 */
export const pciuAddressSchema = {
  type: 'object',
  required: ['country', 'addressLine1'],
  properties: {
    type: {
      type: 'string',
      'enum': ['MILITARY', 'DOMESTIC', 'INTERNATIONAL']
    },
    country: {
      type: 'string',
      'enum': pciuCountries
    },
    'view:state': {
      type: 'string',
      'enum': pciuStates,
      enumNames: pciuStateLabels
    },
    state: {
      type: 'string',
    },
    addressLine1: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
    },
    addressLine2: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
    },
    addressLine3: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
    },
    'view:city': {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.#]([a-zA-Z0-9-'.# ])?)+$"
    },
    city: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.#]([a-zA-Z0-9-'.# ])?)+$"
    },
    zipCode: {
      type: 'string'
    },
    militaryPostOfficeTypeCode: {
      type: 'string',
      'enum': ['APO', 'DPO', 'FPO']
    },
    militaryStateCode: {
      type: 'string',
      'enum': ['AA', 'AE', 'AP']
    }
  }
};
