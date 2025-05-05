import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  numberUI,
  numberSchema,
  textUI,
  textSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { showMultiplePageResponse } from '../../../helpers';
import { isUnder65, doesNotHaveCurrentEmployers } from './helpers';

const showPreviousEmploymentHistoryPages = formData =>
  showMultiplePageResponse() &&
  isUnder65(formData) &&
  doesNotHaveCurrentEmployers(formData);

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'previousEmployers',
  nounSingular: 'previous job',
  nounPlural: 'previous jobs',
  required: true,
  isItemIncomplete: item =>
    !item?.jobType || !item?.jobHoursWeek || !item?.jobTitle, // include all required fields here
  maxItems: 4,
  text: {
    getItemName: item => item?.jobType,
    summaryTitleWithoutItems: 'Previous employment',
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Your ${options.nounPlural}`,
      `In the next few questions, we’ll ask you about your ${options.nounPlural}. You must add at least one ${options.nounSingular}. You may add up to 4 ${options.nounPlural}.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingPreviousEmployment': arrayBuilderYesNoUI(options, {
      labelHeaderLevel: ' ',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingPreviousEmployment': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingPreviousEmployment'],
  },
};

/** @returns {PageSchema} */
const previousEmploymentHistoryPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Previous employment',
      nounSingular: options.nounSingular,
      hasMultipleItemPages: false,
    }),
    jobDate: currentOrPastDateUI('When did you last work?'),
    jobType: textUI('What kind of work did you do?'),
    jobHoursWeek: numberUI({
      title: 'How many hours per week did you work on average?',
      width: 'sm',
      min: 1,
      max: 168,
    }),
    jobTitle: textUI('What was your job title?'),
  },
  schema: {
    type: 'object',
    properties: {
      jobDate: currentOrPastDateSchema,
      jobType: textSchema,
      jobHoursWeek: numberSchema,
      jobTitle: textSchema,
    },
    required: ['jobType', 'jobHoursWeek', 'jobTitle'],
  },
};

export const previousEmploymentHistoryPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    previousEmploymentHistoryIntro: pageBuilder.introPage({
      title: 'Previous employment',
      path: 'employment/previous/intro',
      depends: formData => showPreviousEmploymentHistoryPages(formData),
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    previousEmploymentHistorySummary: pageBuilder.summaryPage({
      title: 'Previous employment',
      path: 'employment/previous/summary',
      depends: formData => showPreviousEmploymentHistoryPages(formData),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    previousEmploymentHistoryPage: pageBuilder.itemPage({
      title: 'List of previous employment',
      path: 'employment/previous/:index/job',
      depends: formData => showPreviousEmploymentHistoryPages(formData),
      uiSchema: previousEmploymentHistoryPage.uiSchema,
      schema: previousEmploymentHistoryPage.schema,
    }),
  }),
);
