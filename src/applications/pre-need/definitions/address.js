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
import environment from 'platform/utilities/environment';

let priorCountry = '';

function validatePostalCodes(errors, address) {
  let isValidPostalCode = true;

  // Checks if postal code is valid
  if (address.country === 'USA') {
    isValidPostalCode = isValidUSZipCode(address.postalCode);
  }
  if (address.country === 'CAN') {
    isValidPostalCode =
      isValidPostalCode && isValidCanPostalCode(address.postalCode);
  }

  // Add error message for postal code if it is invalid
  if (address.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }
}

function validateNotAllWhiteSpaces(
  errorsLocation,
  addressField,
  requiredArray,
  requiredField,
) {
  // Add error message for street if it is all blank spaces.
  if (
    requiredArray.includes(requiredField) &&
    addressField &&
    addressField.trim() === ''
  ) {
    errorsLocation.addError('Please provide a response');
  }
}

export const countriesWithStateCodes = new Set(['USA', 'CAN']);

function validateAddress(errors, address, formData, currentSchema) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada
  if (
    countriesWithStateCodes.has(address.country) &&
    address.state === undefined &&
    currentSchema.required.length
  ) {
    errors.state.addError('Please select a state or province');
  }

  validatePostalCodes(errors, address);
  if (currentSchema.required.length) {
    const requiredArray = currentSchema.required;
    validateNotAllWhiteSpaces(
      errors.street,
      address.street,
      requiredArray,
      'street',
    );
    validateNotAllWhiteSpaces(errors.city, address.city, requiredArray, 'city');
  }
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
  const addressSchema = currentSchema.definitions.address;
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
        maxLength: 3,
      },
      postalCode: {
        type: 'string',
        maxLength: 6,
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
            environment.isProduction()
          ) {
            schemaUpdate.required = addressSchema.required.concat('state');
          }
        }

        if (
          !ignoreRequired &&
          required &&
          !addressSchema.required.some(field => field === 'state') &&
          !environment.isProduction()
        ) {
          schemaUpdate.required = addressSchema.required.concat('state');
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
      } else if (!ignoreRequired && required) {
        schemaUpdate.required = addressSchema.required.filter(
          field => field !== 'state',
        );
      }

      // Canada has a different title than others, so set that when necessary
      if (
        country === 'CAN' &&
        addressSchema.properties.state.title !== 'Province'
      ) {
        schemaUpdate.properties = set(
          'state.title',
          'Province',
          schemaUpdate.properties,
        );
      } else if (
        country !== 'CAN' &&
        addressSchema.properties.state.title !== 'State'
      ) {
        schemaUpdate.properties = set(
          'state.title',
          'State',
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

  return {
    'ui:title': label,
    'ui:validations': [validateAddress],
    'ui:options': {
      useHeaderStyling: true,
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) => {
        let currentSchema = addressSchema;

        const modifiedData = { ...formData };

        if (modifiedData.application) {
          if (
            modifiedData.application.claimant &&
            modifiedData.application.claimant.address &&
            (modifiedData.application.claimant.address.country !== 'USA' ||
              modifiedData.application.claimant.address.country !== 'CAN') &&
            !modifiedData.application.claimant.address.state
          ) {
            modifiedData.application.claimant.address.state = '';
          }

          if (
            modifiedData.application.applicant &&
            modifiedData.application.applicant['view:applicantInfo'] &&
            modifiedData.application.applicant['view:applicantInfo']
              .mailingAddress &&
            (modifiedData.application.applicant['view:applicantInfo']
              .mailingAddress.country !== 'USA' ||
              modifiedData.application.applicant['view:applicantInfo']
                .mailingAddress.country !== 'CAN') &&
            !modifiedData.application.applicant['view:applicantInfo']
              .mailingAddress.state
          ) {
            modifiedData.application.applicant[
              'view:applicantInfo'
            ].mailingAddress.state = '';
          }

          // Veteran address state must be reset if prior country had a state list.
          if (modifiedData.application.veteran) {
            if (
              (priorCountry === 'CAN' &&
                modifiedData.application.veteran.address.country === 'USA') ||
              (priorCountry === 'USA' &&
                modifiedData.application.veteran.address.country === 'CAN')
            ) {
              modifiedData.application.veteran.address.state = undefined;
            }
            priorCountry = formData.application.veteran.address.country;
          }
        }

        if (isRequired) {
          const required = isRequired(formData, index);
          if (required && currentSchema.required.length === 0) {
            currentSchema = set('required', requiredFields, currentSchema);
          } else if (!required && currentSchema.required.length > 0) {
            currentSchema = set('required', [], currentSchema);
          }
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
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
    },
    street: {
      'ui:title': 'Street',
      'ui:autocomplete': 'address-line1',
    },
    street2: {
      'ui:title': 'Line 2',
      'ui:autocomplete': 'address-line2',
    },
    street3: {
      'ui:title': 'Line 3',
      'ui:autocomplete': 'address-line3',
    },
    city: {
      'ui:title': 'City',
      'ui:autocomplete': 'address-level2',
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
  };
}
