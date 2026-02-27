// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Enrollment and credit information'),
    wasEnrolledWhenSchoolClosed: yesNoUI({
      title:
        'Were you still enrolled in the program of study when the school closed was disapproved or suspended your program?',
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
      wasEnrolledWhenSchoolClosed: yesNoSchema,
    },
    required: ['wasEnrolledWhenSchoolClosed'],
  },
};
