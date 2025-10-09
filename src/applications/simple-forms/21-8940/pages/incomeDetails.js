// @ts-check
import {
  currencySchema,
  currencyUI,
  numberSchema,
  numberUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Income details',
      'Now we’ll ask you about your income history. Provide your gross income, which is all the money you earned for the year before taxes. If you can’t remember the exact amount, you can give an estimate.',
    ),
    mostEverEarned: currencyUI({
      title: 'What’s the most money you ever earned in a single year?',
      labelHeaderLevel: '2',
      errorMessages: {
        required: 'Enter the most you ever earned in one year',
      },
    }),
    yearOfMostIncome: numberUI({
      title: 'What year did you earn the most income you’ve earned in a year?',
      labelHeaderLevel: '2',
      errorMessages: {
        required:
          'Enter the year you earned the most income you’ve earned in a year',
      },
    }),
    jobDuringMostIncome: textUI({
      title: 'What was your job during that year?',
      labelHeaderLevel: '2',
      errorMessages: {
        required: 'Enter your job during that year',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      mostEverEarned: currencySchema,
      yearOfMostIncome: {
        ...numberSchema,
        minimum: 1900,
        maximum: new Date().getFullYear(),
      },
      jobDuringMostIncome: textSchema,
    },
    required: ['mostEverEarned', 'yearOfMostIncome', 'jobDuringMostIncome'],
  },
};
