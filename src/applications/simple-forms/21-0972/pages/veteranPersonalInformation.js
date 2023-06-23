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
    rjsf: titleUI(
      '',
      'Next we’ll ask you about the Veteran connected to the {claimant} you are certifying for.',
    ),
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['veteranDateOfBirth'],
  },
};
