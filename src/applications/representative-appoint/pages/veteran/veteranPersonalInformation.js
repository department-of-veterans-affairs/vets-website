import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran’s name and date of birth',
  path: 'veteran-personal-information',
  uiSchema: {
    ...titleUI(
      'Name and date of birth',
      'Use your legal name as it appears on your government documentation.',
    ),
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
