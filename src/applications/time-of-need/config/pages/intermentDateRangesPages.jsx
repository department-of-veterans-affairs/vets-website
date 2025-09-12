import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  titleUI,
  radioUI,
  radioSchema,
  currentOrPastDateUI, // switched to memorable date (V3 <va-memorable-date>)
  currentOrPastDateSchema, // switched schema
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

// Array path in formData
const options = {
  arrayPath: 'desiredIntermentDateRanges',
  nounSingular: 'desired date and time range',
  nounPlural: 'desired date and time ranges',
  maxItems: 3,
  required: true,
  isItemIncomplete: item =>
    !item?.earliestDate || !item?.latestDate || !item?.timeRange,
  text: {
    getItemName: item => {
      if (!item) return null;
      const { earliestDate, latestDate, timeRange } = item;
      if (earliestDate && latestDate) {
        let tr = '';
        if (timeRange === 'am') {
          tr = ' (A.M.)';
        } else if (timeRange === 'pm') {
          tr = ' (P.M.)';
        }
        return `${earliestDate} – ${latestDate}${tr}`;
      }
      return null;
    },
    alertMaxItems:
      'You have added the maximum number of desired date and time ranges.',
    cancelAddTitle: () => 'Cancel adding this desired date and time range?',
    cancelAddNo: () => 'No, keep this',
    deleteTitle: () =>
      'Are you sure you want to remove this desired date and time range?',
    deleteDescription: () =>
      'This will remove this desired date and time range and all related information.',
    deleteNeedAtLeastOneDescription: () =>
      'If you remove this, you must add at least one desired date and time range for us to process this form.',
    deleteYes: () => 'Yes, remove this',
    deleteNo: () => 'No, keep this',
    cancelEditTitle: () => 'Cancel editing this desired date and time range?',
    cancelEditDescription: () =>
      'If you cancel, you’ll lose any changes you made on this screen and return to the desired date and time ranges review page.',
    cancelEditYes: () => 'Yes, cancel',
    cancelEditNo: () => 'No, keep this',
    summaryTitle: formData =>
      (formData?.desiredIntermentDateRanges?.length || 0) > 0
        ? 'Desired date and time range(s)'
        : 'Review desired date and time ranges',
  },
};

// Intro page
const introPage = {
  uiSchema: {
    ...titleUI(
      'Desired date and time range(s)',
      'In the next few questions, add each desired date and time range for the burial service. You can add up to 2.',
    ),
  },
  schema: { type: 'object', properties: {} },
};

// Summary (Yes/No) page
const summaryPage = {
  uiSchema: {
    'view:hasDesiredIntermentDateRanges': arrayBuilderYesNoUI(options, {
      title: 'Do you want to add a desired date and time range?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasDesiredIntermentDateRanges': arrayBuilderYesNoSchema,
    },
    required: ['view:hasDesiredIntermentDateRanges'],
  },
};

// Item page (single desired date range)
const itemPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Desired date and time range for burial service',
      description: (
        <>
          <AutoSaveNotice />
          <p>You can add up to two desired date and time ranges.</p>
        </>
      ),
      nounSingular: options.nounSingular,
    }),
    earliestDate: currentOrPastDateUI({
      title: 'Earliest date preferred',
      'ui:required': () => true,
      'ui:errorMessages': { required: 'Enter the earliest preferred date' },
    }),
    latestDate: currentOrPastDateUI({
      title: 'Latest date preferred',
      'ui:required': () => true,
      'ui:errorMessages': { required: 'Enter the latest preferred date' },
    }),
    timeRange: radioUI({
      title: 'Which time range do you prefer?',
      labels: {
        none: 'No preference',
        am: 'A.M.',
        pm: 'P.M.',
      },
      // required: true, // REMOVE boolean (was causing ui:required to be a boolean)
      // Rely on schema.required below OR use a function form:
      required: () => true,
      errorMessages: { required: 'Select a time range preference' },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      earliestDate: currentOrPastDateSchema,
      latestDate: currentOrPastDateSchema,
      timeRange: radioSchema(['none', 'am', 'pm']),
    },
    required: ['earliestDate', 'latestDate', 'timeRange'],
  },
};

// Optional validation to ensure earliest <= latest (simple lexical compare on digits)
itemPage.uiSchema.latestDate['ui:validations'] = [
  (errors, fieldData, formData, schema, uiSchema, index) => {
    const item = formData?.desiredIntermentDateRanges?.[index];
    const { earliestDate, latestDate } = item || {};
    if (earliestDate && latestDate) {
      const eTime = Date.parse(earliestDate);
      const lTime = Date.parse(latestDate);
      if (!Number.isNaN(eTime) && !Number.isNaN(lTime) && eTime > lTime) {
        errors.addError('Latest date must be on or after the earliest date.');
      }
    }
  },
];

export const intermentDateRangesPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    intermentDateRangesIntro: pageBuilder.introPage({
      title: 'Desired date and time ranges',
      path: 'interment-date-time-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    intermentDateRangesSummary: pageBuilder.summaryPage({
      title: 'Review desired date and time ranges',
      path: 'interment-date-time-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    intermentDateRangeItem: pageBuilder.itemPage({
      title: 'Desired date and time range',
      path: 'interment-date-time/:index/range',
      uiSchema: itemPage.uiSchema,
      schema: itemPage.schema,
    }),
  }),
);
