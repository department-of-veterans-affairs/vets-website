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
import { arrayBuilderEventPageTitleUI } from '../../utils/form0781';
import { OFFICIAL_REPORT_TYPES } from '../../constants';

export default {
  uiSchema: {
    ...arrayBuilderEventPageTitleUI({
      title: titleWithTag(officialReportPageTitle, form0781HeadingTag),
      editTitle: 'official report details',
    }),
    'ui:description': officialReportsDescription,
    reports: checkboxGroupUI({
      title: reportTypesQuestion,
      labels: OFFICIAL_REPORT_TYPES,
      required: false,
    }),
    otherReports: textUI({
      title: otherReportTypesQuestion,
      description: otherReportTypesExamples,
    }),
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  },
  schema: {
    type: 'object',
    properties: {
      reports: checkboxGroupSchema(Object.keys(OFFICIAL_REPORT_TYPES)),
      otherReports: {
        type: 'string',
      },
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
