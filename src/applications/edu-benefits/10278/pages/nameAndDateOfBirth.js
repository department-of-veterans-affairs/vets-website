import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    fullName: {
      ...fullNameNoSuffixUI(),
      'ui:options': {},
    },
    dateOfBirth: {
      ...dateOfBirthUI({
        hint: 'For example, January 19, 2000',
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
