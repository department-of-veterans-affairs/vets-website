import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const hasTerminatedUI = yesNoUI({
  title: 'Has your remarriage ended?',
  hint: 'If "Yes," please provide the date and reason',
});

export default {
  uiSchema: {
    hideFormTitle: true,
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
