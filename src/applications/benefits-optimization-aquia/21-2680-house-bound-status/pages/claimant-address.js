/**
 * @module config/form/pages/claimant-address
 * @description Standard form system configuration for Claimant Address page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { getClaimantName } from '../utils/name-helpers';
/**
 * uiSchema for Claimant Address page
 * Collects claimant's mailing address
 */
export const claimantAddressUiSchema = {
  claimantAddress: {
    claimantAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Claimant lives on a United States military base outside of the U.S.',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const claimantName = getClaimantName(data, 'Claimant');

      return {
        'ui:title': `${claimantName}'s address`,
      };
    },
  },
};

/**
 * JSON Schema for Claimant Address page
 * Validates claimant address fields
 */
// Customize address schema to add maxLength constraints and default country
const customAddressSchema = {
  ...addressSchema(),
  properties: {
    ...addressSchema().properties,
    street: {
      type: 'string',
      maxLength: 30,
    },
    street2: {
      type: 'string',
      maxLength: 5,
    },
    country: {
      ...addressSchema().properties.country,
      default: 'USA',
    },
  },
};

export const claimantAddressSchema = {
  type: 'object',
  required: ['claimantAddress'],
  properties: {
    claimantAddress: {
      type: 'object',
      required: ['claimantAddress'],
      properties: {
        claimantAddress: customAddressSchema,
      },
    },
  },
};
