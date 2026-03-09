import * as address from 'platform/forms/definitions/address';
import get from 'platform/utilities/data/get';
import constants from 'vets-json-schema/dist/constants.json';
import { isValidUSZipCode, isValidCanPostalCode } from 'platform/forms/address';

import { isOnlyWhitespace } from '../helpers';

const stateRequiredCountries = new Set(['USA', 'CAN', 'MEX']);
const MILITARY_STATE_CODES = ['AE', 'AA', 'AP'];

const MILITARY_ZIP_HINTS = {
  AE: 'Must start with 09',
  AA: 'Must start with 340',
  AP: 'Must be in range 962xx\u2013966xx',
};

function validateMilitaryZipCode(errors, addressData) {
  if (
    !MILITARY_STATE_CODES.includes(addressData.state) ||
    !addressData.postalCode
  ) {
    return;
  }

  const { state, postalCode } = addressData;
  const isValidMilitaryZip =
    (state === 'AA' && /^340\d*/.test(postalCode)) ||
    (state === 'AE' && /^09[0-9]\d*/.test(postalCode)) ||
    (state === 'AP' && /^96[2-6]\d*/.test(postalCode));

  if (!isValidMilitaryZip) {
    const hint = MILITARY_ZIP_HINTS[state];
    errors.postalCode.addError(
      `Please enter a valid zip code for ${state}. ${hint}`,
    );
  }
}

export function customValidateAddress(
  errors,
  addressData,
  formData,
  currentSchema,
) {
  if (
    stateRequiredCountries.has(addressData.country) &&
    addressData.state === undefined &&
    currentSchema.required.length
  ) {
    errors.state.addError('Please select a state');
  }
  let isValidPostalCode = true;
  if (addressData.country === 'USA') {
    isValidPostalCode = isValidUSZipCode(addressData.postalCode);
  }
  if (addressData.country === 'CAN') {
    isValidPostalCode = isValidCanPostalCode(addressData.postalCode);
  }

  if (addressData.postalCode && !isValidPostalCode) {
    errors.postalCode.addError('Please provide a valid postal code');
  }

  validateMilitaryZipCode(errors, addressData);
}

/**
 * Generates the address field uiSchema for a given data path.
 *
 * @param {string} dataPath - The form data path to the address container
 *   (e.g., 'view:mailingAddress' or 'guardianMailingAddress')
 * @param {Object} [options]
 * @param {Object} [options.streetErrors] - Custom error messages for street field
 * @param {string} [options.street2ValidationMsg] - Custom whitespace validation message for street2
 * @param {string} [options.streetValidationMsg] - Custom whitespace validation message for street
 * @param {string} [options.cityValidationMsg] - Custom whitespace validation message for city
 * @param {Object} [options.cityConstraints] - Extra schema constraints for non-military city (e.g., { minLength: 2, maxLength: 20 })
 * @param {Object} [options.postalCodeErrors] - Custom error messages for postalCode
 * @param {Object} [options.foreignPostalSchema] - Schema for non-USA postal code (e.g., { pattern, minLength, maxLength })
 * @returns {Object} Address field uiSchema
 */
