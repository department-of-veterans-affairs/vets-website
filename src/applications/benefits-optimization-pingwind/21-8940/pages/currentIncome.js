import React from 'react';

import {
  numberUI,
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
        Current Income
      </h3>
    ),
    'ui:description': 'Your current earnings',
    totalIncome: numberUI({
      title:
        'Indicate your total earned income for the past 12 months (gross income)',
      description: <AdditionalInformation />,
      setTouchedOnBlur: false,
    }),
    monthlyIncome: numberUI({
      title:
        'If you are currently employed, indicate your current monthly earned income (gross income)',
      description: <AdditionalInformation />,
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
