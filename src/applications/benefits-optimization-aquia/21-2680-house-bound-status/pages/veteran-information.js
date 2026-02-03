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

const formatFullNameTitles = name => {
  switch (name) {
    case 'first or given name':
      return 'First or given name';
    case 'middle name':
      return 'Middle initial';
    case 'last or family name':
      return 'Last or family name';
    default:
      return name;
  }
};

// Generate base name UI configuration
const baseNameUI = fullNameNoSuffixUI(formatFullNameTitles);

/**
 * uiSchema for Veteran Information page
 * Collects veteran's full name and date of birth
 */
export const veteranInformationUiSchema = {
  'ui:title': 'Veteran information',
  'ui:description':
    'Confirm the personal information we have on file for the Veteran.',
  veteranInformation: {
    veteranFullName: {
      ...baseNameUI,
      first: {
        ...baseNameUI.first,
        'ui:options': {
          ...baseNameUI.first['ui:options'],
          hint:
            'Maximum 12 characters. If your name is longer, enter the first 12 characters only.',
        },
      },
      last: {
        ...baseNameUI.last,
        'ui:options': {
          ...baseNameUI.last['ui:options'],
          hint:
            'Maximum 18 characters. If your name is longer, enter the first 18 characters only.',
        },
      },
    },
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
    first: {
      ...fullNameNoSuffixSchema.properties.first,
      maxLength: 12,
    },
    middle: {
      type: 'string',
      maxLength: 1,
    },
    last: {
      ...fullNameNoSuffixSchema.properties.last,
      maxLength: 18,
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
