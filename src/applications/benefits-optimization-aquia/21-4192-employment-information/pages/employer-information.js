/**
 * @module config/form/pages/employer-information
 * @description Standard form system configuration for Employer Information page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  textUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
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
      hint: 'The business name of the employer.',
      errorMessages: {
        required: 'Employer name is required',
        maxLength: 'Employer name must be less than 100 characters',
      },
    }),
    employerAddress: addressNoMilitaryUI(),
  },
};

const baseAddressSchema = addressNoMilitarySchema({ omit: ['street3'] });

const customAddressSchema = {
  ...baseAddressSchema,
  properties: {
    ...baseAddressSchema.properties,
    street: {
      type: 'string',
      maxLength: 30,
    },
    street2: {
      type: 'string',
      maxLength: 30,
    },
    city: {
      type: 'string',
      maxLength: 18,
    },
    state: {
      type: 'string',
      maxLength: 2,
    },
    postalCode: {
      type: 'string',
      maxLength: 9,
    },
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
        employerAddress: customAddressSchema,
      },
    },
  },
};
