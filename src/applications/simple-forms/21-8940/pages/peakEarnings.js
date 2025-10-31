import {
  textUI,
  numberUI,
  textSchema,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Peak Earnings',
    'ui:description': 'Your highest earnings',
    maxYearlyEarnings: numberUI(
      'What is the most you ever earned in one year?',
    ),
    yearEarned: numberUI('What year?'),
    occupation: textUI('Occupation during that year?'),
  },
  schema: {
    type: 'object',
    properties: {
      maxYearlyEarnings: numberSchema,
      yearEarned: numberSchema,
      occupation: textSchema,
    },
    required: ['maxYearlyEarnings', 'yearEarned', 'occupation'],
  },
};
