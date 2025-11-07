// @ts-check
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name and date of birth'),
    firstName: textUI({
      title: 'First name',
    }),
    middleInitial: textUI({
      title: 'Middle initial',
    }),
    lastName: textUI({
      title: 'Last name',
    }),
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      firstName: textSchema,
      middleInitial: textSchema,
      lastName: textSchema,
      dateOfBirth: {
        ...dateOfBirthSchema,
        errorMessage: 'Enter your date of birth',
      },
    },
    required: ['firstName', 'lastName', 'dateOfBirth'],
  },
};
