import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    remarriage: {
      hasTerminated: yesNoUI({
        title: 'Has your remarriage ended?',
        labelHeaderLevel: '3',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarriage: {
        type: 'object',
        required: ['hasTerminated'],
        properties: {
          hasTerminated: yesNoSchema,
        },
      },
    },
  },
};
