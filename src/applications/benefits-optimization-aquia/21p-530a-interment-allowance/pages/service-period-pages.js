import React from 'react';

import { capitalize } from 'lodash';
import {
  titleUI,
  titleSchema,
  serviceBranchUI,
  arrayBuilderItemFirstPageTitleUI,
  serviceBranchSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemSubsequentPageTitleUI,
  textUI,
  textSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

const formatDate = dateStr => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Configuration for the veteran's service periods
 */
/** @type {ArrayBuilderOptions} */
const servicePeriodOptions = {
  arrayPath: 'periods',
  hint: '',
  nounSingular: 'service period',
  nounPlural: 'service periods',
  required: true,
  isItemIncomplete: item =>
    !item.serviceBranch &&
    !item.startDate &&
    !item.separationDate &&
    !item.entryLocation &&
    !item.separationLocation &&
    !item.gradeOrRank,
  text: {
    summaryTitle: "Review the Veteran's service periods",
    getItemName: item => `${capitalize(item?.serviceBranch)}`,
    cardDescription: item =>
      `Entry date (${formatDate(
        item?.startDate,
      )}) - Separation date (${formatDate(item?.separationDate)}}`,
  },
};

// Intro page
const servicePeriodIntroPage = {
  uiSchema: {
    ...titleUI(
      `Veteran's ${servicePeriodOptions.nounPlural}`,
      <>
        <p>
          In the next few questions, we’ll ask about the deceased Veteran’s
          service periods. You must add at least one{' '}
          {servicePeriodOptions.nounSingular}.{' '}
        </p>
        <p>You will need to provide the following:</p>
        <ul>
          <li>Branch of service</li>
          <li>Service start and end dates</li>
          <li>Service entry and separation locations</li>
          <li>Grade, rank, or rating</li>
        </ul>
      </>,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
    },
  },
};

// Service Branch Page
const serviceBranchPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Service branch',
      nounSingular: servicePeriodOptions.nounSingular,
    }),
    serviceBranch: serviceBranchUI(),
  },
  schema: {
    type: 'object',
    required: ['serviceBranch'],
    properties: {
      serviceBranch: serviceBranchSchema(),
    },
  },
};

// Service Dates Page
const serviceDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.serviceBranch ? `${formData.serviceBranch}` : 'Service Dates',
    ),
    startDate: currentOrPastDateUI('Service start date'),
    separationDate: currentOrPastDateUI('Service end date'),
  },
  schema: {
    type: 'object',
    required: ['startDate', 'separationDate'],
    properties: {
      startDate: currentOrPastDateSchema,
      separationDate: currentOrPastDateSchema,
    },
  },
};

// Service Locations and rank
const serviceLocationsAndRankPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Service Locations'),
    entryLocation: textUI('Place the Veteran entered active service'),
    separationLocation: textUI('Place the Veteran separated active service'),
    gradeOrRank: textUI('Grade, rank, or rating'),
  },
  schema: {
    type: 'object',
    required: ['entryLocation', 'separationLocation', 'gradeOrRank'],
    properties: {
      entryLocation: textSchema,
      separationLocation: textSchema,
      gradeOrRank: textSchema,
    },
  },
};

// Service Period Summary Page
const servicePeriodSummaryPage = {
  uiSchema: {
    'view:completedServicePeriods': arrayBuilderYesNoUI(servicePeriodOptions, {
      title: 'Do you have additional service periods to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedServicePeriods': arrayBuilderYesNoSchema,
    },
    required: ['view:completedServicePeriods'],
  },
};

export const servicePeriodsPages = arrayBuilderPages(
  servicePeriodOptions,
  pageBuilder => ({
    servicePeriodsIntro: pageBuilder.introPage({
      title: 'Service period introduction',
      path: 'service-period-introduction',
      uiSchema: servicePeriodIntroPage.uiSchema,
      schema: servicePeriodIntroPage.schema,
    }),
    servicePeriods: pageBuilder.summaryPage({
      path: 'service-periods',
      title: 'Service periods',
      uiSchema: servicePeriodSummaryPage.uiSchema,
      schema: servicePeriodSummaryPage.schema,
    }),
    serviceBranch: pageBuilder.itemPage({
      path: 'service-periods/:index/branch',
      title: 'Branch of service',
      uiSchema: serviceBranchPage.uiSchema,
      schema: serviceBranchPage.schema,
    }),
    serviceDates: pageBuilder.itemPage({
      path: 'service-periods/:index/dates',
      title: 'Service dates',
      uiSchema: serviceDatesPage.uiSchema,
      schema: serviceDatesPage.schema,
    }),
    locationsAndRank: pageBuilder.itemPage({
      path: 'service-periods/:index/locations-and-rank',
      title: 'Locations and rank',
      uiSchema: serviceLocationsAndRankPage.uiSchema,
      schema: serviceLocationsAndRankPage.schema,
    }),
  }),
);
