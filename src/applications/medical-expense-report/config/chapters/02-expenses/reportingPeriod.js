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
    ...titleUI('Reporting Period'),
    reportingPeriod: currentOrPastDateRangeUI('Start date', 'End date'),
  },
  schema: {
    type: 'object',
    required: ['reportingPeriod'],
    properties: {
      reportingPeriod: currentOrPastDateRangeSchema,
    },
  },
};
