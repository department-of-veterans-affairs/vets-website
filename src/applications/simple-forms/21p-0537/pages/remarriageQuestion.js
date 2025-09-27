import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const hasRemarriedUI = yesNoUI();
hasRemarriedUI['ui:title'] =
  'Have you remarried since the death of the veteran?';
hasRemarriedUI['ui:description'] =
  'If you answer "No", you can skip to the certification section';

export default {
  uiSchema: {
    ...titleUI('Have you remarried?'),
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