export function createAddressFieldsUI(dataPath, options = {}) {
  const {
    streetErrors = { required: 'Please enter your full street address' },
    streetValidationMsg = 'Please enter your full street address',
    street2ValidationMsg = "Address line 2 can't be only spaces",
    cityErrors = { required: 'Please enter a valid city' },
    cityValidationMsg = 'Please enter a valid city',
    cityConstraints = {},
    postalCodeErrors = { required: 'Zip code must be 5 digits' },
    foreignPostalSchema = null,
  } = options;

  // Helper to resolve livesOnMilitaryBase from the data path
  const getMilitaryBase = formData =>
    get([dataPath, 'livesOnMilitaryBase'], formData);
  const getCountry = formData =>
    get([dataPath, 'address', 'country'], formData) || 'USA';

  return {
    ...address.uiSchema('', false, null, true),
    'ui:validations': [customValidateAddress],
    'ui:options': {
      updateSchema: (formData, addressSchema) => {
        const livesOnMilitaryBase = getMilitaryBase(formData);
        const country = getCountry(formData);

        const required = (addressSchema.required || []).filter(
          field => field !== 'state',
        );

        if (livesOnMilitaryBase || ['USA', 'CAN', 'MEX'].includes(country)) {
          required.push('state');
        }

        if (livesOnMilitaryBase) {
          return {
            ...addressSchema,
            required,
            properties: {
              ...addressSchema.properties,
              state: {
                type: 'string',
                title: 'AE/AA/AP',
                enum: ['AE', 'AA', 'AP'],
                enumNames: [
                  'AE - APO/DPO/FPO',
                  'AA - APO/DPO/FPO',
                  'AP - APO/DPO/FPO',
                ],
              },
            },
          };
        }

        let stateSchema = {
          type: 'string',
          title: 'State/County/Province',
        };

        if (country === 'USA') {
          stateSchema = {
            type: 'string',
            title: 'State',
            enum: constants.states.USA.map(state => state.value),
            enumNames: constants.states.USA.map(state => state.label),
          };
        } else if (country === 'CAN') {
          stateSchema = {
            ...stateSchema,
            title: 'Province',
            enum: constants.states.CAN.map(state => state.value),
            enumNames: constants.states.CAN.map(state => state.label),
          };
        } else if (country === 'MEX') {
          stateSchema = {
            ...stateSchema,
            title: 'State',
            enum: constants.states.MEX.map(state => state.value),
            enumNames: constants.states.MEX.map(state => state.label),
          };
        }

        return {
          ...addressSchema,
          required,
          properties: {
            ...addressSchema.properties,
            state: stateSchema,
          },
        };
      },
    },
    country: {
      'ui:title': 'Country',
      'ui:required': formData => !getMilitaryBase(formData),
      'ui:disabled': formData => !!getMilitaryBase(formData),
      'ui:options': {
        updateSchema: (formData, schema, uiSchema) => {
          const countryUI = uiSchema;
          const addressFormData = get([dataPath, 'address'], formData);
          const livesOnMilitaryBase = getMilitaryBase(formData);

          if (livesOnMilitaryBase) {
            countryUI['ui:disabled'] = true;
            const USA = { value: 'USA', label: 'United States' };
            addressFormData.country = USA.value;
            return {
              enum: [USA.value],
              enumNames: [USA.label],
              default: USA.value,
            };
          }

          countryUI['ui:disabled'] = false;
          return {
            type: 'string',
            enum: constants.countries.map(c => c.value),
            enumNames: constants.countries.map(c => c.label),
          };
        },
      },
    },
    street: {
      'ui:title': 'Street address',
      'ui:errorMessages': streetErrors,
      'ui:validations': [
        (errors, field) => {
          if (isOnlyWhitespace(field)) {
            errors.addError(streetValidationMsg);
          }
        },
      ],
    },
    street2: {
      'ui:title': 'Street address line 2',
      'ui:validations': [
        (errors, field) => {
          if (isOnlyWhitespace(field)) {
            errors.addError(street2ValidationMsg);
          }
        },
      ],
      'ui:options': {
        updateSchema: (_formData, schema) => ({
          ...schema,
          minLength: 0,
        }),
      },
    },
    city: {
      'ui:errorMessages': cityErrors,
      'ui:validations': [
        (errors, field) => {
          if (isOnlyWhitespace(field)) {
            errors.addError(cityValidationMsg);
          }
        },
      ],
      'ui:options': {
        replaceSchema: formData => {
          const livesOnBase = getMilitaryBase(formData);

          if (livesOnBase) {
            return {
              type: 'string',
              title: 'APO/DPO/FPO',
              enum: ['APO', 'DPO', 'FPO'],
            };
          }

          return {
            type: 'string',
            title: 'City',
            ...cityConstraints,
          };
        },
      },
    },
    state: {
      'ui:validations': [
        (errors, field) => {
          if (field?.length === 1) {
            errors.addError('Must be more than 1 character');
          } else if (field?.length > 31) {
            errors.addError('Must be less than 31 characters');
          }
        },
      ],
    },
    postalCode: {
      'ui:errorMessages': postalCodeErrors,
      ...(foreignPostalSchema
        ? {
            'ui:validations': [
              (errors, field) => {
                if (isOnlyWhitespace(field)) {
                  errors.addError('You must provide a response');
                }
              },
            ],
          }
        : {}),
      'ui:options': {
        replaceSchema: (formData, _currentSchema, postalCodeUI) => {
          const livesOnBase = getMilitaryBase(formData);

          if (livesOnBase) {
            const state = get([dataPath, 'address', 'state'], formData);
            const hint = MILITARY_ZIP_HINTS[state];
            // eslint-disable-next-line no-param-reassign
            postalCodeUI['ui:errorMessages'] = {
              required: hint
                ? `Please enter a valid zip code for ${state}. ${hint}`
                : 'Please enter a military zip code',
            };
            return {
              title: 'Zip code',
              type: 'string',
            };
          }

          // Reset to default error messages for non-military addresses
          // eslint-disable-next-line no-param-reassign
          postalCodeUI['ui:errorMessages'] = postalCodeErrors;

          if (getCountry(formData) !== 'USA') {
            return {
              title: 'Postal code',
              type: 'string',
              ...(foreignPostalSchema || {}),
            };
          }

          return {
            title: 'Zip code',
            type: 'string',
          };
        },
      },
    },
  };
}
