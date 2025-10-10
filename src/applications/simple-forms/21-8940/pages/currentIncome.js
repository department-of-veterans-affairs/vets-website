// @ts-check
import {
  currencyUI,
  currencySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Current income'),
    grossIncomeLastTwelveMonths: currencyUI({
      title: 'What was your gross income over the past 12 months?',
      hint:
        'Gross income is your total earnings (including benefits) before taxes or other deductions.',
      labelHeaderLevel: '2',
      errorMessages: {
        required: 'Enter your total earned income for the past 12 months',
      },
    }),
    currentMonthlyGrossIncome: currencyUI({
      title:
        "If you’re currently employed, what's your usual monthly gross income?",
      labelHeaderLevel: '2',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      grossIncomeLastTwelveMonths: currencySchema,
      currentMonthlyGrossIncome: currencySchema,
    },
    required: ['grossIncomeLastTwelveMonths'],
  },
};
