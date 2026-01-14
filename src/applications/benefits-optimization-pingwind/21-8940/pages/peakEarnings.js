import React from 'react';

import {
  textUI,
  numberUI,
  textSchema,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import yearUI from 'platform/forms-system/src/js/definitions/year';

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
    yearEarned: {
      ...yearUI,
      'ui:title': 'What year did you make your peak earnings?',
      'ui:description': <AdditionalInformation />,
    },
    occupation: textUI('Your job(s) during that year'),
  },
  schema: {
    type: 'object',
    properties: {
      maxYearlyEarnings: numberSchema,
      yearEarned: {
        type: 'integer',
        minimum: 1900,
      },
      occupation: textSchema,
    },
    required: ['maxYearlyEarnings', 'yearEarned', 'occupation'],
  },
};
