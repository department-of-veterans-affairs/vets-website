import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  titleUI,
  serviceBranchUI,
  serviceBranchSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

const TOGGLE_KEY = 'view:coeFormRebuildCveteam';

const options = {
  arrayPath: 'periodsOfService',
  nounSingular: 'service period',
  nounPlural: 'service periods',
  required: true,
  maxItems: 20,
  isItemIncomplete: item =>
    !item?.serviceBranch || !item?.dateRange?.from || !item?.dateRange?.to,
  text: {
    getItemName: item => item?.serviceBranch?.label || item?.serviceBranch,
    cardDescription: item =>
      `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
        item?.dateRange?.to,
      )}`,
  },
};

const introPage = {
  uiSchema: {
    ...titleUI(
      'Military information',
      <>
        <p>
          In the next few questions, we’ll ask you about your military service.
        </p>
        <p>You must add at least one service period.</p>
      </>,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

const summaryPage = {
  uiSchema: {
    'view:hasServicePeriods': arrayBuilderYesNoUI(
      options,
      {
        title: 'Do you have a service period to add?',
        labels: { Y: 'Yes', N: 'No' },
      },
      {
        title: 'Do you have another service period to add?',
        labels: { Y: 'Yes', N: 'No' },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasServicePeriods': arrayBuilderYesNoSchema,
    },
    required: ['view:hasServicePeriods'],
  },
};

const itemPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add service period',
      nounSingular: options.nounSingular,
      hasMultipleItemPages: false,
      showEditExplanationText: false,
    }),
    serviceBranch: serviceBranchUI({
      title: 'Branch of service',
      errorMessages: { required: 'Select a branch of service' },
    }),
    dateRange: currentOrPastDateRangeUI(
      { title: 'Service start date', removeDateHint: true },
      {
        title: 'Service end date',
        hint:
          "If you don't know the exact date or it hasn’t happened, enter your best guess",
        removeDateHint: true,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      serviceBranch: serviceBranchSchema(),
      dateRange: currentOrPastDateRangeSchema,
    },
    required: ['serviceBranch', 'dateRange'],
  },
};

export const servicePeriodsPages = arrayBuilderPages(options, pageBuilder => ({
  servicePeriodsIntro: pageBuilder.introPage({
    title: 'Military information',
    path: 'service-history-rebuild',
    depends: formData => formData?.[TOGGLE_KEY],
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  servicePeriodsSummary: pageBuilder.summaryPage({
    title: 'Review your service periods',
    path: 'service-history-rebuild-summary',
    depends: formData => formData?.[TOGGLE_KEY],
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  servicePeriodsItem: pageBuilder.itemPage({
    title: 'Add service period',
    path: 'service-history-rebuild/:index/service-period',
    depends: formData => formData?.[TOGGLE_KEY],
    uiSchema: itemPage.uiSchema,
    schema: itemPage.schema,
  }),
}));
