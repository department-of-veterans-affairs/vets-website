// @ts-check
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { formatDateRangeForCard } from '../helpers/dateFormatting';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'medicalCareProviders',
  nounSingular: 'provider',
  nounPlural: 'providers',
  required: false, // Optional flow
  isItemIncomplete: item => !item?.providerName || !item?.treatmentDateRange,
  maxItems: 5,
  text: {
    getItemName: item => item?.providerName,
    cardDescription: item => formatDateRangeForCard(item?.treatmentDateRange),
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasMedicalCare': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title:
        'Have you visited a health care provider for your service-connected disabilities within the past 12 months?',
      hint:
        'If you say yes, you’ll need to add at least one provider. You can add up to 5.',
      labelHeaderLevel: '1',
      errorMessages: {
        required:
          'Select if you have been under medical care in the past 12 months',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasMedicalCare': arrayBuilderYesNoSchema,
    },
    required: ['view:hasMedicalCare'],
  },
};

/** @returns {PageSchema} */
const nameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Provider contact information',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    providerName: textUI({
      title: 'Provider name',
      errorMessages: {
        required: 'Enter the name of the provider',
      },
    }),
    providerAddress: addressUI({
      omit: ['street3'],
      labels: {
        street2: 'Apartment or unit number',
        militaryCheckbox:
          'The provider is on a military base in the United States.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      providerName: textSchema,
      providerAddress: addressSchema({
        omit: ['street3'],
      }),
    },
    required: ['providerName', 'providerAddress'],
  },
};

/** @returns {PageSchema} */
const treatmentPeriodPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Treatment period'),
    treatmentDateRange: currentOrPastDateRangeUI(
      {
        title: 'Treatment start date',
        errorMessages: {
          required: 'Enter the date treatment began',
        },
      },
      {
        title: 'Treatment end date',
        errorMessages: {
          required: 'Enter the date treatment ended',
        },
      },
      'Treatment end date must be after start date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      treatmentDateRange: currentOrPastDateRangeSchema,
    },
    required: ['treatmentDateRange'],
  },
};

export const medicalCareProvidersPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    medicalCareProvidersSummary: pageBuilder.summaryPage({
      title: 'Recent medical care',
      path: 'medical-care-providers-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    medicalCareProvidersNameAndAddress: pageBuilder.itemPage({
      title: 'Provider contact information',
      path: 'medical-care-providers/:index/name-and-address',
      uiSchema: nameAndAddressPage.uiSchema,
      schema: nameAndAddressPage.schema,
    }),
    medicalCareProvidersTreatmentPeriod: pageBuilder.itemPage({
      title: 'Treatment period',
      path: 'medical-care-providers/:index/treatment-period',
      uiSchema: treatmentPeriodPage.uiSchema,
      schema: treatmentPeriodPage.schema,
    }),
  }),
);
