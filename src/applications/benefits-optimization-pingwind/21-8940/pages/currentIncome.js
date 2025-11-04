import {
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Current Income',
    'ui:description': 'Your current earnings',
    totalIncome: numberUI({
      title:
        'Indicate your total earned income for the past 12 months (gross income)',
      hint: 'Numeric characters only',
      setTouchedOnBlur: false,
    }),
    monthlyIncome: numberUI({
      title:
        'If you are currently employed, indicate your current monthly earned income (gross income)',
      hint: 'Numeric characters only',
      setTouchedOnBlur: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      totalIncome: numberSchema,
      monthlyIncome: numberSchema,
    },
    required: ['totalIncome', 'monthlyIncome'],
  },
};
