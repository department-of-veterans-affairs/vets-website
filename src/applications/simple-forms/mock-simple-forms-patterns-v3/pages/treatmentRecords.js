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
  fileInputMultipleUI,
  fileInputMultipleSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
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
    !item.conditionsTreated?.length ||
    !item.treatmentDates,
  maxItems: 5,
  text: {
    getItemName: item => item?.name,
    cardDescription: item => {
      const dateRange = `${formatReviewDate(
        item?.treatmentDates?.from || '',
      )} - ${formatReviewDate(item?.treatmentDates?.to || '')}`;
      const docs = item?.supportingDocuments || null;
      const conditions = item?.conditionsTreated
        ?.filter(condition => (condition.name || '').trim())
        .map(condition => condition.name)
        .join(', ');
      return (
        <>
          <span>Treatment dates: {dateRange}</span>
          {conditions?.length > 0 && (
            <div>Conditions treated: {conditions}</div>
          )}
          {docs &&
            docs.length > 0 && (
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
    conditionsTreated: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          formData?.name
            ? `Conditions treated at ${formData.name}`
            : 'Conditions treated',
      ),
      'ui:description':
        'List the conditions the person received treatment for at this facility.',
      items: {
        ...arrayBuilderItemSubsequentPageTitleUI('Condition treated'),
        name: {
          ...textUI(
            'List a condition the person received treatment for at this facility.',
          ),
        },
        releaseInfo: yesNoUI(
          'Can we release information about this condition?',
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionsTreated: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: textSchema,
            releaseInfo: yesNoSchema,
          },
          required: ['name', 'releaseInfo'],
        },
      },
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
      hint: 'Upload a file that is between 1B and 100MB',
      headerSize: '4',
      formNumber: '31-4159',
      skipUpload: true,
      maxFileSize: 1024 * 1024 * 100, // 100MB
      minFileSize: 1, // 1B
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
      // initialData: {
      //   treatmentRecords: [
      //     {
      //       name: 'Sample Hospital',
      //       address: {
      //         street: '123 Main St',
      //         city: 'Anytown',
      //         state: 'VA',
      //         postalCode: '12345',
      //         country: 'USA',
      //       },
      //       conditionsTreated: [
      //         { name: 'Condition A', releaseInfo: true },
      //         { name: 'Condition B' },
      //         {},
      //       ],
      //       treatmentDates: {
      //         from: '2020-01-01',
      //         to: '2020-06-01',
      //       },
      //       supportingDocuments: [
      //         { name: 'xray1.pdf' },
      //         { name: 'mri_scan.jpg' },
      //       ],
      //     },
      //   ],
      // },
    }),
    treatmentRecordNameAndAddressPage: pageBuilder.itemPage({
      title: 'Name and address of treatment facility',
      path: 'treatment-records/:index/name-and-address',
      uiSchema: nameAndAddressPage.uiSchema,
      schema: nameAndAddressPage.schema,
    }),

    /** ********************************
     * The conditions treated page is an example of a nested array page, where
     * we start with an outer array of treatment records, and an inner (nested)
     * array of conditions treated for each treatment record. This page allows
     * the user to add multiple conditions treated for each treatment record.
     ********************************* */
    treatmentRecordConditionsTreatedPage: pageBuilder.internalLoopPage({
      title: 'Treated condition',
      path: 'treatment-records/:index/conditions-treated',

      // Nested options similar to ArrayBuilderOptions
      nestedArrayOptions: {
        // Include the parent arrayPath and nested arrayPath here. This method
        // only allows a nesting depth of one level. We're not using arrayPath
        // here because the outer arrayPath interferes with the inner option
        arrayPathKeys: ['treatmentRecords', 'conditionsTreated'],

        nounSingular: 'treated condition',
        nounPlural: 'treated conditions',
        required: () => true,

        // If true, the default yes/no radio is replaced with a link
        useLinkInsteadOfYesNo: false,

        // itemName: 'treated condition',
        isItemIncomplete: item =>
          !item?.name || typeof item?.releaseInfo !== 'boolean',

        maxItems: () => 4, // (formData, schema) => 3,

        text: {
          getItemName: item => item?.name,
          // Added to override cardDescription from treatmentRecords options
          cardDescription: item =>
            typeof item.releaseInfo === 'boolean' &&
            `${
              item?.releaseInfo ? 'Authorized' : 'Not authorized'
            } to release information`,
        },
      },
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
