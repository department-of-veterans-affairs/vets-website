import React from 'react';

import {
  textUI,
  numberUI,
  textSchema,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const AdditionalInformation = () => (
  <va-additional-info trigger="Additional Information" uswds>
    <p>Numeric characters only</p>
  </va-additional-info>
);

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
      description: <AdditionalInformation />,
    }),
    yearEarned: numberUI({
      title: 'What year did you make your peak earnings?',
      description: <AdditionalInformation />,
    }),
    occupation: textUI('Your job(s) during that year'),
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
