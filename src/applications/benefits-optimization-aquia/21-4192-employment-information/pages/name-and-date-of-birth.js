/**
 * @module pages/name-and-date-of-birth
 * @description Page configuration for veteran's name and date of birth
 */

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Page schema for collecting veteran's full name and date of birth
 * @typedef {Object} PageSchema
 * @property {Object} uiSchema - UI configuration for form fields
 * @property {Object} schema - JSON schema for data validation
 */

/**
 * Name and date of birth page configuration
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
      fullName: fullNameNoSuffixSchema(),
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
