/**
 * @module pages/nameAndDateOfBirth
 * @description Standard form system configuration for Name and Date of Birth page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

// @ts-check
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Page configuration for Name and Date of Birth
 * Collects claimant full name (no suffix) and date of birth
 * @type {PageSchema}
 */
export default {
  uiSchema: {
    ...titleUI('Name and date of birth'),
    fullName: fullNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
