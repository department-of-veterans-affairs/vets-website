/**
 * @module config/form/pages/nursing-home-details
 * @description Standard form system configuration for Nursing Home Details page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  textUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Nursing Home Details page
 * Collects nursing home name and address information
 */
export const nursingHomeDetailsUiSchema = {
  'ui:title': 'Nursing home name and address',
  nursingHomeDetails: {
    nursingHomeName: textUI({
      title: 'Name of nursing home where you work',
    }),
    nursingHomeAddress: addressUI({
      omit: ['isMilitary', 'street3'],
    }),
  },
};

/**
 * JSON Schema for Nursing Home Details page
 * Validates nursing home name and address
 */
const addressSchemaWithDefault = addressSchema({
  omit: ['isMilitary', 'street3'],
});

// Set default country to USA
addressSchemaWithDefault.properties.country.default = 'USA';

export const nursingHomeDetailsSchema = {
  type: 'object',
  required: ['nursingHomeDetails'],
  properties: {
    nursingHomeDetails: {
      type: 'object',
      required: ['nursingHomeName', 'nursingHomeAddress'],
      properties: {
        nursingHomeName: {
          type: 'string',
          maxLength: 100,
        },
        nursingHomeAddress: addressSchemaWithDefault,
      },
    },
  },
};
