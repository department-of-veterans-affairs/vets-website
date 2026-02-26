// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Program information'),
    didCompleteProgramOfStudy: yesNoUI({
      title:
        'Did you complete a program of study at the closed, or disapproved school?',
      errorMessages: {
        required:
          'Select ‘yes’ if you completed a program of study at the closed or disapproved school',
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
      didCompleteProgramOfStudy: yesNoSchema,
    },
    required: ['didCompleteProgramOfStudy'],
  },
};
