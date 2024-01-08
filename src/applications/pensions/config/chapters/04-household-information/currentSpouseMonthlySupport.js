import currencyUI from 'platform/forms-system/src/js/definitions/currency';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Financial support for your spouse',
    currentSpouseMonthlySupport: currencyUI(
      'How much do you contribute each month to your spouse’s support?',
    ),
  },
  schema: {
    type: 'object',
    required: ['currentSpouseMonthlySupport'],
    properties: {
      currentSpouseMonthlySupport: { type: 'number' },
    },
  },
};
