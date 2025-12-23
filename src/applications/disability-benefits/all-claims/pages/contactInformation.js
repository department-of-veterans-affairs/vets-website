// import React from 'react';
// import merge from 'lodash/merge';
// import omit from 'platform/utilities/data/omit';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
// import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
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

// import {
//   ADDRESS_PATHS,
//   USA,
//   MILITARY_STATE_LABELS,
//   MILITARY_STATE_VALUES,
//   MILITARY_CITIES,
//   STATE_LABELS,
//   STATE_VALUES,
// } from '../constants';

// import {
//   // validateMilitaryCity,
//   // validateMilitaryState,
//   validateZIP,
// } from '../validations';
// import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const {
  // forwardingAddress,
  phoneAndEmail,
} = fullSchema.properties;

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
const MILITARY_STATES = [
  {
    label:
      'AA (Armed Forces America) - North and South America, excluding Canada',
    value: 'AA',
  },
  {
    label:
      'AE (Armed Forces Europe) - Africa, Canada, Europe, and the Middle East',
    value: 'AE',
  },
  {
    label: 'AP (Armed Forces Pacific) - Pacific',
    value: 'AP',
  },
];

const MILITARY_STATE_VALUES = MILITARY_STATES.map(state => state.value);
const MILITARY_STATE_NAMES = MILITARY_STATES.map(state => state.label);
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);

const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

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
    state: {
      'ui:title': 'State',
      'ui:autocomplete': 'address-level1',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'Select a state',
      },
      'ui:options': {
        // TODO this hideIf logic is not working
        hideIf: formData => {
          const addressData = formData.mailingAddress || {};
          const isMilitary = addressData['view:livesOnMilitaryBase'];
          const { country } = addressData;

          return !isMilitary && country !== 'USA';
        },
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        replaceSchema: (formData, schema, _uiSchema) => {
          const addressData = formData.mailingAddress || {};
          const isMilitary = addressData['view:livesOnMilitaryBase'];
          const ui = _uiSchema;

          if (isMilitary) {
            ui['ui:webComponentField'] = VaRadioField;
            ui['ui:errorMessages'] = {
              required: 'Select a military state',
            };
            return {
              type: 'string',
              title: 'State',
              enum: MILITARY_STATE_VALUES,
              enumNames: MILITARY_STATE_NAMES,
            };
          }

          ui['ui:webComponentField'] = VaSelectField;
          ui['ui:errorMessages'] = {
            required: 'Select a state',
          };
          return {
            type: 'string',
            title: 'State',
            enum: STATE_VALUES, // You'll need to add US state values
            enumNames: STATE_NAMES, // You'll need to add US state names
          };
        },
      },
      'ui:required': formData =>
        formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
        formData.mailingAddress.country === ('USA' || 'United States'),
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
