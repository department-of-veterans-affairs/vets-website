import React from 'react';

import {
  textUI,
  numberUI,
  textSchema,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { yearUI } from '../helpers/year';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Peak Earnings
      </h3>
    ),
    'ui:description': 'Your highest earnings',
    maxYearlyEarnings: numberUI({
      title: 'What is the most you ever earned in one year? (Gross Income)',
      hint: 'numeric characters only',
    }),
    yearEarned: yearUI({
      title: 'What year did you make your peak earnings?',
      hint: 'numeric characters only',
    }),
    occupation: textUI('Your job(s) during that year'),
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
