import {
  titleUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ReportingPeriodDescription from '../../../components/ReportingPeriodDescription';

/** @type {PageSchema} */
export default {
  title: 'Expense Types',
  path: 'applicant/expenses/reporting-period',
  uiSchema: {
    ...titleUI('Reporting Period'),
    'ui:description': ReportingPeriodDescription,
    reportingPeriod: currentOrPastDateRangeUI(
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
  schema: {
    type: 'object',
    required: ['reportingPeriod'],
    properties: {
      reportingPeriod: currentOrPastDateRangeSchema,
    },
  },
};
