import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  titleUI,
  textUI,
  textSchema,
  textareaUI,
  textareaSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'treatmentRecords',
  nounSingular: 'treatment record',
  nounPlural: 'treatment records',
  required: true,
  isItemIncomplete: item =>
    !item?.name ||
    !item.address ||
    !item.conditionsTreated ||
    !item.treatmentDates,
  maxItems: 5,
  text: {
    getItemName: item => item?.name,
    cardDescription: item =>
      `${formatReviewDate(item?.treatmentDates?.from)} - ${formatReviewDate(
        item?.treatmentDates?.to,
      )}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Treatment records`,
      `In the next few questions, we’ll ask you about the treatment records you’re requesting. You must add at least one treatment request. You may add up to ${
        options.maxItems
      }.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const nameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name and address of treatment facility',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Name of private provider or hospital'),
    address: addressNoMilitaryUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      address: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
    required: ['name', 'address'],
  },
};

/** @returns {PageSchema} */
const conditionsTreatedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Conditions treated at ${formData.name}`
          : 'Conditions treated',
    ),
    conditionsTreated: textareaUI(
      'List the conditions the person received treatment for at this facility.',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      conditionsTreated: textareaSchema,
    },
    required: ['conditionsTreated'],
  },
};

/** @returns {PageSchema} */
const treatmentDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Treatment dates at ${formData.name}`
          : 'Treatment dates',
    ),
    treatmentDates: currentOrPastDateRangeUI(
      'First treatment date (you can estimate)',
      'Last treatment date (you can estimate)',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      treatmentDates: currentOrPastDateRangeSchema,
    },
    required: ['treatmentDates'],
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
    'view:hasTreatmentRecords': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasTreatmentRecords': arrayBuilderYesNoSchema,
    },
    required: ['view:hasTreatmentRecords'],
  },
};

export const treatmentRecordsPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    treatmentRecords: pageBuilder.introPage({
      title: 'Treatment records',
      path: 'treatment-records',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    treatmentRecordsSummary: pageBuilder.summaryPage({
      title: 'Review your treatment records',
      path: 'treatment-records-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    treatmentRecordNameAndAddressPage: pageBuilder.itemPage({
      title: 'Name and address of treatment facility',
      path: 'treatment-records/:index/name-and-address',
      uiSchema: nameAndAddressPage.uiSchema,
      schema: nameAndAddressPage.schema,
    }),
    treatmentRecordConditionsTreatedPage: pageBuilder.itemPage({
      title: 'Conditions treated',
      path: 'treatment-records/:index/conditions-treated',
      uiSchema: conditionsTreatedPage.uiSchema,
      schema: conditionsTreatedPage.schema,
    }),
    treatmentRecordTreatmentDatesPage: pageBuilder.itemPage({
      title: 'Treatment dates',
      path: 'treatment-records/:index/treatment-dates',
      uiSchema: treatmentDatesPage.uiSchema,
      schema: treatmentDatesPage.schema,
    }),
  }),
);
