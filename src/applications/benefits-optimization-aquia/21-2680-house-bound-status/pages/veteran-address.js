/**
 * @module config/form/pages/veteran-address
 * @description Standard form system configuration for Veteran Address page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Veteran Address page
 * Collects veteran's mailing address
 */
export const veteranAddressUiSchema = {
  'ui:title': 'Veteran address',
  veteranAddress: {
    veteranAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Veteran lives on a United States military base outside of the U.S.',
        street2: 'Apt./Unit Number',
      },
    }),
  },
};

/**
 * JSON Schema for Veteran Address page
 * Validates veteran address fields
 */
// Customize address schema to add maxLength constraints
const customVeteranAddressSchema = {
  ...addressSchema(),
  properties: {
    ...addressSchema({
      omit: ['street3'],
    }).properties,
    street: {
      type: 'string',
      maxLength: 30,
    },
    street2: {
      type: 'string',
      maxLength: 5,
    },
  },
};

export const veteranAddressSchema = {
  type: 'object',
  required: ['veteranAddress'],
  properties: {
    veteranAddress: {
      type: 'object',
      required: ['veteranAddress'],
      properties: {
        veteranAddress: customVeteranAddressSchema,
      },
    },
  },
};
