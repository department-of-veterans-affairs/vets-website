import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'nounPluralReplaceMe',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: true,
  isItemIncomplete: item => !item?.name, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: (item, _index, _fullData) => item.name,
    cardDescription: item => `${formatReviewDate(item?.date)}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Your ${options.nounPlural}`,
      `In the next few questions, we’ll ask you about your ${
        options.nounPlural
      }. You must add at least one ${
        options.nounSingular
      }. You may add up to 5 ${options.nounPlural}.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasNounPluralReplaceMe': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasNounPluralReplaceMe': arrayBuilderYesNoSchema,
    },
    required: ['view:hasNounPluralReplaceMe'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Name'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
    },
    required: ['name'],
  },
};

/** @returns {PageSchema} */
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => (formData?.name ? `Date at ${formData.name}` : 'Date'),
    ),
    date: currentOrPastDateUI(),
  },
  schema: {
    type: 'object',
    properties: {
      date: currentOrPastDateSchema,
    },
    required: ['date'],
  },
};

export const nounPluralReplaceMePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    nounPluralReplaceMe: pageBuilder.introPage({
      title: '[noun plural]',
      path: 'noun-plural-replace-me',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    nounPluralReplaceMeSummary: pageBuilder.summaryPage({
      title: 'Review your [noun plural]',
      path: 'noun-plural-replace-me-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    nounSingularReplaceMeNamePage: pageBuilder.itemPage({
      title: 'Name',
      path: 'noun-plural-replace-me/:index/name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    nounSingularReplaceMeDatePage: pageBuilder.itemPage({
      title: 'Date',
      path: 'noun-plural-replace-me/:index/date',
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
    }),
  }),
);
