import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Name and date of birth',
  path: 'name-date-of-birth',
  uiSchema: {
    ...titleUI(
      'Name and date of birth',
      'Use your legal name as it appears on your government documentation.',
    ),
    fullName: {
      ...fullNameUI(),
      middle: {
        ...fullNameUI().middle,
        'ui:required': () => true,
        'ui:options': {
          hint: 'If you do not have a middle name, enter “N/A.”',
        },
      },
    },
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
