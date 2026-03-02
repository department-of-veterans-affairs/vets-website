// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Teach out program details'),
    isUsingTeachoutAgreement: yesNoUI({
      title:
        'Are you completing your program of study at a new school through a teach-out agreement with the closed or disapproved school?',
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
      isUsingTeachoutAgreement: yesNoSchema,
    },
    required: ['isUsingTeachoutAgreement'],
  },
};
