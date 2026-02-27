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
    didReceiveCredit: yesNoUI({
      title:
        'Did you receive credit for the enrolled hours being attempted at the time of the closure, withdrawal or suspension?',
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
      didReceiveCredit: yesNoSchema,
    },
    required: ['didReceiveCredit'],
  },
};
