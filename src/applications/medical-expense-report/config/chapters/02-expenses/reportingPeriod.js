import React from 'react';
import {
  titleUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Expense Types',
  path: 'applicant/expenses/reporting-period',
  uiSchema: {
    ...titleUI('Reporting period dates'),
    'ui:description': (
      <div>
        <p className="vads-u-margin-top--0">
          Add the specific date range for the medical expenses you paid. The
          date range you enter should be one of the following:
        </p>
        <ul>
          <li>
            A full calendar year (January 1 to December 31),{' '}
            <span className="vads-u-font-weight--bold">or</span>
          </li>
          <li>The specific date range in the letter you received</li>
        </ul>
        <p>
          <span className="vads-u-font-weight--bold">Note:</span> If you need to
          report expenses for a period longer than 1 year, you should fill out
          an additional VA Form 21P-8416.
        </p>
      </div>
    ),
    reportingPeriod: {
      ...currentOrPastDateRangeUI(
        {
          title: 'Start date',
          monthSelect: false,
        },
        {
          title: 'End date',
          monthSelect: false,
        },
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['reportingPeriod'],
    properties: {
      reportingPeriod: currentOrPastDateRangeSchema,
    },
  },
};
