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
    ...titleUI('Name and date of birth'),
    citizenFullName: fullNameUI(),
    citizenDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      citizenFullName: fullNameSchema,
      citizenDateOfBirth: dateOfBirthSchema,
    },
  },
};
