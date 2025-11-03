import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'items',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: false,
  isItemIncomplete: item => !item?.name, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: 'Item description',
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPageOne = {
  uiSchema: {
    'view:hasItems': arrayBuilderYesNoUI(
      options,
      {
        title: 'SUMMARY PAGE ONE - Initial question text?',
      },
      {
        title: 'SUMMARY PAGE ONE - Additional question text?',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasItems': arrayBuilderYesNoSchema,
    },
    required: ['view:hasItems'],
  },
};

const summaryPageTwo = {
  uiSchema: {
    'view:hasItems': arrayBuilderYesNoUI(
      options,
      {
        title: 'SUMMARY PAGE TWO - Initial question text?',
      },
      {
        title: 'SUMMARY PAGE TWO - Additional question text?',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasItems': arrayBuilderYesNoSchema,
    },
    required: ['view:hasItems'],
  },
};

/** @returns {PageSchema} */
const firstPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Item Information',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Item Name'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
    },
    required: ['name'],
  },
};

export const itemPages = arrayBuilderPages(options, pageBuilder => ({
  // More than one summaryPage defined but they are gated by `depends` so only one is ever shown
  // BUG: When summary page one is true and summary page two is false, after an item is added the
  // summary page two initial question text is improperly displayed instead of summary page one
  // additional question text
  itemsSummaryOne: pageBuilder.summaryPage({
    title: 'Review your [noun plural]',
    path: 'items-summary-one',
    depends: () => true,
    uiSchema: summaryPageOne.uiSchema,
    schema: summaryPageOne.schema,
  }),
  itemsSummaryTwo: pageBuilder.summaryPage({
    title: 'Review your [noun plural]',
    path: 'items-summary-two',
    depends: () => false,
    uiSchema: summaryPageTwo.uiSchema,
    schema: summaryPageTwo.schema,
  }),
  itemsFirstPage: pageBuilder.itemPage({
    title: 'Item information',
    path: 'items/:index/information',
    uiSchema: firstPage.uiSchema,
    schema: firstPage.schema,
  }),
}));
