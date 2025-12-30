import { capitalize } from 'lodash';
import {
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
import DEFAULT_BRANCH_LABELS from 'platform/forms-system/src/js/web-component-patterns/content/serviceBranch.json';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { validateEndDateAfterStartDate } from '../utils/validationHelpers';

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
  required: false,
  isItemIncomplete: item =>
    !item.serviceBranch && !item.dateEnteredService && !item.dateLeftService,
  text: {
    summaryTitle: "Review the Veteran's service periods",
    getItemName: item =>
      item?.serviceBranch
        ? DEFAULT_BRANCH_LABELS[item.serviceBranch]?.label ||
          capitalize(item.serviceBranch)
        : '',
    cardDescription: item =>
      `Entry date (${formatDate(
        item?.dateEnteredService,
      )}) - Separation date (${formatDate(item?.dateLeftService)})`,
  },
};

// Service Branch Page
const serviceBranchPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Service branch',
      nounSingular: servicePeriodOptions.nounSingular,
    }),
    serviceBranch: serviceBranchUI({
      title: 'Branch of service',
      hint:
        'Start entering the Veteran’s branch of service. Then select the best option from the dropdown.',
    }),
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
        formData?.serviceBranch
          ? DEFAULT_BRANCH_LABELS[formData.serviceBranch]?.label ||
            capitalize(formData.serviceBranch)
          : 'Service Dates',
      undefined,
      false,
    ),
    dateEnteredService: currentOrPastDateUI('Service start date'),
    dateLeftService: {
      ...currentOrPastDateUI('Service end date'),
      'ui:validations': [
        (errors, fieldData, formData) => {
          validateEndDateAfterStartDate(
            errors,
            fieldData,
            formData,
            'dateEnteredService',
            'Please enter a service end date later than the service start date.',
          );
        },
      ],
    },
  },
  schema: {
    type: 'object',
    required: ['dateEnteredService', 'dateLeftService'],
    properties: {
      dateEnteredService: currentOrPastDateSchema,
      dateLeftService: currentOrPastDateSchema,
    },
  },
};

// Service Locations and rank
const serviceLocationsAndRankPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Service Locations'),
    placeEnteredService: textUI('Place the Veteran entered active service'),
    placeLeftService: textUI('Place the Veteran separated active service'),
    rankAtSeparation: textUI('Grade, rank, or rating'),
  },
  schema: {
    type: 'object',
    properties: {
      placeEnteredService: textSchema,
      placeLeftService: textSchema,
      rankAtSeparation: textSchema,
    },
  },
};

// Service Period Summary Page
const servicePeriodSummaryPage = {
  uiSchema: {
    'view:completedServicePeriods': arrayBuilderYesNoUI(
      servicePeriodOptions,
      {
        title: 'Do you have any Veteran service periods to add?',
        hint: `If you answer yes, you'll need to add at least one service period on the following pages.`,
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have another service period to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    ),
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
