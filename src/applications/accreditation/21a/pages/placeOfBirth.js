import {
  fullNameSchema,
  fullNameUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('Name and date of birth'),
    fullName: fullNameUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      fullName: fullNameSchema,
      dateOfBirth: dateOfBirthSchema,
    },
  },
};
