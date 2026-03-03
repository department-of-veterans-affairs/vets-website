// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('New school enrollment'),
    enrolledAtNewSchool: yesNoUI({
      title: 'Are you enrolled in a course of study at a new school?',
      errorMessages: {
        required: 'You must make a selection',
      },
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      enrolledAtNewSchool: yesNoSchema,
    },
    required: ['enrolledAtNewSchool'],
  },
};
