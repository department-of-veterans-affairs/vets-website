import React from 'react';
import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const Description = (
  <>
    <p>
      What date range does this income and asset information apply to? You don’t
      need to have exact dates.
    </p>
    <p className="vads-u-margin-bottom--0">
      <strong>Note:</strong> If you need to report information for multiple date
      ranges, submit a new form for each date range.
    </p>
  </>
);

/** @type {PageSchema} */
export default {
  title: 'Reporting period',
  path: 'claimant/reporting-period',
  depends: formData => {
    return !formData?.dateReceivedByVa;
  },
  uiSchema: {
    ...titleUI('Reporting period', Description),
    incomeNetWorthDateRange: currentOrPastDateRangeUI('Start date', 'End date'),
  },
  schema: {
    type: 'object',
    properties: {
      incomeNetWorthDateRange: currentOrPastDateRangeSchema,
    },
  },
};
