/**
 * @module config/form/pages/claimant-personal-info
 * @description Standard form system configuration for Claimant Personal Info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant Personal Info page
 * Collects patient name and date of birth when patient is spouse or parent
 */
export const claimantPersonalInfoUiSchema = {
  'ui:title': "Patient's name and date of birth",
  'ui:description': 'Tell us about the patient in the nursing home',
  claimantPersonalInfo: {
    claimantFullName: {
      ...fullNameNoSuffixUI(),
      middle: {
        ...fullNameNoSuffixUI().middle,
        'ui:title': 'Middle initial',
      },
    },
    claimantDateOfBirth: dateOfBirthUI(),
  },
};

/**
 * JSON Schema for Claimant Personal Info page
 * Validates patient name and date of birth
 */
const fullNameSchemaWithMiddleInitial = {
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

export const claimantPersonalInfoSchema = {
  type: 'object',
  required: ['claimantPersonalInfo'],
  properties: {
    claimantPersonalInfo: {
      type: 'object',
      required: ['claimantFullName', 'claimantDateOfBirth'],
      properties: {
        claimantFullName: fullNameSchemaWithMiddleInitial,
        claimantDateOfBirth: dateOfBirthSchema,
      },
    },
  },
};
