import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const hasRemarriedUI = yesNoUI();
hasRemarriedUI['ui:title'] =
  'Have you remarried since the death of the veteran?';

export default {
  uiSchema: {
    hideFormTitle: true,
    hasRemarried: hasRemarriedUI,
  },
  schema: {
    type: 'object',
    required: ['hasRemarried'],
    properties: {
      hasRemarried: yesNoSchema,
    },
  },
};
