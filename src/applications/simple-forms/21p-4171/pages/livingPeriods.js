import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const livingPeriodsOptions = {
  arrayPath: 'living.periods',
  nounSingular: 'period',
  nounPlural: 'periods',
  required: false,
  maxItems: 10,
  isItemIncomplete: item =>
    !item?.dates?.from || !item?.dates?.to || !item?.cityOrTown || !item?.state,
  text: {
    getItemName: item => {
      const from = item?.dates?.from;
      const to = item?.dates?.to;
      if (!from || !to) return 'Unknown period';
      return `${from} to ${to}`;
    },
    cardDescription: item => {
      const city = item?.cityOrTown || 'Unknown city';
      const state = item?.state || '';
      return state ? `${city}, ${state}` : city;
    },
  },
};

export const livingPeriodsPages = arrayBuilderPages(
  livingPeriodsOptions,
  pageBuilder => ({
    livingPeriodsSummary: pageBuilder.summaryPage({
      title: 'Do you have another period when they lived together to add?',
      path: 'periods-summary',
      uiSchema: {
        'view:hasPeriods': arrayBuilderYesNoUI(livingPeriodsOptions, {
          title: 'Do you have another period when they lived together to add?',
          labels: {
            Y: 'Yes, I have another period to add',
            N: "No, I don't have another period to add",
          },
        }),
      },
      schema: {
        type: 'object',
        properties: {
          'view:hasPeriods': arrayBuilderYesNoSchema,
        },
        required: ['view:hasPeriods'],
      },
    }),
    livingPeriodDates: pageBuilder.itemPage({
      title: 'Living period - Dates',
      path: 'periods/:index/dates',
      uiSchema: {
        ...arrayBuilderItemFirstPageTitleUI({
          title: 'Living period - Dates',
          nounSingular: livingPeriodsOptions.nounSingular,
        }),
        dates: currentOrPastDateRangeUI('From date', 'To date'),
      },
      schema: {
        type: 'object',
        properties: {
          dates: currentOrPastDateRangeSchema,
        },
        required: ['dates'],
      },
    }),
    livingPeriodLocation: pageBuilder.itemPage({
      title: 'Living period - Location',
      path: 'periods/:index/location',
      uiSchema: {
        cityOrTown: textUI('City or town'),
        state: textUI('State'),
      },
      schema: {
        type: 'object',
        properties: {
          cityOrTown: {
            ...textSchema,
            maxLength: 100,
          },
          state: {
            ...textSchema,
            maxLength: 2,
          },
        },
        required: ['cityOrTown', 'state'],
      },
    }),
  }),
);
