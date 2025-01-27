// TODO: additional structure will be added in ticket #97080
import {
  checkboxGroupUI,
  checkboxGroupSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  officialReportPageTitle,
  officialReportsDescription,
  reportTypesQuestion,
  otherReportTypesQuestion,
  otherReportTypesExamples,
} from '../../content/officialReport';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import { OFFICIAL_REPORT_TYPES } from '../../constants';

export const uiSchema = index => ({
  'ui:title': titleWithTag(officialReportPageTitle, form0781HeadingTag),
  'ui:description': officialReportsDescription,
  [`event${index}`]: {
    reports: checkboxGroupUI({
      title: reportTypesQuestion,
      labels: OFFICIAL_REPORT_TYPES,
      required: false,
    }),
    otherReports: textUI({
      title: otherReportTypesQuestion,
      description: otherReportTypesExamples,
    }),
  },
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`event${index}`]: {
      type: 'object',
      properties: {
        reports: checkboxGroupSchema(Object.keys(OFFICIAL_REPORT_TYPES)),
        otherReports: {
          type: 'string',
        },
      },
    },
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
});
