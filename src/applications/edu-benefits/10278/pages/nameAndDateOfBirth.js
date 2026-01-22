import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Name and date of birth'),
    fullName: {
      ...fullNameNoSuffixUI(),
    },
    dateOfBirth: {
      ...dateOfBirthUI({
        hint: 'For example: January 19, 2000',
        removeDateHint: true,
      }),
      'ui:errorMessages': {
        required: 'Enter a date of birth',
      },
    },
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
