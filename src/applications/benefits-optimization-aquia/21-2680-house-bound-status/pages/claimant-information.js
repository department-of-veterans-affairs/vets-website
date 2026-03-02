/**
 * @module config/form/pages/claimant-information
 * @description Standard form system configuration for Claimant Information page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const relationshipLabels = {
  veteran: 'Your',
  spouse: "Veteran's spouse's",
  child: "Veteran's child's",
  parent: "Veteran's parent's",
};

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
 * uiSchema for Claimant Information page
 * Collects claimant's full name and date of birth
 */
export const claimantInformationUiSchema = {
  claimantInformation: {
    claimantFullName: {
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
    claimantDob: dateOfBirthUI(),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const relationship = data?.claimantRelationship?.relationship;
      const title = `${relationshipLabels[relationship] ||
        'Claimant'} name and date of birth`;

      return {
        'ui:title': title,
      };
    },
  },
};

/**
 * JSON Schema for Claimant Information page
 * Validates claimant identification fields
 */
// Customize the name schema to add maxLength constraint for middle name
const customNameSchema = {
  ...fullNameNoSuffixSchema,
  properties: {
    ...fullNameNoSuffixSchema.properties,
    first: {
      type: 'string',
      maxLength: 12,
    },
    middle: {
      type: 'string',
      maxLength: 1,
    },
    last: {
      type: 'string',
      maxLength: 18,
    },
  },
};

export const claimantInformationSchema = {
  type: 'object',
  required: ['claimantInformation'],
  properties: {
    claimantInformation: {
      type: 'object',
      required: ['claimantFullName', 'claimantDob'],
      properties: {
        claimantFullName: customNameSchema,
        claimantDob: dateOfBirthSchema,
      },
    },
  },
};
