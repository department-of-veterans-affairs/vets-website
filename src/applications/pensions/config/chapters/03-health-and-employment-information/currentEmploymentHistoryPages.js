import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  numberUI,
  numberSchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { isUnder65 } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

const showCurrentEmploymentHistoryPages = formData =>
  showMultiplePageResponse() && isUnder65(formData);

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'currentEmployers',
  nounSingular: 'current job',
  nounPlural: 'current jobs',
  required: false,
  isItemIncomplete: item => !item?.jobType || !item?.jobHoursWeek, // include all required fields here
  maxItems: 2,
  text: {
    getItemName: item => item?.jobType,
    summaryTitleWithoutItems: 'Current employment',
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingCurrentEmployment': arrayBuilderYesNoUI(options, {
      title: 'Are you currently employed?',
      labelHeaderLevel: ' ',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingCurrentEmployment': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingCurrentEmployment'],
  },
};

/** @returns {PageSchema} */
const currentEmploymentHistoryPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Current employment',
      nounSingular: options.nounSingular,
      hasMultipleItemPages: false,
    }),
    jobType: textUI('What kind of work do you currently do?'),
    jobHoursWeek: numberUI({
      title: 'How many hours per week do you work on average?',
      width: 'sm',
      min: 1,
      max: 168,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      jobType: textSchema,
      jobHoursWeek: numberSchema,
    },
    required: ['jobType', 'jobHoursWeek'],
  },
};

export const currentEmploymentHistoryPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    currentEmploymentHistorySummary: pageBuilder.summaryPage({
      title: 'Current employment',
      path: 'employment/current/summary',
      depends: formData => showCurrentEmploymentHistoryPages(formData),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    currentEmploymentHistoryPage: pageBuilder.itemPage({
      title: 'List of current employment',
      path: 'employment/current/:index/job',
      depends: formData => showCurrentEmploymentHistoryPages(formData),
      uiSchema: currentEmploymentHistoryPage.uiSchema,
      schema: currentEmploymentHistoryPage.schema,
    }),
  }),
);
