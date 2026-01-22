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
    claimantPersonalInformation: {
      fullName: fullNameNoSuffixUI(),
      dateOfBirth: dateOfBirthUI({
        hint: 'For example: January 19, 2000',
        removeDateHint: true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantPersonalInformation: {
        type: 'object',
        properties: {
          fullName: fullNameNoSuffixSchema,
          dateOfBirth: dateOfBirthSchema,
        },
        required: ['fullName', 'dateOfBirth'],
      },
    },
    required: ['claimantPersonalInformation'],
  },
};
