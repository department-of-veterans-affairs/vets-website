import React from 'react';
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
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
    cardDescription: item => {
      const dateRange = `${formatReviewDate(
        item?.treatmentDates?.from,
      )} - ${formatReviewDate(item?.treatmentDates?.to)}`;
      const docs = item?.supportingDocuments || null;
      return (
        <>
          <span>Treatment dates: {dateRange}</span>
          {docs &&
            docs.length && (
              <>
                <div>Supporting files:</div>
                <ul>
                  {docs.map(doc => (
                    <li key={doc.name}>{doc.name}</li>
                  ))}
                </ul>
              </>
            )}
        </>
      );
    },
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Treatment records`,
      `In the next few questions, we’ll ask you about the treatm                                                                                                                                                                                                                                                                                                                                         nt records you’re requesting. You must add at least one treatment request. You may add up to ${
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
const supportingDocuments = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Supporting Documents'),
    supportingDocuments: fileInputMultipleUI({
      title: 'Imaging files',
      required: false,
      accept: '.png,.pdf,.txt,.jpg,.jpeg',
      hint: 'Upload a file that is between 1KB and 100MB',
      headerSize: '4',
      formNumber: '31-4159',
      skipUpload: true,
      maxFileSize: 1024 * 1024 * 100, // 100MB
      minFileSize: 1024, // 1KB
      errorMessages: {
        additionalInput: 'Choose a document type',
      },
      additionalInputRequired: true,
      additionalInput: () => {
        return (
          <VaSelect required label="Document type">
            <option value="xray">X-ray</option>
            <option value="mri">MRI</option>
            <option value="ct">CT Scan</option>
          </VaSelect>
        );
      },
      additionalInputUpdate: (instance, error, data) => {
        instance.setAttribute('error', error);
        if (data) {
          instance.setAttribute('value', data.documentType);
        }
      },
      handleAdditionalInput: e => {
        const { value } = e.detail;
        if (value === '') return null;
        return { documentType: e.detail.value };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: fileInputMultipleSchema(),
    },
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
    treatmentRecordsSupportingDocuments: pageBuilder.itemPage({
      title: 'Supporting Documents',
      path: 'treatment-records/:index/supporting-documents',
      uiSchema: supportingDocuments.uiSchema,
      schema: supportingDocuments.schema,
    }),
    treatmentRecordTreatmentDatesPage: pageBuilder.itemPage({
      title: 'Treatment dates',
      path: 'treatment-records/:index/treatment-dates',
      uiSchema: treatmentDatesPage.uiSchema,
      schema: treatmentDatesPage.schema,
    }),
  }),
);
