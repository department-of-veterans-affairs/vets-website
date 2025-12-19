// import React from 'react';
// import merge from 'lodash/merge';
// import omit from 'platform/utilities/data/omit';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

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
//   validateMilitaryCity,
//   validateMilitaryState,
//   validateZIP,
// } from '../validations';

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

// const countryEnum = fullSchema.definitions.country.enum;
// const citySchema = fullSchema.definitions.address.properties.city;

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
    },
  );
  // let { city, state } = formData.mailingAddress;
  // const onMilitaryBase = getMilitaryValue(formData);
  // if (getMilitaryValue(oldFormData) !== onMilitaryBase) {
  //   if (onMilitaryBase) {
  //     savedAddress.city = oldFormData.mailingAddress.city || '';
  //     savedAddress.state = oldFormData.mailingAddress.state || '';
  //     city = '';
  //     state = '';
  //   } else {
  //     city = MILITARY_CITIES.includes(oldFormData.mailingAddress.city)
  //       ? savedAddress.city
  //       : city || savedAddress.city;
  //     state = MILITARY_STATE_VALUES.includes(oldFormData.mailingAddress.state)
  //       ? savedAddress.state
  //       : state || savedAddress.state;
  //   }
  // }
  // return {
  //   ...formData,
  //   mailingAddress: {
  //     ...formData.mailingAddress,
  //     city,
  //     state,
  //   },
  // };
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
  mailingAddress: addressUI({
    newSchemaKeys: {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
    },
  }),
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelpDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress: addressSchema({
      newSchemaKeys: {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
      },
    }),
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
