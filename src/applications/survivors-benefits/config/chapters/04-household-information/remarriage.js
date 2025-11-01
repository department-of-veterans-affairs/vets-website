import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Remarriage',
  path: 'household/remarriage',
  uiSchema: {
    ...titleUI('Remarriage'),
    remarried: yesNoUI({
      title: 'Have you remarried since the death of the Veteran?',
    }),
  },
  schema: {
    type: 'object',
    required: ['remarried'],
    properties: {
      remarried: yesNoSchema,
    },
  },
};
