import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'nounPluralReplaceMe',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: false,
  isItemIncomplete: item => !item?.name, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: (item, index, fullData) => item.name,
    cardDescription: item => `${formatReviewDate(item?.date)}`,
    summaryDescription: 'You can add up to 5 items',
  },
};

/**
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

export const nounPluralReplaceMePages = arrayBuilderPages( options,
  pageBuilder => ({
    nounPluralReplaceMeSummary: pageBuilder.summaryPage({
      title: 'Review your [noun plural]',
      path: 'noun-plural-replace-me-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: (formData) => {
        return formData['nickToggle'];
      },
    }),
    nounSingularReplaceMeNamePage: pageBuilder.itemPage({
      title: 'Name',
      path: 'noun-plural-replace-me/:index/name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
      depends: (formData) => {
        return formData['nickToggle'];
      },
    }),
    nounSingularReplaceMeDatePage: pageBuilder.itemPage({
      title: 'Date',
      path: 'noun-plural-replace-me/:index/date',
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
      depends: (formData) => {
        return formData['nickToggle'];
      },
    }),
  }),
);