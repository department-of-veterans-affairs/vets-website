// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Withdrawal details'),
    withdrewPriorToClosing: yesNoUI({
      title: 'Did you withdraw from the school prior to closing?',
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
      withdrewPriorToClosing: yesNoSchema,
    },
    required: ['withdrewPriorToClosing'],
  },
};
