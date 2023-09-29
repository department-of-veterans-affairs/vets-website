import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Name and date of birth'),
    preparerFullName: fullNameNoSuffixUI(),
    preparerDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      preparerFullName: fullNameNoSuffixSchema,
      preparerDateOfBirth: dateOfBirthSchema,
    },
    required: ['preparerFullName'],
  },
};
