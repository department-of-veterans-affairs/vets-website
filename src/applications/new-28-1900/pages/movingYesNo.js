import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    movingYesNo: yesNoUI({
      title: 'Moving',
      description: 'Are you moving in the next 30 days?',
      labelHeaderLevel: '3',
      errorMessages: {
        required: 'Select yes or no',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      movingYesNo: yesNoSchema,
    },
    required: ['movingYesNo'],
  },
};
