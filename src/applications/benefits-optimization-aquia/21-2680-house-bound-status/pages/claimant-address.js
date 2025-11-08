/**
 * @module config/form/pages/claimant-address
 * @description Standard form system configuration for Claimant Address page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant Address page
 * Collects claimant's mailing address
 */
export const claimantAddressUiSchema = {
  'ui:title': 'Claimant address',
  claimantAddress: {
    claimantAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Claimant lives on a United States military base outside of the U.S.',
      },
    }),
  },
};

/**
 * JSON Schema for Claimant Address page
 * Validates claimant address fields
 */
export const claimantAddressSchema = {
  type: 'object',
  required: ['claimantAddress'],
  properties: {
    claimantAddress: {
      type: 'object',
      required: ['claimantAddress'],
      properties: {
        claimantAddress: addressSchema(),
      },
    },
  },
};
