import {
  textUI,
  numberUI,
  textSchema,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { yearUI } from '../helpers/year';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Peak Earnings'),
    'ui:description': 'Your highest earnings',
    maxYearlyEarnings: numberUI({
      title: 'What is the most you ever earned in one year? (Gross Income)',
      hint: 'numeric characters only',
      errorMessages: {
        required:
          'Please enter the highest amount you earned before taxes in one year',
        pattern:
          'Please enter the highest amount you earned before taxes in one year',
      },
    }),
    yearEarned: yearUI({
      title: 'What year did you make your peak earnings?',
      hint: 'numeric characters only',
      errorMessage:
        'Please enter the 4-digit year you earned the most while working',
    }),
    occupation: textUI({
      title: 'Your job(s) during that year',
      errorMessages: {
        required: 'Enter the work you did the year you earned the most',
        pattern: 'Enter the work you did the year you earned the most',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      maxYearlyEarnings: numberSchema,
      yearEarned: {
        type: 'string',
        pattern: '^\\d{4}$',
      },
      occupation: textSchema,
    },
    required: ['maxYearlyEarnings', 'yearEarned', 'occupation'],
  },
};
