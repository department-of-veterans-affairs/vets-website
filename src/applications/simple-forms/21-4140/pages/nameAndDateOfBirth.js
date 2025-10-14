// @ts-check
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixUI,
  firstNameLastNameNoMaxLengthSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name and date of birth'),
    fullName: fullNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: firstNameLastNameNoMaxLengthSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
