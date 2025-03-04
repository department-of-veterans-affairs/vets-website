import React from 'react';
import {
  checkboxGroupUI,
  checkboxGroupSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  officialReportPageTitle,
  officialReportsDescription,
  reportTypesQuestion,
  reportTypesHint,
  otherReportTypesQuestion,
  otherReportTypesExamples,
  validateReportSelections,
  // reportTypeValidationError,
  // showConflictingAlert,
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
} from '../../constants';

const pageTitleWithTag = titleWithTag(
  officialReportPageTitle,
  form0781HeadingTag,
);

export const officialReport = {
  uiSchema: {
    ...arrayBuilderEventPageTitleUI({
      title: pageTitleWithTag,
      editTitle: 'official report details',
    }),
    'ui:description': officialReportsDescription(),
    // 'view:conflictingResponseAlert': {
    //   'ui:description': reportTypeValidationError,
    //   'ui:options': {
    //     hideIf: (formData, index, fullData) => {
    //       const data = fullData.events?.[index];
    //       return showConflictingAlert(data) === false;
    //     },
    //   },
    // },
    otherReports: checkboxGroupUI({
      title: reportTypesQuestion,
      hint: reportTypesHint,
      labels: OTHER_REPORT_TYPES,
      required: false,
    }),
    unlistedReport: textUI({
      title: otherReportTypesQuestion,
      description: otherReportTypesExamples,
    }),
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
    'ui:validations': [validateReportSelections],
  },
  schema: {
    type: 'object',
    properties: {
      // 'view:conflictingResponseAlert': {
      //   type: 'object',
      //   properties: {},
      // },
      otherReports: checkboxGroupSchema(Object.keys(OTHER_REPORT_TYPES)),
      unlistedReport: {
        type: 'string',
      },
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export const officialReportMst = {
  uiSchema: {
    ...arrayBuilderEventPageTitleUI({
      title: pageTitleWithTag,
      editTitle: 'official report details',
    }),
    'ui:description': officialReportsDescription('mst'),
    // 'view:conflictingResponseAlert': {
    //   'ui:description': reportTypeValidationError,
    //   'ui:options': {
    //     hideIf: (formData, index, fullData) => {
    //       const data = fullData.events?.[index];
    //       return showConflictingAlert(data) === false;
    //     },
    //   },
    // },
    militaryReports: checkboxGroupUI({
      title: reportTypesQuestion,
      hint: reportTypesHint,
      description: <h4>{OFFICIAL_REPORT_TYPES_SUBTITLES.military}</h4>,
      labels: MILITARY_REPORT_TYPES,
      required: false,
    }),
    otherReports: checkboxGroupUI({
      title: OFFICIAL_REPORT_TYPES_SUBTITLES.other,
      labelHeaderLevel: '4',
      labels: OTHER_REPORT_TYPES,
      required: false,
    }),
    unlistedReport: textUI({
      title: otherReportTypesQuestion,
      description: otherReportTypesExamples,
    }),
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
    'ui:validations': [validateReportSelections],
  },
  schema: {
    type: 'object',
    properties: {
      // 'view:conflictingResponseAlert': {
      //   type: 'object',
      //   properties: {},
      // },
      militaryReports: checkboxGroupSchema(Object.keys(MILITARY_REPORT_TYPES)),
      otherReports: checkboxGroupSchema(Object.keys(OTHER_REPORT_TYPES)),
      unlistedReport: {
        type: 'string',
      },
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
