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
  claimantAddress: {
    claimantAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Claimant lives on a United States military base outside of the U.S.',
        street2: 'Apt./Unit Number',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const firstName =
        data?.claimantInformation?.claimantFullName?.first || '';
      const lastName = data?.claimantInformation?.claimantFullName?.last || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const title = fullName ? `${fullName}'s address` : "Claimant's address";

      return {
        'ui:title': title,
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
    city: {
      type: 'string',
      maxLength: 18,
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
