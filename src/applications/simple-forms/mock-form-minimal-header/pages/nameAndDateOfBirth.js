import {
  fullNameSchema,
  fullNameUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Name and date of birth',
      headerLevel: 1,
      headerStyleLevel: 3,
    }),
    fullName: fullNameUI(),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      dateOfBirth: dateOfBirthSchema,
    },
  },
};
