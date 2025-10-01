/**
 * @module pages/name-and-date-of-birth
 * @description Page configuration for veteran name and date of birth
 */

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Page configuration for name and date of birth
 * @type {PageSchema}
 */
export const nameAndDateOfBirth = {
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

// Platform expects default export for pages
export default nameAndDateOfBirth;
