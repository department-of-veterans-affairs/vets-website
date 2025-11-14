/**
 * @module config/form/pages/veteran-information
 * @description Standard form system configuration for Veteran Information page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Veteran Information page
 * Collects veteran's full name and date of birth
 */
export const veteranInformationUiSchema = {
  'ui:title': 'Veteran information',
  'ui:description':
    'Confirm the personal information we have on file for the Veteran.',
  veteranInformation: {
    veteranFullName: fullNameNoSuffixUI(),
    veteranDob: dateOfBirthUI(),
  },
};

/**
 * JSON Schema for Veteran Information page
 * Validates veteran name and date of birth
 */
// Customize the name schema to add maxLength constraint for middle name
const customVeteranNameSchema = {
  ...fullNameNoSuffixSchema,
  properties: {
    ...fullNameNoSuffixSchema.properties,
    middle: {
      type: 'string',
      maxLength: 1,
    },
  },
};

export const veteranInformationSchema = {
  type: 'object',
  required: ['veteranInformation'],
  properties: {
    veteranInformation: {
      type: 'object',
      required: ['veteranFullName', 'veteranDob'],
      properties: {
        veteranFullName: customVeteranNameSchema,
        veteranDob: dateOfBirthSchema,
      },
    },
  },
};
