import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: false,
  isItemIncomplete: item => !item?.name || !item.address || !item.dateRange,
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: item =>
      `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
        item?.dateRange?.to,
      )}`,
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasEmployers': arrayBuilderYesNoUI(
      options,
      {
        title:
          'Do you have any employment, including self-employment for the last 5 years to report?',
        hint:
          'Includes self-employment and military duty (including inactive duty for training).',
        labels: {
          Y: 'Yes, I have employment to report',
          N: 'No, I don’t have any employment to report',
        },
      },
      {
        title: 'Do you have another employer to report?',
        labels: {
          Y: 'Yes, I have another employment to report',
          N: 'No, I don’t have another employment to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployers': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployers'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name and address of employer or unit',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Name of employer'),
    address: addressNoMilitaryUI({
      omit: ['street2', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      address: addressNoMilitarySchema({
        omit: ['street2', 'street3'],
      }),
    },
    required: ['name', 'address'],
  },
};

/** @returns {PageSchema} */
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Dates you were employed at ${formData.name}`
          : 'Dates you were employed',
    ),
    dateRange: currentOrPastDateRangeUI(
      'Start date of employment',
      'End date of employment',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      dateRange: currentOrPastDateRangeSchema,
    },
    required: ['dateRange'],
  },
};

export const employersPages = arrayBuilderPages(options, pageBuilder => ({
  employersSummary: pageBuilder.summaryPage({
    title: 'Your employers',
    path: 'employers',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  employerNamePage: pageBuilder.itemPage({
    title: 'Name and address of employer or unit',
    path: 'employers/:index/name-and-address',
    uiSchema: namePage.uiSchema,
    schema: namePage.schema,
  }),
  employerDatePage: pageBuilder.itemPage({
    title: 'Dates you were employed',
    path: 'employers/:index/dates',
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
  }),
}));
