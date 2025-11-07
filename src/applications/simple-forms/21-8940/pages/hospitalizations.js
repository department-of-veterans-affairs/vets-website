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
  addressUI,
  addressSchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { formatDateRangeForCard } from '../helpers/dateFormatting';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'hospitalizations',
  nounSingular: 'hospitalization period',
  nounPlural: 'hospitalization periods',
  required: false, // Optional flow
  isItemIncomplete: item =>
    !item?.hospitalName || !item?.hospitalizationDateRange,
  maxItems: 5,
  text: {
    getItemName: item => item?.hospitalName,
    cardDescription: item =>
      formatDateRangeForCard(item?.hospitalizationDateRange),
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    ...titleUI('Recent hospitalizations'),
    'view:hasHospitalization': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title:
        'Were you hospitalized for your service-connected disabilities within the past 12 months?',
      hint:
        "If you say yes, you'll need to add at least one hospitalization period. You can add up to 5.",
      errorMessages: {
        required: 'Select if you were hospitalized within the past 12 months',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasHospitalization': arrayBuilderYesNoSchema,
    },
    required: ['view:hasHospitalization'],
  },
};

/** @returns {PageSchema} */
const nameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Hospital information',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    hospitalName: textUI({
      title: 'Hospital name',
      errorMessages: {
        required: 'Enter the name of the hospital',
      },
    }),
    hospitalAddress: addressUI({
      omit: ['street3'],
      labels: {
        street2: 'Apartment or unit number',
        militaryCheckbox:
          'The hospital is on a military base in the United States.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      hospitalName: textSchema,
      hospitalAddress: addressSchema({
        omit: ['street3'],
      }),
    },
    required: ['hospitalName', 'hospitalAddress'],
  },
};

/** @returns {PageSchema} */
const periodPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Hospitalization period'),
    hospitalizationDateRange: currentOrPastDateRangeUI(
      {
        title: 'Date you were hospitalized',
        errorMessages: {
          required: 'Enter the date you were hospitalized',
        },
      },
      {
        title: 'Date you left the hospital',
        errorMessages: {
          required: 'Enter the date you left the hospital',
        },
      },
      'Hospitalization end date must be after start date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      hospitalizationDateRange: currentOrPastDateRangeSchema,
    },
    required: ['hospitalizationDateRange'],
  },
};

export const hospitalizationsPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    hospitalizationsSummary: pageBuilder.summaryPage({
      title: 'Hospitalization information',
      path: 'hospitalizations-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    hospitalizationsNameAndAddress: pageBuilder.itemPage({
      title: 'Hospital information',
      path: 'hospitalizations/:index/name-and-address',
      uiSchema: nameAndAddressPage.uiSchema,
      schema: nameAndAddressPage.schema,
    }),
    hospitalizationsPeriod: pageBuilder.itemPage({
      title: 'Hospitalization period',
      path: 'hospitalizations/:index/period',
      uiSchema: periodPage.uiSchema,
      schema: periodPage.schema,
    }),
  }),
);
