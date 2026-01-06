// import React from 'react';
// import merge from 'lodash/merge';
// import omit from 'platform/utilities/data/omit';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import constants from 'vets-json-schema/dist/constants.json';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';

import {
  addressUI,
  addressSchema,
  updateFormDataAddress,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import {
  contactInfoDescription,
  contactInfoUpdateHelpDescription,
  phoneEmailViewField,
} from '../content/contactInformation';

// import { addressUISchema } from '../utils/schemas';

import {
  // ADDRESS_PATHS,
  // USA,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  MILITARY_CITIES,
  // FORM_PROFILE_STATES,
} from '../constants';

import {
  //   // validateMilitaryCity,
  //   // validateMilitaryState,
  validateZIP,
} from '../validations';
// import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const {
  // forwardingAddress,
  phoneAndEmail,
} = fullSchema.properties;

// Create custom country names that display 'USA' instead of 'United States'
const COUNTRY_VALUES = constants.countries.map(country => country.value);
const COUNTRY_NAMES = constants.countries.map(
  country => (country.value === 'USA' ? 'USA' : country.label),
);

// const mailingAddress = merge(
//   {
//     properties: {
//       'view:livesOnMilitaryBase': {
//         type: 'boolean',
//       },
//       'view:livesOnMilitaryBaseInfo': {
//         type: 'object',
//         properties: {},
//       },
//     },
//   },
//   fullSchema.definitions.address,
// );
// const MILITARY_STATES = [
//   {
//     label:
//       'AA (Armed Forces America) - North and South America, excluding Canada',
//     value: 'AA',
//   },
//   {
//     label:
//       'AE (Armed Forces Europe) - Africa, Canada, Europe, and the Middle East',
//     value: 'AE',
//   },
//   {
//     label: 'AP (Armed Forces Pacific) - Pacific',
//     value: 'AP',
//   },
// ];

// const MILITARY_STATE_VALUES = MILITARY_STATES.map(state => state.value);
// const MILITARY_STATE_NAMES = MILITARY_STATES.map(state => state.label);
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

const FILTERED_STATE_VALUES = filteredStates.map(state => state.value);
const FILTERED_STATE_LABELS = filteredStates.map(state => state.label);

// const countryEnum = fullSchema.definitions.country.enum;
// const citySchema = fullSchema.definitions.address.properties.city;
// const COUNTRY_VALUES = constants.countries.map(country => country.value);
// const COUNTRY_LABELS = constants.countries.map(country => country.label);

// /**
//  * Return state of mailing address military base checkbox
//  * @param {object} data - Complete form data
//  * @returns {boolean} - military base checkbox state
//  */
// const getMilitaryValue = data =>
//   data.mailingAddress?.['view:livesOnMilitaryBase'];

// // Temporary storage for city & state if military base checkbox is toggled more
// // than once
// const savedAddress = {
//   city: '',
//   state: '',
// };

/**
 * Update form data to remove selected military city & state and restore any
 * previously set city & state when the "I live on a U.S. military base"
 * checkbox is unchecked. See va.gov-team/issues/42216 for details
 * @param {object} oldFormData - Form data prior to interaction change
 * @param {object} formData - Form data after interaction change
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormData = (oldFormData, formData) => {
  return updateFormDataAddress(
    oldFormData,
    formData,
    ['mailingAddress'],
    null,
    {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
      isMilitary: 'view:livesOnMilitaryBase',
    },
  );
};

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  phoneAndEmail: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    primaryPhone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  mailingAddress: {
    ...addressUI({
      keys: {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
        isMilitary: 'view:livesOnMilitaryBase',
      },
    }),
    // Override country field to display 'USA' instead of 'United States'
    country: {
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'Select a country',
      },
      'ui:required': formData => {
        const addressData = formData.mailingAddress || {};
        return !addressData['view:livesOnMilitaryBase'];
      },
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        updateSchema: (formData, schema, _uiSchema) => {
          const countryUI = _uiSchema;
          const addressFormData = formData.mailingAddress || {};
          const isMilitary = addressFormData['view:livesOnMilitaryBase'];

          if (isMilitary) {
            countryUI['ui:options'].inert = true;
            addressFormData.country = 'USA';
            return {
              enum: ['USA'],
              enumNames: ['USA'],
              default: 'USA',
            };
          }
          countryUI['ui:options'].inert = false;
          return {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          };
        },
      },
    },
    state: {
      'ui:title': 'State',
      'ui:autocomplete': 'address-level1',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'Select a state',
      },
      'ui:options': {
        hideIf: formData =>
          !formData.mailingAddress?.['view:livesOnMilitaryBase'] &&
          formData.mailingAddress.country !== 'USA',
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        updateSchema: (formData, schema, _uiSchema) => {
          const ui = _uiSchema;
          // console.log('formData in state updateSchema:', formData);
          if (
            formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
            MILITARY_CITIES.includes(formData.mailingAddress.city)
          ) {
            ui['ui:webComponentField'] = VaRadioField;
            ui['ui:errorMessages'] = {
              enum: 'Select a military state',
            };
            return {
              //  type: 'string',
              // title: 'State',
              enum: MILITARY_STATE_VALUES,
              enumNames: MILITARY_STATE_LABELS,
            };
          }
          ui['ui:webComponentField'] = VaSelectField;
          ui['ui:errorMessages'] = {
            required: 'Select a state',
          };
          return {
            enum: FILTERED_STATE_VALUES,
            enumNames: FILTERED_STATE_LABELS,
          };
        },
      },
      'ui:required': formData =>
        formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
        formData.mailingAddress.country === 'USA',
    },
    zipCode: {
      // is there a way to get this from addressUI?
      // ...addressUI().postalCode,
      'ui:title': 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:webComponentField': VaTextInputField,
      'ui:required': formData => formData.mailingAddress.country === 'USA',
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        widgetClassNames: 'usa-input-medium',
        hideIf: formData => formData.mailingAddress.country !== 'USA',
      },
    },
    addressLine1: {
      ...addressUI().street,
      'ui:validations': [
        (errors, value) => {
          if (value) {
            const maxLength = 20;
            if (value.length > maxLength) {
              errors.addError(
                `Address line 1 must be ${maxLength} characters or less`,
              );
            }
          }
        },
      ],
    },
    addressLine2: {
      ...addressUI().street2,
      'ui:validations': [
        (errors, value) => {
          if (value) {
            const maxLength = 20;
            if (value.length > maxLength) {
              errors.addError(
                `Address line 2 must be ${maxLength} characters or less`,
              );
            }
          }
        },
      ],
    },
    addressLine3: {
      ...addressUI().street3,
      'ui:validations': [
        (errors, value) => {
          if (value) {
            const maxLength = 20;
            if (value.length > maxLength) {
              errors.addError(
                `Address line 3 must be ${maxLength} characters or less`,
              );
            }
          }
        },
      ],
    },
  },
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelpDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress: addressSchema({
      keys: {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
        isMilitary: 'view:livesOnMilitaryBase',
      },
    }),
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
