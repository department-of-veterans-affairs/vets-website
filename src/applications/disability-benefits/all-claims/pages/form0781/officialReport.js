import {
  checkboxGroupUI,
  checkboxGroupSchema,
  textUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import {
  officialReportPageTitle,
  officialReportsDescription,
  otherReportTypesExamples,
  validateReportSelections,
} from '../../content/officialReport';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import { arrayBuilderEventPageTitleUI } from '../../utils/form0781';
import {
  OFFICIAL_REPORT_TYPES_SUBTITLES,
  MILITARY_REPORT_TYPES,
  OTHER_REPORT_TYPES,
  NO_REPORT_TYPE,
  OFFICIAL_REPORT_TYPES_HINTS,
} from '../../constants';

const pageTitleWithTag = titleWithTag(
  officialReportPageTitle,
  form0781HeadingTag,
);

export const officialReportCustom = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      militaryReports: checkboxGroupSchema(Object.keys(MILITARY_REPORT_TYPES)),
      otherReports: checkboxGroupSchema(Object.keys(OTHER_REPORT_TYPES)),
      unlistedReport: {
        type: 'string',
      },
      noReport: checkboxGroupSchema(Object.keys(NO_REPORT_TYPE)),
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export const officialReport = {
  uiSchema: {
    'ui:title': arrayBuilderEventPageTitleUI({
      title: pageTitleWithTag,
      editTitle: 'official report details',
    }),
    'ui:description': officialReportsDescription(),
    otherReports: checkboxGroupUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.other,
      hint: OFFICIAL_REPORT_TYPES_HINTS.other,
      labelHeaderLevel: '4',
      labels: OTHER_REPORT_TYPES,
      required: false,
    }),
    unlistedReport: textUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.unlisted,
      description: otherReportTypesExamples,
    }),
    noReport: checkboxGroupUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.none,
      hint: OFFICIAL_REPORT_TYPES_HINTS.none,
      labelHeaderLevel: '4',
      labels: NO_REPORT_TYPE,
      required: false,
    }),
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
    'ui:validations': [validateReportSelections],
  },
  schema: {
    type: 'object',
    properties: {
      otherReports: checkboxGroupSchema(Object.keys(OTHER_REPORT_TYPES)),
      unlistedReport: {
        type: 'string',
      },
      noReport: checkboxGroupSchema(Object.keys(NO_REPORT_TYPE)),
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export const officialReportMst = {
  uiSchema: {
    'ui:title': arrayBuilderEventPageTitleUI({
      title: pageTitleWithTag,
      editTitle: 'official report details',
    }),
    'ui:description': officialReportsDescription('mst'),
    militaryReports: checkboxGroupUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.military,
      hint: OFFICIAL_REPORT_TYPES_HINTS.military,
      labelHeaderLevel: '4',
      labels: MILITARY_REPORT_TYPES,
      required: false,
    }),
    otherReports: checkboxGroupUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.other,
      hint: OFFICIAL_REPORT_TYPES_HINTS.other,
      labelHeaderLevel: '4',
      labels: OTHER_REPORT_TYPES,
      required: false,
    }),
    unlistedReport: textUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.unlisted,
      description: otherReportTypesExamples,
    }),
    noReport: checkboxGroupUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.none,
      hint: OFFICIAL_REPORT_TYPES_HINTS.none,
      labelHeaderLevel: '4',
      labels: NO_REPORT_TYPE,
      required: false,
    }),
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
    'ui:validations': [validateReportSelections],
  },
  schema: {
    type: 'object',
    properties: {
      militaryReports: checkboxGroupSchema(Object.keys(MILITARY_REPORT_TYPES)),
      otherReports: checkboxGroupSchema(Object.keys(OTHER_REPORT_TYPES)),
      unlistedReport: {
        type: 'string',
      },
      noReport: checkboxGroupSchema(Object.keys(NO_REPORT_TYPE)),
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
