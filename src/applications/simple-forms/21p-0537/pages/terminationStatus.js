import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const hasTerminatedUI = yesNoUI({
  title: 'Has your remarriage been terminated?',
  hint: 'If "Yes," please provide the date and reason for termination',
});

export default {
  uiSchema: {
    ...titleUI('Has your remarriage ended?'),
    remarriage: {
      hasTerminated: hasTerminatedUI,
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
