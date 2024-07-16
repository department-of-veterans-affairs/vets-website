import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  path: 'personal-information',
  uiSchema: {
    ...titleUI('Personal information'),
    fullName: fullNameUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['dateOfBirth'],
  },
};
