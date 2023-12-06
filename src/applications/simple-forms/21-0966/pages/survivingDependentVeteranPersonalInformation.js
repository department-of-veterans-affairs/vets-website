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
    ...titleUI(
      'Veteran’s name and date of birth',
      'Tell us about the Veteran who you are connected to.',
    ),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['veteranFullName', 'veteranDateOfBirth'],
  },
};
