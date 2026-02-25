import {
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Current Income'),
    'ui:description': 'Your current earnings',
    totalIncome: numberUI({
      title:
        'Indicate your total earned income for the past 12 months (gross income)',
      hint: 'Numeric characters only',
      setTouchedOnBlur: false,
      errorMessages: {
        pattern: 'Please enter a valid number. Use only numeric characters.',
        required:
          'Tell us how much you earned in the last year. Enter whole numbers only.',
      },
    }),
    monthlyIncome: numberUI({
      title:
        'If you are currently employed, indicate your current monthly earned income (gross income). If you are not currently working, enter “0”',
      hint: 'Numeric characters only',
      setTouchedOnBlur: false,
      errorMessages: {
        pattern:
          'Please enter a valid number. Use only numeric characters, you may enter “0” if you are not currently working',
        required:
          'Tell us how much you’re currently earning per month. Enter whole numbers. If you’re not working, enter the number 0.',
      },
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
