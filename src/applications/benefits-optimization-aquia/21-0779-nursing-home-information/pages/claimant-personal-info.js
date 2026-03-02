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

import { isValidNameLength } from '../../shared/utils/validators/validators';

const customVeteranNameUISchema = () => {
  const baseSchema = fullNameNoSuffixUI();
  return {
    ...baseSchema,
    first: {
      ...baseSchema.first,
      'ui:title': 'First or given name',
      'ui:validations': [
        ...baseSchema.first['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.claimantPersonalInfo?.claimantFullName?.first,
            12,
          );
        },
      ],
    },
    middle: {
      ...baseSchema.middle,
      'ui:title': 'Middle initial',
    },
    last: {
      ...baseSchema.last,
      'ui:title': 'Last or family name',
      'ui:validations': [
        ...baseSchema.last['ui:validations'],
        (errors = {}, _fieldData, formData) => {
          isValidNameLength(
            errors,
            formData?.claimantPersonalInfo?.claimantFullName?.last,
            18,
          );
        },
      ],
    },
  };
};

/**
 * uiSchema for Claimant Personal Info page
 * Collects patient name and date of birth when patient is spouse or parent
 */
export const claimantPersonalInfoUiSchema = {
  'ui:title': "Patient's name and date of birth",
  'ui:description': 'Tell us about the patient in the nursing home',
  claimantPersonalInfo: {
    claimantFullName: customVeteranNameUISchema(),
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
    },
    middle: {
      type: 'string',
      maxLength: 1,
    },
    last: {
      type: 'string',
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
