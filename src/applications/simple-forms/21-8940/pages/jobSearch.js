// @ts-check
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  titleUI,
  textUI,
  textSchema,
  textareaUI,
  textareaSchema,
  addressUI,
  addressSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { formatDateLong } from 'platform/utilities/date';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'jobSearchEmployers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: false, // Optional flow
  isItemIncomplete: item => !item?.employerName || !item?.applicationDate,
  maxItems: 3,
  text: {
    getItemName: item => item?.employerName,
    cardDescription: item => {
      // @ts-ignore - applicationDate exists on the form data but not in type definition
      return item?.applicationDate
        ? `Applied on ${formatDateLong(item.applicationDate)}`
        : '';
    },
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    ...titleUI('Job search since disability'),
    'view:hasSearchedForJob': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title:
        'Have you searched for another job since your disability prevented you from working?',
      hint:
        'If you say yes, you’ll need to add at least one employer. You can add up to 3.',
      errorMessages: {
        required: 'You must select yes or no',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasSearchedForJob': arrayBuilderYesNoSchema,
    },
    required: ['view:hasSearchedForJob'],
  },
};

/** @returns {PageSchema} */
const employerContactInfoPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Contacted employer information',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    employerName: textUI({
      title: 'Employer name',
      errorMessages: {
        required: "Enter the employer's name",
      },
    }),
    employerAddress: addressUI({
      omit: ['street3'],
      labels: {
        street2: 'Apartment or unit number',
        militaryCheckbox:
          'The employer is on a military base in the United States.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employerName: textSchema,
      employerAddress: addressSchema({
        omit: ['street3'],
      }),
    },
    required: ['employerName', 'employerAddress'],
  },
};

/** @returns {PageSchema} */
const jobSearchDetailsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Application details for ${formData.employerName || 'employer'}`,
    ),
    workType: textareaUI({
      title: 'What type of work did you apply for?',
      errorMessages: {
        required: 'Enter the type of work you applied for',
      },
    }),
    applicationDate: currentOrPastDateUI({
      title: 'When did you apply?',
      errorMessages: {
        required: 'Enter the date you applied',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      workType: textareaSchema,
      applicationDate: currentOrPastDateSchema,
    },
    required: ['workType', 'applicationDate'],
  },
};

export const jobSearchPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    jobSearchSummary: pageBuilder.summaryPage({
      title: 'Job search history',
      path: 'job-search-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    jobSearchEmployerContactInfo: pageBuilder.itemPage({
      title: 'Contacted employer information',
      path: 'job-search-employers/:index/employer-contact-info',
      uiSchema: employerContactInfoPage.uiSchema,
      schema: employerContactInfoPage.schema,
    }),
    jobSearchDetails: pageBuilder.itemPage({
      title: 'Job search details',
      path: 'job-search-employers/:index/job-search-details',
      uiSchema: jobSearchDetailsPage.uiSchema,
      schema: jobSearchDetailsPage.schema,
    }),
  }),
);
