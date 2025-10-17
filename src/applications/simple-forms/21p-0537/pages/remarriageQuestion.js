import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    hasRemarried: yesNoUI({
      title: 'Have you remarried since the death of the Veteran?',
      labelHeaderLevel: '3',
    }),
  },
  schema: {
    type: 'object',
    required: ['hasRemarried'],
    properties: {
      hasRemarried: yesNoSchema,
    },
  },
};
