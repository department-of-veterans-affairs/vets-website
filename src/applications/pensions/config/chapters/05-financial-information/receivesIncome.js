import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Gross monthly income',
    receivesIncome: yesNoUI({
      title: 'Do you, your spouse, or your dependents receive income?',
      hint:
        'Your income is how much you earn. It includes your Social Security benefits, investment and retirement payments, and any income your spouse and dependents receive.',
      uswds: true,
    }),
  },
  schema: {
    type: 'object',
    required: ['receivesIncome'],
    properties: {
      receivesIncome: yesNoSchema,
    },
  },
};
