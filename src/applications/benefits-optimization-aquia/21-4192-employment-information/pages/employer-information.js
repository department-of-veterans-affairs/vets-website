/**
 * @module config/form/pages/employer-information
 * @description Standard form system configuration for Employer Information page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  textUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Employer Information page
 * Collects employer name and address information
 */
export const employerInformationUiSchema = {
  'ui:title': "Employer's name and address",
  employerInformation: {
    employerName: textUI({
      title: 'Name of employer',
      errorMessages: {
        required: 'Employer name is required',
        maxLength: 'Employer name must be less than 100 characters',
      },
    }),
    employerAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Employer is located on a U.S. military base outside of the United States.',
      },
    }),
  },
};

/**
 * JSON Schema for Employer Information page
 * Validates employer name and address fields
 */
export const employerInformationSchema = {
  type: 'object',
  required: ['employerInformation'],
  properties: {
    employerInformation: {
      type: 'object',
      required: ['employerName', 'employerAddress'],
      properties: {
        employerName: {
          type: 'string',
          maxLength: 100,
        },
        employerAddress: addressSchema(),
      },
    },
  },
};
